---
name: deploy-check
description: Post-deployment verification that tests the live site after shipping. Checks critical paths, console errors, and visual regression. Use after /ship to verify deployment succeeded. Triggers on "check deployment", "verify deploy", "is it working in production".
invocation: manual
allowed_tools:
  - Bash
  - Read
  - Glob
  - Grep
  - WebFetch
---

# Post-Deploy Verification

Verify that a deployment is working correctly by testing the live site. Uses Playwright MCP for browser automation.

Accept `$ARGUMENTS` as the deployed URL. If no arguments, detect from:

1. Vercel project URL in `.claude/CLAUDE.md`
2. `package.json` homepage field
3. Ask the user for the URL

---

## Pre-Check

Before starting verification:

1. **Wait for deployment**: Check if Vercel build is complete

   ```bash
   # If using Vercel CLI
   vercel ls --limit 1
   ```

   If deployment is still building, wait and re-check every 30 seconds (max 5 minutes).

2. **Determine test scope**: Based on what was shipped
   - Read recent git commits to understand what changed
   - Focus verification on changed features

---

## Verification Steps

### Step 1: Basic Availability

Use Playwright MCP to navigate to the deployed URL:

```
Action: browser_navigate to $URL
Expected: Page loads without errors
Check: HTTP status 200, no redirect loops
```

If the page does not load:

```
DEPLOY CHECK: FAILED
================================================
[x] Deployment detected
[>] Availability check - FAILED

Error: [page load error]
Action: Check Vercel deployment logs
URL: https://vercel.com/[project]/deployments
================================================
```

### Step 2: Console Error Check

```
Action: browser_console_messages
Expected: No errors (warnings are acceptable)
```

Categorize console output:

- **Errors**: Block pass, must investigate
- **Warnings**: Note but do not block
- **Info**: Ignore

### Step 3: Critical Path Testing

Test the core user flows based on the project type:

**For web applications**:

| Test             | Action                                | Expected                       |
| ---------------- | ------------------------------------- | ------------------------------ |
| Homepage loads   | Navigate to `/`                       | Content renders, no blank page |
| Navigation works | Click main nav items                  | Pages load correctly           |
| Auth flow        | Navigate to login page                | Form renders, inputs work      |
| API health       | Navigate to `/api/health` (if exists) | Returns 200                    |
| Main feature     | Navigate to primary feature page      | Core functionality accessible  |

**For content sites**:

| Test           | Action                   | Expected                        |
| -------------- | ------------------------ | ------------------------------- |
| Homepage loads | Navigate to `/`          | Content visible                 |
| Navigation     | Click through main pages | All pages load                  |
| Images         | Check key images         | Images load, correct dimensions |
| Links          | Check internal links     | No 404s                         |

Use Playwright MCP actions:

- `browser_navigate`: Go to pages
- `browser_snapshot`: Capture page state
- `browser_click`: Test interactions
- `browser_fill_form`: Test form inputs (if applicable)
- `browser_console_messages`: Check for errors after each action

### Step 4: Visual Regression Check

Compare current state with baseline (if baseline exists):

1. Check for `.claude/baselines/` directory
2. If baselines exist:
   - Take screenshot of each baselined page
   - Compare with stored baseline
   - Report differences
3. If no baselines:
   - Take screenshots of key pages
   - Suggest running `/update-baseline` to save them

### Step 5: Performance Quick Check

While on the page, note:

- Page load time (from navigation to content visible)
- Any visible layout shifts during load
- Loading indicators present for async content
- No blank screens or flash of unstyled content

---

## Output Format

### All Checks Pass

```
DEPLOY CHECK: PASSED
================================================
URL: [deployed URL]
Time: [timestamp]

AVAILABILITY:  PASS - Page loads in [N]ms
CONSOLE:       PASS - No errors
CRITICAL PATH: PASS - [N/N] flows verified
VISUAL:        PASS - No regressions detected
PERFORMANCE:   PASS - No issues noted
================================================

Deployment verified. Production is healthy.
```

### Some Checks Fail

```
DEPLOY CHECK: ISSUES FOUND
================================================
URL: [deployed URL]
Time: [timestamp]

AVAILABILITY:  PASS
CONSOLE:       WARN - [N] warnings
CRITICAL PATH: FAIL - [description of failure]
VISUAL:        PASS
PERFORMANCE:   WARN - Layout shift detected on [page]

ISSUES:
1. [CRITICAL PATH] [specific failure description]
   - Page: [URL]
   - Expected: [what should happen]
   - Actual: [what happened]
   - Suggested fix: [recommendation]

2. [PERFORMANCE] Layout shift on [page]
   - Suggested fix: [recommendation]

================================================
Action needed: Fix critical path issue before considering deployment stable.
```

### Deployment Failed

```
DEPLOY CHECK: FAILED
================================================
URL: [deployed URL]
Time: [timestamp]

AVAILABILITY:  FAIL - [error description]

The site is not reachable. Check:
1. Vercel deployment logs
2. DNS configuration
3. Build output for errors
================================================
```

---

## Post-Check Actions

Based on results:

| Result                | Action                                    |
| --------------------- | ----------------------------------------- |
| All pass              | No action needed. Deployment is healthy.  |
| Warnings only         | Log to DEBT.md for future attention       |
| Critical path failure | Add to NEXT.md "Now" for immediate fix    |
| Deployment failed     | Investigate build logs, consider rollback |

---

## TTS Notifications

All TTS markers should be spoken via `.claude/hooks/play-tts.sh` if available, otherwise fall back to macOS `say` command.

```
Pass:    "Deployment verified. All checks pass."
Warning: "Deployment has [N] warnings. Check the report."
Fail:    "Deployment check failed. [specific issue]."
```

---

## MCP Server Usage

| Step       | MCP Server | Actions Used                               |
| ---------- | ---------- | ------------------------------------------ |
| Navigate   | playwright | browser_navigate                           |
| Interact   | playwright | browser_click, browser_fill_form           |
| Verify     | playwright | browser_snapshot, browser_console_messages |
| Screenshot | playwright | browser_take_screenshot                    |

---

## Context Files

```
context_files:
  - .claude/CLAUDE.md (deployment URL, project config)
  - .claude/baselines/ (visual regression baselines)
```
