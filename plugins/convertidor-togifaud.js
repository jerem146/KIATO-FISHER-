let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) return conn.reply(m.chat, `✦ Por favor, responde a un *Video.*`, m)
  
  conn.reply(m.chat, global.wait, m)
  
  const q = m.quoted || m
  let mime = (q.msg || q).mimetype || ''
  if (!/(mp4)/.test(mime)) return conn.reply(m.chat, `✦ Por favor, responde a un *Video.*`, m)
  
  await m.react('🕓')
  
  let media = await q.download()
  let listo = '🍬 Aquí tienes ฅ^•ﻌ•^ฅ.'
  
  conn.sendMessage(m.chat, { video: media, gifPlayback: true, caption: listo }, { quoted: fkontak })
  await m.react('✅')
}

handler.help = ['togifaud']
handler.tags = ['transformador']
handler.group = true
handler.command = ['togifaud']

export default handler