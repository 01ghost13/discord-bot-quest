'use strict';

const bot           = require('../../discord');
const ResponseError = require('../response-error');


module.exports = class Channels {
    static async sayToChannel(id, content) {
        const channel = bot.channels.get(id);

        if (!channel) {
            throw new ResponseError('Channel does not exist!', 500);
        }

        if (!content) {
            throw new ResponseError('Content is empty!', 500);
        }

        return channel.send(content);
    }

    static getAll() {
        let channels = {};

        bot.guilds.forEach((guild) => {
            guild.channels.forEach((channel) => {

                channels[channel.id] = {
                    id:   channel.id,
                    name: channel.name,
                    type: channel.type
                };

            });
        });

        return channels;
    }

    static getChannelEmojis(id) {
        const channel = bot.channels.get(id);

        if (!channel) {
            throw new ResponseError('Channel does not exist!', 500);
        }

        let emojis = {};

        channel.guild.emojis.forEach(emoji => {
            emojis[emoji.id] = {
                id:        emoji.id,
                name:      emoji.name,
                animated: +emoji.animated,
            };
        });

        return emojis;
    }
};
