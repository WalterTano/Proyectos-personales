const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
const con = mysql.createConnection({
    host:  "XXXXXXXX",
    user: "XXXXXX",
    password: "XXXXXX",
    database: "XXXXXXXXXX"
});

for (const file of commandFiles){
    const command = require(`./commands/${file}`);

        client.commands.set(command.name, command);
}

client.once('ready', () =>{
    console.log('LoL Quizzer está en linea.')
});

const quizz_en_curso = {
    display_names: [],
    tiempo: []
};

//Al ser agregado a una guild, envía un mensaje al chat general y agrega la guild a la base de datos.
client.on('guildCreate', newGuild => {
    generalId = getGeneralId(newGuild);
    try{
        client.channels.fetch(generalId).then( channel => {
            channel.send('Atención mortales, yo, El SabeLoL Todo, he llegado a su servidor para desafiarlos en un duelo de ingenio.\n' +
            'Utilicen el comando "-lore" si quieren conocerme, o utilicen "-help" si necesitan ayuda. Invito a los valientes a utilizar "-quizz" ' +
            'si quieren desafiarme.');
        });
    } catch(err){
        console.log(err);
    }
    const guild_id = newGuild.id;
    const guild_name = newGuild.name;

    sql_insert = "INSERT INTO guild(id_guild, guild_name) VALUES(" + con.escape(guild_id) + ", " + con.escape(guild_name) + ");";
    con.query(sql_insert, function (err, result, fields){
        if (err) throw err;
        console.log("[NOTIF - GUILD] NEW GUILD: " + guild_name + " ID: " + guild_id);
    });

    const miembros = newGuild.members.cache.array('Snowflake');

    
    var miembros_str = "";
    for (var i = 0; i < miembros.length; i++){
        if(! (i == miembros.length - 1) ){
            miembros_str += con.escape(miembros[i].user.id) + ", ";
        } else {
            miembros_str += con.escape(miembros[i].user.id);
        }
    }
    console.log(miembros_str);
    sql_query = "SELECT user_id FROM usuario WHERE user_id in(" + miembros_str + ");"
    con.query(sql_query, function(err, result, fields){
        if(err) throw err;

        for(var i = 0; i < result.length; i++){
            var sql_insert_ignore = "INSERT IGNORE INTO user_en_guild(user_id, id_guild) VALUES(" + con.escape(result[i].user_id) + ", " + con.escape(guild_id) + ")";
            con.query(sql_insert_ignore, function(err2, result2, fields2){
                if (err2) throw err2;

            });
        }

    });
});

//Al ser eliminado de una guild, elimina su tabla correspondiente en la base de datos.
client.on('guildDelete', oldGuild => {
    guild_id = oldGuild.id;
    guild_name = oldGuild.name;

    sql_user_en_guild = "DELETE FROM user_en_guild WHERE id_guild = " + con.escape(guild_id) + ";";
    con.query(sql_user_en_guild, function(err, result, fields){
        if(err) throw err;

        sql_guild = "DELETE FROM guild WHERE id_guild = " + con.escape(guild_id) + ";";
        con.query(sql_guild, function (err2, result2, fields2){
            if (err2) throw err2;
            console.log("[NOTIF - GUILD] REMOVED FROM: " + guild_name + " ID: " + guild_id);
        });
    })

});

