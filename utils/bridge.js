// Helper classes and functions for creating bridges.
const fs = require('fs');
const uuid = require('./uuid');

module.exports = {
    create: function (type, direction, endpoint, guild, channel) {
        let bridges = JSON.parse(fs.readFileSync('./data/bridges.json', 'utf8'));
        let randomUUID = uuid.generate();
        bridges[randomUUID] = {
            type: type,
            direction: direction,
            endpoint: endpoint,
            guild: guild,
            channel: channel,
            verified: false,
            uuid: randomUUID,
            config: {}
        };
        fs.writeFileSync('./data/bridges.json', JSON.stringify(bridges));
        return randomUUID;
    },

    findBridgesByChannel: function (channelID) {
        let bridges = JSON.parse(fs.readFileSync('./data/bridges.json', 'utf8'));
        let foundBridges = [];
        for (let bridge in bridges) {
            if (bridges[bridge].channel === channelID) {
                foundBridges.push(bridges[bridge]);
            }
        }
        return foundBridges;
    },

    findBridgesByGuild: function (guildID) {
        let bridges = JSON.parse(fs.readFileSync('./data/bridges.json', 'utf8'));
        let foundBridges = [];
        for (let bridge in bridges) {
            if (bridges[bridge].guild === guildID) {
                foundBridges.push(bridges[bridge]);
            }
        }
        return foundBridges;
    },

    findBridgesByEndpoint: function (endpoint) {
        let bridges = JSON.parse(fs.readFileSync('./data/bridges.json', 'utf8'));
        let foundBridges = [];
        for (let bridge in bridges) {
            if (bridges[bridge].endpoint === endpoint) {
                foundBridges.push(bridges[bridge]);
            }
        }
        return foundBridges;
    },

    findBridgesByUUID: function (uuid) {
        let bridges = JSON.parse(fs.readFileSync('./data/bridges.json', 'utf8'));
        let foundBridges = [];
        for (let bridge in bridges) {
            if (bridges[bridge].uuid === uuid) {
                foundBridges.push(bridges[bridge]);
            }
        }
        return foundBridges;
    },

    createCode: function (bridgeUUID) {
        // Create a random verification code to make sure bridges aren't created without both parties agreeing.
        // Generate 6 random numbers between 0 and 9.
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += Math.floor(Math.random() * 10);
        }
        let codes = JSON.parse(fs.readFileSync('./data/codes.json', 'utf8'));
        codes[bridgeUUID] = code;
        fs.writeFileSync('./data/codes.json', JSON.stringify(codes));
        return code;
    },

    verifyCode: function (bridgeUUID, code) {
        let codes = JSON.parse(fs.readFileSync('./data/codes.json', 'utf8'));
        if (codes[bridgeUUID] === code) {
            return true;
        } else {
            return false;
        }
    },

    getBridgeByCode: function (code) {
        let codes = JSON.parse(fs.readFileSync('./data/codes.json', 'utf8'));
        for (let bridge in codes) {
            if (codes[bridge] === code) {
                return bridge;
            }
        }
        return false;
    },

    verifyBridge: function (bridgeUUID) {
        let bridges = JSON.parse(fs.readFileSync('./data/bridges.json', 'utf8'));
        bridges[bridgeUUID].verified = true;
        fs.writeFileSync('./data/bridges.json', JSON.stringify(bridges));

        let codes = JSON.parse(fs.readFileSync('./data/codes.json', 'utf8'));
        delete codes[bridgeUUID];
        fs.writeFileSync('./data/codes.json', JSON.stringify(codes));
    },

    getBridgeConfig: function (bridgeUUID, key = null) {
        if (key === null) {
            return JSON.parse(fs.readFileSync('./data/bridges.json', 'utf8'))[bridgeUUID].config;
        } else {
            return JSON.parse(fs.readFileSync('./data/bridges.json', 'utf8'))[bridgeUUID].config[key];
        }
    },

    setBridgeConfig: function (bridgeUUID, config) {
        let bridges = JSON.parse(fs.readFileSync('./data/bridges.json', 'utf8'));
        bridges[bridgeUUID].config = config;
        fs.writeFileSync('./data/bridges.json', JSON.stringify(bridges));
    },

    deleteBridge: function (bridgeUUID) {
        let bridges = JSON.parse(fs.readFileSync('./data/bridges.json', 'utf8'));
        delete bridges[bridgeUUID];
        fs.writeFileSync('./data/bridges.json', JSON.stringify(bridges));
    },

    bridgeToString: function (client, bridge) {
        let string = '';

        if (bridge.type === "server") {
            let thisGuild = client.guilds.cache.get(bridge.guild);
            let endpointGuild = client.guilds.cache.get(bridge.endpoint);

            string += thisGuild.name + client.utils.misc.convertDirectionToEmoji(bridge.direction) + endpointGuild.name;
        } else {
            let thisChannel = client.channels.cache.get(bridge.channel);
            let endpointChannel = client.channels.cache.get(bridge.endpoint);

            string += "<#" + thisChannel + ">";
            string += " " + client.utils.misc.convertDirectionToEmoji(bridge.direction) + " ";
            string += "<#" + endpointChannel + ">";
        }

        return string;
    },

    getMessageWebhookId: function (messageId) {
        // Get the value of the message webhook id from the message id.
        return JSON.parse(fs.readFileSync('./data/messages.json', 'utf8'))[messageId];
    },

    setMessageWebhookId: function (messageId, webhookId) {
        // Set the value of the message webhook id from the message id.
        let webhooks = JSON.parse(fs.readFileSync('./data/messages.json', 'utf8'));
        if (webhooks[messageId] === undefined) {
            webhooks[messageId] = [].push(webhookId);
        } else {
            webhooks[messageId].push(webhookId);
        }
        fs.writeFileSync('./data/messages.json', JSON.stringify(webhooks));
    }
}