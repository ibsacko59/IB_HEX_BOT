const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const QRCode = require('qrcode');
const config = require('./config');
const commands = require('./commands');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static('public'));

let sock = null;
let qrCode = null;
let connectionState = 'disconnected';

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        defaultQueryTimeoutMs: undefined
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrCode = await QRCode.toDataURL(qr);
            connectionState = 'qr';
            console.log('QR Code généré');
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                connectToWhatsApp();
            } else {
                connectionState = 'disconnected';
                fs.rmSync(config.sessionFile, { recursive: true, force: true });
            }
        } else if (connection === 'open') {
            connectionState = 'connected';
            qrCode = null;
            console.log('Connecté à WhatsApp');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (!message.message || message.key.fromMe) return;

        const from = message.key.remoteJid;
        const text = message.message.conversation || 
                     message.message.extendedTextMessage?.text || 
                     message.message.imageMessage?.caption || '';

        if (text.startsWith(config.prefix)) {
            const commandBody = text.slice(config.prefix.length).trim();
            const args = commandBody.split(' ');
            const commandName = args.shift().toLowerCase();

            const command = commands[commandName];
            if (command) {
                try {
                    await command.execute(sock, message, args, from);
                } catch (error) {
                    console.error('Erreur commande:', error);
                    await sock.sendMessage(from, { text: '❌ Erreur lors de l\'exécution' });
                }
            }
        }
    });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/status', (req, res) => {
    res.json({ 
        status: connectionState, 
        qr: qrCode,
        botName: config.botName,
        owner: config.ownerName
    });
});

app.get('/api/connect', (req, res) => {
    if (connectionState === 'disconnected') {
        connectToWhatsApp();
        res.json({ success: true, message: 'Connexion initiée' });
    } else {
        res.json({ success: false, message: 'Déjà connecté ou en cours' });
    }
});

app.get('/api/disconnect', (req, res) => {
    if (sock) {
        sock.end(undefined);
        connectionState = 'disconnected';
        res.json({ success: true, message: 'Déconnecté' });
    } else {
        res.json({ success: false, message: 'Pas de connexion' });
    }
});

app.listen(config.port, () => {
    console.log(`Serveur démarré sur http://localhost:${config.port}`);
    connectToWhatsApp();
});
