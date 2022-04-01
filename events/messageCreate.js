const Discord = require("discord.js"),
  fs = require("fs");

module.exports = async (message) => {
    let client = message.client;

    let messageBridged = false;

    // Ignore webhooks so loops don't occur
    if (message.webhookID) return;

    // Ignore my own messages
    if (message.author.id === client.user.id) return;

    let channelBridges = client.utils.bridges.findBridgesByChannel(message.channel.id);

    for (const bridge of channelBridges) {
        if (bridge.verified) {
            if (bridge.type === "channel") {
                // Simple sending by message, no webhooks or images yet
                if (bridge.direction === "both" || bridge.direction === "there") {
                    let endpointChannel = await client.channels.fetch(bridge.endpoint);
                    endpointChannel.send("**" + message.author.tag + "**: " + message.content);
                }
            } else {
                // No support for guild bridges yet
            }
            messageBridged = true;
        }
    }

    let endpointBridges = client.utils.bridges.findBridgesByEndpoint(message.channel.id);

    for (const bridge of endpointBridges) {
        if (bridge.verified) {
            if (bridge.type === "channel") {
                // Simple sending by message, no webhooks or images yet
                if (bridge.direction === "both" || bridge.direction === "here") {
                    let endpointChannel = await client.channels.fetch(bridge.channel);
                    endpointChannel.send("**" + message.author.tag + "**: " + message.content);
                }
            } else {
                // No support for guild bridges yet
            }
            messageBridged = true;
        }
    }

    if (messageBridged) {
        client.user.setStatus("online");
    }

    // Set a timeout, if the bot doesn't see any messages for a while, it will set the bot's status to "idle"
    setTimeout(() => {
        client.user.setStatus("idle");
    }, 120000);
};
