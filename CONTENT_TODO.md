# CONTENT_TODO

A running list of content to supply or verify, and decisions still open.
Run `npm run check-content` (inside `website/`) for an exact, line-by-line list of every placeholder.

## 🔴 Needed before going public

- [x] ~~Contact details~~ — email and LinkedIn added.
- [x] ~~Employment dates, titles, locations, role order~~ — filled from your CVs on Google Drive (Sept 2026 versions; 2022 CV for the BBC role).
- [x] ~~Education dates~~ — AUB & Sciences Po dual BA 2021–2024; IBEI MA 2024–2026.
- [ ] Photography profile URL — once you start posting (`content/site.json`).
- [ ] **Contact form** — create a Resend account, verify a sending domain, set the 3 environment variables in Vercel (see README §4).
- [ ] **Domain name** — optional; then set `NEXT_PUBLIC_SITE_URL` in Vercel.

## 🟠 Check (filled from your CVs — confirm you're happy with the public wording)

- [ ] BBC: titled "Research Journalist" (your brief); your 2022 CV says "Research interviewer", Oct–Dec 2020, London. Adjust if needed.
- [ ] SEA Expo title: "Client Engagement Associate" (latest English CV). Older CVs say "Sales Engineer"; the Spanish CV says "Consultor de Relaciones con Clientes".
- [ ] GlobalCAD bullets mention UNICEF, Yemen's Ministry of Water and Environment, the Union for the Mediterranean, Interreg MED and PROREV/AfDB — confirm these client names can be public.
- [ ] AUB Alumni Network Spain — year you became Vice President.
- [ ] Grades (8.8/10 IBEI, 17.2/20 Sciences Po, 3.7/4 AUB) were deliberately **not** published. Say if you want them shown.

## 🟡 Write

- [ ] Personal paragraph for the About page (`profile.json` → last `bio` entry).
- [ ] One sentence for each interest (photography, writing, running, music & drums, travel, technology).
- [ ] "What I learned" reflections for each role (everything else is filled in).
- [ ] Master's thesis: exact title and abstract; decide whether to publish the full text (the archive entry is `draft: true`; the topic is shown as a project card).
- [ ] First real article(s) in `content/articles/`.
- [ ] Reading list: first recommendations (replace the template entry).
- [ ] Lab project: optional architecture details and lessons learned (problem, motivation and workflow are filled in).
- [ ] Optional: CV PDF to offer as a download.

## 🟢 Assets

- [x] ~~Portrait~~ — added (`assets/portraits/sam.jpg`).
- [ ] Photographs (`assets/photography/<collection>/`) → replace the 12 placeholder entries in `content/photography/photos.json`.
- [ ] Confirm photography collections (Beirut, Barcelona, Paris are placeholders) — add/rename as appropriate.
- [ ] Optional: screenshots / screen recordings for lab projects (`assets/videos/`, `assets/graphics/`).

## 🔵 Decisions / later

- [ ] Remove or keep the demonstration article (`content/articles/demo-how-a-price-shock-travels.mdx`) once real articles exist. It is `noindex` and excluded from the sitemap.
- [ ] Positioning statement on the homepage — current text is the placeholder from the brief.
- [ ] Analytics: none installed (by design). Add a privacy-friendly option later if wanted.
- [ ] Spam: upgrade to Cloudflare Turnstile if the honeypot isn't enough.
