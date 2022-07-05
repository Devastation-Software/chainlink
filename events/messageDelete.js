// Message Delete event
// If a message is deleted, we'll delete it at any other endpoints.

module.exports = async (oldMessage) => {
  let client = oldMessage.client;
  // Ignore webhooks so loops don't occur
  if (oldMessage.webhookID) return;
  // Ignore bot's own messages
  if (oldMessage.author.id === client.user.id) return;
  // Get id of message
  let messageID = oldMessage.id;
  // Get all the messages associated with the message ID
  let webhookMessages = client.utils.bridges.getMessageWebhookId(messageID);
  if (!webhookMessages) return;
  let bridges = client.utils.bridges.findBridgesByChannel(oldMessage.channel.id);
  let endpointBridges = client.utils.bridges.findBridgesByEndpoint(oldMessage.channel.id);
  // This should be an array, loop over each ID and edit the message
  for (let i = 0; i < bridges.length; i++) {
    // Get the bridge info
    let bridge = bridges[i];
    // Get the channel info
    let channel = await client.channels.fetch(bridge.endpoint);
    // Fetch the webhook info
    let webhook = await client.utils.webhooks.getWebhook(bridge.endpoint);
    // Fetch the webhook given id and token
    let msg = await channel.messages.fetch(webhookMessages[i]);
    await msg.delete();
  }

  let webhookMessages1 = client.utils.bridges.getMessageWebhookId(messageID);

  for (let i = 0; i < endpointBridges.length; i++) {
    // Get the bridge info
    let bridge = endpointBridges[i];
    // Get the channel info
    let channel = await client.channels.fetch(bridge.channel);
    // Fetch the webhook info
    let webhook = await client.utils.webhooks.getWebhook(bridge.channel);
    // Fetch the webhook given id and token
    let webhookFetch = await client.fetchWebhook(webhook.id, webhook.token);
    // Edit the message
    let msg = await channel.messages.fetch(webhookMessages1[i]);
    await msg.delete();
  }
}