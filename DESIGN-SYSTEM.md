# seobot — Design System

## 1. Overview & design principles

seobot is a dark, self-hosted, autonomous-SEO operator dashboard — a "brain" that monitors a site, scores decisions, and acts with human approval. The visual language is *Linear × a trading terminal × an SEO suite*: calm, dark, fast, information-rich but never cluttered. It is an operator-grade command centre behind a single login, not a marketing surface. Build new screens to feel precise, confident, and a little playful — never corporate-bland, never neon/gamey.

**Principles**

- **Dark, operator-grade.** One dark theme (`--bg #0a0d12`), soft shadows over flat surfaces — never gradients-as-decoration. No light mode, no theme switcher.
- **Density is a feature.** Information-rich tables and dashboards are the point. Never drop table columns "for cleanliness."
- **The decision-loop is the hero.** Decisions / Thoughts / Action Plan are the product's reason to exist: local model **Gemma** proposes → stronger **Claude** reviews → human decides. Surface both opinions, conviction %, agreement rate, and disagreements. Never flatten it into a generic "approve" inbox.
- **Calm & fast.** No skeleton-heavy loads — a plain "Loading…" then content. Short 120–200ms transitions; reduced-motion friendly.
- **Semantic colour.** Green = good/up/YES, red = bad/down/NO/danger, amber = caution/mid, blue = brand/links/active/primary. Never recolour for aesthetics.

## 2. Brand

| Element | Spec |
|---|---|
| **Wordmark** | `seo·bot` — "seo·" in white (`--txt`), **"bot" in green** (`--pos #3fd896`). Set in **Montserrat 700**. |
| **Logo mark** | A **blue magnifier lens** (`--acc #5cc8ff`) containing a **small green rising sparkline** inside the lens, plus a handle. Signals "search + a bot that makes the line go up." |
| **Personality** | Precise, confident, a little playful. Never corporate-bland, never neon/gamey. |
| **Positioning** | An operator-grade SEO command centre — a self-hosted, autonomous SEO "brain" behind a single login. *Linear × a trading terminal × an SEO suite.* |

## 3. Colour

All tokens live in one `:root` block in `app.css`. No media-query or `[data-theme]` overrides exist — these are the only values.

### Surfaces

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0d12` | Base page background |
| `--bg2` | `#0d1219` | Secondary / mobile sidebar bg |
| `--panel` | `#111824` | Card / panel surface |
| `--panel2` | `#0f1521` | Recessed / hover surface |
| `--line` | `#1c2632` | Subtle border / row divider (1px hairline) |
| `--line2` | `#27323f` | Stronger border line |

### Text

| Token | Value | Use |
|---|---|---|
| `--txt` | `#e7eef5` | Primary text |
| `--mut` | `#7d8c9b` | Muted / secondary text |
| `--faint` | `#4d5a68` | Faint / disabled text |

### Signal palette

| Token | Value | Use |
|---|---|---|
| `--pos` | `#3fd896` | Positive / healthy green |
| `--neg` | `#f4636f` | Negative / error red |
| `--warn` | `#f5b14c` | Warning amber |

### Accent / brand

| Token | Value | Use |
|---|---|---|
| `--acc` | `#5cc8ff` | Accent blue |
| `--acc2` | `#3a9fd6` | Darker accent (hover / border) |
| `--accent` | `#5cc8ff` | Accent alias |
| `--brand` | `#5cc8ff` | Brand blue |
| `--brand2` | `#2f7fd6` | Secondary brand blue (gradient-end / pressed) |

### Semantic rules

