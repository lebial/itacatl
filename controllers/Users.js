const moment = require('moment');
const _ = require('lodash');
const db = require('../db');
const Helper = require('./Helper');

const User = {
  async create(req, res) {
    const { email, password, userName, lastName, phone } = req.body;
    if (!email || !password) return res.status(400).send({ 'message': 'Some values are missing' });
    if (!Helper.isEmailValid(email)) res.status(400).send({ 'message': 'Some values are missing' });
    const hashedPassword = Helper.hashPassword(password);
    const query = `INSERT INTO 
      users(name, last_name, email, phone, created_on, password)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *
    `;
    const values = [
      userName,
      lastName,
      email,
      phone,
      moment(new Date()),
      hashedPassword
    ];
    try {
      const { rows } = await db.query(query, values);
      const [ firstRow ] = rows;
      const token = Helper.generateToken(firstRow.id_user);
      return res.status(201).send({...firstRow, token});
    } catch (err) {
      if (err.routine === '_bt_check_unique') return res.status(400).send({ 'message': 'That email already exists'});
      console.log(err);
      return res.status(400).send(err);
    }
  },
  async getAll(req, res) {
    const query = 'SELECT id_user, name, last_name, email FROM users';
    try {
      const { rows } = await db.query(query, []);
      return res.status(200).send(rows);
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({'message': 'Some values are missing'});
    if (!Helper.isEmailValid(email)) 
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows: users } = await db.query(text, [email]);
      const [user] = users;
      if (!user) {
        return res.status(400).send({'message': 'The credentials you provided are incorrect'});
      }
      if(!Helper.comparePassword(user.password, password)) {
        return res.status(400).send({ 'message': 'The credentials you provided are incorrect' });
      }
      const token = Helper.generateToken(user.id_user);
      return res.status(200).send({ token });
    } catch(error) {
      console.log(error);
      return res.status(400).send(error)
    }
  }
};

module.exports = User;
