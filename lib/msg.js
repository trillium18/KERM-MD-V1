/*created by Kgtech 🕵
contact dev1 237656520674 ♻️
contact dev2 237650564445 ♻️
© Copy coder alert ⚠
*/

const {
  default: keithConnect,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  downloadContentFromMessage,
  jidDecode,
  proto,
  getContentType
} = require("@whiskeysockets/baileys");

function smsg(keithInstance, message, store) {
  if (!message) {
    return message;
  }

  let messageInfo = proto.WebMessageInfo;

  // Initialize message properties
  if (message.key) {
    message.id = message.key.id;
    message.isBaileys = message.id.startsWith("BAE5") && message.id.length === 16;
    message.chat = message.key.remoteJid;
    message.fromMe = message.key.fromMe;
    message.isGroup = message.chat.endsWith("@g.us");
    message.sender = keithInstance.decodeJid(
      message.fromMe && keithInstance.user.id || message.participant || message.key.participant || message.chat || ''
    );
    
    if (message.isGroup) {
      message.participant = keithInstance.decodeJid(message.key.participant) || '';
    }
  }

  // Process the message content
  if (message.message) {
    message.mtype = getContentType(message.message);

    // Handle specific types of messages (e.g., viewOnce)
    message.msg = message.mtype === "viewOnceMessage" 
      ? message.message[message.mtype] ? message.message[message.mtype].message[getContentType(message.message[message.mtype].message)] : undefined
      : message.message[message.mtype];
    
    // Extract body from different message types
    message.body = message.message.conversation ||
                   (message.msg && message.msg.caption) ||
                   (message.msg && message.msg.text) ||
                   (message.mtype === "listResponseMessage" && message.msg && message.msg.singleSelectReply && message.msg.singleSelectReply.selectedRowId) ||
                   (message.mtype === "buttonsResponseMessage" && message.msg && message.msg.selectedButtonId) ||
                   (message.mtype === "viewOnceMessage" && message.msg && message.msg.caption) ||
                   message.text;

    let quotedMessage = message.quoted = message.msg.contextInfo ? message.msg.contextInfo.quotedMessage : null;
    message.mentionedJid = message.msg.contextInfo ? message.msg.contextInfo.mentionedJid : [];

    // Handle quoted messages
    if (quotedMessage) {
      let contentType = getContentType(quotedMessage);
      message.quoted = quotedMessage[contentType];

      if (["productMessage"].includes(contentType)) {
        contentType = getContentType(message.quoted);
        message.quoted = message.quoted[contentType];
      }

      if (typeof message.quoted === "string") {
        message.quoted = { 'text': message.quoted };
      }

      message.quoted.mtype = contentType;
      message.quoted.id = message.msg.contextInfo.stanzaId;
      message.quoted.chat = message.msg.contextInfo.remoteJid || message.chat;
      message.quoted.isBaileys = message.quoted.id ? message.quoted.id.startsWith("BAE5") && message.quoted.id.length === 16 : false;
      message.quoted.sender = keithInstance.decodeJid(message.msg.contextInfo.participant);
      message.quoted.fromMe = message.quoted.sender === keithInstance.decodeJid(keithInstance.user.id);
      message.quoted.text = message.quoted.text || message.quoted.caption || message.quoted.conversation || message.quoted.contentText || message.quoted.selectedDisplayText || message.quoted.title || '';
      message.quoted.mentionedJid = message.msg.contextInfo ? message.msg.contextInfo.mentionedJid : [];

      // Helper function to fetch quoted message
      message.quoted.getQuotedObj = message.quoted.getQuotedMessage = async () => {
        if (!message.quoted.id) {
          return false;
        }
        let quotedMsg = await store.loadMessage(message.chat, message.quoted.id, keithInstance);
        return exports.smsg(keithInstance, quotedMsg, store);
      };

      let quotedMessageFakeObj = message.quoted.fakeObj = messageInfo.fromObject({
        'key': {
          'remoteJid': message.quoted.chat,
          'fromMe': message.quoted.fromMe,
          'id': message.quoted.id
        },
        'message': quotedMessage,
        ...message.isGroup ? { 'participant': message.quoted.sender } : {}
      });

      // Helper functions for deleting and forwarding quoted messages
      message.quoted["delete"] = () => keithInstance.sendMessage(message.quoted.chat, { 'delete': quotedMessageFakeObj.key });
      message.quoted.copyNForward = (toChat, forceForward = false, options = {}) => keithInstance.copyNForward(toChat, quotedMessageFakeObj, forceForward, options);
      message.quoted.download = () => keithInstance.downloadMediaMessage(message.quoted);
    }
  }

  // Handle URL in the message
  if (message.msg.url) {
    message.download = () => keithInstance.downloadMediaMessage(message.msg);
  }

  // Extract main text content from the message
  message.text = message.msg.text || message.msg.caption || message.message.conversation || message.msg.contentText || message.msg.selectedDisplayText || message.msg.title || '';

  // Reply function
  message.reply = (replyText, replyTo = message.chat, options = {}) => {
    if (Buffer.isBuffer(replyText)) {
      return keithInstance.sendMedia(replyTo, replyText, "file", '', message, { ...options });
    }
    return keithInstance.sendText(replyTo, replyText, message, { ...options });
  };

  // Function to copy the message
  message.copy = () => exports.smsg(keithInstance, messageInfo.fromObject(messageInfo.toObject(message)));

  // Function to forward the message
  message.copyNForward = (toChat = message.chat, forceForward = false, options = {}) => keithInstance.copyNForward(toChat, message, forceForward, options);

  return message;
}

