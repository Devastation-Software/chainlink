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
            channel: channel
        };
        fs.writeFileSync('./data/bridges.json', JSON.stringify(bridges));
        return true;
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
    }
}