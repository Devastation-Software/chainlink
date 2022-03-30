const Discord = require("discord.js");
const fs = require("fs");
const chalk = require("chalk");
const utils = require("../utils/utils.js");

module.exports = async (client) => {
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
