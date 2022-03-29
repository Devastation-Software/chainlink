const Discord = require("discord.js"),
  fs = require("fs");

module.exports = (message) => {
  console.log(message.cleanContent);
};
