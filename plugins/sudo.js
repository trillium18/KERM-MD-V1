const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');

// Charger la liste des sudo users depuis un fichier JSON
const sudoFile = '../my_data/sudo.json';
let sudoUsers = [];

try {
    if (fs.existsSync(sudoFile)) {
        sudoUsers = JSON.parse(fs.readFileSync(sudoFile));
    }
} catch (error) {
    console.error("Erreur lors du chargement des sudo users:", error);
}

// Sauvegarder la liste des sudo users
const saveSudoUsers = () => {
    fs.writeFileSync(sudoFile, JSON.stringify(sudoUsers, null, 2));
};

// Ajouter un sudo user
cmd({
    pattern: "setsudo",
    react: "🔧",
    desc: "Ajoute un utilisateur en tant que sudo.",
    category: "admin",
    use: ".setsudo (numéro ou réponse à un message)",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply, sender, isOwner, quoted }) => {
    if (!isOwner) return reply("❌ Seul le propriétaire peut ajouter un sudo user.");

    let number = q || (quoted ? quoted.sender : null);
    if (!number) return reply("❌ Veuillez fournir un numéro ou répondre à un message.");

    number = number.replace(/[^0-9]/g, ""); // Nettoyer le numéro

    if (sudoUsers.includes(number)) return reply("✅ Cet utilisateur est déjà sudo.");

    sudoUsers.push(number);
    saveSudoUsers();
    reply(`✅ ${number} a été ajouté comme sudo user.`);
});

// Supprimer un sudo user
cmd({
    pattern: "delsudo",
    react: "🗑️",
    desc: "Supprime un utilisateur de la liste sudo.",
    category: "admin",
    use: ".delsudo (numéro)",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply, sender, isOwner }) => {
    if (!isOwner) return reply("❌ Seul le propriétaire peut supprimer un sudo user.");

    let number = q.replace(/[^0-9]/g, ""); // Nettoyer le numéro
    if (!number) return reply("❌ Veuillez fournir un numéro.");

    if (!sudoUsers.includes(number)) return reply("❌ Cet utilisateur n'est pas sudo.");

    sudoUsers = sudoUsers.filter(user => user !== number);
    saveSudoUsers();
    reply(`✅ ${number} a été retiré de la liste des sudo users.`);
});

// Afficher la liste des sudo users
cmd({
    pattern: "getsudo",
    react: "📜",
    desc: "Affiche la liste des sudo users.",
    category: "admin",
    use: ".getsudo",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    if (sudoUsers.length === 0) return reply("🚫 Aucun sudo user enregistré.");

    let list = "🌟 *Liste des sudo users* 🌟\n\n";
    sudoUsers.forEach((user, index) => {
        list += `${index + 1}. +${user}\n`;
    });

    reply(list);
});
