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
        
        const data = response.data.data;
        if (!data) return reply("❌ No data found.");
        
        if (data.type !== 'mp4') {
            return reply(`❌ Video format *${data.type}* is not supported.`);
        }
        
        const caption = `🎥 *Title:* ${data.title}\n📂 *Category:* ${data.category}\n📤 *Shares:* ${data.share_count}\n👀 *Views:* ${data.views_count}\n📽️ *Type:* ${data.type}`;
        
        await conn.sendMessage(m.chat, { video: { url: data.video }, caption: caption }, { quoted: m });
    } catch (error) {
        console.error(error);
        reply("⚠️ An error occurred: " + error.message);
    }
});