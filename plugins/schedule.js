const fs = require("fs");
const path = require("path");

const scheduleFile = path.join(__dirname, "../my_data/scheduled_messages.json");
if (!fs.existsSync(scheduleFile)) fs.writeFileSync(scheduleFile, JSON.stringify([]));

function loadScheduledMessages() {
    return JSON.parse(fs.readFileSync(scheduleFile));
}

function saveScheduledMessages(data) {
    fs.writeFileSync(scheduleFile, JSON.stringify(data, null, 2));
}

// Schedule a message
cmd({
    pattern: "schedule",
    desc: "Schedule a message at a specific time.",
    category: "owner",
    react: "⏳",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, isOwner, q }) => {
    if (!isOwner) return reply("❌ Only the bot owner can use this command!");
    if (args.length < 2) return reply("⚠️ Usage: `.schedule HH:MM [daily] Your message`");

    const time = args[0];
    const isDaily = args[1].toLowerCase() === "daily";
    const message = isDaily ? args.slice(2).join(" ") : args.slice(1).join(" ");

    if (!/^\d{2}:\d{2}$/.test(time)) return reply("⚠️ Invalid time format! Use HH:MM (24-hour format).");

    const [hours, minutes] = time.split(":").map(Number);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return reply("⚠️ Invalid time! Hours: 00-23, Minutes: 00-59.");

    let schedules = loadScheduledMessages();
    schedules.push({ chatId: from, time, message, daily: isDaily });
    saveScheduledMessages(schedules);

    reply(`✅ Message scheduled for *${time}*${isDaily ? " (Daily)" : ""}:\n"${message}"`);
});

// List scheduled messages
cmd({
    pattern: "listschedule",
    desc: "List all scheduled messages.",
    category: "owner",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { reply, isOwner }) => {
    if (!isOwner) return reply("❌ Only the bot owner can use this command!");

    const schedules = loadScheduledMessages();
    if (schedules.length === 0) return reply("📭 No scheduled messages.");

    let messageList = "📅 *Scheduled Messages:*\n\n";
    schedules.forEach((msg, index) => {
        messageList += `📌 *${index + 1}.* Time: *${msg.time}*\n💬 Message: ${msg.message}\n📍 Chat ID: ${msg.chatId}\n🔄 ${msg.daily ? "Daily" : "One-time"}\n\n`;
    });

    reply(messageList);
});

// Delete a scheduled message (with confirmation)
let pendingDelete = {};

cmd({
    pattern: "delschedule",
    desc: "Delete a scheduled message by time.",
    category: "owner",
    react: "🗑️",
    filename: __filename
}, async (conn, mek, m, { reply, args, isOwner }) => {
    if (!isOwner) return reply("❌ Only the bot owner can use this command!");
    if (args.length !== 1) return reply("⚠️ Usage: `.delschedule HH:MM`");

    const time = args[0];
    if (!/^\d{2}:\d{2}$/.test(time)) return reply("⚠️ Invalid time format! Use HH:MM (24-hour format).");

    let schedules = loadScheduledMessages();
    if (!schedules.some(msg => msg.time === time)) return reply("⚠️ No scheduled message found at this time!");

    pendingDelete[from] = time;
    reply(`⚠️ Are you sure you want to delete the scheduled message at *${time}*? (Yes/No)`);
});

// Confirmation for deletion
cmd({
    pattern: "yes",
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {
    if (!pendingDelete[from]) return;

    let time = pendingDelete[from];
    let schedules = loadScheduledMessages();
    let newSchedules = schedules.filter(msg => msg.time !== time);

    saveScheduledMessages(newSchedules);
    delete pendingDelete[from];

    reply(`✅ Deleted scheduled message at *${time}*.`);
});

cmd({
    pattern: "no",
    filename: __filename
}, async (conn, mek, m, { reply, from }) => {
    if (pendingDelete[from]) {
        delete pendingDelete[from];
        reply("❌ Deletion canceled.");
    }
});

// Background task for sending scheduled messages
setInterval(async () => {
    try {
        const schedules = loadScheduledMessages();
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

        const toSend = schedules.filter(msg => msg.time === currentTime);
        if (toSend.length > 0) {
            for (const msg of toSend) {
                await conn.sendMessage(msg.chatId, { text: msg.message });
            }

            let remaining = schedules.filter(msg => msg.daily || msg.time !== currentTime);
            saveScheduledMessages(remaining);
        }
    } catch (e) {
        console.error("Error in scheduled message check:", e);
    }
}, 60000); // Check every minute