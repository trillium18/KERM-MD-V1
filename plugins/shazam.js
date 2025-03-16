const { createCanvas, loadImage } = require('canvas');
const { cmd } = require('../command');
const fs = require('fs');

cmd({
    pattern: "quote",
    desc: "Create an image quote from the provided text.",
    category: "tools",
    use: ".quote [text]",
    filename: __filename,
}, async (conn, mek, m, { reply, q, from }) => {
    if (!q) return reply("❌ Please provide a text to create a quote.");

    const quoteText = q;
    const author = "Unknown"; // You can customize the author if needed.

    // Create canvas for the quote image
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#f3f3f3'; // Background color (light gray)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set font and text style
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#333'; // Text color
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the quote text on the canvas
    const quoteX = canvas.width / 2;
    const quoteY = canvas.height / 2 - 40;
    const authorY = canvas.height / 2 + 40;

    ctx.fillText(`❝ ${quoteText} ❞`, quoteX, quoteY);
    ctx.font = 'italic 20px Arial';
    ctx.fillText(`- ${author}`, quoteX, authorY);

    // Save the canvas as an image
    const outputPath = './quote_image.png';
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    // Send the generated image
    await conn.sendMessage(from, {
        image: { url: outputPath },
        caption: `🖼️ *Quote Created*:\n\n❝ ${quoteText} ❞\n\n– ${author}`,
    }, { quoted: mek });

    // Clean up the image after sending
    fs.unlinkSync(outputPath);
});