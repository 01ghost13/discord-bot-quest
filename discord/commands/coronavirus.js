const axios = require('axios');
const cheerio = require('cheerio');
const Discord = require('discord.js');

const yandexUrl = 'https://yandex.ru/web-maps/covid19';
const worldometersUrl = 'https://worldometers.info/coronavirus/';
const memeImgUrls = [
    'https://cdn.discordapp.com/attachments/202102729387147264/692776084080427148/7dd6e8b94e6cdac61b9bf5858a05aedb.jpg',
    'http://i.imgur.com/HsoW7Ft.png',
    'http://i.imgur.com/lyXDSXk.png',
    'http://i.imgur.com/2m5hrqR.png',
    'http://i.imgur.com/X4W2xzH.png',
    'http://i.imgur.com/27YQrrR.png',
    'http://i.imgur.com/wB8YQ8G.png',
    'http://i.imgur.com/F9x8zLL.png',
    'http://i.imgur.com/YafspQO.png',
    'http://i.imgur.com/7eCJPH3.png',
    'http://i.imgur.com/dY5jalZ.png',
    'http://i.imgur.com/eqVTX9D.png',
    'http://i.imgur.com/YrfJ0ll.png',
    'https://cdn.discordapp.com/attachments/202102729387147264/692784122506248192/WCn2WhFFby0.png',
    'https://cdn.discordapp.com/attachments/202102729387147264/693482902096314418/4MU7Ocv6HLs.png',
    'http://i.imgur.com/5WxGMok.png',
    'https://cdn.discordapp.com/attachments/202102729387147264/693483022292615178/w480.png',
    'https://cdn.discordapp.com/attachments/202102729387147264/693483057889542224/w480.png',
    'http://i.imgur.com/ctzn2M2.png',
];


function $(selector, pageObj) {
    return pageObj(selector);
}

async function getDocumentObj(url) {
    let html = '';

    try {
        const { data } = await axios.get(url);
        html = data;
    } catch (e) {
        console.error(e);
        throw new Error('соре, не могу получить данные из источника...');
    }

    return cheerio.load(html);
}

async function getStats() {
    const [yandex, worldometers] = await Promise.all([
        getDocumentObj(yandexUrl),
        getDocumentObj(worldometersUrl),
    ]);

    const textTrim = obj => String(obj.text()).trim();

    const worldTr  = $('table#main_table_countries_today tbody tr > td:contains("World")', worldometers).parent();
    const russiaTr = $('table#main_table_countries_today tbody tr > td:contains("Russia")', worldometers).parent();

    let vlgData = undefined;

    try {
        const data = JSON.parse($('script.config-view', yandex).html());

        if (!('covidData' in data)) {
            throw new Error('Not found "covidData" in data!');
        }
        if (!('items' in data.covidData)) {
            throw new Error('Not found "items" in data.covidData!');
        }

        for (const datum of data.covidData.items) {
            if ('name' in datum && datum.name === 'Волгоградская область') {
                vlgData = datum;
            }
        }

        if (vlgData === undefined) {
            throw new Error('Not found vlg in data!');
        }
    } catch (e) {
        console.error('Wrong yandex data! Error: ' + e.message);
    }

    const safeGetVlgData = (name) => {
        return vlgData !== undefined && name in vlgData ? vlgData[name] : '';
    };

    const getVlgInfectedPlus = () => {
        if (safeGetVlgData('cases') === '' || !Array.isArray(safeGetVlgData('histogram'))) {
            return '';
        }
        return `+${String(Number(vlgData.cases) - Number(vlgData.histogram.slice(-2, -1)[0].value))}`;
    };

    return {
        worldStats: {
            infected: {
                total: textTrim(worldTr.find('td:nth-child(2)')),
                plus: textTrim(worldTr.find('td:nth-child(3)')),
            },
            dead: {
                total: textTrim(worldTr.find('td:nth-child(4)')),
                plus: textTrim(worldTr.find('td:nth-child(5)')),
            },
            recovered: {
                total: textTrim(worldTr.find('td:nth-child(6)')),
            },
        },
        russiaStats: {
            infected: {
                total: textTrim(russiaTr.find('td:nth-child(2)')),
                plus: textTrim(russiaTr.find('td:nth-child(3)')),
            },
            dead: {
                total: textTrim(russiaTr.find('td:nth-child(4)')),
                plus: textTrim(russiaTr.find('td:nth-child(5)')),
            },
            recovered: {
                total: textTrim(russiaTr.find('td:nth-child(6)')),
            },
        },
        vlgStats: {
            infected: {
                total: String(safeGetVlgData('cases')),
                plus: getVlgInfectedPlus(),
            },
            dead: {
                total: String(safeGetVlgData('deaths')),
            },
        }
    };
}


module.exports = {
    name: 'coronavirus',
    description: 'данные по короне',
    /*aliases: ['commands'],*/
    /*usage: '[command name]',*/
    async execute(message, args) {
        await message.channel.send('ща посмотрим че там по короне...');

        const stats = await getStats();

        const emojies = {
            infected: `<:thermometer_face:693466410587783218>`,
            dead: `<:skull_crossbones:693465947754725436>`,
            recovered: `<:partying_face:693466487024779264>`,
        };

        const russiaEmoji = message.guild.emojis.find(val => val.id === '522863886865793027') ? ` <a:sukablyatDance:522863886865793027>` : ``;
        const separatePlus = str => str.replace('+', ' + ');

        const embed = new Discord.RichEmbed()
            .setTitle('COVID-19 CORONAVIRUS PANDEMIC')
            .setColor('#b91515')
            .setImage(memeImgUrls[ Math.floor(Math.random() * memeImgUrls.length) ])
            .setThumbnail('http://i.imgur.com/8fejMVp.png')
            .addField(
                '**ВЕСЬ МИР**',
                [
                    `${emojies.infected} ${separatePlus(stats.worldStats.infected.total + stats.worldStats.infected.plus)}`,
                    `${emojies.dead} ${separatePlus(stats.worldStats.dead.total + stats.worldStats.dead.plus)}`,
                    `${emojies.recovered} ${stats.worldStats.recovered.total}`
                ].join('\n'),
                true
            )
            .addField(
                `**РОССИЯ**${russiaEmoji}`,
                [
                    `${emojies.infected} ${separatePlus(stats.russiaStats.infected.total + stats.russiaStats.infected.plus)}`,
                    `${emojies.dead} ${separatePlus(stats.russiaStats.dead.total + stats.russiaStats.dead.plus)}`,
                    `${emojies.recovered} ${stats.russiaStats.recovered.total}`
                ].join('\n'),
                true
            )
            .addField(
                '**ВОЛГОГРАД**',
                [
                    `${emojies.infected} ${separatePlus(stats.vlgStats.infected.total + stats.vlgStats.infected.plus)}`,
                    `${emojies.dead} ${stats.vlgStats.dead.total}`,
                ].join('\n'),
                true
            );

        await message.channel.send(embed);
    },
};
