const mysql = require('mysql');
module.exports = {
    name: 'top',
    description: 'Muestra el top de usuarios que jugaron al quizz que ingrese el usuario por parametros, ordenando por puntaje total del usuario.',
    execute(message, args){
        conexion = mysql.createConnection({
            host:  "localhost",
            user: "conector",
            password: "conector123",
            database: "lol_quizzer"
        });

        if(parseInt(args[0]) || args[0] == null){
            topNumero(message, args[0], conexion);

        } else if (args[0].toLowerCase() == 'guild'){
            topGuild(message, conexion, args[1]);

        } else {
            topUsuario(message, args, conexion); 

        }
    }
}

function topNumero(message, limite = 10, con, sub_where = "", where = ""){


    if (limite > 0 && limite <= 100){
        sql = "SELECT * FROM " +
        "(SELECT U.discord_user, U.puntaje_total, ((U.respuestas_correctas / U.preguntas_respondidas) * 100) AS 'winrate'," + 
        " ROW_NUMBER() OVER(ORDER BY puntaje_total DESC) AS 'puesto' FROM usuario U JOIN guild G JOIN user_en_guild E ON U.user_id = E.user_id AND G.id_guild = E.id_guild " +
        sub_where +
        " GROUP BY discord_user" + 
        " ORDER BY puntaje_total DESC LIMIT " + limite + ") AS top_global " + 
        where + ";"

        con.query(sql, function(err, result, fields){
            if (err) throw err;

            var mensaje = "";
            for(var i = 0; i < result.length; i++){
                mensaje += "**" + result[i].puesto + " - " + result[i].discord_user + "**: " + result[i].puntaje_total + " (" + result[i].winrate + "% WR)\n";
            }
            if (mensaje == ""){
                message.channel.send("Parece que ese usuario aún no juega conmigo. ¿Por qué no lo invitas a jugar?");

            } else {
                message.channel.send(mensaje);

            }
        })

    } else {
        if (limite > 0){
            message.channel.send(limite + ' son demasiados usuarios. ¿No prefieres buscarte a ti mismo? \n*Puedes hacerlo usando "-top TU USUARIO".*');

        } else {
            message.channel.send("Muy gracioso. ¿Por qué no intentas ver el top 10 de comediantes internacionales? \nSeguro apareces en él.");
        
        }
    }
}

function topGuild(message, con, limite){
    if (limite == null){
        limite = 10;
    }
    const guild_name = message.guild.name
    const where = "WHERE G.guild_name = " + con.escape(guild_name);
    if (parseInt(limite)){
        topNumero(message, limite, con, where);
    }
}

function topUsuario(message, usuarios, con){
    var users_con_or = "";

    for (var i = 0; i < usuarios.length; i++){
        if(! (i == usuarios.length - 1) ){
            users_con_or += con.escape(usuarios[i]) + "|";
        } else {
            users_con_or += con.escape(usuarios[i]);
        }
    }

    while(users_con_or.includes("'")){
        users_con_or = users_con_or.replace("'", "");
    }

    const where = "WHERE discord_user REGEXP " + con.escape(users_con_or) + " ";

    topNumero(message, 100, con, "", where);
}