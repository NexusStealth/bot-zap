// events/message.js
module.exports = async (client, msg) => {
    if (msg.isGroupMsg && msg.body.includes('https://')) {
        const isAdmin = msg.author === undefined || msg.isGroupAdmins;
        if (!isAdmin) {
            await client.removeParticipant(msg.from, msg.author);
            await client.sendText(msg.from, 'Usuário removido por enviar link sem permissão.');
        }
    }
};
