module.exports = (client, messageReaction, user) => {
    //console.log("reaction was added");

    //console.log(messageReaction._emoji.id);
    //let messageId = messageReaction.message.id;
    //console.log(messageReaction.message.channel);

    messageReaction.message.channel.fetchMessage('586976206138900510')
        .then(function (promise) {
            //console.log(promise);
            if (promise == messageReaction.message.content && messageReaction._emoji.id == '496720780080709632') {
                //console.log(messageReaction);

                let guild = client.guilds.get('410116486896549888');
                //console.log(client.guilds.get('410116486896549888'));
                let testRole = guild.roles.get('586978303877972026');
                //console.log(testRole);

                messageReaction.message.member.addRole('586978303877972026');

                messageReaction.message.channel.send("prave jsi pridal reakci a byla ti prirazena nova role");
            }
        })
        .catch(function (rejected) {
            //console.log(`chyba: ${rejected}`)
        });

    function sendMessage(editedMessage, i, j) {
        if (editedMessage.board[i][j] != "\:white_large_square:")
            return;

        let messageToSend;
        if (editedMessage.turn % 2 == 0) {
            messageToSend = `It's <@${editedMessage.pl2}>'s turn`;
            editedMessage.board[i][j] = "❎";//🅾
        }
        else {
            messageToSend = `It's <@${editedMessage.pl1}>'s turn`;
            editedMessage.board[i][j] = "🅾";//
        }

        for (row of editedMessage.board) {
            messageToSend += "\n";
            for (row2 of row) {
                messageToSend += row2;
            }
        }
        editedMessage.turn += 1;

        messageReaction.message.edit(messageToSend);
    }

    function checkWinCondition(editedMessage) {
        let xCount = 0;
        let oCount = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (editedMessage.board[i][j] == "❎") {
                    xCount += 1;
                    if (xCount == 3) {
                        return "❎";
                    }
                }
                else if (editedMessage.board[i][j] == "🅾") {
                    oCount += 1;
                    if (oCount == 3) {
                        return "🅾";
                    }
                }
            }
            xCount = 0;
            oCount = 0;
        }

        xCount = 0;
        oCount = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (editedMessage.board[j][i] == "❎") {
                    xCount += 1;
                    if (xCount == 3) {
                        return "❎";
                    }
                }
                else if (editedMessage.board[j][i] == "🅾") {
                    oCount += 1;
                    if (oCount == 3) {
                        return "🅾";
                    }
                }
            }
            xCount = 0;
            oCount = 0;
        }

        xCount = 0;
        oCount = 0;

        for (let i = 0; i < 3; i++) {
            if (editedMessage.board[i][i] == "❎") {
                xCount += 1;
                if (xCount == 3) {
                    return "❎";
                }
            }
            else if (editedMessage.board[i][i] == "🅾") {
                oCount += 1;
                if (oCount == 3) {
                    return "🅾";
                }
            }
        }

        xCount = 0;
        oCount = 0;

        let i = 2;
        for (let j = 0; j < 3; j++) {
            if (editedMessage.board[i][j] == "❎") {
                xCount += 1;
                if (xCount == 3) {
                    return "❎";
                }
            }
            else if (editedMessage.board[i][j] == "🅾") {
                oCount += 1;
                if (oCount == 3) {
                    return "🅾";
                }
            }
            i--;
        }
    }

    //console.log(typeof client.ttt);
    //console.log(user.id);
    if (typeof client.ttt != "undefined" && user.bot != true) {
        let editedMessage = client.ttt.get(`${messageReaction.message.id}`);
        /*if () { existuje instance ttt,
            ale chtelo by to dat jako prvni podminku, aby byla podminka overena okamzite */
        //console.log(editedMessage);
        if (editedMessage.turn == 0 && user.id == editedMessage.pl2) {
            messageReaction.message.channel.send("It's not your turn.");
            //return;
        }
        else if (editedMessage.turn % 2 == 0 && user.id == editedMessage.pl1) {
            if (messageReaction._emoji.name == "↖") {
                sendMessage(editedMessage, 0, 0);
            }
            else if (messageReaction._emoji.name == "⬆") {
                sendMessage(editedMessage, 0, 1);
            }
            else if (messageReaction._emoji.name == "↗") {
                sendMessage(editedMessage, 0, 2);
            }
            else if (messageReaction._emoji.name == "⬅") {
                sendMessage(editedMessage, 1, 0);
            }
            else if (messageReaction._emoji.name == "⏺") {
                sendMessage(editedMessage, 1, 1);
            }
            else if (messageReaction._emoji.name == "➡") {
                sendMessage(editedMessage, 1, 2);
            }
            else if (messageReaction._emoji.name == "↙") {
                sendMessage(editedMessage, 2, 0);
            }
            else if (messageReaction._emoji.name == "⬇") {
                sendMessage(editedMessage, 2, 1);
            }
            else /*if(messageReaction._emoji.name == "↘")*/ {
                sendMessage(editedMessage, 2, 2);
            }
            //editedMessage.turn += 1;
        }
        /*else if (editedMessage.turn % 2 != 0 && user.id == editedMessage.pl1) {
            return;
        }
        else if (editedMessage.turn % 2 == 0 && user.id == editedMessage.pl2) {
            return;
        }*/
        else if ((editedMessage.turn % 2 != 0) && (user.id != editedMessage.pl1)) {
            if (messageReaction._emoji.name == "↖") {
                sendMessage(editedMessage, 0, 0);
            }
            else if (messageReaction._emoji.name == "⬆") {
                sendMessage(editedMessage, 0, 1);
            }
            else if (messageReaction._emoji.name == "↗") {
                sendMessage(editedMessage, 0, 2);
            }
            else if (messageReaction._emoji.name == "⬅") {
                sendMessage(editedMessage, 1, 0);
            }
            else if (messageReaction._emoji.name == "⏺") {
                sendMessage(editedMessage, 1, 1);
            }
            else if (messageReaction._emoji.name == "➡") {
                sendMessage(editedMessage, 1, 2);
            }
            else if (messageReaction._emoji.name == "↙") {
                sendMessage(editedMessage, 2, 0);
            }
            else if (messageReaction._emoji.name == "⬇") {
                sendMessage(editedMessage, 2, 1);
            }
            else /*(messageReaction._emoji.name == "↘")*/ {
                sendMessage(editedMessage, 2, 2);
            }
            //editedMessage.turn += 1;
        }
        
        const winSymbol = checkWinCondition(editedMessage);
        //console.log(winSymbol);

        if (winSymbol == "❎") {
            messageReaction.message.channel.send("❎ won!");
        }
        else if (winSymbol == "🅾") {
            messageReaction.message.channel.send("🅾 won!");
        }
        /*else {
            console.log(editedMessage % 2 != 0);
            console.log(user.id =! editedMessage.pl1);
            
        }*/
        //}
    }


};