const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const config = require("./../../config.json");
const ms = require('ms');

module.exports = class ReplyCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'poll',
            aliases: ['anketa'],
            group: 'fll',
            memberName: 'poll',
            description: 'Creates a poll. Please note: this command is under development',
            examples: ['poll "Do you like cats?" 10min', 'poll "What is 1+1?" 6h 0 | 1 | 2'],
            args: [{
                    key: 'question',
                    prompt: 'What question would you like to ask? The question has to be in quotation marks. (``" "``)',
                    type: 'string'
                   },
                   {
                   key: 'time',
                   prompt: 'How long do you want for the poll to exist? Default is 24h. Example: ``1min``, ``5h``',
                   type: 'string',
                   default: '24h'
                   },
                   {
                    key: 'answers',
                    prompt: 'What can users submit? Separate answers with \`\`|\`\`. Type with \`\`Ctrl+Alt+W\`\`.',
                    type: 'string',
                    default: '',
                    parse: parse
                   }]
        });
    }

    async run(message, {question, time, answers}) {
        message.delete();
        console.log(answers);
        const filter = (reaction, user) => !user.bot;
        let mode;
        if (answers.length > 0) {
            mode = 'Other';
        } else {
            mode = 'YesNo';
        }
        const yes = '👍';
        const no = '👎';
        const emoji = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫'];
        let text = question;
        for (let i = 0; i < answers.length; i++) {
            text += '\n' + emoji[i] + ' ' + answers[i];
        }
        const users = message.guild.members;
        const availableUsers = users.filter(u => message.channel.memberPermissions(u).has('VIEW_CHANNEL', false))
        const userCount = availableUsers.filter(u => !u.user.bot).size;
        let embed = new Discord.RichEmbed()
            .setTitle("New poll!")
            .setColor(config.embeds.infoColor)
            .setDescription(text)
            .setFooter(`0/${userCount} voted`)
            .setTimestamp(new Date() + ms(time));
        let questionMessage = await message.channel.send(embed)
        if (mode === 'YesNo') {
            questionMessage.react(yes)
                .then(() => questionMessage.react(no));
        } else {
            for (let i = 0; i < answers.length; i++) {
                await questionMessage.react(emoji[i])
            }
        }
        const collector = questionMessage.createReactionCollector(filter, { time: ms(time) });

        let yescount = 0;
        let nocount = 0;
        let answercount = new Array(answers.length).fill(0)
        let usersData = { users: [] };

        collector.on('collect', (reaction, reactionCollector) => {
            console.log(`Collected ${reaction.emoji.name}`);
            if (!usersData.users.some(user => user.userId === reaction.users.last().id)) {
                if (mode === 'YesNo') {
                    if (reaction.emoji == yes) {
                        yescount++;
                        let userData = {
                            userId: reaction.users.last().id,
                            vote: "yes"
                        }
                        usersData.users.push(userData);
                        reaction.users.last().send(`You voted for yes in the poll \`\`${question}\`\`.`);
                        embed.setFooter(`${usersData.users.length}/${userCount} voted`)
                        questionMessage.edit(embed);
                    } else if (reaction.emoji == no) {
                        nocount++;
                        let userData = {
                            userId: reaction.users.last().id,
                            vote: "no"
                        }
                        usersData.users.push(userData);
                        reaction.users.last().send(`You voted for yes in the poll \`\`${question}\`\`.`);
                        embed.setFooter(`${usersData.users.length}/${userCount} voted`)
                        questionMessage.edit(embed);
                    }
                    if (usersData.users.length === userCount) {
                        collector.stop();
                    }
                } else {
                    for (let i = 0; i < answers.length; i++) {
                        if (reaction.emoji == emoji[i]) {
                            answercount[i]++;
                            let userData = {
                                userId: reaction.users.last().id,
                                vote: i
                        }
                        usersData.users.push(userData);
                            reaction.users.last().send(`You voted for \`\`${answers[i]}\`\` in the poll \`\`${question}\`\`.`);
                        embed.setFooter(`${usersData.users.length}/${userCount} voted`)
                        questionMessage.edit(embed);
                        }
                    }
                }
            } else {
                if (mode === "YesNo") {
                    if (reaction.emoji == yes && usersData.users.find((user) => reaction.users.last().id === user.userId).vote === "no") {
                        yescount++;
                        nocount--;
                        usersData.users.find((user) => reaction.users.last().id === user.userId).vote = "yes";
                        reaction.users.last().send(`Your vote was changed to yes in the poll \`\`${question}\`\`.`);
                        embed.setFooter(`${usersData.users.length}/${userCount} voted`)
                        questionMessage.edit(embed);
                    } else if (reaction.emoji == no && usersData.users.find((user) => reaction.users.last().id === user.userId).vote === "yes") {
                        nocount++;
                        yescount--;
                        usersData.users.find((user) => reaction.users.last().id === user.userId).vote = "no";
                        reaction.users.last().send(`Your vote was changed to no in the poll \`\`${question}\`\`.`);
                        embed.setFooter(`${usersData.users.length}/${userCount} voted`)
                        questionMessage.edit(embed);
                    }
                } else {
                    for (let i = 0; i < answers.length; i++) {
                        if (reaction.emoji == emoji[i] && usersData.users.find((user) => reaction.users.last().id === user.userId).vote != i) {
                            answercount[i]++;
                            answercount[usersData.users.find((user) => reaction.users.last().id === user.userId).vote]--;
                            usersData.users.find((user) => reaction.users.last().id === user.userId).vote = i;
                            reaction.users.last().send(`Your vote was changed to \`\`${answers[i]}\`\` in the poll \`\`${question}\`\`.`);
                            embed.setFooter(`${usersData.users.length}/${userCount} voted`)
                            questionMessage.edit(embed);
                        };
                    };
                };
            };

            reaction.remove(reaction.users.last());
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
            questionMessage.delete();
            if (mode === "YesNo") {
                message.channel.send(`Results of the poll \`\`${question}\`\`: ${yescount}x yes, ${nocount}x no.`);
            } else {
                let text = `Results of the poll \`\`${question}\`\`:`;
                for (let i = 0; i < answers.length; i++) {
                    text += ` ${answercount[i]}× \`\`${answers[i]}\`\``;
                }
                text += '.';
                message.channel.send(text);
            };

        });
    };
    
};

function parse(val, msg, arg) {
    if (val === undefined) return null;
    val = val.replace(/(\s*\|\s*)+/g, "|").replace(/(^\|)|(\|$)/g, "")
    return val.split("|");
}