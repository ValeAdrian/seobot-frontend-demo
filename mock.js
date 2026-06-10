/* Mock backend for the standalone seobot DESIGN DEMO.
   Overrides window.fetch for /api/* with DUMMY data so every page renders WITHOUT the real backend.
   NO real client data, NO API keys, NO secrets. Safe to publish. */
(function () {
  var MOCK = {};
  Object.assign(MOCK, {
  "/api/projects": {
    items: [
      { id: 1, slug: "demo-casino", name: "Demo Casino", primary_domain: "demo-casino.example", market: "AU", locale: "en", status: "active", created_at: "2026-06-01T08:00:00Z" }
    ],
    active_slug: "demo-casino"
  },
  "/api/spend": {
    mtd: 145.32,
    today: 4.80,
    daily_cap: 25.00,
    monthly_cap: 500.00,
    monthly_remaining: 354.68,
    by_project: [
      { project: "Demo Casino", calls: 312, cost: 145.32 }
    ],
    by_endpoint: [
      { endpoint: "serp/google/organic/live", calls: 178, cost: 89.50 },
      { endpoint: "keywords_data/google_ads/search_volume", calls: 64, cost: 32.10 },
      { endpoint: "dataforseo_labs/google/ranked_keywords", calls: 51, cost: 18.50 },
      { endpoint: "on_page/instant_pages", calls: 19, cost: 5.22 }
    ],
    ai: {
      mtd: 23.47,
      today: 0.84,
      mtd_calls: 10,
      by_purpose: [
        { purpose: "plan-assist", calls: 8, tokens: 184200, cost: 12.34 },
        { purpose: "strategist", calls: 2, tokens: 96800, cost: 11.13 }
      ],
      by_model: [
        { model: "claude-3-5-sonnet", calls: 6, tokens: 201400, cost: 18.92 },
        { model: "gemma-2-9b (local)", calls: 4, tokens: 79600, cost: 0.00 }
      ]
    }
  },
  "/api/p/{p}/tags": {
    total: 6,
    items: [
      { tag: "bonuses", keywords: 14 },
      { tag: "pokies", keywords: 11 },
      { tag: "blackjack", keywords: 7 },
      { tag: "payments", keywords: 5 },
      { tag: "mobile", keywords: 4 },
      { tag: "live-dealer", keywords: 3 }
    ]
  },
  "/api/p/{p}/rank/summary": {
    tiles: { tracked_keywords: 24, ranking_keywords: 18, top10: 11, top3: 4, avg_position: 12.5, visibility: 62.8 },
    trend: [
      { date: "2026-06-03", visibility: 58.5, top10: 9 },
      { date: "2026-06-04", visibility: 60.2, top10: 10 },
      { date: "2026-06-05", visibility: 61.0, top10: 10 },
      { date: "2026-06-06", visibility: 62.1, top10: 11 },
      { date: "2026-06-07", visibility: 62.8, top10: 11 }
    ],
    movers: {
      up: [
        { keyword: "blackjack strategy au", position: 7, movement: 4 },
        { keyword: "online pokies 2024", position: 12, movement: 3 },
        { keyword: "best casino bonus australia", position: 8, movement: 2 }
      ],
      down: [
        { keyword: "rtp pokies", position: 18, movement: -2 },
        { keyword: "free spins welcome offer", position: 22, movement: -3 }
      ]
    },
    quick_wins: 5
  },
  "/api/p/{p}/activity": {
    items: [
      { type: "audit", label: "on-page audit", meta: "score 82", cost: null, at: "2026-06-08T14:30:00Z" },
      { type: "research", label: "keyword-ideas · blackjack", meta: "18 results", cost: 0.45, at: "2026-06-08T10:15:00Z" },
      { type: "import", label: "ahrefs import", meta: "142 rows · +12 keywords", cost: null, at: "2026-06-07T09:00:00Z" }
    ]
  },
  "/api/p/{p}/kpi": {
    north_star: { value: 2847, unit: "organic traffic (est.)", proxy: "visibility × avg CPC", wow_delta: 125 },
    branches: {
      rankings: { top10: 11, top100: 22, visibility: 62.8 },
      indexation: { coverage: 142, indexed: 139, not_indexed: 3 },
      cwv_technical: { score: 78, lcp_good: 0.88, cls_good: 0.92, inp_good: 0.86 },
      conversions: { value: 340, source: "ga4_events" }
    }
  },
  "/api/p/{p}/plan": {
    summary: { total: 28, done: 9, top: [{ key: "easy-001", category: "Easy wins", title: "Fix H1 on homepage", detail: "Currently missing; search intent 'casino guide' scores 78 opp", impact: "high", effort: "low", state: "open", source: "crawl" }] },
    categories: [
      {
        name: "Easy wins",
        count: 4,
        done: 2,
        tasks: [
          { key: "easy-001", title: "Fix H1 on homepage", detail: "Currently missing; search intent 'casino guide' scores 78 opp", impact: "high", effort: "low", state: "open", source: "crawl" },
          { key: "easy-002", title: "Optimize title tag for /blackjack-guide", detail: "Currently 'Blackjack' (3 words); target 'How to Play Blackjack Strategy Guide AU' (7 words + intent)", impact: "high", effort: "low", state: "done", source: "gsc" }
        ]
      },
      {
        name: "On-page",
        count: 6,
        done: 2,
        tasks: [
          { key: "onp-001", title: "Add FAQ schema to /faq", detail: "High-volume cluster: 'best casino bonus' + 'pokies rules'. Schema gains FAQ rich snippet.", impact: "high", effort: "medium", state: "open", source: "serp" },
          { key: "onp-002", title: "Rewrite meta for /promotions", detail: "CTR on GSC is 1.2%; competitors avg 3.5%. Update to 'Exclusive Pokies Bonuses AU | Free Spins + Match'.", impact: "medium", effort: "low", state: "done", source: "gsc" }
        ]
      },
      {
        name: "Technical",
        count: 5,
        done: 2,
        tasks: [
          { key: "tech-001", title: "Fix Core Web Vitals on /casino", detail: "LCP 3.2s (target <2.5s); CLS 0.18 (target <0.1). Image lazy-load + defer JS.", impact: "high", effort: "high", state: "open", source: "cwv" }
        ]
      },
      {
        name: "Content",
        count: 7,
        done: 2,
        tasks: [
          { key: "cont-001", title: "Write cluster: best pokies in australia", detail: "Hub (1800w) + 6 satellites (1200w each). Rank all 7 keywords in top 20 → 180 est. clicks/mo.", impact: "high", effort: "high", state: "open", source: "opportunity" }
        ]
      },
      {
        name: "Off-page",
        count: 4,
        done: 1,
        tasks: [
          { key: "off-001", title: "Guest post on pokies-review.example", detail: "DR 48; mentions pokies bonuses. Pitch: '5 Myths About Australian Pokies RTP.' Link to /pokies-rtp-guide.", impact: "medium", effort: "high", state: "done", source: "gap" }
        ]
      },
      {
        name: "Social",
        count: 2,
        done: 0,
        tasks: [
          { key: "soc-001", title: "TikTok series: blackjack strategy tips", detail: "Target 18–35; 30-sec clips (sound on). Pinned to link in bio → /blackjack-guide. 3x/week cadence.", impact: "low", effort: "high", state: "open", source: "best-practice" }
        ]
      }
    ],
    live: false,
    signals: { backlinks: false, gsc: false },
    ai_enabled: true,
    vertical: "casino"
  },
  "/api/p/{p}/plan/progress": {
    total: 28,
    done: 9,
    top: [{ key: "easy-001", category: "Easy wins", title: "Fix H1 on homepage", detail: "Currently missing; search intent 'casino guide' scores 78 opp", impact: "high", effort: "low", state: "open", source: "crawl" }],
    vertical: "casino"
  },
  "/api/p/{p}/plan/prioritize": {
    ranked: [
      { key: "cont-001", category: "Content", title: "Write cluster: best pokies in australia", score: 94.5, ai: true },
      { key: "easy-001", category: "Easy wins", title: "Fix H1 on homepage", score: 87.2, ai: true },
      { key: "onp-001", category: "On-page", title: "Add FAQ schema to /faq", score: 76.8, ai: true }
    ],
    ai_enabled: true
  },
  "/api/p/{p}/report": {
    project: "Demo Casino",
    domain: "demo-casino.example",
    slug: "demo-casino",
    north_star: { value: 2847, unit: "organic traffic (est.)", proxy: "visibility × avg CPC", wow_delta: 125 },
    kpi: { rankings_top10: 11, indexation: 139, cwv_score: 78, conversions_value: 340 },
    rank: {
      tracked: 24,
      ranking: 18,
      top10: 11,
      top3: 4,
      visibility: 62.8,
      movers_up: [
        { keyword: "blackjack strategy au", position: 7, delta: 4 },
        { keyword: "online pokies 2024", position: 12, delta: 3 }
      ],
      movers_down: [
        { keyword: "rtp pokies", position: 18, delta: -2 }
      ]
    },
    top_opportunities: [
      { keyword: "best casino sites australia", score: 82, position: null, band: "unranked", reason: "High volume (1200/mo) + low KD (35) + commercial intent" },
      { keyword: "live casino australia", score: 76, position: 24, band: "page2", reason: "Quick win: 8 positions to top 10" }
    ],
    spend_mtd: 145.32,
    backlinks: { domain_rating: 38, refdomains: 127, toxic: 4 }
  },
  "/api/p/{p}/strategist": {
    ai_enabled: true,
    briefing: {
      summary: "**Rank climbing:** 5 quick wins in striking distance (pos 8–20); **CWV regression:** LCP +800ms on /casino since Tue — image lazy-load + defer JS needed before next pull. **Backlinks:** 4 flagged toxic (parasite casino networks); disavow list queued. **Content gap:** competitors rank 14 terms you don't (cluster: responsible-gambling guides).",
      created_at: "2026-06-08T06:15:00Z",
      reason: "daily"
    }
  }
}
);
  Object.assign(MOCK, {
  "/api/p/{p}/decisions": {
    "items": [
      {
        "id": 1,
        "public_id": "dec_abc123",
        "kind": "keyword_gap",
        "target": "best casino bonus australia",
        "status": "answered",
        "suggested_yes": true,
        "suggested_conviction": 0.78,
        "suggested_action": "Target this keyword in new pillar content",
        "gemma": { "yes": true, "conviction": 0.75, "rationale": "High volume, low difficulty gap vs competitors" },
        "anthropic": { "yes": true, "conviction": 0.82, "rationale": "Aligns with existing content cluster; 45K monthly volume" },
        "human": { "yes": null, "note": null },
        "control_arm": false,
        "analysis": { "keyword": "best casino bonus australia", "search_volume": 45000, "difficulty": 38, "gap_reasoning": "Competitor ranks; we don't" },
        "score": { "agreement": true, "gemma_correct": true, "anthropic_correct": true, "outcome": null },
        "created_at": "2026-06-08T14:22:00Z",
        "updated_at": "2026-06-08T14:22:00Z"
      },
      {
        "id": 2,
        "public_id": "dec_def456",
        "kind": "content_refresh",
        "target": "/guides/pokies-strategy/",
        "status": "answered",
        "suggested_yes": false,
        "suggested_conviction": 0.61,
        "suggested_action": "Refresh outdated strategy section",
        "gemma": { "yes": false, "conviction": 0.58, "rationale": "Low-value update; rank is stable" },
        "anthropic": { "yes": true, "conviction": 0.64, "rationale": "Competitor just updated; users engage refresh" },
        "human": { "yes": null, "note": null },
        "control_arm": true,
        "analysis": { "url": "https://demo-casino.example/guides/pokies-strategy/", "last_updated": "2025-09-12", "avg_engagement": 2.4, "competitor_activity": "updated_recently" },
        "score": null,
        "created_at": "2026-06-08T13:45:00Z",
        "updated_at": "2026-06-08T13:45:00Z"
      },
      {
        "id": 3,
        "public_id": "dec_ghi789",
        "kind": "onpage",
        "target": "/blackjack-rules/",
        "status": "dismissed",
        "suggested_yes": true,
        "suggested_conviction": 0.72,
        "suggested_action": "Update meta title to target high-intent phrase",
        "gemma": { "yes": true, "conviction": 0.70, "rationale": "Title mismatch detected" },
        "anthropic": { "yes": true, "conviction": 0.75, "rationale": "Title <60 chars; meta <155 chars; opportunity at hand" },
        "human": { "yes": false, "note": "Already handling in next sprint redesign" },
        "control_arm": false,
        "analysis": { "url": "https://demo-casino.example/blackjack-rules/", "current_title": "Blackjack Rules & Strategy", "suggested_title": "Australian Blackjack Rules – House Edge & Basic Strategy Guide" },
        "score": { "agreement": false, "gemma_correct": true, "anthropic_correct": true, "outcome": null },
        "created_at": "2026-06-07T09:15:00Z",
        "updated_at": "2026-06-08T11:20:00Z"
      }
    ],
    "total": 3,
    "status_counts": { "open": 0, "answered": 2, "actuating": 0, "actuated": 0, "dismissed": 1 }
  },
  "/api/p/{p}/decisions?status=answered&limit=200": {
    "items": [
      {
        "id": 1,
        "public_id": "dec_abc123",
        "kind": "keyword_gap",
        "target": "best casino bonus australia",
        "status": "answered",
        "suggested_yes": true,
        "suggested_conviction": 0.78,
        "suggested_action": "Target this keyword in new pillar content",
        "gemma": { "yes": true, "conviction": 0.75, "rationale": "High volume, low difficulty gap vs competitors" },
        "anthropic": { "yes": true, "conviction": 0.82, "rationale": "Aligns with existing content cluster; 45K monthly volume" },
        "human": { "yes": null, "note": null },
        "control_arm": false,
        "analysis": { "keyword": "best casino bonus australia", "search_volume": 45000, "difficulty": 38 },
        "score": { "agreement": true, "gemma_correct": true, "anthropic_correct": true, "outcome": null },
        "created_at": "2026-06-08T14:22:00Z",
        "updated_at": "2026-06-08T14:22:00Z"
      },
      {
        "id": 2,
        "public_id": "dec_def456",
        "kind": "content_refresh",
        "target": "/guides/pokies-strategy/",
        "status": "answered",
        "suggested_yes": false,
        "suggested_conviction": 0.61,
        "suggested_action": "Refresh outdated strategy section",
        "gemma": { "yes": false, "conviction": 0.58, "rationale": "Low-value update; rank is stable" },
        "anthropic": { "yes": true, "conviction": 0.64, "rationale": "Competitor just updated; users engage refresh" },
        "human": { "yes": null, "note": null },
        "control_arm": true,
        "analysis": { "url": "https://demo-casino.example/guides/pokies-strategy/", "last_updated": "2025-09-12" },
        "score": null,
        "created_at": "2026-06-08T13:45:00Z",
        "updated_at": "2026-06-08T13:45:00Z"
      }
    ],
    "total": 2,
    "status_counts": { "open": 0, "answered": 2, "actuating": 0, "actuated": 0, "dismissed": 1 }
  },
  "/api/p/{p}/decisions/summary": {
    "status_counts": { "open": 0, "answered": 2, "actuating": 0, "actuated": 0, "dismissed": 1 },
    "scoreboard": { "judged": 15, "agreement_rate": 0.867, "gemma_correct": 13, "anthropic_correct": 14 },
    "by_scope": [
      { "judged": 8, "agreement_rate": 0.875, "gemma_correct": 7, "anthropic_correct": 8, "kind": "content_refresh" },
      { "judged": 4, "agreement_rate": 0.75, "gemma_correct": 3, "anthropic_correct": 4, "kind": "keyword_gap" },
      { "judged": 3, "agreement_rate": 0.889, "gemma_correct": 3, "anthropic_correct": 2, "kind": "onpage" }
    ]
  },
  "/api/p/{p}/decisions/autonomy": {
    "kill_switch": false,
    "auto_apply_min_level": 4,
    "levels": { "0": "shadow (read-only)", "1": "review queue", "2": "auto-minor", "3": "auto-moderate", "4": "auto-major", "5": "auto-critical" },
    "scopes": [
      {
        "scope": "*",
        "level": 0,
        "scoreboard": { "judged": 15, "agreement_rate": 0.867, "gemma_correct": 13, "anthropic_correct": 14 },
        "promotion": { "eligible": false, "reason": "agreement_rate below 85%; GATE B requires 85% + 10+ judged" }
      },
      {
        "scope": "onpage",
        "level": 1,
        "scoreboard": { "judged": 3, "agreement_rate": 0.889, "gemma_correct": 3, "anthropic_correct": 2 },
        "promotion": { "eligible": true, "reason": "agreement_rate 88.9% over 3; GATE B met; ready to promote" }
      },
      {
        "scope": "technical",
        "level": 0,
        "scoreboard": { "judged": 0, "agreement_rate": null, "gemma_correct": 0, "anthropic_correct": 0 },
        "promotion": { "eligible": false, "reason": "no judged decisions yet" }
      },
      {
        "scope": "internal_links",
        "level": 0,
        "scoreboard": { "judged": 0, "agreement_rate": null, "gemma_correct": 0, "anthropic_correct": 0 },
        "promotion": { "eligible": false, "reason": "no judged decisions yet" }
      },
      {
        "scope": "serp_feature",
        "level": 0,
        "scoreboard": { "judged": 2, "agreement_rate": 0.5, "gemma_correct": 1, "anthropic_correct": 1 },
        "promotion": { "eligible": false, "reason": "agreement_rate too low" }
      },
      {
        "scope": "content_refresh",
        "level": 1,
        "scoreboard": { "judged": 8, "agreement_rate": 0.875, "gemma_correct": 7, "anthropic_correct": 8 },
        "promotion": { "eligible": true, "reason": "agreement_rate 87.5% over 8; ready to promote" }
      },
      {
        "scope": "keyword_target",
        "level": 0,
        "scoreboard": { "judged": 4, "agreement_rate": 0.75, "gemma_correct": 3, "anthropic_correct": 4 },
        "promotion": { "eligible": false, "reason": "agreement_rate 75% – need 85% for GATE B" }
      }
    ]
  },
  "/api/p/{p}/decisions/{id}": {
    "id": 1,
    "public_id": "dec_abc123",
    "kind": "keyword_gap",
    "target": "best casino bonus australia",
    "status": "answered",
    "suggested_yes": true,
    "suggested_conviction": 0.78,
    "suggested_action": "Target this keyword in new pillar content",
    "gemma": { "yes": true, "conviction": 0.75, "rationale": "High volume, low difficulty gap vs competitors" },
    "anthropic": { "yes": true, "conviction": 0.82, "rationale": "Aligns with existing content cluster; 45K monthly volume" },
    "human": { "yes": null, "note": null },
    "control_arm": false,
    "analysis": {
      "keyword": "best casino bonus australia",
      "search_volume": 45000,
      "difficulty": 38,
      "intent": "commercial",
      "current_rank": null,
      "competing_urls": ["casinopro.example/bonuses", "acepoker.example/offers"],
      "gap_source": "ahrefs_rank_tracker"
    },
    "score": { "agreement": true, "gemma_correct": true, "anthropic_correct": true, "outcome": null },
    "created_at": "2026-06-08T14:22:00Z",
    "updated_at": "2026-06-08T14:22:00Z",
    "discussion": [
      {
        "role": "system",
        "message": "You overruled me—Gemma says YES but you said NO. Let's talk it out. I searched for recent updates on the competing pages. Their content is thin (user question about eligibility only); yours is comprehensive. The opportunity stands.",
        "web_findings": [
          { "url": "https://casinopro.example/bonuses", "title": "Casino Bonuses & Promos – CasinoPro Australia", "snippet": "Latest bonuses and promotional offers..." },
          { "url": "https://acepoker.example/offers", "title": "Ace Poker Offers – Australian Poker Site", "snippet": "Exclusive offers for registered members..." }
        ],
        "created_at": "2026-06-08T15:10:00Z"
      },
      {
        "role": "user",
        "message": "You're right—I was being cautious. The keyword_difficulty score of 38 is actually achievable; we have a solid backlink profile. I'll approve the decision and let's draft a pillar.",
        "web_findings": null,
        "created_at": "2026-06-08T15:35:00Z"
      }
    ]
  }
}
);
  Object.assign(MOCK, {
  "/api/p/{p}/brief": {
    "keyword": "best online pokies australia",
    "prompt": "You are an SEO content strategist analyzing the SERP for 'best online pokies australia'. Create a comprehensive content brief that covers:\n\n1. SERP Analysis\n- Top 10 organic results, featured snippets, and SERP features\n- User intent: informational, commercial, or transactional\n- Content gaps and opportunities\n\n2. Brief Outline\n- Primary keyword focus and secondary keywords to target\n- Content format recommendation (blog, guide, comparison, review)\n- Target audience and reading level\n- Estimated word count and structure\n\n3. Key Topics to Cover\n- Must-have sections based on SERP analysis\n- Supporting subtopics and FAQs\n- Entity mentions (brands, products, experts)\n- Responsible gambling messaging\n\n4. Optimization Checklist\n- Title tag and meta description suggestions\n- Internal linking opportunities\n- On-page SEO elements (H1, H2s, images, CTAs)\n\nReturn the brief as structured markdown."
  },
  "/api/p/{p}/content": {
    "items": [
      {
        "id": 1,
        "project_id": 1,
        "keyword": "best online pokies australia",
        "content_type": "guide",
        "tone": "professional",
        "persona": "sarah-gambler",
        "title": "The Complete Guide to the Best Online Pokies in Australia 2026",
        "body": "Online pokies have revolutionized how Australians enjoy their favourite games. Whether you're a seasoned player or just starting out, this comprehensive guide will walk you through everything you need to know about choosing the best online casinos and pokies in Australia for 2026.\n\n## What Are Online Pokies?\n\nOnline pokies, also known as online slots, are digital versions of the traditional pokie machines found in Australian pubs and clubs. These games feature spinning reels with various symbols, and your goal is to match them in winning combinations.\n\n## Top Online Pokies Sites in Australia\n\nWe've reviewed and ranked the best platforms for Australian players:\n\n### 1. Spin Paradise\n- Welcome bonus: 300% up to AUD$3000\n- Game library: 2500+ titles\n- RTP: 96-98%\n- Mobile optimized: Yes\n\n### 2. Aussie Luck Casino\n- Welcome bonus: 200% up to AUD$2000\n- Exclusive local payment methods\n- 24/7 Australian customer support\n- Live chat available\n\n## Responsible Gambling\n\nPlease gamble responsibly. Set limits on your spending and time. If you feel you may have a gambling problem, contact Gambling Help Online at 1800 858 858.",
        "status": "published",
        "model": "claude-3-5-sonnet",
        "word_count": 287,
        "source_urls": ["https://example.com/top-pokies-2026", "https://example.com/australian-gaming-report"],
        "connection_id": 1,
        "published_url": "https://demo-casino.example/guides/best-online-pokies",
        "scheduled_for": null,
        "created_at": "2026-06-05T10:30:00",
        "reviewed_at": "2026-06-05T11:15:00"
      },
      {
        "id": 2,
        "project_id": 1,
        "keyword": "blackjack strategy guide",
        "content_type": "guide",
        "tone": "professional",
        "persona": "david-analyst",
        "title": "Blackjack Strategy: How to Improve Your Odds",
        "body": "Blackjack is one of the most popular casino games worldwide, and for good reason. Unlike games of pure chance, blackjack offers players the opportunity to use strategy to reduce the house edge. This guide covers basic strategy, card counting ethics, and bankroll management.\n\n## Basic Blackjack Strategy\n\nThe basic strategy chart is a mathematically-proven set of plays for every possible hand combination. By following this strategy consistently, you can reduce the house edge to approximately 0.5%.\n\n## Key Strategy Rules\n\n1. Always split Aces and 8s\n2. Never split 10s or 5s\n3. Hit on 16 or less if dealer shows 7-Ace\n4. Stand on 17 or more\n\n## Bankroll Management\n\nEffective bankroll management is crucial for long-term success. Set a budget, stick to bet limits, and never chase losses.\n\n## Responsible Gaming Note\n\nRemember, casino games are games of chance. While strategy can improve your odds, the house always maintains a mathematical edge. Only gamble with money you can afford to lose.",
        "status": "approved",
        "model": "claude-3-5-sonnet",
        "word_count": 201,
        "source_urls": ["https://example.com/blackjack-basics", "https://example.com/casino-strategy"],
        "connection_id": 1,
        "published_url": null,
        "scheduled_for": null,
        "created_at": "2026-06-06T14:45:00",
        "reviewed_at": "2026-06-06T15:20:00"
      },
      {
        "id": 3,
        "project_id": 1,
        "keyword": "casino bonus codes 2026",
        "content_type": "blog",
        "tone": "professional",
        "persona": null,
        "title": "Casino Bonus Codes: Get the Best Offers This Month",
        "body": "Casino bonus codes are one of the easiest ways to boost your bankroll and extend your playtime. In this post, we'll share the best active bonus codes for June 2026 and explain how to use them.\n\n## What Are Bonus Codes?\n\nBonus codes are alphanumeric sequences that unlock special promotions at online casinos. They typically provide free spins, deposit matches, or cashback rewards.\n\n## How to Claim Your Bonus\n\n1. Create or log into your casino account\n2. Navigate to the promotions section\n3. Enter the bonus code\n4. Meet wagering requirements\n5. Enjoy your bonus funds\n\n## Top Bonus Codes for June 2026\n\nBONUS300 - 300% welcome match\nFREESPINS50 - 50 free spins on select slots\nCASHBACK10 - 10% cashback on losses\n\n## Wagering Requirements\n\nMost bonuses come with wagering requirements (typically 30-50x). This means you must play through the bonus amount that many times before withdrawing.",
        "status": "pending",
        "model": "claude-3-5-sonnet",
        "word_count": 178,
        "source_urls": [],
        "connection_id": null,
        "published_url": null,
        "scheduled_for": null,
        "created_at": "2026-06-07T09:20:00",
        "reviewed_at": null
      }
    ],
    "total": 3
  },
  "/api/p/{p}/content?status=pending": {
    "items": [
      {
        "id": 3,
        "project_id": 1,
        "keyword": "casino bonus codes 2026",
        "content_type": "blog",
        "tone": "professional",
        "persona": null,
        "title": "Casino Bonus Codes: Get the Best Offers This Month",
        "body": "Casino bonus codes are one of the easiest ways to boost your bankroll and extend your playtime. In this post, we'll share the best active bonus codes for June 2026 and explain how to use them.\n\n## What Are Bonus Codes?\n\nBonus codes are alphanumeric sequences that unlock special promotions at online casinos. They typically provide free spins, deposit matches, or cashback rewards.\n\n## How to Claim Your Bonus\n\n1. Create or log into your casino account\n2. Navigate to the promotions section\n3. Enter the bonus code\n4. Meet wagering requirements\n5. Enjoy your bonus funds\n\n## Top Bonus Codes for June 2026\n\nBONUS300 - 300% welcome match\nFREESPINS50 - 50 free spins on select slots\nCASHBACK10 - 10% cashback on losses\n\n## Wagering Requirements\n\nMost bonuses come with wagering requirements (typically 30-50x). This means you must play through the bonus amount that many times before withdrawing.",
        "status": "pending",
        "model": "claude-3-5-sonnet",
        "word_count": 178,
        "source_urls": [],
        "connection_id": null,
        "published_url": null,
        "scheduled_for": null,
        "created_at": "2026-06-07T09:20:00",
        "reviewed_at": null
      }
    ],
    "total": 1
  },
  "/api/p/{p}/content/{id}": {
    "id": 1,
    "project_id": 1,
    "keyword": "best online pokies australia",
    "content_type": "guide",
    "tone": "professional",
    "persona": "sarah-gambler",
    "title": "The Complete Guide to the Best Online Pokies in Australia 2026",
    "body": "Online pokies have revolutionized how Australians enjoy their favourite games. Whether you're a seasoned player or just starting out, this comprehensive guide will walk you through everything you need to know about choosing the best online casinos and pokies in Australia for 2026.\n\n## What Are Online Pokies?\n\nOnline pokies, also known as online slots, are digital versions of the traditional pokie machines found in Australian pubs and clubs. These games feature spinning reels with various symbols, and your goal is to match them in winning combinations.\n\n## Top Online Pokies Sites in Australia\n\nWe've reviewed and ranked the best platforms for Australian players:\n\n### 1. Spin Paradise\n- Welcome bonus: 300% up to AUD$3000\n- Game library: 2500+ titles\n- RTP: 96-98%\n- Mobile optimized: Yes\n\n### 2. Aussie Luck Casino\n- Welcome bonus: 200% up to AUD$2000\n- Exclusive local payment methods\n- 24/7 Australian customer support\n- Live chat available\n\n## Responsible Gambling\n\nPlease gamble responsibly. Set limits on your spending and time. If you feel you may have a gambling problem, contact Gambling Help Online at 1800 858 858.",
    "status": "published",
    "model": "claude-3-5-sonnet",
    "word_count": 287,
    "source_urls": ["https://example.com/top-pokies-2026", "https://example.com/australian-gaming-report"],
    "connection_id": 1,
    "published_url": "https://demo-casino.example/guides/best-online-pokies",
    "scheduled_for": null,
    "created_at": "2026-06-05T10:30:00",
    "reviewed_at": "2026-06-05T11:15:00"
  },
  "/api/p/{p}/content/scorecard": {
    "items": [
      {
        "draft_id": 1,
        "keyword": "best online pokies australia",
        "url": "https://demo-casino.example/guides/best-online-pokies",
        "indexed": true,
        "position": 12,
        "keyword_tracked": true,
        "verdict": "underperforming"
      },
      {
        "draft_id": 5,
        "keyword": "rtp slots explained",
        "url": "https://demo-casino.example/guides/rtp-explained",
        "indexed": true,
        "position": 4,
        "keyword_tracked": true,
        "verdict": "ranking"
      },
      {
        "draft_id": 7,
        "keyword": "how to play pokies",
        "url": "https://demo-casino.example/guides/how-to-play",
        "indexed": false,
        "position": null,
        "keyword_tracked": true,
        "verdict": "not_indexed"
      }
    ],
    "total": 3,
    "underperformers": 2
  },
  "/api/p/{p}/content/calendar": {
    "items": [
      {
        "id": 4,
        "keyword": "pokies free spins",
        "title": "Free Spins at Australian Online Casinos: How to Get Them",
        "status": "scheduled",
        "scheduled_for": "2026-06-12T09:00:00",
        "connection_id": 1
      },
      {
        "id": 5,
        "keyword": "rtp slots explained",
        "title": "Understanding RTP in Online Slots: A Beginner's Guide",
        "status": "scheduled",
        "scheduled_for": "2026-06-14T14:00:00",
        "connection_id": 1
      },
      {
        "id": 6,
        "keyword": "mobile casino apps australia",
        "title": "The Best Mobile Casino Apps for Australians",
        "status": "scheduled",
        "scheduled_for": "2026-06-16T10:30:00",
        "connection_id": 1
      }
    ],
    "total": 3
  }
});
  Object.assign(MOCK, {
  "/api/p/{p}/rank": {
    "items": [
      { "keyword_id": 1, "keyword": "online pokies au", "tags": ["tier-1"], "position": 8, "previous_position": 12, "movement": 4, "url": "https://demo-casino.example/pokies-guide", "search_volume": 1200, "keyword_difficulty": 42, "checked_on": "2026-06-10" },
      { "keyword_id": 2, "keyword": "best casino bonus", "tags": ["promotions"], "position": 15, "previous_position": 18, "movement": 3, "url": "https://demo-casino.example/bonuses", "search_volume": 890, "keyword_difficulty": 38, "checked_on": "2026-06-10" },
      { "keyword_id": 3, "keyword": "blackjack strategy", "tags": ["guides"], "position": 22, "previous_position": 25, "movement": 3, "url": "https://demo-casino.example/strategy", "search_volume": 650, "keyword_difficulty": 35, "checked_on": "2026-06-10" },
      { "keyword_id": 4, "keyword": "safe gambling au", "tags": [], "position": 5, "previous_position": 5, "movement": 0, "url": "https://demo-casino.example/responsible", "search_volume": 420, "keyword_difficulty": 28, "checked_on": "2026-06-10" },
      { "keyword_id": 5, "keyword": "roulette tips", "tags": ["guides", "tier-2"], "position": null, "previous_position": 31, "movement": null, "url": null, "search_volume": 380, "keyword_difficulty": 41, "checked_on": "2026-06-10" }
    ],
    "total": 5,
    "page": 1,
    "page_size": 50
  },
  "/api/p/{p}/rank/compare": {
    "summary": {
      "tracked": 5,
      "dataforseo_ranking": 4,
      "ahrefs_ranking": 5,
      "both": 4,
      "only_dataforseo": 0,
      "only_ahrefs": 1,
      "avg_abs_diff": 2.8
    },
    "rows": [
      { "keyword": "online pokies au", "dataforseo": 8, "ahrefs": 9, "diff": -1 },
      { "keyword": "best casino bonus", "dataforseo": 15, "ahrefs": 14, "diff": 1 },
      { "keyword": "blackjack strategy", "dataforseo": 22, "ahrefs": 21, "diff": 1 },
      { "keyword": "safe gambling au", "dataforseo": 5, "ahrefs": 6, "diff": -1 },
      { "keyword": "roulette tips", "dataforseo": null, "ahrefs": 28, "diff": null }
    ]
  },
  "/api/p/{p}/backlinks": {
    "configured": true,
    "domain": "demo-casino.example",
    "domain_rating": 24,
    "refdomains_live": 187,
    "backlinks_live": 532,
    "top_referring_domains": [
      { "domain": "gambling-guide.example", "domain_rating": 42, "links": 8, "dofollow": 7, "first_seen": "2026-04-15", "toxic": false, "toxic_reason": null },
      { "domain": "casino-review-au.example", "domain_rating": 35, "links": 5, "dofollow": 5, "first_seen": "2026-03-22", "toxic": false, "toxic_reason": null },
      { "domain": "pokies-hub.example", "domain_rating": 28, "links": 3, "dofollow": 3, "first_seen": "2026-02-10", "toxic": false, "toxic_reason": null },
      { "domain": "aussie-casinos.example", "domain_rating": 18, "links": 2, "dofollow": 0, "first_seen": "2026-01-30", "toxic": false, "toxic_reason": null }
    ],
    "referring_domains_seen": 187,
    "toxic_count": 2,
    "toxic_domains": [
      { "domain": "itxoft-casino-spam.example", "domain_rating": 1, "dofollow": 0, "reason": "known PBN itxoft network" },
      { "domain": "low-authority-spam.example", "domain_rating": 2, "dofollow": 0, "reason": "DR <= 3, no dofollow links" }
    ],
    "errors": null
  },
  "/api/p/{p}/competitors": {
    "items": [
      { "id": 1, "project_id": 1, "domain": "justcasino.example", "label": "Direct competitor", "last_overview": { "count": 34, "top3": 5, "top10": 18, "etv": 8420, "is_new": 2, "is_up": 4, "is_down": 1, "is_lost": 0 }, "last_checked_at": "2026-06-09", "created_at": "2026-05-15" },
      { "id": 2, "project_id": 1, "domain": "spinriseaustralia.example", "label": "Rising competitor", "last_overview": { "count": 28, "top3": 3, "top10": 12, "etv": 6150, "is_new": 3, "is_up": 2, "is_down": 2, "is_lost": 1 }, "last_checked_at": "2026-06-08", "created_at": "2026-05-20" }
    ],
    "us": { "domain": "demo-casino.example", "tracked": 5, "count": 4, "top3": 1, "top10": 2 }
  },
  "/api/p/{p}/competitors/{id}/keywords": {
    "rows": [
      { "keyword": "online pokies au", "position": 7, "search_volume": 1200, "we_track": true, "url": "https://justcasino.example/pokies" },
      { "keyword": "best crypto casino", "position": 12, "search_volume": 540, "we_track": false, "url": "https://justcasino.example/crypto" },
      { "keyword": "live dealer slots", "position": 19, "search_volume": 380, "we_track": false, "url": "https://justcasino.example/live-dealer" },
      { "keyword": "high roller pokies", "position": 25, "search_volume": 210, "we_track": false, "url": "https://justcasino.example/vip" },
      { "keyword": "australian online gambling", "position": 30, "search_volume": 890, "we_track": false, "url": "https://justcasino.example/au-gambling" }
    ],
    "count": 5,
    "cost": 0.85,
    "budget": { "mtd": 18.42, "monthly_cap": 150, "monthly_remaining": 131.58 }
  },
  "/api/p/{p}/analytics": {
    "configured": true,
    "days": 30,
    "ahrefs_project_id": 45821,
    "visitors": 12480,
    "visits": 18650,
    "pageviews": 42310,
    "bounce_rate": 0.52,
    "avg_session_sec": 145
  },
  "/api/p/{p}/gsc": {
    "configured": true,
    "days": 28,
    "rows": [
      { "keyword": "online pokies au", "clicks": 42, "impressions": 280, "ctr": 0.15, "position": 9.2, "url": "https://demo-casino.example/pokies-guide" },
      { "keyword": "best casino bonus", "clicks": 18, "impressions": 165, "ctr": 0.109, "position": 15.8, "url": "https://demo-casino.example/bonuses" },
      { "keyword": "blackjack strategy", "clicks": 8, "impressions": 92, "ctr": 0.087, "position": 22.1, "url": "https://demo-casino.example/strategy" },
      { "keyword": "safe gambling au", "clicks": 35, "impressions": 210, "ctr": 0.167, "position": 5.4, "url": "https://demo-casino.example/responsible" }
    ],
    "totals": { "clicks": 103, "impressions": 747 },
    "error": null
  },
  "/api/p/{p}/bing": {
    "configured": true,
    "site": "https://demo-casino.example/",
    "queries": [
      { "query": "online pokies australia", "clicks": 12, "impressions": 68, "avg_click_position": 8.5, "avg_impression_position": 9.1 },
      { "query": "casino bonus", "clicks": 5, "impressions": 42, "avg_click_position": 14.2, "avg_impression_position": 15.8 },
      { "query": "responsible gambling", "clicks": 18, "impressions": 95, "avg_click_position": 5.1, "avg_impression_position": 6.3 }
    ],
    "totals": { "clicks": 35, "impressions": 205 },
    "error": null
  },
  "/api/p/{p}/audit": {
    "items": [
      { "id": 1, "url": "https://demo-casino.example/", "onpage_score": 78, "title": "Online Pokies & Casino Australia", "description": "Safe, licensed online casino...", "internal_links": 42, "checks_failed": ["missing_h1", "short_meta_description"], "checks_total": 85, "created_at": "2026-06-09", "grade": { "letter": "B", "score": 78, "passed": 83, "checks_total": 85, "failed": 2, "categories": [{"name": "Technical", "failed": [{"label": "Missing H1", "fix": "Add a unique H1 tag to the page"}]}] } },
      { "id": 2, "url": "https://demo-casino.example/pokies-guide", "onpage_score": 85, "title": "Best Online Pokies Guide", "description": "Complete guide to pokies slots...", "internal_links": 38, "checks_failed": [], "checks_total": 85, "created_at": "2026-06-08", "grade": { "letter": "A", "score": 85, "passed": 85, "checks_total": 85, "failed": 0, "categories": [] } }
    ],
    "default_url": "https://demo-casino.example/"
  },
  "/api/p/{p}/crawl": {
    "crawl": {
      "id": 1,
      "status": "done",
      "target": "demo-casino.example",
      "max_pages": 100,
      "pages_crawled": 87,
      "onpage_score": 72,
      "summary": {
        "pages_crawled": 87,
        "links_internal": 342,
        "links_external": 58,
        "issues": [
          { "check": "duplicate_title", "count": 4 },
          { "check": "short_meta_description", "count": 8 },
          { "check": "missing_h1", "count": 2 },
          { "check": "slow_page_load", "count": 3 }
        ]
      },
      "detail": null,
      "created_at": "2026-06-08",
      "completed_at": "2026-06-08T14:32:10Z"
    }
  },
  "/api/p/{p}/pagespeed/history": {
    "items": [
      { "date": "2026-06-08", "mobile_lcp": 2.1, "mobile_cls": 0.08, "mobile_performance_score": 68, "desktop_lcp": 1.8, "desktop_cls": 0.05, "desktop_performance_score": 82 },
      { "date": "2026-06-05", "mobile_lcp": 2.4, "mobile_cls": 0.11, "mobile_performance_score": 65, "desktop_lcp": 2.0, "desktop_cls": 0.06, "desktop_performance_score": 80 },
      { "date": "2026-06-02", "mobile_lcp": 2.8, "mobile_cls": 0.14, "mobile_performance_score": 62, "desktop_lcp": 2.3, "desktop_cls": 0.08, "desktop_performance_score": 78 }
    ]
  },
  "/api/p/{p}/indexation": {
    "items": [
      { "id": 1, "url": "https://demo-casino.example/", "label": "homepage", "indexed": true, "serp_count": 1, "checked_on": "2026-06-09", "created_at": "2026-05-10" },
      { "id": 2, "url": "https://demo-casino.example/pokies-guide", "label": "money page", "indexed": true, "serp_count": 1, "checked_on": "2026-06-09", "created_at": "2026-05-15" },
      { "id": 3, "url": "https://demo-casino.example/bonuses", "label": "promotions", "indexed": true, "serp_count": 1, "checked_on": "2026-06-09", "created_at": "2026-05-18" },
      { "id": 4, "url": "https://parasite-placement.example/demo-casino-review", "label": "parasite: casino-review-au", "indexed": true, "serp_count": 2, "checked_on": "2026-06-09", "created_at": "2026-06-01" },
      { "id": 5, "url": "https://demo-casino.example/blog/strategy", "label": "blog post", "indexed": false, "serp_count": 0, "checked_on": "2026-06-08", "created_at": "2026-06-05" }
    ],
    "total": 5,
    "indexed": 4,
    "checked": 5
  }
}
);
  Object.assign(MOCK, {
  "/api/p/{p}/opportunities": {
    "items": [
      {"keyword_id": 1, "keyword": "online pokies au", "position": 12, "position_source": "dataforseo", "search_volume": 2400, "keyword_difficulty": 68, "tags": ["tier1"], "band": "quick_wins", "score": 78, "components": {"position": 35, "volume": 28, "kd": 12, "intent": 3}, "reason": "Improving position + high intent"},
      {"keyword_id": 2, "keyword": "best casino bonus", "position": 15, "position_source": "dataforseo", "search_volume": 5600, "keyword_difficulty": 52, "tags": ["bonuses"], "band": "quick_wins", "score": 72, "components": {"position": 30, "volume": 35, "kd": 5, "intent": 2}, "reason": "High volume, hittable position"},
      {"keyword_id": 3, "keyword": "blackjack strategy", "position": 8, "position_source": "dataforseo", "search_volume": 1800, "keyword_difficulty": 45, "tags": ["strategy"], "band": "top10", "score": 68, "components": {"position": 45, "volume": 20, "kd": 3, "intent": 0}, "reason": "Top 10 + lower difficulty"},
      {"keyword_id": 4, "keyword": "rtp slots online", "position": 28, "position_source": "ahrefs", "search_volume": 620, "keyword_difficulty": 55, "tags": ["slots"], "band": "page2", "score": 45, "components": {"position": 15, "volume": 15, "kd": 15, "intent": 0}, "reason": "Moderate volume, unranked in DFS"},
      {"keyword_id": 5, "keyword": "australian gambling laws", "position": null, "position_source": null, "search_volume": 3200, "keyword_difficulty": 72, "tags": ["info"], "band": "unranked", "score": 28, "components": {"position": 0, "volume": 22, "kd": 6, "intent": 0}, "reason": "Good volume but highly competitive"}
    ],
    "total": 5,
    "weights": {"position": 0.45, "volume": 0.30, "kd": 0.15, "intent": 0.10}
  },
  "/api/p/{p}/opportunities/clusters": {
    "items": [
      {"cluster": "bonuses", "keywords": 8, "ranking": 4, "top10": 2, "total_volume": 18400, "avg_position": 16.5, "avg_opportunity": 62.3},
      {"cluster": "tier1", "keywords": 6, "ranking": 5, "top10": 3, "total_volume": 14200, "avg_position": 11.2, "avg_opportunity": 68.1},
      {"cluster": "slots", "keywords": 5, "ranking": 2, "top10": 0, "total_volume": 6800, "avg_position": 35.0, "avg_opportunity": 41.5}
    ]
  },
  "/api/p/{p}/research": {
    "kind": "ideas",
    "rows": [
      {"keyword": "best pokies site au", "search_volume": 3600, "keyword_difficulty": 58, "cpc": 2.45, "intent": "commercial"},
      {"keyword": "online casino real money au", "search_volume": 4200, "keyword_difficulty": 65, "cpc": 3.10, "intent": "commercial"},
      {"keyword": "free spins no deposit", "search_volume": 8900, "keyword_difficulty": 42, "cpc": 1.85, "intent": "commercial"},
      {"keyword": "pokies for money", "search_volume": 2100, "keyword_difficulty": 51, "cpc": 2.20, "intent": "commercial"}
    ],
    "count": 4,
    "cost": 0.0025,
    "ok": true,
    "detail": "ok",
    "budget": {"daily_cap": 50.0, "daily_used": 2.34, "daily_remaining": 47.66, "monthly_cap": 500.0, "monthly_used": 45.78, "monthly_remaining": 454.22}
  },
  "/api/p/{p}/research/history": {
    "items": [
      {"id": 1, "kind": "ideas", "query": "online casino", "result_count": 12, "cost": 0.0025, "created_at": "2026-06-09T14:32:00"},
      {"id": 2, "kind": "volume", "query": "pokies", "result_count": 3, "cost": 0.0015, "created_at": "2026-06-08T09:15:00"},
      {"id": 3, "kind": "related", "query": "best casino bonus", "result_count": 8, "cost": 0.0020, "created_at": "2026-06-07T16:45:00"}
    ]
  },
  "/api/p/{p}/keywords": {
    "items": [
      {"id": 1, "project_id": 1, "keyword": "best casino bonus", "location_code": 2036, "language_code": "en", "device": "desktop", "search_volume": 5600, "keyword_difficulty": 52, "is_active": true, "note": "Target for June sprint", "tags": ["bonuses", "tier1"], "created_at": "2026-05-15T10:20:00"},
      {"id": 2, "project_id": 1, "keyword": "online pokies au", "location_code": 2036, "language_code": "en", "device": "desktop", "search_volume": 2400, "keyword_difficulty": 68, "is_active": true, "note": null, "tags": ["tier1"], "created_at": "2026-05-20T08:30:00"},
      {"id": 3, "project_id": 1, "keyword": "blackjack strategy", "location_code": 2036, "language_code": "en", "device": "desktop", "search_volume": 1800, "keyword_difficulty": 45, "is_active": true, "note": "Info intent, link target", "tags": ["strategy"], "created_at": "2026-05-22T12:00:00"}
    ],
    "total": 3,
    "page": 1,
    "page_size": 100
  },
  "/api/p/{p}/keywords/{id}/history": {
    "keyword": {"id": 1, "project_id": 1, "keyword": "best casino bonus", "location_code": 2036, "language_code": "en", "device": "desktop", "search_volume": 5600, "keyword_difficulty": 52, "is_active": true, "note": "Target for June sprint", "tags": ["bonuses", "tier1"], "created_at": "2026-05-15T10:20:00"},
    "dataforseo": [
      {"date": "2026-06-02", "position": 18, "url": "https://demo-casino.example/bonuses/welcome"},
      {"date": "2026-06-03", "position": 17, "url": "https://demo-casino.example/bonuses/welcome"},
      {"date": "2026-06-04", "position": 15, "url": "https://demo-casino.example/bonuses/welcome"},
      {"date": "2026-06-05", "position": 14, "url": "https://demo-casino.example/bonuses/welcome"}
    ],
    "ahrefs": [
      {"date": "2026-06-01", "position": 22},
      {"date": "2026-06-03", "position": 19},
      {"date": "2026-06-05", "position": 15}
    ]
  },
  "/api/p/{p}/domains": {
    "items": [
      {"id": 1, "domain": "premium-slots-au.example", "source": "whoisfreaks-dropped", "tags": ["slots", "au"], "relevancy": 92, "domain_rating": 18, "refdomains": 14, "parasite_score": 62, "first_seen": "2015-03-10", "wayback_years": 9, "status": "watching", "price": null, "note": "Good domain age", "created_at": "2026-06-05T11:20:00"},
      {"id": 2, "domain": "aussie-casino.example", "source": "whoisfreaks-expired", "tags": ["casino", "au"], "relevancy": 88, "domain_rating": 22, "refdomains": 28, "parasite_score": 74, "first_seen": "2013-07-22", "wayback_years": 11, "status": "bought", "price": 45.50, "note": "Redirected to main", "created_at": "2026-06-03T09:15:00"}
    ],
    "total": 2
  },
  "/api/p/{p}/imports": {
    "items": [
      {"id": 1, "project_id": 1, "filename": "ahrefs-export-jun.csv", "source": "ahrefs", "row_count": 156, "keywords_created": 42, "status": "completed", "created_at": "2026-06-05T14:30:00"},
      {"id": 2, "project_id": 1, "filename": "bonus-keywords.csv", "source": "ahrefs", "row_count": 78, "keywords_created": 23, "status": "completed", "created_at": "2026-06-01T10:45:00"}
    ]
  }
}
);
  Object.assign(MOCK, {
  "/api/integrations": {
    "items": [
      {
        "provider": "dataforseo",
        "name": "DataForSEO",
        "kind": "api",
        "scope": "global",
        "status": "connected"
      },
      {
        "provider": "gsc",
        "name": "Google Search Console",
        "kind": "oauth",
        "scope": "project",
        "note": "Needs a Google OAuth client + verified property. See BLOCKERS.md.",
        "status": "not connected"
      },
      {
        "provider": "ga4",
        "name": "Google Analytics 4",
        "kind": "oauth",
        "scope": "project",
        "note": "Needs Google OAuth + GA4 property id. See BLOCKERS.md.",
        "status": "not connected"
      },
      {
        "provider": "bwt",
        "name": "Bing Webmaster Tools",
        "kind": "key",
        "scope": "project",
        "note": "Needs a BWT API key + site. See BLOCKERS.md (BWT history is only ~6 months — connect early).",
        "status": "not connected"
      },
      {
        "provider": "ahrefs",
        "name": "Ahrefs API",
        "kind": "api",
        "scope": "global",
        "note": "Backlinks, Web Analytics, Rank Tracker, Site Audit. Set AHREFS_API_KEY in .env. (CSV import still available on the Imports page.)",
        "status": "not connected"
      }
    ]
  },
  "/api/integrations/dataforseo": {
    "provider": "dataforseo",
    "status": "connected",
    "configured": true,
    "secrets": {
      "DATAFORSEO_LOGIN": true,
      "DATAFORSEO_PASSWORD": true
    },
    "last_checked_at": "2026-06-10T08:45:32"
  },
  "/api/logs": {
    "items": [
      {
        "id": 5,
        "created_at": "2026-06-10T07:12:18",
        "level": "warning",
        "source": "api",
        "method": "POST",
        "path": "/api/p/demo-casino/rank/pull",
        "status_code": 429,
        "message": "DataForSEO rate limit; retrying in 5s",
        "project_id": 1
      },
      {
        "id": 4,
        "created_at": "2026-06-09T18:34:05",
        "level": "error",
        "source": "worker",
        "method": null,
        "path": "rank_cron",
        "status_code": null,
        "message": "Ahrefs API timeout on backlink fetch",
        "project_id": 1
      },
      {
        "id": 3,
        "created_at": "2026-06-09T15:22:10",
        "level": "warning",
        "source": "integration",
        "method": "GET",
        "path": "/api/integrations/dataforseo",
        "status_code": 200,
        "message": "DataForSEO validation took 3.2s; consider throttling",
        "project_id": null
      },
      {
        "id": 2,
        "created_at": "2026-06-08T10:05:47",
        "level": "error",
        "source": "api",
        "method": "POST",
        "path": "/api/p/demo-casino/imports",
        "status_code": 400,
        "message": "CSV import: missing 'position' column",
        "project_id": 1
      },
      {
        "id": 1,
        "created_at": "2026-06-07T09:18:33",
        "level": "warning",
        "source": "api",
        "method": "GET",
        "path": "/api/projects",
        "status_code": 200,
        "message": "Loaded 1 active project",
        "project_id": null
      }
    ],
    "total": 5
  },
  "/api/logs/{id}": {
    "id": 2,
    "created_at": "2026-06-08T10:05:47",
    "level": "error",
    "source": "api",
    "method": "POST",
    "path": "/api/p/demo-casino/imports",
    "status_code": 400,
    "message": "CSV import: missing 'position' column",
    "project_id": 1,
    "detail": "Traceback (most recent call last):\n  File \"app/routers/imports.py\", line 42, in upload_import\n    validate_columns(df, ['keyword', 'position', 'search_volume'])\nKeyError: 'position'\n\nThe CSV upload parser expected columns: keyword, position, search_volume, url, keyword_difficulty. Provided columns: keyword, url, search_volume.\n\nPlease re-format your CSV and try again."
  },
  "/api/settings": {
    "brand_name": "Demo Casino",
    "report_schedule": "tuesday_10am",
    "alert_channel": "telegram",
    "timezone": "Australia/Sydney"
  },
  "/api/p/{p}/settings": {
    "project_name": "Demo Casino",
    "primary_market": "AU",
    "locale": "en-au",
    "rank_refresh_frequency": "daily",
    "backlink_sync_enabled": "true",
    "content_qa_threshold": "0.75"
  },
  "/api/p/{p}/alerts": {
    "rules": {
      "top_threshold": 10,
      "big_drop": 5,
      "enter_top": true,
      "exit_top": true,
      "big_drop_enabled": true
    },
    "preview": [
      {
        "keyword": "best online pokies au",
        "kind": "entered_top",
        "prev": 12,
        "now": 9
      },
      {
        "keyword": "australian online casinos",
        "kind": "big_drop",
        "prev": 5,
        "now": 18
      },
      {
        "keyword": "blackjack strategy",
        "kind": "dropped_out_top",
        "prev": 10,
        "now": 15
      }
    ],
    "matching": 3
  },
  "/api/p/{p}/connections": {
    "items": [
      {
        "id": 1,
        "name": "Demo Casino Main Site",
        "site_url": "https://demo-casino.example",
        "cms": "wordpress",
        "status": "active",
        "last_seen_at": "2026-06-10T08:42:15",
        "created_at": "2026-06-01T14:20:00",
        "paired": true
      },
      {
        "id": 2,
        "name": "Demo Casino Blog",
        "site_url": "https://blog.demo-casino.example",
        "cms": "wordpress",
        "status": "active",
        "last_seen_at": "2026-06-10T07:15:30",
        "created_at": "2026-06-02T09:45:00",
        "paired": true
      },
      {
        "id": 3,
        "name": "Staging Environment",
        "site_url": null,
        "cms": null,
        "status": "active",
        "last_seen_at": null,
        "created_at": "2026-06-05T11:30:00",
        "paired": false
      }
    ]
  }
});
  // --- supplemental: POST responses the UI reads + safe fallbacks ---
  Object.assign(MOCK, {
    "/api/p/{p}/decisions/{id}/verdict": { ok: true, disagreement: false, discussion_opened: false, model_yes: true,
      decision: { id: 1, status: "approved", human: { yes: true } } },
    "/api/p/{p}/decisions/{id}/apply": { ok: true, job_id: 8841, status: "pending", decision_status: "actuating" },
    "/api/p/{p}/decisions/{id}/rollback": { ok: true, rollback_job_id: 8842 },
    "/api/p/{p}/decisions/{id}/suggest-edit": { edit_kind: "update_meta", url: "https://demo-casino.example/pokies-guide",
      change: { title: "Best Online Pokies in Australia (2026 Guide)", meta: "Compare top AU pokies sites, RTP, bonuses + how to play responsibly. Updated for 2026." },
      current: { title: "Pokies", meta: null } },
    "/api/p/{p}/decisions/{id}/discuss": { ok: true, added: [{ role: "user", message: "our DR is only 18" }, { role: "system", message: "Fair — at DR 18 this is a stretch; I've down-weighted it for similar calls." }] },
    "/api/p/{p}/decisions/autonomy/promote": { ok: true, level: 2, scope: "onpage", reason: "demoted/staged" },
    "/api/p/{p}/decisions/autonomy/kill-switch": { ok: true, kill_switch: true },
    "/api/p/{p}/decisions/gap/competitors": { ok: true, minted: 4, competitors_checked: 2, cost: 0.021 },
    "/api/p/{p}/decisions/freshness/bonuses": { ok: true, minted: 3 },
    "/api/p/{p}/conversions/postback-token": { ok: true, postback_token: "demo-token-xxxx", postback_url: "/api/conv/demo-token-xxxx" }
  });

  function norm(path) {
    return path.replace(/\/api\/p\/[^/]+\//, '/api/p/{p}/').replace(/\/\d+(?=\/|$)/g, '/{id}');
  }
  var real = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init) {
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    var u = url.split('?')[0];
    var idx = u.indexOf('/api/');
    if (idx > -1) {
      var key = norm(u.slice(idx));
      var method = (init && init.method) || 'GET';
      var body = MOCK[key];
      if (body === undefined) body = (method === 'GET') ? {} : { ok: true };
      return Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return real ? real(input, init) : Promise.reject(new Error('no real fetch'));
  };
  try { console.log('[mock] seobot demo backend active — ' + Object.keys(MOCK).length + ' endpoints'); } catch (e) {}
})();
