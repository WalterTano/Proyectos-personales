const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const command = require(`./commands/${file}`);

        client.commands.set(command.name, command);
}

const prefix = '-';

client.once('ready', () =>{
    console.log('LoL Quizzer está en linea.')
});

const quizz_en_curso = {
    display_names: [],
    tiempo: []
};

client.on('message', message =>{
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const full_args = message.content.slice(prefix.length + command.length + 1);
    
    if(command === 'ping'){
        client.commands.get('ping').execute(message, args);

    } else if (command == 'quizz' && !(quizz_en_curso.display_names.includes(message.member.displayName))){
        retorno = client.commands.get('quizz').execute(message, args);
        quizz_en_curso.display_names.push(retorno);
        const duracion = 180000;
        quizz_en_curso.tiempo.push(setTimeout(cancelarParticipacion, duracion, message, true));

    } else if (command == 'respuesta' && quizz_en_curso.display_names.includes(message.member.displayName)){
        const index = quizz_en_curso.display_names.indexOf(message.member.displayName);
        console.log("llegó al comando.");
        file_name = ".\\temp_" + message.member.user.username + ".txt";

        fs.readFile(file_name, 'utf8', (err, data) => {
            if(err) throw err;
            idPregunta = data;
            client.commands.get('respuesta').execute(message, args, full_args, idPregunta);

            fs.unlink(file_name, (err) => {
                if (err) throw err;
                console.log(file_name + ' fue eliminado.');
            });
        });

        if (index > -1){
            console.log("coso 2: " + quizz_en_curso.tiempo);
            quizz_en_curso.display_names.splice(index, 1);
            clearTimeout(quizz_en_curso.tiempo[index]);
            quizz_en_curso.tiempo.splice(index, 1);
            console.log("coso 2: " + quizz_en_curso.tiempo);
        }

        const duracion = 180000;
        setTimeout(function eliminar(msj_actual){
            if ((!msj_actual.deleted) && msj_actual.deletable){
                msj_actual.delete();
            }
        }, duracion, message);
        
    } else if (command == 'cancelar' && quizz_en_curso.display_names.includes(message.member.displayName)){
        cancelarParticipacion(message);
        client.commands.get('cancelar').execute(message, args);

    } else if (command == 'stats'){
        client.commands.get('stats').execute(message, args);

    } else if (command == 'help' || command == 'ayuda'){
        client.commands.get('help').execute(message, args);

    } else if (command == 'creditos'){
        client.commands.get('creditos').execute(message, args);

    }
});

function cancelarParticipacion(message, timeout){
    const index = quizz_en_curso.display_names.indexOf(message.member.displayName);
    if (index > -1){
        quizz_en_curso.display_names.splice(index, 1);
        clearTimeout(quizz_en_curso.tiempo[index]);
        quizz_en_curso.tiempo.splice(index, 1);
    }

    file_name = ".\\temp_" + message.member.user.username + ".txt";
    fs.unlink(file_name, (err) => {
        if (err) throw err;
        console.log(file_name + ' fue eliminado.');
    });

    if (timeout){
        message.channel.send("La pregunta de " + message.member.displayName + " ha sido cancelada por inactividad." + 
        "\n¡Mejor estar atento la próxima vez!");
    }
}


client.login('Nzc5NzY0ODczNzIxODA2ODc5.X7lSoQ.Irk234mNcNcfUEMn4waHsv2i0ME');
