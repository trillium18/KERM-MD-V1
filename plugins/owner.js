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

/*const { cmd } = require('../command');

cmd({
    pattern: "owner",
    react: "👑", // Reaction emoji when the command is triggered
    alias: ["kerm"],
    desc: "Get owner number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from }) => {
    try {
        // Owner's contact info
        const ownerNumber = '+237656520674'; // Replace this with the actual owner number
        const ownerName = '༒𝐋𝐎𝐑𝐃 𝐊𝐄𝐑𝐌༒'; // Replace this with the owner's name
        const organization = 'UD TEAM'; // Optional: replace with the owner's organization

        // Create a vCard (contact card) for the owner
        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  // Full Name
                      `ORG:${organization};\n` +  // Organization (Optional)
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` +  // WhatsApp ID and number
                      'END:VCARD';

        // Send the vCard first
        const sentVCard = await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Send a reply message that references the vCard
        await conn.sendMessage(from, {
            text: `This is the owner's contact: ${ownerName}`,
            contextInfo: {
                mentionedJid: [ownerNumber.replace('+237656520674') + '+923096287432@s.whatsapp.net'], // Mention the owner
                quotedMessageId: sentVCard.key.id // Reference the vCard message
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { text: 'Sorry, there was an error fetching the owner contact.' }, { quoted: mek });
    }
});*/



const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "owner",
  react: "👑", 
  alias: ["kerm"],
  desc: "Get owner number",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    // Propriétaires' informations de contact
    const owners = [
      { number: '+237656520674', name: '༒𝐋𝐎𝐑𝐃 𝐊𝐄𝐑𝐌༒', organization: 'UD TEAM' },
      { number: '+237650564445', name: 'ᵏᵍᶠ┘𝐓𝐄𝐑𝐌𝐈𝐍𝐀𝐓𝐎𝐑', organization: 'UD TEAM' }
    ];

    let contacts = [];
    owners.forEach((owner) => {
      const vcard = `BEGIN:VCDCARD\n` +
        `VERSION:3.0\n` +
        `FN:${owner.name}\n` +
        `ORG:${owner.organization};\n` +
        `TEL;type=CELL;type=VOICE;waid=${owner.number.replace('+', '')}:${owner.number}\n` +
        `END:VCARD`;
      contacts.push({ vcard });
    });

    // Envoyer les vCards
    const sentVCard = await conn.sendMessage(from, { contacts: { displayName: "Propriétaires", contacts } });

    // Mentionner les deux propriétaires
    const mentionedJid = owners.map(owner => owner.number.replace('+', '') + '@s.whatsapp.net');

    // Envoyer un message de réponse qui référence les vCards
    await conn.sendMessage(from, {
      text: `Voici les contacts des propriétaires :\n\n${owners.map(o => `📌 ${o.name} : ${o.number}`).join('\n')}`,
      contextInfo: {
        mentionedJid,
        quotedMessageId: sentVCard.key.id
      }
    }, { quoted: mek });
  } catch (error) {
    console.error(error);
    await conn.sendMessage(from, {
      text: 'Désolé, il y a eu une erreur lors de la récupération des contacts des propriétaires.'
    }, { quoted: mek });
  }
});