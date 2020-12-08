module.exports = {
    name: 'pista',
    description: 'Permite al usuario pedir una pista para la pregunta actual.',
    execute(message, args, idPregunta, con){
        tag = message.author.toString(); //Para etiquetar al autor del mensaje.
        sql = "SELECT pista FROM pregunta WHERE idPregunta = " + con.escape(idPregunta) + ";"
        con.query(sql, function(err, result, fields){
            if (err) throw err;

            pista = result[0].pista;
            if (pista != null){
                message.channel.send(tag + "\n" + pista);

            } else {
                message.channel.send("Lo siento " + tag + ", actualmente no dispongo de una pista para tu pregunta.");

            }
        })
    }
}