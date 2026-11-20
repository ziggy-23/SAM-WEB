# CONTENT_TODO

What's left to do, most important first. Right now the goal is to **send the site to Elastic as part of an application**, so the order reflects that.

Run `npm run check-content` (inside `website/`) for a line-by-line list of every placeholder.

> **Public mode.** The live (production) site hides anything unfinished: placeholder chips, the template reading-list entry, placeholder photographs, the demo article, unwritten "My takes on…" pages, and any section left empty (Writing and Photography are out of the navigation, homepage, sitemap and links until they have real content). Nothing unfinished shows to a visitor. Everything stays visible in `npm run dev`. Adding real content brings each part back on its own.

---

## 🔴 P0: Before sending the link to Elastic

- [ ] **Deploy the site** (README §4: Vercel, Root Directory `website`). Without a public URL there's nothing to send.
- [ ] **Set `NEXT_PUBLIC_SITE_URL`** in Vercel so social previews and the sitemap use the real address.
- [ ] **Review the Lab write-up** (`content/ai-projects/tender-screening.mdx`). The Architecture section and workflow steps are now written from your GlobalCAD skills (search → title filter → ToR screening → analyst review → commercial meeting, with the weekly calibration loop). Check that you're comfortable naming Claude and the portals publicly, and that nothing in it is confidential for GlobalCAD.
- [ ] **Lab: "What I learned"**: 3–5 sentences. Hidden until written. This is the paragraph a hiring manager at Elastic is most likely to read: what you learned about turning messy documents into a searchable, decision-ready pipeline.
- [ ] **CV PDF** to download from the site (Contact or About). Use the Elastic-tailored version.

## 🟠 P1: Makes the application noticeably stronger

- [ ] **A second Lab project built on Elastic's own stack**: by far the biggest lever. For example: index a year of tenders in Elasticsearch and build a Kibana dashboard (by donor, region, topic, IN/REJECT rate), or use semantic search over terms of reference. Even a small, honest version shows initiative. *(Pick the angle once we know the exact role.)*
- [ ] **Check the Iran article** (`content/articles/destroy-everything-change-nothing.mdx`): the English adaptation of "Tout détruire, rien changer". Verify the date (set to 20 Oct 2026), the wording of the quotes, the scorecard verdicts and the chart captions. Add your sources (Mearsheimer quote, oil-export estimates, the September missile reports) under `references:`.
- [ ] **Second article.** A piece from the Red Sea thesis, or one on data/AI in international development, which would bridge both worlds.
- [ ] **Homepage positioning statement**: the hero headline is still the original brief wording. One sharper sentence about who you are and what you do.
- [ ] **Contact form**: create a Resend account, verify a domain, set the 3 environment variables (README §4). Until then the form tells visitors it isn't connected and shows your email.
- [ ] **Custom domain** (e.g. `sam-mehfara.com`, ~€10–15/year), so the link in the CV looks like yours rather than `*.vercel.app`.

## 🟡 P2: Complete the picture

- [ ] Master's thesis: exact title and abstract; decide whether to publish (`content/research/masters-thesis.mdx` is `draft: true`; `content/projects/masters-thesis.mdx` shows the topic).
- [ ] BBC role: add the episode link as `listen:` (`content/experience/bbc.mdx`) and a `<Learned>` block (it's the only role without one).
- [ ] AUB Alumni Network Spain: year you became Vice President, and a line on what the chapter does.
- [ ] UfM climate-adaptation project: key findings or a public link, if there is one.
- [ ] Personal closing paragraph for the About page (`profile.json` → last `bio` entry). Optional; the current one works.
- [ ] Reading list: 3–5 first recommendations (replace the template entry in `content/reading-list/recommendations.json`).

## 🟢 P3: Personal pages and assets (no deadline)

- [ ] **"My takes on…"** pages in `content/interests/` (running, football, music-and-drums, languages-and-cultures, cooking). Each tag on the About page links to its page once the page has text.
- [ ] Photographs (`assets/photography/<collection>/`) → replace the placeholder entries in `content/photography/photos.json`. The Photography section reappears with the first real photo.
- [ ] Confirm the photography collections (Beirut, Barcelona, Paris are placeholders) and add the photography profile URL to `content/site.json`.
- [ ] Optional: screenshots or a short screen recording for the Lab project (`assets/videos/`, `assets/graphics/`). A 30-second recording of the screening run would be very persuasive.

## 🔵 Decisions / later

- [ ] Delete the demonstration article (`content/articles/demo-how-a-price-shock-travels.mdx`) once real articles exist. It's already hidden on the live site.
- [ ] Analytics: none installed (by design). Vercel Web Analytics is privacy-friendly if you want to see whether Elastic opened the link.
- [ ] Spam: upgrade to Cloudflare Turnstile if the honeypot isn't enough.

## ✅ Done

- First article published (Iran war, with scorecard, map, charts and scenarios) · homepage "About" section rebalanced (no empty space under the headline)
- Contact email and LinkedIn · employment dates, titles, locations · education dates · Sciences Po dual degree, MFA title, GlobalCAD confirmed · portrait · "What I learned" for every role except BBC and for all three universities · Lab architecture and real workflow steps · public mode (nothing unfinished visible on the live site).
