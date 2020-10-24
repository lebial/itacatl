const express = require('express');
const usersController = require('../controllers/Users');
const auth = require('../middlewares/Auth');
const router = express.Router();

/* GET users listing. */
router.get('/', auth.verifyToken, usersController.getAll);

// Create user
router.post('/', usersController.create);

module.exports = router;
