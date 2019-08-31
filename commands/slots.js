exports.run = (client, message, args) => {
    const symbols = ["\:apple:", "\:pear:", "\:tangerine:", "\:lemon:", "\:banana:"/*, "\:watermelon:", "\:grapes:", "\:strawberry:", "\:cherries:", "\:pineapple:"*/];
    const key = `${message.guild.id}-${message.author.id}`;
    let points = client.points.get(key, "points");
    const [first, second] = args;
    
    class Slot {
        constructor (bet) {
            this.bet = bet;
        }

        firstAndThirdRow (symbols) {
            let slot = [];
            let symbolsCopy = [];
            for (let i = 0; i < 3; i++) {
                if (i == 2 && slot[0] == slot[1]) {
                    for (let j = 0; j < symbols.length; j++) {
                        if (slot[0] != symbols[j]) {
                            symbolsCopy.push(symbols[j]);
                        }
                    }
                    slot.push(symbolsCopy[this.getRandomInt(4)]);
                }
                else {
                    slot.push(symbols[this.getRandomInt(5)]);
                }
            }
            return slot;
        }

        secondRow(randomNumber) {
            let slot = [];
            if (randomNumber > 84 && randomNumber < 90) {
                slot = [symbols[0], symbols[0], symbols[0]];
                this.setPoints(1);
            }
            else if (randomNumber > 89 && randomNumber < 94) {
                slot = [symbols[1], symbols[1], symbols[1]];
                this.setPoints(2);
            }
            else if (randomNumber > 93 && randomNumber < 97) {
                slot = [symbols[2], symbols[2], symbols[2]];
                this.setPoints(3);
            }
            else if (randomNumber > 96 && randomNumber < 99) {
                slot = [symbols[3], symbols[3], symbols[3]];
                this.setPoints(4);
            }
            else {
                slot = [symbols[4], symbols[4], symbols[4]];
                this.setPoints(5);
            }
            return slot;
        }

        setPoints (winCoefficient) {
            const bet = first * winCoefficient;
            points = points + bet;
            client.points.set(key, points, "points");
        }

        getRandomInt (max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
    }

    if (first == "prizes") {
        message.channel.send(`**__Slots__**

**Prizes:**
\:apple: ** = 1**
\:pear: ** = 2**
\:tangerine: ** = 3**
\:lemon: ** = 4**
\:banana: ** = 5**`);
    }
    else if (first > 0 && first % 1 == 0 && points > 0 && first <= points && first >= 1) {
        const slot = new Slot(1);
        const randomNumber = slot.getRandomInt(100);
        
        if (randomNumber > 84) {
            const row1 = slot.firstAndThirdRow(symbols);
            const row2 = slot.secondRow(randomNumber);
            const row3 = slot.firstAndThirdRow(symbols);

            message.channel.send(`**You've just won the jackpot!**
${row1[0]} ${row1[1]} ${row1[2]}
${row2[0]} ${row2[1]} ${row2[2]}
${row3[0]} ${row3[1]} ${row3[2]}`);
        }
        else {
            const row1 = slot.firstAndThirdRow(symbols);
            const row2 = slot.firstAndThirdRow(symbols);
            const row3 = slot.firstAndThirdRow(symbols);

            message.channel.send(`
${row1[0]} ${row1[1]} ${row1[2]}
${row2[0]} ${row2[1]} ${row2[2]}
${row3[0]} ${row3[1]} ${row3[2]}

You lost!`);
            points -= first;
            client.points.set(key, points, "points");
        }
    }
    else {
        message.channel.send(`Invalid action.`);
    }
}