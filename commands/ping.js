const moment = require('moment');

module.exports = {
    name: 'ping',
    run: async (sock, msg, args) => {
        const start = Date.now();
        await sock.sendMessage(msg.key.remoteJid, { text: '🏓 Testando...' });
        const end = Date.now();
        const uptime = moment.duration(process.uptime(), 'seconds').humanize();

        const response = `🏓 Pong!\n\nVelocidade: *${end - start}ms*\nTempo online: *${uptime}*`;
        await sock.sendMessage(msg.key.remoteJid, { text: response });
    }
};
