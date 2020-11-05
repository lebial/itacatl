const mongoose = require('mongoose');

const ItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ['please enter an item name', true],
    unique: true,
  },
  price: {
    type: Number,
    required: ['please enter a price', true],
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    required: ['Please enter a description for the item', true],
  },
});

const BussinesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  enabled: {
    type:Boolean,
    default: true,
  },
  daysNotInService: [{
    type: String,
    enum: ['lun', 'mar', 'mier', 'jue', 'vier', 'sab', 'dom'],
  }],
  phone: {
    type: String,
    required: ['Please add a phone number', true],
    minlength: 10,
    maxlength: 10,
    unique: true,
  },
  items: [ItemsSchema],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('Business', BussinesSchema);
