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

/*const config = require('../config');
const { cmd, commands } = require('../command');
const { proto, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { sms,downloadMediaMessage } = require('../lib/msg');
const fs = require('fs');
const exec = require('child_process');
const path = require('path');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions');

cmd({
    pattern: "save",
    desc: "Get status or media message.",
    category: "owner",
    react: "👀",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!quoted) return reply("Please reply to a media message!");

        try {
            const buff = await quoted.getbuff;
            const cap = quoted.msg.caption || '';

            if (quoted.type === 'imageMessage') {
                await conn.sendMessage(`${ownerNumber}@s.whatsapp.net`, {
                    image: buff,
                    caption: cap
                }); 
            } else if (quoted.type === 'videoMessage') {
                await conn.sendMessage(`${ownerNumber}@s.whatsapp.net`, {
                    video: buff,
                    caption: cap
                }); 
            } else if (quoted.type === 'audioMessage') {
                await conn.sendMessage(`${ownerNumber}@s.whatsapp.net`, {
                    audio: buff,
                    ptt: quoted.msg.ptt || false
                }); 
            } else {
                return reply("_*Unknown/Unsupported media*_");
            }
        } catch (error) {
            console.error(error);
            reply(`${error}`);
        }
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});*/

const { cmd } = require('../command');
const config = require('../config');

// Remplace ce numéro par celui du propriétaire (Owner) du bot
const ownerNumber = config.OWNER_NUMBER || '237XXXXXXXXX';

cmd({
    pattern: "save",
    react: "💾",
    desc: "Envoie le message sauvegardé dans le PM du Owner.",
    category: "main",
    use: ".save (répondre à un message)",
    filename: __filename
}, async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        // Vérifier si c'est une réponse à un message
        if (!quoted) return reply("❌ Réponds à un message avec 'save' pour le sauvegarder.");

        // Contenu du message répondu
        const savedMessage = quoted.text || quoted.message.conversation || "🔹 Message multimédia non textuel";

        // Envoi du message dans le PM du propriétaire (Owner)
        await conn.sendMessage(ownerNumber + '@s.whatsapp.net', {
            text: `💾 *Message sauvegardé par ${sender}:*\n\n"${savedMessage}"`,
        });

        reply("✅ Message sauvegardé et envoyé à l'Owner.");
    } catch (e) {
        console.error("Erreur lors de la sauvegarde du message :", e);
        reply("❌ Une erreur est survenue lors de l'envoi du message.");
    }
});
