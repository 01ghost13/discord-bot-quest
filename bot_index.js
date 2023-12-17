'use strict';

const gm = require('gm').subClass({ imageMagick: true });

const db     = require('./database');
const bot    = require('./discord');
const api    = require('./api');
const redis  = require('./redis');
const config = require('./config');

const Emoji   = db.models.Emoji;
const Message = db.models.Message;




redis.once('ready', async () => {
    console.log('Redis ready!');
});


api.listen(config.api.port || 3000, () => {
    console.log(`Api ready on port ${config.api.port}!`);
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
    Message.create({ // todo: не сейвится... ну и команды не работают кекв
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


(async () => {
    await bot.login(config.BOT_TOKEN);

    const jekaId = '172822815303663618';
    const guildId = '177172000391954432';
    const channelId = '177172000391954432';

    const jeka = await bot.users.fetch(jekaId);
    const guild = await bot.guilds.fetch(guildId);
    const channel = await bot.channels.fetch(channelId);

    jeka.client.addListener('presenceUpdate', async (oldPresence, newPresence) => {
        if (oldPresence.guild.id !== guildId) {
            // только для конкретного сервера
            return;
        }

        if (oldPresence.activities.length === 0 && newPresence.activities.length > 0) {
            if (Math.random() < .5) {
                return;
            }

            const filename = '/tmp/__jeka_playing_img.jpg';

            const sender = async () => {
                await channel.send({ files: [ filename ] });

                if (Math.random() < .2) {
                    await channel.send('мнение?');
                }
            };

            const jekaInChannel = guild.members.cache.get(jekaId);

            let text = `${jekaInChannel.nickname} играет в ${newPresence.activities[0].name}`;

            if (jekaInChannel.nickname.length > 20) {
                text = `${jekaInChannel.nickname}\nиграет в ${newPresence.activities[0].name}`;
            }

            gm('https://i.imgur.com/FQdRJy6.png')
                .font('./font/PressStart2P-Regular.ttf', 20)
                .drawText(30, 50, text)
                .write(filename, function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    sender();
                });
        }
    });
})();
