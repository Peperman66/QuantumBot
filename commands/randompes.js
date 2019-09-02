const Discord = require("discord.js");
const config = require("./../config.json");
const https = require("https");

module.exports.run = async (bot, message, args) => {

	https.get(`https://random.dog/woof.json`, (res) => {
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData);
				console.log(parsedData);
				let dogEmbed = new Discord.RichEmbed()
					.setColor(config.embeds.infoColor)
					.setTitle('Pes :dog:')
					.setImage(parsedData.url);
				message.channel.send(dogEmbed);
			} catch (e) {
				console.error(e.message);
			}
		});

	});

	

}

module.exports.help = {
	name: "randompes"
}