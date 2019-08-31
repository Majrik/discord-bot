const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");

const client = new Discord.Client();
const config = require("./config.json");
client.config = config;

client.on("ready", function () {
  let channel = client.channels.get('410116486896549890');
  channel.fetchMessage('586976206138900510');
});


//client.on("error", (e) => console.error(e));

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();
client.points = new Enmap({name: "points"});
client.tower = new Enmap({name: "tower"});
client.trivia = new Discord.Collection();
//console.log(client.points.count());
//client.destroy("points");
//client.points.deleteAll();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});
 
client.login(config.token);