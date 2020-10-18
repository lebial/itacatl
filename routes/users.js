var express = require('express');
const usersController = require('../controllers/Users');
const auth = require('../middlewares/Auth');
var router = express.Router();

/* GET users listing. */
router.get('/', auth.verifyToken, usersController.getAll);

router.post('/', (req, res) => {
  usersController.create(req, res);
})

module.exports = router;
