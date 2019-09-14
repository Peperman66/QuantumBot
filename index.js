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

bot.on('ready', () => {
    bot.user.setActivity(',help for help');
});

bot.on('error', async error => console.log(error));

bot.login(process.env.TOKEN);

const server = http.createServer((req, res) => {
    if (req.url === '/'){
        res.writeHead(200);
        res.end();
    }
}).listen(80);