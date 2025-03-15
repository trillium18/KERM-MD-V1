const { cmd } = require('../command');
const fs = require('fs');
const path = require("path");

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

cmd({
    pattern: "examplecmd",
    desc: "An example command for owner and sudo users.",
    category: "admin",
    filename: __filename,
}, async (conn, mek, m, { sender, isOwner, reply }) => {
    // Determine if the sender is owner or a sudo user.
    let isSudo = isOwner || sudoUsers.includes(sender.split('@')[0]);
    if (!isSudo) return reply("❌ Only the owner or a sudo user can use this command.");

    // Place here the code of the command
    reply("✅ You are authorized to run this command.");
});