const Discord = require("discord.js");
const { Intents } = require("discord.js");
const fs = require("fs");
const emojis = require("./assets/emoji.json");
const config = require("./config/config.json");
const utils = require("./utils/utils.js");

const client = new Discord.Client({
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL"], // Needed to get messages from DM's as well
});

let commandModules = fs.readFileSync("./assets/modules.json", {
  encoding: "utf8",
});

commandModules = JSON.parse(commandModules);
client.modules = Object.keys(commandModules);

commandsList = [];

client.interactions = new Discord.Collection();

client.modules.forEach((c) => {
  files = fs.readdirSync(`./interactions/${c}/`);
  files.forEach((f) => {
    if (!f.endsWith(".js")) return;
    interaction = require(`./interactions/${c}/${f}`);
    data = interaction.data.toJSON();
    commandsList.push(data);
    client.interactions.set(data.name, interaction);
  });
});

// For easy access
client.commandsList = commandsList;
client.bridges = require("./utils/bridge.js");
client.info = require("./assets/version.json");
client.brandColor = 16746496;
client.config = config;
client.utils = utils;

// Deploy slash commands to Discord.
client.utils.deploy.deploy(commandsList);

require("./utils/eventLoader.js")(client);
client.login(process.env.token);