const DJSBuilders = require("@discordjs/builders");

const fs = require("fs");

module.exports = {
  perms: {
    bot: ["EMBED_LINKS", "SEND_MESSAGES"],
    user: []
  },
  data: new DJSBuilders.SlashCommandBuilder()
    .setName("stats")
    .setDescription("Displays statistics for the bot."),
  async execute(interaction, client) {
     await interaction.reply("WIP!");
     return;
  },
};
