const Discord = require("discord.js");
const DJSBuilders = require("@discordjs/builders");


module.exports = {
  perms: {
    bot: ["EMBED_LINKS", "SEND_MESSAGES"], user: ["MANAGE_GUILD"],
  }, data: new DJSBuilders.SlashCommandBuilder()
    .setName("delete")
    .setDescription("Lists all the bridges by filter.")
    .addStringOption((option) => option
      .setName("id")
      .setDescription("The bridge UUID to delete.")
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
      let update = await client.utils.confirm(
        interaction,
        "Delete bridge?",
        "Do you really want to delete the bridge from " + client.utils.bridges.bridgeToString(client, bridge) + "? This action cannot be undone.",
        "Successfully deleted bridge. " + client.utils.bridges.bridgeToString(client, bridge).replace("➡️", "⏹️").replace("⬅️", "⏹️").replace("↔️", "⏹️") + " is no longer bridged.",
        "Canceled deletion. Nothing has changed."
      );
      if (update) {
        client.utils.bridges.deleteBridge(id);
      }
    }
  },
};
