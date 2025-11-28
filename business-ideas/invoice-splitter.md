# Invoice Splitter: Business Documentation

**Last Updated:** 2025-11-28
**Status:** Production-Ready (P0 Complete, P1/P2 Pending)
**Project Location:** `/home/amk/projects/HG-WE10/invoice-splitter`

---

## Executive Summary

Invoice Splitter is a specialized web application that solves a critical pain point for German property owners: accurately splitting renovation and maintenance costs across multiple rental units while maintaining compliance with the **15-Regel** (§ 6 Abs. 1 Nr. 1a EStG) tax law.

**The Core Problem:** Property owners with multiple rental units struggle to:
- Track and categorize hundreds of invoices manually
- Split costs accurately across units (by square meter, custom ratios, or property-specific)
- Stay compliant with complex German tax laws (particularly the 15-Regel)
- Generate professional reports for accountants and tax authorities

**The Solution:** An intelligent, local-processing web app that:
- OCR-processes PDF invoices automatically
- AI-analyzes invoice content (supplier, amount, category, line items)
- Enables flexible cost splitting across 5 rental units
- Tracks 15-Regel compliance automatically
- Generates audit-ready reports for accountants and Finanzamt

**Market Position:** Niche B2C SaaS for German property owners (Vermieter) managing 2-10 rental units who need professional-grade accounting tools without hiring a full-time bookkeeper.

---

## Business Problem

### The Pain Point (First Principles)

German property owners face a unique combination of challenges:

1. **Volume Overload**: Rental properties generate 50-200+ invoices per year
   - Heating, repairs, insurance, utilities, property management
   - Each invoice may apply to multiple units
   - Manual tracking in Excel is error-prone and time-consuming

2. **Complex Tax Compliance**: The 15-Regel Law (§ 6 Abs. 1 Nr. 1a EStG)
   - **Critical Rule**: If renovation costs exceed 15% of property value within 3 years of purchase, they're classified as "Anschaffungsnahe Herstellungskosten" (acquisition-related production costs)
   - **Tax Impact**: Costs must be depreciated over 40-50 years instead of being immediately deductible
   - **Penalty**: Misclassification can result in tax penalties and back-payments
   - **Complexity**: Determining what counts as "renovation" vs "maintenance" requires expertise

3. **Cost Allocation Complexity**: Different units, different sizes, different rules
   - Some costs split by square meter (heating, cleaning)
   - Others by custom ratios (shared repairs)
   - Some specific to individual units (appliance repairs)
   - Errors = tenant disputes or tax audit issues

4. **Accountant Communication Gap**
   - Accountants need structured data (categories, amounts, dates, splits)
   - Property owners provide messy PDFs and Excel files
   - Back-and-forth wastes time and costs money (accountant billable hours)

5. **Tax Authority Documentation**
   - Finanzamt requires detailed, itemized reports
   - Must prove 15-Regel compliance
   - Reports must be audit-ready with clear calculations

### Current Alternatives (and Why They Fail)

| Solution | Limitations |
|----------|-------------|
| **Excel Spreadsheets** | Manual data entry, no OCR, no 15-Regel tracking, error-prone calculations |
| **Generic Accounting Software (Lexoffice, DATEV)** | Overkill for property owners, no 15-Regel support, expensive, complex |
| **Property Management Software** | Focuses on rent collection, not detailed expense tracking |
| **Hire a Bookkeeper** | €500-2000/month, still requires organized invoice submission |
| **Do Nothing** | Risk tax penalties, overpay taxes, or face audit issues |

**Gap in Market:** No affordable, specialized tool for property owners managing 2-10 units that handles:
- Automated invoice processing
- 15-Regel compliance tracking
- Flexible cost splitting
- Professional accountant-ready reports

---

## Solution Overview

### What Invoice Splitter Does

Invoice Splitter is a **local-processing web application** (Next.js) that automates the entire invoice-to-report workflow:

```
PDF Upload → OCR → AI Analysis → Supplier Matching → Cost Splitting → 15-Regel Tracking → Reports
```

**Key Innovation:** Combines OCR, AI analysis, and German tax law expertise into a single, user-friendly interface.

