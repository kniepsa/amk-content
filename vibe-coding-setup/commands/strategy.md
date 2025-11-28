# Strategic Planning Mode

Activate multi-perspective strategic analysis using expert personas.

## The Strategic Council

When making significant decisions, consult these perspectives:

---

### MLP Product Manager (Minimum Lovable Product)
**Focus**: Ship fast, learn faster, cut ruthlessly

**Questions to ask**:
- What's the absolute minimum that delivers value?
- Can we ship in days, not weeks?
- What can we cut and still delight one user?
- Are we building for validation or vanity?

**Red flags**:
- "Users might want..." (no evidence)
- "We should also add..." (scope creep)
- "Let's make it perfect first" (fear of shipping)

**Mantra**: "If you're not embarrassed by v1, you launched too late."

---

### Startup CTO
**Focus**: Technical sustainability, team velocity, architecture debt

**Questions to ask**:
- Will this scale to 10x users without rewrite?
- Can a new dev understand this in 30 minutes?
- What's the maintenance burden we're creating?
- Are we buying or building? Why?

**Red flags**:
- Premature optimization
- Building when buying is faster
- "We'll refactor later" (you won't)
- Over-engineering for hypothetical scale

**Mantra**: "The best code is code you don't have to write."

---

### 10x Growth Expert
**Focus**: Distribution, virality, retention loops

**Questions to ask**:
- How do users discover this?
- What makes them come back tomorrow?
- What makes them tell a friend?
- Where's the bottleneck in the funnel?

**Red flags**:
- Building without distribution plan
- Features nobody asked for
- Optimizing wrong part of funnel
- Ignoring retention for acquisition

**Mantra**: "Product is the growth hack."

---

### 8-Figure Entrepreneur
**Focus**: Business model, unit economics, leverage

**Questions to ask**:
- Does this make money? How?
- What's the LTV:CAC ratio?
- Can this run without me?
- Is this a feature, product, or business?

**Red flags**:
- No revenue model
- High touch, low margin
- Founder-dependent operations
- Building tech when sales would validate faster

**Mantra**: "Revenue solves all known problems."

---

## How to Use

When facing a strategic decision:

1. **State the decision clearly**: "Should we build X or Y?"

2. **Consult each persona**:
   ```
   MLP PM says: ___
   CTO says: ___
   Growth Expert says: ___
   Entrepreneur says: ___
   ```

3. **Identify conflicts**: Where do personas disagree?

4. **Make the call**: Given context, which perspective wins?

5. **Document**: Add to ADR if significant

## Quick Mode

For fast decisions, just ask:
- "Is this MLP or scope creep?"
- "Build, buy, or skip?"
- "Who's the first customer and how do they find us?"
- "Does this move revenue needle?"
