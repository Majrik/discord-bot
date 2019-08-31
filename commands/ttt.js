const Discord = require("discord.js");
exports.run = (client, message, args) => {
    if (args == "") {
        message.channel.send("You've not entered an username.");
        return;
    }
    else if (message.mentions.users.first().bot == true) {
        message.channel.send("You can't play against the bot.");
        return;
    }
    
    let mentionedUser = message.mentions.users.first().id;
    let messageToSend = `It's ${message.mentions.users.first()}'s turn`;
    let messageID;
    let author = message.author.id;
    let tttBoard = [
        ["\:white_large_square:", "\:white_large_square:", "\:white_large_square:"],
        ["\:white_large_square:", "\:white_large_square:", "\:white_large_square:"],
        ["\:white_large_square:", "\:white_large_square:", "\:white_large_square:"]
    ];
    for (row of tttBoard) {
        messageToSend += "\n";
        for (row2 of row) {
            messageToSend += row2;
        }
    }

    message.channel.send(messageToSend)
        .then(message => {
            messageID = message.id;
            client.ttt = new Discord.Collection();
            client.ttt.set(`${messageID}`, {
                "pl1": mentionedUser,
                "pl2": author,
                "title": messageToSend,
                "board": tttBoard,
                "message": messageID,
                "turn": 0
            });
            message.channel.fetchMessage(messageID);
            message.react("↖")
                .then(() => message.react("⬆"))
                .then(() => message.react("↗"))
                .then(() => message.react("⬅"))
                .then(() => message.react("⏺"))
                .then(() => message.react("➡"))
                .then(() => message.react("↙"))
                .then(() => message.react("⬇"))
                .then(() => message.react("↘"))
        })
        .catch(console.error);
}