# Lost and Found Mobile Application for Campus

React Native + Node.js + MongoDB (Mobile Computing Focus)

## 1. Project Overview

The **Campus Lost & Found** application is a mobile-first system for students and staff to report, discover, and recover lost items quickly.

This project is built around mobile computing capabilities:

- Camera capture for item evidence
- GPS tagging for precise report location
- Real-time internet sync with central database
- Push notification integration hook
- Offline data caching for unstable networks

## 2. Main Objectives

- Build an Android-ready React Native application
- Integrate smartphone features (camera, GPS, local storage)
- Provide real-time lost/found reporting and search
- Use **MongoDB** as the central database
- Improve communication with in-app chat and moderation

## 3. Mobile Computing Requirements (Grading-Critical)

### Hardware

- Android smartphone
- Camera sensor
- GPS sensor
- Internet connectivity (Wi-Fi or mobile data)

### Software

- React Native
- Node.js + Express
- MongoDB (Atlas or local)
- Android Studio
- Visual Studio Code

### Mobile Features Used

- `react-native-image-picker` for camera capture
- `@react-native-community/geolocation` for live coordinates
- `@react-native-async-storage/async-storage` for offline cache + drafts
- Notification token registration endpoint ready for FCM integration

## 4. Problem Statement

Campus users lose items such as phones, IDs, books, and keys. Manual reporting is slow and not centralized. Matching lost and found reports is difficult and inconsistent.

This project solves that through:

- centralized digital reporting
- searchable, filterable reports
- smart matching score engine
- direct chat between reporter and finder

## 5. Complete Feature Set

### User Features

- Register/Login with JWT authentication
- Report Lost Item (photo + GPS + location text)
- Report Found Item
- Search and filter by status/campus/category/keyword/date
- View item details and potential matches
- Chat per item with other user
- In-app notification center (match/chat/moderation alerts)
- Mark item as recovered
- Flag suspicious posts
- QR ownership token generation for verification

### Admin Features

- View flagged reports
- Remove spam/fake reports
- Role-protected admin routes
- Flag review actions (keep flagged / clear flag)
- Dashboard stats (users, reports, status totals)

### Advanced Features Added

- Smart matching engine (text + category + campus + location)
- Offline cache of latest reports
- Draft auto-save for report form
- Multi-campus data model support
- Notification APIs (register token, list mine, mark read, mark all read)
- Admin moderation workflow (keep flag, clear flag, delete report) + dashboard stats

## 6. Architecture

Client-Server Mobile Computing Model:

```text
[React Native App]
      |
      | HTTPS (JWT)
      v
[Node.js + Express API]
      |
      v
[MongoDB Database]
      |
      +--> Matching Engine (server-side scoring)
      +--> Admin Moderation Layer
      +--> Notification Token Store (for FCM push pipeline)
```

## 7. Project Structure

```text
.
├── App.js
├── index.js
├── src
│   ├── components
│   ├── config
│   ├── context
│   ├── navigation
│   ├── screens
│   ├── services
│   └── utils
├── server
│   ├── .env.example
│   ├── package.json
│   └── src
│       ├── config
│       ├── controllers
│       ├── middleware
│       ├── models
│       ├── routes
│       └── utils
└── docs
```

## 8. Quick Setup

### 8.1 API Server (MongoDB)

```bash
cd server
npm install
cp .env.example .env
# edit .env and set your MongoDB URI + JWT secret
npm run dev
```

### 8.2 Mobile App

```bash
cd ..
npm install --legacy-peer-deps
# ensure src/config/env.js points to your API URL
npm start
# in another terminal:
npm run android
```

Physical phone over USB (maps both Metro `8081` and local API `5000`):

```bash
# terminal 1
npm start
# terminal 2
npm run android:usb
```

If you have multiple devices connected (phone + emulator), target one device:

```bash
ANDROID_SERIAL=<device-id> npm run android:usb:device
```

Alternative development command (runs backend + Metro together):

```bash
npm run dev:all
```

Build APK files:

```bash
npm run apk:debug
npm run apk:release
```

If you install `app-debug.apk` manually, keep Metro running and run:

```bash
adb reverse tcp:8081 tcp:8081
```

Note for Android emulator: default API URL is `http://10.0.2.2:5000/api`.
Dev backend mode is controlled in `src/config/env.js`:
- set `DEV_BACKEND_MODE = 'auto'` for smart fallback (USB reverse -> emulator -> Wi-Fi phone -> hosted)
- set `DEV_BACKEND_MODE = 'phone_wifi'` and update `LOCAL_PHONE_API_BASE_URL` for same-Wi-Fi phone testing
- set `DEV_BACKEND_MODE = 'hosted'` to force hosted API in development

Admin note: the first registered account is automatically assigned `admin` role for easier project setup/demo.

### 8.3 Android Compatibility (Pixel 8 / API 34)

- Recommended emulator: **Pixel 8 API 34**
- Required SDK tools in Android Studio:
  - Android SDK Platform 34
  - Build-Tools 34.0.0
  - Platform-Tools
  - Android Emulator
  - NDK (Side by side) `26.1.10909125`
- If NDK is corrupted, remove and reinstall:
  - `rm -rf $HOME/Android/Sdk/ndk/26.1.10909125`

## 9. Core Screens Implemented

- `LoginScreen`
- `RegisterScreen`
- `HomeScreen`
- `ReportItemScreen`
- `SearchScreen`
- `ItemDetailScreen`
- `ChatScreen`
- `NotificationsScreen`
- `VerificationScreen`
- `AdminDashboardScreen`

## 10. MongoDB Collections

- `users`
- `items`
- `messages`
- `notificationtokens`
- `notifications`

Detailed schema is available in [MONGODB_SCHEMA.md](docs/MONGODB_SCHEMA.md).

## 11. Security Implementation

- Password hashing with `bcryptjs`
- JWT access token authentication
- Protected routes with middleware
- Admin-only endpoints for moderation
- Input checks and validation constraints in controllers/models

## 12. Testing Scope

- API route tests (auth/items/chat/admin)
- Mobile component tests (forms/navigation)
- Integration flow tests (report -> match -> chat -> recovered)
- Device tests for camera and GPS permission handling

Detailed plan: [TEST_PLAN.md](docs/TEST_PLAN.md)

## 13. Documentation Index

- [API_SPEC.md](docs/API_SPEC.md)
- [MONGODB_SCHEMA.md](docs/MONGODB_SCHEMA.md)
- [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)
- [FEATURE_MATRIX.md](docs/FEATURE_MATRIX.md)
- [TEST_PLAN.md](docs/TEST_PLAN.md)
- [UML_TEXT.md](docs/UML_TEXT.md)
- [SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md)

## 14. Conclusion

This version is a complete and clear **React Native + MongoDB** project package for a campus mobile computing assignment. It covers required device capabilities, real-time reporting workflow, secure backend design, and advanced features suitable for final project evaluation.
