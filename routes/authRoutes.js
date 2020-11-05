const router = require('express').Router();
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
} = require('../controllers/authController')();

const { protect } = require('../middlewares/Auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);

module.exports = router;
