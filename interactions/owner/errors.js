const DJSBuilders = require("@discordjs/builders");

const fs = require("fs");

module.exports = {
  perms: {
    bot: ["EMBED_LINKS", "SEND_MESSAGES"],
    user: [],
    ownerOnly: true
  },
  data: new DJSBuilders.SlashCommandBuilder()
    .setName("errors")
    .setDescription("Allows the owner to see errors that might have fired during command usage.")
    .addStringOption((option) => option
      .setName("id")
      .setDescription("An optional error ID to specifically view. Otherwise views the first 250.")),
  async execute(interaction, client) {
    let errorId = interaction.options.getString('id');
    if (!errorId) {
      if (client.utils.errors.count() < 1) {
        return interaction.message.channel.send("There are no errors to view.");
      } else {
        if (client.utils.errors.count() < 25) {
          // One page embed, no need for paginator
          const embed = new DJSBuilders.Embed()
            .setColor(client.brandColor)
            .setTitle("Errors")
            .setDescription(`There are currently ${client.utils.errors.count()} errors logged.`);
          client.utils.errors.loadAll().forEach((error, index) => {
            embed.addField({
              name: error.id,
              value: "`" +error.error + "`",
            });
          });
        } else {
          // Multiple pages, split into 25 error fields per page
          let embeds = [];
          for (let i = 0; i < Math.ceil(client.utils.errors.count() / 25); i++) {
            const embed = new DJSBuilders.Embed()
              .setColor(client.brandColor)
              .setTitle("Errors")
              .setDescription(`There are currently ${client.utils.errors.count()} errors logged.`);
            for (let j = 0; j < 25; j++) {
              const index = (i * 25) + j;
              if (index >= client.utils.errors.count()) {
                break;
              }
              const error = client.utils.errors.get(index);
              embed.addField({
                name: error.id,
                value: "`" +error.error + "`",
              });
            }
            embeds.push(embed);
          }

          // Create the paginator
          client.utils.paginator(interaction, embeds);
        }
      }
    } else {
      const error = client.utils.errors.loadByErrorId(errorId);
      if (!error) {
        await interaction.reply("That error ID does not exist.");
        return;
      }
      const embed = new DJSBuilders.Embed()
        .setColor(client.brandColor)
        .setTitle("Error")
        .addField({
          name: "ID",
          value: error.id,
        })
        .addField({
          name: "Created at",
          value: client.utils.time.fullTimestamp(error.date),
        })
        .addField({
          name: "Error",
          value: "`" +error.error + "`",
        })
        .addField({
          name: "Stacktrace",
          value: "```" + error.stack + "```",
        });
      await interaction.reply({ embeds: [embed] });
    }
  }
};
