const Discord = require("discord.js");
const config = require("./../config.json");
const ms = require('ms');

module.exports.run = async (bot, message, args) => {
    message.delete();
    if (args[0] == null) return message.channel.send(`Použití: ${"``"}${config.prefix}anketa <otázka>${"``"}`)
    .then(message => {
            message.delete(10000);
    });
    const filter = (reaction, user) => !user.bot;
    const yes = '👍';
    const no = '👎';
    const userCount = message.guild.members.filter(member => !member.user.bot).size;
    let question = args.join(' ');
    let embed = new Discord.RichEmbed()
        .setTitle("Nová anketa!")
        .setColor(0x00ffff)
        .setDescription(question)
        .setFooter(`0/${userCount} hlasovalo`)
        .setTimestamp(new Date());
    let questionMessage = await message.channel.send(embed)
    questionMessage.react(yes)
    .then(questionMessage.react(no))
    const collector = questionMessage.createReactionCollector(filter, {time: ms('5min') });
    
    let yescount = 0;
    let nocount = 0;
    let users = [message.author];

    collector.on('collect', (reaction, reactionCollector) => {
        console.log(`Collected ${reaction.emoji.name}`);
        if (!users.includes(reaction.users.last())){
            if (reaction.emoji == yes) {
                yescount++;
                users.push(reaction.users.last());
                reaction.users.last().send("Hlasoval jsi pro ano.");
                embed.setFooter(`${users.length - 1}/${userCount} hlasovalo`).setTimestamp(new Date());
                questionMessage.edit(embed);
            } else if (reaction.emoji == no){
                nocount++;
                users.push(reaction.users.last());
                reaction.users.last().send("Hlasoval jsi pro ne.");
                embed.setFooter(`${users.length - 1}/${userCount} hlasovalo`).setTimestamp(new Date());
                questionMessage.edit(embed);
            }
            if (users.length === userCount-1){
                collector.stop();
            }
        } else {
            if (reaction.users.last() == message.author) {
                reaction.users.last().send("Nemůžeš hlasovat, protože jsi vytvořil anketu.");
            } else {
                reaction.users.last().send("Už jsi hlasoval!");
            }
        }

        reaction.remove(reaction.users.last());
    });

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
        questionMessage.delete();
        message.channel.send(`Výsledky hlasování: ${yescount}x ano, ${nocount}x ne`);
    });
}

module.exports.help = {
    name: "anketa",
    help: "Vytvoří anketu."
}