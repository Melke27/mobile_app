# MongoDB Schema Design

## `users`

- `_id: ObjectId`
- `name: String`
- `email: String (unique)`
- `passwordHash: String`
- `campus: String`
- `role: String (user|admin)`
- `createdAt: Date`
- `updatedAt: Date`

## `items`

- `_id: ObjectId`
- `status: String (lost|found|recovered)`
- `title: String`
- `description: String`
- `category: String`
- `campus: String`
- `locationText: String`
- `location.latitude: Number`
- `location.longitude: Number`
- `location.accuracy: Number`
- `imageUrl: String`
- `reportedBy: ObjectId -> users._id`
- `flagged: Boolean`
- `flagReason: String`
- `flaggedBy: ObjectId -> users._id`
- `reviewStatus: String (not_reviewed|reviewed_clear|reviewed_keep)`
- `reviewNote: String`
- `reviewedBy: ObjectId -> users._id`
- `reviewedAt: Date`
- `recoveredAt: Date`
- `createdAt: Date`
- `updatedAt: Date`

Indexes:

- text index on `title`, `description`, `category`, `campus`
- compound index on `status`, `campus`, `category`, `createdAt`

## `messages`

- `_id: ObjectId`
- `conversationId: String`
- `itemId: ObjectId -> items._id`
- `senderId: ObjectId -> users._id`
- `receiverId: ObjectId -> users._id`
- `message: String`
- `createdAt: Date`
- `updatedAt: Date`

## `notificationtokens`

- `_id: ObjectId`
- `userId: ObjectId -> users._id`
- `token: String (unique)`
- `platform: String (android|ios|web)`
- `lastSeenAt: Date`
- `createdAt: Date`
- `updatedAt: Date`

## `notifications`

- `_id: ObjectId`
- `userId: ObjectId -> users._id`
- `type: String (match|chat|system|moderation)`
- `title: String`
- `body: String`
- `meta.itemId: ObjectId -> items._id`
- `meta.score: Number`
- `readAt: Date | null`
- `createdAt: Date`
- `updatedAt: Date`
