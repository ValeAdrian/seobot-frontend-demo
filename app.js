/* seobot SPA — vanilla, no build step. Multi-project from the URL: every data
   call is /api/p/{slug}/... where {slug} is the active project. View is chosen by
   ?view= (query-param routing, like tradebot). Read-only rank/overview; the
   only writes are project/keyword/import/settings/integration management. */
'use strict';

const state = { projects: [], active: null, view: 'overview', page: 1 };

// ---- nav model (IA per SEO-Bot-Product-Plan §4: Dashboards / Back Office / Project / Global) ----
const NAV = [
  { group: 'Dashboards', items: [
    { id: 'overview',       label: 'Overview' },
    { id: 'action-plan',    label: 'Action Plan' },
    { id: 'thoughts',       label: 'Thoughts' },
    { id: 'decisions',      label: 'Decisions' },
    { id: 'content',        label: 'Content' },
    { id: 'opportunities',  label: 'Opportunities' },
    { id: 'rank',           label: 'Rank Tracking' },
    { id: 'rank-compare',   label: 'Rank Compare' },
    { id: 'backlinks',      label: 'Backlinks Profile' },
    { id: 'competitors',    label: 'Competitors' },
    { id: 'search-console', label: 'Search Console' },
    { id: 'bing',           label: 'Bing Webmaster' },
    { id: 'analytics',      label: 'Analytics' },
    { id: 'site-health',    label: 'Site Health' },
    { id: 'report',         label: 'Weekly Report' },
  ]},
  { group: 'Back Office', items: [
    { id: 'keyword-research', label: 'Keyword Research' },
    { id: 'serp-inspector',   label: 'SERP Inspector' },
    { id: 'site-audit',       label: 'Site Audit' },
    { id: 'crawl',            label: 'Site Crawl' },
    { id: 'domains',          label: 'Domain Finder' },
    { id: 'indexation',       label: 'Indexation' },
    { id: 'bulk-tools',       label: 'Bulk Tools' },
    { id: 'imports',          label: 'Imports' },
  ]},
  { group: 'Project', items: [
    { id: 'alerts',           label: 'Alerts' },
    { id: 'connections',      label: 'Connections' },
    { id: 'project-settings', label: 'Project Settings' },
  ]},
  { group: 'Global', items: [
    { id: 'connect',      label: 'Connect a domain' },
    { id: 'projects',     label: 'Projects' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'spend',        label: 'Spend' },
    { id: 'logs',         label: 'Logs' },
    { id: 'settings',     label: 'Settings' },
  ]},
];
const VALID_VIEWS = new Set(NAV.flatMap(g => g.items.map(i => i.id)));
const SOON = new Set(NAV.flatMap(g => g.items.filter(i => i.soon).map(i => i.id)));

// ---- helpers ----
const $ = (sel, root = document) => root.querySelector(sel);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
async function api(path, opts = {}) {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) {
    let detail = res.statusText;
    try { detail = (await res.json()).detail || detail; } catch (_) {}
    throw new Error(`${res.status}: ${detail}`);
  }
  return res.status === 204 ? null : res.json();
}
function setUpdated() { $('#updated').textContent = new Date().toLocaleTimeString(); }
function fmtPos(p) { return p == null ? '—' : p; }

// ---- inline SVG icons (Lucide-style, no CDN; stroke=currentColor) ----
const ICON = {
  overview: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  decisions: '<path d="m16 16 3-8 3 8c-2 1.3-4 1.3-6 0Z"/><path d="m2 16 3-8 3 8c-2 1.3-4 1.3-6 0Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7c2 0 4-1 6-2 2 1 4 2 6 2"/>',
  thoughts: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5A6 6 0 1 0 6 8c0 1.3.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  plan: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  content: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  opportunities: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
  rank: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
  compare: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M12 6h4a2 2 0 0 1 2 2v7"/><path d="M12 18H8a2 2 0 0 1-2-2V9"/>',
  backlinks: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.4"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.4"/>',
  competitors: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/>',
  analytics: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6" rx="1"/><rect x="12" y="7" width="3" height="10" rx="1"/><rect x="17" y="13" width="3" height="4" rx="1"/>',
  health: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  report: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 18v-3"/><path d="M12 18v-6"/><path d="M16 18v-4"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.6-9.6"/><path d="m16.5 7.5 3 3 2-2-3-3"/>',
  serp: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="11" cy="11" r="2.5"/><path d="m16 16-3-3"/>',
  audit: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  crawl: '<path d="M12 20v-9"/><rect x="8" y="6" width="8" height="9" rx="4"/><path d="M8.5 3 10 5M15.5 3 14 5"/><path d="M3 9h3M18 9h3M2.5 14H6M18 14h3.5M4 19l3-2M20 19l-3-2"/>',
  domains: '<circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/>',
  indexation: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  bulk: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  imports: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5-5 5 5"/><path d="M12 5v12"/>',
  alerts: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  connections: '<path d="M9 2v6M15 2v6"/><path d="M18 8H6v3a6 6 0 0 0 12 0z"/><path d="M12 17v5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  projects: '<path d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-1.5-2H8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/><path d="M2 8v11a2 2 0 0 0 2 2h14"/>',
  integrations: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 7V3M15 7V3M9 21v-4M15 21v-4M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  spend: '<path d="M12 1.5v21"/><path d="M17 6H9.5a3.3 3.3 0 0 0 0 6.6h5a3.3 3.3 0 0 1 0 6.6H6"/>',
  logs: '<path d="M8 21h11a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 4 0V8h6"/><path d="M14 8h3M14 12h3M9 16h8"/>',
  connect: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  // stat / section glyphs
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  star: '<path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 18.6 6.7 19.4l1.2-6-4.5-4.1 6-.7z"/>',
  leaderboard: '<path d="M16 4h3v16h-3zM5 10h3v10H5zM10.5 7h3v13h-3z"/>',
  pulse: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
  zap: '<path d="M13 2 3 14h8l-1 8 11-13h-8z"/>',
  brain: '<path d="M12 5a3 3 0 0 0-6 .5A3 3 0 0 0 4 11a3 3 0 0 0 2 5 3 3 0 0 0 6 .5z"/><path d="M12 5a3 3 0 0 1 6 .5A3 3 0 0 1 20 11a3 3 0 0 1-2 5 3 3 0 0 1-6 .5z"/><path d="M12 5v12"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  up: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
  down: '<path d="M12 5v14"/><path d="m5 12 7 7 7-7"/>',
};
function icon(name, cls = '') { return `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[name] || ''}</svg>`; }
// map each nav view id → an icon name
const NAV_ICON = {
  'overview': 'overview', 'action-plan': 'plan', 'thoughts': 'thoughts', 'decisions': 'decisions',
  'content': 'content', 'opportunities': 'opportunities', 'rank': 'rank', 'rank-compare': 'compare',
  'backlinks': 'backlinks', 'competitors': 'competitors', 'search-console': 'search', 'bing': 'globe',
  'analytics': 'analytics', 'site-health': 'health', 'report': 'report', 'keyword-research': 'key',
  'serp-inspector': 'serp', 'site-audit': 'audit', 'crawl': 'crawl', 'domains': 'domains',
  'indexation': 'indexation', 'bulk-tools': 'bulk', 'imports': 'imports', 'alerts': 'alerts',
  'connections': 'connections', 'project-settings': 'settings', 'connect': 'connect', 'projects': 'projects',
  'integrations': 'integrations', 'spend': 'spend', 'logs': 'logs', 'settings': 'settings',
};
// icon stat tile: label + corner icon, big value, optional delta {dir:'up'|'down'|'flat', text}
function stat(k, v, ic, delta, small) {
  const d = delta ? `<span class="delta ${delta.dir}">${delta.dir === 'up' ? icon('up', 'sm') : delta.dir === 'down' ? icon('down', 'sm') : ''}${esc(delta.text)}</span>` : '';
  return `<div class="card stat hov">
    <div class="stat-top"><span class="k">${esc(k)}</span>${ic ? icon(ic, 'stat-ico') : ''}</div>
    <div class="v ${small ? 'sm' : ''} tnum">${esc(v)}</div>${d}</div>`;
}

// ---- chrome ----
function renderSidebar() {
  const sb = $('#sidebar');
  sb.innerHTML = NAV.map(g => `
    <div class="sb-group">${esc(g.group)}</div>
    ${g.items.map(i => `
      <button class="sb-item ${i.id === state.view ? 'active' : ''} ${i.soon ? 'soon' : ''}"
              data-view="${i.id}" ${i.soon ? 'disabled' : ''}>
        ${icon(NAV_ICON[i.id] || 'overview')}<span class="lbl">${esc(i.label)}</span>${i.soon ? '<span class="pill">soon</span>' : ''}
      </button>`).join('')}
  `).join('');
  sb.querySelectorAll('.sb-item:not(.soon)').forEach(btn =>
    btn.addEventListener('click', () => { go(btn.dataset.view); document.body.classList.remove('nav-open'); }));
}

function renderProjectSelect() {
  const sel = $('#projectSelect');
  sel.innerHTML = state.projects.map(p =>
    `<option value="${esc(p.slug)}" ${p.slug === state.active ? 'selected' : ''}>${esc(p.name)}</option>`).join('');
  sel.disabled = state.projects.length === 0;
}

function go(view) {
  if (!VALID_VIEWS.has(view) || SOON.has(view)) return;
  state.view = view; state.page = 1;
  const url = new URL(location.href);
  url.searchParams.set('view', view);
  ['band', 'movement', 'search', 'tag'].forEach(k => url.searchParams.delete(k));  // drop stale filters
  history.pushState({}, '', url);
  renderSidebar();
  route();
}

// Navigate to a view AND pre-set its filters (deep-link, e.g. Overview → Rank "quick wins").
function goFiltered(view, params) {
  if (!VALID_VIEWS.has(view) || SOON.has(view)) return;
  state.view = view; state.page = 1;
  const url = new URL(location.href);
  url.searchParams.set('view', view);
  ['band', 'movement', 'search', 'tag'].forEach(k => url.searchParams.delete(k));
  Object.entries(params || {}).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
  history.pushState({}, '', url);
  renderSidebar();
  route();
}

// ---- views ----
const view = (html) => { $('#view').innerHTML = html; };

// Per-page help: purpose + how-to, shown in a COLLAPSED accordion at the top of every page
// (injected by head() from the active view id). Keep each to ~2 sentences.
const HELP = {
  'overview': 'Your daily dashboard — visibility trend, keyword tiles, top movers, quick wins, Action Plan progress, and the AI strategist briefing. Use it as a morning check-in; click any card to jump into the detail.',
  'action-plan': 'A prioritized, grouped to-do list (Easy Wins / On-page / Technical / Content / Off-page / Social) built from your live data + SEO best practice. Tick tasks done, hit “+ Live signals” for fresh DR/GSC, or “✨ AI assist” on a task for specific copy/outreach.',
  'content': 'The Content Platform: generate grounded, on-brand drafts (optionally auto-grounded in the live SERP), review them, then approve or drip-schedule to a connected site. Published pages show a performance verdict (indexed? ranking?) so you can refresh under-performers.',
  'logs': 'The app error log — any unhandled server error is recorded here (time, endpoint, message). Click a row for the full traceback. Use it to diagnose failures without SSH; “Clear all” empties it.',
  'connect': 'Spin up a new site in one flow: create the project → connect data sources → pair the site with the seobot Connector plugin (one token) → seed keywords + a starter content plan → then the autonomy brain starts watching (Thoughts + Decisions). Each step unlocks the next; nothing edits the site without you.',
  'opportunities': 'Every tracked keyword scored for ROI (position × volume × difficulty × intent). Use it to pick the best keywords to push next; click a keyword for its rank history, or filter by cluster.',
  'rank': 'Daily rank tracking for your keywords, with position-band filters. Use it to monitor movement; filter to “Quick wins 8–20” for keywords one push from page 1, and export to CSV.',
  'rank-compare': 'Side-by-side of DataForSEO (live AU SERP) vs the Ahrefs rank tracker. Use it to cross-check where you actually rank when the two sources disagree.',
  'backlinks': 'Your backlink profile via Ahrefs — Domain Rating, referring domains, and toxic-link flagging. Use it to spot spam/PBN links and download a Google disavow file.',
  'competitors': 'Track rival domains and find keyword gaps. Use it to see what competitors rank for that you don’t, then add those keywords to your tracking.',
  'search-console': 'Google Search Console queries (clicks/impressions/CTR/position) via the linked Ahrefs project. Use it to find high-impression, low-CTR pages worth a title/meta rewrite.',
  'bing': 'Bing Webmaster search performance for your site — queries, clicks, impressions. Use it to see Bing demand separately from Google.',
  'analytics': 'Traffic + engagement via Ahrefs Web Analytics. Use it for a quick read on visitors, sources, and top pages.',
  'site-health': 'Core Web Vitals (LCP/CLS/performance score) via PageSpeed Insights, tracked over time. Use it to catch performance regressions; run a fresh snapshot anytime.',
  'report': 'A printable weekly summary of rank, backlinks, and site health. Use it to share progress or archive a point-in-time snapshot.',
  'thoughts': 'The brain’s reasoning feed. The detector turns signals into scored decisions; local Gemma proposes a call ($0), then Claude reviews in batches of 10 for the authoritative verdict. Each card shows the deterministic suggestion, Gemma’s call, Claude’s call, and (once measured) whether they agreed. Read-only — act on them in Decisions.',
  'decisions': 'Your approve/disapprove queue for decisions Claude has reviewed. Approving records your call as the authority (the system learns your taste); if you OVERRULE the model, it web-searches and opens a discussion to reconcile — reply in the thread. SHADOW: nothing edits the live site yet. The header shows Gemma↔Claude agreement and whether the hit-rate is control-validated.',
  'keyword-research': 'Discover keyword ideas, volume, difficulty, and SERP data (DataForSEO). Use it to find and save new keywords to track — paid actions show a cost preview within your budget cap.',
  'serp-inspector': 'See the live SERP for any keyword (top results + SERP features). Use it to understand intent and who you’re up against before targeting a term.',
  'site-audit': 'On-page audit of a single URL (title/meta/H1/checks). Use it to spot quick on-page fixes for one specific page.',
  'crawl': 'A full-site OnPage crawl (DataForSEO) surfacing site-wide technical issues — broken links, duplicate titles, thin content. Submitting a crawl has a cost (shown before you confirm).',
  'domains': 'Hunt recently expired/dropped domains relevant to you (Australian OR casino/gambling) for parasite-SEO / 301 rebuilds. Scan the free daily feed (or paste any list), score authority with Ahrefs, and save the best to your watchlist.',
  'indexation': 'Is Google actually indexing your pages + parasite placements? Add URLs and “Check all” runs a `site:` lookup on each (≈$0.002/URL). Content that isn’t indexed can’t rank — critical to watch on a new site.',
  'bulk-tools': 'Bulk keyword actions — tag, delete, and manage many keywords at once. Use it to organize keywords into clusters/silos quickly.',
  'imports': 'Upload an Ahrefs CSV export to create + track keywords. Use it to seed keywords from an external list.',
  'alerts': 'Configure rank-change alert rules (big drops, entering/leaving the top 10) delivered via Telegram. Use it to get pinged about important movements.',
  'connections': 'Connect a website with the seobot Connector plugin (pull model). Create a connection → paste its token into the plugin on the site → the site polls seobot for publish jobs + reports back. No API keys, no inbound access. The publish/scheduling pipeline (Content Platform) runs through this.',
  'project-settings': 'Per-project settings — vertical (tailors the Action Plan’s link/social ideas), the Ahrefs project id, and alert rules. Use it to configure how this project behaves.',
  'projects': 'Create and switch between projects — each is fully isolated. Use it to manage multiple sites from one install.',
  'integrations': 'Connect + check your data sources (DataForSEO, Ahrefs, Bing, PageSpeed, Telegram, AI). Use it to see what’s connected and validate credentials.',
  'spend': 'Track API cost — DataForSEO budget caps + this month’s AI assistant cost (by purpose and model). Use it to watch spend and edit your caps.',
  'settings': 'Global settings + budget caps shared across all projects. Use it for app-wide configuration.',
};
function helpAccordion(viewId) {
  const body = HELP[viewId];
  if (!body) return '';
  return `<details class="help"><summary>About this page <span class="mut">— purpose &amp; how to use it</span></summary>
    <div class="help-body">${body}</div></details>`;
}
const head = (title, crumb) =>
  `<div class="page-head"><h1>${esc(title)}</h1><span class="crumb">${esc(crumb || '')}</span></div>` +
  helpAccordion(state.view);

async function viewOverview() {
  const p = state.active;
  if (!p) return view(head('Overview') + `<div class="empty">No project yet. Create one in <b>Projects</b>.</div>`);
  view(head('Overview', activeName()) + `<div class="loading">Loading…</div>`);
  const [s, sp, activity, planp, strat, serpf] = await Promise.all([
    api(`/api/p/${p}/rank/summary`),
    api('/api/spend').catch(() => null),
    api(`/api/p/${p}/activity`).catch(() => ({ items: [] })),
    api(`/api/p/${p}/plan/progress`).catch(() => null),
    api(`/api/p/${p}/strategist`).catch(() => null),
    api(`/api/p/${p}/serp-features`).catch(() => null),
  ]);
  const t = s.tiles;
  const hasTrend = (s.trend || []).length > 0;
  // movers + quick-wins are computed server-side (over ALL keywords) in rank/summary.
  const up = (s.movers && s.movers.up) || [];
  const down = (s.movers && s.movers.down) || [];
  const quickWins = s.quick_wins ?? 0;
  const moverDelta = m => m > 0 ? `<span class="move-up">▲ ${m}</span>`
    : m < 0 ? `<span class="move-down">▼ ${Math.abs(m)}</span>` : '<span class="mut">0</span>';
  const moverRows = arr => arr.length ? arr.map(r =>
    `<tr><td>${esc(r.keyword)}</td><td class="tnum">${fmtPos(r.position)}</td><td class="tnum">${moverDelta(r.movement)}</td></tr>`).join('')
    : `<tr><td colspan="3"><span class="mut">none yet</span></td></tr>`;
  const actRows = (activity.items || []).length ? activity.items.map(a =>
    `<div class="actrow"><span class="tag">${esc(a.type)}</span><span>${esc(a.label)}</span>
      <span class="mut">${esc(a.meta || '')}${a.cost != null ? ` · $${a.cost}` : ''}</span></div>`).join('')
    : '<span class="mut">No activity yet.</span>';
  const trendVals = (s.trend || []).map(d => d.visibility);
  const vd = trendVals.length > 1 ? +(trendVals[trendVals.length - 1] - trendVals[0]).toFixed(1) : null;
  const vdHtml = vd == null ? '' : `<span class="delta ${vd > 0 ? 'up' : vd < 0 ? 'down' : 'flat'}">${vd > 0 ? icon('up', 'sm') : vd < 0 ? icon('down', 'sm') : ''}${Math.abs(vd)}</span>`;
  const rankPct = t.tracked_keywords ? Math.round((t.ranking_keywords / t.tracked_keywords) * 100) : 0;
  view(head('Overview', activeName()) + `
    <div class="bento">
      <div class="card c8">
        <div class="card-head">
          <div><span class="k" style="font-size:11px;color:var(--mut);text-transform:uppercase;letter-spacing:.07em;font-weight:500">Search visibility</span>
            <div style="display:flex;align-items:baseline;gap:9px;margin-top:3px"><span class="big tnum" style="font-size:34px">${t.visibility ?? 0}</span>${vdHtml}</div></div>
          <span class="sec-h" style="font-size:12px;color:var(--mut)">${icon('rank', 'sm')} 30-day trend</span>
        </div>
        <div id="heroChart"></div>
        ${hasTrend ? '' : `<div class="empty" style="margin:8px 0 6px">No rank history yet — run the rank worker (Settings shows the command) to populate the trend.</div>`}
      </div>
      <div class="card c4">
        <div class="card-head"><span class="sec-h">${icon('target')} Keyword health</span></div>
        <div class="big tnum" style="font-size:32px">${t.tracked_keywords ?? 0}</div>
        <div class="mut" style="font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;margin-top:2px">tracked keywords</div>
        <div style="margin-top:12px">
          <div class="kv-row"><span class="mut">Ranking</span><b class="tnum pos">${t.ranking_keywords ?? 0}</b></div>
          <div class="kv-row"><span class="mut">Top 3</span><b class="tnum">${t.top3 ?? 0}</b></div>
          <div class="kv-row"><span class="mut">Top 10</span><b class="tnum">${t.top10 ?? 0}</b></div>
        </div>
        <div class="meter" style="margin-top:14px"><div class="meter-fill pos" style="width:${rankPct}%"></div></div>
        <div class="mut" style="font-size:11px;margin-top:6px">${rankPct}% of tracked keywords ranking</div>
      </div>
    </div>
    <div class="grid tiles">
      ${stat('Avg position', t.avg_position ?? '—', 'target', null, true)}
      ${stat('Top 3 results', t.top3 ?? 0, 'star')}
      ${stat('Top 10 results', t.top10 ?? 0, 'leaderboard')}
      ${stat('Quick wins', quickWins, 'zap')}
      ${stat('DataForSEO MTD', sp ? '$' + sp.mtd : '—', 'spend', null, true)}
    </div>
    <div class="bento" style="margin-top:16px">
      <div class="card cta c6" id="qwCard" style="cursor:pointer">
        <div class="card-head"><span class="sec-h">${icon('zap')} Quick wins <small class="mut">— ${quickWins}</small></span><span class="btn">Open in Rankings ${icon('arrow', 'sm')}</span></div>
        <div class="mut" style="font-size:12.5px">Keywords in positions 8–20 — one push from page 1.</div>
      </div>
      ${planp ? `<div class="card cta c6" id="planCard" style="cursor:pointer">
        <div class="card-head"><span class="sec-h">${icon('plan')} Action Plan <small class="mut">— ${planp.done || 0}/${planp.total || 0} done</small></span><span class="btn">Open ${icon('arrow', 'sm')}</span></div>
        <div class="mut" style="font-size:12.5px">${(planp.top && planp.top[0]) ? 'Next: ' + esc(planp.top[0].title) : 'Your prioritized, grouped next actions.'}</div>
        <div class="plan-progress-bar" style="margin-top:10px"><span style="width:${planp.total ? Math.round((planp.done || 0) / planp.total * 100) : 0}%"></span></div>
      </div>` : '<div class="c6"></div>'}
    </div>
    ${strategistCard(strat)}
    <div class="bento" style="margin-top:16px">
      <div class="card c6"><div class="card-head"><span class="sec-h">${icon('up')} Top climbers <small class="mut">7d</small></span></div>
        <table><thead><tr><th>Keyword</th><th>Pos</th><th>Δ</th></tr></thead><tbody>${moverRows(up)}</tbody></table></div>
      <div class="card c6"><div class="card-head"><span class="sec-h">${icon('down')} Top fallers <small class="mut">7d</small></span></div>
        <table><thead><tr><th>Keyword</th><th>Pos</th><th>Δ</th></tr></thead><tbody>${moverRows(down)}</tbody></table></div>
    </div>
    ${serpCard(serpf)}
    <div class="card" style="margin-top:16px"><div class="card-head"><span class="sec-h">${icon('pulse')} Recent activity</span></div><div>${actRows}</div></div>`);
  if (hasTrend) drawHero(s.trend);
  const qw = $('#qwCard');
  if (qw) qw.addEventListener('click', () => goFiltered('rank', { band: 'quick_wins' }));
  const pc = $('#planCard');
  if (pc) pc.addEventListener('click', () => go('action-plan'));
  wireStrategist(p);
  setUpdated();
}

