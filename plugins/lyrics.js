




const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "lyrics",
    desc: "Fetches lyrics for a song via an API.",
    category: "music",
    filename: __filename,
}, async (conn, mek, m, { reply, q }) => {
    try {
        if (!q) {
            return reply("❌ Please provide the title and artist, separated by a comma.\nExample: `.lyrics faded, Alan Walker`");
        }
        const parts = q.split(",");
        if (parts.length < 2) {
            return reply("❌ Please provide both the title and the artist, separated by a comma.");
        }
        const title = parts[0].trim();
        const artist = parts[1].trim();
        const url = `https://apis.davidcyriltech.my.id/lyrics2?t=${encodeURIComponent(title)}&a=${encodeURIComponent(artist)}`;
        const response = await axios.get(url);
        if (!response.data) return reply("❌ No response from the API.");
        const data = response.data;
        if (!data.lyrics) return reply("❌ Lyrics not found for this song.");
        const caption = `🎵 *Title:* ${data.title}\n🎤 *Artist:* ${data.artist}\n\n📝 *Lyrics:*\n${data.lyrics}`;
        reply(caption);
    } catch (error) {
        console.error(error);
        reply("❌ An error occurred: " + error.message);
    }
});