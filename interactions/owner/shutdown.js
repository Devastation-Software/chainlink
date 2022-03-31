const DJSBuilders = require("@discordjs/builders");

const fs = require("fs");

module.exports = {
  perms: {
    bot: ["SEND_MESSAGES"],
    user: [],
    ownerOnly: true
  },
  data: new DJSBuilders.SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Shuts down the entire bot in case of emergency."),
  async execute(interaction, client) {
    await interaction.reply("Goodbye!");
    process.exit(1);
  }
};
