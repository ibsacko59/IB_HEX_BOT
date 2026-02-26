const axios = require('axios');
const config = require('./config');

const commands = {};

// Menu principal
commands.menu = {
    name: 'menu',
    description: 'Affiche le menu principal',
    execute: async (sock, msg, args, from) => {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const menuText = `╭──𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧─────🥷
│ 𝗕𝗼𝘁 : ${config.botName}
│ 𝗧𝗲𝗺𝗽𝘀 𝗗𝗲 𝗙𝗼𝗻𝗰𝘁𝗶𝗼𝗻𝗻𝗲𝗺𝗲𝗻𝘁 : ${hours}h ${minutes}m ${seconds}s
│ 𝗠𝗼𝗱𝗲 : privé/public
│ 𝗣𝗿𝗲𝗳𝗶𝘅𝗲 : ${config.prefix}
│ 𝗣𝗿𝗼𝗽𝗿𝗶𝗲́𝘁𝗮𝗶𝗿𝗲 : ${config.ownerName}
│ 𝗗𝗲́𝘃𝗲𝗹𝗼𝗽𝗽𝗲𝘂𝗿 : ${config.devName}
│ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : ${config.version}
╰──────────────🥷
🤖────────────────🤖
🥷 𝐈𝐁𝐑𝐀𝐇𝐈𝐌𝐀 𝐒𝐎𝐑𝐘 𝐒𝐀𝐂𝐊𝐎 🥷
🤖────────────────🤖
🥷─────────────────🥷
『 𝗠𝗘𝗡𝗨-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗺𝗲𝗻𝘂 → afficher le menu
│ ⬡ 𝗮𝗹𝗶𝘃𝗲 → état du bot
│ ⬡ 𝗱𝗲𝘃 → développeur
│ ⬡ 𝗮𝗹𝗹𝘃𝗮𝗿 → toutes les variables
│ ⬡ 𝗽𝗶𝗻𝗴 → vitesse du bot
│ ⬡ 𝗼𝘄𝗻𝗲𝗿 → propriétaire
╰──────────────────🥷
🥷──────────────────🥷
『 𝗢𝗪𝗡𝗘𝗥-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗷𝗼𝗶𝗻 → rejoindre un groupe
│ ⬡ 𝗹𝗲𝗮𝘃𝗲 → quitter un groupe
│ ⬡ 𝗮𝗻𝘁𝗶𝗱𝗲𝗹𝗲𝘁𝗲 → anti-suppression
│ ⬡ 𝘂𝗽𝗹𝗼𝗮𝗱 → téléverser
│ ⬡ 𝘃𝘃 → vue
│ ⬡ 𝗮𝗹𝗹𝗰𝗺𝗱𝘀 → toutes les commandes
│ ⬡ 𝗱𝗲𝗹𝗲𝘁𝗲 → supprimer
│ ⬡ 🥷 → envoi vue unique en privé
╰──────────────────🥷
🥷──────────────────🥷
『 𝗜𝗔-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗮𝗶 → intelligence artificielle
│ ⬡ 𝗯𝘂𝗴 → signaler un bug
│ ⬡ 𝗯𝗼𝘁 → informations bot
│ ⬡ 𝗴𝗲𝗺𝗶𝗻𝗶 → IA Gemini
│ ⬡ 𝗰𝗵𝗮𝘁𝗯𝗼𝘁 → discussion IA
│ ⬡ 𝗴𝗽𝘁 → ChatGPT
╰──────────────────🥷
🥷──────────────────🥷
『 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗦𝗦𝗘𝗨𝗥-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗮𝘁𝘁𝗽 → texte en sticker
│ ⬡ 𝘁𝗼𝗶𝗺𝗮𝗴𝗲 → convertir en image
│ ⬡ 𝗴𝗶𝗺𝗮𝗴𝗲 → image Google
│ ⬡ 𝗺𝗽3 → convertir en MP3
│ ⬡ 𝘀𝘀 → capture d’écran
│ ⬡ 𝗳𝗮𝗻𝗰𝘆 → texte stylé
│ ⬡ 𝘂𝗿𝗹 → lien
│ ⬡ 𝘀𝘁𝗶𝗰𝗸𝗲𝗿 → créer sticker
│ ⬡ 𝘁𝗮𝗸𝗲 → récupérer média
╰──────────────────🥷
🥷──────────────────🥷
『 𝗥𝗘𝗖𝗛𝗘𝗥𝗖𝗛𝗘-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗴𝗼𝗼𝗴𝗹𝗲 → recherche Google
│ ⬡ 𝗽𝗹𝗮𝘆 → Play Store
│ ⬡ 𝘃𝗶𝗱𝗲𝗼 → recherche vidéo
│ ⬡ 𝘀𝗼𝗻𝗴 → musique
│ ⬡ 𝗺𝗲𝗱𝗶𝗮𝗳𝗶𝗿𝗲 → MediaFire
│ ⬡ 𝗳𝗮𝗰𝗲𝗯𝗼𝗼𝗸 → Facebook
│ ⬡ 𝗶𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 → Instagram
│ ⬡ 𝘁𝗶𝗸𝘁𝗼𝗸 → TikTok
│ ⬡ 𝗹𝘆𝗿𝗶𝗰𝘀 → paroles
│ ⬡ 𝗶𝗺𝗮𝗴𝗲 → images
╰──────────────────🥷
🥷──────────────────🥷
『 𝗗𝗜𝗩𝗘𝗥𝗧𝗜𝗦𝗦𝗘𝗠𝗘𝗡𝗧-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗴𝗲𝘁𝗽𝗽 → photo de profil
│ ⬡ 𝗴𝗼𝗼𝗱𝗻𝗶𝗴𝗵𝘁 → bonne nuit
│ ⬡ 𝘄𝗰𝗴 → classement
│ ⬡ 𝗾𝘂𝗶𝘇𝘇 → quiz
│ ⬡ 𝗮𝗻𝗶𝗺𝗲 → anime
│ ⬡ 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 → profil
│ ⬡ 𝗰𝗼𝘂𝗽𝗹𝗲 → couple
│ ⬡ 𝗽𝗼𝗹𝗹 → sondage
│ ⬡ 𝗲𝗺𝗼𝗷𝗶𝗺𝗶𝘅 → mélange d’emojis
╰──────────────────🥷
🥷─────────────────🥷
『 𝗚𝗥𝗢𝗨𝗣𝗘𝗦-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝗸𝗶𝗰𝗸𝗮𝗹𝗹 → exclure tous
│ ⬡ 𝘁𝗮𝗴𝗮𝗱𝗺𝗶𝗻 → mention admins
│ ⬡ 𝗮𝗰𝗰𝗲𝗽𝘁𝗮𝗹𝗹 → accepter tous
│ ⬡ 𝘁𝗮𝗴𝗮𝗹𝗹 → mentionner tous
│ ⬡ 𝗴𝗲𝘁𝗮𝗹𝗹 → récupérer membres
│ ⬡ 𝗴𝗿𝗼𝘂𝗽 𝗰𝗹𝗼𝘀𝗲 → fermer groupe
│ ⬡ 𝗴𝗿𝗼𝘂𝗽 𝗼𝗽𝗲𝗻 → ouvrir groupe
│ ⬡ 𝗮𝗱𝗱 → ajouter membre
│ ⬡ 𝘃𝗰𝗳 → contacts VCF
│ ⬡ 𝗹𝗶𝗻𝗸𝗴𝗰 → lien du groupe
│ ⬡ 𝗮𝗻𝘁𝗶𝗹𝗶𝗻𝗸 → anti-lien
│ ⬡ 𝗮𝗻𝘁𝗶𝘀𝘁𝗶𝗰𝗸𝗲𝗿 → anti-sticker
│ ⬡ 𝗮𝗻𝘁𝗶𝗴𝗺 → anti-mention
│ ⬡ 𝗰𝗿𝗲𝗮𝘁𝗲 → créer groupe
│ ⬡ 𝗴𝗿𝗼𝘂𝗽𝗶𝗻𝗳𝗼 → infos groupe
╰──────────────────🥷
🥷──────────────────🥷
『 𝗥𝗘́𝗔𝗖𝗧𝗜𝗢𝗡𝗦-𝗛𝗘𝗫-𝗕𝗢𝗧 』
│ ⬡ 𝘆𝗲𝗲𝘁 → jeter
│ ⬡ 𝘀𝗹𝗮𝗽 → gifler
│ ⬡ 𝗻𝗼𝗺 → manger
│ ⬡ 𝗽𝗼𝗸𝗲 → toucher
│ ⬡ 𝘄𝗮𝘃𝗲 → saluer
│ ⬡ 𝘀𝗺𝗶𝗹𝗲 → sourire
│ ⬡ 𝗱𝗮𝗻𝗰𝗲 → danser
│ ⬡ 𝘀𝗺𝘂𝗴 → sourire narquois
│ ⬡ 𝗰𝗿𝗶𝗻𝗴𝗲 → malaise
│ ⬡ 𝗵𝗮𝗽𝗽𝘆 → heureux
╰──────────────────🥷
🥷───────────────────🥷
⚡ 𝐂𝐄𝐍𝐓𝐑𝐀𝐋-𝐇𝐄𝐗 ⚡
propulsé par 𝐈𝐛-𝐒𝐚𝐜𝐤𝐨™
🥷───────────────────🥷`;

        await sock.sendMessage(from, { 
            image: { url: config.menuImage },
            caption: menuText 
        });
    }
};

