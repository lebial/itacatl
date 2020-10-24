const moment = require('moment');
const _ = require('lodash');
const Helper = require('./Helper');
const BusinessModel = require('../models/Business');

const Business = {
  async create(req, res) {
    const { name, enabled = true, daysNotInService, phone, password } = req.body;
    if (!phone || !password) return res.status(400).send({ 'message': 'Phone or password are empty'});
    const hashedPassword = Helper.hashPassword(password);
    try {
      const business = new BusinessModel({
        name, 
        enabled,
        daysNotInService,
        phone,
        password: hashedPassword,
      })
      await business.save();
      const token = Helper.generateToken(business.id);
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
  
  async login(req, res) {
    const { phone, password } = req.body;
    if (!phone || !password) res.status(400).send({ message: 'There is a missing credential' });
    try {
      const businesses = await BusinessModel.find({ phone });
      const [business] = businesses;
      if (_.isEmpty(business)) return res.status(500).send({error: 'The user does not exists'});
      if (!Helper.comparePassword(business.password, password)) {
        return res.status(500).send({ error: 'Credentials does not match'});
      }
      const token = Helper.generateToken(business.id);
      return res.status(200).send({ token }); 
    } catch (error) {
      return res.status(400).send({error});
    }
    
  }
}

module.exports = Business;