### Core Value Proposition

**For Property Owners:**
- Save 10-15 hours per month on invoice processing
- Stay 15-Regel compliant automatically (avoid tax penalties)
- Generate professional reports for accountant in minutes
- Reduce accountant billable hours (save €200-500/year)

**For Accountants:**
- Receive structured, categorized data instead of messy PDFs
- Verify 15-Regel compliance instantly
- Reduce data entry time by 80%
- Trust in accurate cost allocations

**Unique Selling Points:**
1. **15-Regel Compliance Built-In**: Only tool that tracks this automatically
2. **Flexible Cost Splitting**: By sqm, custom ratios, or property-specific
3. **Local Processing**: No data sent to external servers (privacy)
4. **AI-Powered OCR**: Learns from corrections to improve accuracy
5. **Accountant-Ready Reports**: Professional formatting for Finanzamt

---

## Target Market

### Primary Customer Persona: "Der Vermieter"

**Demographics:**
- Age: 35-65
- Location: Germany (any city)
- Occupation: Full-time professional with rental property side income
- Tech Savvy: Moderate (can use web apps, not developers)

**Property Portfolio:**
- Owns: 1 multi-unit property (3-6 units) OR 2-3 single-family rentals
- Property Value: €200,000 - €800,000
- Annual Rental Income: €30,000 - €120,000
- Annual Expenses: €8,000 - €40,000 (50-200 invoices)

**Pain Points:**
- Spends 2-3 hours per week on invoice management
- Pays accountant €150-300/month for bookkeeping
- Worried about 15-Regel compliance (recent property purchase)
- Frustrated with Excel tracking
- Wants professional reports without hiring full-time help

**Willingness to Pay:**
- Current cost: €1,800-3,600/year (accountant hours)
- Acceptable price: €20-50/month (€240-600/year) for 50% time savings
- ROI threshold: 6-month payback period

### Market Size (Germany)

- **Total Landlords in Germany**: ~4 million
- **Target Segment** (2-10 units): ~800,000 (20%)
- **Addressable Market** (tech-savvy, worried about 15-Regel): ~80,000 (10%)
- **Initial Target** (early adopters): ~8,000 (1%)

**Revenue Potential:**
- 8,000 customers × €30/month = €240,000 monthly = **€2.88M ARR**
- At 1% market penetration

---

## Technical Architecture

### Technology Stack

**Frontend:**
- **Next.js 14** (App Router): React framework with server-side rendering
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Server Components**: Performance optimization

**Data Storage:**
- **File-based JSON**: `data/invoices.json` (255KB for 100+ invoices)
- **Local PDFs**: `data/uploads/` directory
- **No Database**: Keeps deployment simple, data portable

**OCR & AI:**
- **OCR Engine**: PDF text extraction + image OCR
- **AI Analysis**: Pattern matching for supplier, amount, category detection
- **Learning System**: Logs corrections to `ocr-correction-logs.jsonl` for training

**Deployment:**
- **Local Hosting**: Runs on user's machine (privacy)
- **Port 3002**: `npm run dev` for development
- **Git Repository**: Version control initialized (2025-11-28)

### Why This Architecture? (Reasoning)

**Decision 1: File-based JSON vs Database**
- **Reasoning**: 100 invoices = 255KB of data. Database overkill for this scale.
- **Trade-offs**: Simple deployment, no migration complexity, data portability
- **Future**: Can migrate to SQLite/PostgreSQL if user base scales beyond 1000 invoices

**Decision 2: Local Processing vs Cloud**
- **Reasoning**: German privacy laws (GDPR), user trust, invoice data is sensitive
- **Trade-offs**: Requires local installation, but eliminates data breach risk
- **Future**: Could offer cloud-hosted version with encryption

**Decision 3: Next.js Server Components vs Pure Client**
- **Reasoning**: Faster initial page loads, SEO-friendly (if public marketing site)
- **Trade-offs**: More complex architecture, but better performance
- **Pattern**: Server components for data fetching, client components for interactivity

