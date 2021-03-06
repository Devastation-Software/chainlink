const Discord = require("discord.js");

const DJSBuilders = require("@discordjs/builders");

const fs = require("fs");

module.exports = {
    perms: {
        bot: ["EMBED_LINKS", "SEND_MESSAGES"],
        user: []
    },
    data: new DJSBuilders.SlashCommandBuilder()
        .setName("invite")
        .setDescription("Sends an invite link to the bot."),
    async execute(interaction, client) {
        let embed = new DJSBuilders.Embed()
            .setTitle("Invite me")
            .setDescription(`[Click here](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8) to invite me to your server.`)
            .setColor(client.brandColor);

        await interaction.reply({ embeds: [embed] });
    },
};
