const request = require("request");
exports.run = (client, message, args) => {			
		let url = "https://www.googleapis.com/youtube/v3/search?part=id&q="+args.join(" ")+"&type=video&maxResults=1&key=AIzaSyBT2VGzJ5wez2wQOXTf07FpZGpKt-efmVA";
			request(encodeURI(url), function (error, response, body) {
				let ytJSON = JSON.parse(body);
				try{
					if(ytJSON.items.length == 0)
						message.channel.send("0 results");
					for(video of ytJSON.items) {
						message.channel.send("https://www.youtube.com/watch?v="+video.id.videoId);
					}
				}
				catch(err)
				{
					message.channel.send("Chyba: " + err);
				}
				
			});
}