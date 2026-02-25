# Restaurant OS Starter Template - Business Plan

**Status**: In Development (Phase 1 Step 1 in progress)
**Updated**: 2025-11-28
**Project**: `/home/amk/projects/restaurant-os-starter-template`

---

## Executive Summary

### The Opportunity

**Problem**: Building custom restaurant websites takes 1-2 weeks per brand, blocking rapid scaling and SEO growth strategies.

**Solution**: Pre-built Next.js starter template that enables 3-hour restaurant website launches with production-ready pages (blog, menu, events, ordering).

**Impact**: Scale from 2 restaurant brands to 12 brands in 1 month, achieving 6x traffic growth (20K → 120K monthly visits) through ghost kitchen SEO strategy.

### Key Metrics

| Metric            | Current    | With Starter Kit | Growth        |
| ----------------- | ---------- | ---------------- | ------------- |
| Restaurant brands | 2          | 12               | 6x            |
| Blog posts/month  | 20         | 120              | 6x            |
| Monthly traffic   | 20K visits | 120K visits      | 6x            |
| Launch time/brand | 1-2 weeks  | 3 hours          | 95% faster    |
| Setup cost/brand  | 80 hours   | 3 hours          | 96% reduction |

---

## Business Model

### Ghost Kitchen Strategy

**Concept**: Launch multiple delivery-only restaurant brands targeting different cuisines and keywords for SEO dominance.

**Economics per Ghost Kitchen**:

- **Setup**: 3 hours (one-time)
- **Content creation**: 2 hours/month (10 blog posts via AI wizard)
- **Hosting**: $0 (Vercel hobby plan)
- **Total first month**: 5 hours
- **Ongoing**: 2 hours/month

**Revenue Model**:

- SEO traffic → Order conversions (Uber Eats, Lieferando, Wolt)
- 10 ghost kitchens × 10 blog posts = 100 posts/month
- Estimated: 120K monthly visits → 1-2% conversion = 1,200-2,400 orders/month
- Average order: €25 → €30,000-€60,000 monthly GMV

### Target Customers

1. **Ghost Kitchens** (Primary)
   - Delivery-only virtual brands
   - Need fast time-to-market
   - Focus on SEO, not custom design
   - Example: 10 cuisine-specific brands in Bonn

2. **New Restaurants**
   - Recently opened, need web presence
   - Limited budget, tight timeline
   - Standard design acceptable

3. **Franchises**
   - 10+ locations needing separate websites
   - Brand consistency important
   - Faster than building 10 custom sites

4. **Restaurant Groups**
   - Multiple concepts under one company
   - Centralized content management (Restaurant OS)
   - Fast rollout for new concepts

---

## Technical Architecture

### Three-Tier Stack

```
Backend (Restaurant OS) → SDK (Data Layer) → Frontend (Starter Kit OR Custom)
```

**Backend**: Restaurant OS

- Centralized CMS for all content
- Multi-tenant (restaurant_id filtering)
- REST API endpoints
- Admin dashboard

**SDK**: `@restaurant-os/sdk` (REQUIRED)

- TypeScript client for API calls
- Type-safe data fetching
- Revalidation and caching
- Used by ALL restaurants

**Frontend**: Two Options

1. **Starter Kit** (OPTIONAL) - Pre-built UI, 3-hour launches
2. **Custom UI** - Full design control, 1-2 week builds

### Starter Kit Technical Specs

**Framework**: Next.js 16 with App Router
**Styling**: Tailwind CSS 4 + shadcn/ui
**Internationalization**: German/English (next-intl)
**SEO**: Meta tags, JSON-LD, sitemap, og:image
**Performance**: ISR (60s revalidation), < 2s load times
**Deployment**: Vercel (automatic from git)

**Included Pages**:

- Blog listing + detail pages (SEO-optimized)
- Menu pages (4 sections: Hauptspeisekarte, Getränkekarte, Mittagskarte, Saisonkarte)
- Events calendar
- Order page (delivery platform links)

**Customization**:

- Restaurant ID (env var)
- Theme colors (env var)
- Logo (replace file)
- Branding (configurable)

---

## Implementation Plan

### Phase 1: Extract to Starter Template (Week 1-2)

**Status**: 🔄 IN PROGRESS (Step 1 started)

**Source**: Em Höttche restaurant website (fully built, production-ready)

**Steps**:

1. **Create Repository Structure** (Day 1) - 🔄 IN PROGRESS
   - ✅ Create Next.js app
   - ✅ Set up directory structure
   - ⏳ Copy blog pages from Em Höttche
   - ⏳ Copy menu pages (rename speisekarte → menu)
   - ⏳ Copy events page (rename veranstaltungen → events)
   - ⏳ Copy components (blog, UI, SEO)

