conn.on('message-new', async (mek) => {
    try {
        const { from, sender, body, isStatus } = mek;
        const triggerWords = ["send", "envoie", "envoi", "abeg"];
        
        // Vérifier si le message est une réponse à un statut du bot
        if (!isStatus || !mek.quoted) return;

        // Vérifier si le message contient un des mots-clés
        if (!triggerWords.some(word => body.toLowerCase().includes(word))) return;

        // Récupérer le contenu du statut auquel on a répondu
        const quotedMessage = mek.quoted;

        // Vérifier le type de contenu du statut (image, vidéo, texte)
        if (quotedMessage.message.imageMessage) {
            await conn.sendMessage(from, { image: quotedMessage.message.imageMessage, caption: "Here is the status you requested." }, { quoted: mek });
        } else if (quotedMessage.message.videoMessage) {
            await conn.sendMessage(from, { video: quotedMessage.message.videoMessage, caption: "Here is the status you requested." }, { quoted: mek });
        } else if (quotedMessage.message.conversation || quotedMessage.message.extendedTextMessage) {
            const textContent = quotedMessage.message.conversation || quotedMessage.message.extendedTextMessage.text;
            await conn.sendMessage(from, { text: textContent }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { text: "Sorry, I can't forward this type of status." }, { quoted: mek });
        }
    } catch (error) {
        console.error("Error while sending the requested status:", error);
    }
});
