// The actual bot's main file.

const { BaseCluster } = require("kurasuta");

const Discord = require("discord.js");

module.exports = class extends BaseCluster {
  async launch() {
    // A cheap and easy way to get all the intents.
		// For v14 use IntentsBitField() instead of Intents.
    this.client = new Discord.Client({
      intents: new Discord.Intents(32767),
    });

    require("./utils/eventLoader.js")(this.client);
    this.client.login(process.env.token);
  }
};
