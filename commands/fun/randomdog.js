const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const config = require("./../../config.json");
const https = require("https");

module.exports = class ReplyCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'randomdog',
			group: 'fun',
			memberName: 'randomdog',
			description: 'Sends a random picture of a dog'
		});
	}

	run(message) {
		https.get(`https://random.dog/woof.json`, (res) => {
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData);
					console.log(parsedData);
					let dogEmbed = new Discord.RichEmbed()
						.setColor(config.embeds.infoColor)
						.setTitle('Dog :dog:')
						.setImage(parsedData.url);
					message.embed(dogEmbed);
				} catch (e) {
					console.error(e.message);
				}
			});

		});
	}
}