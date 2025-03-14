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
  'desc': "Récupère et renvoie le contenu d'un message ViewOnce (image/vidéo/audio).",
  'category': 'misc',
  'use': "<query>",
  'filename': __filename
}, async (client, message, args, { from, reply }) => {
  try {
    console.log("Message reçu :", message);

    // Vérifier si un message cité est présent
    const quotedMessage = message.msg?.contextInfo?.quotedMessage || message.quoted?.message;
    if (!quotedMessage) {
      return reply("⚠️ Veuillez répondre à un message *ViewOnce*.");
    }

    console.log("Message cité trouvé :", quotedMessage);

    // Vérifier que le message cité est bien un message ViewOnce
    const viewOnceContent = quotedMessage.viewOnceMessageV2 || quotedMessage.viewOnceMessage;
    if (!viewOnceContent || !viewOnceContent.message) {
      return reply("⚠️ Ce message n'est pas un message *ViewOnce*.");
    }

    console.log("Contenu ViewOnce trouvé :", viewOnceContent);

    // Traitement selon le type de média
    if (viewOnceContent.message.imageMessage) {
      let caption = viewOnceContent.message.imageMessage.caption || "📷 Image ViewOnce";
      // Téléchargement du média via downloadMediaMessage qui renvoie un buffer
      let mediaBuffer = await client.downloadMediaMessage(viewOnceContent.message.imageMessage);
      console.log("Image téléchargée");
      return client.sendMessage(from, {
        image: mediaBuffer,
        caption: caption
      }, { quoted: message });
    }
    
    if (viewOnceContent.message.videoMessage) {
      let caption = viewOnceContent.message.videoMessage.caption || "🎥 Vidéo ViewOnce";
      let mediaBuffer = await client.downloadMediaMessage(viewOnceContent.message.videoMessage);
      console.log("Vidéo téléchargée");
      return client.sendMessage(from, {
        video: mediaBuffer,
        caption: caption
      }, { quoted: message });
    }
    
    if (viewOnceContent.message.audioMessage) {
      let mediaBuffer = await client.downloadMediaMessage(viewOnceContent.message.audioMessage);
      console.log("Audio téléchargé");
      return client.sendMessage(from, {
        audio: mediaBuffer
      }, { quoted: message });
    }
    
    // Si le type de message ViewOnce n'est pas supporté
    return reply("⚠️ Ce type de message *ViewOnce* n'est pas supporté.");
    
  } catch (error) {
    console.error("Erreur lors de la récupération du message ViewOnce :", error);
    return reply(`❌ Une erreur est survenue lors de la récupération du message *ViewOnce* : ${error.message || error}`);
  }
});