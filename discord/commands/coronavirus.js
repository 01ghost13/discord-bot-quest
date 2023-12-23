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

    let top = [];
    let russiaData = {
        name: 'Россия',
        infected: {
            total: 0,
            plus: 0,
        },
        dead: {
            total: 0,
        },
    };
    let vlgData = undefined;

    const safeGetData = (obj, name) => {
        return obj !== undefined && name in obj ? obj[name] : '';
    };

    const getInfectedPlus = (obj) => {
        if (safeGetData(obj, 'cases') === '' || !Array.isArray(safeGetData(obj, 'histogram'))) {
            return '';
        }

        return `+${String(Number(obj.cases) - Number(obj.histogram.slice(-2, -1)[0].value))}`;
    };

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

            const curr = {
                name: datum.name,
                infected: {
                    total: String(safeGetData(datum, 'cases')),
                    plus: getInfectedPlus(datum),
                },
                dead: {
                    total: String(safeGetData(datum, 'deaths')),
                },
            };

            top.push(curr);

            if ('ru' in datum && datum.ru === true) {
                russiaData.infected.total += +curr.infected.total;
                russiaData.infected.plus  += +curr.infected.plus;

                russiaData.dead.total += +curr.dead.total;
            }
        }

        top.push(russiaData);

        if (vlgData === undefined) {
            throw new Error('Not found vlg in data!');
        }
    } catch (e) {
        console.error('Wrong yandex data! Error: ' + e.message);
    }

    return {
        worldStats: {
            infected: {
                total: textTrim(worldTr.find('td:nth-child(3)')),
                plus: textTrim(worldTr.find('td:nth-child(4)')),
            },
            dead: {
                total: textTrim(worldTr.find('td:nth-child(5)')),
                plus: textTrim(worldTr.find('td:nth-child(6)')),
            },
            recovered: {
                total: textTrim(worldTr.find('td:nth-child(7)')),
            },
        },
        russiaStats: {
            infected: {
                total: textTrim(russiaTr.find('td:nth-child(3)')),
                plus: textTrim(russiaTr.find('td:nth-child(4)')),
            },
            dead: {
                total: textTrim(russiaTr.find('td:nth-child(5)')),
                plus: textTrim(russiaTr.find('td:nth-child(6)')),
            },
            recovered: {
                total: textTrim(russiaTr.find('td:nth-child(7)')),
            },
        },
        vlgStats: {
            infected: {
                total: String(safeGetData(vlgData, 'cases')),
                plus: getInfectedPlus(vlgData),
            },
            dead: {
                total: String(safeGetData(vlgData, 'deaths')),
            },
        },
        top: top.sort((a, b) => b.infected.total - a.infected.total).slice(0, 5)
    };
}


module.exports = {
    name: 'coronavirus',
    description: 'данные по короне',
    /*aliases: ['commands'],*/
    /*usage: '[command name]',*/
    async execute(message, args) {
        await message.channel.send('Какая корона, ты еблан?');
    },
};
