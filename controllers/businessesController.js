const asyncHandler = require('../middlewares/async');
const _ = require('lodash');
const { BusinessModel } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

const Business = {
  //@desc      create a business for specific user
  //@route     POST /api/v1/business
  //@access    Private
  create: asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    const business = await BusinessModel.create(req.body);
    return res.status(201).json({
      success: true,
      data: business,
    });
  }),

  //@desc      Get all business
  //@route     GET /api/v1/business
  //@access    Private
  getAll: asyncHandler(async (req, res, next) => {
    const businesses = await BusinessModel.find().populate('user');
    return res.status(200).json({
      success: true,
      data: businesses,
    });
  }),

  //@desc      Get Single Business
  //@route     GET /api/v1/business/:id
  //@access    Private
  getBusiness: asyncHandler(async (req, res, next) => {
    const business = await BusinessModel.findById(req.params.id);
    if (!business) return next(new ErrorResponse(`No business found with the id ${req.params.id}`, 404));
    return res.status(200).json({
      success: true,
      data: business,
    });
  }),

  //@desc      Add Item To Business
  //@route     post /api/v1/business/:id/items
  //@access    Private
  addItem: asyncHandler(async (req, res, next) => {
    const business = await BusinessModel.findById(req.params.id);
    if (!business) return next(new ErrorResponse(`No business found with the id ${req.params.id}`, 404));
    if (business.user.toString() !== req.user.id) return next(new ErrorResponse('You are not the owner of this business', 401));
    const { items } = business;
    const itemsDictionary = _.keyBy(items, 'name');
    if (!_.isEmpty(itemsDictionary[req.body.name])) return next(new ErrorResponse('The item already exists, use update instead', 400));
    business.items = [...items, req.body];
    await business.save();
    return res.status(200).json({
      success: true,
      data: business,
    });
  }),
}

module.exports = Business;
