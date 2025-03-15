const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "hentai",
    desc: "Sends a random hentai video.",
    category: "anime",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        const response = await axios.get("https://apis.davidcyriltech.my.id/hentai");
        if (!response.data) return reply("❌ No response from API.");
        
        const data = response.data;
        const caption = "🎥 Here is your random hentai video";
        await conn.sendMessage(m.chat, { video: { url: data.video }, caption: caption }, { quoted: m });
    } catch (error) {
        console.error(error);
        reply("⚠️ An error occurred: " + error.message);
    }
});