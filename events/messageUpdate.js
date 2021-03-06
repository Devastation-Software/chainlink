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
  // Get all the messages associated with the message ID
  let webhookMessages = client.utils.bridges.getMessageWebhookId(messageID);
  if (!webhookMessages) return;
  let bridges = client.utils.bridges.findBridgesByChannel(oldMessage.channel.id);
  let endpointBridges = client.utils.bridges.findBridgesByEndpoint(oldMessage.channel.id);
  // This should be an array, loop over each ID and edit the message
  for (let i = 0; i < bridges.length; i++) {
    console.log("Bridge number " + i + " of " + bridges.length);
    // Get the bridge info
    let bridge = bridges[i];
    // Get the channel info
    let channel = await client.channels.fetch(bridge.endpoint);
    // Fetch the webhook info
    let webhook = await client.utils.webhooks.getWebhook(bridge.endpoint);
    // Fetch the webhook given id and token
    let webhookFetch = await client.fetchWebhook(webhook.id, webhook.token);
    // Edit the message
    let editedMessage = await webhookFetch.editMessage(webhookMessages[i], {
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

  let webhookMessages1 = client.utils.bridges.getMessageWebhookId(messageID);

  for (let i = 0; i < endpointBridges.length; i++) {
    console.log("Bridge number " + i + " of " + endpointBridges.length);
    // Get the bridge info
    let bridge = endpointBridges[i];
    // Get the channel info
    let channel = await client.channels.fetch(bridge.channel);
    // Fetch the webhook info
    let webhook = await client.utils.webhooks.getWebhook(bridge.channel);
    // Fetch the webhook given id and token
    let webhookFetch = await client.fetchWebhook(webhook.id, webhook.token);
    // Edit the message
    let editedMessage = await webhookFetch.editMessage(webhookMessages1[i], {
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