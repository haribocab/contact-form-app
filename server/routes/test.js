const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const authenticateToken = require('../middlewares/auth')

// POST /api/test
router.post('/', authenticateToken, async (req, res) => {
  try {
    const test = new Test({ name: req.body.name });
    const saved = await test.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'save failled' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const data = await Test.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
