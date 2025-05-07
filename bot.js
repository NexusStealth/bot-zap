// bot.js
let botStarted = false;

function startBot() {
  botStarted = true;
  console.log("🤖 Bot iniciado.");
  // Coloque aqui o código para iniciar o bot
}

function stopBot() {
  botStarted = false;
  console.log("🛑 Bot parado.");
  // Coloque aqui o código para parar o bot
}

function getBotStatus() {
  return botStarted ? "Bot rodando" : "Bot parado";
}

module.exports = { startBot, stopBot, getBotStatus };
