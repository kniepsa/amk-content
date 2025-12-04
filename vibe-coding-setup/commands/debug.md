# Debug Mode - Taylor Singh's 8-Step Framework

Activate systematic debugging for the current issue.

## The 8 Steps

### Step 1: Reproduce
Before anything else:
- [ ] Can you reproduce the issue consistently?
- [ ] What are the exact steps to trigger it?
- [ ] What's expected vs actual behavior?

### Step 2: Isolate
Narrow down the problem:
- [ ] Which component/file is responsible?
- [ ] Can you create a minimal reproduction?
- [ ] Does it happen in isolation or only in context?

### Step 3: Gather Evidence
```
Error location: [file:line]
Error message: [exact error]
Stack trace: [if available]
Last working state: [commit/change that broke it]
```

### Step 4: Form Hypotheses
Rank by likelihood:
1. Most likely cause: ___
2. Second possibility: ___
3. Edge case to consider: ___

### Step 5: Test Hypotheses
For each hypothesis:
- Add logging/breakpoints to confirm or eliminate
- Binary search: "When did this last work?"
- Check assumptions: "What are we assuming that might be wrong?"

### Step 6: Trace Data Flow
Follow the data from input to error:
- Where does it enter the system?
- What transformations happen?
- Where does it diverge from expected?

### Step 7: Fix & Validate
Before marking resolved:
- [ ] Root cause identified (not just symptoms)
- [ ] Fix doesn't break other functionality
- [ ] Added test/guard to prevent recurrence

### Step 8: Document
- [ ] Add gotcha to CLAUDE.md if non-obvious
- [ ] Update DEBT.md if technical debt created
- [ ] Consider ADR if architectural insight gained

---

## Quick Checklists

### Frontend Issues
- [ ] Browser console errors?
- [ ] Network tab - API responses correct?
- [ ] React DevTools - component state?
- [ ] Hydration mismatch? (SSR vs CSR)
- [ ] Check `revalidatePath()` for caching issues

### Backend Issues
- [ ] Server logs showing errors?
- [ ] Database queries returning expected data?
- [ ] Auth/permissions blocking access?
- [ ] Environment variables loaded correctly?
- [ ] Supabase: Check `.error` before `.data`

### Build Issues
- [ ] TypeScript errors in output?
- [ ] Missing dependencies in package.json?
- [ ] Circular imports detected?
- [ ] Clear `.next/cache` and `node_modules/.cache`

---

## Debugging Prompts

Use these to guide investigation:

**Binary Search**: "When did this last work? Let's git bisect."

**Isolation**: "Can we reproduce in a fresh component? Minimal test case?"

**Assumptions**: "What assumptions are we making that might be wrong?"

**Data Flow**: "Trace the data from input to error point."

**Environment**: "Same code works elsewhere? Check env vars, Node version, configs."

**Dependencies**: "Did a dependency update recently? Check package-lock.json diff."

---

## Anti-Patterns to Avoid

- Random changes hoping something works
- Fixing symptoms instead of root cause
- Not reproducing before attempting fix
- Skipping validation after fix
- Not documenting the gotcha for next time
