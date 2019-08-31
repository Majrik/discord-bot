exports.run = (client, message, args) => {
	const datetime = new Date();
	const datetimeAddHour = datetime.setHours(datetime.getHours() + 1);
	const datetimeAddDay = datetime.setHours(datetime.getHours() + 23);
	const key = `${message.guild.id}-${message.author.id}`;
	client.points.ensure(key, {
		user: message.author.id,
		guild: message.guild.id,
		points: 1,
		level: 1,
		datetimeWithHour: datetimeAddHour,
		datetimePlusDay: datetimeAddDay
	});
	if (Date.now() < client.points.get(key, 'datetimePlusDay')) {
		const distance = client.points.get(key, 'datetimePlusDay') - new Date().getTime();
		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
		const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((distance % (1000 * 60)) / 1000);
		message.channel.send(`You must wait another \`${hours}\` hours, \`${minutes}\` minutes and \`${seconds}\` seconds.`);
	}
	else {
		client.points.inc(key, "points");
		const dailyPoints = Math.floor(Math.random() * 100) + 1;
		message.channel.send(`You've just earned **${dailyPoints}** coins.`);
		client.points.set(key, datetimeAddDay, 'datetimePlusDay');
	}
}