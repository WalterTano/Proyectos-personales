module.exports = {
    name: 'ping',
    description: 'pings to test bot.',
    execute(message, args){
        message.channel.send('pong!');
    }
}