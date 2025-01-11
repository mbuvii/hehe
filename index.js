// index.js
// Import necessary libraries and modules
const express = require('express');
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');
const { readEnv } = require('./lib/database');
const connectDB = require('./lib/mongodb');
const { File } = require('megajs');

const app = express();
const port = process.env.PORT || 8000;

const ownerNumber = ['254746440595']; // Update to your owner's numbers

// Check for existing session credentials and download if missing
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
    if (!config.SESSION_ID) {
        console.log('Please add your session to SESSION_ID env !!');
    } else {
        const sessdata = config.SESSION_ID;
        const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
        filer.download((err, data) => {
            if (err) throw err;
            fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
                console.log("Session downloaded ✅");
            });
        });
    }
}

// MongoDB connection
connectDB();

// Function to connect to WhatsApp
async function connectToWA() {
    console.log("Connecting SAVAGE MD 🧬...");

    // Reading environment configuration
    const envConfig = await readEnv();
    const prefix = envConfig.PREFIX;

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
        console.log("Incoming message:", mek);
        // Add your message handling logic here as needed
    });
}

// Basic Express route for health check
app.get("/", (req, res) => {
    res.send("Hey, Savage MD started✅"); // Basic health check response
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});

// Initiate the connection to WhatsApp after a slight delay
setTimeout(() => {
    connectToWA();
}, 4000);
