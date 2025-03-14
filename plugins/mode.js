const { cmd } = require('../command');
const fs = require('fs');
const modeFile = __dirname + '../my_data/mode.json';

// Charger le mode actuel depuis le fichier JSON
const getMode = () => {
    if (!fs.existsSync(modeFile)) return "private"; // Par défaut : private
    return JSON.parse(fs.readFileSync(modeFile, 'utf8')).mode || "private";
};

// Sauvegarder le mode dans le fichier JSON
const setMode = (newMode) => {
    fs.writeFileSync(modeFile, JSON.stringify({ mode: newMode }, null, 2));
};

// Commande .mode
cmd({
    pattern: "mode",
    desc: "Set the bot mode to private or public.",
    category: "owner",
    react: "🔄",
    filename: __filename,
}, async (conn, mek, m, { reply, args, isOwner }) => {
    if (!isOwner) return reply("❌ Only the owner can change the mode.");

    const newMode = args[0]?.toLowerCase(); // Récupérer l'argument (private/public)

    if (!newMode || !["private", "public"].includes(newMode)) {
        return reply("❌ Please use `.mode private` or `.mode public`.");
    }

    // Sauvegarder le mode
    setMode(newMode);

    return reply(`✅ The bot is now in *${newMode.toUpperCase()}* mode.`);
});