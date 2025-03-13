const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "photo",
    react: "🤖",
    alias: ["toimage", "photo"],
    desc: "Convert a sticker to an image.",
    category: "tools",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        const isQuotedSticker = m.quoted && m.quoted.type === "stickerMessage";

        if (!isQuotedSticker) {
            return reply("*📛 ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛᴏ ᴀ sᴛɪᴄᴋᴇʀ ᴛᴏ ᴄᴏɴᴠᴇʀᴛ ɪᴛ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ.*");
        }

        // Download the sticker
        const nameJpg = getRandom(".jpg");
        const stickerBuffer = await m.quoted.download();

        if (!stickerBuffer) {
            return reply("❌ Failed to download the sticker.");
        }

        // Save the file temporarily
        await require("fs").promises.writeFile(nameJpg, stickerBuffer);

        // Send the converted image
        await conn.sendMessage(m.chat, { image: { url: nameJpg }, caption: "*✅ Here is your image.*" }, { quoted: m });

        // Delete the temporary file
        require("fs").unlinkSync(nameJpg);
    } catch (error) {
        reply("❌ An error occurred while converting.");
        console.error(error);
    }
});