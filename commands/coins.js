exports.run = (client, message, args) => {
		const key = `${message.guild.id}-${message.author.id}`;
		message.channel.send(`You have **${client.points.get(key, "points")}** coins.`);
}