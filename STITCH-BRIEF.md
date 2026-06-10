# STITCH-BRIEF.md — what to ask Google Stitch

This file is your **playbook for Stitch**. It contains: (A) a paste-ready "Additional instructions" block,
(B) the navigation reinvention ask, (C) every page explained (so Stitch understands the IA), (D) extra asks,
and (E) a per-page improvement loop. The companion **DESIGN.md** describes the visual system (paste/upload it
too). The repo itself is the runnable demo (mock data, no secrets) — point Stitch's "Public GitHub repository"
field at it, or host it and use "Add website".

---

## A) Paste this into Stitch → "Additional instructions"

> Redesign **seobot**, a dark-themed, self-hosted autonomous-SEO dashboard. KEEP the dark theme and the exact
> colour tokens in DESIGN.md (near-black-blue surfaces; blue `#5cc8ff` accent; green `#3fd896` = good/up; red
> `#f4636f` = bad/down; amber `#f5b14c` = caution). KEEP the fonts: Roboto (body), Montserrat (headers), IBM
> Plex Mono (numbers/code). Generous rounding, soft shadows, flat surfaces (no gradients), visible blue focus
> rings. The product is an **SEO "brain"**: it monitors a site, turns opportunities into **scored decisions**
> (a local model proposes, a stronger model reviews, the human approves), and — only with approval — edits the
> site. The hero of the product is that decision loop (Decisions + Thoughts), not the raw data tables.
> Priorities: (1) **reinvent the navigation** — it's ~32 items in 4 flat groups and feels bulky; (2) make the
> Overview tell a story that leads with the **north-star** + **pending decisions**; (3) a consistent page
> template (H1 + "about this page" + body); (4) denser, calmer data tables; (5) great empty/loading/error
> states; (6) responsive (sidebar → drawer, cards stack). Generate desktop-first, then mobile. Output dark by
> default; an optional light mode is welcome but secondary.

---

## B) Navigation — REINVENT IT (the #1 ask)

**The problem:** ~32 items across 4 flat groups (Dashboards / Back Office / Project / Global). It's a wall of
links; the important things (the brain, the north-star) don't stand out; several pages are really the same
thing split in two.

**Ask Stitch to:**
1. **Collapse near-duplicates into tabbed pages:**
   - *Rank Tracking* + *Rank Compare* → one **Rankings** page (tabs: Tracker / Compare).
   - *Search Console* + *Bing Webmaster* → one **Search Console** page (Google / Bing toggle).
   - *Site Audit* + *Site Crawl* + Core-Web-Vitals → one **Site Health** page (tabs: On-page / Crawl / Core Web Vitals).
2. **Promote the brain to the top.** A "Command" group first: Overview, **Decisions**, **Thoughts**, Action Plan.
3. **Demote config to a Settings area / gear menu** (off the main rail): Connections, Integrations, Spend,
   Alerts, Project Settings, Logs, Projects.
4. **Make the project switcher prominent**, with a primary **"+ Connect a domain"** action.
5. Consider **icons per item, collapsible groups, and a command palette (⌘K global search)** to jump anywhere.

**Proposed cleaner IA (target ~5 groups, ~14 visible items + a settings drawer):**
- **Command:** Overview · Decisions · Thoughts · Action Plan
- **Content:** Content · Opportunities
- **Performance:** Rankings · Search Console · Analytics · Backlinks · Competitors
- **Site:** Site Health · Indexation
- **Research:** Keyword Research · SERP Inspector · Domain Finder · Bulk Tools · Imports
- **(gear) Settings:** Connections · Integrations · Spend · Alerts · Project Settings · Logs · Projects
- Top bar: project switcher · **+ Connect a domain** · ⌘K search · last-updated

---

## C) Every page, explained (so Stitch designs the right thing)

**Command (the brain):**
- **Overview** — the daily dashboard. Lead with the **north-star** (conversion-weighted organic value) + WoW
  delta, then **pending decisions to approve**, a visibility trend chart, stat tiles (tracked/ranking/top-3/
  top-10/avg position/spend), quick wins, Action-Plan progress, and the AI strategist briefing.
- **Decisions** — the approve/disapprove **queue**. Each row: the opportunity + the model calls (a local model
  "Gemma" YES/NO + conviction, a stronger model "Claude" YES/NO + conviction) + **Approve / Dismiss / Details**.
  A header shows model agreement %, a "shadow/controlled" badge, the **north-star**, and on-demand actions
  (find competitor gaps, check bonus freshness). An **Autonomy** panel lets the owner set per-scope autonomy
  level (with a kill-switch) — promotion to "auto-apply" is gated. Overruling the model opens a discussion thread.
- **Thoughts** — a **read-only reasoning feed**: every decision with the deterministic suggestion vs the two
  model calls vs (later) whether they agreed. The brain "thinking out loud."
