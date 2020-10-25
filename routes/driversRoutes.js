const router = require('express').Router();
const { DriversController } = require('../controllers');
const Driver = require('../controllers/driversController');
const auth = require('../middlewares/Auth');

// Create driver
router.post('/', auth.verifyToken, Driver.create);

// Get Drivers
router.get('/', auth.verifyToken, Driver.getAll);

module.exports = router;
