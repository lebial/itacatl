const { ProxyAuthenticationRequired } = require("http-errors");
const { Pool } = require("pg");

const advancedResults = (model, populate) => (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };
  const removeField = ['select', 'sort', 'page', 'limit'];
  removeField.forEach(param => delete reqQuery[param]);
  let queryString = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  query = model.find(JSON.parse(queryString));

  // Select
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  if (populate) query = query.populate(populate);
  query = query.skip(startIndex).limit(limit);

  const results = await query;

  const pagination = {};
  if (endIndex < total) pagination.next = {
    page: page + 1,
    limit,
  };

  if (startIndex > 0) pagination.prev = {
    page: page - 1,
    limit,
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
}

module.exports = advancedResults;
