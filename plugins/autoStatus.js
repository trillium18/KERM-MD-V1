const { cmd } = require('../command');
const config = require('../config');

// Mots clés déclencheurs
const triggerWords = ["send", "envoie", "envoi", "abeg"];

cmd({
    pattern: "statusAuto",
    react: "📤",
    desc: "Répond automatiquement à une demande de statut.",
    category: "main",
    use: ".statusAuto",
    filename: __filename
}, async (conn, mek, m, { from, body, quoted, sender, reply }) => {
    try {
        // Vérification si le message contient un mot clé
        if (triggerWords.some(word => body.toLowerCase().includes(word))) {
            // Vérifier si c'est une réponse à un statut (viewOnceMessage)
            if (quoted && quoted.message && quoted.message.viewOnceMessage) {
                const viewOnce = quoted.message.viewOnceMessage;

                // Envoi du statut image ou vidéo
                if (viewOnce.message.imageMessage) {
                    await conn.sendMessage(sender, {
                        image: viewOnce.message.imageMessage,
                        caption: "📸 Voici le statut demandé."
                    });
                } else if (viewOnce.message.videoMessage) {
                    await conn.sendMessage(sender, {
                        video: viewOnce.message.videoMessage,
                        caption: "🎥 Voici le statut demandé."
                    });
                } else {
                    reply("❌ Le statut n'est ni une image ni une vidéo.");
                }
            } else {
                reply("❌ Pour recevoir le statut, réponds directement à celui-ci avec un mot clé.");
            }
        }
    } catch (e) {
        console.error("Erreur lors de l'envoi du statut :", e);
        reply("❌ Une erreur est survenue lors de l'envoi du statut.");
    }
});