2. **Make Restaurant ID Configurable** (Day 2)
   - Create `config/restaurant.ts`
   - Parameterize SDK client
   - Create `.env.example`

3. **Make Theme Configurable** (Day 3)
   - Extract Tailwind config
   - Add theme token environment variables
   - Document customization

4. **Remove Em Höttche Branding** (Day 4)
   - Genericize header/footer
   - Parameterize metadata
   - Remove hardcoded restaurant info

5. **Create Order Page** (Day 5)
   - Build delivery platform links page
   - Make platform URLs configurable
   - Add order CTAs

6. **Write Documentation** (Day 6-7)
   - README with quick start
   - CUSTOMIZATION guide
   - Deployment instructions

### Phase 2: Test with Ghost Kitchen #1 (Week 3)

**Goal**: Validate template works for real ghost kitchen launch

**Steps**:

1. Choose cuisine (e.g., Italian)
2. Clone template
3. Configure in 3 hours
4. Deploy to Vercel
5. Generate 10 blog posts via wizard
6. Measure results (time, quality, SEO)

**Success Criteria**:

- Launch time < 3 hours
- Lighthouse score 90+
- No Em Höttche branding visible
- Blog posts indexed by Google

### Phase 3: Scale to 10 Ghost Kitchens (Week 4)

**Goal**: Launch 9 more ghost kitchen brands

**Cuisines**:

1. ✅ Italian (Week 3)
2. Asian Fusion
3. Mexican
4. Burger & BBQ
5. Vegan/Health
6. Sushi
7. Indian
8. Mediterranean
9. Breakfast/Brunch
10. Bakery/Desserts

**Process per Brand** (2 hours):

- Clone template (5 min)
- Configure `.env.local` (10 min)
- Replace logo (10 min)
- Deploy (5 min)
- Generate 10 blog posts (1 hour)
- Verify (30 min)

**Timeline**: 9 brands × 2 hours = 18 hours = 2-3 work days

### Phase 4: Measure & Optimize (Month 2+)

**Metrics to Track**:

- Organic traffic per brand
- Conversion rate (visits → orders)
- Blog post ranking (top 10 positions)
- Time to first order per brand
- Customer acquisition cost

**Optimization**:

- Kill underperforming brands
- Double down on winners
- A/B test blog topics
- Improve SEO (local keywords, schema markup)

---

## Competitive Advantage

### Why This Wins

1. **Speed**: 3 hours vs 1-2 weeks (95% faster)
2. **Cost**: 3 hours vs 80 hours (96% cheaper)
3. **Quality**: Production-tested (Em Höttche proven design)
4. **SEO**: Optimized from day 1 (meta tags, structured data, sitemap)
5. **Centralized**: One CMS for all brands (easier to manage)

### vs. Alternatives

| Solution          | Launch Time | Cost          | SEO Quality | Customization |
| ----------------- | ----------- | ------------- | ----------- | ------------- |
| **Starter Kit**   | 3 hours     | $0            | Excellent   | Theme only    |
| Custom build      | 1-2 weeks   | $2,000-$4,000 | Variable    | Full          |
| Wix/Squarespace   | 1 day       | $20/mo        | Poor        | Limited       |
| WordPress + theme | 2-3 days    | $100-$500     | Good        | Medium        |
| No-code builder   | 1-2 days    | $50/mo        | Poor        | Limited       |

---

## Financial Projections

### Year 1 (10 Ghost Kitchens)

**Revenue** (Conservative):

- 10 brands × 10K visits/month = 100K visits/month
- 1% conversion = 1,000 orders/month
- €25 average order = €25,000 GMV/month
- 15% commission (Uber Eats) = €3,750/month
- **Annual**: €45,000

**Revenue** (Optimistic):

- 10 brands × 12K visits/month = 120K visits/month
- 2% conversion = 2,400 orders/month
- €30 average order = €72,000 GMV/month
- 20% direct orders (no commission) = €14,400/month direct + €11,520 commission
- **Annual**: €311,040

**Costs**:

- Setup (10 brands × 3 hours × €50/hour): €1,500 (one-time)
- Content (10 brands × 2 hours/month × €50/hour × 12 months): €12,000
- Hosting: €0 (Vercel hobby plan)
- Total Year 1: €13,500

**Profit**:

- Conservative: €45,000 - €13,500 = €31,500 (233% ROI)
- Optimistic: €311,040 - €13,500 = €297,540 (2,204% ROI)

### Year 2 Scaling (50 Ghost Kitchens)

**Strategy**: Expand to 5 cities × 10 cuisines = 50 brands

**Revenue** (Conservative):

