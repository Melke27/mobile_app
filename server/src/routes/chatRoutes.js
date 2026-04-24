const express = require('express');
const { listConversation, sendMessage } = require('../controllers/chatController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/:itemId/:otherUserId', requireAuth, listConversation);
router.post('/send', requireAuth, sendMessage);

module.exports = router;
