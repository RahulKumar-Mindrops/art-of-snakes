# Flavour Fussion — Website Documentation

A 4-page static website built with plain HTML, CSS and JavaScript (no frameworks, no build step). This document explains the file structure, design system, how to edit content, and how to deploy the site.

---

## 1. What's included

```
site/
├── index.html          Home page
├── gifting.html         Festive Gifting page
├── products.html        Products page
├── contact.html          Contact page + enquiry form
├── css/
│   └── style.css        All styling for all 4 pages
├── js/
│   └── script.js         Mobile nav toggle, footer year, contact form handling
├── assets/
│   ├── gift-box-open.png     Peacock-motif gift box (hero, gifting page)
│   ├── gift-box-jars.png     4 granola jars in gift box (home + gifting)
│   ├── jute-hamper.png       Jute tote wedding hamper (gifting page)
│   ├── power-crunch-1.png    Power Crunch Mix — Dry Fruits Overloaded jar
│   └── power-crunch-2.png    Power Crunch Mix — Millet Magic jar
└── DOCUMENTATION.md     This file
```

No package manager, framework, or build tool is required. Every page is a self-contained `.html` file that links to the shared `css/style.css` and `js/script.js`.

---

## 2. How to preview the site

**Simplest:** double-click `index.html` to open it directly in a browser. All relative paths (`css/`, `js/`, `assets/`) will resolve correctly.

**Recommended (for the contact form and fonts to behave exactly as in production):** serve the folder over a local web server rather than the `file://` protocol:

```bash
cd site
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

or, with Node installed:

```bash
npx serve site
```

---

## 3. Page-by-page overview

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Company introduction, 7-product overview grid, "Why Choose Us" list, festive-gifting teaser, call to action |
| Festive Gifting | `gifting.html` | Occasion list, gifting options grid, product showcases (granola box, Power Crunch jars, jute hamper), gifting-specific CTA |
| Products | `products.html` | Detailed spec card for each of the 7 export products, grouped under Makhana / Spices / Dry Fruits / Saffron with jump-link anchors |
| Contact | `contact.html` | Company contact details and an enquiry form (name, company, email, phone, country, interest, message) |

All 4 pages share the same header (logo + nav + "Request a Quote" button) and footer (brand blurb, sitemap, product anchors, contact snippet).

---

## 4. Design system

The visual identity is drawn from the brand's own product photography — the peacock-and-garden gift boxes, gold satin lining and spice-market colours — rather than a generic template look.

### Colour tokens (defined in `css/style.css` under `:root`)

| Token | Hex | Used for |
|---|---|---|
| `--ink` | `#241C13` | Primary text, dark sections, footer |
| `--paper` | `#F8EFDE` | Base background |
| `--paper-deep` | `#F0E2C8` | Alternating panel background |
| `--chilli` | `#A5391F` | Primary accent — buttons, links, kickers |
| `--chilli-dark` | `#7E2A17` | Hover states, dark accent text |
| `--turmeric` | `#CC9A2E` | Secondary accent — highlights on dark sections |
| `--coriander` | `#4C5A37` | Supporting accent (success states) |
| `--rose` | `#EAD2C4` | Festive Gifting section backgrounds |

To re-theme the whole site, edit these values once in `css/style.css` — every page inherits from the same token set.

### Type

