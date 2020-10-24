<<<<<<< HEAD
const _ = require('lodash');
const moment = require('moment');
const db = require('../db');
const Helper = require('./Helper');

const validateCreateItemValues = ({ price, description, id, name }) => {
  const errors = {};
  if (!price) errors.price = 'price is missing';
  if (!description) errors.description = 'description is missing';
  if (!id) errors.id = 'business id is missing';
  if (!name) errors.businessId = 'name is missing';
  return errors;
};

const Business = {
  async create(req, res) {
    const {
      businessName,
      enabled,
      daysNotInService,
      location,
      phone,
      password
    } = req.body;
    if (!phone || !password) return res.status(400).send({ 'message': 'phome or password not provided'});
    const hashedPassword = Helper.hashPassword(password);
    const query = `INSERT INTO
      business(name, enabled, days_not_in_service, location, phone, password, created_on)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *;
    `;
    const values = [
      businessName,
      enabled,
      daysNotInService || [],
      location,
      phone,
      hashedPassword,
      moment(new Date())
    ];

    try {
      const { rows: businesses } = await db.query(query, values);
      const [business] = businesses;
      const token = Helper.generateToken(business.id_user);
      return res.status(201).send({ ...business, token });
    } catch (err) {
      if (err.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'business already registeres'});
      } 
      console.log(err);
      return res.status(400).send({ 'error': err });
    }
  },
  async login(req, res) {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).send({ 'message': 'Phone number or password is missing' });
    const query = ` SELECT id_business, enabled, days_not_in_service, location, password FROM business WHERE phone = $1;`;
    try {
      const { rows: businesses } = await db.query(query, [phone]);
      const [business] = businesses;
      const { password: businessPassword, ...rest } = business;
      if (!business) return res.status(400).send({ 'message': 'The credentials are incorrect' });
      if (!Helper.comparePassword(businessPassword, password)) {
        return res.status(400).send({ 'message': 'The credentials are incorrect' });
      }
      const token = Helper.generateToken(business.id_business);
      return res.status(200).send({ data: rest, token });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error });
    }
  },
  async addItem(req, res) {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const errors = validateCreateItemValues({ id, name, price, description });
    if (Object.keys(errors).lenght) {
      return res.status(400).send({ errors });
    }
    const query = `INSERT INTO
      items(id_business, name, price, description)
      VALUES($1, $2, $3, $4)
      returning *;
    `;
    const values = [
      id,
      name,
      price,
      description,
    ];
    try {
      const { rows: items } = await db.query(query, values);
      const [item] = items;
      return res.status(201).send({ item });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error });
    }
  },
  async getAllItems(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM items where id_business = $1';
    try {
      const { rows: items } = await db.query(query, [id]);
      res.status(200).send({ items });
    } catch (error) {
      console.log({ error });
      res.status(400).send({ error });
    }
  }
};

module.exports = Business;
=======
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
>>>>>>> changing postgres for mongo and mongoose