**Decision 4: TypeScript**
- **Reasoning**: Type safety prevents bugs in financial calculations
- **Trade-offs**: Slightly slower development, but critical for accuracy
- **Impact**: Prevents entire classes of runtime errors (wrong currency math, etc.)

### Data Model

```typescript
interface Invoice {
  id: string;
  filename: string;
  source: 'upload' | 'manual';
  date: string;
  supplier: string;
  invoiceNumber: string;
  amount: number;
  category: string;  // e.g., 'heating', 'repair', 'insurance'
  ocrApproved: boolean;
  archived: boolean;
  propertyId?: string;
  note?: string;

  // Line Items (for detailed cost breakdown)
  lineItems: LineItem[];

  // Cost Splitting
  splits?: {
    unit1: number;
    unit2: number;
    unit3: number;
    unit4: number;
    unit5: number;
  };

  // 15-Regel Tracking
  is15RegelRelevant?: boolean;

  // Accountant Questions
  questions?: Question[];
}
```

---

## Core Features

### 1. Invoice Upload & OCR Processing

**User Flow:**
1. User uploads PDF invoice or manually enters data
2. OCR extracts text from PDF
3. AI analyzes content to detect:
   - Supplier name
   - Invoice number
   - Date
   - Total amount
   - Line items (description, quantity, unit price)
4. User reviews and approves OCR results
5. Corrections logged for AI training

**Technical Implementation:**
- PDF parsing library extracts text
- Pattern matching finds key fields (regex + ML)
- Supplier matching against known database
- User approval workflow (`ocrApproved` flag)
- Correction logs in JSONL format for training

**Why This Matters:**
- **Time Savings**: 90% reduction in manual data entry
- **Accuracy**: AI learns from corrections (improves over time)
- **Audit Trail**: All changes logged for accountability

### 2. Flexible Cost Splitting

**Splitting Methods:**
1. **By Square Meter**: Automatically allocate based on unit size
   - Example: 100m² unit gets 40% of shared heating costs (250m² total)
2. **Custom Ratios**: User-defined percentages
   - Example: Split 3-way repair 33.3% / 33.3% / 33.3%
3. **Property-Specific**: Assign entire cost to one unit
   - Example: Broken dishwasher in Unit 3 = 100% to Unit 3

**Implementation:**
- `splits` object stores allocation per unit
- Validation: Sum must equal 100%
- Visual feedback: Shows running total as user adjusts
- Auto-split button: Quick allocation by sqm

**Why This Matters:**
- **Accuracy**: Different costs require different allocation methods
- **Flexibility**: No one-size-fits-all solution
- **Tenant Transparency**: Clear documentation prevents disputes

### 3. 15-Regel Tax Compliance Tracking

**The 15-Regel Explained:**

German tax law (§ 6 Abs. 1 Nr. 1a EStG) states:
> If renovation costs within 3 years of property purchase exceed 15% of the property's purchase price (excluding land value), these costs are reclassified from "Erhaltungsaufwand" (maintenance, immediately deductible) to "Anschaffungsnahe Herstellungskosten" (acquisition-related production costs, depreciated over 40-50 years).

**Example:**
- Property purchase price: €300,000 (€100,000 land + €200,000 building)
- 15% threshold: €30,000 (15% of €200,000 building value)
- Renovation costs in first 3 years: €35,000
- **Result**: Exceeds threshold → Must depreciate, not deduct

**How Invoice Splitter Tracks This:**

1. **Property Configuration**: User enters property details:
   - Purchase date
   - Purchase price (building value only)
   - 15% threshold calculation (automatic)

2. **Invoice Classification**: Each invoice marked as:
   - ✅ **15-Regel Relevant**: Counts toward threshold (roof repair, modernization)
   - ❌ **Not Relevant**: Doesn't count (routine maintenance, utilities)

3. **Running Total**: Dashboard shows:
   - Current spending: €8,300
   - Threshold: €30,000
   - Percentage: 27.7% of limit used
   - Time remaining: 2 years, 3 months

4. **Warning System**: Alerts when approaching 80%, 90%, 95% of threshold

5. **Detailed Report**: "15-Regel Details" page breaks down:
   - All relevant invoices
   - Categorization by property
   - Total per year
   - Compliance status

