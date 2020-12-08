const mysql = require('mysql');
module.exports = {
    name: 'stats',
    description: 'Le muestra sus estadísticas a quien envío el mensaje.',
    execute(message, args){
        const conexion = mysql.createConnection({
            host:  "localhost",
            user: "conector",
            password: "conector123",
            database: "lol_quizzer"
        });

        sacarEstadisticas(message, conexion);
    }
}

function sacarEstadisticas(message, con){
    var username = message.member.user.username;
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT puntaje_total, preguntas_respondidas, respuestas_correctas FROM usuario WHERE discord_user = " +
        con.escape(username) + ";", function (err2, result2, fields2){
            if (err2) throw err2;
            if(result2.length > 0){
                message.channel.send("Las estadísticas de **" + username + "** son:\n\n" +
                "**Puntaje total:** " + result2[0].puntaje_total + "\n" +
                "**Preguntas respondidas:** " + result2[0].preguntas_respondidas + "\n" +
                "**Respuestas correctas:** " + result2[0].respuestas_correctas + "\n" +
                "**Winrate:** " + ((result2[0].respuestas_correctas / result2[0].preguntas_respondidas) * 100).toFixed(0) + "%\n");

            } else {
                message.channel.send("Primero debes jugar conmigo antes de tener estadísticas, " + message.member.displayName + ".")
                
            }
        });
      });
}