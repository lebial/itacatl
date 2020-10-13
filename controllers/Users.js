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
      console.log(firstRow);
      const token = Helper.generateToken(firstRow.id_user);
      console.log(token);
      return res.status(201).send({...firstRow, token});
    } catch (err) {
      if (err.routine === '_bt_check_unique') return res.status(400).send({ 'message': 'That email already exists'});
      return res.status(400).send(err);
    }
  },
  async getAll(req, res) {
    const query = 'SELECT * FROM users';
    try {
      const { rows } = await db.query(query, []);
      return res.status(200).send(rows);
    } catch (err) {
      return res.status(400).send(err);
    }
  }
};

module.exports = User;
