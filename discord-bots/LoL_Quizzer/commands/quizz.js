const mysql = require('mysql');
const fs = require('fs');

module.exports = {
    name: 'quizz',
    description: "Muestra una pregunta y espera una respuesta del usuario.",
    execute(message, args){
        conexion = mysql.createConnection({
            host:  "localhost",
            user: "conector",
            password: "conector123",
            database: "lol_quizzer"
        });

        mostrarPregunta(message, conexion);
        retorno = message.member.displayName;
        return retorno;
    }
}

function mostrarPregunta(mensaje, con){
    var file_name = ".\\temp_" + mensaje.member.user.username + ".txt";

    con.connect(function(err) {
        if (err) throw err;

        con.query("SELECT COUNT(*) AS filas FROM pregunta;", function (err2, result2, fields2){
            if (err2) throw err2;
            var idPregunta = Math.floor(Math.random() * result2[0].filas) + 1;
            fs.writeFile(file_name, idPregunta.toString(), (err) => {
                if(err) throw err;
                console.log("Archivo: " + file_name + " // idPregunta: " + idPregunta);
            });
    
            con.query("SELECT letra FROM pregunta WHERE idPregunta = " + idPregunta + ";", function (err3, result3, fields3) {
                    if (err3) throw err3;
                
                    mensaje.channel.send(result3[0].letra + '\n*¡Recuerda utilizar el formato "-respuesta TU RESPUESTA" para responder!*').then(
                    message => setTimeout(function eliminar(msj_pregunta){
                        msj_pregunta.delete();
                    }, 180000, message));
            });
        })
    });
    return;
}

