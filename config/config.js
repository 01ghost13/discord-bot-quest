module.exports = {
    "development":  {
        "prefix": "!",

        "BOT_TOKEN": process.env.BOT_TOKEN,

        "SECURE_TOKEN": process.env.SECURE_TOKEN,

        "database": {
            "url": process.env.DATABASE_URL,
            "dialect": "postgres",
            "dialectOptions": {
                "ssl": true
            }
        },

        "channelForErrors": process.env.CHANNEL_FOR_ERRORS,

        "messagesExport" : {
            "limit": process.env.MESSAGES_EXPORT_LIMIT,
            "channel": process.env.MESSAGES_EXPORT_CHANNEL,
        },

        "redis": {
            "url": process.env.REDIS_URL,
        },

        "api": {
            "port": process.env.API_PORT,
        },
    },
    "production": {
        "prefix": "!",

        "BOT_TOKEN": process.env.BOT_TOKEN,

        "SECURE_TOKEN": process.env.SECURE_TOKEN,

        "database": {
            "url": process.env.DATABASE_URL,
            "dialect": "postgres",
            "dialectOptions": {
                "ssl": true
            }
        },

        "channelForErrors": process.env.CHANNEL_FOR_ERRORS,

        "messagesExport" : {
            "limit": process.env.MESSAGES_EXPORT_LIMIT,
            "channel": process.env.MESSAGES_EXPORT_CHANNEL,
        },

        "redis": {
            "url": process.env.REDIS_URL,
        },

        "api": {
            "port": process.env.API_PORT,
        },
    }
};
