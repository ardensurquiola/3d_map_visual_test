# 3D Map Setup Guide

## Prerequisites

- Node.js 20+
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project (create one at https://console.firebase.google.com)
- The same Google Maps API key used for data extraction

---

## 1. Firebase Project

Project: **motopirueta-ef11e** (already configured in `firebase/config.js` and `.firebaserc`).

Make sure **Firestore**, **Storage**, **Functions**, and **Hosting** are enabled in the Firebase console:
https://console.firebase.google.com/project/motopirueta-ef11e

---

## 2. Configure Google Maps API Key

Create `frontend/.env` with:
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```
Use the same key from the extractor's `.env` (`GOOGLE_MAPS_API_KEY`).

---

## 3. Link Firebase CLI

```bash
firebase login
firebase use motopirueta-ef11e
```

---

## 4. Generate the Merged CSV

From the project root, run the data extractor:
```bash
node index.js
# or, if you already have raw JSON cached:
node index.js --merge
```

This produces `output/merged_mexico_YYYY-MM-DD.csv`.

---

## 5. Upload CSV to Firebase Storage

Via the Firebase console:
1. Go to Storage → Upload file
2. Create a folder `csvs/`
3. Upload `output/merged_mexico_YYYY-MM-DD.csv` as `csvs/merged.csv`

Or via CLI (requires gsutil):
```bash
gsutil cp output/merged_mexico_*.csv gs://YOUR_PROJECT.appspot.com/csvs/merged.csv
```

---

## 6. Deploy Firebase Functions

```bash
cd functions && npm install
firebase deploy --only functions
```

---

## 7. Import CSV into Firestore

After the function is deployed, trigger the import by calling:

```
GET https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/importCsv?file=csvs/merged.csv&clear=true
```

You can open this URL in a browser. Watch the Firebase Functions logs to see progress.

- `file` — Storage path to the CSV (default: `csvs/merged.csv`)
- `clear=true` — deletes existing documents before importing (safe for re-runs)

---

## 8. Build & Deploy Frontend

```bash
cd frontend
npm install
npm run build
cd ..
firebase deploy --only hosting
```

The app will be live at: `https://YOUR_PROJECT_ID.web.app`

---

## 9. Local Development

```bash
cd frontend
npm run dev
# open http://localhost:5173
```

For local functions emulation:
```bash
firebase emulators:start --only functions,firestore,storage
```

---

## Project Structure

```
google_maps_api/
├── frontend/              # Vue 3 + Vite app
│   ├── src/
│   │   ├── firebase/      # Firebase SDK init
│   │   ├── composables/   # useShops, useDeckLayers
│   │   └── components/    # MapView, FilterPanel, ShopTooltip
│   └── dist/              # Built app (gitignored)
├── functions/             # Firebase Cloud Functions
│   └── index.js           # importCsv HTTP function
├── output/                # Generated CSVs
├── firebase.json          # Firebase config
├── firestore.rules        # Firestore security rules
└── storage.rules          # Storage security rules
```
