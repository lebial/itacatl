const moment = require('moment');
const jwt = require('jsonwebtoken');

const Auth = {
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(400).send({ 'message': 'Not logged in' });
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      if (decoded.exp < moment().unix()) return res.status(400).send({ 'message': 'Token is invalid' });
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

module.exports = Auth;
