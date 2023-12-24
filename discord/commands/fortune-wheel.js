function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInt(min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

class Wheel {
    constructor(msg, size) {
        this.msg = msg;
        this.size = size;
        this.cursor = 0;
    }

    static async create(channel, size) {
        return new Wheel(await channel.send(Wheel.getWheelView(0, size)), size);
    }

    setCursorAtVariant(variant) {
        if (variant < 1 || variant > this.size) {
            throw new Error(`Variant "${variant}" not valid!`);
        }

        this.cursor = this.getVariantPosition(variant);
    }

    setCursor(cursor) {
        if (cursor < 0 || cursor > 8) {
            throw new Error(`Cursor "${cursor}" not valid!`);
        }

        this.cursor = cursor;
    }

    async spinWheel() {
        const winner = randomInt(1, this.size);

        this.setCursor(0);

        for (let cursor = 1; cursor <= 8; cursor++) {
            this.setCursor(cursor);
            await this.render();
            await sleep(500);
        }

        this.setCursor(1);
        await this.render();
        await sleep(1000);

        for (let cursor = 2; cursor <= 8; cursor++) {
            this.setCursor(cursor);
            await this.render();

            const variantPos = this.getVariantPosition(winner);

            if (cursor === variantPos) {
                return winner;
            }

            await sleep((cursor + 1 === variantPos || cursor === 8) ? 2000 : 1000);
        }

        this.setCursor(1);
        await this.render();

        if (winner !== 1) {
            throw new Error(`Something went wrong, winner "${winner}" not found!`);
        }

        return winner;
    }

    async render() {
        return this.msg.edit(Wheel.getWheelView(this.cursor, this.size));
    }

    static getCursorView(cursor) {
        const views = {
            0: ':blue_square:',
            1: ':arrow_upper_left:',
            2: ':arrow_up:',
            3: ':arrow_upper_right:',
            4: ':arrow_right:',
            5: ':arrow_lower_right:',
            6: ':arrow_down:',
            7: ':arrow_lower_left:',
            8: ':arrow_left:',
        };

        if (!(cursor in views)) {
            throw new Error(`Cursor view for "${cursor}" not found!`);
        }

        return views[cursor];
    }

    static getWheelView(cursor, size, beforeText = '', afterText = '') {
        const cursorView = Wheel.getCursorView(cursor);
        const views = {
            2: `:one::blue_square::blue_square:\n:blue_square:${cursorView}:blue_square:\n:blue_square::blue_square::two:`,
            3: `:one::blue_square::two:\n:blue_square:${cursorView}:blue_square:\n:blue_square::blue_square::three:`,
            4: `:one::blue_square::two:\n:blue_square:${cursorView}:blue_square:\n:four::blue_square::three:`,
            5: `:one::two::three:\n:blue_square:${cursorView}:blue_square:\n:five::blue_square::four:`,
            6: `:one::two::three:\n:blue_square:${cursorView}:blue_square:\n:six::five::four:`,
            7: `:one::two::three:\n:blue_square:${cursorView}:four:\n:seven::six::five:`,
            8: `:one::two::three:\n:eight:${cursorView}:four:\n:seven::six::five:`,
        };

        if (!(size in views)) {
            throw new Error(`Wheel view for "${size}" not found!`);
        }

        return [beforeText, views[size], afterText].filter(str => str.length > 0).join('\n');
    }

    getVariantPosition(variant) {
        const map = {
            // руки на стол, пробелы не править!
            2: {
                1: 1,

                2: 5,
            },
            3: {
                1: 1,       2: 3,

                3: 5,
            },
            4: {
                1: 1,       2: 3,

                4: 7,       3: 5,
            },
            5: {
                1: 1, 2: 2, 3: 3,

                5: 7,       4: 5,
            },
            6: {
                1: 1, 2: 2, 3: 3,

                6: 7, 5: 6, 4: 5,
            },
            7: {
                1: 1, 2: 2, 3: 3,
                4: 4,
                7: 7, 6: 6, 5: 5,
            },
            8: {
                1: 1, 2: 2, 3: 3,
                8: 8,       4: 4,
                7: 7, 6: 6, 5: 5,
            },
        };

        if (!(this.size in map) || !(variant in map[this.size])) {
            throw new Error(`Variant position "${variant}" for "${this.size}" not found!`);
        }

        return map[this.size][variant];
    }
}

module.exports = {
    name: 'fortune-wheel',
    description: 'колесо фортуны',
    async execute (message, args) {
        const rows = message.content.split('\n');

        if (rows.length < 3 || rows.length > 9) {
            await message.channel.send(`ничо не понял, пошел ты нахер, пиши нормально :japanese_goblin:`);
            return;
        }

        const wheel = await Wheel.create(message.channel, rows.length - 1);

        setTimeout(async () => {
            const result = await wheel.spinWheel();
            await message.channel.send(`:tada: ${rows[result]}`);
        }, 1000);
    },
};