- **Action Plan** — a categorised, prioritised to-do list (Easy wins / On-page / Technical / Content / Off-page /
  Social) built from the data; tick tasks done, "AI assist" a task, or **"Prioritise by ROI"** (AI re-rank).

**Content:**
- **Content** — the **review queue** for AI-written drafts: generate → edit (the system learns from edits) →
  approve → publish; plus a content **calendar** (drip schedule) and a **scorecard** (did published content rank?).
- **Opportunities** — scored keyword opportunities (position × volume × difficulty × intent) + keyword clusters.

**Performance (monitoring):**
- **Rankings** — keyword rank tracker over time (positions, SERP features) + a compare view (vs a date / competitor).
- **Search Console** — Google/Bing search performance (clicks, impressions, CTR, position; low-CTR queries).
- **Analytics** — traffic (sessions, sources) from analytics.
- **Backlinks** — backlink profile (DR, referring domains, toxic links / disavow).
- **Competitors** — tracked competitors: overview, "us vs them," keyword/backlink gaps.

**Site:**
- **Site Health** — on-page audit (title/meta/H1/checks → an A–F grade), full-site crawl issues, and Core Web
  Vitals trend (LCP/CLS/score).
- **Indexation** — are our pages actually indexed by Google? (a `site:` check per URL).

**Research (tools):**
- **Keyword Research** — discover keyword ideas/volume/difficulty/SERP (paid lookups show a cost preview).
- **SERP Inspector** — the live SERP for a keyword (top results + features).
- **Domain Finder** — hunt expired/dropped domains (authority-scored) for parasite-SEO / 301 rebuilds.
- **Bulk Tools** — bulk keyword actions (tag/delete/cluster).
- **Imports** — upload a CSV (e.g. Ahrefs export) to seed tracked keywords.

**Settings (config):**
- **Connections** — pair a website with the connector plugin (one token; pull model).
- **Integrations** — connect/check data sources (rank/backlinks/search/analytics/AI) status.
- **Spend** — API cost tracking + budget caps (this month, by purpose/model).
- **Alerts** — rank-change alert rules (delivered to chat).
- **Project Settings** — per-project config (vertical, etc.).
- **Logs** — a persistent app error log.
- **Projects** — create/switch projects (each fully isolated).
- **Connect a domain** — a 4-step **onboarding wizard**: create project → connect data → pair the site + seed
  keywords + a starter content plan → "the brain starts watching."

---

## D) Other things to ask Stitch (beyond nav)

1. **A consistent page template:** sticky page header (H1 + breadcrumb) · collapsible "About this page" help ·
   a toolbar slot · the body. Every page should feel like the same product.
2. **Data tables, levelled up:** sticky headers, zebra/hover, a density toggle, inline sparklines/deltas, a
   right-aligned mono numeric column style, and good 0-row **empty states**.
3. **Dashboard storytelling (Overview):** north-star hero with a trend, a "X decisions need you" call-to-action,
   then supporting tiles — not a flat grid of equal cards.
4. **The decision loop as hero:** design Decisions + Thoughts to make the *Gemma → Claude → you* flow legible
   at a glance (who said what, how confident, what's pending, what's auto vs human-gated). Include the autonomy
   level control + kill-switch + the GATE-B "earned autonomy" idea.
5. **States everywhere:** loading, empty, error, and "blank-safe / not configured" (e.g. an integration off).
6. **Responsive:** sidebar → slide-in drawer; tiles + tables stack; charts shrink gracefully.
7. **Onboarding wizard** polish (the Connect-a-domain flow) — make it feel like a guided product tour.
8. **Optional:** a ⌘K command palette / global search; a light-mode variant (dark stays default); subtle
   micro-charts on tiles.
9. **Keep it fast + calm:** short transitions, no heavy skeletons, accessible focus rings, AA contrast.

---

## E) Per-page improvement loop (how to work through it)

Do it in this order, reusing patterns so the app stays consistent:
1. **Navigation + the page shell** (top bar, sidebar/IA, page template) — get this right first; everything hangs off it.
2. **Overview** (the dashboard story).
3. **Decisions + Thoughts** (the hero loop) → reuse for any review/queue page.
4. **Content** (review queue + calendar + scorecard).
5. **A data-table archetype** (Rankings) → then apply the same pattern to Backlinks, Competitors, Indexation,
   Opportunities, Keyword Research, Logs.
6. **A detail/drill-down archetype** (a decision detail / a keyword history modal).
7. **A form/wizard archetype** (Connect-a-domain) → reuse for Settings/Integrations.
8. **Reports + Spend** (number-heavy, print-friendly).

For each: take the demo page screenshot, paste the page's purpose (from §C above) + "keep the colour tokens and
fonts from DESIGN.md; improve hierarchy, density, and states." Iterate until it's clean, then move on.

