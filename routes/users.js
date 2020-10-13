var express = require('express');
const usersController = require('../controllers/Users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  usersController.getAll(req, res);
});

router.post('/', (req, res) => {
  usersController.create(req, res);
})

module.exports = router;
