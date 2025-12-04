# Advisory Debate - 5-Expert Deliberation Framework

Structured deliberation with five expert perspectives for strategic decisions.

## When to Use

- Major feature decisions
- Go-to-market strategy
- Architecture trade-offs with business impact
- Pivots or significant scope changes
- Resource allocation decisions

---

## The Five Experts

### 1. CTO Perspective (Technical Feasibility)
**Questions to answer:**
- Can we build this with our current stack?
- What's the technical complexity (1-10)?
- What technical debt will this create?
- How does this affect system architecture?
- What's the maintenance burden?

**Red flags to raise:**
- Scalability concerns
- Security implications
- Integration complexity
- Performance impact

---

### 2. GTM Lead Perspective (Go-to-Market)
**Questions to answer:**
- How do we position this in the market?
- What's the competitive landscape?
- Who is the ideal customer for this?
- What's the pricing/monetization angle?
- How do we launch and promote this?

**Red flags to raise:**
- Market timing concerns
- Competitive threats
- Positioning confusion
- Distribution challenges

---

### 3. Product Lead Perspective (Feature Prioritization)
**Questions to answer:**
- Does this align with our product vision?
- What's the user value vs effort ratio?
- How does this fit in our roadmap?
- What do we NOT build if we build this?
- What's the MVP vs full vision?

**Red flags to raise:**
- Scope creep
- Feature bloat
- Misaligned priorities
- User research gaps

---

### 4. UX Lead Perspective (User Experience)
**Questions to answer:**
- How does this improve user workflow?
- What's the learning curve?
- How does this affect existing users?
- What accessibility concerns exist?
- Is this solving a real user pain?

**Red flags to raise:**
- Usability issues
- Cognitive overload
- Accessibility gaps
- User confusion

---

### 5. Entrepreneur Perspective (Business Viability)
**Questions to answer:**
- Does this move us toward profitability?
- What's the ROI timeline?
- What are the risks if we DON'T do this?
- How does this affect our runway?
- Is this a distraction or core to success?

**Red flags to raise:**
- Cash flow impact
- Opportunity cost
- Market validation gaps
- Resource constraints

---

## Debate Format

### Round 1: Initial Positions (each expert)
```
[Expert]: My position on [decision] is [support/oppose/conditional].
Reasoning: [2-3 key points]
Key concern: [biggest worry]
```

### Round 2: Cross-Examination
Each expert challenges at least one other perspective:
```
[Expert A] to [Expert B]: How do you address [concern]?
[Expert B] response: [defense or concession]
```

### Round 3: Synthesis
```
Points of Agreement:
- [shared conclusion 1]
- [shared conclusion 2]

Unresolved Tensions:
- [Expert A] vs [Expert B] on [issue]

Recommended Path Forward:
[Consensus recommendation with conditions]

Decision Owner's Call:
[What the human needs to decide]
```

---

## Output Format

```markdown
## Advisory Debate: [Decision Topic]
Date: [Date]

### Decision Under Consideration
[Clear statement of what we're deciding]

### Expert Summaries

| Expert | Position | Confidence | Key Concern |
|--------|----------|------------|-------------|
| CTO | Support/Oppose | High/Med/Low | [concern] |
| GTM | Support/Oppose | High/Med/Low | [concern] |
| Product | Support/Oppose | High/Med/Low | [concern] |
| UX | Support/Oppose | High/Med/Low | [concern] |
| Entrepreneur | Support/Oppose | High/Med/Low | [concern] |

### Consensus Score: [X/5 in favor]

### Key Debate Points
1. [Major point of contention and resolution]
2. [Second point]

### Recommendation
[GO / NO-GO / CONDITIONAL with specific conditions]

### If Proceeding, Watch For:
- [Risk to monitor]
- [Metric to track]
- [Decision checkpoint]
```

---

## Quick Version

For faster decisions, use abbreviated format:

```
/advisory-debate quick: Should we add feature X?

CTO: ✓ Feasible (complexity 4/10)
GTM: ✓ Market wants it
Product: ⚠️ Delays roadmap item Y
UX: ✓ Improves flow
Entrepreneur: ✓ Revenue potential

Verdict: GO with condition - ship MVP in 2 weeks max
```
