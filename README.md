# DiGiT@L SouL — Personal Portfolio

Personal portfolio of **Luca Porfido** (aka **DiGiT@L SouL**) — IT Consultant, SAP Analyst, Web Dev, Photographer, Music DJ & Selector. Turin-based, born in 1980, hooked on tech for 38+ years.

Live: **https://digitalsoul.vercel.app**

---

## ✨ Features

- **Pip-Boy / CRT aesthetic** — dark green-tinted background, Electric Lime (`#CCFF00`) phosphor accent, scanlines, monitor-frame boot-up screen with HDD audio (CC0)
- **Boot-up sequence** — power-on click unlocks audio, mechanical HDD loop, terminal-style boot lines, language picker on first visit (EN / IT)
- **Bilingual** — English at `/`, Italian at `/it/`, full content parity, `hreflang` SEO setup, language-switch in sidebar + CV header
- **Two pages per language**:
  - Homepage with Bio · Experience · Volunteering · Projects · Music · Photography
  - Full CV (`/resume.html`, `/it/resume.html`) with Summary · AI Enthusiast · Experience · Volunteering · Education · Courses · IT Skills · Other Skills · Languages · Certifications · Skills
- **Live data integrations**:
  - Project screenshots → [WordPress Mshots](https://s.wordpress.com/mshots/v1/) (live homepage capture per project URL)
  - Instagram gallery → [Behold](https://behold.so) JSON feed, client-side filter on hashtag `#digitalsoulph`, IG profile card with avatar + animated follower count
- **Offline-card mode** — when a project site goes down, its card swaps to a Pip-Boy "Under Construction" tile with hazard stripes + blink + mailto fallback link
- **CRT toggle** — persisted in `localStorage`, default ON, disables all CRT effects with one click; bouncing attention until first interaction
- **Sidebar avatar** — rounded-square frame with phosphor glow, scanline beam loop, hover RGB-split glitch with clip-path slicing
- **Email contact wow** — Pip-Boy panel with shimmer sweep, pulsing chevron, hover badge "SAY HI / SCRIVIMI"
- **Copyright claim footer** — © marker with radar pulse, all-rights-reserved notice
- **Accessibility** — semantic markup, skip links, aria labels, full `prefers-reduced-motion` support (every animation has an off path)

---

## 🛠 Stack

- HTML5 semantic markup
- CSS3 vanilla — custom properties, Grid, Flexbox, `conic-gradient`, `clip-path`, `mix-blend-mode`, `@keyframes`
- JavaScript ES6+ vanilla — IIFE module pattern, no framework, no bundler, no `package.json`, no build step
- Google Fonts: Inter, Space Grotesk, JetBrains Mono
- Static hosting on **Vercel** (auto-deploy from `main`)
- Audio: CC0 HDD loop from freesound.org

---

## 📁 Structure

```
digitalsoul/
├── index.html                  # EN homepage
├── resume.html                 # EN full CV
├── 404.html
├── styles.css
├── script.js
├── favicon.svg / favicon.ico
├── robots.txt
├── sitemap.xml                 # multilingual with hreflang
├── vercel.json                 # security headers, cleanUrls
├── README.md
├── it/
│   ├── index.html              # IT homepage
│   └── resume.html             # IT full CV
└── assets/
    ├── avatar.png              # sidebar portrait (150×150)
    ├── audio/
    │   └── hdd-loop.mp3        # boot-up SFX (CC0)
    ├── photos/                 # photography assets
    └── projects/               # project assets
```

---

## 🌐 Bilingual routes

| Page | EN | IT |
|---|---|---|
| Homepage | `/` → `index.html` | `/it/` → `it/index.html` |
| Full CV | `/resume.html` | `/it/resume.html` |

Language toggle is exposed in the sidebar on the homepage and in the topbar of each CV page. First-visit language choice is captured by the boot-up picker; the choice is stored in `localStorage`.

---

## 🚀 Local development

No tooling needed. Either open `index.html` directly in a browser, or serve the folder with any static server:

```bash
python -m http.server 8000
# or
npx serve .
```

The Behold JSON feed is fetched cross-origin (CORS-enabled). The Mshots URLs are public.

---

## ☁ Deploy

Every push to `main` triggers an automatic Vercel deploy. Routes are flattened via `vercel.json` (`cleanUrls: true`).

---

## 🔄 Live data caveats

- **Mshots screenshots** are generated lazily on first hit; the first visitor of a card may see a grey "loading" placeholder, the second sees the real screenshot. Cache stays warm for days.
- **Instagram URLs expire every ~24h** (signed CDN params `oh=` / `oe=`). Behold refreshes them on each request, so a page reload always pulls fresh tokens.
- **Behold free plan** caps at 10 posts and refreshes from Instagram every ~24h. Manual refresh available in the Behold dashboard.

---

## 📜 Copyright

© 2026 Luca Porfido — All content on this site is property of the author.
Please don't reuse it without written permission.

Email: **retroemulator01@gmail.com**

---

## 🤖 Credits

Designed and coded by **Luca Porfido**, with [Anthropic Claude](https://www.anthropic.com), iteration after iteration.
