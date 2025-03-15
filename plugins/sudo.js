const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');

// Load sudo users list from a JSON file
const sudoFile = './sudo.json';
let sudoUsers = [];

try {
    if (fs.existsSync(sudoFile)) {
        sudoUsers = JSON.parse(fs.readFileSync(sudoFile));
    }
} catch (error) {
    console.error("Error loading sudo users:", error);
}

// Save sudo users list
const saveSudoUsers = () => {
    fs.writeFileSync(sudoFile, JSON.stringify(sudoUsers, null, 2));
};

// Add a sudo user
cmd({
    pattern: "setsudo",
    react: "🔧",
    desc: "Add a user as sudo.",
    category: "admin",
    use: ".setsudo (number or reply to a message)",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply, sender, isOwner, quoted }) => {
    if (!isOwner) return reply("❌ Only the owner can add a sudo user.");

    let number = q || (quoted ? quoted.sender : null);
    if (!number) return reply("❌ Please provide a number or reply to a message.");

    number = number.replace(/[^0-9]/g, ""); // Clean the number

    if (sudoUsers.includes(number)) return reply("✅ This user is already sudo.");

    sudoUsers.push(number);
    saveSudoUsers();
    reply(`✅ *${number}* has been added as a sudo user.`);
});

// Remove a sudo user
cmd({
    pattern: "delsudo",
    react: "🗑️",
    desc: "Remove a user from the sudo list.",
    category: "admin",
    use: ".delsudo (number)",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply, sender, isOwner }) => {
    if (!isOwner) return reply("❌ Only the owner can remove a sudo user.");

    let number = q.replace(/[^0-9]/g, ""); // Clean the number
    if (!number) return reply("❌ Please provide a number.");

    if (!sudoUsers.includes(number)) return reply("❌ This user is not a sudo.");

    sudoUsers = sudoUsers.filter(user => user !== number);
    saveSudoUsers();
    reply(`✅ *${number}* has been removed from the sudo list.`);
});

// Display the sudo users list
cmd({
    pattern: "getsudo",
    react: "📜",
    desc: "Show the list of sudo users.",
    category: "admin",
    use: ".getsudo",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    if (sudoUsers.length === 0) return reply("🚫 No sudo users registered.");

    let list = "╭─❏ *🌟 Sudo Users List 🌟* ❏\n";
    sudoUsers.forEach((user, index) => {
        list += `│ ${index + 1}. ${user}\n`;
    });
    list += "╰───────────⟢";

    reply(list);
});
