const router = require('express').Router();
const { protect, authorize } = require('../middlewares/Auth');
const { BusinessController } = require('../controllers');

router.route('/')
  .get(BusinessController.getAll)
  .post(protect, authorize('owner', 'admin'), BusinessController.create);

router.route('/:id/items')
  .post(protect, authorize('owner', 'admin'), BusinessController.addItem);

router.route('/:id/items/:itemId')
  .put(protect, authorize('owner', 'admin'), BusinessController.editItem)
  .delete(protect, authorize('owner', 'admin'), BusinessController.deleteItem);

module.exports = router;
