const { cmd } = require('../command');

cmd({
    pattern: "ping3",
    desc: "Vérifie le temps de réponse du bot.",
    category: "info",
    react: "🏓",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    const start = Date.now();  // Capture le moment avant l'envoi de la réponse
    reply("🏓 **Pong!**").then(() => {
        const end = Date.now();  // Capture le moment après l'envoi de la réponse
        const ping = end - start;  // Calcul du temps de réponse
        reply(`⏱️ **Temps de réponse** du bot: \n**${ping}ms**\n\n🔄 Le bot répond rapidement !`);
    });
});