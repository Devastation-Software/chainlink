const Discord = require("discord.js");
const DJSBuilders = require("@discordjs/builders");


module.exports = {
    perms: {
        bot: ["EMBED_LINKS", "SEND_MESSAGES"], user: ["MANAGE_GUILD"],
    }, data: new DJSBuilders.SlashCommandBuilder()
        .setName("create")
        .setDescription("Allows you to create a bridge between two channels, servers, or whatnot.")
        .addStringOption((option) => option
            .setName("type")
            .setDescription("What types of endpoints to link")
            .setRequired(true)
            .addChoice("Channel", "channel")
            .addChoice("Server", "server"))
        .addStringOption((option) => option
            .setName("direction")
            .setDescription("In what direction should the messages be proxied?")
            .setRequired(true)
            .addChoice("Both directions", "both")
            .addChoice("There to here", "here")
            .addChoice("Here to there", "there"))
        .addStringOption((option) => option
            .setName("endpoint")
            .setDescription("Please provide the snowflake (ID) of the other channel or server you want to link.")
            .setRequired(true)), async execute(interaction, client) {
        const type = interaction.options.getString("type");
        const direction = interaction.options.getString("direction");
        const endpoint = interaction.options.getString("endpoint");

        const channel = interaction.channelId;
        const guild = interaction.guildId;

        let embed = new DJSBuilders.Embed()
            .setColor(39423)
            .setTitle("Creating a new bridge...")
            .setDescription(`Please wait while I create a new bridge between ${type === "channel" ? "channels" : "servers"}.`)

        await interaction.deferReply();

        const curPage = await interaction.editReply({
            embeds: [embed],
        });

        // Check if the bot is in the endpoint server
        let endpointGuildId;
        try {
            if (type === "channel") {
                let endpointChannel = await client.channels.fetch(endpoint);
                endpointGuildId = endpointChannel.guild.id;
            } else {
                endpointGuildId = await client.guilds.fetch(endpoint);
            }
            if (!endpointGuildId) {
                embed.setTitle("Bridge creation failed!");
                embed.setDescription(`Please invite me to the endpoint server and try again.`);
                embed.setColor(16711680);
                await curPage.edit({
                    embeds: [embed],
                });
                return;
            }
        } catch {
            embed.setTitle("Bridge creation failed!");
            embed.setDescription(`Please invite me to the endpoint server and try again.`);
            embed.setColor(16711680);
            await curPage.edit({
                embeds: [embed],
            });
            return;
        }


        const bridge = client.utils.bridges.create(type, direction, endpoint, guild, channel);

        // If the bridge's two endpoints are in the same server, there's no need to request verification.
        if ((type === "channel" && guild === client.channels.cache.get(endpoint).guild.id) || (type === "server" && guild === client.guilds.cache.get(endpoint).id)) {
            if (bridge) {
                client.utils.bridges.verifyBridge(bridge);
                embed.setTitle("Bridge created!");
                embed.setDescription(`A new bridge has been created between ${type === "channel" ? "channels" : "servers"}.`);
                embed.addFields({
                    name: "Bridge ID", value: bridge,
                }, {
                    name: "Bridge", value: client.utils.bridges.bridgeToString(client, bridge),
                });
                embed.setFooter({
                    text: `Created by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                });
                embed.setColor(65348);
            } else {
                embed.setTitle("Bridge creation failed!");
                embed.setDescription(`I was unable to create a new bridge between ${type === "channel" ? "channels" : "servers"}.`);
                embed.setColor(16711680);
            }

        } else {
            if (bridge) {
                // Tell the user to verify the bridge, and generate a code to send them.
                const code = client.utils.bridges.createCode(bridge);
                embed.setTitle("Bridge pending...");
                embed.setDescription("The bridge has been created, but you need to verify it before it can be used.\n\n" +
                    `Please use /verify in the other server with the following code: \`${code}\``);
                embed.setColor(15658530);
            } else {
                embed.setTitle("Bridge creation failed!");
                embed.setDescription(`I was unable to create a new bridge between ${type === "channel" ? "channels" : "servers"}.`);
                embed.setColor(16711680);
            }
        }
        await curPage.edit({embeds: [embed]});
    },
};
