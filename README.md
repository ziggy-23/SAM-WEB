# SAM — Personal Digital Universe

The personal website of Houssam (Sam) Mehfara: a personal archive of ideas, experiences, research, projects and photographs.

It is a free, ad-free, tracker-free website. Everything personal lives in plain text files you can edit yourself — no database, no CMS login, no WordPress maintenance.

---

## 1. Folder structure

```
SAM/                       ← this repository
├── website/               ← the Next.js application (the code)
│   ├── src/app/           ← one folder per page (about/, writing/, photography/, lab/, work/, contact/)
│   ├── src/components/    ← reusable building blocks (navigation, charts, map, gallery, …)
│   ├── src/lib/           ← content loading (content.ts), maps (geo.ts), helpers
│   └── scripts/           ← sync-assets (copies assets/), check-content (lists placeholders)
├── content/               ← ALL the words and data on the site — edit these
│   ├── site.json              contact email and profile links
│   ├── biography/             profile.json (bio, languages, interests) · journey.json (map cities)
│   ├── education/             one .mdx file per institution (story + What I learned)
│   ├── experience/            one .mdx file per job
│   ├── articles/              one .mdx file per article · categories.json
│   ├── research/              one .mdx file per thesis / paper / policy brief
│   ├── reading-list/          recommendations.json (external pieces you recommend)
│   ├── photography/           photos.json · collections.json
│   ├── ai-projects/           one .mdx file per Data & AI lab project
│   └── projects/              one .mdx file per project / achievement
├── assets/                ← images and videos (portraits, photography, videos, graphics)
├── references/            ← your own design inspiration and screenshots (not published)
├── README.md              ← this file
└── CONTENT_TODO.md        ← what still needs writing or verifying
```

**Rule of thumb:** to change what the site *says*, edit `content/`. To change what it *shows*, add files to `assets/`. You should rarely need to touch `website/`.

---

## 2. Running the site on your computer

