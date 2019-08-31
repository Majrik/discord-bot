const request = require("request");

exports.run = (client, message, args) => {
    if (client.trivia.get(`${message.channel.guild.id}-${message.author.id}`) == 1) {
        message.channel.send(`Wait until the previous question is resolved.`);
        return;
    }
    //console.log(`get: ${client.trivia.get(`${message.channel.guild.id}-${message.author.id}`)}`);
    request(encodeURI("https://opentdb.com/api.php?amount=1&type=multiple&difficulty=easy"), function (error, response, body) {
        const triviaJSON = JSON.parse(body.replace(/&quot;/g, '\\"').replace(/&#039;/g, "'"));
        client.trivia.set(`${message.channel.guild.id}-${message.author.id}`, 1);

        const filter = m => {
            //console.dir(m);
            return triviaJSON.results[0].correct_answer.toLowerCase() === m.content.toLowerCase();
        };

        let answers = [triviaJSON.results[0].correct_answer, triviaJSON.results[0].incorrect_answers[0],
        triviaJSON.results[0].incorrect_answers[1], triviaJSON.results[0].incorrect_answers[2]];
        //console.log(answers);
        
        function getRandomNumber(max) {
            return Math.floor(Math.random() * max);
        }

        let answers_shuffled = [];
        let num;

        //console.log(answers);
        for (let i = 0; i < 4; i++) {
            num = getRandomNumber(answers.length);
            answers_shuffled.push(answers[num]);
            answers.splice(num, 1);
        }
        //console.log(answers);
        //console.log(answers_shuffled);


        message.channel.send(`Question: ${triviaJSON.results[0].question}

Hint: ${answers_shuffled}`).then(() => {
            console.log(`answer: ${triviaJSON.results[0].correct_answer}`);
            message.channel.awaitMessages(filter, { maxMatches: 1, time: 20000, errors: ['time'] })
                .then(collected => {
                    message.channel.send(`${collected.first().author} got the correct answer!`);
                    client.trivia.delete(`${message.channel.guild.id}-${message.author.id}`);
                })
                .catch(collected => {
                    message.channel.send('Looks like nobody got the answer this time.');
                    client.trivia.delete(`${message.channel.guild.id}-${message.author.id}`);
                });
        });
    });
}