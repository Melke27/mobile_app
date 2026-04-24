const express = require('express');
const {
  registerToken,
  listMine,
  markRead,
  markAllRead,
} = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/token', requireAuth, registerToken);
router.get('/mine', requireAuth, listMine);
router.patch('/read-all', requireAuth, markAllRead);
router.patch('/:id/read', requireAuth, markRead);

module.exports = router;
