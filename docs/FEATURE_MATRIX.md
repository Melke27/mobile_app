# Feature Matrix

## Required vs Implemented

- Register/Login: Implemented
- Report lost item: Implemented
- Report found item: Implemented
- Capture image via camera: Implemented (client hook)
- GPS location tagging: Implemented (client hook)
- Search/filter items: Implemented
- Chat between users: Implemented
- In-app notification center: Implemented
- Push notification pipeline: Device token API implemented, FCM sender worker pending
- Admin moderation: Implemented (review keep/clear + delete)

## Advanced Features Added

- Smart matching score engine: Implemented (server + client fallback)
- Offline cache for report list: Implemented
- Draft auto-save for report form: Implemented
- Multi-campus model support: Implemented
- QR ownership token flow: Implemented
- Admin dashboard stats: Implemented
- Chat auto-refresh polling: Implemented
- Runtime permission handling (camera/location/notifications): Implemented
- Last-seen hint in report flow: Implemented
- Urgency tagging (low/normal/high): Implemented
- Ownership proof hint for safer claim validation: Implemented
- Safe meetup spot field and detail visibility: Implemented
- Optional reward note for lost reports: Implemented
- Duplicate report warning before submit: Implemented
- Item detail safety snapshot (proof/meetup/reward): Implemented
- Safe meetup quick map action: Implemented

## UI/UX Enhancements

- Bottom navigation simplified by removing duplicate entries where top navigation already exists.
- Home feed visuals improved with stronger cards, richer motion, and image transitions.
- Report screen upgraded with guided chips, counters, quality checks, and clearer submit readiness.
- Item detail screen improved with action-priority cards and recovery safety context.

## Mobile Computing Outcomes

- Runtime permission handling integrated for camera, location, and notifications.
- Network-mode flexibility supported (`hosted`, `usb_reverse`, `emulator`, `phone_wifi`).
- Local persistence used for report drafts and saved-item continuity.
- Mobile-safe report workflow improved for low-connectivity and interrupted sessions.
