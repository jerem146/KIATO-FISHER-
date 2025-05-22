import axios from "axios";

let handler = async (m, { conn, text }) => {
    if (!text) throw '❓ ¿Qué deseas preguntarme?';

    try {
        let data = await chatGpt(text);

        if (!data || typeof data !== 'string' || data.trim().length === 0) {
            throw new Error("No se recibió una respuesta válida.");
        }

        await conn.sendMessage(m.chat, { 
            text: '*Respuesta AI:*\n' + data.trim()
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        m.reply('Ocurrió un error al obtener la respuesta. Intenta más tarde.');
    }
};

handler.help = ['demo *<texto>*'];
handler.command = ['demo', 'openai'];
handler.tags = ['ai'];
handler.group = true;

export default handler;

async function chatGpt(query) {
    try {
        const { id_ } = (await axios.post(
            "https://chat.chatgptdemo.net/new_chat",
            { user_id: "crqryjoto2h3nlzsg" },
            { headers: { "Content-Type": "application/json" } }
        )).data;

        const json = {
            question: query,
            chat_id: id_,
            timestamp: new Date().getTime()
        };

        const { data } = await axios.post(
            "https://chat.chatgptdemo.net/chat_api_stream",
            json,
            { headers: { "Content-Type": "application/json" } }
        );

        const chunks = data.split("data: ");
        let res = [];

        for (let i = 1; i < chunks.length; i++) {
            const trimmed = chunks[i].trim();
            if (trimmed.length > 0) {
                const parsed = JSON.parse(trimmed);
                const content = parsed?.choices?.[0]?.delta?.content;
                if (content) res.push(content);
            }
        }

        return res.join("").trim();

    } catch (error) {
        console.error("Error en chatGpt:", error);
        throw new Error("Fallo la conexión con el servicio AI.");
    }
}