| Meaning | Colour | Applies to |
|---|---|---|
| Good / up / YES / published / pass | **green** `--pos` | Conviction YES, deltas up, "bot" in wordmark, meter-fill.pos, badge.ok, progress fill |
| Bad / down / NO / error / reject / danger | **red** `--neg` | Conviction NO, deltas down, badge.off, btn.danger, meter-fill.neg |
| Caution / pending / mid / needs-improvement | **amber** `--warn` | move-lost, impact.warn, meter-fill.warn, grade-badge.warn |
| Brand / links / active nav / primary action | **blue** `--brand`/`--acc` | sb-item.active, btn.primary, tags, subtab.active, hero glow; `--acc2` hover, `--brand2` gradient/pressed |

**Hard rule:** no recolouring for aesthetics. The green/red/amber/blue meanings are fixed.

### Focus ring

- `--ring`: `0 0 0 3px rgba(92,200,255,.22)` — blue accent ring applied via `box-shadow:var(--ring)` on `:focus` / `:focus-visible`. Required on **every** interactive element.

## 4. Typography

| Role | Family token | Weights | Where used |
|---|---|---|---|
| Body / UI | `--body` `'Roboto',-apple-system,'Segoe UI',Roboto,sans-serif` | 400 / 500 / 700 | All body copy, labels, controls |
| Display / headings / big numbers / wordmark | `--disp` `'Montserrat',-apple-system,'Segoe UI',sans-serif` | 600 / 700 | H1s, `.hero .big`, `.tile .v`, `.grade-badge`, wordmark; tight letter-spacing `-.01em` |
| Numbers / code / tokens / timestamps | `--mono` `'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace` | 400 / 500 / 600 | Table numbers (`.tnum` = tabular-nums + mono), deltas, conviction %, tags, costs |

- **Base:** `font:15px/1.6 var(--body)` → 15px base size, 1.6 line-height.
- **Tabular figures everywhere numbers align.** Any column of positions, volumes, deltas, prices, or percentages uses `.tnum` so digits line up.
- **Fonts are vendored woff2, same-origin.** Never load fonts from a CDN — the app lives behind a login.

## 5. Shape, spacing & elevation

### Radius scale

| Token / value | Applies to |
|---|---|
| `--radius` `16px` | Cards, modals, hero |
| `--radius-sm` `10px` | Buttons, inputs, sidebar items |
| `--radius-xs` `8px` | Small inset blocks (e.g. `.plan-ai-out`) |
| `999px` (not a token) | Badges, pills, meters, progress tracks |
| `10px` | Grade badges |

### Spacing scale

- Scale: **6 / 10 / 14 / 18 / 24 px**. Cards pad `18px`. There is **no `--space-*` token** — spacing is hard-coded in px on rules; use this scale for consistency.
- **Page max-width `1360px`.**

### Elevation

Flat surfaces + soft shadows, not gradients.

| Token | Value | Use |
|---|---|---|
| `--shadow` | `0 1px 2px rgba(0,0,0,.30)` | Base card shadow |
| `--shadow-md` | `0 4px 14px rgba(3,7,14,.45)` | Hero / hover / raised cards |
| `--shadow-lg` | `0 18px 44px rgba(0,0,0,.50)` | Modals / drawers / overlays |

### Borders

- **1px hairlines** in `--line` (dividers, default card border).
- **`--line2`** for stronger separation (table header rule, modal edges, emphasis).
- **2px** for grade badges and emphasis borders.

## 6. Layout shell

```
┌──────────────────────────────────────────────────────────┐
│ TOP BAR — sticky 60px, blurred translucent                │
│ wordmark · project switcher · +Connect a domain · ⌘K · ts │
├───────────┬──────────────────────────────────────────────┤
│ SIDEBAR   │ CONTENT COLUMN (max-width 1360px)             │
│ 236px     │  H1 + breadcrumb                              │
│ sticky    │  ▸ About this page (.help accordion)          │
│ --bg2     │  hero / tiles / cards / tables …              │
│ sb-group  │                                               │
│ sb-item   │                                               │
└───────────┴──────────────────────────────────────────────┘
```

