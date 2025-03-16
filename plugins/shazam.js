const { cmd } = require('../command');
const sharp = require('sharp');

cmd({
    pattern: "hd",
    desc: "Améliore la qualité d’une image (4K).",
    category: "tools",
    react: "📷",
    filename: __filename,
}, async (conn, mek, m, { reply, quoted }) => {
    try {
        // Vérifie si l'utilisateur a répondu à une image
        if (!quoted) {
            return reply("❌ Veuillez répondre à une image ou envoyer une image pour l'améliorer.");
        }

        // Récupère le mime type de l'image envoyée
        let mime = (quoted.msg || quoted).mimetype || "";
        if (!mime.startsWith("image")) {
            return reply("❌ Veuillez répondre à une image valide.");
        }

        // Téléchargement de l'image
        const media = await quoted.download();
        if (!media) return reply("❌ Impossible de télécharger l'image.");

        // Utilisation de Sharp pour améliorer la qualité de l'image (redimensionnement en 4K)
        const enhancedImage = await sharp(media)
            .resize(3840, 2160)  // Résolution 4K
            .toBuffer();

        // Envoi de l'image améliorée
        await conn.sendMessage(m.chat, {
            image: { url: 'data:image/jpeg;base64,' + enhancedImage.toString('base64') },
            caption: "Voici l'image améliorée en 4K !"
        });
    } catch (error) {
        console.error('Erreur lors de l\'amélioration de l\'image:', error);
        reply('❌ Une erreur s\'est produite lors de l\'amélioration de l\'image.');
    }
});