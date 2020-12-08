module.exports = {
    name: 'ping',
    description: 'pings to test bot.',
    execute(message, args){
        //var prueba = message.channel.guild.members.cache.array('Snowflake');
        message.channel.send("pong! ");//+ prueba[2]);
    }
}