| Region | Spec |
|---|---|
| **Top bar** | Sticky, **60px**, blurred translucent background. Holds wordmark, project switcher, the prominent **+ Connect a domain** action, ⌘K search, and a last-updated timestamp. Table `thead th` is sticky at `top:60px` so headers clear the bar. |
| **Sidebar** | **236px**, sticky, `--bg2`. `.sb-group` uppercase muted section labels; `.sb-item` nav buttons; `.sb-item.active` = faint-blue fill + 3px inset blue left bar. |
| **Content column** | Centred, **max-width 1360px**, `18px` padding rhythm. |
| **Page-header pattern** | `H1` (Montserrat) + breadcrumb, then a collapsible **`.help` "About this page"** accordion immediately under the H1 on most pages, then the page body. |

## 7. Navigation & information architecture

**Recommendation (use this):** the reinvented IA — ~5 visible groups + a gear Settings drawer — supersedes the legacy flat ~32-item, 4-group nav. The nav reinvention is the *only* sanctioned structural change; do not add or remove pages.

| Group | Items |
|---|---|
| **Command** | Overview · Decisions · Thoughts · Action Plan |
| **Content** | Content · Opportunities |
| **Performance** | Rankings · Search Console · Analytics · Backlinks · Competitors |
| **Site** | Site Health · Indexation |
| **Research** | Keyword Research · SERP Inspector · Domain Finder · Bulk Tools · Imports |
| **⚙ Settings (drawer, off-rail)** | Connections · Integrations · Spend · Alerts · Project Settings · Logs · Projects |

**Top bar:** project switcher · **+ Connect a domain** (primary, a 4-step onboarding wizard) · ⌘K search · last-updated.

**Collapsing near-duplicates into tabbed pages:**

- Rank Tracking + Rank Compare → one **Rankings** page (tabs: Tracker / Compare).
- Search Console + Bing Webmaster → one **Search Console** page (Google / Bing toggle).
- Site Audit + Site Crawl + Core Web Vitals → one **Site Health** page (tabs: On-page / Crawl / Core Web Vitals).

**Notes:** the legacy `report` (Weekly Report) view does not appear in the proposed visible IA or the Settings drawer — treat it as deprecated from the rail. Use `.subtabs` / `.subtab` for the in-page tabs above.

## 8. Components

Real class names from `app.css` / `app.js`. Use these — do not invent new ones.

### Cards

| Class | When / how to use |
|---|---|
| `.card` | Universal container: `--panel`, 1px `--line`, 16px radius, 18px pad, subtle shadow. Wrap every panel/table block. |
| `.card.cta` | Clickable card — pointer + blue hover (border `--acc`, faint blue tint, raised shadow). Overview "Quick wins" / "Action Plan" jump cards. |
| `.hero` | Top banner card: blue radial-glow over `--panel`, `--line2` border, `--shadow-md`. Holds the big visibility number + `#heroChart`. `.hero .big` = 42px Montserrat figure. |
| `.plan-first` | Highlighted "Do these first" card (blue border + faint blue fill) on Action Plan. |
| `details.card` | Collapsible card variant: bold `summary`, default disclosure marker removed (autonomy / expandable panels). |

### Stat tiles

| Class | Use |
|---|---|
| `.card.tile` | KPI tile in a `.tiles` auto-fill grid (`minmax(158px,1fr)`). |
| `.tile .k` | 11px uppercase, letter-spaced, muted label. |
| `.tile .v` | 30px Montserrat bold value. `.tile .v.small` → 22px for long values ($ amounts, "Avg position"). Add `.tnum` to figures. |

### Buttons

| Class | Use |
|---|---|
| `.btn` | Default: `--panel` bg, `--line2` border, 10px radius, 600/13px. Blue hover, focus-ring, 1px press translate, `.5` opacity when disabled. |
| `.btn.primary` | Solid blue CTA: `--brand` bg/border, dark text (`#06121f`). "Copy prompt", "Send to Telegram". |
| `.btn.danger` | Destructive: red border + red text, red-tinted hover. "Delete selected". |

