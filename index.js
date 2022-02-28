// The file that starts the bot.

const { ShardingManager } = require("kurasuta");
const { join } = require("path");

const chalk = require("chalk");

const shardConfig = require("./config/shards.json");

const sharder = new ShardingManager(join(__dirname, "main.js"), {
  shardCount: shardConfig.shardCount,
  token: process.env.token,
});

sharder.on("ready", async (cluster) => {
  console.log(chalk.green.bold(`Shard ${cluster.id} is ready.`));
});

sharder.spawn();
