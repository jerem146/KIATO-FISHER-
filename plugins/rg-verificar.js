import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let pp = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
  let name2 = conn.getName(m.sender)
  let user = global.db.data.users[m.sender]

  if (!Reg.test(text)) return m.reply(`『✦』Formato incorrecto.\n\nUso del comando: *${usedPrefix + command} nombre.edad*\nEjemplo : *${usedPrefix + command} ${name2}.18*`)

  let [_, name, splitter, age] = text.match(Reg)
  if (!name) return m.reply(`『✦』El nombre no puede estar vacío.`)
  if (!age) return m.reply(`『✦』La edad no puede estar vacía.`)
  if (name.length >= 100) return m.reply(`『✦』El nombre es demasiado largo.`)

  age = parseInt(age)
  if (age > 1000) return m.reply(`『✦』Wow el abuelo quiere jugar al bot.`)
  if (age < 5) return m.reply(`『✦』hay un abuelo bebé jsjsj.`)

  user.name = name + '✓'
  user.age = age
  global.db.data.users[m.sender].coin += 40
  global.db.data.users[m.sender].exp += 300
  global.db.data.users[m.sender].joincount += 20

  let regbot = `✦ 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗔 𝗗 𝗢 ✦\n`
  regbot += `•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•\n`
  regbot += `> ᰔᩚ Nombre » ${name}\n`
  regbot += `> ✎ Edad » ${age} años\n`
  regbot += `•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•\n`
  regbot += `❀ 𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:\n`
  regbot += `> • ⛁ *${moneda}* » 40\n`
  regbot += `> • ✰ *Experiencia* » 300\n`
  regbot += `> • ❖ *Tokens* » 20\n`
  regbot += `•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•\n`
  regbot += `> ${dev}`

  await m.react('📩')

  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: '✧ Usuario Verificado ✧',
        body: textbot,
        thumbnailUrl: pp,
        sourceUrl: channel,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })    
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler/