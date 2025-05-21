let handler = async (m, { conn, participants, args }) => {
    let titulo = args.join(" ");
    if (!titulo) throw '✦ Escribe una categoría. Ejemplo:\n> #top simp\n> #top virgen';

    let miembros = participants.map(p => p.id).filter(id => id !== conn.user.jid);
    let seleccionados = miembros.sort(() => Math.random() - 0.5).slice(0, 10);

    if (seleccionados.length < 1) throw '✦ No hay suficientes participantes en el grupo.';

    let texto = `✦ 𝗧𝗢𝗣 𝟭𝟬 ${titulo.toUpperCase()} ✦\n\n`;
    texto += seleccionados.map((id, i) => `*${i + 1}.* @${id.split('@')[0]}`).join('\n');

    await conn.sendMessage(m.chat, { text: texto, mentions: seleccionados }, { quoted: m });
};

handler.help = ['top <categoría>'];
handler.tags = ['fun'];
handler.command = ['top']; 
handler.group = true;


export default handler;