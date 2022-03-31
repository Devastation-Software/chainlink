const Discord = require("discord.js");
const DJSBuilders = require("@discordjs/builders");

module.exports = {
    perms: {
        bot: ["EMBED_LINKS", "SEND_MESSAGES"], user: ["MANAGE_GUILD"],
    }, data: new DJSBuilders.SlashCommandBuilder()
        .setName("verify")
        .setDescription("Allows you to complete the two ends of the bridge.")
        .addStringOption((option) => option
            .setName("code")
            .setDescription("The code you received from the other end.")
            .setRequired(true)),
    async execute(interaction, client) {
        const code = interaction.options.getString("code");

        let embed = new DJSBuilders.Embed()
            .setColor(39423)
            .setTitle("Checking your code...")
            .setDescription(`I am checking the code you provided. Please wait.`);

        let pendingBridgeID = client.bridges.getBridgeByCode(code);
        let pendingBridge = client.bridges.findBridgesByUUID(pendingBridgeID)[0];

        await interaction.deferReply();

        const curPage = await interaction.editReply({
            embeds: [embed],
        });

        if (!pendingBridge) {
            embed.setTitle("Bridge verification failed!");
            embed.setDescription(`I couldn't find a bridge with that code. Please try again and make sure you typed it correctly.`);
            embed.setColor(16711680);
        } else {
            let endpointGID;
            if (pendingBridge.type === "channel") {
                let endpointChannel = await client.channels.fetch(pendingBridge.endpoint);
                endpointGID = endpointChannel.guild.id;
            } else {
                endpointGID = pendingBridge.endpoint;
            }
            console.log(endpointGID)
            if (pendingBridge.verified) {
                embed.setTitle("Bridge verification failed!");
                embed.setDescription(`That bridge has already been verified.`);
                embed.setColor(16711680);
            } else if (endpointGID !== interaction.guildId) {
                embed.setTitle("Bridge verification failed!");
                embed.setDescription(`That bridge is not in this server.`);
                embed.setColor(16711680);
            } else {
                client.bridges.verifyBridge(pendingBridge.uuid);
                embed.setTitle("Bridge verification successful!");
                embed.setDescription(`The bridge is complete!`);
                embed.addFields({
                    name: "Bridge ID", value: pendingBridgeID,
                }, {
                    name: "Endpoint", value: type === "channel" ? `<#${pendingBridge.endpoint}>` : `<${pendingBridge.endpoint}>`,
                });
                embed.setFooter({
                    text: `Created by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
                embed.setColor(65348);
            }
        }

        await curPage.edit({
            embeds: [embed],
        });

    },
};
