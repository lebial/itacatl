const express = require('express');
const businessController = require('../controllers/Business');
const auth = require('../middlewares/Auth');
const router = express.Router();

router.get('/:id/items', auth.verifyToken, businessController.getAllItems);
router.post('/', businessController.create);
router.post('/login', businessController.login);
router.post('/:id/items', auth.verifyToken, businessController.addItem);

module.exports = router;