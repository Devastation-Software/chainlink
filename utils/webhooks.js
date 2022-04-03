const fs = require('fs');

module.exports = {
  getWebhook: function (channelid) {
    let webhookDB = JSON.parse(fs.readFileSync('./data/webhooks.json', 'utf8'));
    let webhookURL = webhookDB[channelid];
    return webhookURL;
  },

  setWebhook: function (channelid, webhookData) {
    let webhookDB = JSON.parse(fs.readFileSync('./data/webhooks.json', 'utf8'));
    webhookDB[channelid] = webhookData;
    fs.writeFileSync('./data/webhooks.json', JSON.stringify(webhookDB));
  }
}