module.exports = {
	"prefix": "!",

	"development":  {
		"BOT_TOKEN": process.env.BOT_TOKEN,

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
	},
	"production": {
		"BOT_TOKEN": process.env.BOT_TOKEN,

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
	}
};