**Why This Is Critical:**
- **Tax Savings**: Misclassification can cost €5,000-20,000 in lost deductions
- **Audit Protection**: Automatic documentation for tax authority
- **Peace of Mind**: Property owners know their compliance status in real-time

**Competitive Advantage:**
- **No other tool** tracks this automatically
- Accountants charge €200-500 for manual 15-Regel analysis
- Built-in compliance = core differentiator

### 4. Report Generation

**Report Types:**

**A. Tax Report (Steuerberater-Bericht)**
- **Purpose**: Give accountant structured data for tax filing
- **Contents**:
  - All invoices grouped by category
  - Total per category
  - Date range filter
  - Cost splits per unit
  - 15-Regel summary
- **Format**: Clean table, print-ready
- **Export**: PDF/Print

**B. Finanzamt Report (Tax Authority)**
- **Purpose**: Official documentation for tax return
- **Contents**:
  - Property-specific expenses
  - Itemized deductions
  - 15-Regel compliance statement
  - Invoice references (number, date, supplier)
- **Format**: Professional, audit-ready
- **Export**: PDF

**C. 15-Regel Details Report**
- **Purpose**: Detailed breakdown of 15-Regel status
- **Contents**:
  - All relevant invoices
  - Running total by year
  - Threshold tracking
  - Visual progress indicator
- **Format**: Interactive dashboard + PDF
- **Export**: PDF

**Why Reports Matter:**
- **Accountant Efficiency**: Saves 5-10 hours of manual categorization
- **Tax Compliance**: Finanzamt-ready documentation
- **Professionalism**: Builds trust with accountant

### 5. Supplier Management & Auto-Categorization

**Problem**: Same supplier appears in many invoices (e.g., "Stadtwerke Bonn GmbH" for utilities)

**Solution:**
- **Supplier Database**: `data/suppliers.json` stores known suppliers with:
  - Name (and variations: "Stadtwerke", "SWB", "Stadtwerke Bonn")
  - Default category
  - VAT number (optional)
  - Contact info

- **Auto-Matching**: When OCR detects supplier name, automatically:
  - Match to database (fuzzy matching)
  - Suggest default category
  - Pre-fill known fields

- **Validation**: `npm run validate-suppliers` checks for:
  - Duplicate supplier IDs
  - Orphaned invoice references
  - Invalid categories

**Why This Matters:**
- **Consistency**: "Stadtwerke" always categorized as "utilities"
- **Speed**: No manual lookup for repeat suppliers
- **Accuracy**: Reduces categorization errors

---

## Product Roadmap: MLP (Minimum Lovable Product)

The roadmap follows a **first-principles prioritization framework**:

**Priority Formula:** `Impact × Frequency × (1 / Effort) = Priority Score`

- **High Impact, High Frequency, Low Effort** = P0 (Do First)
- **High Impact, High Frequency, Medium Effort** = P1 (Do Second)
- **High Impact, Low Frequency, Any Effort** = P2 (Do Third)

---

### ✅ P0: Critical for Lovability (COMPLETED - 2025-11-28)

**Goal:** Transform app from "usable" to "lovable" - remove friction from daily use

#### ✅ P0.1: Consistent Navigation (COMPLETED)
- **Problem**: Navigation only visible on 1/10 pages (users get lost)
- **Solution**: Global navigation header on all pages
- **Impact**: HIGH - Affects every page visit
- **Effort**: LOW - Reusable component
- **Result**: 9/10 pages now have navigation

#### ✅ P0.2: Search Functionality (COMPLETED)
- **Problem**: Finding invoices requires scrolling through 100+ items
- **Solution**: Real-time search across supplier, invoice number, filename, date
- **Impact**: HIGH - Used multiple times per week
- **Effort**: LOW-MEDIUM - Client-side filtering
- **Result**: Find any invoice in <5 seconds

#### ✅ P0.3: Archive Toggle (COMPLETED)
- **Problem**: Old invoices clutter main list
- **Solution**: "Show Archived" toggle on home page
- **Impact**: MEDIUM-HIGH - Keeps workspace clean
- **Effort**: LOW - Toggle state + filter
- **Result**: Clean main view, easy access to history

