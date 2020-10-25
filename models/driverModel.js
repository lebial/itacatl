const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  licenceNumber: String,
  vehiclePlate: String,
  phone: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model('Driver', schema);