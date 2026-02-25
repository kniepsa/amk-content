# Visual Regression Check

Automated visual regression check for deployed sites.

## Instructions

1. Determine current project from working directory:
   - salvator-standalone → salvator
   - em-hoettche-restaurant-standalone → em-hoettche
   - restaurant-os → restaurant-os

2. Get the deployed URL:
   - Salvator: https://www.salvator-bonn.de
   - Em Höttche: https://www.em-hoettche.de
   - Restaurant OS: https://restaurant-os-three.vercel.app

3. Use chrome-devtools MCP to screenshot key pages:

   **For Salvator:**
   - / (home) at 1920x1080 (desktop)
   - / (home) at 375x812 (mobile)
   - /speisekarte (menu)
   - /kontakt (contact)

   **For Em Höttche:**
   - / (home) at 1920x1080 (desktop)
   - / (home) at 375x812 (mobile)
   - /speisekarte (menu)
   - /kontakt (contact)

   **For Restaurant OS:**
   - /admin (dashboard)

4. Compare screenshots to baselines in `~/.claude/baselines/[project]/`

5. Report results:

   ```
   VISUAL REGRESSION CHECK - [project]

   [page]: PASS | WARNING | FAIL
   - PASS: <1% pixel diff
   - WARNING: 1-5% diff
   - FAIL: >5% diff
   ```

6. If any FAIL:
   - Show what changed
   - Ask: "Update baseline or investigate?"

## Notes

- Baselines stored in ~/.claude/baselines/[project]/
- First run will have no baselines - offer to create them
- Use /update-baseline to refresh baselines after intentional changes
