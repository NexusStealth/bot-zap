module.exports = async function(sock, update) {
    const participants = update.participants;
    for (const participant of participants) {
        if (update.action === 'add') {
            await sock.sendMessage(update.id, { text: `Seja bem-vindo(a), @${participant.split('@')[0]}! 👋`, mentions: [participant] });
        }
    }
}