// Commande Alive
commands.alive = {
    name: 'alive',
    description: 'Vérifie si le bot est en ligne',
    execute: async (sock, msg, args, from) => {
        await sock.sendMessage(from, { text: '🤖 Bot IB-HEX-BOT est en ligne et fonctionnel !' });
    }
};

// Commande Ping
commands.ping = {
    name: 'ping',
    description: 'Vérifie la vitesse du bot',
    execute: async (sock, msg, args, from) => {
        const start = Date.now();
        await sock.sendMessage(from, { text: '🏓 Pong!' });
        const end = Date.now();
        await sock.sendMessage(from, { text: `⏱️ Latence: ${end - start}ms` });
    }
};

// Commande Dev
commands.dev = {
    name: 'dev',
    description: 'Informations sur le développeur',
    execute: async (sock, msg, args, from) => {
        await sock.sendMessage(from, { text: `👨‍💻 Développeur: ${config.devName}\n📱 Propriétaire: ${config.ownerName}\n🤖 Bot: ${config.botName}` });
    }
};

// Commande Owner
commands.owner = {
    name: 'owner',
    description: 'Affiche le propriétaire',
    execute: async (sock, msg, args, from) => {
        await sock.sendMessage(from, { text: `👑 Propriétaire: ${config.ownerName}\n📞 Contact: ${config.ownerNumber}` });
    }
};

