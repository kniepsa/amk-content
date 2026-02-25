---
name: decision-chain
description: Strategic decision-making pipeline with research, multi-persona analysis, and documentation. Use for architecture decisions, technology choices, build-vs-buy, strategic pivots. Triggers on "should we", "what's the best approach", "decision", "evaluate options", "compare approaches".
invocation: auto
---

# Strategic Decision Chain

Structured pipeline for making and documenting important decisions. Combines research, multi-persona analysis, and permanent documentation.

Accept `$ARGUMENTS` as the decision question or topic. If no arguments, ask: "What decision are we trying to make?"

---

## TTS Notifications

All `**TTS**` markers in this skill should be spoken via `.claude/hooks/play-tts.sh` if available, otherwise fall back to macOS `say` command. This provides audio feedback at phase transitions.

---

## Pipeline Overview

```
CLARIFY --> RESEARCH --> ANALYZE --> DECIDE --> PLAN
   |           |            |          |         |
 scope it   serper/     /strategy    /adr     /pm +
           context7   /advisory            /architect
                      -debate
```

---

## Phase 1: CLARIFY

**Goal**: Define exactly what we are deciding.

**Actions**:

1. State the decision clearly in one sentence
2. Identify the decision type:

| Type              | Examples                       | Analysis Depth     |
| ----------------- | ------------------------------ | ------------------ |
| Technology choice | "Supabase vs Turso?"           | RESEARCH + ANALYZE |
| Architecture      | "Monolith vs microservices?"   | RESEARCH + ANALYZE |
| Build vs Buy      | "Build auth or use Clerk?"     | RESEARCH + ANALYZE |
| Feature priority  | "Feature A or B first?"        | ANALYZE only       |
| Strategic pivot   | "New market or double down?"   | Full pipeline      |
| Quick trade-off   | "Server components or client?" | Quick mode         |

3. Define constraints:
   ```
   DECISION: [one sentence]
   TYPE: [Technology / Architecture / Build-vs-Buy / Priority / Strategy]
   CONSTRAINTS:
   - Timeline: [when do we need to decide?]
   - Budget: [cost constraints?]
   - Team: [skill constraints?]
   - Existing commitments: [what is already decided?]
   ```

**Output**:

```
DECISION CHAIN: CLARIFY
================================================
[>] CLARIFY   - Defining decision scope
[ ] RESEARCH  - Gather data
[ ] ANALYZE   - Multi-persona review
[ ] DECIDE    - Record decision
[ ] PLAN      - Implementation (if needed)
================================================

Decision: [clear statement]
Type: [type]
Constraints: [list]
```

**Validation Gate**:

- [ ] Decision stated in one sentence
- [ ] Type identified
- [ ] Constraints listed

**TTS**: `"Decision scoped. Researching."`

---

## Phase 2: RESEARCH

**Goal**: Gather current, relevant data before analyzing.

**Actions**:

1. Use serper MCP to search for:
   - Current comparisons and benchmarks
   - Community sentiment and adoption trends
   - Known issues and limitations
   - Pricing and licensing details
2. Use context7 MCP to check:
   - Official documentation for each option
   - Migration guides and compatibility
   - Performance benchmarks
3. Check existing CLAUDE.md for relevant gotchas
4. Compile findings into structured format

**Research Template**:

```
OPTION A: [name]
- Pros: [list]
- Cons: [list]
- Cost: [pricing details]
- Maturity: [stable/beta/experimental]
- Community: [large/medium/small]
- Our experience: [used before? gotchas?]

OPTION B: [name]
- Pros: [list]
- Cons: [list]
- Cost: [pricing details]
- Maturity: [stable/beta/experimental]
- Community: [large/medium/small]
- Our experience: [used before? gotchas?]
```

**Output**:

```
DECISION CHAIN: RESEARCH
================================================
[x] CLARIFY   - Decision scoped
[>] RESEARCH  - Gathering data...
[ ] ANALYZE   - Multi-persona review
[ ] DECIDE    - Record decision
[ ] PLAN      - Implementation (if needed)
================================================

Findings summary:
- Option A: [key finding]
- Option B: [key finding]
- Market consensus: [what most people recommend]
```

**Validation Gate**:

- [ ] At least 2 options researched
- [ ] Pros/cons documented for each
- [ ] Current information (not outdated)

**TTS**: `"Research complete. Analyzing options."`

**Skip RESEARCH when**: The decision is internal (feature priority, naming) and does not need external data.

---

## Phase 3: ANALYZE

**Goal**: Multi-perspective analysis of the options.

**Actions**:
Choose analysis depth based on decision importance:

