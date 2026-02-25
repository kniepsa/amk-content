# Scalable Front Office Platform Strategy

**Created**: 2025-11-28
**Status**: Planning phase complete, ready for implementation

## Vision

Build a **scalable platform product** (CMS + Growth Engine + AI Content) that:

1. **Validates** with own brands (restaurants, Printulu, invoice-splitter)
2. **Proves revenue** with paying clients (Handwerker, Statiker)
3. **Scales** to many external customers in German local business market

**Target Market**: German local businesses (Handwerker, restaurants, professional services)
**Business Model**: Platform SaaS (pricing TBD: one-time, monthly, or hybrid)
**Scale Target**: 50-100 customers in 12 months

## Platform Customers

| Customer              | Type             | Role                   | Timeline |
| --------------------- | ---------------- | ---------------------- | -------- |
| **Handwerker Client** | Service business | First paying customer  | Week 1-2 |
| **Statiker Client**   | Service business | Second paying customer | Week 3   |
| Salvator              | Restaurant       | Validation (own)       | Active   |
| Em Höttche            | Restaurant       | Validation (own)       | Active   |
| Printulu              | E-commerce       | Validation (own)       | Parallel |
| Future customers      | Various          | Scale target           | Month 2+ |

**Architecture**: Multi-tenant platform with separate frontend repos per customer.

---

## Competitive Advantage

Based on deep market research:

| Competitor        | Size                   | Gap We Fill                    |
| ----------------- | ---------------------- | ------------------------------ |
| DISH Metro        | $15-29M, 182 employees | No AI content, restaurant-only |
| Jimdo             | €65M, 250 employees    | Generic, no vertical focus     |
| Goldfein/MEISTER1 | Small agencies         | Manual work, no platform       |
| Wix/GoHighLevel   | $83M-$1.7B             | Not German-focused, complex    |

**Our edge**: AI content generation + German market focus + multi-vertical platform

---

## Phase 1: Client Delivery (Weeks 1-3)

### Week 1-2: Handwerker Website

**Required Features:**

1. **Lead Capture System** (NEW)
   - Database: `leads` table with contact form data
   - API: `POST /api/public/leads` endpoint
   - Admin: Lead management dashboard
   - Notifications: Email on new lead (optional Phase 1)

2. **Portfolio/Gallery System** (NEW)
   - Database: `portfolio_items` table
   - API: `GET /api/public/portfolio` endpoint
   - Admin: Portfolio management with image upload
   - Frontend: Gallery component with lightbox

3. **Services Display** (Reuse `menu_items` as `services`)
   - Map existing `menu_categories` → service categories
   - Map `menu_items` → individual services
   - Pricing optional (some Handwerker prefer "Auf Anfrage")

4. **Business Info Pages**
   - About/Team page
   - Contact page with map
   - Impressum/Datenschutz (German legal requirements)

5. **AI Content Generation** (Existing)
   - Adapt questionnaire for Handwerker context
   - Generate service descriptions, about page, blog posts

**Database Schema Changes:**

```sql
-- New leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id), -- rename conceptually to business_id
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact_form',
  status TEXT DEFAULT 'new', -- new, contacted, converted, closed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- New portfolio table
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  project_date DATE,
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS policies (same pattern as existing)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
```

**API Endpoints:**

```
POST /api/public/leads              -- Submit contact form
GET  /api/public/portfolio          -- Get portfolio items
GET  /api/public/portfolio/featured -- Get featured projects
```

**Frontend Repo Structure:**

```
handwerker-client/
├── app/
│   ├── page.tsx                    # Homepage with hero + services
│   ├── leistungen/page.tsx         # Services listing
│   ├── projekte/page.tsx           # Portfolio gallery
│   ├── ueber-uns/page.tsx          # About/team
│   ├── kontakt/page.tsx            # Contact form + map
│   ├── impressum/page.tsx          # Legal
│   └── datenschutz/page.tsx        # Privacy
├── components/
│   ├── ContactForm.tsx             # Lead capture
│   ├── PortfolioGallery.tsx        # Project showcase
│   ├── ServiceCard.tsx             # Individual service
│   └── Header/Footer.tsx           # Navigation
└── lib/
    └── api.ts                      # Restaurant OS API client
```

### Week 3: Statiker Website

**Reuse from Handwerker:**

- Same architecture, different branding
- Portfolio system for structural engineering projects
- Lead capture for quote requests
- Services adapted for Statiker context