**P0 Completion Status:**
- ✅ All features implemented and tested
- ✅ No compilation errors
- ✅ Dev server running on port 3002
- ✅ Ready for user testing

---

### Pending: P1 - High Value, Medium Effort (7-9 hours)

**Goal:** Make app professional and complete

#### P1.1: Plain-Language 15-Regel Explanations (3-4 hours)
- **Problem**: Property owners don't understand tax jargon
- **Solution**: Add "What is 15-Regel?" explainer with visual progress bar
- **Impact**: HIGH - Core value proposition
- **Effort**: MEDIUM - Content writing + UI design
- **Example**: "You're at 8.3% of the 15% threshold (€2,500 / €30,000). You have €27,500 remaining budget for the next 2 years."

#### P1.2: Category Breakdown in Tax Report (2-3 hours)
- **Problem**: Accountants need spending patterns by category
- **Solution**: Add category totals table to tax report
- **Impact**: HIGH - Professional reporting
- **Effort**: MEDIUM - Aggregate data + table UI
- **Benefit**: "€12,000 heating, €8,000 repairs, €5,000 insurance" at a glance

#### P1.3: Advanced Filters on Invoice List (2-3 hours)
- **Problem**: Need to view specific subsets (e.g., "2024 heating bills")
- **Solution**: Add filters: Date range, Category, Property, 15-Regel status
- **Impact**: MEDIUM - Complements search
- **Effort**: MEDIUM - Dropdown filters + logic
- **Benefit**: "Show all heating invoices from Q1 2024 over €500"

---

### Pending: P2 - Polish & Professional (5-8 hours)

**Goal:** Professional finish and visual polish

#### P2.1: Improved Cost Splitting UX (3-4 hours)
- **Problem**: Split calculator feels hidden, unclear if splits = total
- **Solution**: Prominent calculator with green checkmark validation
- **Impact**: MEDIUM - Core feature already works
- **Effort**: MEDIUM-HIGH - UI redesign
- **Benefit**: Confidence that splits are correct

#### P2.2: Invoice References in Finanzamt Report (1-2 hours)
- **Problem**: Tax authority needs to cross-reference claims
- **Solution**: Add "Invoice Number" and "Date" columns to report
- **Impact**: MEDIUM - Audit-ready professionalism
- **Effort**: LOW - Add table columns
- **Benefit**: Tax auditor can verify each line item

#### P2.3: Modern Typography (1-2 hours)
- **Problem**: Default fonts look dated
- **Solution**: Import Inter or Outfit from Google Fonts
- **Impact**: LOW-MEDIUM - Aesthetics
- **Effort**: LOW - Font import + CSS
- **Benefit**: Modern, trustworthy appearance

---

### Backlog: What NOT to Build (Deliberately Deferred)

**Rationale:** These features add complexity without addressing core user pain points

❌ **Multi-user support** - Target is single property owner
❌ **Mobile app** - Web responsive is sufficient
❌ **Automated bank import** - Manual upload works fine (privacy benefit)
❌ **Custom categories** - Fixed categories match German tax forms
❌ **Email notifications** - Not solving a pain point
❌ **Dark mode** - Nice-to-have, not a deal-breaker
❌ **Undo/redo** - Data persistence is simple enough
❌ **Batch operations** - Archive handles cleanup
❌ **Export to Excel** - Reports cover accountant needs
❌ **Advanced analytics** - Simple reports are sufficient

**First Principle:** Only build features that directly reduce time spent OR increase tax compliance accuracy.

---

## Accounting Workflow Integration

### Current Workflow (Without Invoice Splitter)

**Month-End Accounting Process:**

1. **Collect Invoices** (30 min)
   - Find PDFs in email inbox
   - Scan paper invoices
   - Organize in folders

2. **Manual Data Entry** (3-4 hours)
   - Open each PDF
   - Type data into Excel: Date, Supplier, Amount, Category
   - Calculate cost splits manually (by sqm or custom)
   - Categorize as 15-Regel relevant or not

