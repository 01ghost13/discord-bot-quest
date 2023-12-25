const axios = require('axios');
const jimp = require('jimp');
const fs = require('fs');

const imgUrl = 'https://memepedia.ru/wp-content/uploads/2018/01/%D0%BC%D0%B5%D0%BC-%D0%B8-%D0%BC%D0%BE%D0%B5%D0%BC%D1%83-%D1%81%D1%8B%D0%BD%D1%83-%D1%82%D0%BE%D0%B6%D0%B5-6.jpg';

module.exports = {
    name: 'exchange',
    description: 'че там по валюте?',
    usage: '[currency code]',
    async execute (message, args) {
        let code = args.length ? String(args[0]) : '';

        if (code.length === 0 || !['usd', 'eur'].includes(code)) {
            message.channel.send('по какой валюте интересуемся? eur или usd?');
            return;
        }

        try {
            let { data } = await axios.get(`https://quotes.instaforex.com/api/quotesTick?q=${code}rur`);

            if (data.length === 0) {
                message.channel.send(`ничо не понел, соре`);
            } else {
                let val = 'bid' in data[0] ? data[0].ask : 0;

                if (val <= 0) {
                    message.channel.send(`чота нихера не нашел, соре`);
                } else {
                    const map = {
                        'usd': 'ДОЛЛАРЫ',
                        'eur': 'ЕВРОСЫ',
                    };

                    const font = await jimp.loadFont('./font/font.fnt');
                    const img = await jimp.read(imgUrl);

                    img.print(font, 15, 5, `МНЕ ${map[code]} ПО ${val.toFixed(2)} И МОЕМУ СЫНУ ТОЖЕ`);
                    const filename = '__exchange_img.jpg';
                    img.write(filename);

                    await message.channel.send({ files: [ filename ] });

                    fs.unlink(filename, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }

        // делать шрифты - http://kvazars.com/littera/

        // старая инфа https://prime.exchangerate-api.com/v5/90beb9b34188446acf1c0b2b/latest/USD

        /*
         * Например, при текущей котировке валютной пары EUR/USD 1,2805 подразумевается, что цена Bid, по которой
         * готовы купить евро, равна 1,2805, а цена Ask, по которой готовы продать евро, равна 1,2807.
         * Таким образом, спрэд в данном случае составит 2 пункта.
         *
         * https://fortrader.org/learn/forex-trader/ceny-ask-i-bid-eshhe-odin-klyuch-k-vashej-pribyli-na-rynke-foreks.html
         */

        // https://partners.instaforex.com/ru/quotes_description.php/
        // ТУПО ПУШКА https://quotes.instaforex.com/api/quotesTick?q=usdrub
    },
};
