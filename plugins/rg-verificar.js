let handler = async function (m, { usedPrefix, command }) {
  return m.reply(`『✦』El sistema de registro ha sido deshabilitado.\nYa no es necesario usar *${usedPrefix + command}*.`)
}

handler.help = ['verify', 'verificar', 'reg', 'register', 'registrar']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler