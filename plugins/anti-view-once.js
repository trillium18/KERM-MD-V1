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
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require('path');
const mime = require('mime-types');
const { downloadAndSaveMediaMessage } = require('@whiskeysockets/baileys');
const { cmd } = require('../command');

cmd(
  {
    pattern: 'vv',
    react: '🔗',
    desc: 'Convert media to URL using catbox.moe API.',
    category: 'anime',
    use: '.maid',
    filename: __filename,
  },
  async (_bot, _message, _args, { from, quoted, reply }) => {
    try {
      // Check if a media message is quoted
      let mediaMessage = quoted ? quoted : _message;
      let quotedMessage = (mediaMessage.msg || mediaMessage).mimetype || '';

      if (quotedMessage) {
        if (mediaMessage.imageMessage) {
          let imageCaption = mediaMessage.imageMessage.caption;
          let imageUrl = await downloadAndSaveMediaMessage(mediaMessage.imageMessage);
          _bot.sendMessage(from, { image: { url: imageUrl }, caption: imageCaption });
        } else if (mediaMessage.videoMessage) {
          let videoCaption = mediaMessage.videoMessage.caption;
          let videoUrl = await downloadAndSaveMediaMessage(mediaMessage.videoMessage);
          _bot.sendMessage(from, { video: { url: videoUrl }, caption: videoCaption });
        }
      } else {
        return reply('No quoted media found to save.');
      }
    } catch (error) {
      console.error('Error processing media message:', error);
      return reply('An error occurred while processing the media message.');
    }
  }
);