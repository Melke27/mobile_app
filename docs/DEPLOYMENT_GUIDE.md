# Deployment Guide (Free-Friendly)

## 1. What Was Added

This project is now prepared with deployment-friendly updates:

- Backend middleware:
  - `compression` for faster responses.
  - `express-rate-limit` for basic abuse protection.
- New root scripts:
  - `npm run server:dev`
  - `npm run server:start`
  - `npm run dev:all`
  - `npm run apk:debug`
  - `npm run apk:release`
- Config support for local emulator, local phone testing, and hosted backend:
  - `src/config/env.js`

## 2. Free Hosting Options (Backend)

As of April 24, 2026:

- Render offers free web services with limits (idle spin-down and monthly free instance hours).
- Railway offers a free plan with a small free resource allowance.
- MongoDB Atlas offers an M0 free cluster (512MB).

Because pricing can change, always verify current plan limits before deployment.

## 3. Host Backend for Free (Render + MongoDB Atlas)

### 3.1 MongoDB Atlas

1. Create a free Atlas account.
2. Create an M0 free cluster.
3. Create a database user and IP access rule.
4. Copy your MongoDB connection string.

### 3.2 Render Web Service

1. Push this repo to GitHub.
2. In Render Dashboard, create a new **Web Service**.
3. Connect your GitHub repo.
4. Set:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
5. Add environment variables:
   - `PORT=5000`
   - `MONGODB_URI=<your atlas uri>`
   - `JWT_SECRET=<strong secret>`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_ORIGIN=*`
   - `RATE_LIMIT_MAX=500`
6. Deploy and confirm health endpoint:
   - `https://<your-service>.onrender.com/api/health`
   - Confirm response includes `"authConfigured": true`

## 4. Connect Mobile App to Hosted Backend

Open `src/config/env.js` and set:

- `HOSTED_API_BASE_URL` to your deployed backend URL.
- `DEV_BACKEND_MODE` as needed:
  - `hosted` to always use hosted backend
  - `auto` to try local dev backends first, then hosted fallback

Example:

```js
const HOSTED_API_BASE_URL = 'https://your-service.onrender.com/api';
```

## 5. Install App on PC and Phone

## 5.1 PC (Android Emulator)

1. Start Android emulator from Android Studio.
2. Run:

```bash
npm install
npm run android
```

## 5.2 Android Phone (USB)

1. Enable Developer Options and USB Debugging.
2. Start Metro and run Android with USB port mapping (Metro `8081` + local API `5000`):

```bash
# terminal 1
npm start
# terminal 2
npm run android:usb
```

If both emulator and phone are connected, run:

```bash
ANDROID_SERIAL=<device-id> npm run android:usb:device
```

3. If you prefer manual APK install, build debug APK:

```bash
npm run apk:debug
```

4. Install APK from computer:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

or:

```bash
npm run install:phone
```

If you want a store-ready APK, use:

```bash
npm run apk:release
```

## 6. Run Everything Locally in One Command

For development:

```bash
npm run dev:all
```

This starts Metro and backend together.

## 7. Notes for Physical Phone Testing

- If backend runs on your laptop and app runs on your phone, both must be on same Wi-Fi.
- In `src/config/env.js`:
  - set `DEV_BACKEND_MODE = 'phone_wifi'`
  - set `LOCAL_PHONE_API_BASE_URL` to your laptop LAN IP (example `http://192.168.1.20:5000/api`).

## 8. Troubleshooting

- App installs but closes immediately:
  - Run `adb logcat` and check for runtime exception.
- Red screen: "Unable to load script. Make sure you're either running Metro...":
  - Start Metro with `npm start`.
  - Run `adb reverse tcp:8081 tcp:8081`.
  - Re-open app or run `npm run android:usb`.
  - If needed, restart Metro cache with `npm run start:reset`.
- Many `429 Too Many Requests` errors during local dev:
  - Restart backend (`npm --prefix server run start`) to reset the rate-limit window.
  - Optional dev-only setting in `server/.env`: `RATE_LIMIT_ENABLED=false`.
- `adb: more than one device/emulator`:
  - Set one target device ID:
    - `ANDROID_SERIAL=<device-id> npm run android:usb:device`
- Build fails with Java/JDK errors:
  - Ensure `android/gradle.properties` has valid `org.gradle.java.home` path.
- Backend works locally but not on hosted URL:
  - Verify `MONGODB_URI` and Render environment variables.
  - Check `https://<service>/api/health`.
- Registration fails on hosted backend with `Server auth is not configured` or `secretOrPrivateKey must have a value`:
  - In Render Dashboard -> Service -> Environment, add `JWT_SECRET=<strong-random-value>`.
  - Click **Manual Deploy** -> **Deploy latest commit**.
  - Recheck `https://<service>/api/health` and confirm `"authConfigured": true`.
