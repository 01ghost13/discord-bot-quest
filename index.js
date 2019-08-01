'use strict';

const db     = require('./database');
const bot    = require('./discord');
const redis  = require('./redis');
const config = require('./config');

const Emoji   = db.models.Emoji;
const Message = db.models.Message;




redis.once('ready', async () => {
    console.log('Redis ready!');
});


bot.once('ready', async () => {
    try {
        await db.connection.authenticate();
        console.log('Connection to the database has been established successfully.');
    }
    catch (err) {
        bot.destroy();
        console.error('Unable to connect to the database:', err);

        return;
    }

	console.log('Bot ready!');
});


bot.on('message', message => {
    if (message.content.startsWith(config.prefix) || message.author.bot) return;


    // Save message
    Message.create({
        discord_id: message.id,
        author:     message.author.id,
        content:    message.content,
        channel_id: message.channel.id,
    });


    // Get all emojies from message
    let emojies = Emoji.getFromMessage(message.content);

    // Update emojies
    for (let emoji_id in emojies) {
        Emoji.createOrUpdate(message.channel.id, emojies[emoji_id]);
    }
});


bot.login(config.BOT_TOKEN);
