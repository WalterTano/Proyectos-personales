const mysql = require('mysql');
module.exports = {
    name: 'respuesta',
    description: 'Responde a la quizz que el bot envió anteriormente a un usuario.',
    execute(message, args, full_args, idPregunta){
        respuesta = full_args;
        conexion = mysql.createConnection({
            host:  "localhost",
            user: "conector",
            password: "conector123",
            database: "lol_quizzer"
        });

        if (respuesta != ""){
            ingresarRespuesta(message, conexion, respuesta, idPregunta);
        } else {
            message.channel.send("¡La próxima vez intenta responder algo!")
        }

    }
}

function ingresarRespuesta(respuesta_usuario, con, respuesta, idPregunta){
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT respuesta, valor FROM pregunta WHERE idPregunta = " + idPregunta + ";", function (err, result, fields) {
            if (err) throw err;
            
            const porcentaje_de_equivalencia = calcular_similitud(result[0].respuesta, respuesta);
            const valor_final = Math.trunc(result[0].valor * (porcentaje_de_equivalencia / 100));

            if (porcentaje_de_equivalencia > 60){
                if (porcentaje_de_equivalencia == 100){
                    respuesta_usuario.channel.send('La respuesta "' + respuesta +
                    '" es... \n*¡PERFECTAMENTE CORRECTA!* Has ganado ' + valor_final + ' puntos por responder perfectamente.').then(
                        message => setTimeout(function eliminar(msj_pregunta){
                            msj_pregunta.delete();
                        }, 180000, message)
                    );;
                    
                } else if (porcentaje_de_equivalencia > 90){
                    respuesta_usuario.channel.send('La respuesta "' + respuesta +
                    '" es... \n*¡CORRECTA!* Has ganado ' + valor_final + ' puntos por responder correctamente.').then(
                        message => setTimeout(function eliminar(msj_pregunta){
                            msj_pregunta.delete();
                        }, 180000, message)
                    );;
    
                } else if (porcentaje_de_equivalencia > 75){
                    respuesta_usuario.channel.send('La respuesta "' + respuesta +
                    '" es... \n*¡CASI CORRECTA!* Has ganado ' + valor_final + ' puntos por responder casi correctamente.').then(
                        message => setTimeout(function eliminar(msj_pregunta){
                            msj_pregunta.delete();
                        }, 180000, message)
                    );;
    
                } else {
                    respuesta_usuario.channel.send('La respuesta "' + respuesta +
                    '" es... \n*¡INCORRECTA!* Pero como se aproxima lo suficiente, has ganado ' + valor_final + ' puntos por el esfuerzo.').then(
                        message => setTimeout(function eliminar(msj_pregunta){
                            msj_pregunta.delete();
                        }, 180000, message)
                    );;
                }

                //Ingresar datos a BD.

                con.query("INSERT INTO usuario(discord_user, puntaje_total, preguntas_respondidas, respuestas_correctas)" + 
                " VALUES('" + respuesta_usuario.member.user.username + "', " + valor_final + ", " + 1 + ", " + (porcentaje_de_equivalencia / 100) + ");",
                function (err2, result2, fields2){
                    if (err2) {
                        con.query("SELECT puntaje_total, preguntas_respondidas, respuestas_correctas FROM usuario WHERE discord_user = '" + respuesta_usuario.member.user.username + "'",
                        function (err3, result3, fields3){
                                
                            if (err3) throw err3;
                            var puntaje_total = result3[0].puntaje_total + valor_final;
                            var preguntas_respondidas = result3[0].preguntas_respondidas + 1;
                            var respuestas_correctas = result3[0].respuestas_correctas + (porcentaje_de_equivalencia / 100);
                            
                            con.query("UPDATE usuario SET puntaje_total = " + puntaje_total +
                            ", preguntas_respondidas = " + preguntas_respondidas + 
                            ", respuestas_correctas = " + respuestas_correctas +
                            " WHERE discord_user = '" + respuesta_usuario.member.user.username + "'", function (err4, result4, fields4){
                                if (err4) throw err4;
                                console.log("Datos de " + respuesta_usuario.member.user.username + " actualizados exitosamente.")
                            });
                        });

                    } else {
                        console.log("Datos de " + respuesta_usuario.member.user.username + " insertados exitosamente.");
                    }
                });

            } else {
                respuesta_usuario.channel.send('La respuesta "' + respuesta +
                '" es... \n*¡INCORRECTA!* Y como no estuvo ni cerca, no ganas ningún punto. ¡Mejor suerte la próxima!').then(
                    message => setTimeout(function eliminar(msj_pregunta){
                        msj_pregunta.delete();
                    }, 180000, message)
                );

                //Ingresar datos a BD.
                con.query("INSERT INTO usuario(discord_user, puntaje_total, preguntas_respondidas, respuestas_correctas)" + 
                " VALUES('" + respuesta_usuario.member.user.username + "', " + 0 + ", " + 1 + ", " + 0 + ");",
                function (err2, result2, fields2){

                    if (err2) {
                        con.query("SELECT puntaje_total, preguntas_respondidas, respuestas_correctas FROM usuario WHERE discord_user = '" + respuesta_usuario.member.user.username + "'",
                        function (err3, result3, fields3){
                            if (err3) throw err3;
        
                            console.log("[UPDATE] Preguntas respondidas: " + result3[0].preguntas_respondidas);
        
                            var preguntas_respondidas = result3[0].preguntas_respondidas + 1;
                                
                            con.query("UPDATE usuario SET preguntas_respondidas = " + preguntas_respondidas + 
                            " WHERE discord_user = '" + respuesta_usuario.member.user.username + "'", function (err4, result4, fields4){
                                if (err4) throw err4;
                                console.log("Datos de " + respuesta_usuario.member.user.username + " actualizados exitosamente.");
                            });
                        });

                    } else {
                        console.log("Datos de " + respuesta_usuario.member.user.username + " insertados exitosamente.");
                    }
                });
            }
        });
      });
}

function calcular_similitud(respuesta_del_usuario, respuesta_correcta) {
    var equivalencia = 0;
    var minLength = (respuesta_del_usuario.length > respuesta_correcta.length) ? respuesta_correcta.length : respuesta_del_usuario.length;    
    var maxLength = (respuesta_del_usuario.length < respuesta_correcta.length) ? respuesta_correcta.length : respuesta_del_usuario.length;    
    for(var i = 0; i < minLength; i++) {
        if(respuesta_del_usuario[i] == respuesta_correcta[i]) {
            equivalencia++;
        }
    }

    var weight = equivalencia / maxLength;
    var porcentaje_de_equivalencia = (weight * 100);
    return porcentaje_de_equivalencia;
}