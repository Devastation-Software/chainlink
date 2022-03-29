const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
  perms: {
    bot: ["EMBED_LINKS", "SEND_MESSAGES"],
    user: ["MANAGE_GUILD"],
  },
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription(
      "Allows you to create a bridge between two channels, servers, or whatnot."
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("What types of endpoints to link")
        .setRequired(true)
        .addChoice("Channel", "channel")
        .addChoice("Server", "server")
    )
    .addStringOption((option) =>
      option
        .setName("direction")
        .setDescription("In what direction should the messages be proxied?")
        .setRequired(true)
        .addChoice("Both directions", "both")
        .addChoice("There to here", "here")
        .addChoice("Here to there", "there")
    )
    .addStringOption((option) =>
      option
        .setName("endpoint")
        .setDescription("Please provide the snowflake (ID) of the other channel or server you want to link.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has("MANAGE_SERVER")) {
      return interaction.reply(
        "You don't have permission to use that command."
      );
    }
  },
};
