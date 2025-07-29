const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const authenticateToken = require('../middlewares/auth');

module.exports = (io) => {
  // POST /api/entries
  router.post('/', authenticateToken, async (req, res) => {
    try {
      const newEntry = new Entry({ content: req.body.content, author: req.user.userid });
      const saved = await newEntry.save();

      // 新しいエントリが追加されたことをSocket.IOで通知
      io.emit('newEntry', saved);

      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: 'save failed' });
    }
  });

  // GET /api/entries
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const data = await Entry.find().populate('author', 'username').sort({ createdAt: -1 });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // DELETE /api/entries/:id
  router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await Entry.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      res.json({ message: 'Entry deleted', entry: deleted });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Delete failed' });
    }
  });

  // GET /api/entries/:id
  router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const data = await Entry.findById(id).populate('author', 'username');
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};
