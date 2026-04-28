# Deployment Guide

This guide explains how to deploy the backend and run/install the mobile app cleanly.

## 1) Backend Deployment (Render + MongoDB Atlas)

### 1.1 Create MongoDB Atlas

1. Create an Atlas account.
2. Create an `M0` cluster.
3. Create a DB user.
4. Add network/IP access.
5. Copy your connection string.

### 1.2 Deploy API to Render

1. Push your repo to GitHub.
2. In Render, create a new **Web Service**.
3. Set service root directory to `server`.
4. Set build command to `npm install`.
5. Set start command to `npm start`.

Add environment variables:

- `PORT=5000`
- `MONGODB_URI=<atlas-uri>`
- `JWT_SECRET=<strong-random-secret>`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_ORIGIN=*`
- `RATE_LIMIT_MAX=500`
- `RATE_LIMIT_ENABLED=true`

After deploy, verify:

- `https://<your-service>.onrender.com/api/health`
- `authConfigured` should be `true`

## 2) Connect Mobile App to Hosted API

Open `src/config/env.js` and set:

- `HOSTED_API_BASE_URL = 'https://<your-service>.onrender.com/api'`
- `DEV_BACKEND_MODE = 'hosted'` (recommended for real-phone use)

Available modes:

- `hosted`
- `auto`
- `usb_reverse`
- `emulator`
- `phone_wifi`

## 3) Install and Run App

### 3.1 Android emulator/PC

Release-style run (recommended):

```bash
npm install --legacy-peer-deps
npm run android
```

Debug run (Metro):

```bash
npm start
npm run android:dev
```

### 3.2 Android phone via USB

Debug mode (Metro + reverse):

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

Standalone release install (no Metro required):

```bash
npm run apk:release
npm run install:phone
```

Debug APK install:

```bash
npm run apk:debug
npm run install:phone:debug
```

## 4) Local Full Development

Run backend + Metro together:

```bash
npm run dev:all
```

## 5) Troubleshooting

### 5.1 Red screen: "Unable to load script"

This is a debug build without Metro.

Fix:

```bash
npm start
adb reverse tcp:8081 tcp:8081
```

Or install release build:

```bash
npm run apk:release
npm run install:phone
```

### 5.2 Backend not reachable

- Check backend health endpoint
- Check `MONGODB_URI` and `JWT_SECRET`
- Check `HOSTED_API_BASE_URL` in `src/config/env.js`

### 5.3 Too many `429` responses in local testing

- Restart backend service
- Optional dev-only setting in `server/.env`: `RATE_LIMIT_ENABLED=false`

### 5.4 ADB device conflicts

If ADB says multiple devices are connected, run with `ANDROID_SERIAL` as shown above.

## 6) Mobile Computing Deployment Notes

- Prefer `DEV_BACKEND_MODE='hosted'` for real-phone demonstrations in class.
- Use release APK (`apk:release`) when Metro instability causes debug script loading issues.
- Validate runtime permissions on first launch (camera/location/notification) before demo.
- Keep at least one offline-ready draft report to demonstrate interrupted-session recovery.
