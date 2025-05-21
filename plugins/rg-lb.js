let handler = async (m, { conn, args, participants }) => {
    let users = Object.entries(global.db.data.users).map(([key, value]) => ({
        ...value,
        jid: key
    }));

    let sortedLevel = users.sort((a, b) => (b.exp || 0) - (a.exp || 0));
    let page = parseInt(args[0]) || 1;
    let pageSize = 10;
    let startIndex = (page - 1) * pageSize;
    let endIndex = startIndex + pageSize;

    let totalPages = Math.ceil(sortedLevel.length / pageSize);
    let text = `◢✨ *Top de usuarios con más experiencia* ✨◤\n\n`;

    const pageUsers = sortedLevel.slice(startIndex, endIndex);
    const mentions = [];

    for (let i = 0; i < pageUsers.length; i++) {
        const { jid, exp = 0, level = 0 } = pageUsers[i];
        const number = jid.split`@`[0];
        const isGroupMember = participants.some(p => p.jid === jid);
        const name = isGroupMember ? await conn.getName(jid) : '';
        if (isGroupMember) mentions.push(jid);
        text += `✰ ${startIndex + i + 1} » *${isGroupMember ? name : '@' + number}*\n`;
        text += `\t\t❖ XP » *${exp}*  ❖ LVL » *${level}*\n\n`;
    }

    text += `> • Página *${page}* de *${totalPages}*`;
    if (page < totalPages) text += `\n> Para ver la siguiente página » *#lb ${page + 1}*`;

    await conn.reply(m.chat, text.trim(), m, {
        mentions
    });
};

handler.help = ['lb'];
handler.tags = ['rpg'];
handler.command = ['lboard', 'top', 'lb']; 
handler.group = true;
handler.exp = 0;

export default handler;