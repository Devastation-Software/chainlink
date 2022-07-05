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
  // Now get the message from the database
  let otherMessage = client.utils.bridges.getMessageWebhookId(messageID);
  console.log("Got message from database.");
  // If the message was not found, return
  if (!otherMessage) return;
  // Get the channel of the message
  let channel = client.channels.cache.get(otherMessage.channel);
  console.log("Got channel.");
  // Now we know the ID of the webhook to edit. Get the webhook token representing the webhook in that channel.
  let webhookToken = client.utils.webhooks.getWebhook(channel.id);
  console.log("Got webhook token.");
  // If the webhook token is not found, return
  if (!webhookToken) return;
  // Now we know the webhook token. Get the webhook from the client
  let webhook = client.webhooks.cache.get(webhookToken);
  console.log("Got webhook.");
  // If the webhook is not found, return
  if (!webhook) return;
  // Get the other message
  let otherMessageObject = await channel.messages.fetch(otherMessage.message);
  console.log("Got other message.");
  // Now we know the webhook. We'll attempt to edit the message in the other channel.
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

  console.log("Edited message.");
}