**Statiker-specific:**

- Project case studies (extended portfolio)
- Certifications/qualifications section
- Technical service descriptions

---

## Phase 2: Printulu Integration (Parallel)

**Scope clarified:**

- Keep Vendure for e-commerce shop
- Migrate blog to Restaurant OS CMS
- Potential Vendure SDK integration for unified admin

**Implementation Approach:**

1. **Blog Migration**
   - Import existing blog posts to `blog_posts` table
   - Set up new frontend fetching from Restaurant OS API
   - AI generation for new content

2. **Vendure SDK Integration** (Future)
   - Research Vendure SDK capabilities
   - Evaluate embedding Vendure admin in platform
   - vs. keeping separate Vendure admin

3. **Print-Specific Features**
   - Product category pages (non-shop content)
   - Design guides/resources
   - Customer showcase gallery (reuse portfolio system)

---

## Phase 3: Platform Generalization

### Tenant Type System

Add `business_type` to restaurants table:

```sql
ALTER TABLE restaurants ADD COLUMN business_type TEXT DEFAULT 'restaurant';
-- Values: 'restaurant', 'handwerker', 'statiker', 'ecommerce', 'saas'
```

**Type-specific features:**

| Feature       | Restaurant | Handwerker  | Statiker    | E-commerce    | SaaS |
| ------------- | ---------- | ----------- | ----------- | ------------- | ---- |
| Menu/Services | ✅ Menu    | ✅ Services | ✅ Services | ✅ Categories | ❌   |
| Events        | ✅         | ❌          | ❌          | ❌            | ❌   |
| Portfolio     | ❌         | ✅          | ✅          | ✅ Showcase   | ❌   |
| Leads         | ❌         | ✅          | ✅          | ❌            | ✅   |
| Blog          | ✅         | ✅          | ✅          | ✅            | ✅   |
| Reservations  | ✅         | ❌          | ❌          | ❌            | ❌   |
| Pricing       | ✅         | Optional    | ❌          | Vendure       | ❌   |

### Admin UI Adaptation

Conditionally render admin sections based on `business_type`:

- Hide "Events" for non-restaurants
- Show "Portfolio" for service businesses
- Show "Leads" for lead-gen businesses

---

## Implementation Order

```
Week 1-2 (Handwerker Priority):
├── Day 1: Create leads table + API endpoint
├── Day 2: Create portfolio table + API endpoint
├── Day 3: Admin UI for leads management
├── Day 4: Admin UI for portfolio management
├── Day 5: Handwerker frontend repo setup
├── Day 6-7: Frontend development
├── Day 8-9: Content generation + polish
└── Day 10: Deploy + handoff

Week 3 (Statiker + Printulu Parallel):
├── Statiker: Clone Handwerker frontend, rebrand
├── Printulu: Begin blog migration
└── Platform: Add business_type column

Week 4+:
├── Printulu blog fully migrated
├── Invoice-splitter landing page
└── Platform naming + branding
```

---

## Technical Decisions

### Confirmed:

- ✅ Separate frontend repos per brand (not multi-tenant frontend)
- ✅ Shared backend API (Restaurant OS)
- ✅ Keep Vendure for Printulu e-commerce
- ✅ Multi-tenant via existing `restaurant_id` pattern
- ✅ AI content generation as differentiator

### To Decide:

- Platform new name (user has ideas)
- Vendure SDK integration depth
- Pricing model for external clients (one-time vs. monthly vs. hybrid)

---

## Files to Modify

### Backend (Restaurant OS):

1. **New Files:**
   - `app/api/public/leads/route.ts` - Lead submission endpoint
   - `app/api/admin/leads/route.ts` - Lead management
   - `app/api/public/portfolio/route.ts` - Portfolio endpoint
   - `app/api/admin/portfolio/route.ts` - Portfolio management
   - `components/admin/leads-table.tsx` - Lead management UI
   - `components/admin/portfolio-manager.tsx` - Portfolio UI

2. **Migrations:**
   - `supabase/migrations/YYYYMMDD_add_leads_table.sql`
   - `supabase/migrations/YYYYMMDD_add_portfolio_table.sql`
   - `supabase/migrations/YYYYMMDD_add_business_type.sql`

3. **Modify:**
   - `app/(admin)/layout.tsx` - Conditional nav based on business_type
   - `lib/services/` - New leads and portfolio services
   - `types/database.ts` - Add new table types

