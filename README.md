# LabelMaker (Offline PWA)

Offline-first shelf label maker built with Vite + React + TailwindCSS + Dexie.

Note: Do not commit `node_modules` or `dist`.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## PWA Offline Test

First load must be online so assets can be cached.

1. Run `npm run preview`.
2. Open the app once while online.
3. Open Chrome DevTools → Application → Service Workers to confirm the worker is active.
4. Open DevTools → Network → check **Offline** and refresh.

You should still see the UI and navigate `/new`, `/library`, and `/print`.

## Printing (80mm x 40mm)

1. Open the label you want to print.
2. Click **Print** to open the print view.
3. In the browser print dialog:
   - Paper size: **80mm x 40mm**
   - Margins: **0**
   - Scale: **100%**

Tip: the `/print` route is designed to render one label per page at 80mm x 40mm.
