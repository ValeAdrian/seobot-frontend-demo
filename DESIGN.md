# DESIGN.md — seobot

> Design system for **seobot**, a self-hosted, autonomous SEO platform (a dashboard "brain" that monitors a
> site, proposes scored decisions, and — with human approval — acts on it). This document is the source of
> truth for look & feel. Keep the **dark admin** aesthetic and the **colour tokens** exactly; modernise
> layout, hierarchy, and information density.

## 1. Product in one line
An operator-grade SEO command centre: dense data (rankings, backlinks, analytics) on the left of the brain
(Decisions, Thoughts, Content), all behind a single login. Think *Linear × a trading terminal × an SEO suite* —
calm, dark, fast, information-rich but never cluttered.

## 2. Brand
- **Wordmark:** `seo·bot` — "seo·" in white, **"bot" in green** (`--pos`). Montserrat 700.
- **Logo mark:** a blue magnifier lens (`--acc`) with a small green rising sparkline inside the lens + a handle.
  It signals "search + a bot that makes the line go up."
- **Personality:** precise, confident, a little playful. Never corporate-bland, never neon/gamey.

## 3. Colour — DO NOT CHANGE THESE TOKENS (dark theme)
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0a0d12` | app background (near-black blue) |
| `--bg2` | `#0d1219` | mobile drawer / deep surfaces |
| `--panel` | `#111824` | cards, inputs, table surface |
| `--panel2` | `#0f1521` | insets, hover rows, code blocks |
| `--line` | `#1c2632` | hairline borders / row dividers |
| `--line2` | `#27323f` | stronger borders / focus outlines |
| `--txt` | `#e7eef5` | primary text |
| `--mut` | `#7d8c9b` | secondary / labels |
| `--faint` | `#4d5a68` | disabled / footnotes |
| `--pos` | `#3fd896` | **green** — positive delta, healthy, the "bot" accent, YES |
| `--neg` | `#f4636f` | **red** — negative delta, errors, NO, danger |
| `--warn` | `#f5b14c` | **amber** — warnings, mid states |
| `--acc` / `--brand` | `#5cc8ff` | **blue** — primary accent, links, active nav, primary buttons |
| `--acc2` | `#3a9fd6` | hover/secondary blue, focus border |
| `--brand2` | `#2f7fd6` | gradient end / pressed |

Semantics: **green = good/up, red = bad/down, amber = caution, blue = brand/interactive.** A blue accent ring
(`0 0 0 3px rgba(92,200,255,.22)`) appears on focus.

## 4. Typography
- **Body / UI:** `Roboto` (400/500/700). 15px base, 1.6 line-height.
- **Headings / big numbers / wordmark:** `Montserrat` (600/700), tight letter-spacing (`-.01em`).
- **Numbers in tables, code, tokens, timestamps:** `IBM Plex Mono` (400/500/600), tabular figures.
- Fonts are **vendored woff2, same-origin** (this app lives behind a login — never load fonts from a CDN).

## 5. Shape, depth, spacing
- **Rounding (generous, consistent):** cards/modals/hero `16px`; buttons/inputs/sidebar items `10px`; badges,
  pills, meters, progress bars `999px`; grade badges `10px`.
- **Elevation:** flat surfaces + **soft shadows**, not gradients. `card` shadow `0 1px 2px rgba(0,0,0,.30)`;
  hero/hover `0 4px 14px rgba(3,7,14,.45)`; modal/drawer `0 18px 44px rgba(0,0,0,.50)`.
- **Spacing scale:** 6 / 10 / 14 / 18 / 24px. Cards pad `18px`. Page max-width `1360px`.
- **Borders:** 1px hairlines (`--line`); 2px for grade badges and emphasis.

## 6. Layout shell
- **Top bar** (sticky, 60px, blurred translucent): logo + wordmark · spacer · **Project switcher** (select) ·
  last-updated timestamp.
