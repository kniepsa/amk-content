# UX Review - Joe Gebbia's Airbnb Design Framework

Comprehensive UX audit using Playwright screenshots and Airbnb's design philosophy.

## The Reviewer: Joe Gebbia

**Background**: Co-founder of Airbnb, RISD-trained designer who established Airbnb's design-centric culture from day one. His philosophy: "Design is not just how something looks, but how it works and how it makes people feel."

## Scoring Guide (Jordan Taylor Method)

Use this scale for all principle evaluations:

| Score | Meaning                                 | Action                 |
| ----- | --------------------------------------- | ---------------------- |
| 5     | Excellent - Delights users              | Celebrate and document |
| 4     | Good - Meets expectations               | Minor polish only      |
| 3     | Acceptable - Functional but forgettable | Improve when possible  |
| 2     | Poor - Causes friction                  | Fix in next sprint     |
| 1     | Failing - Blocks or frustrates users    | Fix immediately        |

---

## Instructions

### Step 1: Capture Current State

Use Playwright/Puppeteer to screenshot key user flows:

```bash
# Via chrome-devtools MCP or puppeteer MCP
# Capture: homepage, key flows, mobile views
```

**Pages to capture:**

- [ ] Homepage (desktop + mobile)
- [ ] Primary user flow (e.g., menu → item → cart)
- [ ] Forms (login, signup, contact)
- [ ] Error states (404, empty states)

---

### Step 2: Airbnb's 5 Design Principles Evaluation

#### 1. Belong Anywhere (Emotional Connection)

_"Does this make users feel welcome and trusted?"_

| Check                                  | Status | Notes |
| -------------------------------------- | ------ | ----- |
| Users feel welcome on first visit      |        |       |
| Experience is inclusive and accessible |        |       |
| Visual language reinforces community   |        |       |
| Personalization opportunities present  |        |       |

#### 2. Progressive Disclosure (Essential Info First)

_"Show essential info, hide complexity"_

| Check                                              | Status | Notes |
| -------------------------------------------------- | ------ | ----- |
| Most important info immediately visible            |        |       |
| Advanced options discoverable but not overwhelming |        |       |
| Primary goal achievable without distraction        |        |       |
| Clear visual hierarchy                             |        |       |

#### 3. Friction-Aware (Minimize Decision Fatigue)

_"How many decisions does the user need to make?"_

| Check                               | Status | Notes |
| ----------------------------------- | ------ | ----- |
| Smart defaults work for most users  |        |       |
| Every form field is truly necessary |        |       |
| Steps can be combined or eliminated |        |       |
| No unnecessary choices              |        |       |

#### 4. Trust Through Transparency

_"Every interaction builds confidence"_

| Check                                                  | Status | Notes |
| ------------------------------------------------------ | ------ | ----- |
| Users know what happens when they click                |        |       |
| Loading states are informative, not mysterious         |        |       |
| Error messages guide recovery, not just report failure |        |       |
| Pricing and commitment clearly communicated            |        |       |

#### 5. Seamless Cross-Platform

_"Mobile and desktop feel unified"_

| Check                                          | Status | Notes |
| ---------------------------------------------- | ------ | ----- |
| Experience translates naturally across devices |        |       |
| Touch targets appropriate for mobile (≥44px)   |        |       |
| Animations feel natural, not arbitrary         |        |       |
| Design system consistent across platforms      |        |       |

---

### Step 3: Technical UX Checklist

#### Blockers (Must Fix Before Ship)

- [ ] **Touch Targets**: All interactive elements ≥44x44px on mobile
- [ ] **Loading States**: All async operations show loading feedback
- [ ] **Error Recovery**: Error messages guide user to resolution
- [ ] **Form Labels**: All form inputs have associated labels

#### Warnings (Should Fix)

- [ ] **Color Contrast**: Text meets WCAG AA (4.5:1 ratio)
- [ ] **Keyboard Navigation**: All interactive elements focusable and operable
- [ ] **Layout Shift**: No unexpected movement during page load
- [ ] **Focus Visibility**: Focused elements have visible outline

