require('dotenv').config();
const { create } = require('@open-wa/wa-automate');
const axios = require('axios');

// ======================
// CONFIGURAÇÃO GROQ API
// ======================
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ================
// GERAR RESPOSTA
// ================
async function gerarResposta(mensagem) {
  try {
    const resposta = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'Você é o Bot Ytallo Shop, um assistente útil para responder perguntas e ajudar em vendas e dúvidas pelo WhatsApp.'
          },
          {
            role: 'user',
            content: mensagem
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const textoGerado = resposta.data.choices?.[0]?.message?.content?.trim();
    return textoGerado || "❌ Desculpe, não consegui gerar uma resposta.";
  } catch (err) {
    console.error('❌ Erro na API da Groq:', err.response?.data || err.message);
    return "❌ Erro ao se comunicar com a IA.";
  }
}

// ===================
// TEMPO DE EXECUÇÃO
// ===================
const startTime = Date.now();
function formatUptime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

let clientInstance = null;

create({
  useChrome: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: false
}).then(client => {
  start(client);
});

async function start(client) {
  console.log('✅ Bot conectado no WhatsApp com sucesso!');
  clientInstance = client;

  client.onMessage(async (message) => {
    try {
      const { body, from, isGroupMsg, chat, sender, mentionedJidList } = message;
      const command = body.toLowerCase();
      const groupId = chat?.groupMetadata?.id;
      const senderId = sender.id;
      const isGroupAdmin = chat?.groupMetadata?.participants.find(p => p.id === senderId)?.isAdmin;
      const botNumber = await client.getHostNumber() + "@c.us";
      const isBotAdmin = chat?.groupMetadata?.participants.find(p => p.id === botNumber)?.isAdmin;

      if (isGroupMsg && (body.includes("http://") || body.includes("https://"))) {
        if (!isGroupAdmin) {
          await client.sendText(from, `🚫 ${sender.pushname} você não pode mandar links aqui!`);
          await client.removeParticipant(groupId, senderId);
          console.log(`🚫 Removido ${sender.pushname} por enviar link.`);
          return;
        }
      }

      if (command.startsWith('!')) {
        console.log(`📩 Comando recebido: ${command}`);

        if (command === '!ping') {
          const uptime = formatUptime(Date.now() - startTime);
          const speed = Date.now() - message.t;
          await client.sendText(from, `🏓 *Pong!*\n\nTempo online: ${uptime}\nVelocidade: ${speed}ms`);
        }

        else if (command === '!anuncio1') {
          await client.sendImage(from, 'foto-teste.png', 'foto-teste.png', `texto a ser aparecido à mensagem do watsapp
`);
        }

        else if (command.startsWith('!ban')) {
          if (!isGroupMsg) return await client.sendText(from, '❌ Este comando só pode ser usado em grupos.');
          if (!isGroupAdmin) return await client.sendText(from, '❌ Somente administradores podem usar esse comando.');
          if (!mentionedJidList.length) return await client.sendText(from, '❌ Você precisa marcar a pessoa que quer banir.');
          if (!isBotAdmin) return await client.sendText(from, '❌ Preciso ser administrador para banir alguém.');

          for (let user of mentionedJidList) {
            await client.removeParticipant(groupId, user);
          }
          await client.sendText(from, '👋 Participante removido com sucesso!');
        }

        else if (command.startsWith('!add')) {
          if (!isGroupMsg) return await client.sendText(from, '❌ Este comando só pode ser usado em grupos.');
          if (!isGroupAdmin) return await client.sendText(from, '❌ Somente administradores podem usar esse comando.');
          if (!isBotAdmin) return await client.sendText(from, '❌ Preciso ser administrador para adicionar pessoas.');

          const number = body.split(' ')[1];
          if (!number) return await client.sendText(from, '❌ Você precisa informar o número. Exemplo: !add 5581999999999');

          await client.addParticipant(groupId, number + '@c.us');
          await client.sendText(from, '✅ Usuário adicionado com sucesso!');
        }

        else if (command === '!menu') {
          const menuMessage = `
📋 *Menu - Bot Ytallo Shop*

*Uso do Desenvolvedor do Sistema:*
• !ping - Verifica a conectividade do bot

*Uso Administrativo:*
• !add +55 - Adiciona um número ao grupo
• !ban @usuario - Remove um usuário

*Uso de todos:*
• Pesquisas em formato de perguntas.
• crie img "como quer a img".

Envie sua dúvida ou mensagem para receber uma resposta automática!
          `;
          await client.sendText(from, menuMessage);
        }

        else {
          await client.sendText(from, '❌ Comando não reconhecido.');
        }

      } else {
        const resposta = await gerarResposta(body);
        await client.sendText(from, resposta);
        console.log('✅ Respondeu com Groq:', resposta);
      }

    } catch (err) {
      console.error('❌ Erro ao processar mensagem:', err.message);
    }
  }); // <-- FECHANDO client.onMessage
} // <-- FECHANDO corretamente a função start(client)

function startBot(io) {
  console.log('🚀 Iniciando bot via interface...');
  return create({
    sessionId: "BOT",
    multiDevice: true,
    authTimeout: 60,
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    qrTimeout: 0
  })
    .then(client => {
      start(client);
      io.emit('botStatus', 'Bot iniciado com sucesso!');
    })
    .catch(err => {
      console.error('❌ Erro ao iniciar bot:', err);
      io.emit('botStatus', 'Erro ao iniciar bot.');
    });
}

function stopBot() {
  if (clientInstance) {
    console.log('🛑 Parando bot...');
    clientInstance.close();
    clientInstance = null;
  }
}

function getBotStatus() {
  return clientInstance ? 'Rodando' : 'Parado';
}

module.exports = { startBot, stopBot, getBotStatus };
