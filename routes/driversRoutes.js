const router = require('express').Router();
const Driver = require('../controllers/driversController');
const auth = require('../middlewares/Auth');

// Create driver
// router.post('/', Driver.create);

// Get Drivers
// router.get('/', Driver.getAll);

module.exports = router;
