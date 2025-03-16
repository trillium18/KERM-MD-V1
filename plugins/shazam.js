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
        if (!quoted) {
            return reply("❌ Veuillez répondre à une image ou envoyer une image pour l'améliorer.");
        }
        
        let mime = (quoted.msg || quoted).mimetype || "";
        if (!mime.startsWith("image")) {
            return reply("❌ Veuillez répondre à un message contenant une image.");
        }
        
        // Téléchargement de l'image
        const media = await quoted.download();
        if (!media) return reply("❌ Impossible de télécharger l'image.");

        // Vérification et conversion en Buffer
        let buffer = media;
        if (media.data) {
            buffer = media.data;
        }
        if (!Buffer.isBuffer(buffer)) {
            buffer = Buffer.from(buffer);
        }

        // Utilisation de Sharp pour améliorer la qualité (redimensionnement en 4K)
        const enhancedImage = await sharp(buffer)
            .resize(3840, 2160, { fit: 'fill' })
            .toBuffer();

        // Envoi de l'image améliorée avec une data URL
        await conn.sendMessage(m.chat, {
            image: { url: 'data:image/jpeg;base64,' + enhancedImage.toString('base64') },
            caption: "Voici l'image améliorée en 4K !"
        });
    } catch (error) {
        console.error('Erreur lors de l\'amélioration de l\'image:', error);
        reply('❌ Une erreur s\'est produite lors de l\'amélioration de l\'image: ' + error.message);
    }
});