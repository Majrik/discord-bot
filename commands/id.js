exports.run = (client, message, args) => {
    message.channel.send(`Your Discord ID is: ${message.member.id}`);
}