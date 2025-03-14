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

const { downloadAndSaveMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { cmd } = require('../command');

cmd(
  {
    pattern: 'vv',
    react: '💾',
    desc: 'Save quoted media message',
    category: 'utility',
    use: '.vv (reply to media)',
    filename: __filename,
  },
  async (bot, message, args, { from, quoted, reply }) => {
    let filePath;
    try {
      // Récupère le message contenant le média (soit cité, soit le message lui-même)
      const mediaMessage = quoted || message;
      if (!mediaMessage || !mediaMessage.message) {
        return reply('Please reply to a media message');
      }

      // Déplier le message s'il est encapsulé dans un message éphémère
      let messageContent = mediaMessage.message;
      if (messageContent.ephemeralMessage) {
        messageContent = messageContent.ephemeralMessage.message;
      }

      // Extraire le contenu média (image, vidéo ou document)
      const mediaContent =
        messageContent.imageMessage ||
        messageContent.videoMessage ||
        messageContent.documentMessage;

      if (!mediaContent || !mediaContent.mimetype) {
        return reply('Please reply to a media message');
      }

      // Télécharger le fichier média
      filePath = await downloadAndSaveMediaMessage(mediaMessage, {});
      if (!filePath) {
        return reply('Failed to download media');
      }

      // Déterminer le type de média et récupérer la légende
      const isImage = mediaContent.mimetype.startsWith('image/');
      const caption = mediaContent.caption || '';

      // Envoyer le média avec la légende d'origine
      await bot.sendMessage(
        from,
        {
          [isImage ? 'image' : 'video']: { url: filePath },
          caption: caption,
        },
        { quoted: message }
      );

      reply('Media saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      reply('Failed to save media. Please try again.');
    } finally {
      // Nettoyer le fichier temporaire si il existe
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
);