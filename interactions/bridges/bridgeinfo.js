const Discord = require("discord.js");
const DJSBuilders = require("@discordjs/builders");

module.exports = {
  perms: {
    bot: ["EMBED_LINKS", "SEND_MESSAGES"], user: ["MANAGE_GUILD"],
  }, data: new DJSBuilders.SlashCommandBuilder()
    .setName("bridgeinfo")
    .setDescription("Display all information about a bridge.")
    .addStringOption((option) => option
      .setName("id")
      .setDescription("The bridge UUID to display.")
      .setRequired(true)
    ),
  async execute(interaction, client) {
    let id = interaction.options.getString("id");

    let bridge = client.utils.bridges.findBridgesByUUID(id)[0];

    if (!bridge) {
      myEmbed.setTitle("Bridge not found.");
      myEmbed.setDescription(`I couldn't find a bridge with the ID of \`${id}\`.`);
      myEmbed.setColor(client.colors.error);
      await interaction.reply({ embeds: [myEmbed] });
      return;
    } else {
      let bridgeString = client.utils.bridges.bridgeToString(client, bridge);
      let embed = new DJSBuilders.Embed()
        .setTitle(`Info for bridge ${bridge.uuid}`)
        .setDescription(bridgeString)
        .setColor(client.brandColor)
        .addField({
          name: "Type",
          value: "`" + bridge.type + "`",
        })
        .addField({
          name: "Direction",
          value: "`" + bridge.direction + "`",
        })
        .addField({
          name: "Config object",
          value: "```json\n" + JSON.stringify(bridge.config, null, 4) + "```",
        })
        .addFooter({
          text: "Requested by " + interaction.user.tag,
          iconURL: interaction.user.avatarURL(),
        });

      await interaction.reply({ embeds: [embed] });
    }
  },
};
