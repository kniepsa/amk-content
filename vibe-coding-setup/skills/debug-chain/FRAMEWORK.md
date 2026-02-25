# Taylor Singh's 8-Step Debugging Framework

Complete reference for the systematic debugging approach used in the debug-chain skill.

---

## Overview

The framework is designed to prevent the most common debugging anti-pattern: making random changes and hoping the bug goes away. Instead, it enforces a disciplined sequence that builds understanding before attempting fixes.

```
1. Reproduce  -> Can you trigger it reliably?
2. Isolate    -> Where exactly is it happening?
3. Gather     -> What evidence do we have?
4. Hypothesize -> What could cause this?
5. Test       -> Which hypothesis is correct?
6. Trace      -> Follow the data flow
7. Fix        -> Apply minimal correction
8. Document   -> Prevent recurrence
```

---

## Step 1: Reproduce

**Purpose**: Confirm the bug exists and understand its boundaries.

**Questions to answer**:

- Can you reproduce the issue consistently?
- What are the exact steps to trigger it?
- What is expected vs actual behavior?
- Does it happen every time or intermittently?
- Does it happen in all environments or only specific ones?

**Techniques**:

- Follow the exact user-reported steps
- Try different browsers/devices
- Try with different data (empty, large, special characters)
- Check if it reproduces after clearing cache
- Note the exact error message and location

**If you cannot reproduce**:

- Ask for more details about the environment
- Check for race conditions (timing-dependent bugs)
- Check for data-dependent behavior (specific user, specific record)
- Try with the exact same data the user had
- Check server logs for the time of the report

---

## Step 2: Isolate

**Purpose**: Narrow down from "something is broken" to "this specific thing is broken."

**Narrowing strategies**:

### By Layer

```
Frontend (Browser)
  -> Component rendering
  -> State management
  -> Event handlers
API Layer
  -> Request formation
  -> Route handling
  -> Response parsing
Backend (Server)
  -> Business logic
  -> Database queries
  -> External service calls
Infrastructure
  -> Environment config
  -> Deployment settings
  -> Network/DNS
```

### By Time

- `git log --oneline -20`: What changed recently?
- `git bisect`: Binary search for the breaking commit
- "When did this last work?" narrows the search dramatically

### By Scope

- Does it affect one user or all users?
- Does it affect one record or all records?
- Does it affect one page or all pages?
- Does it happen on one browser or all browsers?

### Minimal Reproduction

Create the simplest possible case that still shows the bug:

- Remove unrelated code
- Use hardcoded data instead of API calls
- Test in isolation (single component, single function)

---

## Step 3: Gather Evidence

**Purpose**: Collect all available diagnostic information before theorizing.

**Evidence template**:

```
Error location: [file:line]
Error message:  [exact error text]
Stack trace:    [if available]
Browser console: [any warnings or errors]
Network tab:    [request/response details]
Server logs:    [relevant log entries]
Last working:   [commit hash or date]
Recent changes: [what changed since it worked]
Environment:    [Node version, browser, OS]
Data state:     [relevant database state]
```

**Common evidence sources**:

| Source          | What to check                      |
| --------------- | ---------------------------------- |
| Browser console | JavaScript errors, React warnings  |
| Network tab     | API status codes, response bodies  |
| Server logs     | Unhandled exceptions, query errors |
| Git diff        | Recent code changes                |
| Database        | Data integrity, missing records    |
| Environment     | .env variables, Node version       |

---

## Step 4: Form Hypotheses

**Purpose**: Create ranked theories based on evidence, not guesses.

**Ranking criteria**:

1. **Most likely**: Matches the evidence best, simplest explanation
2. **Second option**: Also possible, less obvious
3. **Edge case**: Unlikely but worth considering

**Common hypothesis categories**:

| Category    | Example Hypotheses                         |
| ----------- | ------------------------------------------ |
| Data        | Null value where expected, wrong format    |
| Logic       | Off-by-one, wrong comparison operator      |
| State       | Race condition, stale data, missing update |
| Config      | Wrong env variable, missing permission     |
| Integration | API changed, dependency updated            |
| Caching     | Stale cache, missing invalidation          |

**Hypothesis format**:

```
H1: [hypothesis]
    Evidence for: [what supports this]
    Evidence against: [what contradicts this]
    Test: [how to confirm or eliminate]
```

---

## Step 5: Test Hypotheses

**Purpose**: Systematically confirm or eliminate each hypothesis.

**Testing techniques**:

### Add Strategic Logging

```typescript
console.log("[DEBUG] variable:", JSON.stringify(variable));
console.log("[DEBUG] reached checkpoint A");
console.log("[DEBUG] condition result:", condition);
```

### Binary Search (Code)

