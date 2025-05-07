// commands/add.js
module.exports = async (client, msg, args) => {
    if (!msg.isGroupMsg) return msg.reply('Este comando só pode ser usado em grupos.');
    if (!msg.isGroupAdmins) return msg.reply('Você precisa ser administrador para usar isso.');

    if (args.length !== 1) return msg.reply('Envie o número assim: !add 5581987654321');

    const number = args[0].includes('@c.us') ? args[0] : `${args[0]}@c.us`;
    await client.addParticipant(msg.from, number);
    msg.reply('Usuário adicionado!');
};
