const { consultarCPF } = require('../services/consultasExternas');

module.exports = {
    name: 'cpf',
    run: async (sock, msg, args) => {
        const cpf = args[0];
        if (!cpf) return await sock.sendMessage(msg.key.remoteJid, { text: 'Digite um CPF válido.' });

        try {
            const resultado = await consultarCPF(cpf);
            await sock.sendMessage(msg.key.remoteJid, { text: `🔍 Resultado:\n\nNome: ${resultado.nome}\nNascimento: ${resultado.nascimento}` });
        } catch (err) {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Erro na consulta.' });
        }
    }
};
