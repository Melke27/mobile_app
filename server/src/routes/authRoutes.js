const express = require('express');
const {
  register,
  login,
  me,
  updateProfile,
  updatePassword,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.put('/profile', requireAuth, updateProfile);
router.put('/password', requireAuth, updatePassword);

module.exports = router;
