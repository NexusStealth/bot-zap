const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// ✅ Importando as funções do bot do index.js
const { startBot, stopBot, getBotStatus } = require('./index');

let logs = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'sua_chave_secreta_segura',
  resave: false,
  saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

function checkAuth(req, res, next) {
  if (req.session.authenticated) return next();
  res.redirect('/');
}

app.get('/', (req, res) => {
  if (req.session.authenticated) return res.redirect('/index');
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.post('/login', (req, res) => {
  const { senha } = req.body;
  if (senha === '6445') {
    req.session.authenticated = true;
    res.redirect('/index');
  } else {
    res.send('Senha incorreta!');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/index', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/dashboard', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

// ✅ Rota para iniciar o bot
app.get('/start', checkAuth, (req, res) => {
  startBot(io);
  res.send('Bot iniciado.');
});

// ✅ Rota para parar o bot
app.get('/stop', checkAuth, (req, res) => {
  stopBot();
  res.send('Bot desligado.');
});

// ✅ Rota para ver status
app.get('/status', checkAuth, (req, res) => {
  res.json({ status: getBotStatus() });
});

io.on('connection', (socket) => {
  logs.forEach(l => socket.emit('log', l));
});

function addLog(msg) {
  logs.push(msg);
  io.emit('log', msg);
}

// ✅ Exporta apenas o necessário (sem sobrescrever)
module.exports = { http, addLog };

// Inicia o servidor
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  http.listen(PORT, () => console.log(`Painel rodando em http://localhost:${PORT}`));
}
