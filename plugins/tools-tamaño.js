import uploadImage from '../lib/uploadImage.js'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, text }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (!mime) 
    return conn.reply(m.chat, `${emoji} Por favor, responda a una *Imagen* o *Video.*`, m)

  if (!text) 
    return conn.reply(m.chat, `${emoji} Ingresa el peso nuevo de la imágen/video en bytes.`, m)

  if (isNaN(text)) 
    return conn.reply(m.chat, `${emoji2} Sólo números son permitidos.`, m).then(() => m.react('✖️'))

  if (!/image\/(jpe?g|png)|video|document/.test(mime)) 
    return conn.reply(m.chat, `${emoji2} Formato no soportado.`, m)

  await m.react('🕓')

  try {
    let media = await q.download()
    let url = await uploadImage(media)

    if (/image\/(jpe?g|png)/.test(mime)) {
      await conn.sendMessage(
        m.chat,
        {
          image: { url },
          caption: '',
          fileLength: parseInt(text),
          mentions: [m.sender]
        },
        { ephemeralExpiration: 24 * 3600, quoted: m }
      )
      await m.react('✅')
    } else if (/video/.test(mime)) {
      await conn.sendMessage(
        m.chat,
        {
          video: { url },
          caption: '',
          fileLength: parseInt(text),
          mentions: [m.sender]
        },
        { ephemeralExpiration: 24 * 3600, quoted: m }
      )
      await m.react('✅')
    }
  } catch (e) {
    await m.react('✖️')
  }
}

handler.tags = ['tools']
handler.help = ['tamaño <cantidad>']
handler.command = ['filelength', 'length', 'tamaño']

export default handler