const moment = require('moment');
const jwt = require('jsonwebtoken');

const Auth = {
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(400).send({ 'message': 'Not logged in' });
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
<<<<<<< HEAD
      let query = '';
      query = 'SELECT id_user FROM users WHERE id_user = $1;';
      if (req.baseUrl.includes('business')) query = 'SELECT id_business FROM business WHERE id_business = $1;';
      const { userId } = decoded;
      const { rows } = await db.query(query, [userId]);
      if (!rows.length) return res.status(400).send({ 'message': 'Token is invalid' });
      req.user = { userId };
=======
      if (decoded.exp < moment().unix()) return res.status(400).send({ 'message': 'Token is invalid' });
      req.user = decoded;
>>>>>>> changing postgres for mongo and mongoose
      next();
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

module.exports = Auth;
