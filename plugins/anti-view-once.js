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
const { cmd } = require('../command');

// Fonction utilitaire pour télécharger le média
async function downloadMedia(messageMedia, client) {
  if (typeof client.downloadAndSaveMediaMessage === 'function') {
    return client.downloadAndSaveMediaMessage(messageMedia);
  } else if (typeof client.downloadMediaMessage === 'function') {
    return client.downloadMediaMessage(messageMedia);
  } else {
    throw new Error("Aucune fonction de téléchargement de média n'est disponible sur le client.");
  }
}

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
      let mediaData = await downloadMedia(viewOnceContent.message.imageMessage, client);
      console.log("Image téléchargée");
      return client.sendMessage(from, {
        image: mediaData,
        caption: caption
      }, { quoted: message });
    }
    
    if (viewOnceContent.message.videoMessage) {
      let caption = viewOnceContent.message.videoMessage.caption || "🎥 Vidéo ViewOnce";
      let mediaData = await downloadMedia(viewOnceContent.message.videoMessage, client);
      console.log("Vidéo téléchargée");
      return client.sendMessage(from, {
        video: mediaData,
        caption: caption
      }, { quoted: message });
    }
    
    if (viewOnceContent.message.audioMessage) {
      let mediaData = await downloadMedia(viewOnceContent.message.audioMessage, client);
      console.log("Audio téléchargé");
      return client.sendMessage(from, {
        audio: mediaData
      }, { quoted: message });
    }
    
    return reply("⚠️ Ce type de message *ViewOnce* n'est pas supporté.");
    
  } catch (error) {
    console.error("Erreur lors de la récupération du message ViewOnce :", error);
    return reply(`❌ Une erreur est survenue lors de la récupération du message *ViewOnce* : ${error.message || error}`);
  }
});