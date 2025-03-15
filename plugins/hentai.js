const { cmd, commands } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
        let videoUrl = data.video?.url || data.video?.link || data.video;

        if (!videoUrl || typeof videoUrl !== 'string') {
            return reply("❌ Could not extract video URL properly.");
        }

        const caption = "🎥 Here is your random video";

        // Définition d'un chemin temporaire
        const filePath = path.join(__dirname, 'temp_video.mp4');

        // Télécharger la vidéo et l'enregistrer en local
        const writer = fs.createWriteStream(filePath);
        const videoResponse = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream',
        });

        videoResponse.data.pipe(writer);

        // Attendre la fin du téléchargement
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Envoyer la vidéo téléchargée
        await conn.sendMessage(m.chat, { video: fs.readFileSync(filePath), caption: caption, mimetype: 'video/mp4' }, { quoted: m });

        // Supprimer le fichier temporaire après l'envoi
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error(error);
        reply("⚠️ An error occurred: " + error.message);
    }
});