const DJSBuilders = require("@discordjs/builders");

module.exports = {
  handleMessage: async function(client, message) {
    // Will handle guild bridges later.
    let status = false;

    // Find all bridges whose channel is the same as the channel of the message
    let channelBridges = client.utils.bridges.findBridgesByChannel(message.channel.id);
    // Find all bridges whose endpoint is the same as the channel of the message
    let endpointBridges = client.utils.bridges.findBridgesByEndpoint(message.channel.id);

    // Handle channel bridges
    for (const bridge of channelBridges) {
      if (bridge.verified && (bridge.direction === "both" || bridge.direction === "there")) {
        if (bridge.config.delivery === "message") {
          let newMessage = "**" + message.author.tag + "**: " + message.content;
          let channel = client.channels.cache.get(bridge.endpoint);
          if (!channel) {
            channel = await client.channels.fetch(bridge.endpoint);
          }
          if (channel) {
            channel.send({ content: newMessage });
          }
        } else if (bridge.config.delivery === "embed") {
          let embed = new DJSBuilders.Embed()
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.displayAvatarURL()
            })
            .setDescription(message.content)
            .setTimestamp(message.createdAt)
            // Will support message color later.
            .setColor(client.brandColor);

          // Get all attachments from message
          let attachments = message.attachments.array();
          // If attachment is image, add it to embed
          if (attachments.length > 0) {
            if (attachments.length === 1) {
              if (attachments[0].width && attachments[0].height) {
                embed.setImage(attachments[0].proxyURL);
              }
            } else {
              for (const attachment of attachments) {
                if (attachment.proxyURL) {
                  // If more than one attachment, add fields with download links.
                  embed.addField({
                    name: "Attachment" + (attachments.length > 1 ? " (" + (attachments.indexOf(attachment) + 1) + ")" : ""),
                    value: "[" + attachment.name + "](" + attachment.proxyURL + ")"
                  });
                }
              }
            }
          }

          let channel = client.channels.cache.get(bridge.endpoint);
          if (!channel) {
            channel = await client.channels.fetch(bridge.endpoint);
          }
          if (channel) {
            channel.send({ embeds: [embed] });
          }
        } else if (bridge.config.delivery === "webhook") {
          let channel = client.channels.cache.get(bridge.endpoint);
          if (!channel) {
            channel = await client.channels.fetch(bridge.endpoint);
          }
          let channelWebhook = await client.utils.webhooks.getWebhook(bridge.endpoint);
          if (!channelWebhook) {
            await channel.send({ content: "Hold on, I'm creating a webhook for this channel." });
            // Create webhook in endpoint channel
            await channel.createWebhook({
              name: message.member.displayName || message.author.username,
              avatar: message.author.displayAvatarURL()
            }).then(webhook => {
              channelWebhook = webhook;
            });
            // Store webhook in database
            client.utils.webhooks.setWebhook(bridge.endpoint, { id: channelWebhook.id, token: channelWebhook.token });
          }
          if (channelWebhook) {
            // Set webhook username and avatar
            await channelWebhook.edit({
              name: message.member.displayName || message.author.username,
              avatar: message.author.displayAvatarURL()
            });
            // Send webhook message
            await channelWebhook.send({
              content: message.content,
              embeds: message.embeds,
              attachments: message.attachments,
              components: message.components
            });
          }
        } else if (bridge.config.delivery === 'image') {
          // Delivery method not yet implemented.
        }
        status = true;
      }
    }

    for (const bridge of endpointBridges) {
      if (bridge.verified && (bridge.direction === "both" || bridge.direction === "here")) {
        if (bridge.config.delivery === "message") {
          let newMessage = "**" + message.author.tag + "**: " + message.content;
          let channel = client.channels.cache.get(bridge.endpoint);
          if (!channel) {
            channel = await client.channels.fetch(bridge.endpoint);
          }
          if (channel) {
            channel.send({ content: newMessage });
          }
        } else if (bridge.config.delivery === "embed") {
          let embed = new DJSBuilders.Embed()
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.displayAvatarURL()
            })
            .setDescription(message.content)
            .setTimestamp(message.createdAt)
            // Will support message color later.
            .setColor(client.brandColor);

          // Get all attachments from message
          let attachments = message.attachments.array();
          // If attachment is image, add it to embed
          if (attachments.length > 0) {
            if (attachments.length === 1) {
              if (attachments[0].width && attachments[0].height) {
                embed.setImage(attachments[0].proxyURL);
              }
            } else {
              for (const attachment of attachments) {
                if (attachment.proxyURL) {
                  // If more than one attachment, add fields with download links.
                  embed.addField({
                    name: "Attachment" + (attachments.length > 1 ? " (" + (attachments.indexOf(attachment) + 1) + ")" : ""),
                    value: "[" + attachment.name + "](" + attachment.proxyURL + ")"
                  });
                }
              }
            }
          }

          let channel = client.channels.cache.get(bridge.endpoint);
          if (!channel) {
            channel = await client.channels.fetch(bridge.endpoint);
          }
          if (channel) {
            channel.send({ embeds: [embed] });
          }
        } else if (bridge.config.delivery === "webhook") {
          let channel = client.channels.cache.get(bridge.endpoint);
          if (!channel) {
            channel = await client.channels.fetch(bridge.endpoint);
          }
          let channelWebhook = await client.utils.webhooks.getWebhook(bridge.endpoint);
          if (!channelWebhook) {
            await channel.send({ content: "Hold on, I'm creating a webhook for this channel." });
            // Create webhook in endpoint channel
            await channel.createWebhook({
              name: message.member.displayName || message.author.username,
              avatar: message.author.displayAvatarURL()
            }).then(webhook => {
              channelWebhook = webhook;
            });
            // Store webhook in database
            client.utils.webhooks.setWebhook(bridge.endpoint, { id: channelWebhook.id, token: channelWebhook.token });
          }
          if (channelWebhook) {
            // Set webhook username and avatar
            await channelWebhook.edit({
              name: message.member.displayName || message.author.username,
              avatar: message.author.displayAvatarURL()
            });
            // Send webhook message
            await channelWebhook.send({
              content: message.content,
              embeds: message.embeds,
              attachments: message.attachments,
              components: message.components
            });
          }
        } else if (bridge.config.delivery === "image") {
          // Delivery method not yet implemented.
        }
        status = true;
      }
    }
    return status;
  }
};