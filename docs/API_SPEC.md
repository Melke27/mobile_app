# API Specification (MongoDB Backend)

Base URL: `/api`

## Auth

### POST `/auth/register`

Request:

```json
{
  "name": "Student Name",
  "email": "student@astu.edu.et",
  "password": "secret123",
  "campus": "Adama Campus"
}
```

Response:

```json
{
  "token": "jwt-token",
  "user": {
    "_id": "...",
    "name": "Student Name",
    "email": "student@astu.edu.et",
    "campus": "Adama Campus",
    "role": "user"
  }
}
```

### POST `/auth/login`

Request:

```json
{
  "email": "student@astu.edu.et",
  "password": "secret123"
}
```

### GET `/auth/me`

Headers: `Authorization: Bearer <token>`

## Items

### GET `/items`

Query params:

- `status` (`lost|found|recovered`)
- `campus`
- `category`
- `urgency` (`low|normal|high`)
- `keyword`
- `dateFrom`
- `dateTo`
- `page`
- `limit`

### POST `/items` (auth required)

Request:

```json
{
  "status": "lost",
  "title": "Black wallet",
  "description": "Contains student ID",
  "category": "ID Card",
  "campus": "Adama Campus",
  "locationText": "Library gate",
  "lastSeenHint": "Today",
  "urgency": "high",
  "proofHint": "Student ID photo inside",
  "safeMeetupSpot": "Campus security office",
  "rewardOffer": "Small thank-you gift",
  "location": { "latitude": 8.55, "longitude": 39.27 },
  "imageUrl": "file://..."
}
```

### GET `/items/:id`

Get single item with reporter details.

### GET `/items/:id/matches` (auth required)

Returns potential matching reports with confidence score.

### PATCH `/items/:id/recovered` (auth required)

Reporter/admin can mark item as recovered.

### PATCH `/items/:id/flag` (auth required)

Request:

```json
{
  "reason": "Suspicious post"
}
```

### GET `/items/flagged/list` (admin only)

### GET `/items/admin/stats` (admin only)

Returns moderation and platform counters:

- total users
- total reports
- lost/found/recovered counts
- flagged count
- today reports

### PATCH `/items/:id/review` (admin only)

Request:

```json
{
  "action": "clear",
  "note": "False alarm"
}
```

### DELETE `/items/:id` (admin only)

## Chat

### GET `/chat/:itemId/:otherUserId` (auth required)

Load conversation for specific item.

### POST `/chat/send` (auth required)

Request:

```json
{
  "itemId": "...",
  "receiverId": "...",
  "message": "I found your ID card"
}
```

## Notifications

### POST `/notifications/token` (auth required)

Request:

```json
{
  "token": "fcm-device-token",
  "platform": "android"
}
```

### GET `/notifications/mine` (auth required)

Query params:

- `page`
- `limit`
- `onlyUnread` (`true|false`)

### PATCH `/notifications/:id/read` (auth required)

Marks one notification as read.

### PATCH `/notifications/read-all` (auth required)

Marks all unread notifications as read for the current user.
