const reqEvent = (event) => require(`../events/${event}`);

module.exports = (client) => {
  client.on("ready", () => reqEvent("ready")(client));
  client.on("messageCreate", reqEvent("messageCreate"));
  // client.on('guildCreate', reqEvent('guildCreate'));
  client.on("interactionCreate", reqEvent("interactionCreate"));
  // client.on('guildMemberAdd', reqEvent('guildMemberAdd'));
  // client.on("raw", (packet) => {
  //   console.log(packet);
  // });
  client.on("messageUpdate", reqEvent("messageUpdate"));
};
