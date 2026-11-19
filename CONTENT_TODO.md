# CONTENT_TODO

A running list of content to supply or verify, and decisions still open.
Run `npm run check-content` (inside `website/`) for an exact, line-by-line list of every placeholder.

## 🔴 Needed before going public

- [x] ~~Contact details~~ — email and LinkedIn added.
- [ ] Photography profile URL — once you start posting (`content/site.json`).
- [ ] **Contact form** — create a Resend account, verify a sending domain, set the 3 environment variables (see README §4).
- [ ] **Employment dates** for all five roles (`content/experience/*.mdx` → `start`, `end`).
- [ ] **Role ordering** — the timeline currently assumes this order, most recent first: GlobalCAD → SEA Expo → League of Arab States → MFA Lebanon → BBC. Correct the `order` numbers if wrong.
- [ ] **Ministry of Foreign Affairs, Lebanon** — exact role title and city.
- [ ] **BBC** — location (city/bureau) and one-line summary.
- [ ] **Education dates** — AUB, Sciences Po, IBEI (`content/education/education.json`).
- [ ] **Domain name** — choose and buy one (optional; free `*.vercel.app` works), then set `NEXT_PUBLIC_SITE_URL`.

## 🟠 Verify (currently shown with "VERIFY" labels)

- [x] ~~GlobalCAD 30% figure~~ — confirmed for public use. (Optional: add how it was measured.)
- [ ] GlobalCAD: tools list (Excel, SQL, Stata, R, Python, AI tools) — keep only what you actually used there.
- [ ] Tender-screening workflow steps (`content/ai-projects/tender-screening.mdx`) — these are generic placeholders; replace with the real process. Confirm what you're comfortable sharing publicly about a client-facing/internal tool.
- [ ] Map city descriptions (`content/biography/journey.json`) — rewrite in your own words.
- [ ] Language proficiency levels — add only if you want them shown (`content/biography/profile.json` → `level`).

## 🟡 Write

- [ ] Personal paragraph for the About page (`profile.json` → last `bio` entry).
- [ ] One sentence for each interest (photography, writing, running, music & drums, travel, technology).
- [ ] Full stories for each role: overview, what you did, selected work, impact, what you learned.
- [ ] Master's thesis: title, abstract; decide whether to publish (currently `draft: true`, hidden on the live site).
- [ ] First real article(s) in `content/articles/`.
- [ ] Reading list: first recommendations (replace the template entry).
- [ ] Lab project write-up: problem, motivation, real architecture, lessons.
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
