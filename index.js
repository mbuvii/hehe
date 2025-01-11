const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Browsers } = require('@whiskeysockets/baileys');
const { connectDB } = require('./lib/mongodb');
const express = require('express');
const P = require('pino');
const config = require('./config');
const commands = require('./lib/command').commands;

const ownerNumber = ['254746440595'];
const app = express();
const port = process.env.PORT || 8000;

// MongoDB connection
connectDB();

// Function to connect to WhatsApp
async function connectToWA() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys/');
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        browser: Browsers.macOS("Chrome"),
        auth: state,
        version
    });

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        console.log(`Connection status: ${connection}`);

        if (connection === 'close') {
            console.log('Connection closed! Attempting to reconnect...');
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('📡 Connected to WhatsApp successfully! ✅');
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (msg) => {
        if (!msg.messages[0].key.fromMe) {
            const message = msg.messages[0];
            const body = message.message.conversation;
            const command = commands.find((cmd) => body.startsWith(cmd.pattern));

            if (command) {
                try {
                    await command.function(conn, message, { body });
                } catch (error) {
                    console.error(error);
                }
            }
        }
    });
}

// Start Express server
app.get("/", (req, res) => {
    res.send("Hey, Savage MD started✅");
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

// Initiate the connection to WhatsApp
connectToWA();
