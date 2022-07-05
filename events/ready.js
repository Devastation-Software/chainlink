const fs = require("fs");
const changeLogChannelId = "971051994708058112";
const DJSBuilders = require("@discordjs/builders");
const chalk = require("chalk");

module.exports = async (client) => {
  // Check last checked version file, if it is not the same as the one in version.json, post a message to the change log channel and update the last checked version file
  const lastCheckedVersion = fs.readFileSync("./data/lastcheckedversion", "utf8");
  if (!(lastCheckedVersion == client.info.build)) {
    const newReleaseEmbed = new DJSBuilders.Embed()
      .setTitle("New version released!")
      .setDescription(`Version ${client.info.version}${client.info.build} has been released!`)
      .setColor(client.brandColor)
      .addField({
        name: "Changes in this version",
        value: client.utils.changelog.getByVersion(client.info.build),
      })
      .setTimestamp();
    client.channels.cache.get(changeLogChannelId).send({ embeds: [newReleaseEmbed] });
    fs.writeFileSync("./data/lastcheckedversion", client.info.build);
    console.log(`New version ${client.info.build}'s change log has been posted to the change log channel.`);
  }

  client.user.setActivity({
    name: `/help | ${client.info.version}${client.info.build} | ${client.guilds.cache.size} servers`,
    type: "WATCHING",
  });

  setInterval(() => {
    client.user.setActivity({
      name: `/help | ${client.info.version}${client.info.build} | ${client.guilds.cache.size} servers`,
      type: "WATCHING",
    });
  }, 30000);

  console.log(chalk.green(`${client.user.username} is online!`));
};
