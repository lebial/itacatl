const moment = require('moment');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const Auth = {
  protect: asyncHandler(async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    }
    if (!token) return next(new ErrorResponse('Not authorized to access this route', 401));
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = User.findById(decoded.id);
      next();
    } catch (error) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  }),
  authorize: (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`The user ${req.user.id} is not authorized to access this route`, 401));
    }
    next();
  }
}

module.exports = Auth;
