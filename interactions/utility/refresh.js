const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
  perms: {
    bot: ["EMBED_LINKS", "SEND_MESSAGES"],
    user: ["MANAGE_GUILD"],
  },
  data: new SlashCommandBuilder()
    .setName("refresh")
    .setDescription(
      "Refreshes the list of slash commands that your server can use."
    ),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has("MANAGE_SERVER"))
      return interaction.reply(
        "You don't have permission to use that command."
      );
    let commandsList = client.commandsList;
    let commands = "";
    commandsList.forEach((command) => {
      commands +=
        "`/" + command["name"] + "`: " + command["description"] + "\n";
    });
    let update = await client.utils.confirm(
      interaction,
      "Refresh Slash Commands",
      "Do you want to refresh the slash commands for this server? The following slash commands will be refreshed and/or added:\n" +
        commands,
      "Successfully deployed slash commands to the server!",
      "Canceled deploying slash commands to the server."
    );
    if (update) {
      client.utils.deploy.deployGuild(commandsList, interaction.guild);
    }
  },
};