| Decision Impact                | Analysis Tool      | Personas                                        |
| ------------------------------ | ------------------ | ----------------------------------------------- |
| Critical (irreversible)        | `/advisory-debate` | 5 experts (CTO, GTM, Product, UX, Entrepreneur) |
| Important (significant effort) | `/strategy`        | 4 personas (MLP PM, CTO, Growth, Entrepreneur)  |
| Moderate (some effort)         | Quick analysis     | 2 perspectives (Technical + Business)           |
| Minor (easily reversible)      | Skip to DECIDE     | Just decide                                     |

For `/advisory-debate` or `/strategy`, include research findings as context.

**Analysis Framework** (if not using a dedicated command):

```
TECHNICAL PERSPECTIVE:
- Feasibility: [1-10]
- Maintenance burden: [low/medium/high]
- Integration complexity: [low/medium/high]
- Scalability: [assessment]

BUSINESS PERSPECTIVE:
- Revenue impact: [positive/neutral/negative]
- Time to market: [fast/medium/slow]
- Risk level: [low/medium/high]
- Opportunity cost: [what we cannot do if we choose this]
```

**Output**:

```
DECISION CHAIN: ANALYZE
================================================
[x] CLARIFY   - Decision scoped
[x] RESEARCH  - Data gathered
[>] ANALYZE   - Multi-persona review...
[ ] DECIDE    - Record decision
[ ] PLAN      - Implementation (if needed)
================================================

Analysis Summary:
| Perspective  | Option A | Option B |
| ------------ | -------- | -------- |
| Technical    | [score]  | [score]  |
| Business     | [score]  | [score]  |
| Risk         | [level]  | [level]  |

Consensus: [option] with [conditions]
Unresolved tensions: [if any]
```

**Validation Gate**:

- [ ] Multiple perspectives considered
- [ ] Trade-offs explicitly stated
- [ ] Recommendation formed

**TTS**: `"Analysis complete. Ready to decide."`

---

## Phase 4: DECIDE

**Goal**: Make the decision and document it permanently.

**Actions**:

1. Present the recommendation to the user
2. Get user confirmation (they own the decision)
3. Run the `/adr` command to create an Architecture Decision Record:
   ```
   Title: [decision]
   Context: [why this decision was needed + constraints]
   Decision: [what we chose]
   Consequences: [what this means going forward]
   ```

**Output**:

```
DECISION CHAIN: DECIDE
================================================
[x] CLARIFY   - Decision scoped
[x] RESEARCH  - Data gathered
[x] ANALYZE   - Perspectives reviewed
[>] DECIDE    - Recording...
[ ] PLAN      - Implementation (if needed)
================================================

DECISION: [what was chosen]
RATIONALE: [why, in one sentence]
ADR: .claude/decisions/[NNN]-[slug].md

Conditions:
- [condition or constraint on the decision]
- [review trigger: revisit if X happens]
```

**Validation Gate**:

- [ ] User confirmed the decision
- [ ] ADR created in `.claude/decisions/`
- [ ] Consequences documented

**TTS**: `"Decision recorded. ADR created."`

---

## Phase 5: PLAN (Conditional)

**Goal**: If the decision requires implementation, kick off the implementation pipeline.

**Trigger**: Only if the decision leads to building something.

**Actions**:

1. If implementation needed:
   - Run the `/pm` command with the decided approach
   - Run the `/architect` command for system design
   - Or trigger the `dev-pipeline` skill for full pipeline
2. If no implementation needed:
   - Mark decision chain as complete
   - Update NEXT.md if future action is required

**Output**:

```
DECISION CHAIN: COMPLETE
================================================
[x] CLARIFY   - Decision scoped
[x] RESEARCH  - Data gathered
[x] ANALYZE   - Perspectives reviewed
[x] DECIDE    - ADR-[NNN] created
[x] PLAN      - [Implementation started / No action needed]
================================================

Decision: [summary]
Next step: [what happens now]
```

**TTS**: `"Decision chain complete."`

---

## Quick Decision Mode

For minor, easily-reversible decisions:

```
User: "Should I use SWR or TanStack Query?"

Quick analysis:
- SWR: Simpler, smaller bundle, Vercel-maintained
- TanStack Query: More features, better devtools, broader ecosystem
- Our stack: Next.js + Supabase
- Recommendation: TanStack Query (better mutation support for Supabase)

Decision: TanStack Query
[ADR created if user confirms]
```

Skip RESEARCH and ANALYZE for quick decisions. Just provide the recommendation with brief rationale.

---

## Context Files

```
context_files:
  - .claude/CLAUDE.md (existing gotchas and patterns)
  - .claude/decisions/*.md (previous decisions)
  - .claude/DEBT.md (existing debt may influence decisions)
```

---

## MCP Server Usage

| Phase    | MCP Servers                                   |
| -------- | --------------------------------------------- |
| RESEARCH | serper (web search), context7 (official docs) |
| ANALYZE  | none (internal reasoning)                     |
| PLAN     | context7 (implementation patterns)            |
