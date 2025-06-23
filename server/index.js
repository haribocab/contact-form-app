require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

// MongoDB setup (insert your connection string here)
mongoose.connect(MONGODB_URI);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is working!');
});

app.use('/api/entries', require('./routes/entries'));
app.use('/api', require('./routes/login'));
app.use('/api', require('./routes/register'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
