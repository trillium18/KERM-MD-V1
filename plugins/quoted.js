
const { cmd } = require("../command");
const { forwardMessage } = require('../lib/msg');
const { proto } = require('@whiskeysockets/baileys');

cmd({
    pattern: "quoted",
    desc: "Forward a quoted message in the same chat.",
    category: "general",
    react: "📩",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, isOwner, reply }) => {
    try {
        // Vérifier si l'utilisateur est le propriétaire du bot
        if (!isOwner) return reply("❌ Only the bot owner can use this command.");

        // Vérifier si un message est cité
        if (!quoted) return reply("❌ Please reply to a message to forward it.");

        // Transférer le message dans le même chat
        await conn.forwardMessage(from, quoted, { quoted: mek });

    } catch (e) {
        console.error("Error in .quoted command:", e);
        reply("❌ An error occurred while forwarding the message.");
    }
});