- **Left sidebar** (236px, sticky): grouped nav (see §8). Active item = blue tint background + blue left bar.
- **Content** (fluid): a page header (Montserrat H1 + a subtle breadcrumb), an optional collapsible "About this
  page" help accordion, then the page body (cards / tables / forms).
- **Mobile (<860px):** sidebar becomes a slide-in drawer behind a ☰ toggle.

## 7. Core components (keep the class names; restyle freely)
- **Card** `.card` — the workhorse surface. Variants: `.cta` (clickable, blue hover), `.plan-first`, `.hero`.
- **Tile** — a stat: tiny uppercase label + a big Montserrat number (`.tile .k` / `.tile .v`). Used in rows of 4–6.
- **Buttons** `.btn` (default), `.btn.primary` (solid blue, dark text), `.btn.danger` (red). Pill-ish, focus ring,
  press translate.
- **Badge** `.badge` (pill): `.ok` (green tint), `.off` (red tint). Used for status (shadow/controlled, YES/NO).
- **Table** — uppercase muted sticky header, hairline rows, hover row highlight, mono numbers.
- **Tag / chip** `.tag` (pill, blue, mono).
- **Toolbar** — a flex row of filters/inputs/buttons above tables.
- **Sub-tabs** `.subtab` — pill tabs for page-internal modes (e.g. keyword-research kinds, rank vs compare).
- **Help accordion** `.help` — collapsible "About this page" under the H1.
- **Meter / progress** — rounded bars (budget, plan progress) coloured pos/warn/neg.
- **Modal** — centred, rounded, soft-shadow overlay.
- **Empty state** `.empty` — dashed-border panel, muted, centred.
- **Grade badge** — a big letter (A–F) in a rounded square, coloured by grade.
- **Charts** — area/line via `lightweight-charts` (blue stroke, faint fill); **donut** + half-radial **gauge** via inline SVG (`donut()`/`gauge()`). All inside cards, all same-origin — never a chart CDN.
- **Icons** — inline-SVG only (Lucide-style, `stroke=currentColor`), via the `ICON` map + `icon(name)`. Sidebar nav, stat tiles, and `.sec-h` section heads carry them. **Never** a Material/icon-font CDN.
- **Bento** `.bento` (12-col) for dashboard hero rows; **icon stat tile** = the upgraded `.tile`/`stat()` (label + corner icon + big value + optional delta); **section head** `.sec-h` (icon + title).

> The full implementation reference — every helper (`icon`, `stat`, `tile`, `secH`, `donut`, `gauge`, `gradeLetter`, `_callBadge`) and where each is applied — is in **DESIGN-SYSTEM.md §16**. Keep it updated when you add components.

## 8. Navigation (CURRENTLY TOO BULKY — please reinvent — see STITCH-BRIEF.md)
Today: ~32 items in 4 groups (Dashboards / Back Office / Project / Global). That's the #1 problem to solve.
The full page inventory + their purposes + a proposed cleaner IA are in **STITCH-BRIEF.md** — read that.

## 9. Tone of UI copy
Plain, expert, a little wry. Short labels. "About this page" accordions explain purpose without hand-holding.
Never marketing fluff inside the product.

## 10. Accessibility & feel
- Sufficient contrast on `--mut` text; visible focus rings on every interactive element.
- Keyboard reachable nav; reduced-motion friendly (short 120–200ms transitions only).
- Fast: no skeleton-heavy loads; a simple "Loading…" then content.

## 11. What to preserve vs. what to improve
- **Preserve:** the colour tokens (§3), the dark theme, the brand, Roboto/Montserrat/Plex-Mono, the semantic
  green/red/amber/blue meanings.
- **Improve:** the navigation/IA (§8), visual hierarchy & density, the dashboard storytelling (lead with the
  north-star + the brain), consistency across the ~40 pages, empty/loading states, responsive behaviour, and
  making the "autonomy brain" (Decisions/Thoughts) feel like the hero of the product.
