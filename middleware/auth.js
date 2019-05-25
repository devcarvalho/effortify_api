const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // Get header token
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ errors: [{ msg: 'Acesso negado!' }] });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ errors: [{ msg: 'Acesso negado!' }] });
  }
};
