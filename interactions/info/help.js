const Discord = require("discord.js");

const { SlashCommandBuilder, Embed } = require("@discordjs/builders");

const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Returns help for the bot."),
  async execute(interaction, client) {
    let embeds = [];

    client.modules.forEach((c) => {
      files = fs.readdirSync(`./interactions/${c}/`);
      let dString = "";
      files.forEach((f) => {
        interaction1 = require(`../../interactions/${c}/${f}`);
        data = interaction1.data.toJSON();
        dString += "`/" + data.name + "`" + ": " + data.description + "\n";
      });
      embeds.push(
        new Discord.MessageEmbed()
          .setTitle("Help for " + c + " module")
          .setDescription(dString)
          .setColor(client.brandColor)
      );
    });

    client.utils.paginator(interaction, embeds);
  },
};
