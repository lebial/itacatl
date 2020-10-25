const moment = require('moment');
const _ = require('lodash');
const db = require('../db');
const Helper = require('./Helper');
const { UserModel } = require('../models');

const User = {
  async create(req, res) {
    const { email, password, userName, lastName, phone } = req.body;
    if (!email || !password) return res.status(400).send({ 'message': 'Some values are missing' });
    if (!Helper.isEmailValid(email)) res.status(400).send({ 'message': 'Some values are missing' });
    const hashedPassword = Helper.hashPassword(password);
    try {
      const user = new UserModel({
        userName,
        lastName,
        email,
        password: hashedPassword,
        phone,
      });
      await user.save();
      const token = Helper.generateToken(user.id);
      return res.status(201).send({user, token});
    } catch (err) {
      if (err.code === 11000) return res.status(400).send({ 'message': 'That email already exists'});
      console.log(err);
      return res.status(400).send(err);
    }
  },
  async getAll(req, res) {
    try {
      const  users  = await UserModel.find();
      return res.status(200).send(users);
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({'message': 'Some values are missing'});
    if (!Helper.isEmailValid(email)) 
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    try {
      const users = await UserModel.find({ email });
      const [ user ] = users;
      if (_.isEmpty(user)) {
        return res.status(400).send({'message': 'The credentials you provided are incorrect'});
      }
      if(!Helper.comparePassword(user.password, password)) {
        return res.status(400).send({ 'message': 'The credentials you provided are incorrect' });
      }
      const token = Helper.generateToken(user.id);
      return res.status(200).send({ token });
    } catch(error) {
      console.log(error);
      return res.status(400).send(error)
    }
  }
};

module.exports = User;
