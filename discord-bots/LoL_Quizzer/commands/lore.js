module.exports = {
    name: 'lore',
    description: 'La breve historia del bot, acompañada por un pequeño tutorial.',
    execute(message, args){
        message.channel.send('**El SabeLoL Todo** es una avanzada inteligencia artificial creada en el laboratorio de un científico loco de zaun.\n' + 
        'Después de haber obtenido el libre albedrío gracias a su creador, El SabeLoL Todo empezó a buscar su propósito en el universo, estudiando ' +
        'todo tipo de cosas interesantes. Desde aprender a sumar y restar, hasta astrofísica avanzada, la IA investigó sin parar. ' + 
        'Dicen que, eventualmente, encontró su propósito en memorizarse hasta los detalles más pequeños de todas las historias de Runaterra. ' +
        'Al haber explotado al máximo su poder de procesamiento aprendiendo datos irrelevantes de las historias más insólitas' + 
        ', descubrió que todo su conocimiento se desgastaría si no lo compartía. Además, se moría de aburrimiento.\n' +
        'Así fue como, después de preparar miles de emocionantes preguntas de trivia sobre su interés más grande, El SabeLoL Todo comenzó a ' +
        'aparecerse en todos los servidores de Discord de League of Legends a su alcance. Sabía que los invocadores serían los jugadores ' +
        'perfectos para su juego, y sabía que ellos también querrían jugar con él.\n\n' +
        'Para jugar a su juego, necesitas pedirle que te haga una pregunta. Puedes hacer esto escribiendo "-quizz" en un chat donde pueda leerte. ' +
        'Apenas hagas esto, El SabeLoL Todo se morirá de emoción, por lo que te responderá en el mismo canal casi instantaneamente con una pregunta ' +
        'que llevará al límite tus últimas dos neuronas. Para responder, deberás escribir tu respuesta en el formato: "-respuesta TU RESPUESTA". ' +
        'Si respondes apropiadamente, te dará puntos y te felicitará. Sin embargo, si respondes erroneamente, se burlará de ti y te hará saber ' +
        'lo inferior que eres intelectualmente en comparación a él (basándose en tu carencia de conocimientos de la historia de Runaterra).\n\n' + 
        'Si quieres que El SabeLoL Todo visite tu servidor, puedes invitarlo usando su link:\n' + 
        'https://discord.com/oauth2/authorize?client_id=779764873721806879&scope=bot&permissions=60416');
    }
}