require('dotenv').config();
const Discord = require("discord.js");
const config = require('./config.json');
const fs = require('fs');
const http = require('http');
const bot = new Discord.Client({ disableEveryone: true });

bot.commands = new Discord.Collection();

fs.readdir(config.commandDirectory, (err, files) => {
    if (err) return console.log(err);

    let jsfile = files.filter(f => f.split('.').pop() === 'js');

    if (jsfile.length <= 0) return console.log("Couldn't find commands.");

    jsfile.forEach((f, i) => {
        let props = require(config.commandDirectory + `/${f}`);
        console.log(`${f} loaded`);
        bot.commands.set(props.help.name, props);
    });

});

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    let prefix = config.prefix;
    let messageArray = message.content.split(' ');
    let cmd = messageArray[0];
    let args = messageArray.splice(1);
    let commandFile = bot.commands.get(cmd.slice(prefix.length));
    if (cmd.slice(0, config.prefix.length) === config.prefix) {
        await commandFile.run(bot, message, args)
            .catch((err) => console.log(err));
    }
});

bot.on('error', async error => console.log(error));

bot.login(process.env.TOKEN);

const server = http.createServer((req, res) => {
    if (req.url === '/'){
        res.writeHead(200);
        res.end();
    }
}).listen(80);