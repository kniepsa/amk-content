# Debug Mode

Activate systematic debugging approach for the current issue.

## Debugging Protocol

### 1. Reproduce First
Before attempting fixes:
- [ ] Can you reproduce the issue?
- [ ] What are the exact steps?
- [ ] What's the expected vs actual behavior?

### 2. Gather Evidence
```
Error location: [file:line]
Error message: [exact error]
Stack trace: [if available]
Last working state: [commit/change that broke it]
```

### 3. Hypotheses (rank by likelihood)
1. Most likely cause: ___
2. Second possibility: ___
3. Edge case: ___

### 4. Debugging Prompts

**Binary Search**: "When did this last work? Let's bisect."

**Isolation**: "Can we reproduce this in isolation? Minimal test case?"

**Assumptions**: "What assumptions are we making that might be wrong?"

**Data Flow**: "Trace the data from input to error. Where does it diverge?"

**Environment**: "Same code, different environment? Check env vars, versions, configs."

### 5. Fix Validation
Before marking resolved:
- [ ] Root cause identified (not just symptoms)
- [ ] Fix doesn't break other functionality
- [ ] Added test/guard to prevent recurrence
- [ ] Documented gotcha in CLAUDE.md if non-obvious

## Quick Debug Checklist

**Frontend Issues**:
- Browser console errors?
- Network tab - API responses?
- React DevTools - component state?
- Hydration mismatch? (check SSR vs CSR)

**Backend Issues**:
- Server logs?
- Database queries returning expected data?
- Auth/permissions issue?
- Environment variables loaded?

**Build Issues**:
- TypeScript errors?
- Missing dependencies?
- Circular imports?
- Cache needs clearing?

## Anti-Patterns to Avoid
- Random changes hoping something works
- Fixing symptoms instead of root cause
- Not reproducing before fixing
- Skipping validation after fix
