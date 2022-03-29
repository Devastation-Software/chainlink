const fs = require("fs");
const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const token = process.env.token;
const { clientId, testGuildId } = require("../config/config.json");

const Chalk = require("chalk");

function deploy(commandsList) {
  console.log("Deploying commands!");
  commandsList.forEach((command) => {
    console.log("==> " + command["name"]);
  });

  const rest = new REST({ version: "9" }).setToken(token);

  (async () => {
    try {
      console.log(Chalk.red("Registering all commands at test server"));
      await rest.put(Routes.applicationGuildCommands(clientId, testGuildId), {
        body: commandsList,
      });
      console.log(
        Chalk.yellow("Successfully registered all commands to test server!")
      );
      console.log(Chalk.red("Registering all commands globally"));

      await rest.put(Routes.applicationCommands(clientId), {
        body: commandsList,
      });
      console.log(
        Chalk.yellow("Successfully registered all commands globally!")
      );
    } catch (error) {
      console.error(error);
    }
  })();
}

function deployGuild(commandsList, guild) {
  console.log("Deploying commands!");
  commandsList.forEach((command) => {
    console.log("==> " + command["name"]);
  });

  const rest = new REST({ version: "9" }).setToken(token);

  (async () => {
    try {
      console.log(Chalk.red("Registering all commands at specific server"));
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commandsList,
      });
      console.log(
        Chalk.yellow("Successfully registered all commands to that server!")
      );
    } catch (error) {
      console.error(error);
    }
  })();
}

module.exports = { deploy: deploy, deployGuild: deployGuild };
