// The actual bot's main file.

const { BaseCluster } = require("kurasuta");

const Discord = require("discord.js");

module.exports = class extends BaseCluster {
	async launch() {
		// A cheap and easy way to get all the intents.
		this.client = new Discord.Client({ intents: new Discord.IntentsBitField(32767) });

		this.client.login(process.env.token);
	}
};
