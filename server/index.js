require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');

const app = express();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const REACT_ORIGIN =  process.env.REACT_ORIGIN || 'http://localhost:5173';

// Middlewares
app.use(cors({
  origin: REACT_ORIGIN,
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// MongoDB setup
mongoose.connect(MONGODB_URI);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// HTTP Server
const server = http.createServer(app);

// Create Socket.IO Server
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
    socket.user = decoded;
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
    socket.user = decoded;
    console.log('✅ Authenticated socket:', decoded.userid);
  } catch (err) {
    console.log('❌ Invalid token. Disconnecting...');
    return socket.disconnect();
  }

  socket.on('newEntry', (entryData) => {
    console.log('New entry from:', socket.user?.userid || socket.id);

    io.emit('entryCreated', entryData);
  });

  socket.on('entryDeleted', (entryId) => {
    io.emit('entryDeleted', entryId);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
