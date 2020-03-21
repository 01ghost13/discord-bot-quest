const responses = [
    {
        imgUrl: 'http://i.imgur.com/4QJsSV3.png',
        phrase: 'погнали ебать димана',
    },
    {
        imgUrl: 'https://cdn.discordapp.com/attachments/202102729387147264/690901558778658846/desktop.png',
        phrase: 'АЛЛО СОБАКИ В ДИСКОРД ПОСМОТРЕЛИ',
    },
    {
        imgUrl: 'https://cdn.discordapp.com/attachments/202102729387147264/690901029847564288/524a5e8f6e32e5d605d19e1459bbb453.png',
        phrase: 'гачипати объявляется открытой',
    },
    {
        imgUrl: 'http://i.imgur.com/woTfCx0.png',
        phrase: 'пссс, парни хотите немного плей?',
    },
    {
        imgUrl: 'http://i.imgur.com/eWXMUoz.png',
        phrase: '',
    },
    {
        imgUrl: 'http://i.imgur.com/uLnEtWv.png',
        phrase: '',
    },
    {
        imgUrl: 'http://i.imgur.com/fMSHAn3.png',
        phrase: 'ёбка начинается',
    },
    {
        imgUrl: 'http://i.imgur.com/CMCmIQe.png',
        phrase: 'а ты?',
    },
    {
        imgUrl: 'http://i.imgur.com/hVCaLxY.png',
        phrase: '',
    },
    {
        imgUrl: 'http://i.imgur.com/nHhZQw4.png',
        phrase: 'присоединяйся',
    },
    {
        imgUrl: 'http://i.imgur.com/6ciB2Vw.png',
        phrase: 'ждем только тебя',
    },
];


module.exports = {
    name: 'conscription',
    description: 'общий сбор',
    /*usage: '[]',*/
    async execute (message, args) {
        let mentions = [];

        message.guild.members.forEach(member => {
            const user = member.user;

            if (user.bot || user.id === message.author.id) {
                return;
            }

            mentions.push(`<@${user.id}>`);
        });

        const response = responses[ Math.floor(Math.random() * responses.length) ];

        message.channel.send(
            `${mentions.join(' ')} ${response.phrase}`,
            {
                files: [ response.imgUrl ]
            }
        );
    },
};
