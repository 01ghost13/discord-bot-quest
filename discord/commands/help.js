const config = require('../../config');


module.exports = {
    name: 'help',
    description: 'список команд',
    /*aliases: ['commands'],*/
    usage: '[command name]',
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Команды');
            data.push(
                commands
                    .map(command => `\`${config.prefix}${command.name}${command.usage ? (' ' + command.usage) : ''}\`: ${command.description}`)
                    .join('\n')
            );

            return message.channel.send(data, { split: true });
        }

        const name    = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('такой команды не существует!');
        }

        data.push(`\`${config.prefix}${command.name}${command.usage ? (' ' + command.usage) : ''}\`: ${command.description}`);

        return message.channel.send(data, { split: true });
    },
};
