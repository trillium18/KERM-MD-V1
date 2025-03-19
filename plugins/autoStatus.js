const { cmd } = require('../command');
const config = require('../config');

// Liste des mots clés pour déclencher l'envoi du statut
const triggerWords = ["send", "envoie", "envoi", "abeg"];

cmd({
    pattern: "autoStatus",
    react: "📤",
    desc: "Envoie automatiquement le statut à la personne qui le demande.",
    category: "main",
    use: ".autoStatus",
    filename: __filename
}, async (conn, mek, m, { from, body, quoted, sender, reply }) => {
    try {
        // Vérification si le message contient un des mots clés
        if (triggerWords.some(word => body.toLowerCase().includes(word))) {
            // Vérifie si le message est une réponse à un statut
            if (quoted && quoted.message && quoted.message.viewOnceMessage) {
                // Extraction du message de type viewOnce (statut)
                const viewOnce = quoted.message.viewOnceMessage;

                // Envoi de l'image ou de la vidéo du statut
                if (viewOnce.message.imageMessage) {
                    await conn.sendMessage(from, {
                        image: viewOnce.message.imageMessage,
                        caption: viewOnce.message.imageMessage.caption || "Voici le statut demandé."
                    }, { quoted: mek });
                } else if (viewOnce.message.videoMessage) {
                    await conn.sendMessage(from, {
                        video: viewOnce.message.videoMessage,
                        caption: viewOnce.message.videoMessage.caption || "Voici le statut demandé."
                    }, { quoted: mek });
                } else {
                    reply("❌ Le statut n'est ni une image ni une vidéo.");
                }
            } else {
                reply("❌ Réponds à un statut pour demander son envoi.");
            }
        }
    } catch (e) {
        console.error("Erreur lors de l'envoi du statut :", e);
        reply("❌ Une erreur est survenue lors de l'envoi du statut.");
    }
});