// Commande 🥷 (vues uniques)
commands['🥷'] = {
    name: '🥷',
    description: 'Envoie une vue unique en privé',
    execute: async (sock, msg, args, from) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (quoted) {
            const mediaMessage = quoted;
            await sock.sendMessage(sender, { 
                text: "🥷 Voici votre média en vue unique :",
                contextInfo: { 
                    forwardingScore: 0,
                    isForwarded: false
                }
            });
            await sock.sendMessage(sender, { 
                ...mediaMessage,
                viewOnce: true 
            });
        } else {
            await sock.sendMessage(from, { text: '❌ Veuillez répondre à un message avec la commande 🥷' });
        }
    }
};

// Commande Allcmds
commands.allcmds = {
    name: 'allcmds',
    description: 'Affiche toutes les commandes',
    execute: async (sock, msg, args, from) => {
        let cmdList = '📋 *LISTE DE TOUTES LES COMMANDES*\n\n';
        Object.keys(commands).forEach(cmd => {
            cmdList += `▸ *${config.prefix}${cmd}* : ${commands[cmd].description}\n`;
        });
        await sock.sendMessage(from, { text: cmdList });
    }
};

// Commande Help
commands.help = {
    name: 'help',
    description: 'Aide et explications',
    execute: async (sock, msg, args, from) => {
        const helpText = `📚 *AIDE IB-HEX-BOT*\n\n` +
            `🤖 *Comment utiliser le bot:*\n` +
            `• Utilisez le préfixe *${config.prefix}* avant chaque commande\n` +
            `• Exemple: ${config.prefix}menu\n\n` +
            `🌐 *Commandes disponibles:*\n` +
            `• Toutes les commandes sont publiques\n` +
            `• Tapez ${config.prefix}allcmds pour voir toutes les commandes\n\n` +
            `🥷 *Commande spéciale:*\n` +
            `• ${config.prefix}🥷 (répondre à un message) pour recevoir en privé\n\n` +
            `📱 *Support:*\n` +
            `• Pour signaler un bug: ${config.prefix}bug [description]\n` +
            `• Propriétaire: ${config.ownerName}`;
        
        await sock.sendMessage(from, { text: helpText });
    }
};

