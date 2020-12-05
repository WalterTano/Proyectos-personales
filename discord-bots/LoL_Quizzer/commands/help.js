module.exports = {
    name: 'help',
    description: 'Muestra los comandos disponibles actualmente.',
    execute(message, args){
        const help = '**-help/ayuda:** *Este comando. Muestra todos los comandos disponibles y una breve descripción de ellos.' +
        'Además puede usarse con el formato "-help COMANDOS SEPARADOS POR ESPACIO" para ver la ayuda de comandos específicos.*\n';
        const ping = '**-ping:** *Responde "pong" si el bot se encuentra en funcionamiento.*\n';
        const quizz = '**-quizz:** *Inicia una quizz/trivia de League of Legends. El bot realizará una pregunta dirigida al usuario que envió el mensaje.*\n';
        const respuesta = '**-respuesta:** *Utilizado para responder a la pregunta de una quizz. Utiliza el formato "-respuesta TU RESPUESTA".*\n';
        const stats = '**-stats:** *Muestra tus estadísticas en el juego de quizzes de League of Legends.*\n';
        const cancelar = '**-cancelar:** *Cancela la pregunta que te hizo el bot anteriormente. Hacer esto suma a tus preguntas respondidas.*\n';
        const creditos = '**-creditos:** *Muestra los usuarios de discord de las personas involucradas en la creación de este bot.*\n'
        const lore = '**-lore:** *Utiliza este comando para leer la emocionante y sorprendente historia de El SabeLoL Todo.*\n'

        if (args.length < 1){
            message.channel.send('Los comandos disponibles actualmente son:\n\n'+
            help +
            ping +
            quizz +
            respuesta +
            stats +
            cancelar +
            creditos +
            lore);

        } else {
            var texto_a_mostrar = "Ayuda: \n\n";
            for (var i = 0; i < args.length; i++){
                switch(args[i].toLowerCase()){
                    case 'help':
                        texto_a_mostrar += help;
                    continue;
                    
                    case 'ayuda':
                        texto_a_mostrar += help;
                    continue;

                    case 'ping':
                        texto_a_mostrar += ping;
                    continue;

                    case 'quizz':
                        texto_a_mostrar += quizz;
                    continue;

                    case 'respuesta':
                        texto_a_mostrar += respuesta;
                    continue;

                    case 'stats':
                        texto_a_mostrar += stats;
                    continue;

                    case 'cancelar':
                        texto_a_mostrar += cancelar;
                    continue;

                    case 'creditos':
                        texto_a_mostrar += creditos;
                    continue;

                    case 'lore':
                        texto_a_mostrar += lore;
                    continue;

                    default:
                        texto_a_mostrar += "-El comando **" + args[i] + "** no existe.\n" 
                    continue;
                }
            }
            message.channel.send(texto_a_mostrar);
        }
    }
}