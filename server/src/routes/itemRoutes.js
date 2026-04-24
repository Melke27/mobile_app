const express = require('express');
const {
  createItem,
  listItems,
  getItemById,
  markRecovered,
  flagItem,
  getFlaggedItems,
  reviewFlaggedItem,
  deleteItem,
  getPotentialMatches,
  getAdminStats,
} = require('../controllers/itemController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', listItems);
router.get('/flagged/list', requireAuth, requireAdmin, getFlaggedItems);
router.get('/admin/stats', requireAuth, requireAdmin, getAdminStats);
router.get('/:id/matches', requireAuth, getPotentialMatches);
router.get('/:id', getItemById);
router.post('/', requireAuth, createItem);
router.patch('/:id/recovered', requireAuth, markRecovered);
router.patch('/:id/flag', requireAuth, flagItem);
router.patch('/:id/review', requireAuth, requireAdmin, reviewFlaggedItem);
router.delete('/:id', requireAuth, requireAdmin, deleteItem);

module.exports = router;
