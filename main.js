// The actual bot's main file.

const { BaseCluster } = require("kurasuta");

const Discord = require("discord.js");
const { IntentsBitField } = require("discord.js");
const fs = require("fs");
const emojis = require("./assets/emoji.json");
const config = require("./config/config.json");
const utils = require("./utils/utils.js");

module.exports = class extends BaseCluster {
  async launch() {
    // A cheap and easy way to get all the intents.
    // For v14 use IntentsBitField() instead of Intents.

    const client = new Discord.Client({
      intents: 32767,
      partials: ["MESSAGE", "CHANNEL"], // Needed to get messages from DM's as well
    });

    this.client.customEmojis = emojis;
    this.client.brandColor = "#3b1b72";
    this.client.config = config;

    // Allow access to shard ID from cluster to allow for status setting
    this.client.shardId = this.id;

    this.client.utils = utils;

    // Parse changes in real time,
    let commandModules = fs.readFileSync("./assets/modules.json", {
      encoding: "utf8",
    });
    commandModules = JSON.parse(commandModules);
    this.client.modules = Object.keys(commandModules);

    // The handler for all slash commands, loops over them nested dirs
    this.commandsList = [];

    this.client.interactions = new Discord.Collection();

    this.client.modules.forEach((c) => {
      this.files = fs.readdirSync(`./interactions/${c}/`);
      this.files.forEach((f) => {
        this.interaction = require(`./interactions/${c}/${f}`);
        this.data = this.interaction.data.toJSON();
        this.commandsList.push(this.data);
        this.client.interactions.set(this.data.name, this.interaction);
      });
    });

    // For easy access
    this.client.commandsList = this.commandsList;

    // Deploy slash commands to Discord.
    this.client.utils.deploy.deploy(this.commandsList);

    require("./utils/eventLoader.js")(this.client);
    this.client.login(process.env.token);
  }
};
