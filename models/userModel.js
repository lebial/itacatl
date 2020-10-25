const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
});

module.exports = mongoose.model('User', schema);

