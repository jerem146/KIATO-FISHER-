let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return;
  if (isAdmin || isOwner || m.fromMe || isROwner) return;

  let chat = global.db.data.chats[m.chat];
  let delet = m.key.participant;
  let bang = m.key.id;
  const user = `@${m.sender.split`@`[0]}`;
  const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text);

  if (chat.antilink && isGroupLink && !isAdmin) {
    if (!isBotAdmin) return;

    const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
    if (m.text.includes(linkThisGroup)) return true;

    // Eliminar el mensaje con el link
    await conn.sendMessage(m.chat, {
      delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }
    });

    // Expulsar al usuario
    let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    if (responseb[0]?.status === "404") return;

    // Enviar mensaje de aviso sin citar el mensaje original
    await conn.sendMessage(m.chat, {
      text: `> ✦ ${user} ha sido eliminado por enviar enlaces prohibidos.`,
      mentions: [m.sender]
    });
  }

  return true;
}