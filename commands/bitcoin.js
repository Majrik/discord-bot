const request = require("request");
exports.run = (client, message) => {
	let url = "https://api.iextrading.com/1.0/stock/market/crypto";
	request(encodeURI(url), function (error, response, body) {
		if (error) {
			message.channel.send(`Error: ${error}`);
		}
		else {
			let bitcoinJSON = JSON.parse(body);
			message.channel.send(bitcoinJSON[0].latestPrice + " $");
		}
	});
}