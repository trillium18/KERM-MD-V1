const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson, empiretourl } = require('../lib/functions');
const ffmpeg = require('fluent-ffmpeg');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const path = require('path');
const { sms, downloadMediaMessage } = require('../lib/msg');

cmd({
    pattern: "mp3",
    alias: ["tomp3"],
    desc: "Convert video to MP3.",
    category: "converter",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Check if the message is a reply
        if (!m.quoted) return reply("❌ Reply to a video to convert it to MP3!");
        if (m.quoted.mtype !== "videoMessage") return reply("❌ Reply to a video message!");

        reply("⏳ Converting to MP3...");

        // Define file paths
        const inputFile = path.join(__dirname, `${Date.now()}.mp4`);
        const outputFile = inputFile.replace(".mp4", ".mp3");

        // Download the video
        const videoBuffer = await m.quoted.download();
        if (!videoBuffer) return reply("❌ Failed to download the video!");

        // Write the video file
        fs.writeFileSync(inputFile, videoBuffer);

        // Convert video to MP3
        exec(`ffmpeg -i "${inputFile}" -q:a 0 -map a "${outputFile}"`, async (err) => {
            if (err) {
                console.error(err);
                return reply("❌ Error converting video to MP3!");
            }

            // Send the MP3 file
            const audioBuffer = fs.readFileSync(outputFile);
            await conn.sendMessage(from, { audio: audioBuffer, mimetype: "audio/mpeg" }, { quoted: m });

            // Delete temporary files
            fs.unlinkSync(inputFile);
            fs.unlinkSync(outputFile);
        });

    } catch (e) {
        console.error(e);
        reply("❌ Error processing the request!");
    }
});

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