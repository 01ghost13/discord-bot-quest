const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

client.once('ready', () => {
	console.log('Ready!');
});

client.login(environmentConfig.BOT_TOKEN);
