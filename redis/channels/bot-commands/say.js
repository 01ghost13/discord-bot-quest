'use strict';

const bot = require('../../../discord');


module.exports = {
    name: 'say',
    execute (message) {
        bot.channels.get(message.channel).send(message.content);
    },
};
