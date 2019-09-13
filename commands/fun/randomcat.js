const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const config = require("./../../config.json");
const https = require("https");

module.exports = class ReplyCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'randomcat',
			group: 'fun',
			memberName: 'randomcat',
			description: 'Sends a random picture of a cat'
		});
	}

	run(message) {
		https.get(`https://aws.random.cat/meow`, (res) => {
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData);
					console.log(parsedData);
					let catEmbed = new Discord.RichEmbed()
						.setColor(config.embeds.infoColor)
						.setTitle('Cat :cat:')
						.setImage(parsedData.file);
					message.embed(catEmbed);
				} catch (e) {
					console.error(e.message);
				}
			});

		});
	}
}