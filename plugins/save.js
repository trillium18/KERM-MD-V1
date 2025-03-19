/*
_  ______   _____ _____ _____ _   _
| |/ / ___| |_   _| ____/___ | | | |
| ' / |  _    | | |  _|| |   | |_| |
| . \ |_| |   | | | |__| |___|  _  |
|_|\_\____|   |_| |_____\____|_| |_|

ANYWAY, YOU MUST GIVE CREDIT TO MY CODE WHEN COPY IT
CONTACT ME HERE +237656520674
YT: KermHackTools
Github: Kgtech-cmr
*/

const config = require('../config');
const { cmd, commands } = require('../command');
const { downloadMediaMessage, sms } = require('../lib/msg');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "save",
    desc: "Envoie le message multimédia sauvegardé dans le PM du bot.",
    category: "owner",
    react: "👀",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!quoted) return reply("❌ Répondez à un message multimédia pour le sauvegarder !");

        // Téléchargement du média
        const mediaType = Object.keys(quoted.message)[0]; // Type du média (image, vidéo, etc.)
        const stream = await downloadMediaMessage(quoted, 'buffer'); // Téléchargement en buffer

        if (!stream) return reply("❌ Échec du téléchargement du média.");

        // Définition de l'extension de fichier et du type d'envoi
        let messageOptions = {};
        if (mediaType === 'imageMessage') {
            messageOptions = { image: stream, caption: quoted.msg.caption || '' };
        } else if (mediaType === 'videoMessage') {
            messageOptions = { video: stream, caption: quoted.msg.caption || '' };
        } else if (mediaType === 'audioMessage') {
            messageOptions = { audio: stream, mimetype: 'audio/mp4', ptt: quoted.msg.ptt || false };
        } else if (mediaType === 'documentMessage') {
            messageOptions = { document: stream, mimetype: quoted.msg.mimetype, fileName: quoted.msg.fileName };
        } else {
            return reply("❌ Type de média non supporté pour la sauvegarde.");
        }

        // Envoi dans le PM du bot lui-même (botNumber)
        await conn.sendMessage(botNumber, messageOptions);

        reply("✅ Média sauvegardé et envoyé dans le PM du bot !");
    } catch (error) {
        console.error("Erreur lors de la sauvegarde :", error);
        reply("❌ Une erreur est survenue lors de la sauvegarde du média.");
    }
});