- **Display / headings:** [Fraunces](https://fonts.google.com/specimen/Fraunces) — a warm, characterful serif, loaded from Google Fonts in the `<head>` of each page.
- **Body / UI:** [Work Sans] — a clean grotesque sans-serif for readability at small sizes.

Both are loaded via a `<link>` to `fonts.googleapis.com` in every page's `<head>`. An internet connection is required for the custom fonts to load; without one, browsers fall back to system serif/sans-serif fonts and the layout still works correctly.

### Layout conventions

- Max content width: `1180px`, centred via the `.wrap` class.
- Section rhythm: `.section` (large vertical padding) and `.section--tight` (reduced padding) alternate with plain (`--paper`), `--panel` (`--paper-deep`) and `--rose`/`--ink` backgrounds to break up long pages without adding borders everywhere.
- Product and gifting-option content uses CSS Grid (`.product-grid`, `.gift-options`), collapsing from 3 → 2 → 1 columns as the viewport narrows.

---

## 5. Editing content

Because there is no templating engine, header and footer markup is duplicated across the 4 HTML files. When you change navigation, footer links, or contact details, **update all 4 files** (`index.html`, `gifting.html`, `products.html`, `contact.html`).

### Common edits

- **Company contact details:** Search each file for the placeholders `[Add company address]` and `[Add phone number]`, and update the `mailto:` / `tel:` links in the footer and on `contact.html`. These placeholders are intentional — no real contact details were provided in the brief.
- **Adding a product:** Copy one `.product-card` block in `index.html`'s product grid, and one `.spec-card` block in `products.html`, and edit the text.
- **Adding a gifting option:** Copy one `.gift-option` block inside `gifting.html`.
- **Swapping an image:** Replace the file in `assets/` (keep the same filename) or update the `src` attribute. Always keep the descriptive `alt` text accurate — it is used by screen readers and search engines.
- **Adding new images:** The images currently used are just placeholders from the brief. To use different or additional photos (new product shots, new hampers, a real office photo, etc.), simply drop the new image file into the `assets/` folder and point the relevant `src="assets/your-file.png"` at it — no other code changes are needed. Add as many images as you like this way; just keep filenames lowercase with hyphens (e.g. `diwali-hamper.png`) and reuse the existing `<img>` markup as a template for any new image you insert.

---

## 6. The contact form

`contact.html` contains a front-end enquiry form (`#enquiry-form`). As shipped, it is a **demo only**: `js/script.js` intercepts the submit event, validates the required fields, shows a confirmation message, and resets the form — but it does **not** send the enquiry anywhere.

Before launch, connect it to a real submission method. Common options:

1. **A form backend service** (e.g. Formspree, Getform, Basin) — point the form's `action` attribute at the service's endpoint and remove/adjust the JS `preventDefault()` logic.
2. **Your own backend** — replace the block inside the `if (form)` section of `js/script.js` with a `fetch()` POST request to your API, then show the success/error message based on the response.
3. **Email API** (e.g. SendGrid, Mailgun) called from a small serverless function, with the form posting to that function's URL.

The relevant code is clearly marked with a comment in `js/script.js`:

```js
/* Enquiry form — front-end only demo handling.
   Replace this block with a real submission ... */
```

---

## 7. Accessibility & responsiveness notes

- All interactive elements (nav links, buttons, form fields) have visible keyboard focus states (`:focus-visible`).
- The mobile nav toggle updates `aria-expanded` and the current page link uses `aria-current="page"`.
- Motion is respected via `prefers-reduced-motion`.
- Layout is responsive from mobile (~360px) through desktop, with the nav collapsing to a hamburger menu below 860px and grids collapsing to fewer columns on narrower screens.

---

## 8. Deployment

The site is fully static, so it can be hosted anywhere that serves plain files:

- **Netlify / Vercel:** drag-and-drop the `site/` folder, or connect a Git repo.
- **GitHub Pages:** push the contents of `site/` to a repo and enable Pages on the branch.
- **Any traditional web host:** upload the contents of `site/` via FTP/SFTP to your `public_html` (or equivalent) directory.

No environment variables, build step, or server-side runtime is required.

---

## 9. Known placeholders to replace before going live

| Location | Placeholder | Found in |
|---|---|---|
| Footer + Contact page | `[Add company address]` | All 4 files |
| Footer + Contact page | `[Add phone number]` | All 4 files |
| Footer + Contact page | `export@flavourfussion.com` | All 4 files — confirm this is the real address |
| Contact page | `gifting@flavourfussion.com` | `contact.html` — confirm this is the real address |
| Products page | Pricing / MOQ / lead times | Not included — the brief did not supply figures |

---

## 10. Content source

All page copy is adapted directly from the brief supplied for this project (company description, product range, gifting range, "Why Choose Us" list). Product images used across the Home and Festive Gifting pages are the ones supplied with the brief (peacock-motif gift box, granola jar assortment, jute wedding hamper, and Power Crunch Mix jars).
