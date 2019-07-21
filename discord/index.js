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

module.exports = client;
