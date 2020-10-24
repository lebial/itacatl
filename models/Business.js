const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  enabled: Boolean,
  daysNotInService: Array,
  phone: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model('Business', schema);