//Al recibir un mensaje de un usuario, verifica que contenga el prefijo establecido. De tenerlo, realiza el comando correspondiente.
client.on('message', message =>{
    guild_id = message.guild.id;
    sql = "SELECT prefix FROM guild WHERE id_guild = " + con.escape(guild_id) + ";"
    
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        const prefix = result[0].prefix;
            
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        const full_args = message.content.slice(prefix.length + command.length + 1);
        
        if(command === 'ping'){
            //Ejecuta el comando ping.
            client.commands.get('ping').execute(message, args);

        } else if (command == 'quizz' && !(quizz_en_curso.display_names.includes(message.member.displayName))){
            //Ejecuta el comando quizz.
            retorno = client.commands.get('quizz').execute(message, args, Discord, con);
            quizz_en_curso.display_names.push(retorno);
            const duracion = 300000;
            quizz_en_curso.tiempo.push(setTimeout(cancelarParticipacion, duracion, message, true));
            console.log("[NOTIF - QUIZZ] NEW QUIZZ IN GUILD ID: " + message.guild.id);

        } else if (command == 'respuesta' && quizz_en_curso.display_names.includes(message.member.displayName)){
            //Ejecuta el comando respuesta.
            const index = quizz_en_curso.display_names.indexOf(message.member.displayName);

            file_name = ".\\temp_" + message.member.user.username + ".txt";
            fs.readFile(file_name, 'utf8', (err, data) => {
                if(err) throw err;
                idPregunta = data;
                client.commands.get('respuesta').execute(message, args, full_args, idPregunta, con);

                fs.unlink(file_name, (err) => {
                    if (err) throw err;

                });
            });

            if (index > -1){
                quizz_en_curso.display_names.splice(index, 1);
                clearTimeout(quizz_en_curso.tiempo[index]);
                quizz_en_curso.tiempo.splice(index, 1);
            }

            const duracion = 90000;
            setTimeout(function eliminar(msj_actual){
                if ((!msj_actual.deleted) && msj_actual.deletable){
                    msj_actual.delete();
                }
            }, duracion, message);
            
        } else if (command == 'cancelar' && quizz_en_curso.display_names.includes(message.member.displayName)){
            //Ejecuta el comando cancelar.
            cancelarParticipacion(message);
            client.commands.get('cancelar').execute(message, args);
            console.log("[NOTIF - QUIZZ] CANCELLED QUIZZ IN GUILD ID: " + message.guild.id + " BY USER ID: " + message.member.user.id);

        } else if (command == 'stats'){
            //Ejecuta el comando stats.
            client.commands.get('stats').execute(message, args, con);

        } else if (command == 'help' || command == 'ayuda'){
            //Ejecuta el comando help.
            client.commands.get('help').execute(message, args);

        } else if (command == 'creditos'){
            //Ejecuta el comando creditos.
            client.commands.get('creditos').execute(message, args);

        } else if (command == 'lore'){
            //Ejecuta el comando lore.
            client.commands.get('lore').execute(message, args);

        } else if (command == 'prefijo'){
            //Ejecuta el comando prefijo.
            client.commands.get('prefijo').execute(message, args, con);

        } else if (command == 'top'){
            //Ejecuta el comando top.
            client.commands.get('top').execute(message, args, con);

        } else if (command == 'pista' && quizz_en_curso.display_names.includes(message.member.displayName)){
            //Ejecuta el comando pista.
            console.log("[NOTIF - QUIZZ] NEW CLUE REQUEST BY USER ID: " + message.member.user.id + " FROM GUILD ID: " + message.guild.id + ".");

            file_name = ".\\temp_" + message.member.user.username + ".txt";
            fs.readFile(file_name, 'utf8', (err, data) => {
                if(err) throw err;
                idPregunta = data;
                console.log("[NOTIF - QUIZZ] NEW CLUE REQUESTED FOR QUESTION ID: " + idPregunta + ".");
                client.commands.get('pista').execute(message, args, idPregunta, con);

            });
        }
    }); 
});

//Cancela la participación de un usuario en una quizz. Elimina mensajes y timeouts correspondientes.
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

    });

    if (timeout){
        message.channel.send("La pregunta de " + message.member.displayName + " ha sido cancelada por inactividad." + 
        "\n¡Mejor estar atento la próxima vez!");
    }

    con.query("INSERT INTO usuario(user_id, discord_user, puntaje_total, preguntas_respondidas, respuestas_correctas)" + 
    " VALUES(" + message.member.user.id + ", '" +  message.member.user.username + "', " + 0 + ", " + 1 + ", " + 0 + ");",
    function (err2, result2, fields2){

        if (err2) {
            con.query("SELECT puntaje_total, preguntas_respondidas, respuestas_correctas FROM usuario WHERE discord_user = '" + message.member.user.username + "'",
            function (err3, result3, fields3){
                if (err3) throw err3;

                var preguntas_respondidas = result3[0].preguntas_respondidas + 1;
                    
                con.query("UPDATE usuario SET preguntas_respondidas = " + preguntas_respondidas + 
                " WHERE user_id = '" + message.member.user.id + "'", function (err4, result4, fields4){
                    if (err4) throw err4;

                });
            });

        } else {
            console.log("[NOTIF - USER] NEW USER REGISTERED");
        } 

        user_id = message.member.user.id;
        guild_id = message.guild.id;
        sql = "INSERT IGNORE INTO user_en_guild(user_id, id_guild) VALUES(" + con.escape(user_id) + ", " + con.escape(guild_id) + ");";

        con.query(sql, function(err, result, fields){
            if(err) throw err;

        });
    });

}

//Obtiene la id del chat general de una guild.
function getGeneralId(guild) 
    {
    try{
    let channels = guild.channels.cache.array();
    for (const channel of channels) 
    {
        if (channel.name.includes("general") && channel.type == 'text'){
            return channel.id;
        }

    }}catch(err){
        console.log(err)
    }

    return "";
}

//Inicia sesión el bot.
client.login('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');