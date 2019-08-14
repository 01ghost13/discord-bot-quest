'use strict';

const api    = require('./api');
const bot    = require('./discord');
const redis  = require('./redis');
const config = require('./config');

bot.login(config.BOT_TOKEN);

redis.once('ready', async () => {
    console.log('Redis ready!');
});


api.listen(process.env.PORT || 3000, () => {
    console.log(`Api ready on port ${config.api.port}!`);
});