---

## F) Working *with Stitch specifically* (it has habits — fight them)

Stitch (Google's AI UI generator) defaults to **light, airy, marketing-SaaS** aesthetics, it **simplifies
dense data into pretty cards**, and it **loses consistency across many separate generations**. The notes below
are tuned to that. (DESIGN.md + §A–§E above are still the source of truth for *what* to build; this is *how* to
get good output from the tool.)

### F1) A ready-to-paste FIRST prompt (the shell + new nav, tokens baked in)
Send this as message #1 in a fresh Stitch project, with a screenshot of the current dark UI attached as the
style reference:

> Design the app shell and navigation for **seobot**, a dark, self-hosted SEO *operator* dashboard (behind a
> login — **not** a marketing site; no hero, sign-up, pricing, testimonials, or marketing footer). Use ONLY this
> dark theme: background `#0a0d12`, panels `#111824`, hairlines `#1c2632`, text `#e7eef5`, muted `#7d8c9b`;
> accents — blue `#5cc8ff` (brand/links/active nav/primary buttons), green `#3fd896` (positive/up/YES), red
> `#f4636f` (negative/down/NO), amber `#f5b14c` (caution). Fonts: Roboto (body), Montserrat (headings + the
> `seo·bot` wordmark, with "bot" in green), IBM Plex Mono (numbers). Rounding 16px cards / 10px controls /
> 999px pills; soft shadows, flat surfaces, no gradients; a visible blue focus ring. Build a 60px sticky top bar
> (logo + wordmark, project switcher, a `+ Connect a domain` button, a ⌘K search affordance, a last-updated
> stamp) and a 236px left sidebar with this grouped IA: **Command** (Overview · Decisions · Thoughts · Action
> Plan) · **Content** (Content · Opportunities) · **Performance** (Rankings · Search Console · Analytics ·
> Backlinks · Competitors) · **Site** (Site Health · Indexation) · **Research** (Keyword Research · SERP
> Inspector · Domain Finder · Bulk Tools · Imports), plus a gear → **Settings** drawer (Connections ·
> Integrations · Spend · Alerts · Project Settings · Logs · Projects). Active nav item = blue tint background +
> blue left bar. Show it framing a placeholder Overview. Give me a desktop 1360px frame **and** a mobile variant
> where the sidebar collapses to a drawer. Output dark HTML + Tailwind.

### F2) Operational tips (so it stays consistent)
- **One project/thread, screen-by-screen** in the §E order — Stitch keeps visual memory within a chat. Never
  "redesign everything" in one prompt.
- **Use Experimental / high-effort mode** for the dense screens (Overview, Decisions, tables) — it holds detail
  far better. Free generations are limited, so spend them on the high-leverage screens (shell, Overview,
  Decisions, one table, one form) and **derive the rest**: "apply this exact Rankings table pattern to
  Backlinks, Competitors, Indexation."
- **Generate a tokens/components screen BEFORE any page**: buttons (default/primary/danger), badges
  (ok/off/shadow), a stat tile, one data-table row, inputs, sub-tabs, the help accordion, a grade badge, an
  empty state. Lock it, then build pages from it — this is what keeps 30+ screens coherent.

### F3) Guardrails Stitch WILL break unless you say so
- **All data stays fictional** — "use only made-up casino names ending in `.example`; never invent or use a
  real brand or domain." (This repo was scrubbed of a real live casino domain for exactly this reason.)
- **Don't drop data** — density is a feature; keep every table column. It loves to flatten tables into cards.
- **Keep semantic colour** — green = YES/up/healthy, red = NO/down/danger, amber = caution, blue = brand. No
  recolouring for aesthetics.
- **Don't add or remove pages/features** — redesign what's in the screenshots; the nav reinvention (§B) is the
  *only* structural change wanted.
- **Preserve the decision-loop meaning** on Decisions/Thoughts: a local model (**Gemma**) proposes → a stronger
  model (**Claude**) reviews → the human decides. The two opinions + conviction % + agreement rate *are* the
  design — don't flatten it into a generic "approve" inbox.

### F4) Output asks
- **HTML + Tailwind** (closest to this vanilla no-build SPA; React would add a build step we don't use).
- **Free, self-hostable icons only** (Lucide or Phosphor) — nothing paid/attribution-bound, no CDN (the app
  runs behind a login and vendors its assets).
- Desktop **1360px** + mobile **≤860px** frames at least for the shell, Overview, and Decisions.

### F5) "Done" bar before moving to the next screen
A screen is finished when it reads in the dark theme with the exact tokens, the hierarchy leads with the most
important thing (north-star / pending decisions), tables are dense and scannable, and it has **empty + loading +
error** states. Then: "apply this exact style to `<next page>`."
