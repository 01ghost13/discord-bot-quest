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
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

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
