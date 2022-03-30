const Discord = require("discord.js"),
  fs = require("fs");

module.exports = async (interaction) => {
  let client = interaction.client;

  if (!interaction.isCommand()) return;

  const command = client.interactions.get(interaction.commandName);

  if (!command) return;
  const options = interaction.options;

  command.perms.bot.forEach(perm => {
    let clientMember = client.guilds.get(interaction.guild.id).members.get(client.user.id);
    if (!clientMember.hasPermission(perm)) {
      return interaction.reply("❌ I don't have the permission to do that! I need the  `" + perm + "` permission.");
    }
  });

  command.perms.user.forEach(perm => {
    if (!interaction.member.permissions.has(perm)) return interaction.reply("❌ You don't have the permission to do that!");
  });

  try {
    await command.execute(interaction, client, options);
  } catch (err) {
    console.error(err);
    interaction.reply(
      "⚠️ An unexpected error has occurred. Please take a screenshot and send it to the support server!\n```" +
        err.stack +
        "```",
      { ephemeral: true }
    );
  }
};
