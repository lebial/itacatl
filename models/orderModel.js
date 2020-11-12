const mongoose = require('mongoose');
const { ItemsSchema } = require('../models/businessModel');

const OrderSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: ['Forgot to add user', true],
  },
  status: {
    type: String,
    enum: ['new', 'inProgress', 'inTransit', 'delivered'],
    default: 'new',
  },
  driver: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: ['forgot to add business', true],
  },
  items: [ItemsSchema],
  total: Number,
});

module.exports = mongoose.model('Order', OrderSchema);
