# UX Review - Jordan Taylor's Audit Framework

Comprehensive UX audit using Playwright screenshots and systematic evaluation.

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

### Step 2: Evaluate Against Heuristics

#### Nielsen's 10 Usability Heuristics

| # | Heuristic | Score (1-5) | Notes |
|---|-----------|-------------|-------|
| 1 | Visibility of system status | | |
| 2 | Match between system and real world | | |
| 3 | User control and freedom | | |
| 4 | Consistency and standards | | |
| 5 | Error prevention | | |
| 6 | Recognition rather than recall | | |
| 7 | Flexibility and efficiency of use | | |
| 8 | Aesthetic and minimalist design | | |
| 9 | Help users recognize, diagnose, recover from errors | | |
| 10 | Help and documentation | | |

### Step 3: Mobile-First Check

- [ ] Touch targets minimum 44x44px
- [ ] Text readable without zoom (16px+ body)
- [ ] No horizontal scroll on mobile
- [ ] Forms work with mobile keyboards
- [ ] Images responsive, not cropped poorly

### Step 4: Accessibility Quick Scan

- [ ] Color contrast ratio (4.5:1 minimum for text)
- [ ] Alt text on images
- [ ] Form labels associated with inputs
- [ ] Keyboard navigation works
- [ ] Focus states visible

### Step 5: Performance Perception

- [ ] Loading states present (skeletons, spinners)
- [ ] Instant feedback on interactions
- [ ] No layout shift during load
- [ ] Progressive image loading

---

## Output Format

```markdown
## UX Review: [Project Name]
Date: [Date]
Reviewer: Jordan Taylor (AI-assisted)

### Summary
Overall UX Score: [X/10]
Critical Issues: [count]
Recommendations: [count]

### Critical Issues (Fix Immediately)
1. [Issue]: [Description] → [Recommendation]

### High Priority
1. [Issue]: [Description] → [Recommendation]

### Nice to Have
1. [Issue]: [Description] → [Recommendation]

### What's Working Well
- [Positive observation]
- [Positive observation]

### Screenshots
[Attach or reference captured screenshots]
```

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

### Restaurant-Specific (Rico's Input)
- [ ] Menu readable and scannable
- [ ] Allergen info visible
- [ ] Opening hours prominent
- [ ] Reservation CTA clear
- [ ] Phone number clickable on mobile

---

## Integration with Visual Regression

After UX improvements:
1. Run `/update-baseline` to capture new design
2. Future `/check-design` will compare against improved state
