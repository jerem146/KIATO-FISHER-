let handler = async (m, { conn, args, participants, usedPrefix, command }) => {
    if (!args[0]) throw `✦ Debes escribir una categoría.\n\nEjemplo:\n> *${usedPrefix + command} gay*`

    let texto = args.join(" ").trim()
    let miembros = participants.map(p => p.id).filter(id => id !== conn.user.jid && id !== m.sender)
    let seleccionados = miembros.sort(() => Math.random() - 0.5).slice(0, 10)

    let mensaje = `✦ 𝗧𝗢𝗣 𝗗𝗘 *${texto.toUpperCase()}*\n\n`
    seleccionados.forEach((id, index) => {
        mensaje += `*${index + 1}.* @${id.split("@")[0]}\n`
    })

    await conn.sendMessage(m.chat, {
        text: mensaje.trim(),
        mentions: seleccionados
    }, { quoted: m })
}

handler.help = ['top <texto>']
handler.tags = ['fun']
handler.command = ['top']
handler.group = true
handler.register = false

export default handler