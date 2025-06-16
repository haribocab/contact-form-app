const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'ユーザー名とパスワードは必須です' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: 'ユーザーが見つかりません' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'パスワードが間違っています' });
  }

  // 成功
  res.json({ message: 'ログイン成功', user: user.username });
});


module.exports = router;
