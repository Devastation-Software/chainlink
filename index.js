// The file that starts the bot.

const { ShardingManager } = require("kurasuta");
const { join } = require("path");

const chalk = require("chalk");

const shardConfig = require("./config/shards.json");

const sharder = new ShardingManager(join(__dirname, "main"), {
	token: process.env.token,
	shardCount: shardConfig.shardCount,
});

sharder.on("ready", async (cluster) => {
	console.log(chalk.green.bold(`Shard ${cluster.id} is ready.`));
});

sharder.spawn();
