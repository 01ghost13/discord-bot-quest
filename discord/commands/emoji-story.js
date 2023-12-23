const db    = require('../../database');
const Emoji = db.models.Emoji;


module.exports = {
    name: 'emoji-story',
    description: 'статистика использования смайлов',
    /*aliases: ['commands'],*/
    /*usage: '[command name]',*/
    async execute(message, args) {
        let
            response = '',
            emojies  = await Emoji.findAll({
            where: {
                channel_id: message.channel.id,
            },
            order: [
                ['count', 'DESC']
            ]
        });

        emojies.forEach(emoji => {
            if (!message.guild.emojis.find(val => val.id === emoji.discord_id)) {
                return;
            }

            response += `<:${emoji.name}:${emoji.discord_id}> — ${emoji.count}\n`;
        });

        if(emojies.length === 0) {
            return;
        }

        message.channel.send(response);
    },
};
