exports.run = (client, message, args) => {
    delete client.trivia;
    message.channel.send("reset ok");
}