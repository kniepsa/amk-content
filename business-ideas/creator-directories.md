# Creator Directories — Mass-Customized Influencer Editions

**Date:** 2026-02-26
**Status:** Idea
**Origin:** YouTube video "Claude Code built me a $273/Day Online Directory" + session brainstorm

---

## Core Idea

Build mass-customized directory editions for influencers/creators. Each creator gets their own branded directory pre-populated with content from their niche — promoted once to their audience, runs on SEO autopilot.

```
Influencer Audience + Trusted Brand
        ↓
Branded Directory ("Ali Abdaal's Productivity Stack")
        ↓
Day 1: Traffic from launch
Month 3+: SEO compounds
        ↓
Revenue split: Creator + Builder (you)
```

---

## Why This Works

**Solves the #1 Directory Problem: Distribution**
Normal directories wait 6+ months for SEO. Influencer launch = traffic on day 1.

**Trust multiplier**
"Ali recommends these tools" converts 10x better than anonymous directory.

**Already have the tech**
Multi-tenant Astro monorepo (`/directories`) supports new tenant per creator in ~1 day.

**Mass-customization**
Static generation → unique domain, branding, content per creator — same codebase.

---

## Target Creator Types

| Creator Type         | Directory Idea              | Monetization                 |
| -------------------- | --------------------------- | ---------------------------- |
| Tech YouTuber        | "Best Dev Tools 2026"       | Affiliate (high commissions) |
| Finance Creator      | "Broker & App Vergleich"    | Lead Gen (high ticket)       |
| Marketing Influencer | "Agency Directory"          | Featured Listings €299/Mo    |
| Fitness Creator      | "Supplement Brands"         | Affiliate + Sponsored        |
| Local Creator        | "Beste Restaurants [Stadt]" | Lead Gen + Reservierung      |

---

## Value Proposition

**Creator gets:**

- Own branded directory (their domain, their colors)
- Pre-populated with tools/resources they already recommend
- SEO on autopilot (1,000+ pages from day 1)
- Revenue share on all leads/clicks
- Zero tech effort required

**You get:**

- Traffic from day 1 (no SEO cold-start problem)
- Trusted brand on the directory
- Revenue share
- Natural backlink from creator's website

---

## Key Insight

The creator brings distribution. Crawl4AI handles data enrichment. The monorepo handles multi-tenancy. Together: any niche directory can be built and launched in 4 days (proven by Frey's portapotty example for $250).

---

## Technical Fit

- **Existing codebase:** `/directories` monorepo (Astro 5 + Turborepo)
- **New tenant:** Add `apps/[creator-slug]/` + `tenant.config.ts`
- **Data pipeline:** Crawl4AI enriches niche data → import to content collection
- **Deploy:** Vercel per tenant, custom domain

---

## Open Questions

- [ ] Revenue split model (50/50? 70/30?)
- [ ] How to handle creator content updates (they want to add/remove tools)?
- [ ] Minimum audience size worth targeting?
- [ ] White-label vs. powered-by-branding?
- [ ] One-time setup fee or rev-share only?

---

## Next Steps (wenn weiterverfolgt)

1. 1-2 Creator-Direktkontakte testen (DM auf Twitter/LinkedIn)
2. Demo-Directory für einen Creator bauen (ungefragt, als Proof)
3. Pitch: "Ich hab dir dein Directory gebaut — willst du es haben?"
