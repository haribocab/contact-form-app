const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // React の URL
  methods: ['GET', 'POST'],        // 必要に応じて追加
  credentials: true                // Cookie を使う場合のみ必要
}));

app.use(express.json());

// MongoDB setup (insert your connection string here)
mongoose.connect('mongodb+srv://harukalange:63Q07S9DoVuQ7lP8@cluster0.7ege2ig.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Basic test route
app.get('/', (req, res) => {
  res.send('API is working!');
});

app.use('/api/test', require('./routes/test'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
