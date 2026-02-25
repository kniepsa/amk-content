# Quality Check

Comprehensive quality review for current project. Run anytime to see accumulated findings.

---

## Instructions

### 1. Run Fresh Checks

```bash
# TypeScript/Svelte check
npm run check 2>&1 | head -30

# ESLint
npm run lint 2>&1 | head -30

# File size audit (find files >400 LOC)
find src -name "*.ts" -o -name "*.svelte" | while read f; do
  lines=$(wc -l < "$f" | tr -d ' ')
  if [ $lines -gt 400 ]; then
    echo "$f: $lines lines"
  fi
done | sort -t: -k2 -rn | head -10
```

### 2. Read Accumulated Findings

Read `~/.claude/quality-state/findings.jsonl` and parse:

- Group by severity (critical, high, medium, low)
- Group by type (security, code_size, typescript, ux, accessibility, debug_code, todo)
- Deduplicate by file + message

### 3. Output Report

```
🛡️ QUALITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SUMMARY
Files checked: [count from session-files]
Issues found: [critical] critical, [high] high, [medium] medium

🛑 CRITICAL ([count])
1. [SECURITY] src/lib/config.ts - Potential secret detected
2. [CODE_SIZE] src/components/Modal.svelte - 1262 lines

⚠️ HIGH ([count])
1. [CODE_SIZE] src/routes/+page.svelte - 523 lines

📋 MEDIUM ([count])
1. [TYPESCRIPT] src/lib/utils.ts - 'any' type used 3 times
2. [UX] src/components/Form.svelte - Async without loading state
3. [ACCESSIBILITY] src/components/IconBtn.svelte - Missing aria-label

📈 LARGE FILES (top 5)
1. Modal.svelte: 1262 lines
2. +page.svelte: 523 lines
...

💡 SUGGESTIONS
- Split large components into smaller pieces
- Use 'unknown' + type guards instead of 'any'
- Add loading states to async operations
- Add aria-labels to icon buttons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Actions

Based on findings, offer to:

- **Critical** → Add to NEXT.md "Now" section (blocks shipping)
- **High** → Add to NEXT.md "Up Next" section
- **Medium** → Add to DEBT.md

Ask: "Add findings to NEXT.md/DEBT.md? [Y/n]"

### 5. Clear Findings (Optional)

If all issues are addressed or acknowledged:

```bash
rm ~/.claude/quality-state/findings.jsonl
```

---

## TTS

If critical findings:

```bash
.claude/hooks/play-tts.sh "[N] critical issues need attention"
```

If clean:

```bash
.claude/hooks/play-tts.sh "Quality check passed"
```
