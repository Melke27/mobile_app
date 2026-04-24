const mongoose = require('mongoose');
const Message = require('../models/Message');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

const composeConversationId = (a, b, itemId) => [a, b].sort().join('_') + `_${itemId}`;

const listConversation = async (req, res, next) => {
  try {
    const { itemId, otherUserId } = req.params;

    if (!mongoose.isValidObjectId(itemId) || !mongoose.isValidObjectId(otherUserId)) {
      return res.status(400).json({ message: 'Invalid parameters.' });
    }

    const conversationId = composeConversationId(req.user._id.toString(), otherUserId, itemId);
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    return res.json({ messages, conversationId });
  } catch (error) {
    return next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { itemId, receiverId, message } = req.body;

    if (!itemId || !receiverId || !message?.trim()) {
      return res.status(400).json({ message: 'itemId, receiverId, and message are required.' });
    }

    if (!mongoose.isValidObjectId(itemId) || !mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({ message: 'Invalid id format.' });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send message to yourself.' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Referenced item not found.' });
    }

    const conversationId = composeConversationId(req.user._id.toString(), receiverId, itemId);

    const created = await Message.create({
      conversationId,
      itemId,
      senderId: req.user._id,
      receiverId,
      message: message.trim(),
    });

    Notification.create({
      userId: receiverId,
      type: 'chat',
      title: 'New chat message',
      body: `You have a new message about ${item.title}.`,
      meta: { itemId: item._id },
    }).catch(() => undefined);

    return res.status(201).json({ message: created, conversationId });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listConversation, sendMessage, composeConversationId };
