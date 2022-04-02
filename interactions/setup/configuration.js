const Discord = require("discord.js");
const DJSBuilders = require("@discordjs/builders");

module.exports = {
  perms: {
    bot: ["EMBED_LINKS", "SEND_MESSAGES"], user: ["MANAGE_GUILD"],
  }, data: new DJSBuilders.SlashCommandBuilder()
    .setName("configuration")
    .setDescription("Allows you to edit individual settings for a bridge.")
    .addSubcommand(subcommand =>
      subcommand
        .setName('reset')
        .setDescription('Completely reset your bridge configuration.')
        .addStringOption(option =>
          option
            .setName('id')
            .setDescription('The ID of the bridge to reset.')
            .setRequired(true)
        ))
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set a configuration option for a bridge.')
        .addStringOption(option =>
          option
            .setName('id')
            .setDescription('The ID of the bridge to set.')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('key')
            .setDescription('The key of the configuration option to set.')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('value')
            .setDescription('The value to set the configuration option to.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('get')
        .setDescription('Get a configuration option for a bridge.')
        .addStringOption(option =>
          option
            .setName('id')
            .setDescription('The ID of the bridge to get.')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('key')
            .setDescription('The key of the configuration option to get, or all if not specified.')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all configuration options for a bridge.')
        .addStringOption(option =>
          option
            .setName('id')
            .setDescription('The ID of the bridge to list.')
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    let possibleConfigs = {
      "delivery": {
        "description": "The delivery method to use for the bridge.",
        "options": ["message", "embed", "webhook", "image"],
        "default": "message",
      }
    }

    let baseEmbed = new DJSBuilders.Embed()
      .setColor(client.brandColor)
      .setTitle("Configuration")
      .setDescription("Loading configuration for your bridge...")
      .setFooter({
        text: "Requested by " + interaction.user.tag,
        iconURL: client.user.avatarURL(),
      });

    await interaction.deferReply();

    const curPage = await interaction.editReply({
      embeds: [baseEmbed],
    });

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "reset") {
      const id = interaction.options.getString("id");
      const bridge = client.bridges.get(id);

      if (!bridge) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("No bridge with that ID exists.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      if (bridge.guild !== interaction.guild.id) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("That bridge was not created in this server. Please go to the server that created the bridge and try again.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      let reset = await client.utils.confirm(
        interaction,
        "Reset bridge configuration?",
        "Are you sure you want to reset the configuration for this bridge?",
        "Successfully reset bridge configuration.",
        "Cancelled bridge reset."
      );
      if (reset) {
        client.utils.bridges.setBridgeConfig(id, {});
      }
    } else if (subcommand === "set") {
      const id = interaction.options.getString("id");
      const bridge = client.bridges.get(id);

      if (!bridge) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("No bridge with that ID exists.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      if (bridge.guild !== interaction.guild.id) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("That bridge was not created in this server. Please go to the server that created the bridge and try again.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      const key = interaction.options.getString("key");
      const value = interaction.options.getString("value");

      if (!key) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("You must specify a key to set.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      // Check if key is valid
      if (!possibleConfigs[key]) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("That key is not a configurable option.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      if (!value) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("You must specify a value to set.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      // Check if value is valid
      if (!possibleConfigs[key].options.includes(value)) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("That value is not a valid option for that key.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      let config = client.utils.bridges.getBridgeConfig(id);
      if (!config) {
        config = {};
      }
      config[key] = value;
      client.utils.bridges.setBridgeConfig(id, config);

      baseEmbed.setTitle("Success");
      baseEmbed.setDescription("Successfully set bridge configuration.");
      baseEmbed.setColor(client.colors.success);
      await curPage.edit({
        embeds: [baseEmbed]
      });

    } else if (subcommand === "get") {
      const id = interaction.options.getString("id");
      const bridge = client.bridges.get(id);

      if (!bridge) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("No bridge with that ID exists.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      if (bridge.guild !== interaction.guild.id) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("That bridge was not created in this server. Please go to the server that created the bridge and try again.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      const key = interaction.options.getString("key");

      if (!key) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("You must specify a key to get.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      // Check if key is valid
      if (!possibleConfigs[key]) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("That key is not a configurable option.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      const value = client.utils.bridges.getBridgeConfig(id, key);

      if (!value) {
        baseEmbed.setTitle("Error");
        baseEmbed.setDescription("No value exists for that key.");
        baseEmbed.setColor(client.colors.error);
        await curPage.edit({
          embeds: [baseEmbed]
        });
        return;
      }

      baseEmbed.setTitle("Bridge Configuration");
      baseEmbed.setDescription(`**Key**: ${key}\n**Value**: ${value}`);
      baseEmbed.setColor(client.colors.default);
      await curPage.edit({
        embeds: [baseEmbed]
      });
    } else if (subcommand === "list") {
      // List all configurable options
      const configs = Object.keys(possibleConfigs);
      const configsEmbed = new DJSBuilders.Embed()
        .setTitle("Bridge Configurations")
        .setDescription(`**${configs.length}** configurable options.`)
        .setColor(client.brandColor)

      for (const config of configs) {
        configsEmbed.addField({
          name: config,
          value: possibleConfigs[config].description + "\n\n" + "**Options**: " + possibleConfigs[config].options.join(", ") + "\n\n" + "**Default**: " + possibleConfigs[config].default
        });
      }

      await curPage.edit({
        embeds: [configsEmbed]
      });
    } else {
      baseEmbed.setTitle("Error");
      baseEmbed.setDescription("That is not a valid subcommand.");
      baseEmbed.setColor(client.colors.error);
      await curPage.edit({
        embeds: [baseEmbed]
      });
    }
  },
};
