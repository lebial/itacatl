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
  //@route     POST /api/v1/business/:id/items
  //@access    Private
  addItem: asyncHandler(async (req, res, next) => {
    const business = await BusinessModel.findById(req.params.id);
    if (!business) return next(new ErrorResponse(`No business found with the id ${req.params.id}`, 404));
    business.validateOwnership(req.user.id, next);
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

  //@desc      Edit Item from specific business
  //@route     PUT /api/v1/business/:id/items/:itemId
  //@access    Private
  editItem: asyncHandler(async (req, res, next) => {
    const business = await BusinessModel.findById(req.params.id);
    if (!business) return next(new ErrorResponse('No business found with the specified id', 404));
    business.validateOwnership(req.user.id, next);
    const { items } = business;
    const itemsDictionary = _.keyBy(items, '_id');
    const itemToUpdate = itemsDictionary[req.params.itemId];
    if (_.isEmpty(itemToUpdate)) {
      return next(new ErrorResponse('The item do not exist, create it instead', 404));
    }
    const updatedItem = { ...itemToUpdate._doc, ...req.body };
    business.items = Object.values({
      ...itemsDictionary,
      [updatedItem._id.toString()]: updatedItem,
    });
    await business.save();
    return res.status(200).json({
      success: true,
      data: business,
    });
  }),

  //@desc      Delete Item from specific business
  //@route     DELETE /api/v1/business/:id/items/:itemId
  //@access    Private
  deleteItem: asyncHandler(async (req, res, next) => {
    const business = await BusinessModel.findById(req.params.id);
    if (!business) return next(new ErrorResponse('No business found with the specified id', 404));
    business.validateOwnership(req.user.id, next);
    const { items } = business;
    const itemsDictionary = _.keyBy(items, '_id');
    const { [req.params.itemId]: itemToDelete, ...restItems } = itemsDictionary;
    if (_.isEmpty(itemToDelete)) {
      return next(new ErrorResponse('The item does not exists', 404));
    }
    business.items = Object.values(restItems);
    await business.save();
    return res.status(200).json({
      success: true,
      data: {},
    });
  }),
}

module.exports = Business;
