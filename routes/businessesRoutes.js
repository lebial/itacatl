const router = require('express').Router();
const {protect} = require('../middlewares/Auth');
const { BusinessController } = require('../controllers');

// Get Businesses
// router.get('/', protect, BusinessController.getAll);

//Create Business
// router.post('/', BusinessController.create);

module.exports = router;
