const request = require("request");
exports.run = (client, message) => {
let url = "http://aws.random.cat/meow";
		request(encodeURI(url), function (error, response, body) {
				let catJSON = JSON.parse(body);
				message.channel.send(catJSON.file);
			});
}