- 50 brands × 8K visits/month = 400K visits/month
- 1% conversion = 4,000 orders/month
- €25 average = €100,000 GMV/month
- **Annual**: €1,200,000 GMV → €180,000 commission revenue

**Costs**:

- Setup (40 new brands × 3 hours × €50): €6,000
- Content (50 brands × 2 hours/month × €50 × 12): €60,000
- Hosting (Vercel Pro): €240/year
- Total: €66,240

**Profit**: €180,000 - €66,240 = €113,760

---

## Risk Analysis

### Technical Risks

**Risk**: Template doesn't fit all use cases
**Mitigation**: Offer custom UI path for unique needs

**Risk**: Breaking changes in SDK affect all templates
**Mitigation**: Version pinning, careful SDK updates, testing

**Risk**: SEO algorithm changes hurt traffic
**Mitigation**: Diversify content, multiple brands, quality focus

### Business Risks

**Risk**: Ghost kitchens don't convert
**Mitigation**: Fail fast strategy, kill underperformers, scale winners

**Risk**: Platform commission fees too high
**Mitigation**: Drive direct orders (20% target), negotiate rates

**Risk**: Content creation bottleneck
**Mitigation**: AI wizard for blog posts (already built)

### Market Risks

**Risk**: Delivery market saturation
**Mitigation**: Focus on underserved cuisines, niche keywords

**Risk**: Competition from established brands
**Mitigation**: Long-tail SEO, local targeting, unique positioning

---

## Success Metrics

### Technical KPIs

- [ ] Template builds without errors
- [ ] Lighthouse score: 90+ (all categories)
- [ ] Load time: < 2 seconds
- [ ] Mobile responsive (all breakpoints)
- [ ] SEO: 100% metadata coverage

### Business KPIs

- [ ] Ghost Kitchen #1: < 3 hour launch
- [ ] 10 ghost kitchens live by Month 2
- [ ] 100 blog posts/month by Month 2
- [ ] 6x traffic growth (20K → 120K visits/month)
- [ ] Positive ROI by Month 3

### User Experience KPIs

- [ ] Setup documentation: < 5 min read
- [ ] Zero Em Höttche branding leaks
- [ ] Theme customization: < 30 min
- [ ] Deploy success rate: 100%

---

## Timeline Summary

| Phase                          | Duration | Deliverable              | Status      |
| ------------------------------ | -------- | ------------------------ | ----------- |
| Phase 1: Template Extraction   | Week 1-2 | Starter template repo    | 🔄 Step 1/6 |
| Phase 2: Test Ghost Kitchen #1 | Week 3   | First ghost kitchen live | ⏳ Pending  |
| Phase 3: Scale to 10 Brands    | Week 4   | 10 ghost kitchens live   | ⏳ Pending  |
| Phase 4: Optimize & Grow       | Month 2+ | 6x traffic achieved      | ⏳ Pending  |

**Current Status**: Phase 1 Step 1 in progress (repository created, file extraction next)

---

## Key Files & Locations

### Current Implementation

- **Starter Template Repo**: `/home/amk/projects/restaurant-os-starter-template` (in progress)
- **Source (Em Höttche)**: `/home/amk/projects/em-hoettche-restaurant-standalone`
- **Backend (Restaurant OS)**: `/home/amk/projects/restaurant-os`
- **SDK**: `/home/amk/projects/restaurant-os-sdk`

### Documentation

- **Implementation Plan**: `/home/amk/.claude/plans/happy-wiggling-wreath.md`
- **ADR**: `/home/amk/projects/restaurant-os/.claude/decisions/004-starter-kit-strategy.md`
- **SDK Usage**: `/home/amk/projects/restaurant-os-sdk/.claude/USAGE.md`
- **Task Tracking**: `/home/amk/projects/restaurant-os/.claude/NEXT.md`

---

## Next Actions

**Immediate** (Day 1-2):

1. Complete Phase 1 Step 1: Copy files from Em Höttche
2. Install dependencies (SDK, next-intl, shadcn/ui)
3. Verify pages load correctly

**Short-term** (Week 1-2):

1. Complete Steps 2-6 (configuration, branding, docs)
2. Test build process
3. Deploy to Vercel

**Medium-term** (Week 3-4):

1. Launch Ghost Kitchen #1
2. Validate 3-hour launch time
3. Scale to 10 brands

**Long-term** (Month 2+):

1. Measure traffic growth
2. Optimize conversion rates
3. Expand to new cities

---

**Priority**: HIGH - Core growth strategy for 6x traffic expansion

**Owner**: AMK
**Tech Stack**: Next.js 16, Tailwind 4, Supabase, Vercel
**Investment**: ~80 hours development, €0 initial capital
**Expected ROI**: 200%+ in Year 1

---

Last updated: 2025-11-28
