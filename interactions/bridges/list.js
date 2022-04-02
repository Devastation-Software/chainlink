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

    let myEmbed = new DJSBuilders.Embed()
      .setColor(39423)
      .setTitle("Fetching bridge list...")
      .setDescription(`Please wait while I fetch the bridge list for you.`);

    await interaction.deferReply();

    const curPage = await interaction.editReply({
      embeds: [myEmbed],
    });

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
      embed.addField({
        name: `${bridge.uuid}`,
        value: client.utils.bridges.bridgeToString(client, bridge),
      });
    }

    await curPage.edit({
      embeds: [embed],
    });
  },
};