Comment out half the code. Does the bug persist?

- Yes: Bug is in the remaining code
- No: Bug is in the commented code
  Repeat with the identified half.

### Assumption Check

For each assumption in the code path:

- "We assume this value is not null" -- is it?
- "We assume this API returns 200" -- does it?
- "We assume this runs before that" -- does it?

### Swap Test

Replace the suspected component with a known-good version:

- Hardcode the value instead of computing it
- Use a mock instead of the real service
- Return a constant instead of a database query

---

## Step 6: Trace Data Flow

**Purpose**: Follow the data from source to symptom to find where it diverges.

**Tracing template**:

```
INPUT:  [where data enters the system]
  -> [transformation 1]: [expected result] vs [actual result]
  -> [transformation 2]: [expected result] vs [actual result]
  -> [transformation 3]: [expected result] vs [actual result]
OUTPUT: [where the bug manifests]

DIVERGENCE POINT: [transformation N]
```

**Common data flow issues**:

| Pattern            | Issue                     |
| ------------------ | ------------------------- |
| API -> Frontend    | Response format mismatch  |
| Form -> API        | Missing field, wrong type |
| DB -> Service      | Null field, missing join  |
| Service -> Service | Serialization error       |
| Config -> Runtime  | Env variable not loaded   |

---

## Step 7: Fix and Validate

**Purpose**: Apply the minimal correct fix and verify it works.

**Fix checklist**:

- [ ] Root cause identified (not just symptoms)
- [ ] Fix is the smallest possible change
- [ ] Fix does not introduce new behavior changes
- [ ] Fix does not break other functionality
- [ ] Added guard/check to prevent recurrence
- [ ] Tests updated or added for this case

**Validation checklist**:

- [ ] Original bug no longer reproduces
- [ ] All existing tests still pass
- [ ] Edge cases near the fix work correctly
- [ ] No new console warnings or errors
- [ ] Build succeeds
- [ ] Lint and typecheck pass

---

## Step 8: Document

**Purpose**: Make sure this bug (or similar ones) never wastes time again.

**Documentation targets**:

| What to Document       | Where                      | When                |
| ---------------------- | -------------------------- | ------------------- |
| Non-obvious root cause | CLAUDE.md Gotchas          | Always              |
| Architectural insight  | ADR (`.claude/decisions/`) | If cross-cutting    |
| Workaround or shortcut | DEBT.md                    | If fix is not ideal |
| Regression test        | Test file                  | If no test existed  |
| Process improvement    | Session-end notes          | If workflow issue   |

**Gotcha format** (for CLAUDE.md):

```
- **[Topic]**: [One-line description of what was wrong and how to avoid it]
```

Keep gotchas concise (max 150 characters). If more detail is needed, create an ADR instead.

---

## Framework-Specific Debugging Guides

### Next.js / React

- **Hydration mismatch**: Check for browser-only APIs in server components
- **Caching**: Use `revalidatePath()` or `revalidateTag()`
- **Metadata**: Must be in `page.tsx`, not `layout.tsx`
- **Server vs Client**: Check "use client" directive placement
- **Suspense**: Missing loading.tsx or Suspense boundary

### Supabase

- **Empty results**: Usually missing RLS policy, not empty table
- **Insert returns null**: Need `.select()` after `.insert()`
- **Auth errors**: Check if `.error` is handled before `.data`
- **Permission denied**: Verify RLS policies match the user role
- **Real-time not updating**: Check channel subscription and RLS

### TypeScript

- **Type mismatch**: Check generic constraints and inference
- **Implicit any**: Add explicit type annotations
- **Null/undefined**: Use optional chaining (`?.`) and nullish coalescing (`??`)
- **Union types**: Use type guards or discriminated unions
- **Module not found**: Check tsconfig paths and module resolution

### Vercel / Deployment

- **Works locally, fails deployed**: Check env variables in Vercel dashboard
- **Edge runtime errors**: Not all Node APIs available at edge
- **Build timeout**: Check for heavy imports or circular dependencies
- **Cold start slow**: Consider edge runtime for API routes

---

## Debugging Prompts (Quick Reference)

Use these questions to guide investigation when stuck:

- **Binary Search**: "When did this last work? Can we git bisect?"
- **Isolation**: "Can we reproduce in a fresh component? Minimal test case?"
- **Assumptions**: "What assumptions are we making that might be wrong?"
- **Data Flow**: "Trace the data from input to error point."
- **Environment**: "Same code works elsewhere? Check env vars, Node version, configs."
- **Dependencies**: "Did a dependency update recently? Check package-lock.json diff."
- **Timing**: "Is this a race condition? Does adding a delay change the behavior?"
- **State**: "What is the state at the moment of the error? Log it."
