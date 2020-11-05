const moment = require('moment');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const _ = require('lodash');
const { UserModel } = require('../models');

const User = {
  create: asyncHandler(async (req, res, next) => {
    const {
      email,
      password,
    } = req.body;
    if (!email || !password) return next(new ErrorResponse('Some values are missing'), 400);
    const user = await UserModel.create(req.body);
    return res.status(201).send({
      success: true,
      data: user,
    });
    }
  ),
  getAll: asyncHandler(async (req, res) => {
      const  users  = await UserModel.find();
      return res.status(200).send(users);
  }),
};

module.exports = User;
