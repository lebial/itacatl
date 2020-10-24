const router = require('express').Router();
const auth = require('../middlewares/Auth');
const businessController = require('../controllers/Business');

// Get Businesses
router.get('/', auth.verifyToken, businessController.getAll);

//Create Business
router.post('/', businessController.create);

//Login
router.post('/login', businessController.login);

module.exports = router;