// Commande Google
commands.google = {
    name: 'google',
    description: 'Recherche Google',
    execute: async (sock, msg, args, from) => {
        if (!args.length) return sock.sendMessage(from, { text: '❌ Tapez une recherche' });
        
        const query = args.join(' ');
        try {
            const response = await axios.get(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=AIzaSyA1eXxKZzKzKzKzKzKzKzKzKzKzKzKzKzK&cx=017576662512468239146:omuauf_lfve`);
            const results = response.data.items.slice(0, 3);
            let text = `🔍 *Résultats pour: ${query}*\n\n`;
            results.forEach((item, i) => {
                text += `${i+1}. *${item.title}*\n${item.link}\n${item.snippet}\n\n`;
            });
            await sock.sendMessage(from, { text });
        } catch (error) {
            await sock.sendMessage(from, { text: '❌ Erreur lors de la recherche' });
        }
    }
};

// Commande AI (simulée)
commands.ai = {
    name: 'ai',
    description: 'Intelligence artificielle',
    execute: async (sock, msg, args, from) => {
        if (!args.length) return sock.sendMessage(from, { text: '❌ Posez une question' });
        
        const question = args.join(' ');
        await sock.sendMessage(from, { text: `🤖 *IA Response:*\n\nJe suis en développement. Votre question: "${question}" sera traitée bientôt!` });
    }
};

// Commande Sticker
commands.sticker = {
    name: 'sticker',
    description: 'Crée un sticker',
    execute: async (sock, msg, args, from) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted || !quoted.imageMessage) {
            return sock.sendMessage(from, { text: '❌ Répondez à une image avec cette commande' });
        }
        
        const media = await sock.downloadMediaMessage(msg.message.extendedTextMessage.contextInfo.quotedMessage);
        await sock.sendMessage(from, { 
            sticker: media,
            contextInfo: { forwardingScore: 0, isForwarded: false }
        });
    }
};

// Commande Bug
commands.bug = {
    name: 'bug',
    description: 'Signaler un bug',
    execute: async (sock, msg, args, from) => {
        if (!args.length) return sock.sendMessage(from, { text: '❌ Décrivez le bug' });
        
        const bug = args.join(' ');
        const sender = msg.key.participant || msg.key.remoteJid;
        
        await sock.sendMessage(config.ownerNumber + '@s.whatsapp.net', { 
            text: `🐛 *Bug signalé*\nDe: ${sender}\nMessage: ${bug}` 
        });
        await sock.sendMessage(from, { text: '✅ Bug signalé au développeur' });
    }
};

// Commande Allvar
commands.allvar = {
    name: 'allvar',
    description: 'Affiche toutes les variables',
    execute: async (sock, msg, args, from) => {
        const vars = Object.keys(config).map(key => `• ${key}: ${config[key]}`).join('\n');
        await sock.sendMessage(from, { text: `📊 *VARIABLES*\n\n${vars}` });
    }
};

module.exports = commands;
