const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const commands = {}; // Objeto para carregar comandos

// Carregar todos os comandos automaticamente
fs.readdirSync(path.join(__dirname, '../commands')).forEach(file => {
    const command = require(`../commands/${file}`);
    commands[command.name] = command;
});

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        if (text.startsWith('!')) {
            const args = text.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = commands[commandName];

            if (command) {
                try {
                    await command.run(sock, msg, args);
                } catch (err) {
                    console.error(err);
                    await sock.sendMessage(from, { text: 'Erro ao executar comando.' });
                }
            }
        }
    });

    console.log('✅ Bot iniciado');
}

module.exports = { startSock };
