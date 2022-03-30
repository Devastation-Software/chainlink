const Discord = require("discord.js");
const fs = require("fs");
const chalk = require("chalk");
const utils = require("../utils/utils.js");
const emojis = require("../assets/emojis.js");

module.exports = async (client) => {

  // Load emojis
  client.customEmojis = {};
  // Get Emoji keys
  const emojiKeys = Object.keys(emojis);
  // Loop through emojis
  emojiKeys.forEach(async (emoji) => {
    // Get emoji data
    const emojiData = emojis[emoji];
    client.customEmojis[emoji] = await client.emojis.fetch(emojiData);
  })

  client.user.setActivity("messages! Shard " + client.shardId, {
    type: "LISTENING",
  });

  console.log(
    chalk.bold.green(
      `Shard ${client.shardId || 0} with ${
        client.guilds.cache.size
      } servers has started.`
    )
  );
  setInterval(() => {
    client.user.setActivity("messages! Shard " + client.shardId, {
      type: "LISTENING",
    });
  }, 15000);
};
