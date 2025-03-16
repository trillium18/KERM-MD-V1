const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { cmd } = require('../command');

cmd({
    pattern: 'identify',
    desc: 'Identifie une musique à partir d\'un extrait audio.',
    category: 'tools',
    use: '.identify (répondre à un message audio)',
    filename: __filename,
}, async (conn, m, { reply }) => {
    try {
        // Vérifie si le message est une réponse à un fichier audio
        if (!m.quoted || !m.quoted.mimetype.startsWith('audio')) {
            return reply('❌ Veuillez répondre à un message contenant un fichier audio.');
        }

        // Télécharge le fichier audio
        const audioBuffer = await m.quoted.download();
        const tempFilePath = path.join(os.tmpdir(), 'audio_sample.mp3');
        fs.writeFileSync(tempFilePath, audioBuffer);

        // Prépare les données pour l'API AudD
        const formData = new FormData();
        formData.append('api_token', '088e1380100df1e7832842d31aab7e88');
        formData.append('file', fs.createReadStream(tempFilePath));
        formData.append('return', 'apple_music,spotify');

        // Envoie la requête à l'API AudD
        const response = await axios.post('https://api.audd.io/', formData, {
            headers: formData.getHeaders(),
        });

        // Supprime le fichier temporaire
        fs.unlinkSync(tempFilePath);

        // Traite la réponse de l'API
        if (response.data.status === 'success' && response.data.result) {
            const { artist, title, album, release_date, spotify, apple_music } = response.data.result;
            let message = `🎵 *Musique identifiée* 🎵\n\n`;
            message += `*Titre* : ${title}\n`;
            message += `*Artiste* : ${artist}\n`;
            if (album) message += `*Album* : ${album}\n`;
            if (release_date) message += `*Date de sortie* : ${release_date}\n`;
            if (spotify) message += `\n*Écouter sur Spotify* : ${spotify.external_urls.spotify}\n`;
            if (apple_music) message += `*Écouter sur Apple Music* : ${apple_music.url}\n`;
            reply(message);
        } else {
            reply('❌ Aucune correspondance trouvée pour cet extrait audio.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'identification de la musique :', error);
        reply('❌ Une erreur est survenue lors de l\'identification de la musique.');
    }
});