const axios = require('axios');
const { cmd } = require('../command');

const QUOTE_IMG = "https://i.ibb.co/4Zq1jCNP/lordkerm.jpg"; // Image par défaut si nécessaire

cmd({
    pattern: "quote",
    desc: "Create an image quote from the provided text.",
    category: "tools",
    use: ".quote [text]",
    filename: __filename,
}, async (conn, mek, m, { reply, q, from }) => {
    if (!q) return reply("❌ Please provide a text to create a quote.");

    try {
        // Make a request to an API to generate the quote image
        const { data } = await axios.get(`https://api.quotable.io/random`);
        
        const quote = q;
        const author = data.author || "Unknown";

        let formattedInfo = `🖼️ *Quote Created*:\n\n❝ ${quote} ❞\n\n– ${author}`;
        
        await conn.sendMessage(from, {
            image: { url: QUOTE_IMG },
            caption: formattedInfo,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363321386877609@newsletter',
                    newsletterName: '𝐊𝐄𝐑𝐌 𝐃𝐈𝐀𝐑𝐘',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });
        
    } catch (error) {
        console.error("Error creating quote:", error);
        reply(`❌ An error occurred while creating the quote.`);
    }
});