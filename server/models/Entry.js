const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // ← これで User コレクションと接続される
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Entry', entrySchema);