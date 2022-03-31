const Discord = require("discord.js"),
  fs = require("fs");

module.exports = async (interaction) => {
  let client = interaction.client;

  if (!interaction.isCommand()) return;

  const command = client.interactions.get(interaction.commandName);

  if (!command) return;
  const options = interaction.options;

  command.perms.bot.forEach(perm => {
    let clientMember = client.guilds.cache.get(interaction.guild.id).members.cache.get(client.user.id);
    if (!clientMember.hasPermission(perm)) {
      return interaction.reply("❌ I don't have the permission to do that! I need the  `" + perm + "` permission.");
    }
  });

  // Owner only command check
  if (command.perms.ownerOnly && ((interaction.author.id !== client.config.ownerID) && (client.config.testers.indexOf(interaction.author.id) === -1))) {
    return interaction.reply("❌ That's an owner only command!");
  }

  // If the user is bot owner bypass all permission checks
  if ((interaction.author.id !== client.config.ownerID) && (client.config.testers.indexOf(interaction.author.id) === -1)) {
    // Do nothing, bypass all permission checks
  } else {
    command.perms.user.forEach(perm => {
      if (!interaction.member.permissions.has(perm)) return interaction.reply("❌ You don't have the permission to do that!");
    });
  }

  try {
    await command.execute(interaction, client, options);
  } catch (err) {
    console.error(err);
    let errorId = client.error.write(err)
    interaction.reply({
      "content": "⚠️ An error occurred while executing that command! Please report this to the bot owner, with this error ID: `" + errorId + "`",
    });
  }
};
