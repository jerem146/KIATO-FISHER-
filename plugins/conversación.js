import axios from "axios";

const emoji = '🤖';

// Palabras que activan al bot si las contiene el mensaje
const palabrasClave = ['bot', 'asistente', 'chatgpt', 'gpt', 'ia'];
const saludos = ['hola', 'buenas', 'saludos', 'hey', 'holi', 'hello', 'qué tal'];

let handler = async (m, { conn }) => {
    if (!m.isGroup || m.fromMe || m.key.fromMe || m.message?.protocolMessage) return;

    const text = m.text?.toLowerCase() || '';
    if (!text || text.length < 2) return;

    const mencionado = m.mentionedJid?.includes(conn.user.jid);
    const contienePalabraClave = palabrasClave.some(p => text.includes(p));
    const comienzaConSaludo = saludos.some(s => text.startsWith(s));
    const respondeAlBot = m.quoted?.sender === conn.user.jid;

    if (!(mencionado || contienePalabraClave || comienzaConSaludo || respondeAlBot)) return;

    try {
        conn.sendPresenceUpdate('composing', m.chat);
        const respuesta = await chatGpt(text);
        await conn.sendMessage(m.chat, {
            text: `*${emoji} ${respuesta.trim()}*`
        }, { quoted: m });
    } catch (err) {
        console.error("Error al generar respuesta:", err);
    }
};

handler.customPrefix = /.*/;
handler.command = new RegExp;
handler.group = true;

export default handler;

// Llamada a la API externa (chat.chatgptdemo.net)
async function chatGpt(query) {
    try {
        const { id_ } = (await axios.post("https://chat.chatgptdemo.net/new_chat", {
            user_id: "crqryjoto2h3nlzsg"
        }, {
            headers: { "Content-Type": "application/json" }
        })).data;

        const json = {
            question: query,
            chat_id: id_,
            timestamp: new Date().getTime()
        };

        const { data } = await axios.post("https://chat.chatgptdemo.net/chat_api_stream", json, {
            headers: { "Content-Type": "application/json" }
        });

        const partes = data.split("data: ").filter(p => p.trim());
        const respuestas = partes.map(p => JSON.parse(p.trim()));
        return respuestas.map(r => r.choices[0].delta.content).join("");

    } catch (error) {
        console.error("Error en chatGpt:", error);
        return "Disculpa, no pude responder en este momento.";
    }
}