3. **Verify & Calculate** (1 hour)
   - Check totals add up
   - Verify splits = 100%
   - Calculate 15-Regel running total

4. **Create Reports** (1-2 hours)
   - Copy/paste data into Word/PDF template
   - Format tables
   - Add category subtotals manually

5. **Send to Accountant** (15 min)
   - Email PDFs + Excel file
   - Hope accountant doesn't have questions

**Total Time: 6-8 hours per month**

---

### Optimized Workflow (With Invoice Splitter)

1. **Upload Invoices** (10 min)
   - Drag & drop PDFs into app
   - OCR auto-extracts data
   - Quick review/approve

2. **Review & Adjust** (30 min)
   - Check auto-categorization
   - Adjust cost splits if needed (most auto-calculated)
   - Mark 15-Regel relevance

3. **Generate Reports** (5 min)
   - Click "Generate Tax Report"
   - Click "Generate Finanzamt Report"
   - Download PDFs

4. **Send to Accountant** (5 min)
   - Email reports (structured data, not raw PDFs)
   - Accountant imports directly

**Total Time: 50 minutes per month**

**Time Savings: 5-7 hours per month (85% reduction)**

---

### Accountant Integration Benefits

**What Accountants Receive:**

Instead of:
- ❌ 50 PDF invoices
- ❌ Messy Excel file with manual errors
- ❌ Unclear categorization
- ❌ No 15-Regel tracking

They get:
- ✅ Structured tax report with clean categories
- ✅ Pre-calculated cost splits
- ✅ 15-Regel compliance summary
- ✅ Finanzamt-ready documentation
- ✅ All data in print-ready format

**Impact on Accountant:**
- **80% reduction in data entry time**
- **Fewer clarification questions** (data is pre-validated)
- **Faster tax filing** (reports are already formatted)
- **Higher client satisfaction** (professional presentation)

**Potential Business Model:**
- "Accountant Partner Program" - Licensed accountants recommend tool to clients
- Referral fee: €50 per signup
- Co-marketing: "Recommended by Steuerberater Schmidt"

---

## Business Model & Monetization

### Revenue Model: B2C SaaS Subscription

**Pricing Tiers:**

#### Tier 1: Basic (€19/month or €190/year)
- Up to 100 invoices per year
- 1 property (up to 5 units)
- All core features (OCR, splitting, reports)
- 15-Regel tracking
- Email support

**Target:** Individual landlords with 2-3 units

#### Tier 2: Professional (€39/month or €390/year)
- Up to 500 invoices per year
- 3 properties (up to 15 units total)
- Advanced filters & search
- Priority email support
- Accountant export formats

**Target:** Portfolio landlords with 4-10 units

#### Tier 3: Enterprise (€79/month or €790/year)
- Unlimited invoices
- Unlimited properties
- Multi-user access (property owner + accountant)
- API access
- Phone support

**Target:** Property management companies

---

### Unit Economics

**Assumptions:**
- Target customer: Professional tier (€39/month)
- Customer acquisition cost (CAC): €150 (Google Ads, content marketing)
- Churn rate: 15% annually (high retention due to tax compliance need)
- Average lifetime: 6.7 years
- Customer lifetime value (LTV): €39 × 12 × 6.7 = €3,132

**LTV:CAC Ratio:** 3,132 / 150 = **20.9:1** (Excellent - target is 3:1)

**Payback Period:** 150 / (39 × 0.85) = **4.5 months** (Good - target is <12 months)

---

### Go-to-Market Strategy

**Phase 1: Founder-Led Growth (Months 1-6)**
1. **Content Marketing**: SEO-optimized articles
   - "Was ist die 15-Regel? Der komplette Guide für Vermieter"
   - "Vermietungskosten richtig aufteilen: Ultimativer Ratgeber"
   - "Nebenkosten-Abrechnung: So vermeiden Sie Fehler"

2. **Google Ads**: Target keywords
   - "15 Regel Rechner"
   - "Nebenkostenabrechnung Software"
   - "Vermietungskosten aufteilen"

3. **Accountant Referrals**: Direct outreach
   - Partner with 10 local accountants
   - Offer free trial for their clients
   - Referral fee program