module.exports = {
  smsg
};


/*
const { proto, downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys')
const fs = require('fs')

const downloadMediaMessage = async(m, filename) => {
	if (m.type === 'viewOnceMessage') {
		m.type = m.msg.type
	}
	if (m.type === 'imageMessage') {
		var nameJpg = filename ? filename + '.jpg' : 'undefined.jpg'
		const stream = await downloadContentFromMessage(m.msg, 'image')
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(nameJpg, buffer)
		return fs.readFileSync(nameJpg)
	} else if (m.type === 'videoMessage') {
		var nameMp4 = filename ? filename + '.mp4' : 'undefined.mp4'
		const stream = await downloadContentFromMessage(m.msg, 'video')
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(nameMp4, buffer)
		return fs.readFileSync(nameMp4)
	} else if (m.type === 'audioMessage') {
		var nameMp3 = filename ? filename + '.mp3' : 'undefined.mp3'
		const stream = await downloadContentFromMessage(m.msg, 'audio')
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(nameMp3, buffer)
		return fs.readFileSync(nameMp3)
	} else if (m.type === 'stickerMessage') {
		var nameWebp = filename ? filename + '.webp' : 'undefined.webp'
		const stream = await downloadContentFromMessage(m.msg, 'sticker')
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(nameWebp, buffer)
		return fs.readFileSync(nameWebp)
	} else if (m.type === 'documentMessage') {
		var ext = m.msg.fileName.split('.')[1].toLowerCase().replace('jpeg', 'jpg').replace('png', 'jpg').replace('m4a', 'mp3')
		var nameDoc = filename ? filename + '.' + ext : 'undefined.' + ext
		const stream = await downloadContentFromMessage(m.msg, 'document')
		let buffer = Buffer.from([])
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		fs.writeFileSync(nameDoc, buffer)
		return fs.readFileSync(nameDoc)
	}
}

const sms = (conn, m) => {
	if (m.key) {
		m.id = m.key.id
		m.chat = m.key.remoteJid
		m.fromMe = m.key.fromMe
		m.isGroup = m.chat.endsWith('@g.us')
		m.sender = m.fromMe ? conn.user.id.split(':')[0]+'@s.whatsapp.net' : m.isGroup ? m.key.participant : m.key.remoteJid
	}
	if (m.message) {
		m.type = getContentType(m.message)
		m.msg = (m.type === 'viewOnceMessage') ? m.message[m.type].message[getContentType(m.message[m.type].message)] : m.message[m.type]
		if (m.msg) {
			if (m.type === 'viewOnceMessage') {
				m.msg.type = getContentType(m.message[m.type].message)
			}
			var quotedMention = m.msg.contextInfo != null ? m.msg.contextInfo.participant : ''
			var tagMention = m.msg.contextInfo != null ? m.msg.contextInfo.mentionedJid : []
			var mention = typeof(tagMention) == 'string' ? [tagMention] : tagMention
			mention != undefined ? mention.push(quotedMention) : []
			m.mentionUser = mention != undefined ? mention.filter(x => x) : []
			m.body = (m.type === 'conversation') ? m.msg : (m.type === 'extendedTextMessage') ? m.msg.text : (m.type == 'imageMessage') && m.msg.caption ? m.msg.caption : (m.type == 'videoMessage') && m.msg.caption ? m.msg.caption : (m.type == 'templateButtonReplyMessage') && m.msg.selectedId ? m.msg.selectedId : (m.type == 'buttonsResponseMessage') && m.msg.selectedButtonId ? m.msg.selectedButtonId : ''
			m.quoted = m.msg.contextInfo != undefined ? m.msg.contextInfo.quotedMessage : null
			if (m.quoted) {
				m.quoted.type = getContentType(m.quoted)
				m.quoted.id = m.msg.contextInfo.stanzaId
				m.quoted.sender = m.msg.contextInfo.participant
				m.quoted.fromMe = m.quoted.sender.split('@')[0].includes(conn.user.id.split(':')[0])
				m.quoted.msg = (m.quoted.type === 'viewOnceMessage') ? m.quoted[m.quoted.type].message[getContentType(m.quoted[m.quoted.type].message)] : m.quoted[m.quoted.type]
				if (m.quoted.type === 'viewOnceMessage') {
					m.quoted.msg.type = getContentType(m.quoted[m.quoted.type].message)
				}
				var quoted_quotedMention = m.quoted.msg.contextInfo != null ? m.quoted.msg.contextInfo.participant : ''
				var quoted_tagMention = m.quoted.msg.contextInfo != null ? m.quoted.msg.contextInfo.mentionedJid : []
				var quoted_mention = typeof(quoted_tagMention) == 'string' ? [quoted_tagMention] : quoted_tagMention
				quoted_mention != undefined ? quoted_mention.push(quoted_quotedMention) : []
				m.quoted.mentionUser = quoted_mention != undefined ? quoted_mention.filter(x => x) : []
				m.quoted.fakeObj = proto.WebMessageInfo.fromObject({
					key: {
						remoteJid: m.chat,
						fromMe: m.quoted.fromMe,
						id: m.quoted.id,
						participant: m.quoted.sender
					},
					message: m.quoted
				})
				m.quoted.download = (filename) => downloadMediaMessage(m.quoted, filename)
				m.quoted.delete = () => conn.sendMessage(m.chat, { delete: m.quoted.fakeObj.key })
				m.quoted.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.quoted.fakeObj.key } })
			}
		}
		m.download = (filename) => downloadMediaMessage(m, filename)
	}
	
	m.reply = (teks, id = m.chat, option = { mentions: [m.sender] }) => conn.sendMessage(id, { text: teks, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyS = (stik, id = m.chat, option = { mentions: [m.sender] }) => conn.sendMessage(id, { sticker: stik, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyImg = (img, teks, id = m.chat, option = { mentions: [m.sender] }) => conn.sendMessage(id, { image: img, caption: teks, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyVid = (vid, teks, id = m.chat, option = { mentions: [m.sender], gif: false }) => conn.sendMessage(id, { video: vid, caption: teks, gifPlayback: option.gif, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyAud = (aud, id = m.chat, option = { mentions: [m.sender], ptt: false }) => conn.sendMessage(id, { audio: aud, ptt: option.ptt, mimetype: 'audio/mpeg', contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyDoc = (doc, id = m.chat, option = { mentions: [m.sender], filename: 'undefined.pdf', mimetype: 'application/pdf' }) => conn.sendMessage(id, { document: doc, mimetype: option.mimetype, fileName: option.filename, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
	m.replyContact = (name, info, number) => {
		var vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + name + '\n' + 'ORG:' + info + ';\n' + 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n' + 'END:VCARD'
		conn.sendMessage(m.chat, { contacts: { displayName: name, contacts: [{ vcard }] } }, { quoted: m })
	}
	m.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } })
	
	return m
}

module.exports = { sms,downloadMediaMessage }
*/