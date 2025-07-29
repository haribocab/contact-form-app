require('dotenv').config();
const express = require('express');
const http = require('http');  // 追加
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io'); // 追加

const app = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const REACT_ORIGIN =  process.env.REACT_ORIGIN || 'http://localhost:5173';

// Middlewares
app.use(cors({
  origin: REACT_ORIGIN, // React の URL
  methods: ['GET', 'POST', 'DELETE'],        // 必要に応じて追加
  credentials: true                // Cookie を使う場合のみ必要
}));

app.use(express.json());

// MongoDB setup
mongoose.connect(MONGODB_URI);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Expressアプリをhttpサーバーでラップ
const server = http.createServer(app);

// Socket.IOサーバー作成＆設定
const io = new Server(server, {
  cors: {
    origin: REACT_ORIGIN,
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  }
});


const entriesRouter = require('./routes/entries')(io);
app.use('/api/entries', entriesRouter);
app.use('/api/login', require('./routes/login'));
app.use('/api/register', require('./routes/register'));

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // 必要なら socket.user に情報追加
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on('connection', (socket) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.log('⚠ No token provided. Disconnecting...');
    return socket.disconnect();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // 必要なら後続の処理で使えるようにする
    console.log('✅ Authenticated socket:', decoded.userid);
  } catch (err) {
    console.log('❌ Invalid token. Disconnecting...');
    return socket.disconnect();
  }

  // 通常のイベント登録はここ
  socket.on('newEntry', (entryData) => {
    console.log('New entry from:', socket.user?.userid || socket.id);

    // 全ての接続クライアントに通知
    io.emit('entryCreated', entryData);
  });
});

// server.listenで起動（app.listenは使わない）
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
