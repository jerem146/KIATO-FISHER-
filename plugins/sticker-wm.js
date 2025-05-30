import { addExif } from '../lib/sticker.js'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!m.quoted) return m.reply(`${emoji} Por favor, responde a un sticker con el comando *${usedPrefix + command}* seguido del nuevo nombre.\nEjemplo: *${usedPrefix + command} Nuevo Nombre*`)

  const sticker = await m.quoted.download()
  if (!sticker) return m.reply(`${emoji2} No se pudo descargar el sticker.`)

  const textoParts = text.split(/[\u2022|]/).map(part => part.trim())
  const texto1 = textoParts[0] || global.packsticker
  const texto2 = textoParts[1] || global.packsticker2

  const exif = await addExif(sticker, texto1, texto2)
  await conn.sendMessage(m.chat, { sticker: exif }, { quoted: m })
}

handler.help = ['wm']
handler.tags = ['tools']
handler.command = ['take', 'robar', 'wm']

export default handler