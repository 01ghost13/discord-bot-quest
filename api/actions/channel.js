'use strict';

const bot           = require('../../discord');
const ResponseError = require('../response-error');


module.exports = class Channel {
    /**
     * Send msg to channel
     *
     * @param {string} channel_id
     * @param {string} content
     * @return {Promise<*>}
     */
    static async say(channel_id, content) {
        if (!content) {
            throw new ResponseError('Content is empty!', 500);
        }

        const channel = bot.channels.get(channel_id);

        if (!channel) {
            throw new ResponseError('Channel does not exist!', 500);
        }

        return channel.send(content);
    }
};
