const asyncHandler = require('../middlewares/async');
const { OrderModel } = require('../models');

const Order = {
  //@desc      user creates an order from business
  //@route     POST /api/v1/orders
  //@access    Private
  create: asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    const order = await OrderModel.create(req.body);
    return res.status(201).json({
      success: true,
      data: order,
    });
  }),
};

module.exports = Order;
