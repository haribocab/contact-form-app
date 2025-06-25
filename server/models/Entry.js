const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  message: String,
  author: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Entry', entrySchema);