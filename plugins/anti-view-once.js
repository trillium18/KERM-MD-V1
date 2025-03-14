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
    try {
      // Check for quoted message
      const mediaMessage = quoted || message;
      if (!mediaMessage || !mediaMessage.mimetype) {
        return reply('Please reply to a media message');
      }

      // Download the media file
      const filePath = await downloadAndSaveMediaMessage(mediaMessage, {});
      if (!filePath) return reply('Failed to download media');

      // Get media type and caption
      const isImage = mediaMessage.mimetype.startsWith('image/');
      const caption = mediaMessage.caption || '';

      // Resend the media with original caption
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
      // Clean up temporary file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
);