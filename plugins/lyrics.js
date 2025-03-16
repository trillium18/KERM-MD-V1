

const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "lyrics",
    alias: ["lyric"],
    react: "🔮",
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


const GENIUS_API_KEY = "2zpESYSuWr5fqw9zH-l4HeiIckPBR3JAaKw0tHCch7U71YTwBKLRm2UflKL7z6Pt"; // Remplace par ta clé API

cmd({
    pattern: "lyrics2",
    alias: ["lyric2"],
    react: "🔮",
    desc: "Fetches lyrics for a song via Genius API.",
    category: "music",
    filename: __filename,
}, async (conn, mek, m, { reply, q }) => {
    try {
        if (!q) {
            return reply("❌ Please provide the song title.\nExample: `.lyrics Faded`");
        }

        const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(q)}`;
        const response = await axios.get(searchUrl, {
            headers: { Authorization: `Bearer ${GENIUS_API_KEY}` }
        });

        if (!response.data.response.hits.length) {
            return reply("❌ No lyrics found for this song.");
        }

        const song = response.data.response.hits[0].result;
        const songUrl = song.url;

        reply(`🎵 *Title:* ${song.title}\n🎤 *Artist:* ${song.primary_artist.name}\n🔗 *Lyrics:* [Click here](${songUrl})`);
    } catch (error) {
        console.error(error);
        reply("❌ An error occurred: " + error.message);
    }
});
