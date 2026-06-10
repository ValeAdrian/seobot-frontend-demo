# STITCH-PROMPTS.md — paste-ready, page-by-page

A ready-to-paste prompt pack for redesigning seobot in **Google Stitch**, page by page.
Companions: **DESIGN.md** (the visual system) and **STITCH-BRIEF.md** (the full brief, the nav
reinvention, every page explained, and §F "working *with Stitch specifically*").

## How to use
1. Work in **one Stitch project/thread** so it keeps visual memory.
2. Use **Experimental / high-effort mode** for the dense screens (Overview, Decisions, tables).
3. Paste the blocks below **in order** and send each. They all say "reuse the Decisions style," so
   the app stays consistent. Lock a screen before moving on (see the "done" bar in STITCH-BRIEF §F5).
4. For the long tail, use the **derivation pattern** at the bottom — don't hand-write every page.

> **Already done in the project:** the app **shell + reinvented navigation**, the **Overview**, and
> the **Decisions** page (desktop + mobile). Start the pack at **Thoughts**.

---

## 1 — Thoughts (pairs with Decisions)
```
Next, design the Thoughts page — the read-only reasoning feed that pairs with Decisions. Reuse the exact dark style, tokens and components from the Decisions page. It's the brain "thinking out loud": a chronological, READ-ONLY feed (no Approve/Dismiss). Header: "X recent" + "Gemma↔Claude agreement 87% over 15" + Refresh. Each item is a card: opportunity title + a scope tag (keyword_gap / content_refresh / onpage) + timestamp; a row of THREE calls side by side — Suggested (deterministic rule) YES/NO + %, Gemma YES/NO + %, Claude YES/NO + % — then an "agree" or "disagree" tag; a short italic rationale quote; and a status badge ("answered"/"dismissed"). Make agreement vs disagreement obvious. Green YES, red NO, mono %. Calm and scannable — a log, not an action surface. iGaming/casino fictional data (.example). Desktop 1360px + a mobile variant.
```

## 2 — Content (the review queue)
```
Next, design the Content page — the review queue for AI-written drafts. Reuse the Decisions dark style. Top: a generate bar (topic input, a content-type pill, a persona picker, an "auto-ground" toggle, a Generate button) and a "publish target" selector. Then a drafts TABLE: columns Draft (title + keyword + persona + model), Status (a pill: pending / approved / published), Words, When/Perf, and an actions cell (preview · edit · approve · score · QA · reject · delete). Below, add two supporting blocks: a content CALENDAR (drip schedule) and a SCORECARD (did published content rank?). The flow is generate → edit (system learns from edits) → approve → publish. iGaming/casino fictional data (.example). Desktop 1360px + a mobile variant.
```

## 3 — Rankings (the data-table archetype)
Reuse the result for Backlinks, Competitors, Indexation, Opportunities, Keyword Research, Logs.
```
Next, design the Rankings page — the keyword rank tracker, and make it our reusable data-table archetype. Reuse the Decisions dark style. A toolbar (search, a tag filter, a date-range picker, a density toggle, Export) above a dense table: columns Keyword, Position (with a small ▲/▼ delta in green/red), an inline sparkline of recent positions, Search Volume, SERP features (small chips), Tag. Sticky uppercase muted header, hairline rows, hover highlight, right-aligned mono numbers, and a clean empty state. Add sub-tabs at the top: "Tracker" and "Compare". iGaming/casino fictional data (.example). Desktop 1360px + a mobile variant where rows become stacked cards.
```

## 4 — Connect a domain (the form/wizard archetype)
Reuse the result for Settings and Integrations.
```
Next, design the "Connect a domain" onboarding wizard — our form/wizard archetype. Reuse the Decisions dark style. A 4-step guided flow with a step indicator: (1) Create project — name + primary domain; (2) Connect data sources — cards for rank/backlinks/search/analytics each with a connect/status state; (3) Pair the site — show a one-time token + the connector-plugin instructions, plus seed starter keywords; (4) "The brain starts watching" — a confirmation summary. Primary blue buttons, visible focus rings, clear empty/disabled states. It should feel like a calm guided product tour. Fictional data (.example). Desktop 1360px + a mobile variant.
```

---

## Long tail — derive, don't hand-write
Once the four archetypes above exist, generate the rest by pointing Stitch at the closest pattern.
Examples (paste and tweak the columns/fields):

- **Backlinks** → `Apply the Rankings table pattern to a Backlinks page: columns Referring domain, DR, anchor text, target URL, first-seen date, and a "toxic" flag with a Disavow action.`
- **Competitors** → `Apply the Rankings table pattern to a Competitors page: a "you vs them" header (visibility, keywords, DR) over a gap table (keyword, our position, their position, volume).`
- **Indexation** → `Apply the Rankings table pattern to an Indexation page: columns URL, indexed (yes/no), last checked, with an A–F coverage grade in the header.`
- **Opportunities** → `Apply the Rankings table pattern to an Opportunities page: scored keyword opportunities (position × volume × difficulty × intent) plus keyword clusters.`
- **Keyword Research** → `Apply the Rankings table pattern to a Keyword Research page with a paid-lookup cost preview above the results.`
- **Action Plan** → `Reuse the Decisions card style for an Action Plan page: categorised, prioritised tasks (Easy wins / On-page / Technical / Content / Off-page / Social) with checkboxes, an "AI assist" action per task, and a "Prioritise by ROI" button.`
- **Site Health** → `Reuse the dashboard style for a Site Health page with tabs: On-page (title/meta/H1 checks → an A–F grade), Crawl (issues list), Core Web Vitals (LCP/CLS trend).`
- **Search Console** → `Reuse the dashboard + table style for a Search Console page with a Google/Bing toggle: clicks, impressions, CTR, position, and a low-CTR-queries table.`
- **Analytics** → `Reuse the dashboard style for an Analytics page: sessions trend, sources breakdown, top pages.`
- **Spend** → `Reuse the dashboard style for a Spend page: MTD/today/cap/remaining tiles, a budget meter, and "by project" + "by endpoint" + AI-cost tables.`
- **Settings / Integrations / Alerts / Logs / Projects** → `Reuse the Connect-a-domain form style and the Rankings table style as appropriate.`

When you bound coverage (e.g. only do the top pages), say so out loud so it's clear what's left.
