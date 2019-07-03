const config = require('../config/config.js');


module.exports = {
    name: 'emoji-story',
    description: 'статистика использования смайлов',
    /*aliases: ['commands'],*/
    /*usage: '[command name]',*/
    execute(message, args, sequelize) {

        const Emoji = sequelize.import('../models/emoji'); // todo: тоже шок контент

        Emoji
            .findAll({
                where: {
                    channel_id: message.channel.id,
                },
                order: [
                    ['count', 'DESC']
                ]
            })
            .then(emojies => {
                let response = '';

                emojies.forEach(emoji => {
                    if (!message.guild.emojis.find(val => val.id === emoji.discord_id)) {
                        return;
                    }

                    response += `<:${emoji.name}:${emoji.discord_id}> — ${emoji.count}\n`;
                });

                message.channel.send(response);
            });

    },
};
