module.exports = {
  handleMessage: function (client, message) {
    // Find all bridges whose channel is the same as the channel of the message
    let channelBridges = client.utils.bridges.findBridgesByChannel(message.channel.id);
    // Find all bridges whose endpoint is the same as the channel of the message
    let endpointBridges = client.utils.bridges.findBridgesByEndpoint(message.channel.id);

    // Handle channel bridges
    for (const bridge of channelBridges) {

    }

    // Handle endpoint bridges
    for (const bridge of endpointBridges) {

    }
  }
}