// ---- SERP-features panel (which features appear + who owns the SERPs) ----
function serpCard(d) {
  if (!d || !d.keywords_with_serp) return '';
  const feats = (d.features || []).slice(0, 12).map(f =>
    `<span class="tag">${esc(f.feature.replace(/_/g, ' '))} · ${f.keywords}</span>`).join(' ') || '<span class="mut">none</span>';
  const owners = (d.owners || []).slice(0, 10).map(o =>
    `<tr><td>${esc(o.domain)}</td><td class="tnum">${o.appearances}</td></tr>`).join('') || '<tr><td colspan="2"><span class="mut">—</span></td></tr>';
  return `<div class="card" style="margin-top:14px"><h3>🔎 SERP features <span class="mut" style="font-size:11px">across ${d.keywords_with_serp} tracked SERPs</span></h3>
    <p class="mut" style="font-size:12px;margin:4px 0 8px">Which SERP elements appear on the keywords you target, and which domains own the organic results. Captured free from the daily rank pull.</p>
    <div>${feats}</div>
    <div class="card" style="margin-top:12px;max-width:440px;padding:4px 4px 8px"><h3 style="font-size:13px;padding:8px 8px 2px">Who owns these SERPs</h3>
      <table><thead><tr><th>Domain</th><th>In top-5 of N</th></tr></thead><tbody>${owners}</tbody></table></div></div>`;
}

// ---- AI strategist panel (daily briefing) ----
function mdLite(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
function strategistCard(strat) {
  if (!strat || (!strat.ai_enabled && !strat.briefing)) return '';   // hidden until AI is on
  const b = strat.briefing;
  const body = b
    ? `<div class="plan-ai-out" style="margin-top:8px">${mdLite(b.summary)}</div>
       <div class="mut" style="font-size:10.5px;margin-top:6px">${esc((b.created_at || '').slice(0, 10))}${b.reason ? ' · ' + esc(b.reason) : ''}</div>`
    : `<div class="mut" style="font-size:12.5px;margin-top:6px">No briefing yet — generate the first one, or wait for the daily pass.</div>`;
  return `<div class="card" id="stratCard" style="margin-top:14px">
    <div class="row" style="align-items:center"><h3 style="flex:0">🧠 AI strategist</h3>
      <div class="spacer"></div>
      <button class="btn" id="stratRun">${b ? 'Refresh' : 'Generate'}</button></div>
    ${body}</div>`;
}
function wireStrategist(p) {
  const btn = $('#stratRun');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    btn.disabled = true; btn.textContent = 'Thinking…';
    try { await api(`/api/p/${p}/strategist/run`, { method: 'POST', body: '{}' }); viewOverview(); }
    catch (e) { btn.disabled = false; btn.textContent = 'Refresh'; alert('Strategist failed: ' + e.message); }
  });
}
const tile = (k, v, small) =>
  `<div class="card tile"><div class="k">${esc(k)}</div><div class="v ${small ? 'small' : ''} tnum">${esc(v)}</div></div>`;

function drawHero(trend) {
  const elc = $('#heroChart');
  const data = trend.map(d => ({ time: d.date, value: d.visibility }));
  if (window.LightweightCharts && elc) {
    elc.innerHTML = '';
    const chart = LightweightCharts.createChart(elc, {
      height: 180, layout: { background: { color: 'transparent' }, textColor: '#7d8c9b' },
      grid: { vertLines: { color: '#1c2632' }, horzLines: { color: '#1c2632' } },
      rightPriceScale: { borderColor: '#27323f' }, timeScale: { borderColor: '#27323f' },
      handleScroll: false, handleScale: false,
    });
    const series = chart.addAreaSeries
      ? chart.addAreaSeries({ lineColor: '#5cc8ff', topColor: 'rgba(92,200,255,.35)', bottomColor: 'rgba(92,200,255,.02)', lineWidth: 2 })
      : chart.addLineSeries({ color: '#5cc8ff', lineWidth: 2 });
    series.setData(data);
    chart.timeScale().fitContent();
  } else if (elc) {
    elc.innerHTML = sparkline(data.map(d => d.value));
  }
}
function sparkline(vals) {
  if (!vals.length) return '';
  const w = 600, h = 160, max = Math.max(...vals, 1), min = Math.min(...vals, 0);
  const pts = vals.map((v, i) => {
    const x = (i / Math.max(vals.length - 1, 1)) * w;
    const y = h - ((v - min) / Math.max(max - min, 1)) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:170px">
    <polyline points="${pts}" fill="none" stroke="#5cc8ff" stroke-width="2"/></svg>`;
}

async function viewRank() {
  const p = state.active;
  if (!p) return view(head('Rank Tracking') + `<div class="empty">No project yet.</div>`);
  const filterQuery = () => {
    const f = state._rankFilters || { search: '', movement: 'all', tag: '', band: 'all' };
    const q = new URLSearchParams({ movement: f.movement, band: f.band || 'all' });
    if (f.search) q.set('search', f.search);
    if (f.tag) q.set('tag', f.tag);
    return q;
  };
  const render = async () => {
    const q = filterQuery();
    q.set('page', state.page); q.set('page_size', 50);
    const data = await api(`/api/p/${p}/rank?${q}`);
    const tags = [...new Set(data.items.flatMap(r => r.tags))].sort();
    const rows = data.items.map(r => `
      <tr>
        <td><input type="checkbox" class="rowsel" data-id="${r.keyword_id}" ${state._rankSel.has(r.keyword_id) ? 'checked' : ''}></td>
        <td><a href="#" class="kwlink" data-kw-id="${r.keyword_id}" data-kw="${esc(r.keyword)}">${esc(r.keyword)}</a></td>
        <td>${r.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('') || '<span class="mut">—</span>'}</td>
        <td class="tnum">${fmtPos(r.position)}</td>
        <td class="tnum mut">${fmtPos(r.previous_position)}</td>
        <td class="tnum">${movementCell(r)}</td>
        <td class="tnum mut">${r.search_volume ?? '—'}</td>
        <td class="tnum mut">${r.keyword_difficulty ?? '—'}</td>
        <td>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(shortUrl(r.url))}</a>` : '<span class="mut">—</span>'}</td>
        <td class="mut">${esc(r.checked_on || '—')}</td>
      </tr>`).join('');
    $('#rankBody').innerHTML = rows || `<tr><td colspan="10"><div class="empty">No keywords match.</div></td></tr>`;
    $('#rankBody').querySelectorAll('.kwlink').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); showKeywordHistory(p, a.dataset.kwId, a.dataset.kw); }));
    $('#rankBody').querySelectorAll('.rowsel').forEach(c => c.addEventListener('change', () => {
      const id = +c.dataset.id;
      if (c.checked) state._rankSel.add(id); else state._rankSel.delete(id);
      updateBulkBar(); }));
    const selAll = $('#selAll'); if (selAll) selAll.checked = false;
    $('#rankTotal').textContent = data.total;
    const pages = Math.max(1, Math.ceil(data.total / data.page_size));
    $('#rankPage').textContent = `page ${data.page} of ${pages}`;
    $('#rankPrev').disabled = data.page <= 1;
    $('#rankNext').disabled = data.page >= pages;
    // populate tag filter once
    const tagSel = $('#fTag');
    if (tagSel && tagSel.dataset.filled !== '1' && tags.length) {
      tagSel.innerHTML = `<option value="">All tags</option>` + tags.map(t => `<option>${esc(t)}</option>`).join('');
      tagSel.dataset.filled = '1';
      const want = (state._rankFilters || {}).tag;
      if (want) tagSel.value = want;  // reflect a URL/deep-linked tag once options exist
    }
  };
  view(head('Rank Tracking', activeName()) + `
    <div class="toolbar">
      <input id="fSearch" class="grow" type="search" placeholder="Search keyword…">
      <select id="fMovement">
        <option value="all">All movement</option>
        <option value="up">Improved ↑</option>
        <option value="down">Dropped ↓</option>
        <option value="new">New</option>
        <option value="lost">Lost</option>
        <option value="same">No change</option>
      </select>
      <select id="fBand" title="Position band">
        <option value="all">All positions</option>
        <option value="top3">Top 3</option>
        <option value="top10">Top 10</option>
        <option value="quick_wins">Quick wins (8–20)</option>
        <option value="page2">Page 2 (11–20)</option>
        <option value="unranked">Unranked</option>
      </select>
      <select id="fTag"><option value="">All tags</option></select>
      <button class="btn" id="rankExport" title="Download the filtered table">Export CSV</button>
    </div>
    <div class="bulkbar" id="rankBulk" style="display:none">
      <span><b id="rankSelCount">0</b> selected</span>
      <input id="bulkTag" type="text" placeholder="tag" style="max-width:160px">
      <button class="btn" id="bulkAdd">+ Add tag</button>
      <button class="btn" id="bulkRemove">− Remove tag</button>
      <div class="spacer"></div>
      <span id="bulkMsg" class="mut" style="font-size:12px"></span>
      <button class="btn" id="bulkClear">Clear</button>
      <button class="btn danger" id="bulkDelete">Delete selected</button>
    </div>
    <div class="card" style="padding:4px 4px 10px">
      <table>
        <thead><tr><th class="selcol"><input type="checkbox" id="selAll" title="Select all on page"></th><th>Keyword</th><th>Tags</th><th>Pos</th><th>Prev</th><th>Move</th><th>Vol</th><th>KD</th><th>URL</th><th>Checked</th></tr></thead>
        <tbody id="rankBody"><tr><td colspan="10"><div class="loading">Loading…</div></td></tr></tbody>
      </table>
    </div>
    <div class="pager">
      <span><b id="rankTotal">0</b> keywords · <span class="mut">click a keyword for its history</span></span>
      <button class="btn" id="rankPrev">‹ Prev</button>
      <span id="rankPage">page 1</span>
      <button class="btn" id="rankNext">Next ›</button>
    </div>`);
  // seed filters from the URL (so Overview's "quick wins" deep-link + bookmarks work)
  const up = new URLSearchParams(location.search);
  const initial = { search: up.get('search') || '', movement: up.get('movement') || 'all',
    tag: up.get('tag') || '', band: up.get('band') || 'all' };
  state._rankFilters = initial;
  state._rankSel = new Set();
  $('#fSearch').value = initial.search;
  $('#fMovement').value = initial.movement;
  $('#fBand').value = initial.band;
  function updateBulkBar() {
    const bar = $('#rankBulk'); if (!bar) return;
    const n = state._rankSel.size;
    bar.style.display = n ? 'flex' : 'none';
    const c = $('#rankSelCount'); if (c) c.textContent = n;
  }
  const apply = () => { state.page = 1; state._rankFilters = {
    search: $('#fSearch').value.trim(), movement: $('#fMovement').value,
    tag: $('#fTag').value, band: $('#fBand').value }; render(); };
  $('#fSearch').addEventListener('input', debounce(apply, 300));
  $('#fMovement').addEventListener('change', apply);
  $('#fBand').addEventListener('change', apply);
  $('#fTag').addEventListener('change', apply);
  $('#rankExport').addEventListener('click', () => { window.location = `/api/p/${p}/rank/export.csv?${filterQuery()}`; });
  $('#rankPrev').addEventListener('click', () => { if (state.page > 1) { state.page--; render(); } });
  $('#rankNext').addEventListener('click', () => { state.page++; render(); });
  // ---- bulk select / tag / delete ----
  $('#selAll').addEventListener('change', e => {
    $('#rankBody').querySelectorAll('.rowsel').forEach(c => {
      c.checked = e.target.checked;
      const id = +c.dataset.id;
      if (e.target.checked) state._rankSel.add(id); else state._rankSel.delete(id);
    });
    updateBulkBar();
  });
  const doBulk = async (fn) => {
    $('#bulkMsg').textContent = 'Working…';
    try { const r = await fn(); $('#bulkMsg').innerHTML = `<span class="pos">done</span>`;
      state._rankSel.clear(); await render(); updateBulkBar(); return r; }
    catch (e) { $('#bulkMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  };
  const bulkTag = (key) => { const t = $('#bulkTag').value.trim(); if (!t) { $('#bulkMsg').textContent = 'Enter a tag.'; return; }
    doBulk(() => api(`/api/p/${p}/keywords/bulk-tag`, { method: 'POST',
      body: JSON.stringify({ keyword_ids: [...state._rankSel], [key]: [t] }) })); };
  $('#bulkAdd').addEventListener('click', () => bulkTag('add'));
  $('#bulkRemove').addEventListener('click', () => bulkTag('remove'));
  $('#bulkDelete').addEventListener('click', () => {
    const n = state._rankSel.size;
    if (!confirm(`Delete ${n} keyword(s)? This also removes their rank history.`)) return;
    doBulk(() => api(`/api/p/${p}/keywords/bulk-delete`, { method: 'POST',
      body: JSON.stringify({ keyword_ids: [...state._rankSel] }) })); });
  $('#bulkClear').addEventListener('click', () => {
    state._rankSel.clear();
    $('#rankBody').querySelectorAll('.rowsel').forEach(c => c.checked = false);
    const sa = $('#selAll'); if (sa) sa.checked = false;
    updateBulkBar(); });
  await render();
  setUpdated();
}

// ---- modal + keyword history drill-down ----
function escClose(e) { if (e.key === 'Escape') closeModal(); }
function closeModal() {
  const m = $('#modal'); if (m) m.remove();
  document.removeEventListener('keydown', escClose);
}
function openModal(title, bodyHtml) {
  closeModal();
  const m = document.createElement('div');
  m.id = 'modal'; m.className = 'modal-overlay';
  m.innerHTML = `<div class="modal"><div class="modal-head"><h3>${esc(title)}</h3>
    <button class="btn" id="modalX" aria-label="Close">✕</button></div>
    <div class="modal-body">${bodyHtml}</div></div>`;
  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) closeModal(); });
  $('#modalX').addEventListener('click', closeModal);
  document.addEventListener('keydown', escClose);
  return m;
}

// content-brief prompt (no API cost — runs in the user's own Claude Max)
async function showBriefPrompt(p, keyword) {
  openModal(`Content brief · ${keyword}`,
    `<p class="mut" style="font-size:12px">Paste this into Claude Code or claude.ai (your Max plan) — it analyses the live SERP and returns a full content brief. No API cost here.</p>
     <textarea id="briefText" rows="14" style="width:100%;font:12px var(--mono)" readonly>Loading…</textarea>
     <div class="row" style="margin-top:8px"><div class="spacer"></div><button class="btn primary" id="briefCopy">Copy prompt</button></div>`);
  try { $('#briefText').value = (await api(`/api/p/${p}/brief?keyword=${encodeURIComponent(keyword)}`)).prompt; }
  catch (e) { $('#briefText').value = 'Error: ' + e.message; }
  $('#briefCopy').addEventListener('click', () => {
    const t = $('#briefText'); t.select();
    (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject())
      .then(() => { $('#briefCopy').textContent = '✓ Copied'; }, () => { document.execCommand('copy'); });
  });
}

