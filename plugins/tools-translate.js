import translate from '@vitalets/google-translate-api';
import fetch from 'node-fetch';

const handler = async (m, { args, usedPrefix, command }) => {
  const msg = `${emoji} Por favor, ingresa el *(idioma)* seguido del *(texto)* para traducirlo.`;
  if (!args || !args[0]) return m.reply(msg);

  let lang = args[0];
  let text = args.slice(1).join(' ');
  const defaultLang = 'es';

  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }

  if (!text && m.quoted?.text) text = m.quoted.text;

  try {
    const result = await translate(text, { to: lang, autoCorrect: true });
    await conn.reply(m.chat, result.text, m);
  } catch {
    try {
      conn.reply(m.chat, wait, m, {
        contextInfo: {
          externalAdReply: {
            mediaUrl: null,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      });

      const res = await fetch(`https://api.lolhuman.xyz/api/translate/auto/${lang}?apikey=${lolkeysapi}&text=${text}`);
      const json = await res.json();
      const translated = json.result.translated;
      await conn.reply(m.chat, translated, m);

    } catch {
      await m.reply(`${msm} Ocurrió un error al traducir.`);
    }
  }
};

handler.command = ['translate', 'traducir', 'trad'];
export default handler;