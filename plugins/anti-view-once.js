/*
_  ______   _____ _____ _____ _   _
| |/ / ___| |_   _| ____/___ | | | |
| ' / |  _    | | |  _|| |   | |_| |
| . \ |_| |   | | | |__| |___|  _  |
|_|\_\____|   |_| |_____\____|_| |_|

ANYWAY, YOU MUST GIVE CREDIT TO MY CODE WHEN COPY IT
CONTACT ME HERE +237656520674
YT: KermHackTools
Github: Kgtech-cmr
*/

const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
  'pattern': 'vv',
  'react': '📲',
  'alias': ['retrive', 'viewonce'],
  'desc': "Fetch and resend a ViewOnce message content (image/video/voice).",
  'category': 'misc',
  'use': "<query>",
  'filename': __filename
}, async (client, message, args, { from, reply }) => {
  try {
    console.log("Received message:", message);

    // Vérifier si un message cité est présent
    const quotedMessage = message.msg?.contextInfo?.quotedMessage || message.quoted?.message;
    if (!quotedMessage) {
      return reply("⚠️ Please reply to a message *ViewOnce*.");
    }

    console.log("Quoted message found:", quotedMessage);

    // Détection du type de message
    if (quotedMessage.imageMessage) {
      let caption = quotedMessage.imageMessage.caption || "📷 Image ViewOnce";
      let mediaPath = await client.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
      console.log("Image downloaded to:", mediaPath);

      return client.sendMessage(from, {
        image: { url: mediaPath },
        caption: caption
      }, { quoted: message });
    }

    if (quotedMessage.videoMessage) {
      let caption = quotedMessage.videoMessage.caption || "🎥 Video ViewOnce";
      let mediaPath = await client.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
      console.log("Video downloaded to:", mediaPath);

      return client.sendMessage(from, {
        video: { url: mediaPath },
        caption: caption
      }, { quoted: message });
    }

    if (quotedMessage.audioMessage) {
      let mediaPath = await client.downloadAndSaveMediaMessage(quotedMessage.audioMessage);
      console.log("Audio downloaded to:", mediaPath);

      return client.sendMessage(from, {
        audio: { url: mediaPath }
      }, { quoted: message });
    }

    return reply("⚠️ This type of message *ViewOnce* is not supported.");

  } catch (error) {
    console.error("Error fetching ViewOnce message:", error);
    reply("❌ An error occurred while retrieving the message *ViewOnce*.");
  }
});