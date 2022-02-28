const Discord = require("discord.js");
const fs = require("fs");
const utils = require('../utils/utils.js')

module.exports = async (client) => {
  client.user.setActivity("messages!", { type: "LISTENING" });

	let botMessageChannel = client.channels.cache.get("947747031395467324")

	botMessageChannel.send({ content: "I'm online! " + utils.time.fullTimestamp() })
};
