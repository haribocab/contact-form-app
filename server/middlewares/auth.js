const jwt = require('jsonwebtoken');

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer xxx"

  if (!token) {
    return res.status(401).json({ error: 'No token available.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });

    req.user = user;
    next();
  });
};
