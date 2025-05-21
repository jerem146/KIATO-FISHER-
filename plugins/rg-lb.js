    let totalPages = Math.ceil(sortedLevel.length / pageSize);
    let text = `◢✨ Top de usuarios con más experiencia ✨◤\n\n`;

    text += sortedLevel.slice(startIndex, endIndex).map(({ jid, exp, level }, i) => {
        return `✰ ${startIndex + i + 1} » *${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]}*` +
               `\n\t\t ❖ XP » *${exp}*  ❖ LVL » *${level}*`;
    }).join('\n');

    text += `\n\n> • Página *${page}* de *${totalPages}*`;
    if (page < totalPages) text += `\n> Para ver la siguiente página » *#lb ${page + 1}*`;

    await conn.reply(m.chat, text.trim(), m, { mentions: conn.parseMention(text) });


handler.help = ['lb'];
handler.tags = ['rpg'];
handler.command = ['lboard', 'top', 'lb']; 
handler.group = true;
handler.register = true;
handler.fail = null;
handler.exp = 0;

export default handler;
