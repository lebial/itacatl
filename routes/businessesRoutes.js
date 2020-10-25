const router = require('express').Router();
const auth = require('../middlewares/Auth');
const { BusinessController } = require('../controllers');

// Get Businesses
router.get('/', auth.verifyToken, BusinessController.getAll);

//Create Business
router.post('/', BusinessController.create);

//Login
router.post('/login', BusinessController.login);

module.exports = router;