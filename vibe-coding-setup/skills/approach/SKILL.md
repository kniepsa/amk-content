---
name: approach
description: Quick 3-question mode selector for new features or apps. Asks about product type, schema clarity, and core uncertainty to recommend UX-First, Schema-First, Bot-First, or Parallel build sequence. Run BEFORE /pm or /architect. Triggers on "which approach", "how should I start", "what's the right mode", "approach selector".
invocation: manual
---

# Approach Selector

Accept `$ARGUMENTS` as the feature or app name (optional).

**Run this before `/pm` or `/architect`.** The build sequence is the #1 source of UI ↔ Backend churn. This takes 2 minutes and saves hours.

---

## Step 1: Ask These 3 Questions

Present all three at once:

> **Q1: What is the biggest uncertainty right now?**
> A) What users actually want (product/UX uncertainty)
> B) How the data should be structured (schema/data uncertainty)
> C) Whether the core algorithm or logic works (logic/API uncertainty)
> D) Nothing — I know both the product and the data model clearly

> **Q2: What type of product is this?**
> A) Consumer / B2C (users interact visually — UI IS the product)
> B) B2B SaaS or internal tool (functionality over aesthetics)
> C) AI agent or automation (text-in/text-out, async, cron)
> D) Data-heavy platform (multi-tenant, complex RLS, reporting)

> **Q3: Is your database schema stable?**
> A) No — it's still evolving
> B) Somewhat — core tables defined, details fuzzy
> C) Yes — unchanged for ≥ 1 full session
> D) No database yet (pure logic or API integration)

---

## Step 2: Evaluate Answers

Use this decision matrix:

| Q1            | Q2             | Q3         | → Mode                     |
| ------------- | -------------- | ---------- | -------------------------- |
| A (UX)        | A (Consumer)   | any        | **UX-First**               |
| A (UX)        | B (B2B)        | A/B        | **Schema-First → then UX** |
| B (Schema)    | any            | A/B        | **Schema-First**           |
| C (Logic)     | C (Agent/Auto) | any        | **Bot-First**              |
| D (Know both) | any            | C (Stable) | **Parallel**               |
| D (Know both) | any            | A/B        | **Schema-First first**     |

---

## Step 3: Output Mode Recommendation

Show a clear recommendation block, then the build sequence.

---

### Mode: UX-First

```
→ Start:   Mockup in v0.dev, Figma Make, or Lovable
→ Validate: Show to 3+ users before wiring backend
→ Then:    Wire backend to match what users respond to
→ Gate to Backend: "Do users understand the UI without prompting?"
→ Risk:    Schema may shift after UX validation (expected + OK)
```

**Good for**: Dashboards, consumer apps, chart-heavy tools, anything where UI = product.

---

### Mode: Schema-First

```
→ Start:   DB schema (tables, relations, constraints, RLS policies)
→ Validate: Run 2 sessions — did schema change? If yes → keep iterating
→ Then:    API service layer → UI (last)
→ Gate to UI: "Has schema been stable for ≥ 1 session?"
→ Risk:    UI may uncover product errors Telegram bot would miss
```

**Good for**: B2B tools, multi-tenant apps (Restaurant OS), anything with complex data.

---

### Mode: Bot-First

```
→ Start:   Service layer (pure functions, no framework)
→ Validate: Telegram bot or curl commands test the logic cheaply
→ Then:    UI (if needed at all)
→ Gate to UI: "Does the core logic work end-to-end?"
→ Note:    Bot validates API logic, NOT product fit — UI feedback still required
```

**Good for**: AI agents, bookkeeping automation, webhook processors, cron jobs, internal commands.

**Template stack**: python-telegram-bot + Supabase + Railway

---

### Mode: Parallel

```
→ Only if: Schema stable for ≥ 1 session with ZERO migrations planned
→ Rules:
  1. UI components have ZERO business logic (presentation only)
  2. Service layer cleanly separated (no API calls inside components)
  3. If schema changes: pause UI immediately → fix data layer → resume UI
→ Risk: Schema change mid-parallel = both sides break simultaneously
```

**Good for**: Established products where schema is frozen and you need speed.

---

## Step 4: Anti-Pattern Warning

Always append after the recommendation:

> ⚠️ **AI Agreement Trap**: Claude will agree with your approach even if it's wrong.
> Say explicitly: _"Challenge this approach. What are the risks short-term, medium-term, and long-term?"_

> ⚠️ **Vague Prompt Churn**: "Make it better" → endless back-and-forth.
> Say: _"Apply [specific change] to [specific element]"_ instead.

---

## Step 5: Schema-Freeze Gate (Schema-First + Parallel only)

If mode is Schema-First or Parallel, output this gate before closing:

```
SCHEMA-FREEZE GATE
==================
[ ] Core entities identified (tables + fields)
[ ] Relations defined (FK constraints)
[ ] RLS policies drafted
[ ] No migrations planned in next 2 sessions
[ ] Schema reviewed via /architect

GATE STATUS:
[ ] OPEN  → proceed to PLAN / BUILD
[ ] CLOSED → keep iterating schema (do not start UI)
```

---

## Output Format

```
APPROACH SELECTOR: [Feature/App Name]
======================================
Mode:           [UX-First / Schema-First / Bot-First / Parallel]
Reasoning:      [1 sentence why this mode fits]

Build Sequence:
1. [First step with concrete action]
2. [Second step]
3. [Third step]

Gate to Next Phase:
  "[What must be true before moving on]"

Anti-Pattern Warnings:
  - AI Agreement Trap: challenge the approach explicitly
  - [Mode-specific warning]

[Schema-Freeze Gate block — if Schema-First or Parallel]
======================================
```
