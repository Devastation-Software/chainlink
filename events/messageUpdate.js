// Message Edit event
// If a message is edited, we'll check to see if it was a message attached to a webhook message in another channel.
// If it was, we'll edit the webhook message in the other channel.

module.exports = async (oldMessage, newMessage) => {
  console.log("Message edited.");
  let client = oldMessage.client;
  // Ignore webhooks so loops don't occur
  if (oldMessage.webhookID) return;
  console.log("Message was not a webhook.");
  // Ignore bot's own messages
  if (oldMessage.author.id === client.user.id) return;
  console.log("Message was not from the bot.");
  // Get id of message
  let messageID = oldMessage.id;
  // Now get the other channel to which the message was bridged
  let channelBridges = client.utils.bridges.findBridgesByChannel(oldMessage.channel.id);
  console.log("Found bridges in this channel.");
  // In the future we will use `await client.utils.messages.handleMessage(client, message)`
  for (const bridge of channelBridges) {
    // Get the channel id of the bridge
    let bridgeChannelID = bridge.channel;
    // Get the channel
    let bridgeChannel = await client.channels.fetch(bridgeChannelID);
    // Get the message
    let bridgeMessageID = client.utils.bridges.getMessageWebhookId(messageID);
    let bridgeMessage = await bridgeChannel.messages.fetch(bridgeMessageID);
    let editedMessage = await webhook.editMessage(otherMessageObject, {
      content: newMessage.content,
      embeds: newMessage.embeds,
      files: newMessage.attachments.map(attachment => {
        return {
          attachment: attachment.url,
          name: attachment.filename
        };
      }),
      components: newMessage.components
    });
  }
}