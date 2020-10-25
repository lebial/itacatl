const _ = require('lodash');
const Helper = require('./Helper');
const { DriverModel } = require('../models');
const { create } = require('lodash');
const { getAll } = require('./businessesController');

const validateDriverData = ({
  firstName,
  lastName,
  licenceNumber,
  vehiclePlate,
  phone,
  password
}) => {
  const errors = {};
  if (!firstName) errors.firstName = 'driver name not provided';
  if (!lastName) errors.lastName = 'driver last name not provided';
  if (!licenceNumber) errors.licenceNumber = 'licence number not provided';
  if (!vehiclePlate) errors.vehiclePlate = 'vehicule plate not provided';
  if (!password) errors.password = 'password not provided';
  if (!phone) errors.phone = 'phone number not provided';
  return errors;
}
const Driver = {
  async create(req, res) {
    const { firstName, lastName, licenceNumber, vehiclePlate, password, phone } = req.body;
    const errors =  validateDriverData({ firstName, lastName, licenceNumber, vehiclePlate, password, phone });
    if (!_.isEmpty(errors)) res.status(400).send({ errors });
    const hashedPassword = Helper.hashPassword(password);
    try {
      const driver = new DriverModel({
        firstName,
        lastName,
        licenceNumber,
        vehiclePlate,
        password: hashedPassword,
        phone,
      });
      await driver.save();
      const token = Helper.generateToken(driver.id);
      res.status(201).send({ driver, token });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  },
  async getAll(req, res) {
    try {
      const drivers = await DriverModel.find();
      res.status(200).send({ drivers });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }
}

module.exports = Driver;
