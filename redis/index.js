'use strict';

const fs     = require('fs');
const config = require('../config');

const redis = require('redis').createClient(config.redis.url);


let channels = {};

fs.readdirSync(`${__dirname}/channels`).forEach(channel => {
    const events = fs.readdirSync(`${__dirname}/channels/${channel}`).filter(file => file.endsWith('.js'));

    channels[channel] = {};

    for (const file of events) {
        const event = require(`${__dirname}/channels/${channel}/${file}`);

        channels[channel][event.name] = event;
    }
});


redis.psubscribe('*');

redis.on('pmessage', (pattern, channel, message_raw) => {
    let message;

    try {
        message = JSON.parse(message_raw);
    }
    catch (e) {
        console.error(`Message is not valid JSON! Message: ${message_raw}`);
        return;
    }

    if (channel in channels) {
        if (message.event in channels[channel]) {
            try {
                channels[channel][message.event].execute(message);
            }
            catch (err) {
                console.error(`Error for "${channel}:${message.event}":`, err);
            }
        }
        else {
            console.error(`Event "${message.event}" not found in channel "${channel}"!`);
        }
    }
    else {
        console.error(`Channel "${channel}" not found!`);
    }
});


redis.on('error', err => {
    console.error('Redis error', err);
});


module.exports = redis;
