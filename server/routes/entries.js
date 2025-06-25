const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const authenticateToken = require('../middlewares/auth')

// POST /api/entries
router.post('/', authenticateToken, async (req, res) => {
  try {
    const entry = new Entry({ content: req.body.content, author: req.user.userid });
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'save failled' });
  }
});

// GET  /api/entries 
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
    // 削除成功
    res.json({ message: 'Entry deleted', entry: deleted });
  } catch (err) {
    console.error(err);
    // ObjectId 形式のエラー(CastError)などもここに入る
    res.status(500).json({ error: 'Delete failed' });
  }
});

// GET  /api/entry
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Entry.findById(id).populate('author', 'username');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
