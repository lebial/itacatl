const express = require('express');
const { UsersController } = require('../controllers');
const auth = require('../middlewares/Auth');
const router = express.Router();

/* GET users listing. */
router.get('/', UsersController.getAll);

// Create user
router.post('/', UsersController.create);

module.exports = router;
