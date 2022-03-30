const Discord = require("discord.js");
const DJSBuilders = require("@discordjs/builders");


module.exports = {
  perms: {
    bot: ["EMBED_LINKS", "SEND_MESSAGES"],
    user: ["MANAGE_GUILD"],
  },
  data: new DJSBuilders.SlashCommandBuilder()
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
    const type = interaction.options.getString("type");
    const direction = interaction.options.getString("direction");
    const endpoint = interaction.options.getString("endpoint");

    const channel = interaction.channelId;
    const guild = interaction.guildId;

    const embed = new DJSBuilders.Embed()
      .setColor(39423)
      .setTitle("Creating a new bridge...")
      .setDescription(
        `Please wait while I create a new bridge between ${
          type === "channel" ? "channels" : "servers"
        }.`
      )

    const reply = await interaction.reply({ embeds: [embed]});

    const bridge = await client.bridge.create(
      type,
      direction,
      endpoint,
      guild,
      channel
    );

    if (bridge) {
      embed.setTitle("Bridge created!");
      embed.setDescription(
        `A new bridge has been created between ${
          type === "channel" ? "channels" : "servers"
        }.`
      );
      embed.addField(
        "Bridge ID",
        `${bridge.id}`,
        true
      );
      embed.addField(
        "Endpoint",
        `${type === "channel" ? "Channel" : "Server"}: ${
          type === "channel" ? bridge.channel.name : bridge.server.name
        }`,
        true
      );
      embed.addField(
        "Direction",
        `${direction === "both" ? "Both directions" : direction}`,
        true
      );
      embed.setFooter(
        `Created by ${client.user.tag}`,
        client.user.displayAvatarURL()
      );
      embed.setColor(65348);
    } else {
      embed.setTitle("Bridge creation failed!");
      embed.setDescription(
        `I was unable to create a new bridge between ${
          type === "channel" ? "channels" : "servers"
        }.`
      );
      embed.setColor(16711680);
    }

    await reply.edit({ embeds: [embed]});
  },
};