async function showKeywordHistory(p, keywordId, keyword) {
  openModal(`History · ${keyword}`,
    `<div id="khChart" style="height:240px"></div>
     <div id="khMeta" class="mut" style="font-size:12px;margin-top:8px">Loading…</div>
     <div style="margin-top:12px">
       <label class="mut" style="font-size:11px">Note</label>
       <textarea id="khNote" rows="3" style="width:100%;font:12px var(--mono)" placeholder="Jot a note for this keyword (strategy, target page, reminders)…"></textarea>
       <div class="row" style="margin-top:6px;align-items:center"><span id="khNoteMsg" class="mut" style="font-size:11px"></span><div class="spacer"></div><button class="btn" id="khNoteSave">Save note</button></div>
     </div>`);
  try {
    const h = await api(`/api/p/${p}/keywords/${keywordId}/history`);
    drawHistory(h);
    $('#khNote').value = (h.keyword && h.keyword.note) || '';
  } catch (e) { $('#khMeta').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  $('#khNoteSave').addEventListener('click', async () => {
    $('#khNoteMsg').textContent = 'Saving…';
    try {
      await api(`/api/p/${p}/keywords/${keywordId}`, { method: 'PATCH', body: JSON.stringify({ note: $('#khNote').value }) });
      $('#khNoteMsg').innerHTML = '<span class="pos">Saved.</span>';
    } catch (e) { $('#khNoteMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
}

function drawHistory(h) {
  const el = $('#khChart'); const meta = $('#khMeta');
  const dfs = (h.dataforseo || []).filter(d => d.position != null).map(d => ({ time: d.date, value: d.position }));
  const ah = (h.ahrefs || []).filter(d => d.position != null).map(d => ({ time: d.date, value: d.position }));
  if (!dfs.length && !ah.length) {
    el.innerHTML = `<div class="empty">No rank history yet for this keyword.</div>`; meta.textContent = ''; return;
  }
  if (window.LightweightCharts && el) {
    el.innerHTML = '';
    const chart = LightweightCharts.createChart(el, {
      height: 240, layout: { background: { color: 'transparent' }, textColor: '#7d8c9b' },
      grid: { vertLines: { color: '#1c2632' }, horzLines: { color: '#1c2632' } },
      rightPriceScale: { borderColor: '#27323f', invertScale: true },  // pos 1 at top (lower = better)
      timeScale: { borderColor: '#27323f' },
    });
    if (dfs.length) chart.addLineSeries({ color: '#5cc8ff', lineWidth: 2, title: 'DataForSEO' }).setData(dfs);
    if (ah.length) chart.addLineSeries({ color: '#f5a623', lineWidth: 2, title: 'Ahrefs' }).setData(ah);
    chart.timeScale().fitContent();
  } else if (el) {
    el.innerHTML = sparkline(dfs.map(d => 101 - d.value));
  }
  const last = dfs[dfs.length - 1] || ah[ah.length - 1];
  meta.innerHTML = `<span style="color:#5cc8ff">●</span> DataForSEO (${dfs.length}) ·
    <span style="color:#f5a623">●</span> Ahrefs (${ah.length})` +
    (last ? ` · latest pos <b>${last.value}</b>` : '') + ` · axis inverted (top = best)`;
}
function movementCell(r) {
  if (r.previous_position == null && r.position != null) return `<span class="move-new">NEW</span>`;
  if (r.position == null && r.previous_position != null) return `<span class="move-lost">LOST</span>`;
  if (r.movement == null) return '<span class="mut">—</span>';
  if (r.movement > 0) return `<span class="move-up">▲ ${r.movement}</span>`;
  if (r.movement < 0) return `<span class="move-down">▼ ${Math.abs(r.movement)}</span>`;
  return '<span class="mut">0</span>';
}
const shortUrl = u => { try { const x = new URL(u); return x.pathname === '/' ? x.hostname : x.pathname; } catch { return u; } };

// Client-side CSV download for tables already loaded from paid/Ahrefs data (no re-fetch,
// no extra spend). columns = [{key,label}]; rows = array of objects. Server-side
// export.csv endpoints exist for the cheap project-owned tables (rank, keywords).
function downloadCsv(filename, columns, rows) {
  const cell = v => { if (v == null) return ''; const s = String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const lines = [columns.map(c => cell(c.label)).join(',')];
  for (const r of rows) lines.push(columns.map(c => cell(r[c.key])).join(','));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

// ---- Weekly Report (Phase 11) — synthesised digest + Telegram push ----
async function viewReport() {
  const p = state.active;
  if (!p) return view(head('Weekly Report') + `<div class="empty">No project yet.</div>`);
  view(head('Weekly Report', activeName()) + `<div class="loading">Loading…</div>`);
  const d = await api(`/api/p/${p}/report`);
  const r = d.rank;
  const moverList = (arr, cls, sign) => arr.length ? arr.map(m =>
    `<tr><td>${esc(m.keyword)}</td><td class="tnum">${fmtPos(m.position)}</td><td class="tnum ${cls}">${sign}${Math.abs(m.delta)}</td></tr>`).join('')
    : `<tr><td colspan="3"><span class="mut">none</span></td></tr>`;
  const oppList = (d.top_opportunities || []).map(o =>
    `<tr><td class="tnum"><b>${o.score}</b></td><td>${esc(o.keyword)}</td><td class="mut" style="font-size:12px">${esc(o.reason)}</td></tr>`).join('');
  const b = d.backlinks;
  view(head('Weekly Report', activeName()) + `
    <div class="row" style="align-items:center"><div class="mut" style="font-size:12.5px">A synthesised snapshot of ${esc(d.domain)} — also pushable to Telegram (or weekly via the report timer).</div>
      <div class="spacer"></div>
      <button class="btn" id="repHtml">Download HTML</button>
      <button class="btn primary" id="repSend">Send to Telegram</button>
      <span id="repMsg" class="mut" style="font-size:12px;margin-left:8px"></span></div>
    <div class="grid tiles" style="margin-top:10px">
      ${tile('Visibility', r.visibility)}
      ${tile('Ranking', `${r.ranking}/${r.tracked}`, true)}
      ${tile('Top 10', r.top10, true)}
      ${tile('Top 3', r.top3, true)}
      ${tile('DataForSEO MTD', '$' + d.spend_mtd, true)}
      ${tile('Toxic links', b ? b.toxic : '—', true)}
    </div>
    <div class="row" style="margin-top:14px;align-items:flex-start">
      <div class="card"><h3>Top climbers</h3><table><thead><tr><th>Keyword</th><th>Pos</th><th>Δ</th></tr></thead><tbody>${moverList(r.movers_up, 'move-up', '+')}</tbody></table></div>
      <div class="card"><h3>Top fallers</h3><table><thead><tr><th>Keyword</th><th>Pos</th><th>Δ</th></tr></thead><tbody>${moverList(r.movers_down, 'move-down', '-')}</tbody></table></div>
    </div>
    <div class="card" style="margin-top:14px;padding:4px 4px 8px"><h3 style="padding:10px 10px 4px">Top opportunities</h3>
      <table><thead><tr><th>Score</th><th>Keyword</th><th>Why</th></tr></thead><tbody>${oppList || '<tr><td colspan="3"><span class="mut">none</span></td></tr>'}</tbody></table></div>
    ${b ? `<p class="mut" style="font-size:11.5px;margin-top:10px">Backlinks: DR ${b.domain_rating} · ${b.refdomains} referring domains · <b>${b.toxic} toxic</b>.</p>` : ''}`);
  $('#repSend').addEventListener('click', async () => {
    $('#repMsg').textContent = 'Sending…';
    try {
      const r2 = await api(`/api/p/${p}/report/send`, { method: 'POST', body: '{}' });
      $('#repMsg').innerHTML = r2.delivered ? '<span class="pos">Sent to Telegram.</span>'
        : `<span class="warn">Not sent — ${esc(r2.detail)}</span>`;
    } catch (e) { $('#repMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  $('#repHtml').addEventListener('click', () => { window.location = `/api/p/${p}/report.html`; });
  setUpdated();
}

// ---- Opportunities (Phase 10) — scored "work on next" list + keyword clusters ----
const oppScoreClass = s => s >= 70 ? 'pos' : s >= 45 ? 'warn' : 'mut';
function oppRow(r) {
  return `<tr>
    <td class="tnum"><b class="${oppScoreClass(r.score)}">${r.score}</b></td>
    <td><a href="#" class="kwlink" data-kw-id="${r.keyword_id}" data-kw="${esc(r.keyword)}">${esc(r.keyword)}</a>
      <a href="#" class="brieflink" data-kw="${esc(r.keyword)}" title="Copy a content-brief prompt for Claude">📋</a></td>
    <td class="tnum">${fmtPos(r.position)}</td>
    <td><span class="tag">${esc(r.band)}</span></td>
    <td class="tnum mut">${r.search_volume ?? '—'}</td>
    <td class="tnum mut">${r.keyword_difficulty ?? '—'}</td>
    <td class="mut" style="font-size:12px">${esc(r.reason)}</td></tr>`;
}
async function viewOpportunities() {
  const p = state.active;
  if (!p) return view(head('Opportunities') + `<div class="empty">No project yet.</div>`);
  view(head('Opportunities', activeName()) + `<div class="loading">Loading…</div>`);
  const [opp, cl] = await Promise.all([
    api(`/api/p/${p}/opportunities?limit=300`),
    api(`/api/p/${p}/opportunities/clusters`).catch(() => ({ items: [] })),
  ]);
  const clusters = (cl.items || []).slice(0, 8);
  const clusterCards = clusters.map(c => `
    <div class="card tile opp-cluster" data-cluster="${esc(c.cluster)}" style="cursor:pointer">
      <div class="k">${esc(c.cluster)}</div><div class="v tnum">${c.avg_opportunity}</div>
      <div class="mut" style="font-size:10.5px">${c.keywords} kw · ${c.top10} top10 · ${(c.total_volume || 0).toLocaleString()} vol</div>
    </div>`).join('');
  const rowsHtml = (opp.items || []).map(oppRow).join('');
  view(head('Opportunities', activeName()) + `
    <p class="mut" style="font-size:12.5px">Scored from live rank + volume + KD + intent — higher = better ROI. Weighted: position 45% · volume 30% · KD 15% · intent 10%. Click a keyword for its history.</p>
    <div class="grid tiles">${clusterCards || '<span class="mut">No clusters yet — tag your keywords to group them into silos.</span>'}</div>
    <div class="toolbar" style="margin-top:14px">
      <select id="oppCluster"><option value="">All clusters</option>${clusters.map(c => `<option>${esc(c.cluster)}</option>`).join('')}</select>
      <div class="spacer"></div>
      <span class="mut" style="font-size:12px"><b id="oppTotal">${opp.total}</b> keywords scored</span>
      <button class="btn" id="oppEnrich" title="Pull DataForSEO volume + KD for keywords missing them">Enrich Vol/KD</button>
      <button class="btn" id="oppExport">Export CSV</button>
    </div>
    <div class="card" style="padding:4px 4px 10px">
      <table><thead><tr><th>Score</th><th>Keyword</th><th>Pos</th><th>Band</th><th>Vol</th><th>KD</th><th>Why</th></tr></thead>
      <tbody id="oppBody">${rowsHtml || '<tr><td colspan="7"><div class="empty">No keywords yet.</div></td></tr>'}</tbody></table>
    </div>`);
  const wireKw = () => {
    $('#oppBody').querySelectorAll('.kwlink').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); showKeywordHistory(p, a.dataset.kwId, a.dataset.kw); }));
    $('#oppBody').querySelectorAll('.brieflink').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); showBriefPrompt(p, a.dataset.kw); }));
  };
  const applyCluster = async (c) => {
    const d = await api(`/api/p/${p}/opportunities?limit=300${c ? `&cluster=${encodeURIComponent(c)}` : ''}`);
    $('#oppBody').innerHTML = (d.items || []).map(oppRow).join('') || '<tr><td colspan="7"><div class="empty">No keywords match.</div></td></tr>';
    $('#oppTotal').textContent = d.total; wireKw();
  };
  wireKw();
  $('#oppCluster').addEventListener('change', e => applyCluster(e.target.value));
  document.querySelectorAll('.opp-cluster').forEach(card => card.addEventListener('click', () => {
    $('#oppCluster').value = card.dataset.cluster; applyCluster(card.dataset.cluster); }));
  $('#oppExport').addEventListener('click', () => {
    const c = $('#oppCluster').value;
    window.location = `/api/p/${p}/opportunities/export.csv${c ? `?cluster=${encodeURIComponent(c)}` : ''}`; });
  $('#oppEnrich').addEventListener('click', async () => {
    if (!confirm('Pull DataForSEO search volume + difficulty for keywords missing them?\nSmall one-time cost (within your daily cap); sharpens these scores.')) return;
    const b = $('#oppEnrich'); b.disabled = true; b.textContent = 'Enriching…';
    try {
      const r = await api(`/api/p/${p}/keywords/enrich`, { method: 'POST', body: '{}' });
      b.textContent = `+${r.volume_set} vol · +${r.kd_set} KD · $${r.cost}`;
      setTimeout(() => viewOpportunities(), 1200);
    } catch (e) { b.disabled = false; b.textContent = 'Enrich Vol/KD'; alert('Enrich failed: ' + e.message); }
  });
  setUpdated();
}

// ---- Action Plan (Phase 15) — categorized, prioritized, concrete tasks ("the brain layer") ----
const IMPACT_CLS = { high: 'pos', medium: 'warn', low: 'mut' };
const _catId = name => 'cat-' + String(name).replace(/[^a-z]/gi, '');
let planAi = false;   // set per-render from plan.ai_enabled
function planCard(t, acts = true) {
  const st = t.state || 'open';
  const cls = st === 'done' ? ' is-done' : st === 'snoozed' ? ' is-snoozed' : '';
  const aiBtn = (acts && planAi)
    ? `<button class="lnk act-ai" data-cat="${esc(t.category)}" data-title="${esc(t.title)}" data-detail="${esc(t.detail)}">✨ AI assist</button>` : '';
  const actbar = acts ? `<div class="plan-task-acts">
      <button class="lnk act" data-key="${esc(t.key)}" data-st="${st === 'done' ? 'open' : 'done'}">${st === 'done' ? '✓ done — reopen' : 'Mark done'}</button>
      ${st === 'snoozed'
        ? `<button class="lnk act" data-key="${esc(t.key)}" data-st="open">unsnooze</button>`
        : st === 'open' ? `<button class="lnk mut act" data-key="${esc(t.key)}" data-st="snoozed">snooze</button>` : ''}
      ${aiBtn}
    </div><div class="plan-ai" hidden></div>` : '';
  return `<div class="plan-task${cls}">
    <div class="plan-task-head">
      <span class="impact ${IMPACT_CLS[t.impact] || 'mut'}" title="Impact">${esc(t.impact)}</span>
      <span class="tag" title="Effort">${esc(t.effort)} effort</span>
      <b class="plan-task-title">${esc(t.title)}</b>
    </div>
    <div class="mut plan-task-detail">${esc(t.detail)}</div>${actbar}
  </div>`;
}
async function viewActionPlan(live = false) {
  const p = state.active;
  if (!p) return view(head('Action Plan') + `<div class="empty">No project yet.</div>`);
  view(head('Action Plan', activeName()) +
    `<div class="loading">${live ? 'Pulling live signals (DR · toxic links · GSC)…' : 'Loading…'}</div>`);
  const plan = await api(`/api/p/${p}/plan${live ? '?live=1' : ''}`);
  planAi = !!plan.ai_enabled;
  const cats = plan.categories || [];
  const top = (plan.summary && plan.summary.top) || [];
  const verticals = [['generic', 'Generic'], ['casino', 'Casino & iGaming']];
  const vsel = verticals.map(([v, l]) =>
    `<option value="${v}"${plan.vertical === v ? ' selected' : ''}>${l}</option>`).join('');
  const chips = cats.map(c =>
    `<span class="tag jump" data-jump="${esc(c.name)}">${esc(c.name)} · ${c.count}</span>`).join(' ');
  const sig = plan.signals || {};
  const liveStatus = plan.live
    ? `<span class="mut" style="font-size:11px">live: backlinks ${sig.backlinks ? '✓' : '—'} · GSC ${sig.gsc ? '✓' : '—'}</span>`
    : '';
  const done = plan.summary.done || 0, total = plan.summary.total || 0;
  const pct = total ? Math.round(done / total * 100) : 0;
  // open/snoozed first, done dimmed at the bottom of each category
  const ordered = ts => [...ts.filter(t => t.state !== 'done'), ...ts.filter(t => t.state === 'done')];
  const sections = cats.map(c => `
    <section class="plan-cat" id="${_catId(c.name)}">
      <h3 class="plan-cat-h">${esc(c.name)} <span class="mut">${c.done ? c.done + '/' : ''}${c.count}</span></h3>
      <div class="plan-grid">${ordered(c.tasks || []).map(t => planCard(t)).join('') || '<span class="mut">Nothing flagged here right now — nice.</span>'}</div>
    </section>`).join('');
  view(head('Action Plan', activeName()) + `
    <p class="mut" style="font-size:12.5px">Concrete next actions, built from your live data (rank, site crawl, Core Web Vitals, keyword clusters) + SEO best practice — grouped and prioritized by impact × effort.</p>
    <div class="plan-progress card"><div class="plan-progress-bar"><span style="width:${pct}%"></span></div>
      <span class="mut" style="font-size:12px"><b class="pos">${done}</b> of ${total} done · ${pct}%</span></div>
    <div class="toolbar">
      <label class="mut" style="font-size:12px">Vertical</label>
      <select id="planVertical" title="Tailors the off-page + social link ideas">${vsel}</select>
      <button class="btn" id="planLive" title="Pull live Ahrefs DR + toxic-link count + GSC low-CTR (a few Ahrefs units)">${plan.live ? 'Refresh live signals' : '+ Live signals'}</button>
      ${liveStatus}
      <div class="spacer"></div>
      <span style="font-size:12px">${chips}</span>
      ${plan.ai_enabled ? '<button class="btn" id="planAi" title="Re-rank tasks by projected ROI (north-star lift per hour)">✨ Prioritise by ROI</button>' : ''}
      <button class="btn" id="planExport">Export CSV</button>
    </div>
    <div id="planAiPanel" style="margin:6px 0"></div>
    <div class="card plan-first"><h3 style="padding:10px 12px 2px">⭐ Do these first</h3>
      <div class="plan-grid" style="padding:6px 8px 10px">${top.map(t => planCard(t)).join('') || '<span class="mut" style="padding:8px">All caught up — nothing outstanding. 🎉</span>'}</div></div>
    ${sections}`);
  const setTaskState = async (key, status) => {
    try { await api(`/api/p/${p}/plan/tasks`, { method: 'PUT', body: JSON.stringify({ key, status }) }); }
    catch (e) { alert('Could not update task: ' + e.message); return; }
    viewActionPlan(plan.live);
  };
  document.querySelectorAll('.plan-task-acts .act').forEach(b =>
    b.addEventListener('click', () => setTaskState(b.dataset.key, b.dataset.st)));
  document.querySelectorAll('.act-ai').forEach(b => b.addEventListener('click', async () => {
    const out = b.closest('.plan-task').querySelector('.plan-ai');
    out.hidden = false; out.innerHTML = '<span class="mut">✨ thinking…</span>'; b.disabled = true;
    try {
      const r = await api(`/api/p/${p}/plan/assist`, { method: 'POST', body: JSON.stringify(
        { category: b.dataset.cat, title: b.dataset.title, detail: b.dataset.detail }) });
      out.innerHTML = `<div class="plan-ai-out">${esc(r.suggestion || '')}</div>` +
        `<div class="mut" style="font-size:10.5px;margin-top:5px">~$${Number(r.cost || 0).toFixed(4)} · ${(r.tokens || 0).toLocaleString()} tokens · <a href="#" class="lnk" data-go-spend="1">AI spend</a></div>`;
      const sp = out.querySelector('[data-go-spend]');
      if (sp) sp.addEventListener('click', e => { e.preventDefault(); go('spend'); });
    } catch (e) { out.innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    finally { b.disabled = false; }
  }));
  $('#planVertical').addEventListener('change', async e => {
    try { await api(`/api/p/${p}/settings`, { method: 'PUT', body: JSON.stringify({ vertical: e.target.value }) }); }
    catch (_) {}
    viewActionPlan(plan.live);
  });
  $('#planLive').addEventListener('click', () => viewActionPlan(true));
  $('#planExport').addEventListener('click', () => { window.location = `/api/p/${p}/plan/export.csv`; });
  const pAi = $('#planAi');
  if (pAi) pAi.addEventListener('click', async () => {
    pAi.disabled = true; pAi.textContent = 'Ranking…';
    try {
      const r = await api(`/api/p/${p}/plan/prioritize`, { method: 'POST' });
      const rows = (r.ranked || []).slice(0, 12).map((t, i) => `<li><b>${i + 1}.</b> ${esc(t.title)} <span class="mut" style="font-size:11px">— ${esc(t.category)}${t.score != null ? ' · ROI ' + t.score : ''}</span></li>`).join('');
      $('#planAiPanel').innerHTML = `<div class="card"><b>${r.ai ? '✨ AI-prioritised by ROI' : 'Prioritised (impact ÷ effort)'}</b><ol style="margin:6px 0 0 18px;font-size:12.5px">${rows}</ol></div>`;
    } catch (e) { $('#planAiPanel').innerHTML = `<span style="color:var(--neg)">${esc(e.message)}</span>`; }
    finally { pAi.disabled = false; pAi.textContent = '✨ Prioritise by ROI'; }
  });
  document.querySelectorAll('.jump').forEach(ch => ch.addEventListener('click', () => {
    const el = document.getElementById(_catId(ch.dataset.jump));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  setUpdated();
}

async function viewImports() {
  const p = state.active;
  if (!p) return view(head('Imports') + `<div class="empty">No project yet.</div>`);
  const refresh = async () => {
    const data = await api(`/api/p/${p}/imports`);
    $('#impList').innerHTML = data.items.length ? data.items.map(i => `
      <tr><td>${esc(i.filename || '—')}</td><td>${esc(i.source)}</td><td class="tnum">${i.row_count}</td>
      <td class="tnum">${i.keywords_created}</td><td>${esc(i.status)}</td><td class="mut">${esc(i.created_at)}</td></tr>`).join('')
      : `<tr><td colspan="6"><div class="empty">No imports yet.</div></td></tr>`;
  };
  view(head('Imports', activeName()) + `
    <div class="card">
      <h3>Import Ahrefs CSV</h3>
      <p class="mut" style="font-size:12.5px">Upload an Ahrefs keyword export (Organic keywords / Positions). Keywords are parsed and stored under this project.</p>
      <div class="row" style="align-items:center">
        <input id="impFile" type="file" accept=".csv,text/csv" style="flex:2">
        <button class="btn primary" id="impGo">Upload</button>
      </div>
      <div id="impMsg" class="mut" style="margin-top:8px;font-size:12.5px"></div>
    </div>
    <div class="card" style="margin-top:14px;padding:4px 4px 10px">
      <table><thead><tr><th>File</th><th>Source</th><th>Rows</th><th>Keywords +</th><th>Status</th><th>When</th></tr></thead>
      <tbody id="impList"></tbody></table>
    </div>`);
  $('#impGo').addEventListener('click', async () => {
    const f = $('#impFile').files[0];
    if (!f) { $('#impMsg').textContent = 'Choose a CSV first.'; return; }
    $('#impMsg').textContent = 'Uploading…';
    const fd = new FormData(); fd.append('file', f);
    try {
      const r = await fetch(`/api/p/${p}/imports`, { method: 'POST', body: fd });
      if (!r.ok) throw new Error((await r.json()).detail || r.statusText);
      const body = await r.json();
      $('#impMsg').innerHTML = `<span class="pos">Imported ${body.row_count} rows, +${body.keywords_created} new keywords.</span>`;
      await refresh();
    } catch (e) { $('#impMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  await refresh();
  setUpdated();
}

// ---- Alerts (Phase 11) — configurable movement-alert rules + preview ----
const alertKindLabel = k => ({ dropped_out_top: 'dropped out of top', entered_top: 'entered top', big_drop: 'big drop' }[k] || k);
async function viewAlerts() {
  const p = state.active;
  if (!p) return view(head('Alerts') + `<div class="empty">No project yet.</div>`);
  view(head('Alerts', activeName()) + `<div class="loading">Loading…</div>`);
  const d = await api(`/api/p/${p}/alerts`);
  const r = d.rules;
  const preview = (d.preview || []).map(e => `<tr><td>${esc(e.keyword)}</td>
    <td>${esc(alertKindLabel(e.kind))}</td><td class="tnum">${fmtPos(e.prev)} → ${fmtPos(e.now)}</td></tr>`).join('');
  const chk = (id, on, label) => `<label style="font-size:12.5px"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}> ${label}</label>`;
  view(head('Alerts', activeName()) + `
    <div class="card">
      <h3>Movement alert rules</h3>
      <p class="mut" style="font-size:12.5px">Telegram alerts run after each rank pull. Delivery is gated by <code>SEOBOT_ALERTS_ENABLED</code> + a bot token.</p>
      <div class="row">
        <div class="field"><label>"Top N" boundary</label><input id="arTop" type="number" min="1" max="100" value="${r.top_threshold}"></div>
        <div class="field"><label>Big-drop (positions)</label><input id="arDrop" type="number" min="1" max="100" value="${r.big_drop}"></div>
      </div>
      <div class="row" style="gap:18px;margin-top:6px;align-items:center">
        ${chk('arEnter', r.enter_top, 'Entering top N')}
        ${chk('arExit', r.exit_top, 'Dropping out of top N')}
        ${chk('arBig', r.big_drop_enabled, 'Big drops')}
      </div>
      <div style="margin-top:10px"><button class="btn primary" id="arSave">Save rules</button>
        <button class="btn" id="arSend">Send now</button>
        <span id="arMsg" class="mut" style="margin-left:8px;font-size:12.5px"></span></div>
    </div>
    <div class="card" style="margin-top:14px;padding:4px 4px 8px">
      <h3 style="padding:10px 10px 4px">Preview <span class="mut" style="font-size:11px">${d.matching} keyword(s) would alert now</span></h3>
      <table><thead><tr><th>Keyword</th><th>Alert</th><th>Move</th></tr></thead>
      <tbody>${preview || '<tr><td colspan="3"><span class="mut">nothing matches the current rules</span></td></tr>'}</tbody></table></div>`);
  $('#arSave').addEventListener('click', async () => {
    $('#arMsg').textContent = 'Saving…';
    try {
      await api(`/api/p/${p}/alerts`, { method: 'PUT', body: JSON.stringify({
        top_threshold: +$('#arTop').value, big_drop: +$('#arDrop').value,
        enter_top: $('#arEnter').checked, exit_top: $('#arExit').checked, big_drop_enabled: $('#arBig').checked }) });
      $('#arMsg').innerHTML = '<span class="pos">Saved.</span>';
      viewAlerts();
    } catch (e) { $('#arMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  $('#arSend').addEventListener('click', async () => {
    $('#arMsg').textContent = 'Sending…';
    try {
      const s = await api(`/api/p/${p}/alerts/send`, { method: 'POST', body: '{}' });
      $('#arMsg').innerHTML = s.delivered ? `<span class="pos">Sent ${s.events} alerts.</span>`
        : `<span class="warn">${esc(s.detail)}</span>`;
    } catch (e) { $('#arMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  setUpdated();
}

async function viewProjectSettings() {
  const p = state.active;
  if (!p) return view(head('Project Settings') + `<div class="empty">No project yet.</div>`);
  const proj = await api(`/api/projects/${p}`);
  const kv = await api(`/api/p/${p}/settings`);
  view(head('Project Settings', activeName()) + `
    <div class="card">
      <h3>Project</h3>
      <div class="row">
        <div class="field"><label>Name</label><input id="psName" type="text" value="${esc(proj.name)}"></div>
        <div class="field"><label>Primary domain</label><input id="psDomain" type="text" value="${esc(proj.primary_domain)}"></div>
      </div>
      <div class="row">
        <div class="field"><label>Market</label><input id="psMarket" type="text" value="${esc(proj.market)}"></div>
        <div class="field"><label>Locale</label><input id="psLocale" type="text" value="${esc(proj.locale)}"></div>
        <div class="field"><label>Status</label>
          <select id="psStatus">${['active','paused','archived'].map(s => `<option ${s===proj.status?'selected':''}>${s}</option>`).join('')}</select></div>
      </div>
      <button class="btn primary" id="psSave">Save project</button>
      <span id="psMsg" class="mut" style="margin-left:10px;font-size:12.5px"></span>
    </div>
    <div class="card" style="margin-top:14px">
      <h3>Domain Finder thresholds</h3>
      <p class="mut" style="font-size:12.5px">The daily monitor auto-adds a dropped/auction domain + alerts you when it's relevant enough AND authoritative/aged enough. Tune the bars here.</p>
      <div class="row">
        <div class="field"><label>Min relevancy (0–100)</label><input id="dtRel" type="number" min="0" max="100" value="${esc(kv.domain_min_relevancy ?? 55)}"></div>
        <div class="field"><label>Min Ahrefs DR</label><input id="dtDr" type="number" min="0" max="100" value="${esc(kv.domain_min_dr ?? 10)}"></div>
        <div class="field"><label>Min Wayback years</label><input id="dtYears" type="number" min="0" max="30" value="${esc(kv.domain_min_years ?? 8)}"></div>
        <div class="field"><label>Min Majestic TF (auctions)</label><input id="dtTf" type="number" min="0" max="100" value="${esc(kv.domain_min_tf ?? 10)}"></div>
      </div>
      <button class="btn primary" id="dtSave">Save thresholds</button>
      <span id="dtMsg" class="mut" style="margin-left:10px;font-size:12.5px"></span>
    </div>
    <div class="card" style="margin-top:14px">
      <h3>Settings (key / value)</h3>
      <div id="kvRows">${kvRows(kv)}</div>
      <button class="btn" id="kvAdd">+ Add row</button>
      <button class="btn primary" id="kvSave">Save settings</button>
      <span id="kvMsg" class="mut" style="margin-left:10px;font-size:12.5px"></span>
    </div>`);
  $('#dtSave').addEventListener('click', async () => {
    $('#dtMsg').textContent = 'Saving…';
    try {
      await api(`/api/p/${p}/settings`, { method: 'PUT', body: JSON.stringify({
        domain_min_relevancy: $('#dtRel').value, domain_min_dr: $('#dtDr').value,
        domain_min_years: $('#dtYears').value, domain_min_tf: $('#dtTf').value }) });
      $('#dtMsg').innerHTML = '<span class="pos">Saved.</span>';
    } catch (e) { $('#dtMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  $('#psSave').addEventListener('click', async () => {
    try {
      await api(`/api/projects/${p}`, { method: 'PATCH', body: JSON.stringify({
        name: $('#psName').value, primary_domain: $('#psDomain').value,
        market: $('#psMarket').value, locale: $('#psLocale').value, status: $('#psStatus').value }) });
      $('#psMsg').innerHTML = '<span class="pos">Saved.</span>';
      await loadProjects();
    } catch (e) { $('#psMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  wireKv(() => api(`/api/p/${p}/settings`, { method: 'PUT', body: JSON.stringify(collectKv()) }), '#kvMsg');
  setUpdated();
}
const kvRows = kv => Object.entries(kv).map(([k, v]) =>
  `<div class="row kv"><input class="kvk" type="text" value="${esc(k)}" placeholder="key"><input class="kvv" type="text" value="${esc(v ?? '')}" placeholder="value"></div>`).join('')
  || `<div class="row kv"><input class="kvk" type="text" placeholder="key"><input class="kvv" type="text" placeholder="value"></div>`;
const collectKv = () => { const out = {}; document.querySelectorAll('.kv').forEach(r => {
  const k = r.querySelector('.kvk').value.trim(); if (k) out[k] = r.querySelector('.kvv').value; }); return out; };
function wireKv(saveFn, msgSel) {
  const add = $('#kvAdd'); if (add) add.addEventListener('click', () => {
    const d = document.createElement('div'); d.className = 'row kv';
    d.innerHTML = `<input class="kvk" type="text" placeholder="key"><input class="kvv" type="text" placeholder="value">`;
    $('#kvRows').appendChild(d); });
  $('#kvSave').addEventListener('click', async () => {
    try { await saveFn(); $(msgSel).innerHTML = '<span class="pos">Saved.</span>'; }
    catch (e) { $(msgSel).innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
}

async function viewProjects() {
  const data = await api('/api/projects');
  state.projects = data.items; state.active = data.active_slug;
  view(head('Projects', 'Global') + `
    <div class="card">
      <h3>Create project</h3>
      <div class="row">
        <div class="field"><label>Name</label><input id="npName" type="text" placeholder="Demo Casino"></div>
        <div class="field"><label>Primary domain</label><input id="npDomain" type="text" placeholder="demo-casino.example"></div>
        <div class="field"><label>Market</label><input id="npMarket" type="text" value="AU"></div>
      </div>
      <button class="btn primary" id="npGo">Create</button>
      <span id="npMsg" class="mut" style="margin-left:10px;font-size:12.5px"></span>
    </div>
    <div class="card" style="margin-top:14px;padding:4px 4px 10px">
      <table><thead><tr><th>Name</th><th>Slug</th><th>Domain</th><th>Market</th><th>Status</th><th></th></tr></thead>
      <tbody>${data.items.map(p => `
        <tr><td><b>${esc(p.name)}</b></td><td class="mut">${esc(p.slug)}</td><td>${esc(p.primary_domain)}</td>
        <td>${esc(p.market)}/${esc(p.locale)}</td><td>${esc(p.status)}</td>
        <td>${p.slug === data.active_slug ? '<span class="badge ok">active</span>' :
          `<button class="btn" data-activate="${esc(p.slug)}">Activate</button>`}</td></tr>`).join('')}
      </tbody></table>
    </div>`);
  $('#npGo').addEventListener('click', async () => {
    try {
      await api('/api/projects', { method: 'POST', body: JSON.stringify({
        name: $('#npName').value, primary_domain: $('#npDomain').value, market: $('#npMarket').value || 'AU' }) });
      $('#npMsg').innerHTML = '<span class="pos">Created.</span>';
      await loadProjects(); route();
    } catch (e) { $('#npMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  document.querySelectorAll('[data-activate]').forEach(b => b.addEventListener('click', async () => {
    await api(`/api/projects/${b.dataset.activate}/activate`, { method: 'POST' });
    await loadProjects(); route();
  }));
  setUpdated();
}

const INT_BADGE = { connected: 'ok', csv: 'ok', disconnected: 'off', 'not connected': 'off', 'not configured': 'off' };

async function viewIntegrations() {
  async function refresh() {
    const list = await api('/api/integrations');
    const dfs = await api('/api/integrations/dataforseo');
    const secretRows = Object.entries(dfs.secrets).map(([k, v]) =>
      `<tr><td>${esc(k)}</td><td>${v ? '<span class="badge ok">set</span>' : '<span class="badge off">missing</span>'}</td></tr>`).join('');
    const cards = list.items.map(p => {
      if (p.provider === 'dataforseo') {
        return `<div class="card">
          <div class="row" style="align-items:center"><h3 style="flex:0">DataForSEO</h3>
            <span class="badge ${INT_BADGE[dfs.status] || 'off'}">${esc(dfs.status)}</span>
            <div class="spacer"></div><button class="btn primary" id="intTest">Test connection</button></div>
          <p class="mut" style="font-size:12.5px">Credentials live in <code>.env</code> (never the database). SERP, Keywords Data, Labs and OnPage are subscribed; Backlinks is not (sourced via Ahrefs CSV).</p>
          <table style="max-width:360px"><thead><tr><th>Secret</th><th>State</th></tr></thead><tbody>${secretRows}</tbody></table>
          <div class="mut" style="font-size:12px;margin-top:8px">Last checked: ${esc(dfs.last_checked_at || 'never')}</div>
          <div id="intMsg" class="mut" style="font-size:12.5px;margin-top:8px"></div></div>`;
      }
      return `<div class="card" style="margin-top:12px">
        <div class="row" style="align-items:center"><h3 style="flex:0">${esc(p.name)}</h3>
          <span class="badge ${INT_BADGE[p.status] || 'off'}">${esc(p.status)}</span>
          <span class="tag">${esc(p.kind)}</span><span class="tag">${esc(p.scope)}</span></div>
        <p class="mut" style="font-size:12.5px;margin-top:6px">${esc(p.note || '')}</p>
        ${p.provider === 'ahrefs' ? `<button class="btn" data-goimports>Go to Imports</button>` :
          `<button class="btn" disabled>Connect (credentials required)</button>`}</div>`;
    }).join('');
    $('#intBody').innerHTML = cards;
    const test = $('#intTest');
    if (test) test.addEventListener('click', async () => {
      $('#intMsg').textContent = 'Testing…';
      try {
        const r = await api('/api/integrations/dataforseo/validate', { method: 'POST', body: '{}' });
        $('#intMsg').innerHTML = r.status === 'connected' ? '<span class="pos">Connected.</span>'
          : `<span class="warn">Not connected${r.detail ? ' — ' + esc(r.detail) : ''}.</span>`;
        await refresh();
      } catch (e) { $('#intMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    });
    const goimp = document.querySelector('[data-goimports]');
    if (goimp) goimp.addEventListener('click', () => go('imports'));
  }
  view(head('Integrations', 'Global') + `<div id="intBody"><div class="loading">Loading…</div></div>`);
  await refresh();
  setUpdated();
}

async function viewGlobalSettings() {
  const kv = await api('/api/settings');
  view(head('Settings', 'Global') + `
    <div class="card">
      <h3>Global settings (key / value)</h3>
      <div id="kvRows">${kvRows(kv)}</div>
      <button class="btn" id="kvAdd">+ Add row</button>
      <button class="btn primary" id="kvSave">Save</button>
      <span id="kvMsg" class="mut" style="margin-left:10px;font-size:12.5px"></span>
    </div>`);
  wireKv(() => api('/api/settings', { method: 'PUT', body: JSON.stringify(collectKv()) }), '#kvMsg');
  setUpdated();
}

function viewStub(label) {
  view(head(label, activeName()) + `<div class="empty">${esc(label)} is a later phase. The scaffold/route exists; the feature is not built in Phase 1.</div>`);
}

// ---- Keyword Research (Phase 2) ----
const KR_TABS = [
  { kind: 'ideas', label: 'Ideas', input: 'seed', help: 'Seed keyword → related ideas with volume, KD, intent.' },
  { kind: 'volume', label: 'Volume', input: 'list', help: 'Paste keywords (one per line) → monthly volume, CPC, competition.' },
  { kind: 'kd', label: 'KD', input: 'list', help: 'Paste keywords → keyword difficulty (0–100).' },
  { kind: 'related', label: 'Related', input: 'seed', help: 'Seed keyword → semantically related terms.' },
  { kind: 'serp', label: 'SERP', input: 'single', help: 'One keyword → live top organic results + SERP features.' },
];

function costLine(est) {
  const b = est.budget || {};
  return `est <b>$${est.est_cost}</b> · MTD <b>$${b.mtd ?? 0}</b>/$${b.monthly_cap ?? 0} · remaining $${b.monthly_remaining ?? 0}` +
    (est.over_cap ? ` · <span class="neg">${esc(est.reason || 'over cap')}</span>` : '');
}

async function viewKeywordResearch() {
  const p = state.active;
  if (!p) return view(head('Keyword Research') + `<div class="empty">No project yet.</div>`);
  state._krKind = state._krKind || 'ideas';

  async function renderTab() {
    const tab = KR_TABS.find(t => t.kind === state._krKind);
    const inputHtml = tab.input === 'list'
      ? `<textarea id="krInput" rows="6" placeholder="one keyword per line"></textarea>`
      : `<input id="krInput" type="text" placeholder="${tab.input === 'single' ? 'a single keyword' : 'seed keyword'}">`;
    $('#krBody').innerHTML = `
      <p class="mut" style="font-size:12.5px">${esc(tab.help)}</p>
      <div class="field">${inputHtml}</div>
      <div id="krCost" class="costbar mut">…</div>
      <button class="btn primary" id="krRun">Run query</button>
      <span id="krMsg" class="mut" style="margin-left:10px"></span>
      <div id="krResult" style="margin-top:14px"></div>`;
    try {
      const est = await api(`/api/p/${p}/research/estimate?kind=${tab.kind}`);
      $('#krCost').innerHTML = costLine(est);
      $('#krRun').disabled = est.over_cap;
    } catch (e) { $('#krCost').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    $('#krRun').addEventListener('click', () => runKr(p, tab));
    if (tab.input !== 'list') $('#krInput').addEventListener('keydown', e => { if (e.key === 'Enter') runKr(p, tab); });
  }
  view(head('Keyword Research', activeName()) + `
    <div class="subtabs" id="krTabs">${KR_TABS.map(t =>
      `<button class="subtab ${t.kind === state._krKind ? 'active' : ''}" data-kind="${t.kind}">${t.label}</button>`).join('')}</div>
    <div class="card"><div id="krBody"></div></div>
    <div class="card" style="margin-top:14px"><h3>Recent queries</h3><div id="krHistory" class="mut">…</div></div>`);
  $('#krTabs').querySelectorAll('.subtab').forEach(b => b.addEventListener('click', () => {
    state._krKind = b.dataset.kind;
    $('#krTabs').querySelectorAll('.subtab').forEach(x => x.classList.toggle('active', x.dataset.kind === state._krKind));
    renderTab();
  }));
  await renderTab();
  loadKrHistory(p);
  setUpdated();
}

async function runKr(p, tab) {
  const raw = $('#krInput').value.trim();
  if (!raw) { $('#krMsg').textContent = 'Enter a keyword.'; return; }
  const terms = tab.input === 'list' ? raw.split('\n').map(s => s.trim()).filter(Boolean) : [raw];
  $('#krMsg').textContent = 'Running…'; $('#krRun').disabled = true;
  try {
    const res = await api(`/api/p/${p}/research`, { method: 'POST', body: JSON.stringify({ kind: tab.kind, terms, limit: 100 }) });
    $('#krMsg').innerHTML = `<span class="pos">${res.count} results · $${res.cost}</span>`;
    $('#krCost').innerHTML = costLine({ est_cost: res.cost, over_cap: false, budget: res.budget });
    renderKrResult(p, tab.kind, res.rows);
    loadKrHistory(p);
  } catch (e) { $('#krMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  $('#krRun').disabled = false;
}

function serpTable(rows) {
  const feats = (rows.features || []).map(f => `<span class="tag">${esc(f)}</span>`).join('');
  const body = (rows.organic || []).map(r => `<tr><td class="tnum">${r.rank ?? '—'}</td><td>${esc(r.domain || '')}</td>
    <td>${esc(r.title || '')}</td><td>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(shortUrl(r.url))}</a>` : ''}</td></tr>`).join('');
  return `<div style="margin-bottom:8px">SERP features: ${feats || '<span class="mut">none</span>'}</div>
    <div class="card" style="padding:4px 4px 8px"><table><thead><tr><th>#</th><th>Domain</th><th>Title</th><th>URL</th></tr></thead>
    <tbody>${body || '<tr><td colspan="4"><div class="empty">No organic results.</div></td></tr>'}</tbody></table></div>`;
}

function renderKrResult(p, kind, rows) {
  const el = $('#krResult');
  if (kind === 'serp') { el.innerHTML = serpTable(rows); return; }
  if (!rows.length) { el.innerHTML = `<div class="empty">No results.</div>`; return; }
  const isKd = kind === 'kd';
  const cols = isKd ? ['Keyword', 'KD'] : ['Keyword', 'Vol', 'KD', 'CPC', 'Intent'];
  const body = rows.map(r => `<tr>
    <td><input type="checkbox" class="krchk" data-kw="${esc(r.keyword)}" checked></td>
    <td>${esc(r.keyword)}</td>
    ${isKd ? `<td class="tnum">${r.keyword_difficulty ?? '—'}</td>` :
      `<td class="tnum">${r.search_volume ?? '—'}</td><td class="tnum">${r.keyword_difficulty ?? '—'}</td>
       <td class="tnum">${r.cpc != null ? '$' + (+r.cpc).toFixed(2) : '—'}</td><td class="mut">${esc(r.intent || '—')}</td>`}
  </tr>`).join('');
  el.innerHTML = `
    <div class="toolbar"><input id="krTag" type="text" class="grow" placeholder="tag (default: research)">
      <button class="btn primary" id="krSave">Save selected to tracked</button><span id="krSaveMsg" class="mut"></span></div>
    <div class="card" style="padding:4px 4px 8px"><table>
      <thead><tr><th></th><th>${cols.join('</th><th>')}</th></tr></thead><tbody>${body}</tbody></table></div>`;
  $('#krSave').addEventListener('click', async () => {
    const kws = [...document.querySelectorAll('.krchk:checked')].map(c => c.dataset.kw);
    if (!kws.length) { $('#krSaveMsg').textContent = 'Select some rows.'; return; }
    const tag = $('#krTag').value.trim();
    try {
      const r = await api(`/api/p/${p}/research/save-keywords`, { method: 'POST', body: JSON.stringify({ keywords: kws, tags: tag ? [tag] : [] }) });
      $('#krSaveMsg').innerHTML = `<span class="pos">+${r.created} tracked</span>`;
    } catch (e) { $('#krSaveMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
}

async function loadKrHistory(p) {
  try {
    const h = await api(`/api/p/${p}/research/history`);
    $('#krHistory').innerHTML = h.items.length ? h.items.map(i =>
      `<div style="font-size:12.5px;padding:2px 0">${esc(i.kind)} · <b>${esc(i.query || '')}</b> · ${i.result_count} results · $${i.cost} · <span class="mut">${esc(i.created_at)}</span></div>`).join('')
      : 'No queries yet.';
  } catch (e) { /* ignore */ }
}

async function viewSerpInspector() {
  const p = state.active;
  if (!p) return view(head('SERP Inspector') + `<div class="empty">No project yet.</div>`);
  view(head('SERP Inspector', activeName()) + `
    <div class="card">
      <p class="mut" style="font-size:12.5px">Live Google SERP (AU) for a keyword — top organic results + features.</p>
      <div class="row" style="align-items:center"><input id="siKw" type="text" class="grow" placeholder="keyword, e.g. spinrise review">
        <button class="btn primary" id="siRun">Inspect</button></div>
      <div id="siCost" class="costbar mut" style="margin-top:8px">…</div>
      <div id="siMsg" class="mut" style="margin-top:6px"></div>
      <div id="siResult" style="margin-top:12px"></div>
    </div>`);
  try { const est = await api(`/api/p/${p}/research/estimate?kind=serp`); $('#siCost').innerHTML = costLine(est); } catch (e) {}
  const run = async () => {
    const kw = $('#siKw').value.trim();
    if (!kw) { $('#siMsg').textContent = 'Enter a keyword.'; return; }
    $('#siMsg').textContent = 'Inspecting…';
    try {
      const res = await api(`/api/p/${p}/research`, { method: 'POST', body: JSON.stringify({ kind: 'serp', terms: [kw] }) });
      $('#siMsg').innerHTML = `<span class="pos">$${res.cost}</span>`;
      $('#siResult').innerHTML = serpTable(res.rows);
    } catch (e) { $('#siMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  };
  $('#siRun').addEventListener('click', run);
  $('#siKw').addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
  setUpdated();
}

// ---- Competitors (Phase 3) ----
async function viewCompetitors() {
  const p = state.active;
  if (!p) return view(head('Competitors') + `<div class="empty">No project yet.</div>`);
  async function render() {
    const data = await api(`/api/p/${p}/competitors`);
    const us = data.us;
    const usCard = `<div class="card"><div class="row" style="align-items:baseline">
      <h3 style="flex:0">${esc(us.domain)} <span class="badge ok">you</span></h3>
      <div class="mut" style="font-size:12.5px">tracked ${us.tracked} · ranking ${us.count} · top3 ${us.top3} · top10 ${us.top10}</div></div></div>`;
    const cards = data.items.map(c => {
      const o = c.last_overview;
      const metrics = o ? `organic <b>${o.count ?? '—'}</b> · top3 ${o.top3} · top10 ${o.top10} · etv ${o.etv != null ? Math.round(o.etv) : '—'}` : '<span class="mut">not fetched yet</span>';
      const deltas = o ? `<span class="move-new">+${o.is_new ?? 0} new</span> · <span class="move-up">▲${o.is_up ?? 0}</span> · <span class="move-down">▼${o.is_down ?? 0}</span> · <span class="move-lost">${o.is_lost ?? 0} lost</span>` : '';
      return `<div class="card" style="margin-top:12px">
        <div class="row" style="align-items:baseline"><h3 style="flex:0">${esc(c.domain)}</h3>${c.label ? `<span class="tag">${esc(c.label)}</span>` : ''}
          <div class="spacer"></div>
          <button class="btn" data-refresh="${c.id}">Refresh</button>
          <button class="btn" data-keywords="${c.id}">Keywords</button>
          <button class="btn" data-gap="${c.id}" title="Referring domains they have that you don't">Link gap</button>
          <button class="btn" data-del="${c.id}" title="remove">✕</button></div>
        <div style="font-size:12.5px;margin-top:6px">${metrics}</div>
        <div style="font-size:12px;margin-top:4px">${deltas}</div>
        <div class="mut" style="font-size:11px;margin-top:4px">last checked: ${esc(c.last_checked_at || 'never')}</div>
        <div id="compgap-${c.id}"></div><div id="compkw-${c.id}"></div></div>`;
    }).join('');
    $('#compList').innerHTML = usCard + (cards ||
      `<div class="empty" style="margin-top:12px">No competitors yet — add one (e.g. casinopro.example, acepoker.example).</div>`);
    document.querySelectorAll('[data-refresh]').forEach(b => b.addEventListener('click', async () => {
      b.disabled = true; b.textContent = '…';
      try { await api(`/api/p/${p}/competitors/${b.dataset.refresh}/refresh`, { method: 'POST' }); render(); }
      catch (e) { b.textContent = 'Refresh'; b.disabled = false; $('#compMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    }));
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('Remove this competitor?')) return;
      await api(`/api/p/${p}/competitors/${b.dataset.del}`, { method: 'DELETE' }); render();
    }));
    document.querySelectorAll('[data-keywords]').forEach(b => b.addEventListener('click', () => loadCompKeywords(p, b.dataset.keywords)));
    document.querySelectorAll('[data-gap]').forEach(b => b.addEventListener('click', () => loadCompGap(p, b.dataset.gap)));
  }
  view(head('Competitors', activeName()) + `
    <div class="toolbar">
      <input id="compDomain" type="text" class="grow" placeholder="competitor domain, e.g. casinopro.example">
      <input id="compLabel" type="text" placeholder="label (optional)">
      <button class="btn primary" id="compAdd">Add competitor</button><span id="compMsg" class="mut"></span></div>
    <div id="compList"><div class="loading">Loading…</div></div>`);
  $('#compAdd').addEventListener('click', async () => {
    const d = $('#compDomain').value.trim();
    if (!d) return;
    try {
      await api(`/api/p/${p}/competitors`, { method: 'POST', body: JSON.stringify({ domain: d, label: $('#compLabel').value.trim() || null }) });
      $('#compDomain').value = ''; $('#compLabel').value = ''; render();
    } catch (e) { $('#compMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  await render();
  setUpdated();
}

async function loadCompGap(p, id) {
  const el = $(`#compgap-${id}`);
  el.innerHTML = '<div class="loading">Pulling Ahrefs referring domains…</div>';
  try {
    const d = await api(`/api/p/${p}/competitors/${id}/backlink-gap`);
    const rows = d.gap.map(r => `<tr>
      <td><a href="https://${esc(r.domain)}" target="_blank" rel="noopener">${esc(r.domain)}</a></td>
      <td class="tnum">${r.domain_rating ?? '—'}</td>
      <td>${r.dofollow ? '<span class="badge ok">dofollow</span>' : '<span class="mut">nofollow</span>'}</td></tr>`).join('');
    el.innerHTML = `<div class="mut" style="font-size:12px;margin:10px 0 4px"><b>${d.gap_count}</b> domains link to <b>${esc(d.competitor)}</b> but not you (of ${d.competitor_refdomains} refdomains; you have ${d.our_refdomains}). Top ${Math.min(100, d.gap_count)} by DR — pursue the replicable ones (directories, listicles, guest posts).</div>
      <div class="card" style="padding:4px 4px 8px"><table><thead><tr><th>Referring domain</th><th>DR</th><th>Type</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="3"><span class="mut">No gap — or Ahrefs returned no referring domains.</span></td></tr>'}</tbody></table></div>`;
  } catch (e) { el.innerHTML = `<span class="neg" style="font-size:12px">${esc(e.message)}</span>`; }
}

async function loadCompKeywords(p, id) {
  const el = $(`#compkw-${id}`);
  el.innerHTML = '<div class="loading">Loading…</div>';
  try {
    const data = await api(`/api/p/${p}/competitors/${id}/keywords`);
    const body = data.rows.slice(0, 50).map(r => `<tr><td>${esc(r.keyword || '')}</td>
      <td class="tnum">${r.position ?? '—'}</td><td class="tnum">${r.search_volume ?? '—'}</td>
      <td>${r.we_track ? '<span class="badge ok">tracked</span>' : `<button class="btn" data-track="${esc(r.keyword)}">track</button>`}</td></tr>`).join('');
    el.innerHTML = `<div class="row" style="align-items:center;margin:10px 0 4px"><span class="mut" style="font-size:12px">${data.count} ranked keywords · $${data.cost} · <b>gap</b> = rows you don't track yet</span>
        <div class="spacer"></div>${data.rows.length ? `<button class="btn" id="ckExport-${id}">Export CSV</button>` : ''}</div>
      <div class="card" style="padding:4px 4px 8px"><table><thead><tr><th>Keyword</th><th>Pos</th><th>Vol</th><th></th></tr></thead><tbody>${body}</tbody></table></div>`;
    const cke = $(`#ckExport-${id}`); if (cke) cke.addEventListener('click', () => downloadCsv(`${p}-competitor-keywords.csv`,
      [{key:'keyword',label:'Keyword'},{key:'position',label:'Position'},{key:'search_volume',label:'Volume'},
       {key:'url',label:'URL'},{key:'we_track',label:'We track'}], data.rows));
    el.querySelectorAll('[data-track]').forEach(b => b.addEventListener('click', async () => {
      await api(`/api/p/${p}/research/save-keywords`, { method: 'POST', body: JSON.stringify({ keywords: [b.dataset.track], tags: ['competitor-gap'] }) });
      b.outerHTML = '<span class="badge ok">tracked</span>';
    }));
  } catch (e) { el.innerHTML = `<span class="neg" style="font-size:12px">${esc(e.message)}</span>`; }
}

// ---- Site Audit (Phase 7, OnPage instant) ----
async function viewSiteAudit() {
  const p = state.active;
  if (!p) return view(head('Site Audit') + `<div class="empty">No project yet.</div>`);
  const data = await api(`/api/p/${p}/audit`);
  const renderHistory = (items) => items.length ? items.map(a => `
    <div class="card" style="margin-top:10px">
      <div class="row" style="align-items:baseline"><b style="flex:0">${esc(shortUrl(a.url))}</b>
        <span class="badge ${a.onpage_score >= 90 ? 'ok' : 'off'}">score ${a.onpage_score ?? '—'}</span>
        <div class="spacer"></div><span class="mut" style="font-size:11px">${esc(a.created_at)}</span></div>
      <div class="mut" style="font-size:12px;margin-top:6px">title: ${esc(a.title || '—')} · internal links: ${a.internal_links ?? '—'} · ${a.checks_failed.length}/${a.checks_total ?? '—'} flags</div>
      ${a.checks_failed.length ? `<div style="margin-top:6px">${a.checks_failed.map(f => `<span class="tag">${esc(f)}</span>`).join('')}</div>` : ''}
    </div>`).join('') : `<div class="empty" style="margin-top:10px">No audits yet.</div>`;
  view(head('Site Audit', activeName()) + `
    <div class="card">
      <p class="mut" style="font-size:12.5px">Live on-page audit of a single URL (DataForSEO OnPage) → a Moz-style page <b>grade</b>, the on-page score, meta, and a fix list by category.</p>
      <div class="row" style="align-items:center"><input id="auUrl" type="text" class="grow" value="${esc(data.default_url)}">
        <button class="btn primary" id="auRun">Audit + grade page</button></div>
      <div id="auMsg" class="mut" style="margin-top:8px"></div>
    </div>
    <div id="auGrade" style="margin-top:14px">${gradeCard(data.items[0])}</div>
    <h3 style="margin:22px 0 0">Audit history</h3>
    <div id="auHistory">${renderHistory(data.items)}</div>`);
  $('#auRun').addEventListener('click', async () => {
    const url = $('#auUrl').value.trim();
    if (!url) return;
    $('#auMsg').textContent = 'Auditing…';
    try {
      const res = await api(`/api/p/${p}/audit/instant`, { method: 'POST', body: JSON.stringify({ url }) });
      const g = res.audit.grade || {};
      $('#auMsg').innerHTML = `<span class="pos">grade ${g.letter ?? '—'} · score ${res.audit.onpage_score ?? '—'} · ${res.audit.checks_failed.length} flags · $${res.cost}</span>`;
      const fresh = await api(`/api/p/${p}/audit`);
      $('#auGrade').innerHTML = gradeCard(fresh.items[0]);
      $('#auHistory').innerHTML = renderHistory(fresh.items);
    } catch (e) { $('#auMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  setUpdated();
}
function gradeCard(a) {
  if (!a || !a.grade || a.grade.score == null) return '';
  const g = a.grade;
  const cls = g.letter === 'A' ? 'pos' : (g.letter === 'B' || g.letter === 'C') ? 'warn' : 'neg';
  const cats = (g.categories || []).map(c => `
    <div style="margin-top:9px"><b style="font-size:12px">${esc(c.name)}</b>
      ${c.failed.map(f => `<div class="mut" style="font-size:11.5px;margin-left:10px;line-height:1.5">• <b>${esc(f.label)}</b> — ${esc(f.fix)}</div>`).join('')}</div>`).join('');
  return `<div class="card" style="border-color:var(--acc)">
    <div class="row" style="align-items:center;gap:14px">
      <div class="grade-badge ${cls}">${esc(g.letter)}</div>
      <div style="flex:1"><h3 style="flex:0">Page grade · ${g.score}/100</h3>
        <div class="mut" style="font-size:12px">${esc(shortUrl(a.url))} · ${g.passed ?? '—'}/${g.checks_total ?? '—'} checks passed · ${g.failed} flagged</div></div>
    </div>
    ${cats || '<div class="mut" style="font-size:12px;margin-top:8px">No issues flagged — clean page. 🎉</div>'}
  </div>`;
}

// ---- Site Crawl (Phase 13) — async full-site OnPage crawl ----
async function viewCrawl() {
  const p = state.active;
  if (!p) return view(head('Site Crawl') + `<div class="empty">No project yet.</div>`);
  let pollTimer = null;
  const render = (c) => {
    const body = $('#crawlBody'); if (!body) return;
    if (!c) { body.innerHTML = `<div class="empty">No crawl yet — start one above.</div>`; return; }
    if (c.status === 'crawling') {
      body.innerHTML = `<div class="card"><div class="row" style="align-items:center"><div class="loading">Crawling ${esc(c.target)}…</div>
        <div class="spacer"></div><span class="mut">${c.pages_crawled ?? 0}/${c.max_pages} pages</span></div></div>`;
      return;
    }
    if (c.status === 'failed') { body.innerHTML = `<div class="card"><span class="neg">Crawl failed: ${esc(c.detail || 'unknown')}</span></div>`; return; }
    const s = c.summary || {};
    const issues = (s.issues || []).map(i => `<tr><td>${esc((i.check || '').replace(/_/g, ' '))}</td><td class="tnum">${i.count}</td></tr>`).join('');
    body.innerHTML = `
      <div class="grid tiles">
        ${tile('On-page score', c.onpage_score ?? '—')}
        ${tile('Pages crawled', c.pages_crawled ?? '—', true)}
        ${tile('Internal links', s.links_internal ?? '—', true)}
        ${tile('External links', s.links_external ?? '—', true)}
      </div>
      <div class="card" style="margin-top:14px;padding:4px 4px 8px">
        <h3 style="padding:10px 10px 4px">Issues found <span class="mut" style="font-size:11px">site-wide · worst first</span></h3>
        <table><thead><tr><th>Issue</th><th>Pages</th></tr></thead>
        <tbody>${issues || '<tr><td colspan="2"><span class="mut">no issues flagged 🎉</span></td></tr>'}</tbody></table></div>
      <p class="mut" style="font-size:11.5px;margin-top:10px">Crawled ${esc(c.target)} · ${esc(c.completed_at || '')} · DataForSEO OnPage.</p>`;
  };
  const poll = async () => {
    if (state.view !== 'crawl') return;
    try {
      const d = await api(`/api/p/${p}/crawl`);
      if (state.view !== 'crawl') return;
      render(d.crawl);
      if (d.crawl && d.crawl.status === 'crawling') pollTimer = setTimeout(poll, 5000);
    } catch (e) { if ($('#crawlBody')) $('#crawlBody').innerHTML = `<div class="card"><span class="neg">${esc(e.message)}</span></div>`; }
  };
  view(head('Site Crawl', activeName()) + `
    <div class="toolbar">
      <span class="mut" style="font-size:12.5px">Full-site OnPage crawl via DataForSEO — finds site-wide technical issues.</span>
      <div class="spacer"></div>
      <select id="crawlPages"><option value="50">50 pages</option><option value="100" selected>100 pages</option><option value="250">250 pages</option></select>
      <button class="btn primary" id="crawlStart">Start crawl</button>
      <span id="crawlMsg" class="mut" style="font-size:12px;margin-left:6px"></span>
    </div>
    <div id="crawlBody"><div class="loading">Loading…</div></div>`);
  $('#crawlStart').addEventListener('click', async () => {
    const mp = +$('#crawlPages').value;
    if (!confirm(`Crawl up to ${mp} pages of ${state.active}? Small DataForSEO cost (within your cap).`)) return;
    $('#crawlMsg').textContent = 'Submitting…';
    try {
      const r = await api(`/api/p/${p}/crawl`, { method: 'POST', body: JSON.stringify({ max_pages: mp }) });
      $('#crawlMsg').innerHTML = `<span class="pos">started · $${r.cost}</span>`;
      render(r.crawl);
      if (pollTimer) clearTimeout(pollTimer);
      pollTimer = setTimeout(poll, 5000);
    } catch (e) { $('#crawlMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  await poll();
  setUpdated();
}

// ---- Rank Compare (DataForSEO vs Ahrefs Rank Tracker) ----
async function viewRankCompare() {
  const p = state.active;
  if (!p) return view(head('Rank Compare') + `<div class="empty">No project yet.</div>`);
  view(head('Rank Compare', 'DataForSEO vs Ahrefs') + `<div class="loading">Loading…</div>`);
  const [d, st] = await Promise.all([
    api(`/api/p/${p}/rank/compare`),
    api(`/api/p/${p}/settings`).catch(() => ({})),
  ]);
  const s = d.summary;
  const src = st.rank_source || 'both';
  const opt = (v, label) => `<option value="${v}" ${v === src ? 'selected' : ''}>${label}</option>`;
  const rows = d.rows.slice(0, 300).map(r => `<tr><td>${esc(r.keyword)}</td>
    <td class="tnum">${r.dataforseo ?? '—'}</td><td class="tnum">${r.ahrefs ?? '—'}</td>
    <td class="tnum">${r.diff != null ? (r.diff > 0 ? '+' : '') + r.diff : '—'}</td></tr>`).join('');
  view(head('Rank Compare', 'DataForSEO vs Ahrefs') + `
    <div class="grid tiles">
      ${tile('Tracked', s.tracked)}
      ${tile('DataForSEO ranks', s.dataforseo_ranking, true)}
      ${tile('Ahrefs ranks', s.ahrefs_ranking, true)}
      ${tile('Both', s.both, true)}
      ${tile('Only Ahrefs', s.only_ahrefs, true)}
      ${tile('Avg |Δ|', s.avg_abs_diff ?? '—', true)}
    </div>
    <div class="toolbar">
      <label class="mut" style="font-size:12.5px">Rank pull source:</label>
      <select id="rcSource">${opt('both', 'Both (DataForSEO + Ahrefs)')}${opt('dataforseo', 'DataForSEO only')}${opt('ahrefs', 'Ahrefs only — cheapest')}</select>
      <span id="rcSrcMsg" class="mut" style="font-size:12px"></span>
      <div class="spacer"></div>
      <button class="btn" id="rcExport" title="Download the comparison">Export CSV</button></div>
    <div class="card" style="padding:4px 4px 8px">
      <h3 style="padding:10px 10px 4px">Per-keyword <span class="mut" style="font-size:11px">where either source has a position</span></h3>
      <table><thead><tr><th>Keyword</th><th>DataForSEO</th><th>Ahrefs</th><th>Δ (DFS−Ah)</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="4"><span class="mut">no rank data from either source yet — run both rank pulls</span></td></tr>'}</tbody></table></div>
    <p class="mut" style="font-size:11.5px;margin-top:10px">"Only Ahrefs" = positions Ahrefs has that DataForSEO doesn't (coverage). Smaller Avg |Δ| = closer agreement between sources.</p>`);
  const rce = $('#rcExport'); if (rce) rce.addEventListener('click', () => { window.location = `/api/p/${p}/rank/compare.csv`; });
  const rcs = $('#rcSource'); if (rcs) rcs.addEventListener('change', async () => {
    $('#rcSrcMsg').textContent = 'Saving…';
    try { await api(`/api/p/${p}/settings`, { method: 'PUT', body: JSON.stringify({ rank_source: rcs.value }) });
      $('#rcSrcMsg').innerHTML = '<span class="pos">saved — applies to the next pull</span>';
    } catch (e) { $('#rcSrcMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  setUpdated();
}

// ---- Bulk Tools (bulk volume + KD in one table) ----
async function viewBulkTools() {
  const p = state.active;
  if (!p) return view(head('Bulk Tools') + `<div class="empty">No project yet.</div>`);
  view(head('Bulk Tools', activeName()) + `
    <div class="card"><h3>Bulk volume + KD</h3>
      <p class="mut" style="font-size:12.5px">Paste keywords (one per line) → search volume, CPC and difficulty in one table.</p>
      <textarea id="btInput" rows="6" placeholder="one keyword per line"></textarea>
      <div id="btCost" class="costbar mut">…</div>
      <button class="btn primary" id="btRun">Run</button><span id="btMsg" class="mut" style="margin-left:10px"></span>
      <div id="btResult" style="margin-top:14px"></div></div>
    <div class="card" style="margin-top:14px"><h3>Tags <span class="mut" id="tagCount" style="font-size:12px"></span></h3>
      <p class="mut" style="font-size:12.5px">Every tag in the project. <b>Rename</b> merges into an existing tag; <b>delete</b> removes it from all keywords.</p>
      <div id="tagList" class="card" style="padding:4px 4px 8px">Loading…</div></div>`);
  const loadTags = async () => {
    const d = await api(`/api/p/${p}/tags`);
    $('#tagCount').textContent = `(${d.total})`;
    $('#tagList').innerHTML = d.items.length
      ? `<table><thead><tr><th>Tag</th><th>Keywords</th><th></th></tr></thead><tbody>${d.items.map(t =>
          `<tr><td><span class="tag">${esc(t.tag)}</span></td><td class="tnum">${t.keywords}</td>
           <td><button class="lnk tag-rename" data-tag="${esc(t.tag)}">rename</button>
               <button class="lnk tag-del" data-tag="${esc(t.tag)}" style="color:var(--neg);margin-left:10px">delete</button></td></tr>`).join('')}</tbody></table>`
      : '<div class="empty">No tags yet — add some from the rank table or bulk tools.</div>';
    $('#tagList').querySelectorAll('.tag-rename').forEach(b => b.addEventListener('click', async () => {
      const nw = prompt(`Rename tag "${b.dataset.tag}" to:`, b.dataset.tag);
      if (!nw || nw.trim() === b.dataset.tag) return;
      await api(`/api/p/${p}/tags/rename`, { method: 'POST', body: JSON.stringify({ old: b.dataset.tag, new: nw.trim() }) });
      loadTags();
    }));
    $('#tagList').querySelectorAll('.tag-del').forEach(b => b.addEventListener('click', async () => {
      if (!confirm(`Delete tag "${b.dataset.tag}" from all keywords?`)) return;
      await api(`/api/p/${p}/tags/${encodeURIComponent(b.dataset.tag)}`, { method: 'DELETE' });
      loadTags();
    }));
  };
  loadTags();
  try { const est = await api(`/api/p/${p}/research/estimate?kind=volume`); $('#btCost').innerHTML = costLine(est); } catch (e) {}
  $('#btRun').addEventListener('click', async () => {
    const terms = $('#btInput').value.split('\n').map(s => s.trim()).filter(Boolean);
    if (!terms.length) { $('#btMsg').textContent = 'Enter keywords.'; return; }
    $('#btMsg').textContent = 'Running…';
    try {
      const [vol, kd] = await Promise.all([
        api(`/api/p/${p}/research`, { method: 'POST', body: JSON.stringify({ kind: 'volume', terms }) }),
        api(`/api/p/${p}/research`, { method: 'POST', body: JSON.stringify({ kind: 'kd', terms }) }),
      ]);
      const kdMap = {}; kd.rows.forEach(r => { kdMap[r.keyword] = r.keyword_difficulty; });
      const body = vol.rows.map(r => `<tr><td>${esc(r.keyword)}</td><td class="tnum">${r.search_volume ?? '—'}</td>
        <td class="tnum">${kdMap[r.keyword] ?? '—'}</td><td class="tnum">${r.cpc != null ? '$' + (+r.cpc).toFixed(2) : '—'}</td></tr>`).join('');
      $('#btMsg').innerHTML = `<span class="pos">${vol.rows.length} keywords · $${(vol.cost + kd.cost).toFixed(4)}</span>`;
      $('#btResult').innerHTML = `<div class="card" style="padding:4px 4px 8px"><table>
        <thead><tr><th>Keyword</th><th>Vol</th><th>KD</th><th>CPC</th></tr></thead><tbody>${body}</tbody></table></div>`;
    } catch (e) { $('#btMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  setUpdated();
}

// ---- Site Health (on-page audits aggregate; GSC CWV folds in later) ----
async function viewSiteHealth() {
  const p = state.active;
  if (!p) return view(head('Site Health') + `<div class="empty">No project yet.</div>`);
  const data = await api(`/api/p/${p}/audit`);
  const latest = data.items[0];
  view(head('Site Health', activeName()) + `
    ${latest ? `<div class="grid tiles">
        ${tile('On-page score', latest.onpage_score ?? '—')}
        ${tile('Open flags', latest.checks_failed.length, true)}
        ${tile('Internal links', latest.internal_links ?? '—', true)}
        ${tile('Audits run', data.items.length, true)}</div>
      <div class="card" style="margin-top:14px"><h3>Latest audit · ${esc(shortUrl(latest.url))}</h3>
        <div style="margin-top:6px">${latest.checks_failed.map(f => `<span class="tag">${esc(f)}</span>`).join('') || '<span class="mut">no flags</span>'}</div></div>`
      : `<div class="empty">No audits yet — run one on the <b>Site Audit</b> page.</div>`}
    <div class="card" style="margin-top:14px">
      <div class="row" style="align-items:center"><h3 style="flex:0">Core Web Vitals</h3>
        <span class="mut" style="font-size:11px">PageSpeed Insights</span><div class="spacer"></div>
        <select id="cwvStrategy"><option value="mobile">Mobile</option><option value="desktop">Desktop</option></select>
        <button class="btn primary" id="cwvRun">Run</button></div>
      <div id="cwvMsg" class="mut" style="font-size:12.5px;margin-top:6px">Runs Lighthouse on the primary domain (~15s) and records a snapshot.</div>
      <div id="cwvTrend" style="margin-top:10px"></div>
      <div id="cwvResult" style="margin-top:10px"></div>
    </div>`);
  const loadCwvTrend = async () => {
    try {
      const h = await api(`/api/p/${p}/pagespeed/history?strategy=${$('#cwvStrategy').value}`);
      drawCwvTrend(h.items || []);
    } catch (e) { /* ignore */ }
  };
  const cwv = $('#cwvRun');
  if (cwv) cwv.addEventListener('click', async () => {
    $('#cwvMsg').textContent = 'Running Lighthouse… (~15s)'; $('#cwvResult').innerHTML = '';
    try {
      const d = await api(`/api/p/${p}/pagespeed/snapshot?strategy=${$('#cwvStrategy').value}`, { method: 'POST', body: '{}' });
      if (!d.ok) {
        $('#cwvMsg').innerHTML = `<span class="neg">${esc(d.error || 'failed')}</span>` +
          (d.has_key ? '' : ` <span class="mut">— keyless is rate-limited; add GOOGLE_PAGESPEED_API_KEY for reliability.</span>`);
        return;
      }
      $('#cwvMsg').innerHTML = `<span class="pos">${esc(shortUrl(d.tested_url || d.requested_url))} · ${esc(d.strategy || '')} · snapshot saved</span>`;
      $('#cwvResult').innerHTML = cwvHtml(d);
      loadCwvTrend();
    } catch (e) { $('#cwvMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  const cwvStrat = $('#cwvStrategy'); if (cwvStrat) cwvStrat.addEventListener('change', loadCwvTrend);
  loadCwvTrend();
  setUpdated();
}
function drawCwvTrend(items) {
  const el = $('#cwvTrend'); if (!el) return;
  if (items.length < 2) { el.innerHTML = items.length ? '' : ''; return; }  // need ≥2 points to trend
  const score = items.map(d => ({ time: d.date, value: d.score })).filter(d => d.value != null);
  const lcp = items.map(d => ({ time: d.date, value: d.lcp_ms != null ? +(d.lcp_ms / 1000).toFixed(2) : null })).filter(d => d.value != null);
  el.innerHTML = `<div class="mut" style="font-size:11px;margin-bottom:4px">Trend — <span style="color:#3fd896">●</span> score · <span style="color:#f5a623">●</span> LCP (s)</div><div id="cwvChart" style="height:160px"></div>`;
  const c = $('#cwvChart');
  if (window.LightweightCharts && c) {
    const chart = LightweightCharts.createChart(c, { height: 160, layout: { background: { color: 'transparent' }, textColor: '#7d8c9b' },
      grid: { vertLines: { color: '#1c2632' }, horzLines: { color: '#1c2632' } },
      rightPriceScale: { borderColor: '#27323f' }, leftPriceScale: { borderColor: '#27323f', visible: true }, timeScale: { borderColor: '#27323f' } });
    if (score.length) chart.addLineSeries({ color: '#3fd896', lineWidth: 2, priceScaleId: 'right' }).setData(score);
    if (lcp.length) chart.addLineSeries({ color: '#f5a623', lineWidth: 2, priceScaleId: 'left' }).setData(lcp);
    chart.timeScale().fitContent();
  } else if (c) { c.innerHTML = sparkline(score.map(d => d.value)); }
}
function cwvHtml(d) {
  const lab = d.lab || {}, field = d.field || {};
  const dv = k => (lab[k] && lab[k].display) ?? '—';
  const labRow = (k, label) => `<tr><td>${label}</td><td class="tnum">${dv(k)}</td></tr>`;
  const catBadge = c => c === 'FAST' ? '<span class="badge ok">good</span>'
    : c === 'AVERAGE' ? '<span class="badge off">needs work</span>'
    : c === 'SLOW' ? '<span class="badge off">poor</span>' : '';
  const fk = Object.keys(field);
  return `
    <div class="grid tiles">
      ${tile('Performance', d.score ?? '—')}
      ${tile('LCP', dv('lcp'), true)}
      ${tile('CLS', dv('cls'), true)}
      ${tile('TBT', dv('tbt'), true)}
    </div>
    <div class="row" style="margin-top:12px;align-items:flex-start">
      <div class="card"><h3>Lab (Lighthouse)</h3><table>
        ${labRow('fcp', 'First Contentful Paint')}${labRow('lcp', 'Largest Contentful Paint')}
        ${labRow('cls', 'Cumulative Layout Shift')}${labRow('tbt', 'Total Blocking Time')}
        ${labRow('speed_index', 'Speed Index')}${labRow('tti', 'Time to Interactive')}</table></div>
      <div class="card"><h3>Field · real users <span class="mut" style="font-size:11px">${d.field_overall ? esc(d.field_overall) : 'no CrUX data'}</span></h3>
        ${fk.length ? `<table>${fk.map(k => `<tr><td>${esc(k.toUpperCase())}</td><td class="tnum">${field[k].percentile ?? '—'}</td><td>${catBadge(field[k].category)}</td></tr>`).join('')}</table>`
          : '<p class="mut" style="font-size:12px">Not enough real-user traffic for field data yet — the lab scores above still apply.</p>'}</div>
    </div>`;
}

// ---- Backlinks Profile (live via Ahrefs API) ----
async function viewBacklinks() {
  const p = state.active;
  if (!p) return view(head('Backlinks Profile') + `<div class="empty">No project yet.</div>`);
  view(head('Backlinks Profile', activeName()) + `<div class="loading">Loading…</div>`);
  const d = await api(`/api/p/${p}/backlinks`);
  if (!d.configured) {
    view(head('Backlinks Profile', activeName()) + `
      <div class="card"><div class="row" style="align-items:center"><h3 style="flex:0">Backlinks</h3><span class="badge off">not connected</span></div>
        <p class="mut" style="font-size:12.5px">${esc(d.detail || 'Connect Ahrefs to see backlinks.')}</p>
        <button class="btn" id="blGo">Go to Integrations</button></div>`);
    const g = $('#blGo'); if (g) g.addEventListener('click', () => go('integrations'));
    return;
  }
  const rows = (d.top_referring_domains || []).map(r => `<tr><td>${esc(r.domain || '')}${r.toxic ? ' <span class="badge off" title="' + esc(r.toxic_reason || '') + '">toxic</span>' : ''}</td>
    <td class="tnum">${r.domain_rating ?? '—'}</td><td class="tnum">${r.links ?? '—'}</td>
    <td class="tnum">${r.dofollow ?? '—'}</td><td class="mut">${esc((r.first_seen || '').slice(0, 10))}</td></tr>`).join('');
  const toxRows = (d.toxic_domains || []).map(t => `<tr><td>${esc(t.domain)}</td>
    <td class="tnum">${t.domain_rating ?? '—'}</td><td class="tnum">${t.dofollow ?? '—'}</td>
    <td class="mut" style="font-size:12px">${esc(t.reason || '')}</td></tr>`).join('');
  view(head('Backlinks Profile', activeName()) + `
    <div class="grid tiles">
      ${tile('Domain Rating', d.domain_rating ?? '—')}
      ${tile('Referring domains', d.refdomains_live ?? '—', true)}
      ${tile('Backlinks (live)', d.backlinks_live ?? '—', true)}
      ${tile('Toxic flagged', d.toxic_count ?? 0, true)}
    </div>
    ${(d.toxic_count || 0) > 0 ? `<div class="card" style="margin-top:14px;padding:4px 4px 8px">
      <div class="row" style="align-items:center;padding:10px 10px 4px"><h3 style="flex:0">⚠ Toxic / disavow candidates <span class="mut" style="font-size:11px">${d.toxic_count} of ${d.referring_domains_seen} refdomains</span></h3>
        <div class="spacer"></div><button class="btn danger" id="blDisavow">Download disavow file</button></div>
      <table><thead><tr><th>Domain</th><th>DR</th><th>Dofollow</th><th>Why flagged</th></tr></thead>
      <tbody>${toxRows}</tbody></table></div>` : ''}
    <div class="card" style="margin-top:14px;padding:4px 4px 8px">
      <h3 style="padding:10px 10px 4px">Top referring domains <span class="mut" style="font-size:11px">by DR</span></h3>
      <table><thead><tr><th>Domain</th><th>DR</th><th>Links</th><th>Dofollow</th><th>First seen</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5"><span class="mut">none</span></td></tr>'}</tbody></table></div>
    <p class="mut" style="font-size:11.5px;margin-top:10px">Source: Ahrefs API. Toxic = known PBN (e.g. itxoft) or DR≤3 with no dofollow links. Review the disavow file before uploading to Google Search Console.</p>`);
  const dz = $('#blDisavow');
  if (dz) dz.addEventListener('click', () => { window.location = `/api/p/${p}/backlinks/disavow.txt`; });
  setUpdated();
}

// ---- Analytics (live via Ahrefs Web Analytics) ----
async function viewAnalytics() {
  const p = state.active;
  if (!p) return view(head('Analytics') + `<div class="empty">No project yet.</div>`);
  view(head('Analytics', activeName()) + `<div class="loading">Loading…</div>`);
  const d = await api(`/api/p/${p}/analytics`);
  if (!d.configured) {
    view(head('Analytics', activeName()) + `
      <div class="card"><div class="row" style="align-items:center"><h3 style="flex:0">Web Analytics</h3><span class="badge off">not connected</span></div>
        <p class="mut" style="font-size:12.5px">${esc(d.reason || 'Connect Ahrefs.')}</p>
        <button class="btn" id="anGo">Go to Integrations</button></div>`);
    const g = $('#anGo'); if (g) g.addEventListener('click', () => go('integrations'));
    return;
  }
  view(head('Analytics', activeName()) + `
    <div class="grid tiles">
      ${tile('Visitors', d.visitors ?? '—')}
      ${tile('Visits', d.visits ?? '—', true)}
      ${tile('Pageviews', d.pageviews ?? '—', true)}
      ${tile('Bounce rate', d.bounce_rate != null ? (d.bounce_rate * 100).toFixed(0) + '%' : '—', true)}
      ${tile('Avg session', d.avg_session_sec != null ? d.avg_session_sec + 's' : '—', true)}
    </div>
    <p class="mut" style="font-size:11.5px;margin-top:10px">Ahrefs Web Analytics · last ${d.days} days. (GA4 can be added later via Google OAuth.)</p>`);
  setUpdated();
}

// ---- Search Console (live via Ahrefs → GSC) ----
async function viewSearchConsole() {
  const p = state.active;
  if (!p) return view(head('Search Console') + `<div class="empty">No project yet.</div>`);
  view(head('Search Console', activeName()) + `<div class="loading">Loading…</div>`);
  const d = await api(`/api/p/${p}/gsc`);
  if (!d.configured) {
    view(head('Search Console', activeName()) + `
      <div class="card"><div class="row" style="align-items:center"><h3 style="flex:0">Search Console</h3><span class="badge off">not connected</span></div>
        <p class="mut" style="font-size:12.5px">${esc(d.reason || 'Connect Ahrefs (GSC is read through the linked Ahrefs project).')}</p>
        <button class="btn" id="gscGo">Go to Integrations</button></div>`);
    const g = $('#gscGo'); if (g) g.addEventListener('click', () => go('integrations'));
    return;
  }
  const rows = (d.rows || []).slice(0, 100).map(r => `<tr><td>${esc(r.keyword || '')}</td>
    <td class="tnum">${r.clicks ?? '—'}</td><td class="tnum">${r.impressions ?? '—'}</td>
    <td class="tnum">${r.ctr != null ? (r.ctr * 100).toFixed(1) + '%' : '—'}</td>
    <td class="tnum">${r.position != null ? r.position.toFixed(1) : '—'}</td>
    <td>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(shortUrl(r.url))}</a>` : '—'}</td></tr>`).join('');
  view(head('Search Console', activeName()) + `
    <div class="grid tiles">
      ${tile('Clicks', d.totals.clicks)}
      ${tile('Impressions', d.totals.impressions, true)}
      ${tile('Queries', (d.rows || []).length, true)}
    </div>
    <div class="card" style="margin-top:14px;padding:4px 4px 8px">
      <div class="row" style="align-items:center;padding:10px 10px 4px"><h3 style="flex:0">Top queries <span class="mut" style="font-size:11px">last ${d.days}d</span></h3>
        <div class="spacer"></div>${(d.rows || []).length ? `<button class="btn" id="gscExport">Export CSV</button>` : ''}</div>
      <table><thead><tr><th>Query</th><th>Clicks</th><th>Impr.</th><th>CTR</th><th>Pos</th><th>URL</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="6"><span class="mut">no impressions yet</span></td></tr>'}</tbody></table></div>
    <p class="mut" style="font-size:11.5px;margin-top:10px">GSC read via the linked Ahrefs project (free). 2–3 day GSC delay applies.</p>`);
  const ge = $('#gscExport'); if (ge) ge.addEventListener('click', () => downloadCsv(`${p}-gsc-queries.csv`,
    [{key:'keyword',label:'Query'},{key:'clicks',label:'Clicks'},{key:'impressions',label:'Impressions'},
     {key:'ctr',label:'CTR'},{key:'position',label:'Position'},{key:'url',label:'URL'}], d.rows || []));
  setUpdated();
}

// ---- Bing Webmaster (search performance for Bing) ----
async function viewBing() {
  const p = state.active;
  if (!p) return view(head('Bing Webmaster') + `<div class="empty">No project yet.</div>`);
  view(head('Bing Webmaster', activeName()) + `<div class="loading">Loading…</div>`);
  const d = await api(`/api/p/${p}/bing`);
  if (!d.configured) {
    view(head('Bing Webmaster', activeName()) + `
      <div class="card"><div class="row" style="align-items:center"><h3 style="flex:0">Bing Webmaster</h3><span class="badge off">not connected</span></div>
        <p class="mut" style="font-size:12.5px">${esc(d.reason || 'Connect Bing.')}</p>
        <button class="btn" id="biGo">Go to Integrations</button></div>`);
    const g = $('#biGo'); if (g) g.addEventListener('click', () => go('integrations'));
    return;
  }
  const rows = (d.queries || []).slice(0, 100).map(r => `<tr><td>${esc(r.query || '')}</td>
    <td class="tnum">${r.clicks ?? '—'}</td><td class="tnum">${r.impressions ?? '—'}</td>
    <td class="tnum">${r.avg_click_position ?? '—'}</td><td class="tnum">${r.avg_impression_position ?? '—'}</td></tr>`).join('');
  view(head('Bing Webmaster', activeName()) + `
    <div class="grid tiles">
      ${tile('Clicks', d.totals.clicks)}
      ${tile('Impressions', d.totals.impressions, true)}
      ${tile('Queries', (d.queries || []).length, true)}
    </div>
    <div class="card" style="margin-top:14px;padding:4px 4px 8px">
      <h3 style="padding:10px 10px 4px">Top queries <span class="mut" style="font-size:11px">${esc(d.site)}</span></h3>
      <table><thead><tr><th>Query</th><th>Clicks</th><th>Impr.</th><th>Click pos</th><th>Impr pos</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5"><span class="mut">no Bing impressions yet — data appears once Bing indexes traffic</span></td></tr>'}</tbody></table></div>
    <p class="mut" style="font-size:11.5px;margin-top:10px">Source: Bing Webmaster Tools API · verified site ${esc(d.site)}.</p>`);
  setUpdated();
}

// ---- connect-prompt (other future integrations) ----
function viewConnectPrompt(title, what) {
  view(head(title, activeName()) + `
    <div class="card"><div class="row" style="align-items:center"><h3 style="flex:0">${esc(title)}</h3><span class="badge off">not connected</span></div>
      <p class="mut" style="font-size:12.5px">Connect ${esc(title)} to see ${esc(what)} here. Connection needs credentials — set them up under <b>Integrations</b> (see BLOCKERS.md).</p>
      <button class="btn" id="cpGo">Go to Integrations</button></div>`);
  const g = $('#cpGo'); if (g) g.addEventListener('click', () => go('integrations'));
  setUpdated();
}

// ---- Spend report (Settings/global) ----
async function viewSpend() {
  view(head('Spend', 'Global · DataForSEO + AI') + `<div class="loading">Loading…</div>`);
  const s = await api('/api/spend');
  const pct = s.monthly_cap ? Math.min(100, Math.round((s.mtd / s.monthly_cap) * 100)) : 0;
  const barClass = pct >= 90 ? 'neg' : pct >= 75 ? 'warn' : 'pos';
  const proj = s.by_project.map(r => `<tr><td>${esc(r.project)}</td><td class="tnum">${r.calls}</td><td class="tnum">$${r.cost}</td></tr>`).join('');
  const eps = s.by_endpoint.map(r => `<tr><td style="font-size:11.5px">${esc(r.endpoint)}</td><td class="tnum">${r.calls}</td><td class="tnum">$${r.cost}</td></tr>`).join('');
  const ai = s.ai || { mtd: 0, today: 0, mtd_calls: 0, by_purpose: [], by_model: [] };
  const fmt4 = v => '$' + Number(v || 0).toFixed(4);
  const aiPurpose = (ai.by_purpose || []).map(r => `<tr><td>${esc(r.purpose)}</td><td class="tnum">${r.calls}</td><td class="tnum mut">${(r.tokens || 0).toLocaleString()}</td><td class="tnum">${fmt4(r.cost)}</td></tr>`).join('');
  const aiModel = (ai.by_model || []).map(r => `<tr><td style="font-size:11.5px">${esc(r.model)}</td><td class="tnum">${r.calls}</td><td class="tnum mut">${(r.tokens || 0).toLocaleString()}</td><td class="tnum">${fmt4(r.cost)}</td></tr>`).join('');
  view(head('Spend', 'Global · DataForSEO + AI') + `
    <div class="grid tiles">
      ${tile('Month to date', '$' + s.mtd)}
      ${tile('Today', '$' + s.today, true)}
      ${tile('Monthly cap', '$' + s.monthly_cap, true)}
      ${tile('Remaining', '$' + s.monthly_remaining, true)}
    </div>
    <div class="card" style="margin-top:14px">
      <div class="mut" style="font-size:12px">Monthly budget — ${pct}% used</div>
      <div class="meter"><div class="meter-fill ${barClass}" style="width:${pct}%"></div></div>
    </div>
    <div class="card" style="margin-top:14px">
      <h3>Budget caps</h3>
      <p class="mut" style="font-size:12.5px">Submits are blocked when a call would breach a cap. Edited here (stored as global settings) or via <code>SEOBOT_DFS_DAILY_CAP</code> / <code>SEOBOT_DFS_MONTHLY_CAP</code>.</p>
      <div class="row" style="align-items:flex-end">
        <div class="field"><label>Daily cap (USD)</label><input id="capDaily" type="number" min="0" step="0.5" value="${esc(s.daily_cap)}"></div>
        <div class="field"><label>Monthly cap (USD)</label><input id="capMonthly" type="number" min="0" step="5" value="${esc(s.monthly_cap)}"></div>
        <button class="btn primary" id="capSave">Save caps</button>
        <span id="capMsg" class="mut" style="font-size:12.5px"></span>
      </div>
    </div>
    <div class="row" style="margin-top:14px;align-items:flex-start">
      <div class="card"><h3>By project</h3><table><thead><tr><th>Project</th><th>Calls</th><th>Cost</th></tr></thead><tbody>${proj}</tbody></table></div>
      <div class="card"><h3>By endpoint</h3><table><thead><tr><th>Endpoint</th><th>Calls</th><th>Cost</th></tr></thead><tbody>${eps}</tbody></table></div>
    </div>

    <h3 style="margin:26px 0 0">🧠 AI assistant cost</h3>
    <p class="mut" style="font-size:12px;margin:4px 0 0">LLM spend (Action Plan "AI assist" + the daily strategist), logged per call from token usage. Cost is an estimate from each model's list price.</p>
    <div class="grid tiles" style="margin-top:12px">
      ${tile('AI · Month to date', fmt4(ai.mtd))}
      ${tile('AI calls (MTD)', ai.mtd_calls || 0, true)}
      ${tile('AI · Today', fmt4(ai.today), true)}
    </div>
    <div class="row" style="margin-top:14px;align-items:flex-start">
      <div class="card"><h3>By purpose <span class="mut" style="font-size:11px">MTD</span></h3>
        <table><thead><tr><th>Purpose</th><th>Calls</th><th>Tokens</th><th>Cost</th></tr></thead>
        <tbody>${aiPurpose || '<tr><td colspan="4"><span class="mut">No AI usage yet — add SEOBOT_AI_API_KEY to enable.</span></td></tr>'}</tbody></table></div>
      <div class="card"><h3>By model <span class="mut" style="font-size:11px">MTD</span></h3>
        <table><thead><tr><th>Model</th><th>Calls</th><th>Tokens</th><th>Cost</th></tr></thead>
        <tbody>${aiModel || '<tr><td colspan="4"><span class="mut">—</span></td></tr>'}</tbody></table></div>
    </div>`);
  $('#capSave').addEventListener('click', async () => {
    $('#capMsg').textContent = 'Saving…';
    try {
      await api('/api/settings', { method: 'PUT', body: JSON.stringify({
        dfs_daily_cap: $('#capDaily').value, dfs_monthly_cap: $('#capMonthly').value }) });
      $('#capMsg').innerHTML = '<span class="pos">Saved.</span>';
      viewSpend();
    } catch (e) { $('#capMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  setUpdated();
}

// ---- Domain Finder — hunt expired/dropped domains (AU + casino/gambling) for parasite SEO ----
const domScoreCls = s => s == null ? 'mut' : s >= 60 ? 'pos' : s >= 35 ? 'warn' : 'mut';
function domRow(r) {
  return `<tr>
    <td><a href="https://${esc(r.domain)}" target="_blank" rel="noopener">${esc(r.domain)}</a></td>
    <td>${(r.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join(' ')}</td>
    <td class="tnum">${r.relevancy}</td>
    <td class="tnum">${r.domain_rating ?? '—'}</td>
    <td class="tnum mut">${r.refdomains ?? '—'}</td>
    <td class="tnum"><b class="${domScoreCls(r.parasite_score)}">${r.parasite_score ?? '—'}</b></td>
    <td class="tnum">${r.price != null ? '$' + r.price : '—'}</td>
    <td class="mut" style="font-size:11px">${domAge(r)}</td>
    <td><button class="lnk dom-save" data-domain="${esc(r.domain)}" data-price="${r.price != null ? r.price : ''}">+ watch</button></td></tr>`;
}
const domAge = r => r.first_seen ? `${esc(r.first_seen)} · ${r.wayback_years}y` : '—';
async function viewDomains() {
  const p = state.active;
  if (!p) return view(head('Domain Finder') + `<div class="empty">No project yet.</div>`);
  view(head('Domain Finder', activeName()) + `<div class="loading">Loading…</div>`);
  const wl = await api(`/api/p/${p}/domains`).catch(() => ({ items: [], total: 0 }));
  const resHead = '<tr><th>Domain</th><th>Tags</th><th>Rel</th><th>DR</th><th>Ref</th><th>Score</th><th>Price</th><th title="Wayback: first seen · years archived">History</th><th></th></tr>';
  view(head('Domain Finder', activeName()) + `
    <div class="toolbar">
      <select id="domSource">
        <option value="whoisfreaks-dropped">Dropped domains (free daily feed)</option>
        <option value="whoisfreaks-expired">Expired domains (free daily feed)</option>
        <option value="godaddy-expiring">GoDaddy auctions — for sale + price (slower)</option>
        <option value="godaddy-biddable">GoDaddy biddable auctions — price (slower)</option>
      </select>
      <label class="mut" style="font-size:12px"><input type="checkbox" id="domEnrich"> Score authority + history (slower)</label>
      <button class="btn primary" id="domScan">Scan feed</button>
      <div class="spacer"></div>
      <span id="domMsg" class="mut" style="font-size:12px"></span>
    </div>
    <details class="card" style="margin-top:10px;padding:10px 12px"><summary style="cursor:pointer">Paste your own list (GoDaddy / ExpiredDomains.net export, any source)</summary>
      <textarea id="domPaste" rows="5" style="width:100%;margin-top:8px;font:12px var(--mono)" placeholder="one domain per line — junk/CSV columns are tolerated"></textarea>
      <div class="row" style="margin-top:6px;align-items:center"><label class="mut" style="font-size:12px"><input type="checkbox" id="domPasteEnrich"> Score authority + history (slower)</label><div class="spacer"></div><button class="btn" id="domImport">Score list</button></div>
    </details>
    <div id="domResultsWrap" style="margin-top:14px"></div>
    <div class="row" style="margin:26px 0 0;align-items:center"><h3 style="flex:0">⭐ Watchlist <span class="mut" style="font-size:11px">(${wl.total})</span></h3><div class="spacer"></div>${wl.total ? '<button class="btn" id="domExport">Export CSV</button>' : ''}</div>
    <div class="card" style="margin-top:10px;padding:4px 4px 8px" id="domWatch"></div>`);

  const showResults = (d, label) => {
    const note = d.ahrefs_ready ? '' : ' · connect Ahrefs to score authority';
    const enr = d.enriched ? ` · enriched ${d.enriched}` : '';
    $('#domMsg').innerHTML = `scanned ${d.scanned ?? 0} · <b>${(d.items || []).length}</b> relevant${enr}${note}`;
    $('#domResultsWrap').innerHTML = `<p class="mut" style="font-size:12px">${esc(label)} — Australian or casino/gambling matches, ${d.items && d.items[0] && d.items[0].parasite_score != null ? 'best parasite score' : 'most relevant'} first. Score needs Ahrefs (authority is the point of buying an expired domain).</p>
      <div class="card" style="padding:4px 4px 8px"><table><thead>${resHead}</thead><tbody>${(d.items || []).map(domRow).join('') || '<tr><td colspan="9"><div class="empty">No relevant domains in this batch — try the other feed or a bigger paste.</div></td></tr>'}</tbody></table></div>`;
    $('#domResultsWrap').querySelectorAll('.dom-save').forEach(b => b.addEventListener('click', async () => {
      b.disabled = true; b.textContent = 'saving…';
      const price = b.dataset.price ? parseFloat(b.dataset.price) : null;
      try { await api(`/api/p/${p}/domains`, { method: 'POST', body: JSON.stringify({ domain: b.dataset.domain, source: d.source, price, enrich: true }) }); b.textContent = '✓ watched'; refreshWatch(); }
      catch (e) { b.disabled = false; b.textContent = '+ watch'; alert(e.message); }
    }));
  };
  const refreshWatch = async () => renderWatch((await api(`/api/p/${p}/domains`)).items);
  const renderWatch = items => {
    $('#domWatch').innerHTML = items.length
      ? `<table><thead><tr><th>Domain</th><th>Tags</th><th>Rel</th><th>DR</th><th>Ref</th><th>Score</th><th>History</th><th>Status</th><th>Price</th><th></th></tr></thead><tbody>${items.map(watchRow).join('')}</tbody></table>`
      : '<div class="empty">No saved domains yet — scan a feed and click “+ watch”.</div>';
    $('#domWatch').querySelectorAll('.dom-status').forEach(sel => sel.addEventListener('change', () =>
      api(`/api/p/${p}/domains/${sel.closest('tr').dataset.id}`, { method: 'PATCH', body: JSON.stringify({ status: sel.value }) })));
    $('#domWatch').querySelectorAll('.dom-del').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('Remove from watchlist?')) return;
      await api(`/api/p/${p}/domains/${b.closest('tr').dataset.id}`, { method: 'DELETE' }); refreshWatch();
    }));
  };
  renderWatch(wl.items);

  $('#domScan').addEventListener('click', async () => {
    const src = $('#domSource').value, isGd = src.startsWith('godaddy');
    const b = $('#domScan'); b.disabled = true; b.textContent = 'Scanning…';
    $('#domMsg').textContent = isGd ? 'streaming GoDaddy auctions (~15s)…' : 'fetching feed…';
    try {
      const d = await api(`/api/p/${p}/domains/scan`, { method: 'POST', body: JSON.stringify({ source: src, enrich: $('#domEnrich').checked, limit: 60 }) });
      showResults(d, isGd ? 'GoDaddy auctions (priced)' : 'Free daily feed');
    } catch (e) { $('#domMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    finally { b.disabled = false; b.textContent = 'Scan feed'; }
  });
  $('#domImport').addEventListener('click', async () => {
    const text = $('#domPaste').value.trim(); if (!text) return;
    const b = $('#domImport'); b.disabled = true; b.textContent = 'Scoring…';
    try {
      const d = await api(`/api/p/${p}/domains/import`, { method: 'POST', body: JSON.stringify({ text, enrich: $('#domPasteEnrich').checked, limit: 200 }) });
      showResults(d, 'Pasted list');
    } catch (e) { alert(e.message); } finally { b.disabled = false; b.textContent = 'Score list'; }
  });
  const ex = $('#domExport'); if (ex) ex.addEventListener('click', () => { window.location = `/api/p/${p}/domains/export.csv`; });
  setUpdated();
}
function watchRow(c) {
  const opts = ['watching', 'bought', 'rejected'].map(s => `<option ${c.status === s ? 'selected' : ''}>${s}</option>`).join('');
  return `<tr data-id="${c.id}">
    <td><a href="https://${esc(c.domain)}" target="_blank" rel="noopener">${esc(c.domain)}</a></td>
    <td>${(c.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join(' ')}</td>
    <td class="tnum">${c.relevancy}</td><td class="tnum">${c.domain_rating ?? '—'}</td>
    <td class="tnum mut">${c.refdomains ?? '—'}</td><td class="tnum"><b class="${domScoreCls(c.parasite_score)}">${c.parasite_score ?? '—'}</b></td>
    <td class="mut" style="font-size:11px">${domAge(c)}</td>
    <td><select class="dom-status">${opts}</select></td>
    <td class="tnum mut">${c.price != null ? '$' + c.price : '—'}</td>
    <td><button class="lnk dom-del" style="color:var(--neg)">remove</button></td></tr>`;
}

// ---- Indexation monitor — is Google actually indexing your URLs? ----
async function viewIndexation() {
  const p = state.active;
  if (!p) return view(head('Indexation') + `<div class="empty">No project yet.</div>`);
  view(head('Indexation', activeName()) + `<div class="loading">Loading…</div>`);
  const render = (d) => {
    const idxBadge = u => u.indexed == null ? '<span class="mut">not checked</span>'
      : u.indexed ? '<span class="badge ok">indexed</span>' : '<span class="badge off">NOT indexed</span>';
    const rows = (d.items || []).map(u => `<tr data-id="${u.id}">
      <td><a href="${esc(u.url)}" target="_blank" rel="noopener">${esc(shortUrl(u.url))}</a></td>
      <td>${u.label ? `<span class="tag">${esc(u.label)}</span>` : '<span class="mut">—</span>'}</td>
      <td>${idxBadge(u)}</td>
      <td class="tnum mut">${u.serp_count ?? '—'}</td>
      <td class="mut" style="font-size:11px">${u.checked_on ? esc(String(u.checked_on).slice(0, 10)) : '—'}</td>
      <td><button class="lnk idx-del" style="color:var(--neg)">remove</button></td></tr>`).join('');
    view(head('Indexation', activeName()) + `
      <div class="toolbar">
        <input id="idxUrl" class="grow" type="text" placeholder="URL to monitor (your page or a parasite placement)">
        <input id="idxLabel" type="text" placeholder="label (optional)" style="max-width:160px">
        <button class="btn primary" id="idxAdd">Add URL</button>
        <button class="btn" id="idxSync" title="Pull every published page from the site's CMS (SDM) into this list">⤵ Sync from site</button>
        <button class="btn" id="idxCheck" title="site: SERP check for every URL (≈$0.002 each)">Check all</button>
        <div class="spacer"></div><span id="idxMsg" class="mut" style="font-size:12px">${d.total} URLs · <b class="pos">${d.indexed}</b> indexed of ${d.checked} checked</span>
      </div>
      <div class="card" style="margin-top:12px;padding:4px 4px 8px">
        <table><thead><tr><th>URL</th><th>Label</th><th>Indexed?</th><th>Results</th><th>Checked</th><th></th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6"><div class="empty">No URLs yet — add your money pages + any parasite placements, then “Check all”.</div></td></tr>'}</tbody></table>
      </div>`);
    $('#idxAdd').addEventListener('click', async () => {
      const url = $('#idxUrl').value.trim(); if (!url) return;
      try { await api(`/api/p/${p}/indexation`, { method: 'POST', body: JSON.stringify({ url, label: $('#idxLabel').value.trim() || null }) }); viewIndexation(); }
      catch (e) { $('#idxMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    });
    $('#idxSync').addEventListener('click', async () => {
      const b = $('#idxSync'); b.disabled = true; b.textContent = 'Syncing…';
      try { const r = await api(`/api/p/${p}/sdm/sync`, { method: 'POST', body: '{}' });
        $('#idxMsg').innerHTML = `<span class="pos">synced ${r.synced} pages (+${r.added} new) · ${Object.entries(r.by_type || {}).map(([t, n]) => `${t}:${n}`).join(' · ')}</span>`; setTimeout(() => viewIndexation(), 1100); }
      catch (e) { b.disabled = false; b.textContent = '⤵ Sync from site'; $('#idxMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    });
    $('#idxCheck').addEventListener('click', async () => {
      const b = $('#idxCheck'); b.disabled = true; b.textContent = 'Checking…';
      try { const r = await api(`/api/p/${p}/indexation/check`, { method: 'POST', body: '{}' });
        $('#idxMsg').innerHTML = `<span class="pos">${r.indexed}/${r.checked} indexed · $${r.cost}</span>`; setTimeout(() => viewIndexation(), 900); }
      catch (e) { b.disabled = false; b.textContent = 'Check all'; $('#idxMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    });
    document.querySelectorAll('.idx-del').forEach(btn => btn.addEventListener('click', async () => {
      await api(`/api/p/${p}/indexation/${btn.closest('tr').dataset.id}`, { method: 'DELETE' }); viewIndexation();
    }));
  };
  render(await api(`/api/p/${p}/indexation`));
  setUpdated();
}

// ---- Connections — pair a site via the seobot Connector plugin (pull model) ----
async function viewConnections() {
  const p = state.active;
  if (!p) return view(head('Connections') + `<div class="empty">No project yet.</div>`);
  view(head('Connections', activeName()) + `
    <p class="mut" style="font-size:12.5px">Connect a site by installing the <b>seobot Connector</b> plugin and pairing it with a token. The site polls seobot for publish jobs and reports back — <b>no API keys, no inbound access</b>, works behind Cloudflare.</p>
    <div class="toolbar"><input id="connName" class="grow" type="text" placeholder="connection name, e.g. demo-casino.example"><button class="btn primary" id="connAdd">+ Connect a site</button></div>
    <div id="connToken"></div>
    <div class="card" style="margin-top:12px;padding:4px 4px 8px" id="connTable"><div class="loading">Loading…</div></div>`);
  const loadTable = async () => {
    const d = await api(`/api/p/${p}/connections`);
    const rows = (d.items || []).map(c => `<tr data-id="${c.id}">
      <td><b>${esc(c.name)}</b></td>
      <td>${c.paired ? '<span class="badge ok">paired</span>' : '<span class="badge off">awaiting plugin</span>'}</td>
      <td class="mut">${esc(c.cms || '—')}</td>
      <td>${c.site_url ? `<a href="${esc(c.site_url)}" target="_blank" rel="noopener">${esc(shortUrl(c.site_url))}</a>` : '<span class="mut">—</span>'}</td>
      <td class="mut" style="font-size:11px">${c.last_seen_at ? esc(String(c.last_seen_at).slice(0, 16).replace('T', ' ')) : 'never'}</td>
      <td><button class="lnk conn-del" style="color:var(--neg)">remove</button></td></tr>`).join('');
    $('#connTable').innerHTML = `<table><thead><tr><th>Site</th><th>Status</th><th>CMS</th><th>URL</th><th>Last seen</th><th></th></tr></thead>
      <tbody>${rows || '<tr><td colspan="6"><div class="empty">No sites connected yet — name one and click “Connect a site”.</div></td></tr>'}</tbody></table>`;
    $('#connTable').querySelectorAll('.conn-del').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('Remove this connection? The plugin on that site will stop pairing.')) return;
      await api(`/api/p/${p}/connections/${b.closest('tr').dataset.id}`, { method: 'DELETE' }); loadTable();
    }));
  };
  $('#connAdd').addEventListener('click', async () => {
    const name = $('#connName').value.trim() || 'site';
    try {
      const c = await api(`/api/p/${p}/connections`, { method: 'POST', body: JSON.stringify({ name }) });
      $('#connToken').innerHTML = `<div class="card" style="border-color:var(--acc);margin-top:10px">
        <h3>🔑 Pairing token for “${esc(c.name)}”</h3>
        <p class="mut" style="font-size:12px">Copy this now — it's shown <b>only once</b>. Paste it into the seobot Connector plugin on the site.</p>
        <textarea readonly rows="2" style="width:100%;font:12px var(--mono)" onclick="this.select()">${esc(c.token)}</textarea>
        <ol class="mut" style="font-size:12px;line-height:1.6">
          <li>Install the <b>seobot Connector</b> plugin on the site (WordPress).</li>
          <li>Settings → <b>seobot Connector</b> → paste this token + seobot URL <code>https://seobot.example</code>.</li>
          <li>Save → the plugin pairs (status flips to “paired” here within a few minutes).</li></ol></div>`;
      $('#connName').value = ''; loadTable();
    } catch (e) { $('#connToken').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  loadTable();
  setUpdated();
}

// ---- Content — generate → review → schedule → monitor (the Content Platform) ----
let _ctFilter = 'pending';
async function viewContent() {
  const p = state.active;
  if (!p) return view(head('Content') + `<div class="empty">No project yet.</div>`);
  view(head('Content', activeName()) + `<div class="loading">Loading…</div>`);
  const [conns, pers] = await Promise.all([
    api(`/api/p/${p}/connections`).catch(() => ({ items: [] })),
    api('/api/personas').catch(() => ({ items: [] })),
  ]);
  const connOpts = ((conns.items || []).map(c =>
    `<option value="${c.id}">${esc(c.name)}${c.paired ? '' : ' (awaiting)'}</option>`).join('')) || '<option value="">no connected site</option>';
  const personaOpts = '<option value="">🎲 random persona</option>' + (pers.items || []).map(x =>
    `<option value="${esc(x.id)}" title="${esc(x.summary)}">${esc(x.name)} · ${esc(x.location.split(',')[0])}</option>`).join('');

  const badge = s => ({ pending: '<span class="badge">pending</span>', approved: '<span class="badge ok">approved</span>',
    scheduled: '<span class="badge">scheduled</span>', published: '<span class="badge ok">published</span>',
    rejected: '<span class="badge off">rejected</span>' }[s] || `<span class="mut">${esc(s)}</span>`);

  const ctAction = async (act, id) => {
    const msg = $('#ctMsg');
    try {
      if (act === 'preview') {
        const x = await api(`/api/p/${p}/content/${id}`);
        msg.innerHTML = `<div class="card" style="margin-top:8px"><b>${esc(x.title || x.keyword)}</b> <span class="mut">(${x.word_count} words${x.source_urls && x.source_urls.length ? ' · grounded on ' + x.source_urls.length + ' source(s)' : ''})</span>
          <pre style="white-space:pre-wrap;font:12px var(--mono);max-height:340px;overflow:auto;margin-top:6px">${esc(x.body)}</pre></div>`;
        return;
      }
      if (act === 'edit') {
        const x = await api(`/api/p/${p}/content/${id}`);
        msg.innerHTML = `<div class="card" style="margin-top:8px">
          <input id="edTitle" type="text" style="width:100%;margin-bottom:6px" value="${esc(x.title || '')}" placeholder="title">
          <textarea id="edBody" rows="14" style="width:100%;font:12px var(--mono)">${esc(x.body)}</textarea>
          <div style="margin-top:6px"><button class="btn primary" id="edSave">Save</button> <button class="btn" id="edCancel">Cancel</button></div></div>`;
        $('#edSave').addEventListener('click', async () => {
          await api(`/api/p/${p}/content/${id}`, { method: 'PUT', body: JSON.stringify({ title: $('#edTitle').value, body: $('#edBody').value }) });
          msg.innerHTML = '<span class="pos">saved ✓</span>'; load();
        });
        $('#edCancel').addEventListener('click', () => { msg.innerHTML = ''; });
        return;
      }
      if (act === 'approve') { const cid = $('#ctConn').value; await api(`/api/p/${p}/content/${id}/approve`, { method: 'POST', body: JSON.stringify({ connection_id: cid ? Number(cid) : null, publish_status: 'draft' }) }); }
      if (act === 'reject') await api(`/api/p/${p}/content/${id}/reject`, { method: 'POST', body: '{}' });
      if (act === 'delete') { if (!confirm('Delete this draft?')) return; await api(`/api/p/${p}/content/${id}`, { method: 'DELETE' }); }
      if (act === 'refresh') { const n = await api(`/api/p/${p}/content/${id}/refresh`, { method: 'POST', body: '{}' }); msg.innerHTML = `<span class="pos">regenerated → new pending draft #${n.id}</span>`; }
      if (act === 'evaluate') { const r = await api(`/api/p/${p}/content/${id}/evaluate`, { method: 'POST', body: '{}' }); const s = r.scores; msg.innerHTML = `<span class="pos">judge: overall ${s.overall}</span> <span class="mut">help ${s.helpfulness} · ground ${s.grounding} · E-E-A-T ${s.eeat} · read ${s.readability} — ${esc(s.notes || '')}</span>`; return; }
      if (act === 'quality') { const r = await api(`/api/p/${p}/content/${id}/quality`); const c = r.checks; msg.innerHTML = `<span class="${r.passed ? 'pos' : 'neg'}">QA ${r.passed ? 'PASS' : (r.hard_fail ? 'HARD FAIL' : 'warnings')}</span> <span class="mut">words ${c.word_count.value} · banned ${c.banned_claims.found.length} · RG ${c.responsible_gambling.pass ? 'ok' : 'missing'} · dup ${c.uniqueness.max_similarity}</span>`; return; }
      load();
    } catch (e) { msg.innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  };

  const load = async () => {
    const q = _ctFilter === 'all' ? '' : `?status=${_ctFilter}`;
    const [d, score] = await Promise.all([
      api(`/api/p/${p}/content${q}`),
      api(`/api/p/${p}/content/scorecard`).catch(() => ({ items: [] })),
    ]);
    const sv = {}; (score.items || []).forEach(s => { if (s.url) sv[s.url] = s; });
    const actionsFor = x => {
      const mk = (a, label) => `<button class="lnk ct-act" data-act="${a}" data-id="${x.id}">${label}</button>`;
      const out = [mk('preview', 'preview')];
      if (x.status === 'pending' || x.status === 'approved') out.push(mk('edit', 'edit'), mk('approve', 'approve'), mk('evaluate', 'score'), mk('quality', 'QA'), mk('reject', 'reject'));
      if (x.status === 'published') out.push(mk('refresh', 'refresh'));
      out.push(mk('delete', 'delete'));
      return out.join(' · ');
    };
    const rows = (d.items || []).map(x => {
      const s = sv[x.url];
      const meta = (x.status === 'scheduled' && x.scheduled_for) ? `<span class="mut">${esc(x.scheduled_for.slice(0, 16).replace('T', ' '))}</span>`
        : (x.status === 'published' && s) ? `<span class="badge ${(s.verdict.startsWith('not') || s.verdict === 'underperforming') ? 'off' : 'ok'}">${esc(s.verdict)}${s.position != null ? ' #' + s.position : ''}</span>`
          : '<span class="mut">—</span>';
      return `<tr data-id="${x.id}">
        <td><b>${esc(x.title || x.keyword)}</b><div class="mut" style="font-size:11px">${esc(x.keyword)} · ${esc(x.content_type)} · ✍ ${esc(x.persona || x.tone)}${x.model ? ' · ' + esc(x.model) : ''}</div></td>
        <td>${badge(x.status)}</td><td class="tnum mut">${x.word_count}</td><td>${meta}</td>
        <td style="font-size:12px;white-space:nowrap">${actionsFor(x)}</td></tr>`;
    }).join('');
    $('#ctTable').innerHTML = `<table><thead><tr><th>Draft</th><th>Status</th><th>Words</th><th>When / Perf</th><th></th></tr></thead>
      <tbody>${rows || `<tr><td colspan="5"><div class="empty">No ${esc(_ctFilter)} drafts — generate one above.</div></td></tr>`}</tbody></table>`;
    $('#ctTable').querySelectorAll('.ct-act').forEach(b => b.addEventListener('click', () => ctAction(b.dataset.act, b.dataset.id)));
  };

  view(head('Content', activeName()) + `
    <div class="toolbar">
      <input id="ctKw" class="grow" type="text" placeholder="keyword / topic to write about">
      <select id="ctType"><option value="guide">guide</option><option value="review">review</option><option value="blog">blog</option></select>
      <select id="ctPersona" title="Writing persona (voice)">${personaOpts}</select>
      <label class="mut" style="font-size:12px;display:flex;align-items:center;gap:4px"><input type="checkbox" id="ctGround"> auto-ground</label>
      <button class="btn primary" id="ctGen">✍ Generate</button>
    </div>
    <div class="toolbar" style="margin-top:6px">
      <span class="mut" style="font-size:12px">Publish to:</span>
      <select id="ctConn">${connOpts}</select>
      <button class="btn" id="ctPlan" title="Generate drafts for your top uncovered tracked keywords">✨ Generate plan (5)</button>
      <button class="btn" id="ctDrip" title="Drip-schedule all pending drafts across the calendar (2/day)">🗓 Drip-schedule pending</button>
      <div class="spacer"></div>
      <select id="ctFilter">${['pending', 'approved', 'scheduled', 'published', 'rejected', 'all'].map(s => `<option value="${s}" ${s === _ctFilter ? 'selected' : ''}>${s}</option>`).join('')}</select>
    </div>
    <div id="ctMsg" style="margin-top:8px;font-size:12.5px"></div>
    <div class="card" style="margin-top:10px;padding:4px 4px 8px" id="ctTable"><div class="loading">Loading…</div></div>`);

  $('#ctGen').addEventListener('click', async () => {
    const keyword = $('#ctKw').value.trim(); if (!keyword) return;
    const b = $('#ctGen'); b.disabled = true; b.textContent = 'Generating…';
    try { await api(`/api/p/${p}/content/generate`, { method: 'POST', body: JSON.stringify({ keyword, content_type: $('#ctType').value, persona: $('#ctPersona').value || null, auto_ground: $('#ctGround').checked }) }); $('#ctKw').value = ''; _ctFilter = 'pending'; $('#ctFilter').value = 'pending'; load(); }
    catch (e) { $('#ctMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    finally { b.disabled = false; b.textContent = '✍ Generate'; }
  });
  $('#ctPlan').addEventListener('click', async () => {
    const b = $('#ctPlan'); b.disabled = true; b.textContent = 'Planning…';
    try { const r = await api(`/api/p/${p}/content/plan/generate`, { method: 'POST', body: JSON.stringify({ limit: 5, auto_ground: $('#ctGround').checked }) }); $('#ctMsg').innerHTML = `<span class="pos">generated ${r.total} drafts${r.note ? ' · ' + esc(r.note) : ''}</span>`; _ctFilter = 'pending'; $('#ctFilter').value = 'pending'; load(); }
    catch (e) { $('#ctMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    finally { b.disabled = false; b.textContent = '✨ Generate plan (5)'; }
  });
  $('#ctDrip').addEventListener('click', async () => {
    const cid = $('#ctConn').value; if (!cid) { $('#ctMsg').innerHTML = `<span class="neg">connect a site first (Publish to)</span>`; return; }
    const b = $('#ctDrip'); b.disabled = true; b.textContent = 'Scheduling…';
    try { const r = await api(`/api/p/${p}/content/calendar/plan`, { method: 'POST', body: JSON.stringify({ connection_id: Number(cid), per_day: 2 }) }); $('#ctMsg').innerHTML = `<span class="pos">scheduled ${r.total} drafts</span>`; _ctFilter = 'scheduled'; $('#ctFilter').value = 'scheduled'; load(); }
    catch (e) { $('#ctMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    finally { b.disabled = false; b.textContent = '🗓 Drip-schedule pending'; }
  });
  $('#ctFilter').addEventListener('change', e => { _ctFilter = e.target.value; load(); });
  await load();
  setUpdated();
}

// ---- Connect a domain — the 1-stop-shop onboarding wizard ----
let _wiz = { slug: null };
async function viewConnect() {
  _wiz = { slug: null };
  view(head('Connect a domain') + `
    <p class="mut" style="font-size:12.5px">Spin up a site: create the project → connect data sources → pair the site (plugin) → seed keywords + a starter content plan → and the autonomy brain starts watching. Each step unlocks the next.</p>
    <div id="wizMsg" style="font-size:12.5px;margin:8px 0"></div>
    <div id="wzIntegr" style="font-size:12px;margin:4px 0"></div>
    <div class="card" style="margin-top:8px"><h3>1 · Create project</h3>
      <div class="toolbar">
        <input id="wzName" class="grow" placeholder="name — e.g. Demo Casino">
        <input id="wzDomain" placeholder="domain — e.g. demo-casino.example">
        <select id="wzMarket"><option>AU</option><option>US</option><option>UK</option><option>NZ</option><option>CA</option></select>
        <button class="btn primary" id="wzCreate">Create →</button>
      </div></div>
    <div class="card" id="wzStep2" style="margin-top:8px;opacity:.45;pointer-events:none"><h3>2 · Pair the site</h3>
      <div class="toolbar"><input id="wzConnName" class="grow" placeholder="connection name — e.g. the site URL"><button class="btn" id="wzConnBtn">Create pairing token →</button></div>
      <div id="wzToken"></div></div>
    <div class="card" id="wzStep3" style="margin-top:8px;opacity:.45;pointer-events:none"><h3>3 · Keywords + starter content</h3>
      <textarea id="wzKw" rows="3" style="width:100%;margin-bottom:6px" placeholder="one keyword per line (optional — blank uses the project's tracked keywords)"></textarea>
      <div class="toolbar"><label class="mut" style="font-size:12px"><input type="checkbox" id="wzGround"> auto-ground (SERP)</label>
        <button class="btn" id="wzTrack">Track keywords</button>
        <button class="btn primary" id="wzPlan">Generate drafts</button><div class="spacer"></div>
        <button class="btn" id="wzGoContent">Open Content →</button></div>
      <div id="wzPlanMsg" style="margin-top:6px"></div></div>
    <div class="card" id="wzStep4" style="margin-top:8px;opacity:.45;pointer-events:none"><h3>4 · Your autonomy brain is watching</h3>
      <p class="mut" style="font-size:12px">seobot now monitors this site and turns opportunities into scored decisions — local Gemma proposes, Claude reviews in batches, and you approve. Nothing edits your site without you (shadow / level 0). Watch it think + act:</p>
      <div class="toolbar"><button class="btn" id="wzGoThoughts">Open Thoughts →</button><button class="btn" id="wzGoDecisions">Open Decisions →</button></div></div>`);
  const unlock = id => { const el = $('#' + id); el.style.opacity = 1; el.style.pointerEvents = 'auto'; };
  $('#wzCreate').addEventListener('click', async () => {
    const name = $('#wzName').value.trim(), domain = $('#wzDomain').value.trim();
    if (!name || !domain) { $('#wizMsg').innerHTML = '<span class="neg">name + domain are required</span>'; return; }
    try {
      const p = await api('/api/projects', { method: 'POST', body: JSON.stringify({ name, primary_domain: domain, market: $('#wzMarket').value }) });
      _wiz.slug = p.slug;
      await api(`/api/projects/${p.slug}/activate`, { method: 'POST' }); state.active = p.slug;
      await loadProjects().catch(() => {});
      $('#wizMsg').innerHTML = `<span class="pos">project “${esc(p.name)}” created + active ✓</span>`;
      $('#wzIntegr').innerHTML = '<span class="mut">2 · Connect data sources (DataForSEO, Ahrefs, Search Console, AI) in <a href="?view=integrations">Integrations</a> — the more connected, the smarter the brain. You can do this any time.</span>';
      unlock('wzStep2');
    } catch (e) { $('#wizMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  $('#wzTrack').addEventListener('click', async () => {
    if (!_wiz.slug) return;
    const kws = $('#wzKw').value.split('\n').map(s => s.trim()).filter(Boolean);
    if (!kws.length) { $('#wzPlanMsg').innerHTML = '<span class="neg">add one or more keywords above first</span>'; return; }
    let ok = 0;
    for (const k of kws) { try { await api(`/api/p/${_wiz.slug}/keywords`, { method: 'POST', body: JSON.stringify({ keyword: k }) }); ok++; } catch (_) {} }
    $('#wzPlanMsg').innerHTML = `<span class="pos">tracking ${ok} keyword(s) — rank tracking + the decision engine pick them up on the next pull</span>`;
    unlock('wzStep4');
  });
  $('#wzConnBtn').addEventListener('click', async () => {
    if (!_wiz.slug) return;
    try {
      const c = await api(`/api/p/${_wiz.slug}/connections`, { method: 'POST', body: JSON.stringify({ name: $('#wzConnName').value.trim() || 'site' }) });
      $('#wzToken').innerHTML = `<div class="card" style="border-color:var(--acc);margin-top:8px">
        <p class="mut" style="font-size:12px">Install the <b>seobot Connector</b> plugin on the site, then paste this token (shown <b>once</b>) + the seobot URL in its settings:</p>
        <textarea readonly rows="2" style="width:100%;font:12px var(--mono)" onclick="this.select()">${esc(c.token)}</textarea></div>`;
      unlock('wzStep3');
    } catch (e) { $('#wzToken').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
  });
  $('#wzPlan').addEventListener('click', async () => {
    if (!_wiz.slug) return;
    const kws = $('#wzKw').value.split('\n').map(s => s.trim()).filter(Boolean);
    const b = $('#wzPlan'); b.disabled = true; b.textContent = 'Generating…';
    try {
      const r = await api(`/api/p/${_wiz.slug}/content/plan/generate`, { method: 'POST', body: JSON.stringify({ keywords: kws, limit: 5, auto_ground: $('#wzGround').checked }) });
      $('#wzPlanMsg').innerHTML = `<span class="pos">generated ${r.total} draft(s)${r.note ? ' · ' + esc(r.note) : ''} — review + schedule them in Content</span>`;
      unlock('wzStep4');
    } catch (e) { $('#wzPlanMsg').innerHTML = `<span class="neg">${esc(e.message)}</span>`; }
    finally { b.disabled = false; b.textContent = 'Generate drafts'; }
  });
  $('#wzGoContent').addEventListener('click', () => go('content'));
  $('#wzGoThoughts').addEventListener('click', () => go('thoughts'));
  $('#wzGoDecisions').addEventListener('click', () => go('decisions'));
  setUpdated();
}

// ---- Logs — the persistent app error log (global) ----
async function viewLogs() {
  view(head('Logs') + `<div class="loading">Loading…</div>`);
  const lvl = l => l === 'warning' ? '<span class="badge">warn</span>' : '<span class="badge off">error</span>';
  const render = (d) => {
    const rows = (d.items || []).map(e => `<tr data-id="${e.id}" class="log-row" style="cursor:pointer">
      <td class="mut" style="font-size:11px;white-space:nowrap">${e.created_at ? esc(e.created_at.slice(0, 19).replace('T', ' ')) : '—'}</td>
      <td>${lvl(e.level)}</td><td class="mut">${esc(e.source)}</td><td class="tnum">${e.status_code ?? '—'}</td>
      <td class="mut" style="font-size:11px">${e.method ? esc(e.method) + ' ' : ''}${esc(e.path || '')}</td>
      <td>${esc(e.message)}</td></tr>`).join('');
    view(head('Logs') + `
      <div class="toolbar">
        <span class="mut" style="font-size:12px">${d.total} recent ${d.total === 1 ? 'entry' : 'entries'}</span>
        <div class="spacer"></div>
        <select id="logLevel"><option value="">all levels</option><option value="error">error</option><option value="warning">warning</option></select>
        <button class="btn" id="logRefresh">Refresh</button>
        <button class="btn" id="logClear" style="color:var(--neg)">Clear all</button>
      </div>
      <div id="logMsg" style="margin-top:8px;font-size:12.5px"></div>
      <div class="card" style="margin-top:10px;padding:4px 4px 8px">
        <table><thead><tr><th>Time</th><th>Level</th><th>Source</th><th>Code</th><th>Where</th><th>Message</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6"><div class="empty">No errors logged 🎉</div></td></tr>'}</tbody></table>
      </div>`);
    $('#logRefresh').addEventListener('click', viewLogs);
    $('#logLevel').addEventListener('change', async e => { const v = e.target.value; render(await api(`/api/logs${v ? `?level=${v}` : ''}`)); });
    $('#logClear').addEventListener('click', async () => { if (!confirm('Clear all logged errors?')) return; await api('/api/logs', { method: 'DELETE' }); viewLogs(); });
    document.querySelectorAll('.log-row').forEach(r => r.addEventListener('click', async () => {
      const e = await api(`/api/logs/${r.dataset.id}`);
      $('#logMsg').innerHTML = `<div class="card" style="margin-top:8px"><b>#${e.id} · ${esc(e.message)}</b>
        <pre style="white-space:pre-wrap;font:11px var(--mono);max-height:340px;overflow:auto;margin-top:6px">${esc(e.detail || '(no detail)')}</pre></div>`;
    }));
  };
  render(await api('/api/logs'));
  setUpdated();
}

// ---- decision engine (Thoughts + Decisions) ----
function _callBadge(label, c) {
  if (!c || c.yes == null) return `<span class="mut">${esc(label)} —</span>`;
  const v = c.yes ? '<span class="badge ok">YES</span>' : '<span class="badge off">NO</span>';
  const conv = c.conviction != null ? ` <span class="tnum mut" style="font-size:12px">${Math.round(c.conviction * 100)}%</span>` : '';
  return `<span class="mut" style="font-size:11px">${esc(label)}</span> ${v}${conv}`;
}

async function viewThoughts() {
  const p = state.active;
  if (!p) return view(head('Thoughts') + `<div class="empty">No project yet — create one in Projects.</div>`);
  view(head('Thoughts', activeName()) + `<div class="loading">Loading…</div>`);
  const [sum, list] = await Promise.all([
    api(`/api/p/${p}/decisions/summary`).catch(() => ({ scoreboard: {} })),
    api(`/api/p/${p}/decisions?limit=200`),
  ]);
  const sb = sum.scoreboard || {};
  const badge = s => `<span class="badge ${s === 'dismissed' ? 'off' : ''}">${esc(s)}</span>`;
  const cards = (list.items || []).map(d => `<div class="card" style="margin-top:8px">
    <div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(d.target)}</b>${badge(d.status)}</div>
    <div class="mut" style="font-size:11px">${esc(d.kind)}${d.created_at ? ' · ' + esc(d.created_at.slice(0, 16).replace('T', ' ')) : ''}</div>
    <div style="margin-top:6px;font-size:12.5px">${_callBadge('Suggested', { yes: d.suggested_yes, conviction: d.suggested_conviction })} · ${_callBadge('Gemma', d.gemma)} · ${_callBadge('Claude', d.anthropic)}${d.score && d.score.agreement != null ? ' · ' + (d.score.agreement ? '<span class="badge">agree</span>' : '<span class="badge off">disagree</span>') : ''}</div>
    ${(d.anthropic.rationale || d.gemma.rationale) ? `<div class="mut" style="margin-top:4px">“${esc(d.anthropic.rationale || d.gemma.rationale)}”</div>` : ''}
  </div>`).join('');
  view(head('Thoughts', activeName()) + `
    <div class="toolbar"><span class="mut" style="font-size:12px">${(list.items || []).length} recent · Gemma↔Claude agreement ${sb.agreement_rate != null ? Math.round(sb.agreement_rate * 100) + '%' : '—'} over ${sb.judged || 0}</span><div class="spacer"></div><button class="btn" id="thRefresh">Refresh</button></div>
    ${cards || '<div class="empty">No thoughts yet. The detector runs on a timer; once it mints decisions and Gemma reviews them, they show here.</div>'}`);
  $('#thRefresh').addEventListener('click', viewThoughts);
  setUpdated();
}

async function viewDecisions() {
  const p = state.active;
  if (!p) return view(head('Decisions') + `<div class="empty">No project yet — create one in Projects.</div>`);
  view(head('Decisions', activeName()) + `<div class="loading">Loading…</div>`);
  const [sum, list, kpiData, auto] = await Promise.all([
    api(`/api/p/${p}/decisions/summary`).catch(() => ({ scoreboard: {} })),
    api(`/api/p/${p}/decisions?status=answered&limit=200`),
    api(`/api/p/${p}/kpi`).catch(() => null),
    api(`/api/p/${p}/decisions/autonomy`).catch(() => null),
  ]);
  const sb = sum.scoreboard || {};
  const ns = kpiData && kpiData.north_star;
  const nsBadge = ns ? `<span class="badge" title="${esc(ns.basis || '')}">★ north-star ${ns.value}${ns.proxy ? ' (proxy)' : ' ' + esc(ns.unit || '')}</span> ` : '';
  const items = list.items || [];
  const rows = items.map(d => {
    const ca = d.anthropic, ge = d.gemma;
    const conflict = ca && ge && ca.yes != null && ge.yes != null && ca.yes !== ge.yes;
    return `<tr data-id="${d.id}"${conflict ? ' class="conflict"' : ''}>
      <td><b>${esc(d.target)}</b><div style="margin-top:4px"><span class="tag">${esc(d.kind)}</span>${conflict ? '<span class="badge off" style="margin-left:4px">conflict</span>' : ''}</div></td>
      <td>${_callBadge('Claude', ca)}</td>
      <td>${_callBadge('Gemma', ge)}</td>
      <td style="white-space:nowrap">
        <button class="btn ok sm" data-act="approve" data-id="${d.id}">Approve</button>
        <button class="btn danger sm" data-act="reject" data-id="${d.id}">Dismiss</button>
        <button class="btn sm" data-act="open" data-id="${d.id}">Details</button>
      </td></tr>`;
  }).join('');
  const agree = sb.agreement_rate != null ? Math.round(sb.agreement_rate * 100) + '%' : '—';
  const ctl = sb.controlled ? '<span class="badge ok">controlled</span>' : '<span class="badge off">shadow</span>';
  view(head('Decisions', activeName()) + `
    <div class="card" style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding:14px 18px">
      <span class="sec-h">${icon('decisions')} ${items.length} awaiting your call</span>
      <span class="mut" style="font-size:12.5px">Gemma${icon('compare', 'sm')}Claude agreement <b class="tnum">${agree}</b> over ${sb.judged || 0} · ${ctl}</span>
      <div class="spacer"></div>${nsBadge}
      <button class="btn sm" id="decGap" title="Paid DataForSEO pull">${icon('competitors', 'sm')} Find competitor gaps</button>
      <button class="btn sm" id="decBonus">${icon('zap', 'sm')} Check bonus freshness</button>
      <button class="btn sm" id="decRefresh">${icon('refresh', 'sm')} Refresh</button>
    </div>
    <div id="decMsg" style="margin-top:8px;font-size:12.5px"></div>
    <div class="card" style="margin-top:12px;padding:4px 4px 8px">
      <div class="card-head" style="padding:12px 14px 0;margin-bottom:6px"><span class="sec-h" style="font-size:13px">${icon('plan', 'sm')} Decision queue</span></div>
      <table><thead><tr><th>Decision</th><th>Claude</th><th>Gemma</th><th>Your call</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="4"><div class="empty">Nothing awaiting review. The brain is still thinking — see Thoughts.</div></td></tr>'}</tbody></table>
    </div>
    ${auto ? `<details class="card" style="margin-top:12px"><summary class="sec-h" style="font-size:14px">${icon('settings')} Autonomy <span class="mut">— per-scope level (you promote; auto-apply needs GATE B)</span> ${auto.kill_switch ? '<span class="badge off">KILL SWITCH ON</span>' : ''}</summary>
      <div style="margin-top:8px"><label><input type="checkbox" id="autoKill" ${auto.kill_switch ? 'checked' : ''}> Kill switch (halt all actuation)</label></div>
      <table style="margin-top:8px"><thead><tr><th>Scope</th><th>Level (0=shadow)</th><th>Track record</th></tr></thead><tbody>
      ${auto.scopes.map(s => `<tr>
        <td>${esc(s.scope)}</td>
        <td><select class="autoLvl" data-scope="${esc(s.scope)}" data-orig="${s.level}">${[0, 1, 2, 3, 4, 5].map(l => `<option value="${l}" ${l === s.level ? 'selected' : ''}>${l}</option>`).join('')}</select></td>
        <td class="mut" style="font-size:11px">${s.scoreboard.judged || 0} judged · agree ${s.scoreboard.agreement_rate != null ? Math.round(s.scoreboard.agreement_rate * 100) + '%' : '—'} · ${s.promotion.eligible ? '<span style="color:var(--pos,#1a7f37)">GATE B ✓</span>' : 'shadow'}</td></tr>`).join('')}
      </tbody></table>
      <div id="autoMsg" style="font-size:12px;margin-top:6px"></div></details>` : ''}
    <div id="decDetail"></div>`);
  $('#decRefresh').addEventListener('click', viewDecisions);
  $('#decGap').addEventListener('click', async () => {
    $('#decMsg').textContent = 'Running competitor gap analysis (DataForSEO)…';
    try {
      const r = await api(`/api/p/${p}/decisions/gap/competitors`, { method: 'POST' });
      $('#decMsg').innerHTML = `<span style="color:var(--pos,#1a7f37)">Minted ${r.minted} gap decisions across ${r.competitors_checked} competitor(s) ($${(r.cost || 0).toFixed(4)}). They appear in Thoughts, then here once reviewed.</span>`;
    } catch (e) { $('#decMsg').innerHTML = `<span style="color:var(--neg)">${esc(e.message)}</span>`; }
  });
  $('#decBonus').addEventListener('click', async () => {
    $('#decMsg').textContent = 'Checking SDM bonus freshness…';
    try {
      const r = await api(`/api/p/${p}/decisions/freshness/bonuses`, { method: 'POST' });
      $('#decMsg').innerHTML = `<span style="color:var(--pos,#1a7f37)">Flagged ${r.minted} stale/expired bonus(es) — see Thoughts.</span>`;
    } catch (e) { $('#decMsg').innerHTML = `<span style="color:var(--neg)">${esc(e.message)}</span>`; }
  });
  document.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', async () => {
    const id = b.dataset.id, act = b.dataset.act;
    if (act === 'open') return openDecision(p, id);
    const approve = act === 'approve';
    const note = approve ? null : (prompt('Why dismiss this? (helps the system learn your taste)') || null);
    try {
      const r = await api(`/api/p/${p}/decisions/${id}/verdict`, { method: 'POST', body: JSON.stringify({ approve, note }) });
      $('#decMsg').innerHTML = r.disagreement
        ? `<span style="color:var(--neg)">You overruled the model — opened a discussion to reconcile (below).</span>`
        : `<span style="color:var(--pos,#1a7f37)">Recorded — the system will weight this for similar decisions.</span>`;
      if (r.disagreement) await openDecision(p, id); else setTimeout(viewDecisions, 700);
    } catch (e) { $('#decMsg').innerHTML = `<span style="color:var(--neg)">${esc(e.message)}</span>`; }
  }));
  const kill = $('#autoKill');
  if (kill) kill.addEventListener('change', async () => {
    try {
      await api(`/api/p/${p}/decisions/autonomy/kill-switch`, { method: 'POST', body: JSON.stringify({ on: kill.checked }) });
      $('#autoMsg').innerHTML = kill.checked ? '<span style="color:var(--neg)">Kill switch ON — all actuation halted.</span>' : '<span class="mut">Kill switch off.</span>';
    } catch (e) { $('#autoMsg').innerHTML = `<span style="color:var(--neg)">${esc(e.message)}</span>`; }
  });
  document.querySelectorAll('.autoLvl').forEach(sel => sel.addEventListener('change', async () => {
    const scope = sel.dataset.scope, level = parseInt(sel.value, 10);
    try {
      const r = await api(`/api/p/${p}/decisions/autonomy/promote`, { method: 'POST', body: JSON.stringify({ scope, level }) });
      sel.dataset.orig = String(r.level);
      $('#autoMsg').innerHTML = `<span style="color:var(--pos,#1a7f37)">${esc(scope)} → level ${r.level} (${esc(r.reason)})</span>`;
    } catch (e) {
      sel.value = sel.dataset.orig || '0';   // server refused (e.g. GATE B) — revert the control
      $('#autoMsg').innerHTML = `<span style="color:var(--neg)">${esc(e.message)}</span>`;
    }
  }));
  setUpdated();
}

async function openDecision(p, id) {
  const d = await api(`/api/p/${p}/decisions/${id}`);
  const calls = `${_callBadge('Suggested', { yes: d.suggested_yes, conviction: d.suggested_conviction })} · ${_callBadge('Gemma', d.gemma)} · ${_callBadge('Claude', d.anthropic)}`;
  const thread = (d.discussion || []).map(m => `<div class="card" style="margin-top:6px;${m.role === 'system' ? 'border-left:3px solid var(--accent,#4a7)' : ''}">
    <b>${m.role === 'system' ? 'seobot' : 'you'}</b><div style="margin-top:2px">${esc(m.message)}</div>
    ${m.web_findings ? `<div class="mut" style="font-size:11px;margin-top:4px">web: ${m.web_findings.map(f => esc(f.url || '')).join(', ')}</div>` : ''}</div>`).join('');
  $('#decDetail').innerHTML = `<div class="card" style="margin-top:12px">
    <b>${esc(d.target)}</b> <span class="mut">(${esc(d.kind)} · ${esc(d.status)})</span>
    <div style="margin-top:6px;font-size:12.5px">${calls}</div>
    ${d.anthropic.rationale ? `<div class="mut" style="margin-top:6px">Claude: ${esc(d.anthropic.rationale)}</div>` : ''}
    ${d.gemma.rationale ? `<div class="mut">Gemma: ${esc(d.gemma.rationale)}</div>` : ''}
    <pre style="white-space:pre-wrap;font:11px var(--mono);max-height:180px;overflow:auto;margin-top:6px">${esc(JSON.stringify(d.analysis, null, 1))}</pre>
    <div style="margin-top:8px">${thread || '<span class="mut">No discussion yet.</span>'}</div>
    <div class="toolbar" style="margin-top:8px"><input id="decReply" placeholder="Reply to the system…" style="flex:1"><button class="btn" id="decSend">Send</button></div>
    <div class="toolbar" style="margin-top:8px"><button class="btn" id="ocSuggest">Suggest on-page edit</button>${(d.status === 'actuating' || d.status === 'actuated') ? '<button class="btn" id="ocRollback" style="color:var(--neg)">Roll back edit</button>' : ''}</div>
    <div id="ocPanel" style="margin-top:8px"></div>
  </div>`;
  const send = async () => {
    const t = ($('#decReply').value || '').trim();
    if (!t) return;
    await api(`/api/p/${p}/decisions/${id}/discuss`, { method: 'POST', body: JSON.stringify({ message: t }) });
    openDecision(p, id);
  };
  $('#decSend').addEventListener('click', send);

  const sugg = $('#ocSuggest');
  if (sugg) sugg.addEventListener('click', async () => {
    $('#ocPanel').innerHTML = '<span class="mut">Drafting a title/meta suggestion…</span>';
    try {
      const s = await api(`/api/p/${p}/decisions/${id}/suggest-edit`, { method: 'POST' });
      if (!s.url) { $('#ocPanel').innerHTML = '<span class="mut">No page URL on this decision to edit.</span>'; return; }
      const ch = s.change || { title: '', meta: '' };
      const approved = d.human && d.human.yes;
      $('#ocPanel').innerHTML = `<div class="card">
        <div class="mut" style="font-size:11px">URL: ${esc(s.url)}</div>
        <label class="mut" style="font-size:11px">Title (≤60)</label><input id="ocTitle" value="${esc(ch.title || '')}" maxlength="60" style="width:100%">
        <label class="mut" style="font-size:11px">Meta (≤155)</label><textarea id="ocMeta" maxlength="155" style="width:100%;min-height:48px">${esc(ch.meta || '')}</textarea>
        <div class="mut" style="font-size:11px;margin-top:4px">Currently: ${esc((s.current && s.current.title) || '—')}${s.detail ? ' · ' + esc(s.detail) : ''}</div>
        <div class="toolbar" style="margin-top:6px"><button class="btn" id="ocApply" ${approved ? '' : 'disabled title="approve the decision first"'}>Apply edit (reversible)</button></div></div>`;
      const applyBtn = $('#ocApply');
      if (applyBtn) applyBtn.addEventListener('click', async () => {
        const change = { title: ($('#ocTitle').value || '').trim(), meta: ($('#ocMeta').value || '').trim() };
        try {
          const r = await api(`/api/p/${p}/decisions/${id}/apply`, { method: 'POST', body: JSON.stringify({ edit_kind: 'update_meta', url: s.url, change }) });
          $('#ocPanel').innerHTML = `<span style="color:var(--pos,#1a7f37)">Edit queued (job #${r.job_id}). The site plugin applies it; reversible any time.</span>`;
        } catch (e) { $('#ocPanel').innerHTML = `<span style="color:var(--neg)">${esc(e.message)}</span>`; }
      });
    } catch (e) { $('#ocPanel').innerHTML = `<span style="color:var(--neg)">${esc(e.message)}</span>`; }
  });
  const rb = $('#ocRollback');
  if (rb) rb.addEventListener('click', async () => {
    if (!confirm('Roll back the applied edit (restore the prior value)?')) return;
    try {
      const r = await api(`/api/p/${p}/decisions/${id}/rollback`, { method: 'POST' });
      $('#ocPanel').innerHTML = `<span style="color:var(--pos,#1a7f37)">Rollback queued (job #${r.rollback_job_id}).</span>`;
    } catch (e) { $('#ocPanel').innerHTML = `<span style="color:var(--neg)">${esc(e.message)}</span>`; }
  });
}

// ---- router ----
const activeName = () => (state.projects.find(p => p.slug === state.active) || {}).name || state.active || '';
function route() {
  const v = state.view;
  try {
    if (v === 'overview') return viewOverview();
    if (v === 'action-plan') return viewActionPlan();
    if (v === 'thoughts') return viewThoughts();
    if (v === 'decisions') return viewDecisions();
    if (v === 'content') return viewContent();
    if (v === 'opportunities') return viewOpportunities();
    if (v === 'rank') return viewRank();
    if (v === 'rank-compare') return viewRankCompare();
    if (v === 'keyword-research') return viewKeywordResearch();
    if (v === 'serp-inspector') return viewSerpInspector();
    if (v === 'competitors') return viewCompetitors();
    if (v === 'site-audit') return viewSiteAudit();
    if (v === 'crawl') return viewCrawl();
    if (v === 'domains') return viewDomains();
    if (v === 'indexation') return viewIndexation();
    if (v === 'bulk-tools') return viewBulkTools();
    if (v === 'site-health') return viewSiteHealth();
    if (v === 'report') return viewReport();
    if (v === 'backlinks') return viewBacklinks();
    if (v === 'analytics') return viewAnalytics();
    if (v === 'search-console') return viewSearchConsole();
    if (v === 'bing') return viewBing();
    if (v === 'imports') return viewImports();
    if (v === 'alerts') return viewAlerts();
    if (v === 'connections') return viewConnections();
    if (v === 'project-settings') return viewProjectSettings();
    if (v === 'connect') return viewConnect();
    if (v === 'projects') return viewProjects();
    if (v === 'integrations') return viewIntegrations();
    if (v === 'spend') return viewSpend();
    if (v === 'logs') return viewLogs();
    if (v === 'settings') return viewGlobalSettings();
    if (SOON.has(v)) return viewStub(NAV.flatMap(g => g.items).find(i => i.id === v).label);
  } catch (e) { view(head('Error') + `<div class="empty neg">${esc(e.message)}</div>`); }
}

async function loadProjects() {
  const data = await api('/api/projects');
  state.projects = data.items;
  state.active = data.active_slug || (data.items[0] && data.items[0].slug) || null;
  renderProjectSelect();
}

function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

async function boot() {
  const params = new URLSearchParams(location.search);
  const v = params.get('view');
  if (v && VALID_VIEWS.has(v) && !SOON.has(v)) state.view = v;
  $('#navToggle').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  $('#projectSelect').addEventListener('change', async e => {
    await api(`/api/projects/${e.target.value}/activate`, { method: 'POST' });
    state.active = e.target.value;
    route();
  });
  window.addEventListener('popstate', () => {
    const pv = new URLSearchParams(location.search).get('view');
    state.view = (pv && VALID_VIEWS.has(pv)) ? pv : 'overview';
    renderSidebar(); route();
  });
  try { await loadProjects(); } catch (e) { /* empty DB / not migrated */ }
  renderSidebar();
  route();
  // 30s smart refresh — Overview only; never while an input/select is focused (no clobber).
  setInterval(() => {
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (state.view === 'overview') route();
  }, 30000);
}
boot();
