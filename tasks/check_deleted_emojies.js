'use strict';

const db     = require('../database');
const bot    = require('../discord');
const config = require('../config');


bot.once('ready', () => {
    console.log("Servers:");

    bot.guilds.forEach((guild) => {
        console.log(" - " + guild.name);

        guild.channels.forEach((channel) => {
            db.models.Emoji.removeNonExistingEmoji(channel.id, guild.emojis);

            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        });
    });

    bot.destroy();
});

bot.login(config.BOT_TOKEN);
