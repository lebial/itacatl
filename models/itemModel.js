const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'business',
    required: true,
  },
});

module.exports = mongoose.model('Item', schema);