### Badges & pills

| Class | Use |
|---|---|
| `.badge` | Pill status chip, 11px 600, fully rounded. |
| `.badge.ok` / `.badge.off` | Green (on/connected) / red (off/disconnected). |
| `.tag` | Small (10px) rounded outline chip, blue mono text — keyword tags, SERP-feature chips, activity labels. |
| `.tag.jump` | Interactive variant: pointer + blue hover (clickable cross-link). |
| `.pill` | "soon" tag, e.g. on `.sb-item.soon`. |
| `.impact` / `.impact.pos`/`.warn`/`.mut` | Tiny uppercase impact pill (high/med/low), mapped in JS via `IMPACT_CLS`. |

### Tables

| Class | Use |
|---|---|
| `table` | Full-width, collapsed borders, 13.5px; wrap in a tight-padded `.card`. |
| `thead th` | Left-aligned muted 11px uppercase header; `--line2` bottom rule; **sticky `top:60px`** with `--panel` bg. |
| `tbody td` | 11×12px cells, `--line` row dividers; last row border removed. |
| `tbody tr:hover` | Highlight to `--panel2`, eased. |
| `.tnum` | Tabular-nums + mono for aligned numeric columns. |
| `.move-up`/`.move-down`/`.move-new`/`.move-lost` | Movement colouring: green / red / blue / amber. |

### Sub-tabs & help

| Class | Use |
|---|---|
| `.subtabs` / `.subtab` / `.subtab.active` | Flex-wrap pill toggles for in-page tab switching; active = faint-blue fill, white text, blue border. |
| `.help` / `.help summary` / `.help-body` | Collapsible "About this page" strip under the H1; blue 12px header with a `›` chevron that rotates 90° when `[open]`; indented muted body. |

### States, toolbars, layout helpers

| Class | Use |
|---|---|
| `.empty` | Centred muted message in a **dashed** `--line2` box on `--panel2` (46px vertical pad). No-data / no-project placeholder. |
| `.loading` | Centred muted "Loading…" block, no border. |
| `.pager` | Right-aligned pagination row. |
| `.foot` | Faint footer with top rule. |
| `.toolbar` / `.toolbar .grow` | Flex-wrap action row above tables (10px gap); `.grow` flexes the search input to fill. |
| `.bulkbar` | Contextual bulk-actions strip (faint-blue tint, `--line2` border) shown on row selection; pairs with `.btn.danger` + `.spacer`. |
| `.costbar` / `.costbar b` | API cost-preview strip on `--panel2`; `<b>` highlights the figure in blue. |
| `.spacer` | `flex:1` filler to push items apart in flex rows. |

### Meters & progress

| Class | Use |
|---|---|
| `.meter` / `.meter-fill` | 10px rounded track (`--panel2`, `--line2`, clipped) + fill. `.meter-fill.pos`/`.warn`/`.neg` colour it; width set inline as %. Site-health vitals, KD meters. |
| `.plan-progress-bar` | Slimmer 8px track on `--line2`; inner `span` is a green (`--pos`) fill with eased width. Action Plan completion. |

### Modal

| Class | Use |
|---|---|
| `.modal-overlay` | Fixed full-screen dim (`rgba(4,7,11,.7)` + blur), flex-centred, z-index 80. |
| `.modal` | Centred dialog: `--panel`, `--line2`, 16px radius, `--shadow-lg`, `min(680px,96vw)`, clipped. |
| `.modal-head` / `.modal-body` | Title row (`h3`) + close button with `--line` rule / 16px-padded content. Built by `openModal()`. |

### Grade badge

- `.grade-badge` — 52×52 rounded square, single letter in 26px Montserrat bold, 2px border. Variants `.grade-badge.pos`/`.warn`/`.neg` (green/amber/red). Site Health grade.

### Sidebar nav

