const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const sudoFile = path.join(__dirname, './sudo.json');

// Function to read the sudo users from the JSON file
function getSudoUsers() {
  try {
    if (fs.existsSync(sudoFile)) {
      return JSON.parse(fs.readFileSync(sudoFile, 'utf-8'));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error reading sudo users:", error);
    return [];
  }
}

cmd({
    pattern: "examplecmd",
    desc: "Example command for owner/sudo users.",
    category: "admin",
    filename: __filename,
}, async (conn, mek, m, { sender, isOwner, reply }) => {
    // Relire la liste des sudo users à chaque exécution
    const currentSudoUsers = getSudoUsers();
    // Vérifier si le sender est owner ou dans la liste des sudo users
    let isSudo = isOwner || currentSudoUsers.includes(sender.split('@')[0]);
    if (!isSudo) return reply("❌ Only the owner or a sudo user can use this command.");
    reply("✅ You are authorized to use this command.");
});