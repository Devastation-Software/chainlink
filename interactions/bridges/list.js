const Discord = require("discord.js");
const DJSBuilders = require("@discordjs/builders");


module.exports = {
  perms: {
    bot: ["EMBED_LINKS", "SEND_MESSAGES"], user: ["MANAGE_GUILD"],
  }, data: new DJSBuilders.SlashCommandBuilder()
    .setName("list")
    .setDescription("Lists all the bridges by filter.")
    .addStringOption((option) => option
      .setName("type")
      .setDescription("The bridges found in the ______.")
      .addChoice("Channel", "channel")
      .addChoice("Server", "server")
      .setRequired(true)
    ),
  async execute(interaction, client) {
    let type = interaction.options.getString("type");

    let bridges;
    if (type === "server") {
      bridges = client.utils.bridges.findBridgesByGuild(interaction.guild.id);
    } else {
      bridges = client.utils.bridges.findBridgesByChannel(interaction.channel.id);
    }

    let embed = new DJSBuilders.Embed()
      .setTitle(`Bridge List`)
      .setDescription(`${bridges.length} bridges found.`)
      .setColor(client.brandColor);

    for (let bridge of bridges) {
      let bridgeValue;
      if (bridge.type === "server") {
        let thisServer = await client.guilds.fetch(bridge.guild);
        let thatServer = await client.guilds.fetch(bridge.endpoint);
      } else {
        let thisChannel = await client.channels.fetch(bridge.channel);
        let thatChannel = await client.channels.fetch(bridge.endpoint);
        if (thisChannel.guild.id === thatChannel.guild.id) {
          // Can render both channels as channel mentions.
          bridgeValue = `${thisChannel} ➡️ ${thatChannel}`;
        } else {
          // Only render first channel name since other one will appear as #deleted-channel.
          bridgeValue = `${thisChannel.name} ➡️ #${thatChannel.guild.name}`;
        }
      }
      embed.addField({
        name: `${bridge.uuid}`,
        value: bridgeValue,
      });
    }


  },
};
