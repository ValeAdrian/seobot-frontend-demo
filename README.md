# seobot — front-end design demo

A **standalone, runnable demo of the seobot dashboard front-end**, built so a design tool
(e.g. [Google Stitch](https://stitch.withgoogle.com/)) or a designer can explore every page
without the real backend, real data, or any secrets.

> **seobot** is a self-hosted, autonomous-SEO platform: a dashboard "brain" that monitors a
> site, turns opportunities into **scored decisions** (a local model proposes → a stronger
> model reviews → the human approves), and — only with approval — edits the site. This repo is
> **only the UI**, wired to a mock backend.

## What's in here

| File | What it is |
|---|---|
| `index.html` | The app shell (top bar, sidebar mount, view mount). |
| `app.js` | The entire vanilla, no-build SPA (routing, all ~32 views, render helpers). **Unmodified** from production except client names → demo placeholders. |
| `app.css` | The design system (colour tokens, typography, components). |
| `mock.js` | **Demo only.** Overrides `window.fetch` for `/api/*` and returns dummy JSON so every page renders with no backend. Remove this `<script>` for production. |
| `lightweight-charts.*.js` | Vendored TradingView Lightweight Charts (Apache-2.0) for trend charts. |
| `*.woff2` | Vendored fonts: Roboto (body), Montserrat (headings), IBM Plex Mono (numbers). |
| `DESIGN.md` | **The design system** — brand, colour tokens (do not change), typography, shape, components. Give this to the designer/Stitch. |
| `STITCH-BRIEF.md` | **The brief** — paste-ready instructions, the navigation-reinvention ask, every page explained, and a page-by-page improvement order. Give this to Stitch too. |

## Run it

It's fully static — serve the folder with anything:

```bash
python -m http.server 8899
# then open http://localhost:8899/?view=overview
```

Navigate between pages with the sidebar, or by `?view=<id>` — e.g. `?view=decisions`,
`?view=thoughts`, `?view=content`, `?view=rank`, `?view=spend`. All 32 views render from
mock data.

## Using it with Google Stitch

1. Push this repo to a **public GitHub repository** and point Stitch's *"Public GitHub
   repository"* field at it (it's safe — there are no secrets, no real data).
2. Paste **`DESIGN.md`** where Stitch asks for design context.
3. Paste the *"Additional instructions"* block from **`STITCH-BRIEF.md` §A**.
4. Optionally host the demo (e.g. GitHub Pages) and use Stitch's *"Add website"* field so it
   can see the live pages; then work page-by-page using `STITCH-BRIEF.md` §E.

## Safety / privacy

- **No API keys, tokens, passwords, or secrets** anywhere in this repo — the front-end never
  held any (they live only in the backend's `.env`). The only "secret"-looking values in
  `mock.js` are **boolean presence flags** (`true`) and env-var *names*, not values.
- **No real client data** — all data is fictional ("Demo Casino", `demo-casino.example`).
- This is a **design artefact**, not the product. `mock.js` is intentionally fake; deleting its
  `<script>` tag makes the app talk to a real seobot backend again.

## What to preserve vs. improve

See `DESIGN.md` §11. In short — **preserve** the dark theme, the exact colour tokens, the
Roboto/Montserrat/Plex-Mono fonts, and the green=good / red=bad / amber=caution / blue=brand
semantics. **Improve** the navigation/IA (it's bulky — that's the #1 ask), the visual
hierarchy, the dashboard storytelling, and the empty/loading states.
