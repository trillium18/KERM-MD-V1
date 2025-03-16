const { cmd } = require('../command');
const sharp = require('sharp');  // Assurez-vous d'avoir installé la bibliothèque sharp

cmd({
    pattern: "hd",
    desc: "Améliore la qualité d’une image (4K).",
    category: "image",
    react: "🖼️",
    filename: __filename,
}, async (conn, mek, m, { reply, quoted }) => {
    // Vérification si une image a été envoyée
    let media = quoted ? quoted : m;
    if (!media || !media.message || !media.message.imageMessage) {
        return reply("❌ Veuillez répondre à une image ou envoyer une image pour l'améliorer.");
    }

    // Télécharger l'image
    const img = await conn.downloadAndSaveMediaMessage(media);
    
    try {
        // Améliorer l'image en utilisant sharp (ici on l'agrandit en 4K)
        const outputPath = './temp/hd-image.jpg';  // Chemin de sortie pour l'image améliorée

        await sharp(img)
            .resize(3840, 2160)  // 4K resolution
            .toFile(outputPath, (err, info) => {
                if (err) {
                    return reply(`❌ Une erreur est survenue lors de l'amélioration de l'image : ${err.message}`);
                }
                
                // Envoi de l'image améliorée
                conn.sendMessage(m.chat, {
                    image: { url: outputPath },
                    caption: "🔝 Voici votre image améliorée en 4K !"
                });
            });
    } catch (error) {
        return reply(`❌ Une erreur est survenue : ${error.message}`);
    }
});