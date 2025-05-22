import axios from "axios";

const emoji = '💬'; // Puedes cambiarlo por uno más amigable si deseas

let handler = async (m, { conn }) => {
    if (!m.isGroup || m.fromMe || m.message?.protocolMessage) return;

    // Verifica si están respondiendo a un mensaje del bot
    const respondeAlBot = m.quoted?.sender === conn.user.jid;
    if (!respondeAlBot) return;

    const contenido = getContenidoMensaje(m);
    if (!contenido || contenido.length < 1) return;

    try {
        conn.sendPresenceUpdate('composing', m.chat);
        const respuesta = await chatGptConversacional(contenido);
        await conn.sendMessage(m.chat, {
            text: `*${emoji} ${respuesta.trim()}*`
        }, { quoted: m });
    } catch (e) {
        console.error("Error al responder conversacionalmente:", e);
        await conn.sendMessage(m.chat, { text: "Ups, algo salió mal al intentar responder." }, { quoted: m });
    }
};

handler.customPrefix = /.*/;
handler.command = new RegExp;
handler.group = true;

export default handler;

// Extrae texto de diferentes tipos de mensajes
function getContenidoMensaje(m) {
    const msg = m.message || {};
    if (msg.conversation) return msg.conversation;
    if (msg.extendedTextMessage) return msg.extendedTextMessage.text;
    if (msg.imageMessage) return msg.imageMessage.caption || '[imagen]';
    if (msg.videoMessage) return msg.videoMessage.caption || '[video]';
    if (msg.stickerMessage) return '[sticker]';
    if (msg.audioMessage) return '[audio]';
    if (msg.documentMessage) return '[documento]';
    return '';
}

// Estilo conversacional
async function chatGptConversacional(input) {
    try {
        const { id_ } = (await axios.post("https://chat.chatgptdemo.net/new_chat", {
            user_id: "crqryjoto2h3nlzsg"
        }, {
            headers: { "Content-Type": "application/json" }
        })).data;

        const json = {
            question: `Quiero que respondas como si fueras un amigo amable que conversa con naturalidad. Me acaban de decir o enviar esto: "${input}". ¿Qué responderías tú como una persona real?`,
            chat_id: id_,
            timestamp: new Date().getTime()
        };

        const { data } = await axios.post("https://chat.chatgptdemo.net/chat_api_stream", json, {
            headers: { "Content-Type": "application/json" }
        });

        const partes = data.split("data: ").filter(p => p.trim());
        const respuestas = partes.map(p => JSON.parse(p.trim()));
        return respuestas.map(r => r.choices[0].delta.content).join("") || "¿Me puedes repetir eso?";
    } catch (e) {
        return "Lo siento, no entendí bien eso. ¿Puedes decirlo de otra forma?";
    }
}