# Pintfolio (iOS)

Native mobile app for logging beers you've tried. Built with [Expo](https://expo.dev) and React Native.

## Run on your iPhone

### Option A — Expo Go (fastest)

1. Install **Expo Go** from the App Store on your iPhone.
2. On your Mac, from this folder:

   ```bash
   npm install
   npm start
   ```

3. Scan the QR code with your iPhone camera and open in Expo Go.

### Option B — iOS Simulator (Mac + Xcode)

```bash
npm install
npm run ios
```

Requires Xcode and the iOS Simulator.

### Option C — Installable app (TestFlight / App Store)

Build with [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npx eas-cli login
npx eas build --platform ios
```

## Features

- Log beers with ratings, styles, ABV, notes, and more
- Search, filter, and sort your collection
- Export / import JSON (compatible with the web app)
- Data stored on device via AsyncStorage
- iOS-native modal forms, safe areas, and touch targets

## Project structure

- `app/` — screens (Expo Router)
- `src/` — components, types, storage
