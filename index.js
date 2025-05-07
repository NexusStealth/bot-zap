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
          await client.sendText(from, `⚜Ytallo Shop ⚜

Contato PV:  https://wa.me/qr/RLNHS7S3UGOKE1

RAPAZIADA, NOVOS PRODUTOS AI PRA VOCÊS

Se liga nos produtos que podem mudar seu jogo — seja pra ganhar mais, se proteger na net ou só curtir com estilo!

Chama no PV pra manter a privacidade de cada um. Atendimento rápido e sigiloso!

☞⁠￣⁠ᴥ⁠￣⁠☞

🎬 Filmes e Séries em Alta Qualidade – Lançamentos e clássicos em qualidade máxima, vitalício.
R$19,99

🎯 Xits de Free Fire – CLT, FOCCUS, anti-ban, configs tops pra subir capa fácil.
R$24,99

🚀 Apps Unlocked – YouTube Vanced, Revanced, Spotify MOD e outros apps desbloqueados.
R$9,99

✉ E-mails Comerciais – E-mail com domínio próprio + direito a um site simples incluso.
R$19,99

🗄 Servidores Remotos Sem Rastreio – Armazenamento seguro, criptografado, de 10GB a 1PTB.
R$34,99

🛡 VPN Privada – Proteção total e navegação anônima, com IP dedicado e alta velocidade.
R$22,99

🤖 Chatbot Personalizado – Chat automático no WhatsApp, Telegram ou site, com comandos editáveis.
R$39,99

🌐 Criação de Sites & Landing Pages – Página profissional pronta pra vender, responsiva e rápida.
R$59,99

⚙ Ferramentas Digitais – Bots, scripts e automatizações pra facilitar sua vida.
R$24,99

🎮 Contas Premium – Netflix, Spotify, Crunchyroll, Amazon e mais. (Perfil compartilhado 1 mês)
R$14,99

📲 Clonagem de Sites – Replica exata de qualquer site ou loja virtual, pronta pra uso.
R$49,99

🔐 Proteção Total de Dados – Configurações exclusivas pra garantir anonimato e segurança real.
R$19,99

🧰 Edição e Design em APK – CapCut PRO, VN, InShot PRO e outros apps premium desbloqueados.
R$12,99

💽 Hospedagem + Domínio – Hospedagem + domínio .com por 1 ano incluso.
R$49,99

📸 Edição de IMG e Remoção de marca d'água 

Edição de imagem:
1unidade - 15$

Remoção de Marca d'água:

Remoção de marca d'água de Foto:
1unidade - 13$

Remoção de marca d'água de vídeos:
1unidade - 36$
---

Todos os serviços com garantia e suporte! Chama no PV e garanta o seu!`);
        }

        else if (command === '!anuncio2') {
          await client.sendText(from, `⚜ Ytallo Shop ⚜

Contato PV:  https://wa.me/qr/RLNHS7S3UGOKE1

RAPAZIADA, NOVOS PRODUTOS AI PRA VOCÊS

🔎PAINÉIS DE CONSULTA🔎

CPF, EMAIL, CNPJ E TELEFONE

📌 HARD BUSCA
30 DIAS - R$ 120,00
15 DIAS - R$ 100,00
7 DIAS - R$ 50,00

Valor Unitário:

CPF - 25$
EMAIL - 20$
CNPJ - 30$
TELEFONE - 20$

🪪 CPF E CNPJ FALSIFICADOS

Planos Ilimitados:
30 DIAS - 130$
15 DIAS - 90$
7 DIAS - 50$
Valor Unitário:
 CPF - 25$
 CNPJ - 30$

📞 SPAM

PLANO ILIMITADO:
30 DIAS - 120$
15 DIAS - 70$
7 DIAS - 30$

Unitario:
SPAM UNI - 10$

✉ E-MAIL VIRGEM

VALOR UNITARIO:
1 E-MAIL - 10$

📱APPS LARA

Valores Unitários:
1 Banco Lara - 20$

🌐Telas FK

Valor Unitário:
1 Tela - 20$

📚E-BOOK PLR'S

Valor em grupos de e-book:

100 - 30$
*700 - 100$

🤖Metodos de IA

VALOR UNITÁRIO:

CHATGPT - 30$
DETECTOR DE VOZ - 40$
CONSTRUTOR DE SITES - 60$
CONVERSA COM CLIENTES - 40$

BORA RAPAZIADA, NOVOS PRODUTOS COMPLETO`);
        }

        else if (command === '!anuncio3') {
          await client.sendText(from, `⚜ Ytallo Shop ⚜

Contato PV:  https://wa.me/qr/RLNHS7S3UGOKE1


Quer dar Aquele golpe em velhos ou pessoas desinformadas vendendo produtos falso pra lucrar? Trouxe a solução: Telas Fake e Gatway Privado com suporte 24hrs para dúvidas e ajudas

- Tela Fake:
-  Marcado Livre 5 produtos 50$, 10 produtos 100$ e etc. (com Gatway Funcionando).
- Netflix com 3 planos mensais 60$ (com Gatway Funcionando).
- Shoppe 5 produtos 50$, 10 produto 100$ (gatway Funcionando).


- Gatway:
- somente o sistema de pagamento para adaptar ao código front 70$.
- site criado do zero com o gatway pronto e funcionando 120$`);
        }

        else if (command === '!anuncio5') {
          await client.sendImage(from, 'rg-falso.jpeg', 'rg-falso.jpeg', `⚜ Ytallo Shop ⚜

PROMOÇÃO DE RG:

Contato PV:  https://wa.me/qr/RLNHS7S3UGOKE1

Quer uma RG com todos os dados Completo?, com a RG virtual verdadeira e funcional, com marca d'água do governo do país e do estado pronto pra ir para a sua mao, aqui funciona assim: compra recebe o produto aí e só usar e ser feliz, vem pegar a tua!

Enteressados Chamem o Meu PV, Não chame se não Estiver Interessado para não me Atrasar

Interessados, Valor: 40$, OBS:RG virtual, fica em seu critério a impressão dela
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