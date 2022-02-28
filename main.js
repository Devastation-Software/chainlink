// The actual bot's main file.

const { BaseCluster } = require("kurasuta");

module.exports = class extends BaseCluster {
  async launch() {
    const Discord = require("discord.js");
    // A cheap and easy way to get all the intents.
    // For v14 use IntentsBitField() instead of Intents.

    const client = new Discord.Client({
      intents: new Discord.Intents(32767),
    });

    // Allow access to shard ID from cluster to allow for status setting
    this.client.shardId = this.id;

    require("./utils/eventLoader.js")(this.client);
    this.client.login(process.env.token);
  }
};
