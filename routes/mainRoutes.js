var express = require('express');
var router = express.Router();
const { UsersController } = require('../controllers');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res) => {
 UsersController.login(req, res);
});

module.exports = router;
