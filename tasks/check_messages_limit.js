'use strict';

const fs     = require('fs');
const db     = require('../database');
const bot    = require('../discord');
const config = require('../config');
const moment = require('moment');


const filename = `${__dirname}/${moment().format('DD_MM_YYYY_HH_mm_ss')}_messages.json`;
const queries  = {
    all:    `SELECT * FROM "${db.models.Message.tableName}"`,
    count:  `SELECT COUNT(*) FROM "${db.models.Message.tableName}"`,
    delete: `DELETE FROM "${db.models.Message.tableName}" WHERE id <= :id`,
};


bot.once('ready', async () => {
    let
        res   = await db.connection.query(queries.count, { type: db.connection.QueryTypes.SELECT }),
        count = +res[0].count;

    if (count < config.messagesExport.limit) {
        await bot
            .channels
            .get(config.messagesExport.channel)
            .send(`Использовано ${count} строк из ${config.messagesExport.limit}.`);

        bot.destroy();

        return;
    }

    // todo: LOCK TABLE ONLY GOVNO IN ACCESS EXCLUSIVE;

    let data = await db.connection.query(queries.all, { type: db.connection.QueryTypes.SELECT });

    fs.writeFile(filename, JSON.stringify(data), async (error) => {
        if (error) {
            console.error('Failed to write file!', error);
            return;
        }

        db.connection.query(
            queries.delete,
            {
                replacements: { id: data[data.length - 1].id },
                type: db.connection.QueryTypes.DELETE
            }
        );

        await bot
            .channels
            .get(config.messagesExport.channel)
            .send(`Лови выгрузку из ${data.length} строк за ${moment().format('HH:mm:ss DD-MM-YYYY')}.`, {
                files: [ filename ]
            });

        fs.unlink(filename, (error) => {
            if (error) {
                console.error('Failed to delete file!', error);
            }
        });

        bot.destroy();
    });
});

bot.login(config.BOT_TOKEN);
