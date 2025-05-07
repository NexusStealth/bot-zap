// events/group_participants.js
module.exports = async (client, event) => {
    const { action, who, chat } = event;

    if (action === 'add') {
        const welcomeMessage = `👋 Olá, seja bem-vindo(a) ao grupo!

📜 Regras principais:
- Sem spam
- Sem links sem permissão
- Respeito acima de tudo
- Divirta-se!

Qualquer dúvida, chame um ADM!`;
        await client.sendText(chat, welcomeMessage);
    }
};