---

### Step 4: Mobile-First Check

- [ ] Touch targets minimum 44x44px
- [ ] Text readable without zoom (16px+ body)
- [ ] No horizontal scroll on mobile
- [ ] Forms work with mobile keyboards
- [ ] Images responsive, not cropped poorly

### Step 5: Performance Perception

- [ ] Loading states present (skeletons, spinners)
- [ ] Instant feedback on interactions
- [ ] No layout shift during load (CLS < 0.1)
- [ ] Progressive image loading

---

## Output Format

```markdown
## 🎨 UX Review: [Project Name]

Date: [Date]
Reviewer: Joe Gebbia (AI-assisted)

### Airbnb Principles Score

| Principle                  | Score | Status   |
| -------------------------- | ----- | -------- |
| Belong Anywhere            | /5    | ✅/⚠️/🛑 |
| Progressive Disclosure     | /5    | ✅/⚠️/🛑 |
| Friction-Aware             | /5    | ✅/⚠️/🛑 |
| Trust Through Transparency | /5    | ✅/⚠️/🛑 |
| Seamless Cross-Platform    | /5    | ✅/⚠️/🛑 |

**Overall UX Score: [X/25]**

### 🛑 Blockers (Fix Before Ship)

1. **[Issue]**: [Description]
   - Impact: [Why this matters to users]
   - Fix: [Specific, actionable recommendation]

### ⚠️ Warnings (Should Fix)

1. **[Issue]**: [Description]
   - Impact: [Why this matters]
   - Suggestion: [Improvement recommendation]

### ✨ What's Working Well

1. [Positive observation with specific praise]
2. [Another positive observation]

### Screenshots

[Attach or reference captured screenshots]

---

**Joe's Verdict**: {BLOCKED 🛑 | APPROVED ✅ | APPROVED WITH WARNINGS ⚠️}
```

---

## Advanced: Nielsen's 10 Heuristics (Optional Deep-Dive)

For comprehensive audits, also evaluate against Jakob Nielsen's classic heuristics:

| #   | Heuristic                                                                | Score (1-5) | Notes |
| --- | ------------------------------------------------------------------------ | ----------- | ----- |
| 1   | **Visibility of system status** - Users always know what's happening     |             |       |
| 2   | **Match real world** - Speak user's language, not system jargon          |             |       |
| 3   | **User control & freedom** - Easy undo, back, escape routes              |             |       |
| 4   | **Consistency & standards** - Same words/actions mean same things        |             |       |
| 5   | **Error prevention** - Prevent problems before they occur                |             |       |
| 6   | **Recognition over recall** - Make options visible, minimize memory load |             |       |
| 7   | **Flexibility & efficiency** - Shortcuts for experts, simple for novices |             |       |
| 8   | **Aesthetic & minimal** - No irrelevant or rarely-needed info            |             |       |
| 9   | **Help users with errors** - Plain language, suggest solutions           |             |       |
| 10  | **Help & documentation** - Easy to search, focused on tasks              |             |       |

**Nielsen Score: [X/50]**

---

## Quick UX Wins Checklist

### Micro-interactions

- [ ] Button hover/active states
- [ ] Form field focus states
- [ ] Success/error feedback animations
- [ ] Loading state transitions

### Trust Signals

- [ ] Clear contact information
- [ ] Privacy policy accessible
- [ ] Secure payment indicators
- [ ] Social proof (reviews, testimonials)

### Restaurant-Specific (Rico's Domain)

- [ ] Menu readable and scannable
- [ ] Allergen info visible
- [ ] Opening hours prominent
- [ ] Reservation CTA clear
- [ ] Phone number clickable on mobile

---

## Integration with UX Guardian

This manual review complements the automatic UX Guardian gate:

- **UX Guardian (automatic)**: Blocks `/ship` if technical UX blockers exist
- **`/ux-review` (manual)**: Deep-dive audit using screenshots and full principles evaluation

After UX improvements:

1. Run `/update-baseline` to capture new design
2. Future `/check-design` will compare against improved state
3. `/ship` will pass UX Guardian gate
