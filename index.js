require('dotenv').config();
const Commando = require("discord.js-commando");
const config = require('./config.json');
const fs = require('fs');
const path = require('path');
const http = require('http');
const bot = new Commando.Client({
    commandPrefix: ',',
    owner: '272106575127117824',
    disableEveryone: true,
    nonCommandEditable: false
});

bot.registry
    // Registers your custom command groups
    .registerGroups([
        ['fll', 'FLL related commands'],
        //['lego', 'Lego related commands'],
        ['fun', 'Fun commands'],
        ['util', 'Useful commands']
    ])

    // Registers all built-in groups, commands, and argument types
    .registerDefaults()

    // Registers all of your commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, config.commandDirectory));

/*bot.commands = new Discord.Collection();

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
*/
bot.on('error', async error => console.log(error));

bot.login(process.env.TOKEN);

const server = http.createServer((req, res) => {
    if (req.url === '/'){
        res.writeHead(200);
        res.end();
    }
}).listen(80);