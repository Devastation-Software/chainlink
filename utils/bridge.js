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
            uuid: randomUUID
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
    }
}