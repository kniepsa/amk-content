# Idea: Universal Product Customization Layer API

**Date:** 2026-02-26
**Status:** Concept — needs validation
**Origin:** Printulu POD pivot brainstorm

---

## The Idea in One Sentence

A B2B API that sits on top of ANY existing e-commerce product catalog and makes it customizable — zone by zone — without the merchant rebuilding their stack.

---

## The Core Insight

Existing POD platforms (Printify, Gelato, Fyul) only work with **their own product catalogs** and have **fixed, pre-defined print areas**.

This API works with **any merchant's existing products** and lets the merchant **define their own customizable zones ("sectors")**.

```
Existing shop product  →  Define sectors  →  Customer customizes  →  Route to printer
(plain notebook)          (cover, spine,      (uploads design per    (Printulu network)
                           back cover)         sector)
```

---

## The Stripe Analogy

Stripe doesn't own banks — it connects to existing financial rails.
This API doesn't own products — it **connects to existing product catalogs and adds a customization rail.**

---

## The "Sector" Concept (Key Innovation)

A sector is a merchant-defined, semantically meaningful print zone on any product:

```json
{
  "product_id": "notebook-a5-hardcover",
  "sectors": [
    {
      "id": "cover",
      "label": "Front Cover",
      "width_mm": 148,
      "height_mm": 210,
      "bleed_mm": 3,
      "allowed_types": ["image", "text", "color"],
      "constraints": { "min_dpi": 300, "color_mode": "CMYK" }
    },
    {
      "id": "spine",
      "label": "Spine",
      "width_mm": 8,
      "height_mm": 210,
      "allowed_types": ["text", "color"]
    },
    {
      "id": "back",
      "label": "Back Cover",
      "width_mm": 148,
      "height_mm": 210,
      "allowed_types": ["image", "text"]
    }
  ]
}
```

Merchant defines this once. API handles everything downstream (validation, mockup, print file, routing, fulfillment).

---

## What's Novel vs What Exists

| Capability        | Printify / Gelato / Fyul       | This API                            |
| ----------------- | ------------------------------ | ----------------------------------- |
| Product catalog   | Their catalog only             | **Any product**                     |
| Print areas       | Fixed, pre-defined per product | **Merchant-defined sectors**        |
| Integration       | Works with their products      | **Works with existing shop's SKUs** |
| Who defines zones | Platform                       | **The merchant / developer**        |
| Business model    | B2C platform                   | **B2B API / SaaS**                  |

---

## API Surface (What Merchants/Developers Call)

```
POST /products/{id}/sectors          → Define or update sector schema
GET  /products/{id}/sectors          → Get sector schema + mockup templates

POST /customizations                 → Submit customer design per sector
GET  /customizations/{id}/preview    → Returns mockup image (design overlaid)
GET  /customizations/{id}/proof      → Returns print-ready file

POST /orders                         → Place order with customization_id attached
GET  /orders/{id}/status             → Track production status
GET  /orders/{id}/eta                → Delivery estimate
```

---

## Business Model Paths

### Path A: B2B API (highest ceiling)

- Charge per rendered preview + per fulfilled order
- Transaction-based like Stripe
- Customers: Shopify stores, WooCommerce, any e-commerce merchant
- Margin: API fee + Printulu fulfillment margin underneath

### Path B: Shopify App

- "Add custom zones to any product in your store"
- Install → select product → draw sectors → done
- Distribution: Shopify App Store (4.4M stores)
- Model: Monthly subscription + per-order fee

### Path C: White-label B2B SaaS

- For packaging companies, apparel brands, gift shops
- They have products, want to offer customization without building tech
- Higher ACV, SaaS contracts

### Path D: Creator Storefront Layer

- Creators pick any product, define sectors, fans customize their version
- Creator earns commission per order
- Connects directly to Printulu's creator economy MLP

---

## What Makes This Defensible

1. **Supplier network** — need actual printers to fulfill. Printulu has Law Print, Renform, TST, Quarto Press. Hard to replicate (Gelato took 14 years).
2. **Print spec knowledge** — DPI, bleed, color mode, substrate per sector is deeply operational. Encoded in the API, not copyable.
3. **Two-sided moat** — more merchants define sectors → growing library of sector schemas → new merchants browse existing ones → adoption accelerates.
4. **SA-first advantage** — local production + Yoco + 3-day shipping. Global players cannot match this for SA.

---

## Potential Market Size

| Market                                    | Size                         |
| ----------------------------------------- | ---------------------------- |
| Global POD market (2034)                  | $103B                        |
| Shopify stores globally                   | 4.4M potential API customers |
| 0.1% at $99/month                         | $52M ARR                     |
| API pricing ($0.50/preview + fulfillment) | Higher ceiling               |

This is infrastructure for POD, not a POD product. Infrastructure companies earn multiples of the products they enable.

---

## Connection to Printulu's Existing Build

Nothing needs to be rebuilt from scratch:

| Existing Vendure capability           | Maps to API component                |
| ------------------------------------- | ------------------------------------ |
| PrintArtwork entity + R2 upload       | `POST /customizations` design upload |
| Artwork validation (DPI, bleed check) | Sector constraint validation         |
| Supplier routing (PrintJob entity)    | `POST /orders` → fulfillment routing |
| Yoco checkout                         | Payment for API-triggered orders     |
| DeliveryCalculatorPlugin              | `GET /orders/{id}/eta`               |
| Law Print / Renform network           | Physical production for any sector   |

The Creator MLP (planned) becomes the **first internal consumer of this API**.

---

## Validation Strategy (Do Things That Don't Scale First)

Do NOT build the API first. Validate the concept manually:

1. Find 1 SA merchant who wants custom product zones (e.g., stationery brand, gift shop)
2. Define their sectors in a config file (30 min manual setup)
3. Build dead-simple upload UI on top of it
4. Fulfill first 10 orders by hand through existing Printulu suppliers
5. If merchants love it → generalize into a proper API

**The question to answer:** Will merchants pay to add a "customize this" button to their existing products?

---

## Key Assumptions to Test

| Assumption                                    | Validation method                                      |
| --------------------------------------------- | ------------------------------------------------------ |
| Merchants will define sectors themselves      | Test with 5 SA merchants — can they do it in < 30 min? |
| Print quality consistent across sector combos | Pilot 10 sector configs through existing suppliers     |
| Pricing works at API layer                    | Model: API fee + supplier cost + margin = profitable?  |
| Demand exists                                 | Can you sell 3 merchants the outcome BEFORE building?  |

---

## The Positioning

**B2B developer pitch:**

> "The API that lets any e-commerce product become customizable — without rebuilding your stack."

**SA merchant pitch:**

> "Add a 'customize this' button to any product in your store. We handle the print. You keep the margin."

**Investor pitch:**

> "Stripe for product customization. We're infrastructure for the $103B POD market."

---

## Next Steps (When Ready to Pursue)

- [ ] Interview 5 SA merchants: "Would you pay to add customization to your existing products?"
- [ ] Map 3 merchant use cases to sector schemas (notebooks, packaging, apparel)
- [ ] Price model: what does API fee + Printulu margin look like at 100 orders/month?
- [ ] Build manual proof-of-concept with 1 merchant before writing any API code
- [ ] Write PRD if validation passes

---

## Related Research

- [POD-RESEARCH-2026-02-26.md](./POD-RESEARCH-2026-02-26.md) — full market context
