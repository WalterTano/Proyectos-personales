module.exports = {
    name: 'stats',
    description: 'Le muestra sus estadísticas a quien envío el mensaje.',
    execute(message, args){
        conexion = mysql.createConnection({
            host:  "localhost",
            user: "conector",
            password: "conector123",
            database: "lol_quizzer"
        });

        sacarEstadisticas(message, con);
    }
}

function sacarEstadisticas(message, con){
    var username = message.member.user.username;
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT puntaje_total, preguntas_respondidas, respuestas_correctas FROM usuario WHERE discord_user = '" +
        username + "';", function (err2, result2, fields2){
            if (err2) throw err2;
            message.channel.send("Las estadísticas de **" + username + "** son:\n\n" +
            "**Puntaje total:** " + result2[0].puntaje_total + "\n" +
            "**Preguntas respondidas:** " + result2[0].preguntas_respondidas + "\n" +
            "**Respuestas correctas:** " + result2[0].respuestas_correctas + "\n" +
            "**Winrate:** " + ((result2[0].respuestas_correctas / result2[0].preguntas_respondidas) * 100).toFixed(0) + "%\n");
        });
      });
}