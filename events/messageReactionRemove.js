module.exports = (client, messageReaction, user) => {
    //console.log(messageReaction.message);
    let messageId = messageReaction.message.id;
    //console.log(client.channels.get(580415579060437018));

    messageReaction.message.channel.fetchMessage('586976206138900510')
        .then(function (promise) {
            //console.log(promise);
            if (promise == messageReaction.message.content && messageReaction._emoji.id == '496720780080709632') {
                //console.log(messageReaction);

                let guild = client.guilds.get('410116486896549888');
                //console.log(client.guilds.get('410116486896549888'));
                let testRole = guild.roles.get('586978303877972026');
                //console.log(testRole);

                messageReaction.message.member.removeRole('586978303877972026');

                messageReaction.message.channel.send("prave jsi odebral reakci a byla ti zrusena role");
            }
        })
        .catch(function (rejected) {
            console.log(`chyba: ${rejected}`)
        });


    //messageReaction.message.channel.send("pog");
    //user.send("pog");
};