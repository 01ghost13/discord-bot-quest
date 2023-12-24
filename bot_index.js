'use strict';

const db     = require('./database');
const bot    = require('./discord');
const api    = require('./api');
const redis  = require('./redis');
const config = require('./config');

redis.once('ready', async () => {
    console.log('Redis ready!');
});


api.listen(config.api.port || 3000, () => {
    console.log(`Api ready on port ${config.api.port}!`);
});


bot.once('ready', async () => {
    try {
        await db.connection.authenticate();
        await bot.login(config.BOT_TOKEN);
        console.log('Connection to the database has been established successfully.');
    }
    catch (err) {
        bot.destroy();
        console.error('Unable to connect to the database:', err);

        return;
    }

	console.log('Bot ready!');
});


(async () => {
    await bot.login(config.BOT_TOKEN);
})();
