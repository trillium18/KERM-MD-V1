/*
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const sudoFile = path.join(__dirname, 'sudo.json');
let sudoUsers = [];

// Load sudo users from sudo.json
try {
    if (fs.existsSync(sudoFile)) {
        const data = fs.readFileSync(sudoFile, 'utf-8').trim();
        sudoUsers = data ? JSON.parse(data) : [];
        console.log("✅ Sudo users loaded:", sudoUsers);
    }
} catch (error) {
    console.error("❌ Error loading sudo.json:", error);
    sudoUsers = [];
}

// Save sudo users to sudo.json
const saveSudoUsers = () => {
    try {
        fs.writeFileSync(sudoFile, JSON.stringify(sudoUsers, null, 2), 'utf-8');
        console.log("✅ Sudo users updated.");
    } catch (error) {
        console.error("❌ Error saving sudo users:", error);
    }
};

// Add a sudo user
cmd({
    pattern: "setsudo",
    react: "🔧",
    desc: "Adds a user as a sudo admin.",
    category: "admin",
    use: ".setsudo (number or reply to a message)",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply, sender, isOwner, quoted }) => {
    if (!isOwner) return reply("❌ Only the owner can add sudo users.");

    let number = q || (quoted ? quoted.sender : null);
    if (!number) return reply("❌ Please provide a number or reply to a message.");

    number = number.replace(/[^0-9]/g, ""); // Clean the number

    if (sudoUsers.includes(number)) return reply("✅ This user is already a sudo.");

    sudoUsers.push(number);
    saveSudoUsers();
    reply(`✅ ${number} has been added as a sudo user.`);
});

// Remove a sudo user
cmd({
    pattern: "delsudo",
    react: "🗑️",
    desc: "Removes a user from the sudo list.",
    category: "admin",
    use: ".delsudo (number)",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply, sender, isOwner }) => {
    if (!isOwner) return reply("❌ Only the owner can remove sudo users.");

    let number = q ? q.replace(/[^0-9]/g, "") : "";
    if (!number) return reply("❌ Please provide a number.");

    if (!sudoUsers.includes(number)) return reply("❌ This user is not a sudo.");

    sudoUsers = sudoUsers.filter(user => user !== number);
    saveSudoUsers();
    reply(`✅ ${number} has been removed from the sudo list.`);
});

// Show the sudo users list
cmd({
    pattern: "getsudo",
    react: "📜",
    desc: "Displays the list of sudo users.",
    category: "admin",
    use: ".getsudo",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    if (sudoUsers.length === 0) return reply("🚫 No sudo users registered.");

    let list = "🌟 *Sudo Users List* 🌟\n\n";
    sudoUsers.forEach((user, index) => {
        list += `${index + 1}. +${user}\n`;
    });

    reply(list);
});
*/

const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');

const sudoFile = '../my_data/sudo.json';
let sudoUsers = [];

// Load sudo users from file if it exists
try {
    if (fs.existsSync(sudoFile)) {
        sudoUsers = JSON.parse(fs.readFileSync(sudoFile));
    }
} catch (error) {
    console.error("❌ Error loading sudo users:", error);
}

// Function to save sudo users to file
const saveSudoUsers = () => {
    fs.writeFileSync(sudoFile, JSON.stringify(sudoUsers, null, 2));
};

// Add default sudo numbers from config.js
const addDefaultSudo = () => {
    let added = false;
    config.SUDO_NUMBERS.forEach(num => {
        if (!sudoUsers.includes(num)) {
            sudoUsers.push(num);
            added = true;
        }
    });

    if (added) {
        saveSudoUsers();
        console.log("✅ Default sudo users added:", config.SUDO_NUMBERS);
    }
};

// Add default sudo users on startup
addDefaultSudo();

// Command to add a sudo user
cmd({
    pattern: "setsudo",
    react: "🔧",
    desc: "Add a user as sudo.",
    category: "admin",
    use: ".setsudo (number or reply to a message)",
    filename: __filename
}, async (conn, mek, m, { q, reply, isOwner, quoted }) => {
    if (!isOwner) return reply("❌ Only the owner can add a sudo user.");

    let number = q || (quoted ? quoted.sender : null);
    if (!number) return reply("❌ Provide a number or reply to a message.");

    number = number.replace(/[^0-9]/g, ""); // Clean the number

    if (sudoUsers.includes(number)) return reply("✅ This user is already a sudo.");

    sudoUsers.push(number);
    saveSudoUsers();
    reply(`✅ ${number} has been added as a sudo user.`);
});

// Command to remove a sudo user
cmd({
    pattern: "delsudo",
    react: "🗑️",
    desc: "Remove a user from the sudo list.",
    category: "admin",
    use: ".delsudo (number)",
    filename: __filename
}, async (conn, mek, m, { q, reply, isOwner }) => {
    if (!isOwner) return reply("❌ Only the owner can remove a sudo user.");

    let number = q.replace(/[^0-9]/g, ""); // Clean the number
    if (!number) return reply("❌ Provide a number.");

    if (!sudoUsers.includes(number)) return reply("❌ This user is not a sudo.");

    sudoUsers = sudoUsers.filter(user => user !== number);
    saveSudoUsers();
    reply(`✅ ${number} has been removed from the sudo list.`);
});

// Command to show sudo users
cmd({
    pattern: "getsudo",
    react: "📜",
    desc: "Show the list of sudo users.",
    category: "admin",
    use: ".getsudo",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    if (sudoUsers.length === 0) return reply("🚫 No sudo users registered.");

    let list = "🌟 *Sudo Users List* 🌟\n\n";
    sudoUsers.forEach((user, index) => {
        list += `🆔 ${index + 1}: ${user}\n`;
    });

    reply(list);
});