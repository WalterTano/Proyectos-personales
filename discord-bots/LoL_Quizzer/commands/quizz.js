const mysql = require('mysql');
const fs = require('fs');

module.exports = {
    name: 'quizz',
    description: "Muestra una pregunta y espera una respuesta del usuario.",
    execute(message, args, Discord, con){

        mostrarPregunta(message, con, Discord);
        retorno = message.member.displayName;
        return retorno;
    }
}

function mostrarPregunta(mensaje, con, Discord){
    var file_name = ".\\temp_" + mensaje.member.user.username + ".txt";

    con.query("SELECT COUNT(*) AS filas FROM pregunta;", function (err2, result2, fields2){
        if (err2) throw err2;
        var idPregunta = Math.floor(Math.random() * result2[0].filas) + 1;
        fs.writeFile(file_name, idPregunta.toString(), (err) => {
            if(err) throw err;
        });
    
        con.query("SELECT idPregunta, letra, img_link, autor FROM pregunta WHERE idPregunta = " + idPregunta + ";", function (err3, result3, fields3) {
            if (err3) throw err3;
            const pregunta_embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            //.setAuthor(result3[0].autor)
            .setTitle("Pregunta #" + result3[0].idPregunta)
            .setDescription(result3[0].letra)
            .setFooter('Pregunta por: ' + result3[0].autor +
            '\n\n¡Recuerda utilizar el formato "-respuesta TU RESPUESTA" para responder! \nTienes 5 minutos para responder.');
                    
            if (result3[0].img_link != null){
                    pregunta_embed.setImage(result3[0].img_link);
            }

            mensaje.channel.send(pregunta_embed).then(
            message => setTimeout(function eliminar(msj_pregunta){
                msj_pregunta.delete();
            }, 300000, message));
        });
    });
    return;
}

