/*
const { cmd } = require("../command");
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

*/

const moment = require('moment-timezone');
const fs = require('fs');
const { cmd } = require('../command');
const config = require('../config');

// Liste des fuseaux horaires pour certains pays d'Afrique et d'Europe
const countryToTimezone = {
    // Afrique
    "Cameroun": "Africa/Douala",
    "Cameroon": "Africa/Douala",
    "Nigeria": "Africa/Lagos",
    "South Africa": "Africa/Johannesburg",
    "Kenya": "Africa/Nairobi",
    "Egypt": "Africa/Cairo",
    "Morocco": "Africa/Casablanca",
    "Ghana": "Africa/Accra",
    "Uganda": "Africa/Kampala",
    "Algeria": "Africa/Algiers",
    "Senegal": "Africa/Dakar",
    "Tanzania": "Africa/Dar_es_Salaam",
    "Zambia": "Africa/Lusaka",
    "Liberia": "Africa/Monrovia",
    "Namibia": "Africa/Windhoek",
    "Mozambique": "Africa/Maputo",
    "Mali": "Africa/Bamako",
    "Zimbabwe": "Africa/Harare",
    "Sudan": "Africa/Khartoum",
    "Ivory Coast": "Africa/Abidjan",
    "Togo": "Africa/Lomé",
    "Sierra Leone": "Africa/Freetown",
    "Tunisia": "Africa/Tunis",
    "Ethiopia": "Africa/Addis_Ababa",
    "Angola": "Africa/Luanda",
    "Botswana": "Africa/Gaborone",
    "Rwanda": "Africa/Kigali",
    "Burkina Faso": "Africa/Ouagadougou",
    "Gabon": "Africa/Libreville",
    "Mauritius": "Indian/Mauritius",
    "Seychelles": "Indian/Mahe",
    "Madagascar": "Indian/Antananarivo",

    // Europe
    "France": "Europe/Paris",
    "Germany": "Europe/Berlin",
    "Italy": "Europe/Rome",
    "Spain": "Europe/Madrid",
    "Portugal": "Europe/Lisbon",
    "Belgium": "Europe/Brussels",
    "Netherlands": "Europe/Amsterdam",
    "United Kingdom": "Europe/London",
    "Switzerland": "Europe/Zurich",
    "Poland": "Europe/Warsaw",
    "Russia": "Europe/Moscow",
    "Sweden": "Europe/Stockholm",
    "Norway": "Europe/Oslo",
    "Denmark": "Europe/Copenhagen",
    "Finland": "Europe/Helsinki",
    "Ireland": "Europe/Dublin",
    "Austria": "Europe/Vienna",
    "Czech Republic": "Europe/Prague",
    "Greece": "Europe/Athens",
    "Romania": "Europe/Bucharest",
    "Hungary": "Europe/Budapest",
    "Bulgaria": "Europe/Sofia",
    "Ukraine": "Europe/Kiev",
    "Slovakia": "Europe/Bratislava",
    "Croatia": "Europe/Zagreb",
    "Serbia": "Europe/Belgrade",
    "Bosnia and Herzegovina": "Europe/Sarajevo",
    "Slovenia": "Europe/Ljubljana",
    "Moldova": "Europe/Chisinau",
    "Montenegro": "Europe/Podgorica",
    "Albania": "Europe/Tirana",
    "North Macedonia": "Europe/Skopje",
    "Kosovo": "Europe/Pristina",
    "Liechtenstein": "Europe/Vaduz",
    "Luxembourg": "Europe/Luxembourg",
    "Monaco": "Europe/Monaco",
    "Andorra": "Europe/Andorra",
    "San Marino": "Europe/San_Marino",
    "Vatican": "Europe/Vatican",
    "Malta": "Europe/Malta",
    "Armenia": "Asia/Yerevan",
    "Georgia": "Asia/Tbilisi",
    "Turkey": "Europe/Istanbul",
    "Cyprus": "Asia/Nicosia",
};

// Fonction pour récupérer le fuseau horaire basé sur le pays
const getTimezoneByCountry = (country) => {
    return countryToTimezone[country] || 'UTC'; // Si le pays n'est pas trouvé, utiliser UTC
};

// Commande .schedule
cmd({
    pattern: "schedule",
    desc: "Program a message to be sent at a specific time.",
    category: "tools",
    react: "⏰",
    filename: __filename,
}, async (conn, mek, m, { reply, args, isOwner }) => {
    if (!isOwner) return reply("❌ Only the owner can use this command.");
    
    try {
        // Vérifier que l'heure, le pays et le message sont fournis
        if (args.length < 3) return reply("❌ Please provide the country, time (HH:MM), and the message to schedule.");
        
        const country = args[0]; // Le pays spécifié
        const timeString = args[1]; // L'heure
        const message = args.slice(2).join(" "); // Le message

        // Récupérer le fuseau horaire basé sur le pays
        const timezone = getTimezoneByCountry(country);
        
        // Vérifier si l'heure est valide
        const time = moment.tz(timeString, 'HH:mm', timezone);
        if (!time.isValid()) {
            return reply("❌ The time format is invalid. Please use HH:MM.");
        }
        
        // Créer un objet avec l'heure et le message
        const scheduledMessage = {
            time: time.format('YYYY-MM-DD HH:mm'),
            message: message,
            timezone: timezone,
            country: country,
            chat: m.chat // Ajouter l'ID du chat pour envoyer le message
        };

        // Sauvegarder l'horaire et le message dans un fichier JSON
        let scheduledMessages = JSON.parse(fs.readFileSync('../my_data/scheduled_messages.json', 'utf8') || '[]');
        scheduledMessages.push(scheduledMessage);
        fs.writeFileSync('../my_data/scheduled_messages.json', JSON.stringify(scheduledMessages, null, 2));

        // Répondre pour confirmer que le message a été programmé
        return reply(`✅ Your message has been scheduled for ${time.format('HH:mm')} (${timezone}, ${country})`);

    } catch (error) {
        console.error(error);
        return reply("❌ An error occurred while scheduling the message.");
    }
});

// Fonction pour vérifier et envoyer les messages programmés
const checkScheduledMessages = async () => {
    try {
        const currentTime = moment().format('YYYY-MM-DD HH:mm');
        const scheduledMessages = JSON.parse(fs.readFileSync('../my_data/scheduled_messages.json', 'utf8') || '[]');

        for (let i = 0; i < scheduledMessages.length; i++) {
            const scheduledMessage = scheduledMessages[i];
            
            if (scheduledMessage.time === currentTime) {
                await conn.sendMessage(scheduledMessage.chat, { text: scheduledMessage.message });
                scheduledMessages.splice(i, 1); // Supprimer le message envoyé
                fs.writeFileSync('../my_data/scheduled_messages.json', JSON.stringify(scheduledMessages, null, 2));
            }
        }
    } catch (error) {
        console.error("Error checking scheduled messages:", error);
    }
};

// Lancer la vérification des messages programmés toutes les minutes
setInterval(checkScheduledMessages, 60000);