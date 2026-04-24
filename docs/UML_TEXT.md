# UML (Text Version)

## Use Case Diagram (Text)

Actors:

- User
- Admin

User Use Cases:

- Register/Login
- Report Lost Item
- Report Found Item
- Search Items
- View Item Details
- Chat With Other User
- Mark Item Recovered
- Flag Suspicious Report
- Generate Ownership Verification Token

Admin Use Cases:

- View Flagged Reports
- Delete Fraudulent/Spam Reports

## Sequence: Report Lost Item

1. User opens report screen.
2. User captures image and GPS location.
3. User submits form.
4. Mobile app sends `POST /api/items` with JWT.
5. API validates token and payload.
6. API stores item in MongoDB.
7. API returns created item.
8. App refreshes feed and caches new list.

## Sequence: Match + Chat

1. User opens item detail.
2. App requests `GET /api/items/:id/matches`.
3. API computes score against opposite-status items.
4. API returns ranked candidates.
5. User starts chat.
6. App sends `POST /api/chat/send`.
7. Message stored in MongoDB and visible in conversation thread.