You need [Node.js](https://nodejs.org) version 20 or newer (download the "LTS" version).

```bash
cd website
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. The page reloads automatically when you save a content file.

Other useful commands (run inside `website/`):

| Command | What it does |
| --- | --- |
| `npm run check-content` | Lists every `[ADD …]` / `[VERIFY …]` placeholder still in `content/` |
| `npm run build` | Builds the production site (also checks every content file is valid) |
| `npm run lint` | Type-checks the code |

Tip: press **G** on any page to show the 12-column grid the layout is built on.

---

## 3. Adding and editing content

### Placeholders
Anything not yet verified is written as `[ADD …]`, `[VERIFY …]` or `<TODO>…</TODO>`. The site displays these as dashed orange labels so nothing unverified is ever mistaken for fact. Replace them with real text and they disappear. `npm run check-content` lists them all.

### Write an article
1. Create `content/articles/my-article-title.mdx` (the file name becomes the URL: `/writing/my-article-title`).
2. Start it with this header ("frontmatter"):

```mdx
---
title: "The title"
subtitle: "A one-line standfirst"
date: "2026-12-01"
type: article            # article | analysis | commentary | research | thesis | policy-brief | report | paper
category: "Geopolitics"  # must match a label in content/articles/categories.json
tags: ["gulf", "energy"]
summary: "Two sentences shown in listings and search results."
references:
  - "Author, Title, Publication (Year). https://…"
draft: false             # true = visible locally, hidden on the live site
---

Your text in normal Markdown. **Bold**, *italic*, [links](https://…), lists, ## headings.
```

3. Save. It appears in the archive, with search, filtering and reading time handled automatically.

### Scroll-based storytelling (optional)
Wrap sections in `<Step>` to get the Apple-style reading experience: the active section comes into focus as you scroll, and anything in `aside` appears in the margin beside it (or below the text on phones).

```mdx
<Step aside={<BarChart title="Oil exports" unit="million barrels/day" source="IEA, 2025" data={[{ label: "Country A", value: 3.1 }, { label: "Country B", value: 1.4, highlight: true }]} />}>

## 01 — The setup

Paragraph text… with a <Mark kind="circle">circled phrase</Mark>.

</Step>
```

Components available in any `.mdx` file:

| Component | Use |
| --- | --- |
| `<Step aside={…}>` | A storytelling section with an optional margin element |
| `<Lede>` | Large opening paragraph |
| `<Mark kind="underline" \| "circle" \| "box">` | Hand-drawn mark around words |
| `<Scribble>` | Handwritten marginal note (`inline` to place it in the text) |
| `<Arrow direction="curve" \| "down" \| "left" \| "right" label="…">` | Hand-drawn arrow |
| `<BarChart data={[…]} title unit source illustrative>` | Horizontal bar chart |
| `<LineChart data={[…]} labels={[…]} title unit source>` | Small line chart that draws itself |
| `<Flow steps={["A", "B", "C"]}>` | Vertical flow diagram |
| `<Timeline items={[{ label, text }]}>` | Small vertical timeline |
| `<Stat value="42%" label="…" source="…">` | Highlighted figure with drawn circle |
| `<RegionMap highlight={["Lebanon", "Syria"]} caption="…">` | Small map (country names as in Natural Earth) |
| `<Callout title="…">` | Boxed aside |
| `<Figure src="graphics/chart.png" alt="…" caption="…" source="…">` | Image from `assets/` |
| `<TODO>…</TODO>` | A visible placeholder |

**Charts must carry a `source`** when they show real data. If you use `illustrative`, the chart is labelled as invented data.

### Research, theses and policy briefs
Same format as articles, but placed in `content/research/` with `type: thesis` (or `paper`, `policy-brief`, `report`, `research`). They appear under the **Research** filter. Add `pdf: "research/my-thesis.pdf"` to link a PDF placed in `assets/research/`. Keep `draft: true` until you're ready to publish.

### Reading list (other people's work)
Add an entry to `content/reading-list/recommendations.json`:

```json
{ "title": "…", "author": "…", "publication": "…", "date": "2026-05", "url": "https://…",
  "why": "One or two sentences on why it matters.", "tags": ["energy"] }
```

Never paste the full text of someone else's article — link to it.

### Photographs
1. Put the image in `assets/photography/<collection>/`, e.g. `assets/photography/beirut/corniche.jpg`. JPEGs around 3000px on the long side are ideal — the site creates smaller versions automatically.
2. Add an entry to `content/photography/photos.json`:

```json
{ "id": "corniche", "src": "photography/beirut/corniche.jpg", "aspect": "3:2", "collection": "beirut",
  "title": "Corniche", "caption": "Optional sentence.", "location": "Beirut", "date": "2025",
  "tags": [], "alt": "Describe the photo for people who can't see it" }
```

`aspect` is width:height (`3:2`, `2:3`, `16:9`, `4:5`…). It decides the layout: panoramas go full-width, portraits pair up, landscapes alternate sides. The order in the file is the order on the page. Delete placeholder entries as you add real photographs. Collections are defined in `collections.json` (remove `"placeholder": true` once real).

### Experience
Each job is a file in `content/experience/`. Higher `order` = more recent (the timeline shows newest first). Set `verified: true` once you've checked the details. The body uses the headings *Overview / What I did / Selected work / Impact / What I learned*, but you can use any headings.

### "What I learned" — the signature section
Experience and education pages end with a `<Learned>` block. The optional `quote` is set large as a pull-quote:

```mdx
<Learned quote="One understated sentence that sums it up.">

A few short paragraphs on what the experience changed in how you see things.

</Learned>
```

Experience frontmatter also supports `partners: [...]` (shown as "Clients & partners") and `listen: "https://…"` (a "Listen to the episode" button).

### Data & AI lab projects
Each project is a file in `content/ai-projects/`. The frontmatter holds the problem, motivation, tools, before/after `metrics` and `workflow` steps (set `illustrative: true` if the diagram is a drawing rather than a working system). Add screenshots or recordings via `media`:

```yaml
media:
  - { type: video, src: "videos/demo.mp4", caption: "Screen recording of …" }
  - { type: image, src: "graphics/architecture.png", caption: "…" }
  - { type: embed, src: "https://…", caption: "Interactive demo", illustrative: true }
```

### Biography, languages, map cities, contact links
- `content/biography/profile.json` — bio paragraphs, interests (one sentence each — they appear as hanging tags under "Beyond the CV"), languages (`level` label and `percent` for the bar).
- `content/biography/journey.json` — the cities on the About map, in the order the point travels. `description` shows on the map card, `essay` in "Places that stayed with me". Add a city with its latitude/longitude and it appears automatically.
- `content/site.json` — public email and profile links. Links still starting with `[ADD` are hidden from the footer.
- Portrait: shown as a dark wax seal (`assets/portraits/sam-seal.png`). To make one from a new photo: `python3 website/scripts/make-wax-seal.py photo.jpg assets/portraits/sam-seal.png` (needs `pip install opencv-python-headless scipy pillow numpy`). The original photo is kept, unpublished, in `references/portrait-originals/`.

---

## 4. Deploying (free, no ads)

Recommended: **[Vercel](https://vercel.com)** (made by the creators of Next.js). The free "Hobby" plan is intended for personal, non-commercial sites like this one, shows no ads, and includes HTTPS.

1. Create a free Vercel account and sign in with GitHub.
2. **Add New → Project**, choose this repository.
3. Set **Root Directory** to `website`. Leave everything else as default.
4. Add environment variables (see below), then **Deploy**.

From then on, every time you push a change to GitHub (e.g. a new article file), Vercel rebuilds and publishes the site automatically in about a minute. You can even add or edit content files directly on github.com.

You get a free `something.vercel.app` address. A custom domain (e.g. `sam-mehfara.com`, roughly €10–15/year from any registrar) can be connected under **Project → Settings → Domains**.

*Alternatives:* Netlify and Cloudflare Pages also have free tiers and work with Next.js. WordPress isn't needed — this setup is free and has nothing to update or patch.

### Environment variables

| Variable | Required for | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Correct links in search results, sitemap and social previews | `https://sam-mehfara.com` |
| `RESEND_API_KEY` | The contact form | from resend.com → API Keys |
| `CONTACT_TO_EMAIL` | Where form messages are delivered | your inbox |
| `CONTACT_FROM_EMAIL` | Sender address (must be on a domain verified in Resend) | `SAM <hello@sam-mehfara.com>` |

See `website/.env.example`. For local testing, copy it to `website/.env.local`. **Never commit real keys.**

### The contact form
The form posts to `/api/contact`, which runs on the server and sends the message through [Resend](https://resend.com) (free tier: 3,000 emails/month). The API key is only ever read on the server.

- Until the three contact variables are set, the form honestly tells visitors it isn't connected yet and offers your email address instead (once you've added one to `site.json`).
- Spam protection: a hidden "honeypot" field, a minimum time-to-submit check, a per-visitor rate limit and server-side validation. If spam becomes a problem later, add [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (free).

---

## 5. Architecture notes

- **Next.js 16 (App Router) + React 19 + TypeScript.** Every page is pre-rendered to static HTML at build time; only the contact endpoint runs on a server.
- **Tailwind CSS v4.** All design tokens (colours, fonts, type roles, grid) are in `website/src/app/globals.css` under `@theme`. Change a colour there and it changes everywhere.
- **Motion (Framer Motion).** Restrained reveals, the pinned horizontal experience rail, scroll-linked storytelling steps, the lightbox. All motion respects the operating system's *reduce motion* setting. GSAP was not needed.
- **Maps.** Country outlines from Natural Earth (`world-atlas`), projected with `d3-geo` **at build time** — visitors download finished SVG, not a mapping library. The homepage globe uses the same data on a `<canvas>` and stops animating once it has settled.
- **Content.** Markdown/MDX + JSON in `content/`, validated by `zod` schemas in `website/src/lib/content.ts`. A typo in a content file produces a clear error message during `npm run dev`/`build` instead of a broken page.
- **Fonts** (all open-licence, self-hosted by Next.js): Newsreader (serif), Inter Tight (sans — also used wherever a "mono" style would appear, so nothing reads as code), Caveat (handwritten annotations), Noto Naskh Arabic (for العربية).
- **Accessibility.** Semantic landmarks, skip link, keyboard-operable map/timeline/lightbox/menu, visible focus states, `aria-live` updates, alt text from content, WCAG-AA text contrast.
- **SEO.** Per-page titles and descriptions, canonical URLs, Open Graph image, `sitemap.xml`, `robots.txt`, JSON-LD (Person, Article). Demonstration and draft pages are marked `noindex`.
- **Privacy.** No analytics, cookies or third-party trackers. If you want visitor statistics later, Vercel Web Analytics or Plausible are privacy-friendly options.

### Colour palette

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#111210` | Page background |
| `ink-2` / `ink-3` | `#191A16` / `#20211C` | Secondary / elevated surfaces |
| `void` | `#0B0B0A` | Photography background |
| `olive` / `moss` | `#343B2C` / `#8F9A78` | Lab accents |
| `espresso` / `clay` | `#382C25` / `#704C3D` | Warm surfaces |
| `stone` | `#8B8980` | Neutral marks |
| `beige` | `#D8D0BD` | Hover / emphasis |
| `orange` | `#C58B60` | The single accent — sparingly |
| `text` / `muted` | `#E9E6DE` / `#A09E94` | Text |
