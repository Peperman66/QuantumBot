const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const config = require("./../../config.json");
const ms = require('ms');

module.exports = class ReplyCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'anketa',
            group: 'fll',
            memberName: 'anketa',
            description: 'Creates a poll',
            examples: ['anketa Do you like cats?'],
            args: [{
                    key: 'question',
                    prompt: 'What question would you like to ask?',
                    type: 'string'
                }]
        });
    }

    async run(message, {question}) {
        message.delete();
        const filter = (reaction, user) => !user.bot;
        const yes = '👍';
        const no = '👎';
        const users = message.guild.members;
        const availableUsers = users.filter(u => message.channel.memberPermissions(u).has('VIEW_CHANNEL', false))
        let userCount = availableUsers.filter(u => !u.user.bot).size - 1;
        let embed = new Discord.RichEmbed()
            .setTitle("Nová anketa!")
            .setColor(config.embeds.infoColor)
            .setDescription(question)
            .setFooter(`0/${userCount} hlasovalo`)
            .setTimestamp(new Date());
        let questionMessage = await message.channel.send(embed)
        questionMessage.react(yes)
            .then(() => questionMessage.react(no));
        const collector = questionMessage.createReactionCollector(filter, { time: ms('5min') });

        let yescount = 0;
        let nocount = 0;
        let usersData = { users: [{ userId: message.author.id, vote: null }] };

        collector.on('collect', (reaction, reactionCollector) => {
            console.log(`Collected ${reaction.emoji.name}`);
            if (!usersData.users.some(user => user.userId === reaction.users.last().id)) {
                if (reaction.emoji == yes) {
                    yescount++;
                    let userData = {
                        userId: reaction.users.last().id,
                        vote: "yes"
                    }
                    usersData.users.push(userData);
                    reaction.users.last().send(`V anketě \`\`${question}\`\` jsi hlasoval pro ano.`);
                    embed.setFooter(`${usersData.users.length - 1}/${userCount} hlasovalo`).setTimestamp(new Date());
                    questionMessage.edit(embed);
                } else if (reaction.emoji == no) {
                    nocount++;
                    let userData = {
                        userId: reaction.users.last().id,
                        vote: "no"
                    }
                    usersData.users.push(userData);
                    reaction.users.last().send(`V anketě \`\`${question}\`\` jsi hlasoval pro ne.`);
                    embed.setFooter(`${usersData.users.length - 1}/${userCount} hlasovalo`).setTimestamp(new Date());
                    questionMessage.edit(embed);
                }
                if (usersData.users.length === userCount) {
                    collector.stop();
                }
            } else {
                if (reaction.users.last() == message.author) {
                    reaction.users.last().send("Nemůžeš hlasovat, protože jsi vytvořil anketu.");
                } else {
                    if (reaction.emoji == yes && usersData.users.find((user) => reaction.users.last().id === user.userId).vote === "no") {
                        yescount++;
                        nocount--;
                        usersData.users.find((user) => reaction.users.last().id === user.userId).vote = "yes";
                        reaction.users.last().send(`V anketě \`\`${question}\`\` jsi změnil svůj hlas na ano.`);
                        embed.setFooter(`${usersData.users.length - 1}/${userCount} hlasovalo`).setTimestamp(new Date());
                        questionMessage.edit(embed);
                    } else if (reaction.emoji == no && usersData.users.find((user) => reaction.users.last().id === user.userId).vote === "yes") {
                        nocount++;
                        yescount--;
                        usersData.users.find((user) => reaction.users.last().id === user.userId).vote = "no";
                        reaction.users.last().send(`V anketě \`\`${question}\`\` jsi změnil svůj hlas na ne.`);
                        embed.setFooter(`${usersData.users.length - 1}/${userCount} hlasovalo`).setTimestamp(new Date());
                        questionMessage.edit(embed);
                    }
                }
            }

            reaction.remove(reaction.users.last());
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
            questionMessage.delete();
            message.channel.send(`Výsledky hlasování ankety \`\`${question}\`\`: ${yescount}x ano, ${nocount}x ne`);
        });
    }
    
}