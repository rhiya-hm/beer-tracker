# Beer Tracker

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
cd mobile
npm install
npm start
```

Scan the QR code with **Expo Go** on your iPhone, or run `npm run ios` in the simulator. Full details: [mobile/README.md](./mobile/README.md).

## Build for production

```bash
npm run build
npm start
```
