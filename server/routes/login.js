const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'User name and password are required.' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: 'The user is not found.' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Password failed.' });
  }

  const token = jwt.sign(
    { userid: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }  // トークンの有効期限（1時間）
  );

  res.json({ message: 'Successful login!', user: user.username, token: token });
});


module.exports = router;
