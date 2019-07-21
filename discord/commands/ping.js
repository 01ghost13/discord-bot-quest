module.exports = {
    name: 'ping',
    description: 'тупо пинг',
    /*usage: '[ping]',*/
    execute (message, args) {
        message.channel.send('pong');
    },
};
