const { cmd } = require('../lib/command');
const { readEnv } = require('../lib/database');

cmd({
    pattern: "alive",
    desc: "Check if bot is online",
    category: "main",
    filename: __filename
}, async (conn, mek) => {
    try {
        const config = await readEnv();
        const aliveMessage = {
            image: { url: config.ALIVE_IMG },
            caption: config.ALIVE_MSG,
        };
        await conn.sendMessage(mek.key.remoteJid, aliveMessage, { quoted: mek });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(mek.key.remoteJid, { text: 'An error occurred.' }, { quoted: mek });
    }
});
