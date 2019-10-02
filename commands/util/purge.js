const Commando = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class ReplyCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            group: 'util',
            memberName: 'purge',
            userPermissions: ['MANAGE_MESSAGES'],
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
        if (messages > 10) {
             return message.reply("You can't delete more than 10 messages at once.");
        } else {
            message.channel.fetchMessages({ limit: (messages+1) })
                .then(messages => message.channel.bulkDelete(messages));
        }
        
    }
}