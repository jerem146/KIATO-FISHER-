let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return;
  if (isAdmin || isOwner || m.fromMe || isROwner) return;

  let chat = global.db.data.chats[m.chat];
  const user = `@${m.sender.split`@`[0]}`;
  const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text);

  if (chat.antilink && isGroupLink && !isAdmin) {
    if (!isBotAdmin) return;

    const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
    if (m.text.includes(linkThisGroup)) return true;

    // Eliminar el mensaje con el link (asegurando valores válidos)
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: m.key.fromMe,
        id: m.key.id,
        participant: m.key.participant || m.sender
      }
    });

    // Expulsar al usuario
    let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    if (responseb[0]?.status === "404") return;

    // Enviar mensaje de aviso sin citar el mensaje original
    await conn.sendMessage(m.chat, {
  text: ` ANTI-LINK DETECTADO 
✦ Eliminad@ ${user} por antilink uwu.
`,
  mentions: [m.sender]
});
  }

  return true;
}
