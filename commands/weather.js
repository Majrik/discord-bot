const request = require("request");
exports.run = (client, message, args) => {

	let url = "http://api.openweathermap.org/data/2.5/weather?q=" + args.join(" ") + "&appid=83a1073fa9c507055ac548c14dc32507&lang=cz&units=metric";
	request(encodeURI(url), function (error, response, body) {
		let weatherJSON = JSON.parse(body);
		try {
			let temperature = weatherJSON.main.temp;
			let country = weatherJSON.sys.country;
			let city = weatherJSON.name;

			for (description of weatherJSON.weather) {
				message.channel.send("The weather in city  " + city + ", " + country + ": " + temperature + "°C, " + description.description);
			}
		}
		catch (err) {
			message.channel.send("Error: " + err);
		}

	});
}