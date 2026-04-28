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

## Architecture Overview

- Mobile UI layer: React Native screens and reusable components
- State layer: `AuthContext`, `ItemsContext`, and `ThemeContext`
- Service layer: API/device helpers in `src/services`
- Backend API: Express controllers and routes
- Data layer: MongoDB models

Flow: `Screen Action -> Context/Service -> API Client -> Express Controller -> MongoDB -> Response -> UI Update`

## Mobile Computing Project Notes

- This project is designed for mobile-first constraints: unstable networks, runtime permissions, and device-resource limits.
- The app uses local persistence for draft/saved continuity and API synchronization for real-time updates.
- UX flow prioritizes short actions, clear feedback, and safe recovery handoff behavior.

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

All image paths:

- `docs/doc_image/account.jpg`
- `docs/doc_image/alerts.jpg`
- `docs/doc_image/darkmode_account.jpg`
- `docs/doc_image/found-items-search.jpg`
- `docs/doc_image/home_page.jpg`
- `docs/doc_image/home_page1.jpg`
- `docs/doc_image/login.jpg`
- `docs/doc_image/lost-found-form.jpg`
- `docs/doc_image/lost_form.jpg`
- `docs/doc_image/report_item.jpg`

## Main Screenshot Preview

### Home

The Home screen is the discovery hub. Users see recent lost/found reports, quick actions, and visual highlights for faster browsing.

![Home Screen](docs/doc_image/home_page.jpg)
Display Note: This primary home display highlights mobile-first feed scanning, allowing users to identify item type, urgency, and relevance quickly with minimal taps. It is designed to reduce cognitive load so users can move from browsing to action without unnecessary navigation steps.
![Home Screen Variant](docs/doc_image/home_page1.jpg)
Display Note: This alternate home variation demonstrates continuous, image-led browsing behavior that helps users stay engaged while comparing multiple item cards. The layout supports rapid visual comparison, which is important when students are trying to match small item details quickly.

### Login

The Login screen provides secure access to reporting, chat, saved items, and recovery actions for authenticated users.

![Login Screen](docs/doc_image/login.jpg)
Display Note: This login display represents the secure gateway into protected workflows, including reporting, messaging, saved items, and verification tools. It communicates trust and access control clearly, so users understand why authentication is required before sensitive actions.

### Reports

The Report flow helps users submit complete and trusted reports using structured fields, location details, and image attachment.

![Report Item Screen](docs/doc_image/report_item.jpg)
Display Note: This reporting display shows the structured composer used to improve data quality through guided inputs, validation checks, and clearer submission readiness. The form structure is intentionally progressive, helping users submit complete reports without feeling overwhelmed.
![Lost Form](docs/doc_image/lost_form.jpg)
Display Note: This lost-item form display emphasizes safer recovery through ownership-proof hints, urgency selection, and explicit meetup guidance metadata. It encourages reliable claim validation and reduces risky handoff behavior by capturing safety-oriented context up front.
![Lost and Found Form](docs/doc_image/lost-found-form.jpg)
Display Note: This unified template display demonstrates how one form supports both lost and found cases while dynamically adapting field intent by status. This approach keeps the experience consistent while still preserving scenario-specific instructions and submission quality.

### Search

The Search and found-items view supports quick filtering and matching to reduce recovery time.

![Found Items Or Search](docs/doc_image/found-items-search.jpg)
Display Note: This search display is optimized for fast match discovery using filter narrowing, keyword relevance, and quick-access result scanning. It is especially useful in high-volume periods where users need to triage many reports with limited time.

### Account

The Account area manages user profile, preferences, and personal activity context, including dark-mode experience.

![Account Screen](docs/doc_image/account.jpg)
Display Note: This account display functions as the user control center, combining profile information, preferences, and session-level settings in one place. Centralized controls reduce friction and support a predictable user routine for returning sessions.
![Dark Mode Account](docs/doc_image/darkmode_account.jpg)
Display Note: This dark-mode account display improves low-light usability with stronger visual comfort, contrast balance, and consistent component hierarchy. It supports accessibility and extended nighttime usage without sacrificing readability of key controls.

### Alerts

The Alerts screen surfaces important updates such as match events and moderation/recovery-related notifications.

![Alerts Screen](docs/doc_image/alerts.jpg)
Display Note: This alerts display presents an event timeline that prioritizes match, moderation, and recovery signals so users can take timely next actions. By surfacing urgency in sequence, it helps users respond quickly to opportunities that affect successful item return.

## Detailed Per-Image Notes

For full notes on how each screenshot works, architecture flow, and UI/UX intent, see:

- [Product Documentation](docs/PRODUCT_DOCUMENTATION.md) (`Per-Image Notes` section)
- [Screen Gallery](docs/SCREEN_GALLERY.md)
