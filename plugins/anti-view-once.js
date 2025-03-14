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
      // Retrieve the media message (either quoted or the current one)
      const mediaMessage = quoted || message;
      if (!mediaMessage || !mediaMessage.message) {
        return reply('Please reply to a media message');
      }

      // Unwrap the message in case it's ephemeral or view-once
      let messageContent = mediaMessage.message;
      if (messageContent.ephemeralMessage) {
        messageContent = messageContent.ephemeralMessage.message;
      } else if (messageContent.viewOnceMessage) {
        messageContent = messageContent.viewOnceMessage.message;
      }

      // Extract media content (image, video, or document)
      const mediaContent =
        messageContent.imageMessage ||
        messageContent.videoMessage ||
        messageContent.documentMessage;

      if (!mediaContent || !mediaContent.mimetype) {
        return reply('Please reply to a media message');
      }

      // Download the media file
      filePath = await downloadAndSaveMediaMessage(mediaMessage, {});
      if (!filePath) return reply('Failed to download media');

      // Determine media type and get caption if available
      const isImage = mediaContent.mimetype.startsWith('image/');
      const caption = mediaContent.caption || '';

      // Resend the media with the original caption
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
      // Clean up the temporary file if it exists
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
);