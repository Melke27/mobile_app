const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const NotificationToken = require('../models/NotificationToken');

const registerToken = async (req, res, next) => {
  try {
    const { token, platform } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required.' });
    }

    const record = await NotificationToken.findOneAndUpdate(
      { token },
      {
        userId: req.user._id,
        token,
        platform: platform || 'android',
        lastSeenAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({ token: record });
  } catch (error) {
    return next(error);
  }
};

const listMine = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);

    const filter = { userId: req.user._id };
    if (req.query.onlyUnread === 'true') {
      filter.readAt = null;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: req.user._id, readAt: null }),
    ]);

    return res.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid notification id.' });
    }

    const notification = await Notification.findOne({ _id: id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    notification.readAt = notification.readAt || new Date();
    await notification.save();

    return res.json({ notification });
  } catch (error) {
    return next(error);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, readAt: null },
      { $set: { readAt: new Date() } }
    );

    return res.json({ updated: result.modifiedCount || 0 });
  } catch (error) {
    return next(error);
  }
};

module.exports = { registerToken, listMine, markRead, markAllRead };
