import { toAudio } from '../lib/converter.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted || m;
  let mime = (q.msg || q).mimetype || '';

  if (!m.quoted) 
    return conn.reply(m.chat, `${emoji} Etiqueta el *Video o Audio* que deseas convertir en documento.`, m);

  if (!text) 
    return conn.reply(m.chat, `${emoji2} Ingresa el nombre para guardar el documento.`, m);

  if (!/audio|video/.test(mime)) 
    return conn.reply(m.chat, `${emoji} Etiqueta el *Video o Audio* que deseas convertir en documento.`, m);

  let media = await q.download?.();
  if (!media) throw m.react('✖️');

  await m.react('🕓');

  if (/video/.test(mime)) {
    return conn.sendMessage(m.chat, {
      document: media,
      mimetype: 'video/mp4',
      fileName: `${text}.mp4`
    }, { quoted: m }).then(() => m.react('✅'));

  } else if (/audio/.test(mime)) {
    return conn.sendMessage(m.chat, {
      document: media,
      mimetype: 'audio/mpeg',
      fileName: `${text}.mp3`
    }, { quoted: m }).then(() => m.react('✅'));
  }
}

handler.help = ['document <audio/video>'];
handler.tags = ['tools'];
handler.command = ['todocument', 'todoc'];
handler.register = true;

export default handler;