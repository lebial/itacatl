const jwt = require('jsonwebtoken');
const db = require('../db');

const Auth = {
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(400).send({ 'message': 'Not logged in' });
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const { userId } = decoded;
      const query = 'SELECT id_user FROM users WHERE id_user = $1';
      const { rows } = await db.query(query, [userId]);
      if (!rows.length) return res.status(400).send({ 'message': 'Token is invalid' });
      req.user = { userId };
      next();
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

module.exports = Auth;
