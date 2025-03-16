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

const axios = require('axios');
const FormData = require('form-data');

cmd({
    pattern: "gemini",
    desc: "Analyzes an image and explains what it is.",
    category: "ai",
    filename: __filename,
}, async (conn, mek, m, { reply, quoted }) => {
    try {
        if (!quoted) return reply("❌ Please reply to an image.");
        let mime = m.quoted.mimetype || "";
        if (!/image/.test(mime)) {
            return reply("❌ Please reply to an image message.");
        }
        
        // Download the image from the quoted message
        let imgBuffer = await m.quoted.download();
        if (!imgBuffer) return reply("❌ Failed to download the image.");
        
        // Prepare form data with the image
        let form = new FormData();
        form.append('image', imgBuffer, { filename: 'image.jpg' });
        
        // Send the image to the API
        const response = await axios.post("https://api.nexoracle.com/ai/gemini-image", form, {
            headers: {
                ...form.getHeaders()
            }
        });
        
        // Extract explanation from API response
        const explanation = response.data.explanation || response.data.result || response.data.text;
        if (!explanation) {
            return reply("❌ Could not retrieve an explanation from the API.");
        }
        
        reply(`🤖 *Image Analysis:*\n\n${explanation}`);
    } catch (error) {
        console.error(error);
        reply("❌ An error occurred: " + error.message);
    }
});