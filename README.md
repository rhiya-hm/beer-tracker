# Pintfolio

Log every beer you've tried — ratings, styles, tasting notes, and more.

| Platform | Location | How to run |
|----------|----------|------------|
| **Web** | `./` (root) | `npm run dev` |
| **iOS app** | `./mobile` | See [mobile/README.md](./mobile/README.md) |

## Features

- Log beers with name, brewery, style, ABV, date, star rating, and notes
- Mark whether you'd try a beer again
- Search and filter by style; sort by date, rating, or name
- Dashboard stats: total count, average rating, most-logged style
- Export / import your collection as JSON

## Web app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## iOS app

```bash
npm run mobile:install   # first time only
npm run mobile           # Expo dev server → scan QR with Expo Go
```

Or from `mobile/`: `npm install` then `npm start`.

`npm run ios` from the repo root opens the iOS Simulator (requires full Xcode). On a physical iPhone, use `npm run mobile` instead. See [mobile/README.md](./mobile/README.md).

## Build for production

```bash
npm run build
npm start
```
