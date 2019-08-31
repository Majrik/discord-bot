exports.run = (client, message, args) => {
    if (message.author.id == 135385664454787072)
    {
        const amount = parseInt(args[1]);
        const user = message.mentions.users.first();
        
        const key = `${message.guild.id}-${user.id}`;
        client.points.set(key, amount, "points");
        let userPoints = client.points.get(key, "points");
        
        message.channel.send(`${userPoints} kc`);
    }
    else
    {
        message.channel.send(`Invalid action.`);
    }
    
    
}