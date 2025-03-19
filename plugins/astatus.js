const { cmd } = require('../command');
const config = require('../config');

// Mots clés pour déclencher l'envoi du statut
const triggerWords = ["send", "envoie", "envoi", "abeg"];

// Fonction principale du bot
cmd({
    pattern: "status",
    react: "📤",
    desc: "Envoie automatiquement le statut à la personne qui demande.",
    category: "main",
    use: ".status",
    filename: __filename
}, async (conn, mek, m, { from, body, quoted, sender, reply }) => {
    try {
        // Vérification des mots clés dans le message reçu
        if (triggerWords.some(word => body.toLowerCase().includes(word))) {
            // Vérifier si c'est une réponse à un statut
            if (quoted && quoted.isStatus) {
                const mediaMessage = quoted.message;

                // Vérifier si c'est une image, une vidéo ou un texte
                if (mediaMessage.imageMessage) {
                    await conn.sendMessage(from, {
                        image: { url: mediaMessage.imageMessage.url },
                        caption: mediaMessage.imageMessage.caption || ""
                    }, { quoted: mek });
                } else if (mediaMessage.videoMessage) {
                    await conn.sendMessage(from, {
                        video: { url: mediaMessage.videoMessage.url },
                        caption: mediaMessage.videoMessage.caption || ""
                    }, { quoted: mek });
                } else if (mediaMessage.conversation) {
                    await conn.sendMessage(from, {
                        text: mediaMessage.conversation
                    }, { quoted: mek });
                } else {
                    reply("❌ Type de média non pris en charge.");
                }
            } else {
                reply("❌ Réponds à un statut pour demander l'envoi.");
            }
        }
    } catch (e) {
        console.error(e);
        reply("❌ Une erreur est survenue.");
    }
});
