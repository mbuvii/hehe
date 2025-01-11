const { cmd } = require('../lib/command');
const fetchJson = require('../lib/functions').fetchJson;

cmd({
    pattern: "aai",
    desc: "AI chat",
    category: "main",
    filename: __filename
}, async (conn, mek, { body }) => {
    try {
        const data = await fetchJson(`https://chatgptforprabath-md.vercel.app/api/gptv1?q=${body}`);
        await conn.sendMessage(mek.key.remoteJid, { text: data.data }, { quoted: mek });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(mek.key.remoteJid, { text: 'An error occurred.' }, { quoted: mek });
    }
});