| Class | Use |
|---|---|
| `.sb-group` | Uppercase muted section label. |
| `.sb-item` | Full-width left nav button: muted text, 10px radius, hover fills `--panel`. |
| `.sb-item.active` | Active page: faint-blue fill `rgba(92,200,255,.12)`, white bold text, 3px inset blue left bar (`box-shadow:inset 3px 0 0 var(--brand)`). |
| `.sb-item.soon` | Disabled "coming soon": faint text, no hover, `.pill` "soon" pushed right. |

### Action-Plan task cards (reusable)

| Class | Use |
|---|---|
| `.plan-task` | Task card in `.plan-grid` (auto-fill `minmax(330px,1fr)`); blue hover. `.is-done` (dimmed, strike-through) / `.is-snoozed` (dimmed, dashed border). |
| `.lnk` / `.lnk.mut` / `.act-ai` | Borderless inline blue text-button ("Mark done", "✨ AI assist"); `.mut` muted. |
| `.plan-ai-out` | `white-space:pre-wrap` AI-output block on `--panel2`, `--radius-xs`. |

## 9. Data-viz & status patterns

| Pattern | Spec |
|---|---|
| **Status pills** | green = good/up/YES/published/pass · red = bad/down/NO/error/reject · amber = caution/pending/needs-improvement. |
| **Conviction pills** | `YES` (green) / `NO` (red) + a mono percent, e.g. `82%`. Shown per advisory model (Gemma, Claude) on decision rows. |
| **Delta indicators** | Small up/down arrow + value in `--mono`; green for improvement, red for decline. |
| **Sparklines** | Inline in table rows for position/trend history; green rising line also lives in the logo mark. |
| **Opportunity Score badge** | 0–100 number, colour-graded green/amber/red by threshold. |
| **Grade badge** | Big A–F letter in a rounded square (`.grade-badge`), green/amber/red tint — Site Health. |
| **KD (difficulty) meters** | Small colour-coded `.meter` bars green→red. |
| **Donut charts** | Traffic-source mix, index distribution. |
| **Core Web Vitals gauges** | 3 radial gauges (LCP / CLS / INP), good / needs-work / poor coloured green/amber/red. |
| **SERP-feature & intent chips** | `.tag` chips for SERP features; intent tags Commercial / Transactional / Informational. |
| **Paid-lookup cost chip** | `.costbar` cost-preview on pages that spend API budget (Keyword Research, SERP Inspector); figure highlighted blue. |
| **Conflict highlighting** | Disagreement on decision rows = a coloured left border + reason text. Always surface Gemma-vs-Claude conflicts; never hide them. |

All numeric values use `.tnum` (tabular mono). Colour follows the semantic palette — no exceptions.

## 10. Page archetypes

| Archetype | Anatomy | Pages |
|---|---|---|
| **Dashboard storytelling** | Lead with a `.hero` north-star metric/chart, then a `.tiles` row of stat tiles with WoW deltas, supporting `.card` panels, optional right-rail snapshot. Story first, not a flat grid. | Overview, Analytics, Spend, Search Console |
| **Decision-loop (product hero)** | Two advisory models (local **Gemma** + stronger **Claude**) each give a YES/NO conviction pill + %; the human decides. Disagreements surfaced via conflict highlighting. An **Autonomy Controls** panel: per-scope sliders, a "needs GATE B" promotion gate, and a red **KILL-SWITCH**. Keep agreement rate + both opinions intact. | Decisions, Thoughts, Action Plan |
| **Review-queue** | A generate bar (topic + type + persona + auto-ground toggle + Generate) over a drafts table with status pills, plus a content calendar and a perf scorecard. | Content |
| **Data-table (reused widely)** | `.toolbar` (search, filters, date range, density toggle, Export) over a dense `table`: sticky uppercase muted header, hairline rows, hover highlight, right-aligned mono numbers, `.pager`, clean `.empty` state; mobile → stacked cards. | Rankings (canonical), Opportunities, Backlinks, Competitors, Indexation, Keyword Research, Domain Finder |
| **Detail / form / wizard** | Step indicator across a multi-step flow; form/card style. Connect-a-domain = 4 steps (Identity → Sources → Pairing → Finalize). | Connect a domain, Settings |