**Phase 2: Scaled Growth (Months 6-24)**
1. **Freemium Model**: Free tier (25 invoices/year) with upgrade prompts
2. **Community Building**: Facebook group for landlords
3. **YouTube Channel**: Tutorial videos
4. **Partnerships**: Integration with Lexoffice, DATEV

---

### Competitive Advantages

**Why Invoice Splitter Wins:**

1. **15-Regel Expertise**: No competitor tracks this automatically
   - **Moat**: Requires deep understanding of German tax law
   - **Switching Cost**: Users build 3-year compliance history in app

2. **Vertical Focus**: Built specifically for property owners
   - Generic tools (Lexoffice) are too broad
   - Property management tools don't handle accounting depth

3. **Local Processing**: Privacy-first approach
   - German users value data sovereignty
   - No cloud = no data breach risk

4. **Accountant Network**: Two-sided marketplace potential
   - Accountants recommend to clients
   - Clients bring invoices, accountants get better data

5. **Data Network Effects**: OCR learns from user corrections
   - More users = better supplier matching
   - Better accuracy = happier users = more referrals

---

## Success Metrics & KPIs

### Product Metrics

**Engagement:**
- Daily Active Users (DAU): 30% of subscribers
- Weekly Active Users (WAU): 80% of subscribers
- Monthly Active Users (MAU): 95% of subscribers
- **Reasoning**: Monthly usage pattern (invoices arrive throughout month)

**Feature Adoption:**
- OCR usage: 85% of invoices (vs manual entry)
- Cost splitting: 70% of invoices (some are property-specific)
- 15-Regel tracking: 60% of users (recent property purchases)
- Report generation: 100% of users (core value)

**User Satisfaction:**
- Net Promoter Score (NPS): Target 50+
- "Time saved per month": Target 5+ hours
- "Would recommend to another landlord": Target 80%+

### Business Metrics

**Growth:**
- Month-over-month growth: 20% (first 12 months)
- Customer acquisition cost (CAC): <€150
- Churn rate: <15% annually
- Revenue per user (ARPU): €35 (blended across tiers)

**Financial:**
- Gross margin: 85% (SaaS standard)
- Operating margin: 20% (after scale)
- Burn rate: <€10,000/month (bootstrapped)
- Runway: 18 months (with €180,000 seed funding)

**Milestone Targets:**

| Milestone | Timeframe | Revenue |
|-----------|-----------|---------|
| 100 paying customers | Month 6 | €3,500 MRR |
| 500 paying customers | Month 12 | €17,500 MRR |
| 2,000 paying customers | Month 24 | €70,000 MRR |
| Profitability | Month 18 | Break-even |

---

## Risk Analysis & Mitigation

### Risk 1: Low Market Awareness of 15-Regel
**Risk:** Property owners don't know about 15-Regel until it's too late (tax audit)

**Mitigation:**
- Educational content marketing (SEO-optimized articles)
- Partner with accountants to educate clients
- Free "15-Regel Compliance Check" tool (lead magnet)

### Risk 2: Competition from Generic Accounting Software
**Risk:** Lexoffice, DATEV add 15-Regel tracking

**Mitigation:**
- **Speed Advantage**: We ship features faster (startup vs enterprise)
- **Vertical Focus**: Property-specific workflows they can't replicate
- **Accountant Network**: Two-sided marketplace moat

### Risk 3: Regulatory Changes in Tax Law
**Risk:** 15-Regel threshold changes (e.g., 15% → 20%)

**Mitigation:**
- Build flexible configuration (threshold % is a setting, not hardcoded)
- Monitor BFH (Bundesfinanzhof) rulings
- Update app within 30 days of law changes

### Risk 4: User Churn After First Year
**Risk:** Users only need app during 3-year 15-Regel window

**Mitigation:**
- **Expand Use Case**: Add ongoing utility (expense tracking, tenant communication)
- **Lock-In**: Historical data in app (switching cost)
- **Accounting Partnership**: Accountants want consistent data format

### Risk 5: Data Privacy / GDPR Compliance
**Risk:** Invoice data contains personal information (supplier addresses, etc.)

