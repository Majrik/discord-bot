const request = require("request");
exports.run = (client, message) => {
    request("http://svatky.adresa.info/json", function (error, response, body) {
			let svatky = JSON.parse(body);
			for(svatek of svatky) {
			message.channel.send(svatek.name);
			}
		});
}