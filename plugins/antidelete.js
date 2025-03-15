const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

const antiDeleteFile = path.join(__dirname, 'antidelete.json');
let antiDeleteList = {};

// Load anti-delete settings
try {
    if (fs.existsSync(antiDeleteFile)) {
        const data = fs.readFileSync(antiDeleteFile, 'utf-8').trim();
        antiDeleteList = data ? JSON.parse(data) : {};
        console.log("✅ Anti-delete settings loaded.");
    }
} catch (error) {
    console.error("❌ Error loading antidelete.json:", error);
    antiDeleteList = {};
}

// Save anti-delete settings
const saveAntiDelete = () => {
    try {
        fs.writeFileSync(antiDeleteFile, JSON.stringify(antiDeleteList, null, 2), 'utf-8');
        console.log("✅ Anti-delete settings updated.");
    } catch (error) {
        console.error("❌ Error saving antidelete settings:", error);
    }
};

// Activate/Deactivate anti-delete
cmd({
    pattern: "antidelete",
    react: "🔄",
    desc: "Activate or deactivate anti-delete mode.",
    category: "admin",
    use: ".antidelete [on/off]",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, args }) => {
    if (args.length === 0) {
        return reply("❌ Please specify 'on' to activate or 'off' to deactivate the anti-delete mode.\nExample: .antidelete on or .antidelete off");
    }

    const action = args[0].toLowerCase();

    if (action === "on") {
        if (!antiDeleteList[sender]) {
            antiDeleteList[sender] = true;
            reply("✅ Anti-delete mode activated. Deleted messages will be sent to your private chat.");
            saveAntiDelete();
        } else {
            reply("❌ Anti-delete mode is already activated.");
        }
    } else if (action === "off") {
        if (antiDeleteList[sender]) {
            delete antiDeleteList[sender];
            reply("❌ Anti-delete mode deactivated.");
            saveAntiDelete();
        } else {
            reply("❌ Anti-delete mode is not activated.");
        }
    } else {
        reply("❌ Invalid argument. Please specify 'on' or 'off'. Example: .antidelete on or .antidelete off");
    }
});

// Detect and recover deleted messages
conn.ev.on("messages.upsert", async (chatUpdate) => {
    try {
        if (!chatUpdate.messages) return;
        const m = chatUpdate.messages[0];

        if (!m.message || !m.key || !m.key.remoteJid) return;

        const isDeleted = m.message.protocolMessage && m.message.protocolMessage.type === 0;
        if (!isDeleted) return;

        const messageID = m.message.protocolMessage.key.id;
        const messageFrom = m.message.protocolMessage.key.remoteJid;
        const senderJid = m.message.protocolMessage.key.participant || messageFrom; // User who deleted the message

        // Get user name or phone number
        let senderName = senderJid.split("@")[0];

        // If in a group, try to get name from metadata
        if (messageFrom.includes("@g.us")) {
            let groupMetadata = await conn.groupMetadata(messageFrom).catch(() => null);
            let participant = groupMetadata?.participants.find(p => p.id === senderJid);
            senderName = participant?.name || participant?.notify || senderName;
        }

        // Get the original message
        let chat = await conn.loadMessage(messageFrom, messageID);
        if (!chat) return;

        let originalMessage = chat.message.conversation || chat.message.extendedTextMessage?.text;
        if (!originalMessage) return;

        // Format date and time
        let timestamp = moment().tz("Africa/Abidjan").format("DD/MM/YYYY HH:mm:ss");

        // Define who will receive the notification
        let userJid = messageFrom.includes("@g.us") ? senderJid : messageFrom;

        // Message to send
        let messageText = `🚨 *Deleted Message Recovered* 🚨\n\n📆 *Date:* ${timestamp}\n👤 *Sender:* ${senderName}\n💬 *Message:* ${originalMessage}`;

        if (messageFrom.includes("@g.us")) {
            let groupMetadata = await conn.groupMetadata(messageFrom).catch(() => null);
            let groupName = groupMetadata?.subject || "Unknown Group";
            messageText += `\n🏷️ *Group:* ${groupName}`;
        }

        // Send recovered message to the user
        await conn.sendMessage(userJid, { text: messageText }, { quoted: chat });

        console.log(`🔄 Recovered deleted message from ${senderName} at ${timestamp}`);
    } catch (error) {
        console.error("❌ Error recovering deleted message:", error);
    }
});
                
