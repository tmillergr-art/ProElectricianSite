# Copilot instructions for ProElectricianSite

## Project shape (read first)
- This is a static marketing site with no frontend build step.
- Core files:
  - `index.html`: single-page content (nav, services, testimonials, projects, contact form).
  - `css/styles.css`: all styling and responsive behavior.
  - `js/script.js`: all client-side interactions.
  - `contact.php`: backend endpoint for contact form submission (JSON responses + `mail()`).
- Keep solutions framework-free; do not introduce bundlers, npm tooling, or SPA routing.

## Data flow and integration points
- Contact flow is `index.html` form (`#contact-form`) -> `fetch('contact.php')` in `js/script.js` -> JSON from `contact.php`.
- Frontend expects `{ success: true, message: ... }` on success and `{ error: ... }` on failure.
- Analytics events use `trackConversion()` in `js/script.js`, preferring `window.gtag` with `dataLayer` fallback.
- External dependencies are CDN/hosted only (Google Fonts, Google Analytics, Unsplash image URLs).

## Editing conventions in this repo
- Preserve IDs/classes used by JS hooks: `#primary-menu`, `.menu-toggle`, `#contact-form`, `#form-message`, `#service-filter`, `#image-modal`.
- Services are authored as repeated `<article class="service">` blocks in `index.html`; filtering in `js/script.js` depends on each card’s `h3` and text content.
- Match existing design tokens and palette in `css/styles.css` (`#002f6c` blue, `#da1212` red) unless explicitly asked to rebrand.
- Keep accessibility attributes and patterns intact (`aria-expanded`, `aria-invalid`, `aria-live`, dialog `aria-hidden`).

## Scripts and maintenance
- `scripts/update_services_icons.py` rewrites service card emoji icons in `index.html`.
- That script currently uses a hard-coded absolute path; if you touch it, prefer repo-relative path handling.
- When editing service titles, update the Python `emoji_map` to avoid falling back to default icon behavior.

## Local dev + verification workflow
- Quick preview (static only): open `index.html` directly.
- Full behavior (required for form POST): run `php -S localhost:8000` from repo root and open `http://localhost:8000`.
- If using Python scripts, run from repo root with the workspace venv Python.
- There is no automated test suite; verify manually:
  - mobile menu open/close + outside-click + `Esc`
  - service filtering and datalist suggestions
  - project image modal open/close
  - contact form validation + success/error messaging

## Change scope guardrails
- Make surgical edits; avoid broad HTML/CSS rewrites for single-section requests.
- Do not rename form fields (`name`, `email`, `message`) without updating both JS `FormData` and `contact.php`.
- Do not add dependencies or new infrastructure unless the task explicitly requests it.