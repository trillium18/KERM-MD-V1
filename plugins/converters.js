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
    pattern: "tomp3",
    desc: "Convert video to MP3.",
    category: "converter",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        if (!quoted) return reply("❌ Reply to a video to convert it to MP3!");
        if (quoted.type !== "videoMessage") return reply("❌ Reply to a video message!");

        reply("⏳ Converting to MP3...");
        let inputFile = `/tmp/${Date.now()}.mp4`;
        let outputFile = inputFile.replace(".mp4", ".mp3");

        fs.writeFileSync(inputFile, await downloadMediaMessage(quoted, inputFile));

        exec(`ffmpeg -i ${inputFile} -q:a 0 -map a ${outputFile}`, async (err) => {
            if (err) {
                console.error(err);
                return reply("❌ Error converting video to MP3!");
            }

            let audioBuffer = fs.readFileSync(outputFile);
            await conn.sendMessage(from, { audio: audioBuffer, mimetype: "audio/mpeg" }, { quoted: m });

            fs.unlinkSync(inputFile);
            fs.unlinkSync(outputFile);
        });

    } catch (e) {
        console.error(e);
        reply("❌ Error processing the request!");
    }
});

cmd({
    pattern: "toimage",
    desc: "Convert sticker to image.",
    category: "converter",
    filename: __filename
}, async (conn, mek, m, { quoted, reply }) => {
    try {
        if (!quoted) return reply("❌ Please reply to a sticker!");
        if (quoted.type !== 'stickerMessage') return reply("❌ Only stickers can be converted to images!");

        const buff = await quoted.getbuff;
        await conn.sendMessage(m.chat, { image: buff });

    } catch (e) {
        console.error(e);
        reply("❌ An error occurred!");
    }
});