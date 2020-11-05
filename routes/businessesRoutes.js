const router = require('express').Router();
const { protect, authorize } = require('../middlewares/Auth');
const { BusinessController } = require('../controllers');

router.route('/')
  .get(BusinessController.getAll)
  .post(protect, authorize('owner', 'admin'), BusinessController.create);

router.route('/:id/items')
  .post(protect, authorize('owner', 'admin'), BusinessController.addItem)

module.exports = router;