## 11. States

| State | Pattern |
|---|---|
| **Loading** | `.loading` — centred muted "Loading…" text, no border, no heavy skeletons. Plain text then content. |
| **Empty** | `.empty` — centred muted message in a **dashed `--line2`** box on `--panel2`, 46px vertical pad. "No data" / "no project" placeholder. |
| **Error** | Use the signal-red palette (`--neg`): inline red message or `badge.off`; keep the page frame intact, explain plainly. |
| **Not configured / blank-safe** | When a project/connection is missing, render the `.empty` placeholder with a clear next action (e.g. "+ Connect a domain") rather than a broken layout. Pages must be blank-safe with no data. |

## 12. Responsive

Mobile breakpoint: **< 860px**.

| Desktop | Mobile transform |
|---|---|
| 236px sticky sidebar | Slide-in drawer behind ☰ (`--bg2`), revealed on toggle |
| `.tiles` auto-fill grid | Reflows to fewer columns (min 158px), then single column |
| Dense `table` | Stacks into per-row cards |
| Multi-column card rows | Columns stack vertically |
| `.subtabs` pill row | Horizontally scrollable pills |
| `.hero` chart + charts | Go full-width |

Keep all table columns when stacking into cards — density is preserved, not stripped. Top bar stays sticky at 60px.

## 13. Accessibility

- **Contrast:** target **AA**. Ensure sufficient contrast on `--mut` text against panels; don't drop body text below `--mut` for content that must be read.
- **Focus rings:** the blue `--ring` (`0 0 0 3px rgba(92,200,255,.22)`) must be visible on **every** interactive element via `:focus-visible`. Never remove focus outlines.
- **Keyboard reach:** all nav and controls keyboard-reachable; ⌘K search; modals trap and return focus.
- **Reduced motion:** reduced-motion friendly — only short **120–200ms** transitions; no large or looping animation. Respect `prefers-reduced-motion`.

## 14. Tone of UI copy

- **Voice:** plain, expert, a little wry. Short labels.
- **"About this page" accordions** (`.help`) explain a page's purpose and usage without hand-holding.
- **No marketing fluff inside the product** — ever. The app is behind a login; it informs, it doesn't sell.
- Match the brand personality: precise, confident, a little playful; never corporate-bland.

## 15. Do / Don't

| Do | Don't |
|---|---|
| Use the existing `:root` tokens for every colour, radius, shadow, font. | Introduce new hex values, ad-hoc radii, or CDN fonts. |
| Keep green/red/amber/blue semantic meanings fixed. | Recolour signals for aesthetics. |
| Preserve full table density — every column. | Drop columns "to clean it up." |
| Use fictional `.example` data (made-up casino names ending in `.example`). | Use real domains or real brand data. |
| Adopt the ~5-group IA + Settings drawer. | Re-flatten into the legacy ~32-item nav, or add/remove pages. |
| Keep the Gemma → Claude → human loop with both opinions, conviction %, agreement rate, and conflicts. | Flatten it into a generic "approve" inbox. |
| Lead dashboards with the hero/north-star + the brain. | Open with a flat grid of equal tiles. |
| Show a plain "Loading…" then content; blank-safe empty states. | Add skeleton-heavy loads or break on missing data. |
| Visible focus rings + AA contrast on every control. | Remove focus outlines or rely on colour alone. |
| Keep transitions 120–200ms, reduced-motion friendly. | Add long or decorative animation. |

Source files: `app.css`, `app.js`, `DESIGN.md`, `STITCH-BRIEF.md`.
