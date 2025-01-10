const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
} = require('@whiskeysockets/baileys');

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const express = require('express');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage } = require('./lib/msg');
const axios = require('axios');
const { File } = require('megajs');

const ownerNumber = ['254746440595']; // Update to your owner's numbers
const app = express();
const port = process.env.PORT || 8000;

// Check for existing session credentials
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
    if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
    const sessdata = config.SESSION_ID;
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
    filer.download((err, data) => {
        if (err) throw err;
        fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
            console.log("Session downloaded ✅");
        });
    });
}

// MongoDB connection
const connectDB = require('./lib/mongodb');
connectDB();

// Function to connect to WhatsApp
async function connectToWA() {
    // Reading environment configuration
    const { readEnv } = require('./lib/database');
    const envConfig = await readEnv();
    const prefix = envConfig.PREFIX;

    console.log("Connecting SAVAGE MD 🧬...");
    
    // Setup the auth state
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
    const { version } = await fetchLatestBaileysVersion();

    // Create a new WA socket instance
    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        browser: Browsers.macOS("Chrome"),
        syncFullHistory: true,
        auth: state,
        version
    });

    // Handle connection updates
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        console.log(`Connection status: ${connection}`);

        if (connection === 'close') {
            console.log('Connection closed! Attempting to reconnect...');
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                // Only try to reconnect if not logged out
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('📡 Connected to WhatsApp successfully! ✅');
            // You could send a welcome message or something similar here
        }
    });

    // Save credentials on update
    conn.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    conn.ev.on('messages.upsert', async (mek) => {
        // Add your message handling logic here
        console.log("Incoming message:", mek);
    });
}

// Basic Express route for health check
app.get("/", (req, res) => {
    res.send("Hey, Savage MD started✅");
});

// Start the Express server
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

// Initiate the connection to WhatsApp after a slight delay
setTimeout(() => {
    connectToWA();
}, 4000);