### Frontend (New Repos):

1. **handwerker-template/** - Template repo for service businesses
2. **printulu-blog/** - Migrated blog frontend

---

## Success Metrics

| Metric                 | Target                |
| ---------------------- | --------------------- |
| Handwerker site live   | Week 2 end            |
| Statiker site live     | Week 3 end            |
| Leads captured         | Tracking from day 1   |
| Printulu blog migrated | Week 4                |
| Client satisfaction    | Invoice paid promptly |

---

## Risk Mitigation

| Risk                  | Mitigation                                           |
| --------------------- | ---------------------------------------------------- |
| 2-week deadline tight | Start with minimal viable features, add polish later |
| Scope creep           | Fixed feature list, defer nice-to-haves              |
| Client changes mind   | Get sign-off on design before coding                 |
| Technical debt        | Document shortcuts, plan cleanup sprint              |

---

## Platform Scaling Considerations

### What Must Be Platform-Ready From Day 1:

1. **Self-service onboarding** (future)
   - Currently: Manual tenant creation
   - Future: Signup flow, Stripe billing, auto-provisioning

2. **Template system**
   - Handwerker frontend becomes first "template"
   - Templates are reusable starting points, not copy-paste

3. **White-label ready**
   - No "Restaurant OS" branding in customer frontends
   - Admin panel can be white-labeled later

4. **Multi-tenant isolation**
   - Already have `restaurant_id` filtering (rename conceptually to `tenant_id`)
   - RLS policies ensure data separation
   - Each customer gets own frontend deployment

5. **Scalable AI content**
   - Questionnaire system already multi-tenant
   - AI costs tracked per tenant (future billing)

### Platform Growth Path:

```
Phase 1: Manual (Now)
├── You create tenant in DB
├── You deploy frontend
├── You onboard customer manually
└── Invoice via bank transfer

Phase 2: Semi-automated (Month 2-3)
├── Admin UI to create tenants
├── Template cloning script
├── Customer self-edits via admin panel
└── Stripe for recurring billing

Phase 3: Self-service (Month 4+)
├── Customer signup flow
├── Auto-provisioning pipeline
├── Template marketplace
└── Usage-based AI billing
```

### Pricing Strategy Research:

| Model       | Competitors Using                  | Pros              | Cons          |
| ----------- | ---------------------------------- | ----------------- | ------------- |
| One-time    | Agencies (€2-5k)                   | Cash upfront      | No recurring  |
| Monthly     | Duda ($199/5 sites), GHL ($97-297) | Recurring revenue | Slower cash   |
| Hybrid      | Some agencies                      | Best of both      | Complex       |
| Usage-based | AI platforms                       | Scales with value | Unpredictable |

**Recommendation for 50-100 customers/year**:

- Hybrid pricing: €500-1500 setup + €99-199/month
- At 75 customers avg: €75k setup + €150k ARR = €225k year 1
- Requires semi-automated onboarding by Month 3
- Full self-service not needed until 100+ customers

### 12-Month Roadmap to 50-100 Customers:

```
Month 1-2: Foundation (5 customers)
├── First 2 paying clients (Handwerker, Statiker)
├── Leads + Portfolio features complete
├── Template system proven
└── Own brands migrated (validation)

Month 3-4: Automation (15 customers)
├── Admin UI for tenant creation
├── Stripe recurring billing
├── Customer can self-edit content
└── Referral program launched

Month 5-8: Growth (40 customers)
├── Marketing site live
├── Case studies from early customers
├── SEO for "Handwerker Website" keywords
├── Outbound to local business networks
└── AI content as main differentiator

Month 9-12: Scale (75-100 customers)
├── Self-service signup (optional)
├── Additional templates (Statiker, Restaurant, etc.)
├── Customer success processes
└── Consider hiring first employee
```

### Unit Economics Target:

| Metric          | Target                               |
| --------------- | ------------------------------------ |
| CAC             | <€500 (content marketing, referrals) |
| Setup fee       | €500-1500                            |
| Monthly         | €99-199                              |
| LTV (24 months) | €2,900-6,300                         |
| LTV:CAC         | 6-12x                                |
| Churn           | <5% monthly                          |

---

## Completed (From Previous Session)

- ✅ 10x Traffic Scaling Phase 0+1 (caching, security, health check)
- ✅ Questionnaire fixes (7 commits)
- ✅ Competitive research completed
- ✅ Architecture decisions made
