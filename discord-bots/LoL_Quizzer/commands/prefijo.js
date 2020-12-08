const mysql = require('mysql');
module.exports = {
    name: 'prefijo',
    description: 'Permite cambiar el prefijo utilizado para hablar con el bot.',
    execute(message, args, con){
        if (message.guild.ownerID == message.member.user.id){
            prefijo = args[0];
            guild_id = message.guild.id;
            sql = "UPDATE guild SET prefix = " + con.escape(prefijo) + " WHERE id_guild = " + con.escape(guild_id) + ";";
    
            con.query(sql, function (err, result, fields){
                if (err) throw err;
                console.log("Prefijo de guild de id: " + guild_id + " actualizado a " + prefijo + ".");
                message.channel.send('Prefijo actualizado a "' + prefijo + '". Prueba utilizar el comando "' + prefijo + 'help".');
            })
            
        } else {
            message.channel.send("Solamente el dueño del servidor puede cambiar mi prefijo. Intenta pedirle que lo cambie.");

        }
    }
}