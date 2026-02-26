const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const QRCode = require('qrcode');
const config = require('./config');
const commands = require('./commands');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

let sock = null;
let qrCode = null;
let connectionState = 'disconnected';

async function connectToWhatsApp() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('./session');

        sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            browser: ['IB-HEX-BOT', 'Chrome', '1.0.0']
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                try {
                    qrCode = await QRCode.toDataURL(qr);
                    connectionState = 'qr';
                    console.log('✅ QR CODE GÉNÉRÉ');
                } catch (err) {
                    console.error('Erreur génération QR:', err);
                }
            }

            if (connection === 'open') {
                connectionState = 'connected';
                qrCode = null;
                console.log('🟢 CONNECTÉ À WHATSAPP');
            }

            if (connection === 'close') {
                connectionState = 'disconnected';

                const shouldReconnect =
                    lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

                if (shouldReconnect) {
                    console.log('♻️ Reconnexion automatique...');
                    connectToWhatsApp();
                } else {
                    console.log('🔴 Déconnecté (session supprimée)');
                    try {
                        fs.rmSync('./session', { recursive: true, force: true });
                    } catch (e) {}
                }
            }
        });

        sock.ev.on('messages.upsert', async (m) => {
            const message = m.messages[0];
            if (!message.message || message.key.fromMe) return;

            const from = message.key.remoteJid;

            const text =
                message.message.conversation ||
                message.message.extendedTextMessage?.text ||
                message.message.imageMessage?.caption ||
                '';

            if (!text.startsWith(config.prefix)) return;

            const commandBody = text.slice(config.prefix.length).trim();
            const args = commandBody.split(' ');
            const commandName = args.shift().toLowerCase();

            const command = commands[commandName];

            if (command) {
                try {
                    await command.execute(sock, message, args, from);
                } catch (error) {
                    console.error('Erreur commande:', error);
                    await sock.sendMessage(from, {
                        text: "❌ Erreur lors de l'exécution de la commande."
                    });
                }
            }
        });

    } catch (error) {
        console.error('Erreur connexion WhatsApp:', error);
    }
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

app.get('/api/connect', async (req, res) => {
    if (connectionState === 'disconnected') {
        await connectToWhatsApp();
        res.json({ success: true, message: 'Connexion initiée' });
    } else {
        res.json({ success: false, message: 'Déjà connecté ou en cours' });
    }
});

app.get('/api/disconnect', (req, res) => {
    if (sock) {
        sock.end();
        connectionState = 'disconnected';
        qrCode = null;
        res.json({ success: true, message: 'Déconnecté' });
    } else {
        res.json({ success: false, message: 'Aucune connexion active' });
    }
});

app.listen(config.port, () => {
    console.log(`🚀 Serveur démarré sur le port ${config.port}`);
    connectToWhatsApp();
});
