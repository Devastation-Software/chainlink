const Discord = require("discord.js"),
  fs = require("fs");

module.exports = async (interaction) => {
  console.log(interaction);
  console.log("An interaction was used...");
  let client = interaction.client;

  if (!interaction.isCommand()) return;

  const command = client.interactions.get(interaction.commandName);

  if (!command) return;
  const options = interaction.options;
  try {
    await command.execute(interaction, client, options);
  } catch (err) {
    console.error(err);
    interaction.reply(
      "An unexpected error has occurred. Please take a screenshot and send it to the support server!\n```" +
        err.stack +
        "```",
      { ephemeral: true }
    );
  }
};