**Mitigation:**
- **Local Processing**: Data never leaves user's machine
- **No Cloud Storage**: Eliminates data breach risk
- **GDPR Compliance**: User owns all data, can export/delete anytime

---

## Technical Roadmap (Future Development)

### Q1 2026: Scale & Stability
- **SQLite Database Migration**: For users with >500 invoices
- **Automated Testing**: Increase coverage from 66% to 90%
- **Performance Optimization**: Sub-second page loads
- **Mobile Responsive**: Full mobile UI (currently desktop-first)

### Q2 2026: Accountant Integration
- **Accountant Portal**: Read-only access for accountants
- **DATEV Export**: Direct integration with accountant software
- **Collaboration Features**: Comments, question threads on invoices

### Q3 2026: AI & Automation
- **Smart Categorization**: ML model trained on 10,000+ invoices
- **Predictive 15-Regel Alerts**: "Based on your pattern, you'll exceed threshold in 4 months"
- **Automated Supplier Matching**: 95% accuracy without manual approval

### Q4 2026: Ecosystem Expansion
- **Bank Integration** (optional): Auto-import transactions
- **Tenant Portal**: Direct expense sharing with tenants
- **Property Valuation**: Track property value for accurate 15-Regel threshold

---

## Why This Business Will Succeed

### First Principles Analysis

**Core Truth #1:** Property owners hate manual invoice processing
- **Evidence**: 6-8 hours per month spent on data entry
- **Willingness to Pay**: €30-50/month to save 80% of that time

**Core Truth #2:** 15-Regel compliance is scary and expensive to get wrong
- **Evidence**: €5,000-20,000 in lost deductions if misclassified
- **Willingness to Pay**: €30/month is cheap insurance

**Core Truth #3:** Accountants want structured data, not PDFs
- **Evidence**: 80% of accountant time is data entry
- **Willingness to Pay**: Accountants will recommend tools that save them time

**Core Truth #4:** German market values privacy and local data
- **Evidence**: GDPR, distrust of cloud providers
- **Competitive Advantage**: Local processing = trust

### Sustainable Competitive Moats

1. **Regulatory Expertise**: Deep understanding of German tax law
2. **Data Network Effects**: Better supplier matching over time
3. **Accountant Partnerships**: Two-sided marketplace
4. **Switching Costs**: 3 years of historical compliance data
5. **Vertical Focus**: Can't be replicated by generic tools

### Founder-Market Fit

**This is a "scratch your own itch" business:**
- Built by property owner who experienced the pain
- Understands 15-Regel compliance personally
- Knows what accountants need (worked with them)
- Technical skills to build the solution

**Advantages:**
- Authentic understanding of user pain
- Can build MVP without expensive agency
- Direct access to target market (own network)
- Credibility when marketing ("Built by a landlord, for landlords")

---

## Conclusion

Invoice Splitter solves a **painful, expensive, recurring problem** for a **specific, identifiable market** (German property owners with 2-10 rental units) using a **defensible, technical solution** (15-Regel compliance tracking + AI-powered OCR).

**The Business Case:**
- **Large TAM**: 80,000 addressable customers in Germany
- **High Willingness to Pay**: €30-50/month (cheaper than accountant hours saved)
- **Strong Unit Economics**: 20:1 LTV:CAC ratio, 4.5-month payback
- **Sustainable Moats**: Regulatory expertise, data network effects, accountant partnerships
- **Clear Path to Profitability**: Break-even at 500 customers (achievable in 12-18 months)

**Next Steps:**
1. Complete P1 features (plain-language 15-Regel explanations)
2. Launch beta with 10 landlord friends
3. Collect feedback, iterate on UX
4. Partner with 3 local accountants for referrals
5. Launch paid tier with first 100 customers
6. Scale via content marketing and Google Ads

**The Vision:**
Become the **default tool for German property owners** managing rental expenses, saving them 5-7 hours per month and eliminating 15-Regel compliance anxiety.

---

**Document Version:** 1.0
**Last Updated:** 2025-11-28
**Status:** Ready for investor review / team onboarding
