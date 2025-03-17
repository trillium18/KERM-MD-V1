/*created by Kgtech 🕵
contact dev1 237656520674 ♻️
contact dev2 237650564445 ♻️
© Copy coder alert ⚠
*/





const config = require('../config')
const {cmd , commands} = require('../command')
const os = require("os")
const {runtime} = require('../lib/functions')

cmd({
    pattern: "system",
    react: "⚙️",
    alias: ["uptime", "runtime"],
    desc: "Check system uptime and status.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // ✅ Données système
        const uptime = runtime(process.uptime());
        const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = Math.round(os.totalmem() / 1024 / 1024);
        const hostname = os.hostname();

        // ✅ Design avec une mise en page améliorée
        const status = `
┌─── ⦿ *SYSTEM STATUS* ⦿ ───┐
│ 🚀 *Uptime:*       ➔ ${uptime}
│ 💾 *RAM Usage:*    ➔ ${usedRam}MB / ${totalRam}MB
│ 🌐 *Hostname:*     ➔ ${hostname}
│ 👑 *Owner:*        ➔ *KG TECH*
└─────────────────────────────┘
        `.trim();

        // ✅ Envoi du message formaté avec une image personnalisée
        await conn.sendMessage(
            from,
            {
                image: { url: config.ALIVE_IMG },
                caption: `🎯 *System Info* 🎯\n\n${status}`
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply(`❌ *An error occurred:* ${e.message}`);
    }
});