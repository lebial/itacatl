const moment = require('moment');
const _ = require('lodash');
const { BusinessModel } = require('../models');

const Business = {
  async create(req, res) {
    const { name, enabled = true, daysNotInService, phone, password } = req.body;
    if (!phone || !password) return res.status(400).send({ 'message': 'Phone or password are empty'});
    try {
      const business = new BusinessModel({
        name, 
        enabled,
        daysNotInService,
        phone,
        password: hashedPassword,
      })
      await business.save();
      return res.status(201).send({ business, token });
    } catch (error) {
      if (error.code === 11000) return res.status(400).send({error: 'Phone number already registered'});
      return res.status(400).send({error});
    }
  },
  async getAll(req, res) {
    const businesses = await BusinessModel.find();
    return res.status(200).send(businesses);
  },
}

module.exports = Business;
