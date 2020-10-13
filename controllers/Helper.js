const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');

const Helper = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },
  comparePassword(hashedPassword, password) {
    return bcrypt.compareSync(password, hashedPassword);
  },
  isEmailValid(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  generateToken(id) {
    const token = jwt.sign({ userId: id }, process.env.SECRET, { expiresIn: '7d'});
    return token;
  }
}

module.exports = Helper;
