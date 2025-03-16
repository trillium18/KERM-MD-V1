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
        if (!m.quoted || !m.quoted.mimetype.startsWith('audio')) {
            return reply('❌ Veuillez répondre à un message contenant un fichier audio.');
        }

        // Téléchargement du fichier audio
        const audioBuffer = await m.quoted.download();
        const tempFilePath = path.join(os.tmpdir(), 'audio_sample.mp3');
        fs.writeFileSync(tempFilePath, audioBuffer);

        // Vérification de la taille du fichier
        const stats = fs.statSync(tempFilePath);
        if (stats.size > 10 * 1024 * 1024) {
            fs.unlinkSync(tempFilePath);
            return reply('❌ Le fichier est trop volumineux. (max 10 Mo)');
        }

        // Préparation des données pour l'API
        const formData = new FormData();
        formData.append('api_token', 'VOTRE_CLÉ_API_AUDD');
        formData.append('file', fs.createReadStream(tempFilePath));
        formData.append('return', 'apple_music,spotify');

        // Envoi de la requête à l'API
        const response = await axios.post('https://api.audd.io/', formData, {
            headers: formData.getHeaders(),
        });

        fs.unlinkSync(tempFilePath); // Supprimer le fichier temporaire

        // Affichage de la réponse API
        console.log('API Response:', response.data);

        // Traitement du résultat
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
        console.error('Erreur lors de l\'identification de la musique :', error?.response?.data || error?.message);
        reply(`❌ Erreur : ${error?.response?.data?.error || error.message}`);
    }
});