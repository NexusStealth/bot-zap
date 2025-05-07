// commands/ban.js
module.exports = async (client, msg, args) => {
    if (!msg.isGroupMsg) return msg.reply('Este comando só pode ser usado em grupos.');
    if (!msg.isGroupAdmins) return msg.reply('Você precisa ser administrador para usar isso.');

    if (args.length === 0) return msg.reply('Marque alguém para banir.');

    const mentioned = msg.mentionedJidList[0];
    if (!mentioned) return msg.reply('Não achei o usuário mencionado.');

    await client.removeParticipant(msg.from, mentioned);
    msg.reply('Usuário banido com sucesso!');
};
