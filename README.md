# DiGiT@L SouL — Personal Portfolio

Personal portfolio of **Luca Zerbinati** (aka **DiGiT@L SouL**) — IT Consultant, SAP Analyst, Web Developer, Photographer, DJ.

## Stack

- HTML5 semantic markup
- CSS3 vanilla (custom properties, Grid, Flexbox)
- JavaScript ES6+ vanilla (no frameworks, no bundler)
- Google Fonts (Inter, Space Grotesk, JetBrains Mono)
- Hosted as a static site on Vercel

No `package.json`, no `node_modules`, no build step.

## Structure

```
digitalsoul-portfolio/
├── index.html
├── styles.css
├── script.js
├── 404.html
├── robots.txt
├── sitemap.xml
├── favicon.ico
├── vercel.json
└── assets/
    ├── photos/
    ├── projects/
    ├── avatar.jpg
    └── resume.pdf
```

## Local development

Just open `index.html` in a browser, or serve the folder with any static server:

```bash
python -m http.server 8000
```

## Deploy

Every push to `main` triggers an automatic Vercel deploy.
