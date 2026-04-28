# Campus Lost & Found (Mobile + API)

React Native mobile app with Node.js/Express API and MongoDB.

This project helps students and staff report lost/found items, search reports, chat, and recover items faster.

## Tech Stack

- Mobile: React Native (`0.74.5`)
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT

## Core Features

- Register/Login
- Lost and found report creation (photo + location)
- Search and filters
- Item details + potential matches
- Chat between users
- Save/bookmark reports locally
- Notification center (in-app)
- Admin moderation and dashboard
- Ownership verification token

## Prerequisites

- Node.js 18+
- npm
- Android Studio + SDK
- ADB (for physical phone install)
- MongoDB Atlas (or local MongoDB)

## Quick Start

### 1) Install dependencies

```bash
npm install --legacy-peer-deps
npm --prefix server install
```

### 2) Configure backend

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

- `MONGODB_URI`
- `JWT_SECRET`

Start backend:

```bash
npm run server:dev
```

Health check:

- `http://localhost:5000/api/health`
- Confirm `authConfigured: true`

### 3) Configure mobile API base URL

Edit `src/config/env.js`.

Default repo config already uses hosted mode:

- `DEV_BACKEND_MODE = 'hosted'`
- `HOSTED_API_BASE_URL = 'https://mobile-app-ff7d.onrender.com/api'`

## Run the Mobile App

### Recommended: standalone release mode (no Metro required)

```bash
npm run android
```

This runs Android in release mode and behaves like a real installed app.

### Debug mode (Metro + hot reload)

```bash
npm start
# in another terminal
npm run android:dev
```

### Physical phone debug via USB

```bash
# terminal 1
npm start
# terminal 2
npm run android:usb
```

If multiple devices are connected:

```bash
ANDROID_SERIAL=<device-id> npm run android:usb:device
```

## Build and Install APK

```bash
npm run apk:debug
npm run apk:release
npm run install:phone:debug
npm run install:phone
```

APK output paths:

- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## Useful Scripts

- `npm run start` - Start Metro
- `npm run start:reset` - Start Metro with cache reset
- `npm run android` - Run Android release build
- `npm run android:dev` - Run Android debug build
- `npm run server:dev` - Start backend in dev mode
- `npm run server:start` - Start backend in normal mode
- `npm run dev:all` - Start backend + Metro together
- `npm run apk:release` - Build release APK
- `npm run install:phone` - Install release APK to connected device

## Troubleshooting

### "Unable to load script" (red screen)

You are running a debug build without Metro.

Fix:

```bash
npm start
adb reverse tcp:8081 tcp:8081
```

Or install standalone release build:

```bash
npm run apk:release
npm run install:phone
```

### `adb: more than one device/emulator`

```bash
ANDROID_SERIAL=<device-id> npm run android:usb:device
```

### App cannot reach backend

- Check `server/.env` values
- Check backend health endpoint
- Check `src/config/env.js` mode and URL

### First account admin role

For demo/setup convenience, the first registered account becomes `admin`.

## Project Structure

```text
.
├── App.js
├── src/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   └── utils/
├── server/
│   ├── src/
│   └── .env.example
└── docs/
```

## Documentation Index

- [Product Documentation](docs/PRODUCT_DOCUMENTATION.md)
- [Screen Gallery](docs/SCREEN_GALLERY.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [API Specification](docs/API_SPEC.md)
- [MongoDB Schema](docs/MONGODB_SCHEMA.md)
- [Feature Matrix](docs/FEATURE_MATRIX.md)
- [Test Plan](docs/TEST_PLAN.md)
- [UML Text](docs/UML_TEXT.md)
- [Submission Checklist](docs/SUBMISSION_CHECKLIST.md)

## Screenshot Assets Path

All documentation screenshots are stored in:

- `docs/doc_image/`
