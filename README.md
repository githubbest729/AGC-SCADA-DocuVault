# AGC SCADA DocuVault

Offline-first PWA for creating, managing, and exporting SCADA documentation.
Pure HTML/CSS/vanilla JS — no build step, no framework.

## Files

| File / Folder | Purpose |
|---|---|
| `index.html` | App shell markup (sidebar + editor/preview) + full PWA/iOS/social `<head>` |
| `style.css` | Dark industrial theme |
| `app.js` | All application logic (editor, templates, paste-to-image, PDF export) |
| `database.js` | IndexedDB wrapper (`DocuVaultDB`) |
| `manifest.json` | PWA manifest (icons, maskable icons, screenshots, shortcut) |
| `browserconfig.xml` | Windows/Edge pinned-tile config |
| `service-worker.js` | Offline app-shell caching |
| `offline.html` | Fallback page for uncached navigation while offline |
| `robots.txt` / `sitemap.xml` | Included per request — see note below |
| `package.json` | Optional local dev server (`http-server`) — not required to run the app |
| `.gitignore` | Standard vanilla-JS ignores |
| `icons/` | All PWA/iOS/favicon PNGs go here — **you provide these** |
| `screenshots/` | Rich-install-UI screenshots — **you provide these** |
| `assets/` | Open Graph / Twitter share images — **you provide these** |

## Required image files (drop these in, exact names/paths)

```
/favicon.ico
/icons/icon-192.png
/icons/icon-512.png
/icons/icon-maskable-192.png
/icons/icon-maskable-512.png
/icons/icon-152.png
/icons/icon-180.png
/icons/apple-touch-icon.png      (180x180)
/icons/favicon-16x16.png
/icons/favicon-32x32.png
/icons/favicon-48x48.png
/screenshots/screenshot-wide.png     (1280x800, desktop install UI)
/screenshots/screenshot-narrow.png   (750x1334, mobile install UI)
/assets/og-image.png             (1200x630, Facebook/LinkedIn/Slack preview)
/assets/twitter-card.png         (1200x630, X/Twitter preview)
```

`icons/`, `screenshots/`, and `assets/` each ship with an empty `.gitkeep`
placeholder so the folder structure survives git/zip — delete those once you
add real images.

## Before you deploy

1. **This project assumes it's served from the domain root** (`/index.html`,
   `/icons/...`, etc. — not `/some-subfolder/index.html`). That's what the
   root-relative paths in `manifest.json`, `browserconfig.xml`, and
   `index.html`'s `<head>` assume. If you deploy into a subfolder (e.g. a
   GitHub Pages *project* site at `username.github.io/repo/`), change every
   `/icons/...`, `/screenshots/...`, `/assets/...`, `/manifest.json`,
   `/browserconfig.xml`, `start_url`, and `scope` to `./`-relative paths, or
   prefix them with `/repo/`.

2. **Replace `YOUR-DEPLOY-DOMAIN`** — it appears in `robots.txt`,
   `sitemap.xml`, and the Open Graph/Twitter/canonical tags in `index.html`'s
   `<head>` — with wherever you actually host this. *Honest note: this is a
   single-user offline tool, not a public site — `robots.txt`/`sitemap.xml`
   and the social-share tags only matter if this ever sits somewhere a
   search engine or a chat app's link preview could reach it. For a purely
   internal/local deployment you can ignore or delete all of that.*

3. **Must be served over HTTPS (or `localhost`)** for the service worker and
   "Add to Home Screen" install prompt to work — a browser requirement for
   all PWAs, not specific to this app. Opening `index.html` directly via
   `file://` will run the app and IndexedDB fine, but the service
   worker/install prompt will not activate.

## Optional local dev server

No build step is required — you can always just open `index.html` in a
browser or point any static file server at this folder. `package.json` is
included only as a convenience if you want a quick local server with correct
MIME types (needed for the service worker to register cleanly over
`http://localhost`):

```bash
npm install
npm run dev     # serves on http://localhost:8080 and opens your browser
# or
npm start       # same, without auto-opening the browser
```

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
