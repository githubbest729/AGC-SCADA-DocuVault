# AGC SCADA DocuVault

Offline-first PWA for creating, managing, and exporting SCADA documentation.
Pure HTML/CSS/vanilla JS — no build step, no framework.

## Files

| File | Purpose |
|---|---|
| `index.html` | App shell markup (sidebar + editor/preview) |
| `style.css` | Dark industrial theme |
| `app.js` | All application logic (editor, templates, paste-to-image, PDF export) |
| `database.js` | IndexedDB wrapper (`DocuVaultDB`) |
| `manifest.json` | PWA manifest |
| `service-worker.js` | Offline app-shell caching |
| `offline.html` | Fallback page for uncached navigation while offline |
| `robots.txt` / `sitemap.xml` | Included per request — see note below |

## Before you deploy

1. **Drop in your own icons/assets** at the same folder level as `index.html`:
   `icon-192.png`, `icon-512.png`, `icon-maskable-192.png`, `icon-maskable-512.png`,
   `apple-touch-icon.png`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`,
   `favicon-48x48.png`, `og-image.png`, `screenshot-wide.png`, `screenshot-narrow.png`.
   All are already referenced correctly in `index.html` and `manifest.json`.
   If any screenshot files are missing, just delete those two entries from
   `manifest.json` — a missing screenshot won't break install, but a missing
   icon referenced in the manifest can prevent some browsers from installing.

2. **Replace `YOUR-DEPLOY-DOMAIN`** in `robots.txt` and `sitemap.xml` with
   wherever you actually host this (e.g. GitHub Pages, an internal IIS/Nginx
   folder, Netlify). *Honest note: this is a single-user offline tool, not a
   public site — `robots.txt`/`sitemap.xml` only matter if you host it
   somewhere a search engine could ever crawl. For a purely internal/local
   deployment you can safely ignore or delete both.*

3. **Must be served over HTTPS (or `localhost`)** for the service worker and
   "Add to Home Screen" install prompt to work — this is a browser
   requirement for all PWAs, not specific to this app. Opening `index.html`
   directly via `file://` will run the app fine, but IndexedDB works and the
   service worker/install prompt will not.

## How the data model works

- Everything lives in one IndexedDB store (`documents`) in the `agc-docuvault-db`
  database, scoped to the browser profile/origin you load the app from.
- Pasted images are embedded as base64 `data:` URIs directly inside the
  Markdown content field — no separate image table, so a document and its
  screenshots are always saved, exported, and deleted together as one record.
- There is currently no cross-device sync or export/import of the whole
  vault. If you want a JSON export/import feature for backup or moving to
  another machine, that's a natural next addition — just ask.

## Bundled templates

Siemens PLC IP Address Table, Wonderware/AVEVA System Architecture, Site
Network Architecture, Modbus Register Map, Site Visit/Commissioning Note,
and an HMI User Manual skeleton. Edit the `TEMPLATES` array near the top of
`app.js` to add your own or adjust the boilerplate text.

## PDF export

"Generate Official PDF" wraps the rendered Markdown in a white-background
letterhead (Al Gurg Automation & Controls header, your name/title, date,
category tag, footer) and runs it through `html2pdf.js` to an A4 page. The
dark editor theme is intentionally not carried into the PDF — corporate
documents print better on a light background with a single accent color.
