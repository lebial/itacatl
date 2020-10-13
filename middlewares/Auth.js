const { NetworkAuthenticationRequire } = require('http-errors');
const jwt = require('jsonwebtoken');
const db = require('../db');

const Auth = {
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(400).send({ 'message': 'Token not provided' });
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const query = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(query, [decoded.id_user]);
      if (!rows.length) return res.status(400).send({ 'message': 'Token is invalid' });
      req.user = { id: decoded.id_user };
      next();
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

module.exports = { Auth };
