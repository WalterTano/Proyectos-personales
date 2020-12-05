module.exports = {
    name: 'cancelar',
    description: 'Muestra un mensaje al cancelar la pregunta realizada anteriormente al usuario.',
    execute(message, args){
        message.channel.send(message.member.displayName +
        ' ha cancelado la pregunta que le hice. Aún así, contará para sus preguntas respondidas en sus estadísticas.' + 
        '¡Decidete si quieres jugar o no!');

    }
}