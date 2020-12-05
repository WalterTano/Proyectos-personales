module.exports = {
    name: 'creditos',
    description: 'Creditos de los participantes en la creación de este bot.',
    execute(message, args){
        const creador = "**Desarrollador principal:** Incarnate #2060 - Walter Taño\n";
        const colaboradores = "**Colaboradores:** TLC KuroBanee#3195\n"
        message.channel.send(creador + colaboradores);
    }
}