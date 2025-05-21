//let handler = async (m, { conn, args, participants, usedPrefix, command }) => {
    //if (!args[0]) throw `✦ Escribe una categoría.\n\nEjemplo:\n> *${usedPrefix + command} gay*`

    //let categoria = args.join(" ").trim()
    //let miembros = participants.map(p => p.id).filter(id => !id.includes(conn.user.jid))
   //let seleccionados = miembros.sort(() => Math.random() - 0.5).slice(0, 10)

    //if (seleccionados.length === 0) throw '✦ No hay suficientes participantes en este grupo.'

    //let texto = `✦ 𝗧𝗢𝗣 𝗗𝗘 *${categoria.toUpperCase()}*\n\n`
    texto += seleccionados.map((id, i) => `*${i + 1}.* @${id.split('@')[0]}`).join('\n')

    await conn.sendMessage(m.chat, { text: texto, mentions: seleccionados }, { quoted: m })
}

//handler.help = ['top <texto>']
//handler.tags = ['fun']
//handler.command = ['top']
//handler.group = true
//handler.register = false // Esto asegura que no pide registro

//export default handler