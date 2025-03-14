const fs = require('fs');
const { cmd } = require('../command');
const config = require('../config');

const modeFile = '../my_data/mode.json';

// Vérifier et charger le mode actuel depuis mode.json
const getMode = () => {
    if (!fs.existsSync(modeFile)) {
        fs.writeFileSync(modeFile, JSON.stringify({ mode: "private" }, null, 2));
    }
    const data = fs.readFileSync(modeFile, 'utf8');
    return JSON.parse(data).mode;
};

// Commande pour changer le mode
cmd({
    pattern: "mode",
    desc: "Change bot mode (private/public).",
    category: "owner",
    react: "⚙️",
    filename: __filename,
}, async (conn, mek, m, { reply, args, isOwner }) => {
    if (!isOwner) return reply("❌ Only the owner can change the mode.");

    const newMode = args[0]?.toLowerCase();
    if (!["private", "public"].includes(newMode)) {
        return reply("❌ Usage: .mode private | .mode public");
    }

    // Mettre à jour le mode dans mode.json
    fs.writeFileSync(modeFile, JSON.stringify({ mode: newMode }, null, 2));

    return reply(`✅ Bot mode has been changed to *${newMode.toUpperCase()}*`);
});

// Mettre à jour `config.MODE` au démarrage
config.MODE = getMode();