const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['match', 'chat', 'system', 'moderation'],
      default: 'system',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    body: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    meta: {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },
      score: { type: Number, default: null },
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
