'use strict';

const fs      = require('fs');
const config  = require('../config');
const Discord = require('discord.js');


const client    = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(__dirname + `/commands/${file}`);

    client.commands.set(command.name, command);
}


client.on('message', message => {
    const
        isCommand     = message.content.startsWith(config.prefix),
        isMentionsBot = message.mentions.users.size > 0 && message.mentions.users.first().id === client.user.id;

    if (message.author.bot || !(isMentionsBot || isCommand)) {
        return;
    }

    // TODO: обобщить костыль
    if (isMentionsBot) {
        if (message.content.match(/крути|колесо|закру[чт]/i) !== null) {
            try {
                client
                    .commands
                    .get('fortune-wheel')
                    .execute(message);
            }
            catch (error) {
                console.error(error);
                message.reply('there was an error trying to execute that command!');
            }

            return;
        }

        if (message.content.match(/корон[а|е]|коронавирус|covid(-19)?|coronavirus/i) !== null) {
            try {
                client
                    .commands
                    .get('coronavirus')
                    .execute(message);
            }
            catch (error) {
                console.error(error);
                message.reply('there was an error trying to execute that command!');
            }

            return;
        }

        if (message.content.match(/общий сбор/i) !== null) {
            try {
                client
                    .commands
                    .get('conscription')
                    .execute(message);
            }
            catch (error) {
                console.error(error);
                message.reply('there was an error trying to execute that command!');
            }

            return;
        }

        const match = message
            .content
            .replace(/долл?ар/i, 'usd')
            .replace(/евр/i, 'eur')
            .match(/usd|eur/i);

        if (match !== null && ['usd', 'eur'].includes(match[0])) {
            const code = match[0];

            try {
                client
                    .commands
                    .get('exchange')
                    .execute(message, [code]);
            }
            catch (error) {
                console.error(error);
                message.reply('there was an error trying to execute that command!');
            }
        }

        return;
    }

    const args        = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});


module.exports = client;
