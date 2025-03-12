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
/*
const {
  cmd,
  commands
} = require("../command");
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  sleep,
  fetchJson
} = require("../lib/functions");
cmd({
  'pattern': 'pair',
  'alias': ["register", 'link'],
  'react': '🔢',
  'desc': "pair",
  'category': 'download',
  'use': ".pair 237656520674",
  'filename': __filename
}, async (_0x5b297c, _0x3a3e44, _0xefafe8, {
  from: _0x5aafb9,
  prefix: _0x322641,
  quoted: _0x587384,
  q: _0x560654,
  reply: _0x2b55a0
}) => {
  try {
    if (!_0x560654) {
      return await _0x2b55a0("*Example - :* .pair 237656520674");
    }
    const _0x29763b = await fetchJson("https://pair-session-kermv4-pair.onrender.com/code?number=" + _0x560654);
    const _0x4b5713 = _0x29763b.code;
    _0xefafe8.reply(_0x4b5713 + "\n\n" + "_*Here Is Your Kerm Md V1 pair code...✅*_");
  } catch (_0x5be2b9) {
    console.log(_0x5be2b9);
    _0x2b55a0(_0x5be2b9);
  }
});
*/

//const fetch = require("node-fetch");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson} = require('../lib/functions')
const { cmd } = require("../command");

// get pair 2

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Pairing code",
    category: "download",
    use: ".pair +237656520674",
    filename: __filename
}, 
async (conn, mek, m, { from, prefix, quoted, q, reply }) => {
    try {
        // Helper function for delay
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // Validate input
        if (!q) {
            return await reply("*Example : .Pair 237656520674*");
        }

        // Fetch pairing code
        //const fetch = require("node-fetch");
        const response = await fetch(`https://pair-session-kermv4-pair.onrender.com/code?number=${q}`);
        const pair = await response.json();

        // Check for errors in response
        if (!pair || !pair.code) {
            return await reply("Failed to retrieve pairing code. Please check the phone number and try again.");
        }

        // Success response
        const pairingCode = pair.code;
        const doneMessage = "> *KERM-MD-V1 PAIR COMPLETED*";

        // Send first message
        await reply(`${doneMessage}\n\n> *PAIRING CODE IS: ${pairingCode}*`);

        // Add a delay of 1 seconds before sending the second message
        await sleep(1000);

        // Send second message with just the pairing code
        await reply(`${pairingCode}`);
    } catch (error) {
        console.error(error);
        await reply("An error occurred. Please try again later.");
    }
});
          
