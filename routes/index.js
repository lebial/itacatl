var express = require('express');
var router = express.Router();
const userController = require('../controllers/Users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res) => {
 userController.login(req, res);
});

module.exports = router;
