const Discord = require("discord.js");
const config = require("./../config.json");
const https = require("https");

module.exports.run = async (bot, message, args) => {

	https.get(`https://aws.random.cat/meow`, (res) => {
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData);
				console.log(parsedData);
				let catEmbed = new Discord.RichEmbed()
					.setColor(config.embeds.infoColor)
					.setTitle('Kočka :cat:')
					.setImage(parsedData.file);
				message.channel.send(catEmbed);
			} catch (e) {
				console.error(e.message);
			}
		});
		
	});
}

module.exports.help = {
	name: "randomkocka"
}