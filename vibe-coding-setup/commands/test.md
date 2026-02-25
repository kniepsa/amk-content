# Test Workflow

TDD + Visual Testing mit Playwright MCP.

## Instructions

### 1. Detect Test Framework

Check project for:

- `jest.config.*` → Jest
- `vitest.config.*` → Vitest
- `playwright.config.*` → Playwright E2E
- `package.json` scripts → `test`, `test:unit`, `test:e2e`

### 2. Run Unit Tests

```bash
pnpm test || npm test || yarn test
```

Report results:

```
🧪 Unit Tests
━━━━━━━━━━━━━━
✅ 42 passed
❌ 0 failed
⏱️ 2.3s
```

### 3. Visual Testing (If Frontend Changes)

**Check for UI changes:**

- `.tsx`, `.jsx`, `.vue`, `.svelte` files modified
- CSS/SCSS/Tailwind changes
- Component changes

**If UI changes detected:**

1. Enable Playwright MCP (if not already):

   ```
   /mcp enable playwright
   ```

2. Take screenshots of affected pages:
   - Use Playwright MCP to navigate to relevant URLs
   - Capture current state

3. Run `/ux-review` on the screenshots:
   - Joe Gebbia's 5 principles check
   - Technical UX checklist
   - Mobile-first verification

### 4. Report Results

```
🧪 Test Results
━━━━━━━━━━━━━━━━━━━━━━━━━━
Unit Tests:  ✅ 42 passed
E2E Tests:   ✅ 8 passed (or ⏭️ skipped)
Visual:      ✅ No regressions
UX Check:    ✅ Passed (or 🛑 Blocked)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready to ship: ✅ Yes / 🛑 No
```

### 5. Handle Failures

**If tests fail:**

- Show failing test names and errors
- Suggest fixes based on error messages
- Do NOT proceed to `/ship`

**If UX check fails:**

- Show blockers from `/ux-review`
- Must fix before shipping

## Flags

- `/test` - Run all tests
- `/test unit` - Unit tests only
- `/test visual` - Visual/UX tests only
- `/test --fix` - Auto-fix lint issues before testing

## Integration

- Runs before `/ship` if `--test` flag used
- Uses Playwright MCP for visual regression
- Uses `/ux-review` for UX validation
- Respects project's existing test configuration
