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
const msg = require('../lib/msg');

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

    // Vérifier si c'est un message ViewOnce
    const viewOnceContent = quotedMessage.viewOnceMessageV2 || quotedMessage.viewOnceMessage;
    if (!viewOnceContent) {
      return reply("⚠️ This message is not a *ViewOnce*.");
    }

    console.log("ViewOnce content found:", viewOnceContent);

    // Détection du type de message et récupération du média
    if (viewOnceContent.message?.imageMessage) {
      let caption = viewOnceContent.message.imageMessage.caption || "📷 Image ViewOnce";
      let mediaPath = await client.downloadAndSaveMediaMessage(viewOnceContent.message.imageMessage);
      console.log("Image downloaded to:", mediaPath);

      return client.sendMessage(from, {
        image: { url: mediaPath },
        caption: caption
      }, { quoted: message });
    }

    if (viewOnceContent.message?.videoMessage) {
      let caption = viewOnceContent.message.videoMessage.caption || "🎥 Vidéo ViewOnce";
      let mediaPath = await client.downloadAndSaveMediaMessage(viewOnceContent.message.videoMessage);
      console.log("Video downloaded to:", mediaPath);

      return client.sendMessage(from, {
        video: { url: mediaPath },
        caption: caption
      }, { quoted: message });
    }

    if (viewOnceContent.message?.audioMessage) {
      let mediaPath = await client.downloadAndSaveMediaMessage(viewOnceContent.message.audioMessage);
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

Je vais te fournir un autre code, pour que tu adaptes les bases à celui 