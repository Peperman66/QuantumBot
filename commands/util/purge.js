const Commando = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class ReplyCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            group: 'util',
            memberName: 'purge',
            description: 'Removes messages from the channel',
            examples: ['purge 10'],
            args: [{
                key: 'messages',
                label: 'number of messages',
                prompt: 'How many messages do you want to remove?',
                type: 'integer'
            }]
        });
    }

    run(message, {messages} ) {
        message.channel.fetchMessages({ limit: (messages+1) })
            .then(messages => message.channel.bulkDelete(messages));
        
    }
}