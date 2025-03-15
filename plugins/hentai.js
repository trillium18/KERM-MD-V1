const { cmd, commands } = require('../command');
const axios = require('axios');


cmd({
    pattern: "hentai",
    react: "🫦",
    desc: "Sends a random hentai video.",
    category: "anime",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        const response = await axios.get("https://apis.davidcyriltech.my.id/hentai");
        if (!response.data) return reply("❌ No response from API.");

        const data = response.data;
        let videoUrl;
        if (typeof data.video === 'object') {
            videoUrl = data.video.url || data.video.link;
        } else {
            videoUrl = data.video;
        }
        if (!videoUrl || typeof videoUrl !== 'string') {
            return reply("❌ Could not extract video URL properly.");
        }

        const caption = "🎥 Here is your random video";
        // Télécharger la vidéo en tant que Buffer
        const videoRes = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        const videoBuffer = Buffer.from(videoRes.data, 'binary');

        // Envoyer la vidéo en précisant le mimetype pour que WhatsApp la reconnaisse correctement
        await conn.sendMessage(m.chat, { video: videoBuffer, caption: caption, mimetype: 'video/mp4' }, { quoted: m });
    } catch (error) {
        console.error(error);
        reply("⚠️ An error occurred: " + error.message);
    }
});