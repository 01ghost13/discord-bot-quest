'use strict';

const fs      = require('fs');
const config  = require('../config');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const gm = require('gm').subClass({ imageMagick: true });

const db = require("../database");
const Emoji   = db.models.Emoji;
const Message = db.models.Message;
const TargetedUser = db.models.TargetUser;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers,
    ],
});
client.commands = new Collection();

const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(__dirname + `/commands/${file}`);

    client.commands.set(command.name, command);
}


client.on('messageCreate', message => {
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

client.on('messageCreate', message => {
    if (message.content.startsWith(config.prefix) || message.author.bot) return;


    Message.create({
        discord_id: message.id,
        author:     message.author.id,
        content:    message.content,
        channel_id: message.channel.id,
    });


    let emojies = Emoji.getFromMessage(message.content);

    for (let emoji_id in emojies) {
        Emoji.createOrUpdate(message.channel.id, emojies[emoji_id]);
    }
});

client.on("presenceUpdate", async (oldPresence, newPresence) => {
    const target = await TargetedUser.findOne({
        where: {
            service: "game_bully",
            enabled: true,
        }
    });
    console.log(target);
    if (!target) { return; }
    const targetId = target.userId;
    const guildId = target.guildId;
    const channelId = target.channelId;

    if (oldPresence.guild.id !== guildId) {
        return;
    }
    if (!(oldPresence.activities.length === 0 && newPresence.activities.length > 0)) {
        return;
    }
    if (newPresence.user.id !== targetId) {
        return;
    }
    if (Math.random() < .5) {
        return;
    }

    const filename = './__jeka_playing_img.jpg';
    const channel = await newPresence.guild.channels.fetch(channelId);
    const targetedUser = newPresence.member;
    // console.log(channel)
    const sender = async () => {
        try {
            await channel.send({ files: [ filename ] });

            if (Math.random() < .2) {
                await channel.send('мнение?');
            }
        }
        catch (err) {
            console.log(err)
        }
    };

    // const targetedUser = guild.members.cache.get(jekaId);

    const username = targetedUser.displayName;
    const activity = newPresence.activities[0].name;
    let text = `${username} играет в ${activity}`;

    if (username.length > 20) {
        text = `${username}\nиграет в ${activity}`;
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
});


module.exports = client;
