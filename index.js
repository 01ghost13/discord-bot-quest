const fs        = require('fs');
const config    = require('./config/config.js');
const Discord   = require('discord.js');
const Sequelize = require('sequelize');
const moment    = require('moment');


const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


const sequelize = new Sequelize(
    environmentConfig.database.url,
    {
        logging: false,
        dialect: environmentConfig.database.dialect,
        dialectOptions: environmentConfig.database.dialectOptions,
    }
);

const Emoji   = sequelize.import('./models/emoji');
const Message = sequelize.import('./models/message');

const FIND_EMOJI_REGEXP = new RegExp('<:(\\w{2,}):(\\d+)>', 'ig');




client.once('ready', () => {
	console.log('Ready!');

    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
});


client.on('message', message => { // todo: чекнуть еще плюхи в гайде и решить, надо ли их добавлять
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args        = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args, sequelize); // todo: как правильно избавиться от 3го аргумента? так не должно быть!
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});



client.on('message', message => { // todo: go to async/await
    if (message.content.startsWith(config.prefix) || message.author.bot) return;




    // Save message

    Message
        .create({
            discord_id: message.id,
            author:     message.author.id,
            content:    message.content,
            channel_id: message.channel.id,
        })
        .then(() => {
            //console.log(message.author.username + ': ' + message.content);
        });




    // Check messages limit

    sequelize
        .query(`SELECT COUNT(*) FROM "${Message.tableName}"`, { type: sequelize.QueryTypes.SELECT })
        .then((res) => {
            let count = +res[0].count;

            if (count < environmentConfig.messagesExport.limit) return;

            // todo: LOCK TABLE ONLY GOVNO IN ACCESS EXCLUSIVE;

            sequelize
                .query(`SELECT * FROM "${Message.tableName}"`, { type: sequelize.QueryTypes.SELECT })
                .then((res) => {

                    let filename = `${__dirname}/${moment().format('DD_MM_YYYY_HH_mm_ss')}_messages.json`;

                    fs.writeFile(filename, JSON.stringify(res), (error) => {

                        if (error) {
                            console.error('Failed to write file!', error);
                            return;
                        }

                        sequelize.query(
                            `DELETE FROM "${Message.tableName}" WHERE id <= :id`,
                            {
                                replacements: { id: res[res.length - 1].id },
                                type: sequelize.QueryTypes.DELETE
                            }
                        );


                        client
                            .channels
                            .get(environmentConfig.messagesExport.channel)
                            .send(`Лови выгрузку из ${res.length} строк за ${moment().format('HH:mm:ss DD-MM-YYYY')}.`, {
                                files: [ filename ]
                            })
                            .then(() => {
                                fs.unlink(filename, (error) => {
                                    if (error) {
                                        console.error('Failed to delete file!', error);
                                    }
                                });
                            });

                    });

                });
        });




    // Get all emojies from message

    let
        result,
        emojies = {};

    while (result = FIND_EMOJI_REGEXP.exec(message.content)) {

        let
            emoji_discord_id   = result[2],
            emoji_discord_name = result[1];

        if (emoji_discord_id in emojies) {
            emojies[emoji_discord_id].count++;
        }
        else {
            emojies[emoji_discord_id] = {
                id: emoji_discord_id,
                name: emoji_discord_name,
                count: 1,
            };
        }

    }




    // Update emojies

    for (let emoji_id in emojies) {
        Emoji
            .findOne({
                where: {
                    discord_id: emojies[emoji_id].id,
                    channel_id: message.channel.id
                }
            })
            .then(obj => {
                if (obj) { // update
                    return obj
                        .increaseCountOn(emojies[emoji_id].count)
                        .then(() => {
                            console.log('Emoji updated.');
                        });
                }
                else { // insert
                    return Emoji
                        .create({
                            discord_id: emojies[emoji_id].id,
                            name:       emojies[emoji_id].name,
                            channel_id: message.channel.id,
                            count:     1,
                        })
                        .then(() => {
                            console.log('Emoji created.');
                        });
                }
            });
    }

});


client.login(environmentConfig.BOT_TOKEN);
