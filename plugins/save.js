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
const { downloadMediaMessage } = require('../lib/msg');

cmd({
    pattern: "save",
    desc: "Envoie le message multimédia sauvegardé dans le PM du bot.",
    category: "owner",
    react: "👀",
    filename: __filename
}, async (conn, mek, m, { from, quoted, reply, botNumber }) => {
    try {
        if (!quoted) return reply("❌ Répondez à un message multimédia pour le sauvegarder !");

        // Récupération du type de message cité
        const mediaType = Object.keys(quoted.message)[0];
        const stream = await downloadMediaMessage(quoted);

        if (!stream) return reply("❌ Échec du téléchargement du média.");

        let messageOptions = {};
        if (mediaType.includes('image')) {
            messageOptions = { image: stream, caption: quoted.msg.caption || '' };
        } else if (mediaType.includes('video')) {
            messageOptions = { video: stream, caption: quoted.msg.caption || '' };
        } else if (mediaType.includes('audio')) {
            messageOptions = { audio: stream, mimetype: 'audio/mp4', ptt: quoted.msg.ptt || false };
        } else if (mediaType.includes('document')) {
            messageOptions = { document: stream, mimetype: quoted.msg.mimetype, fileName: quoted.msg.fileName };
        } else {
            return reply("❌ Type de média non supporté pour la sauvegarde.");
        }

        // Récupération du JID du bot
        const botJid = conn.user.jid; // Utilisation du JID du bot (conn.user.jid)

        // Envoi dans le PM du bot en utilisant son JID
        await conn.sendMessage(botJid, messageOptions);
        reply("✅ Média sauvegardé et envoyé dans le PM du bot !");
    } catch (error) {
        console.error("Erreur lors de la sauvegarde :", error);
        reply("❌ Une erreur est survenue lors de la sauvegarde du média.");
    }
});
