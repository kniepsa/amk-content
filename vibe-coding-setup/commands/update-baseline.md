# Update Visual Baselines

Capture fresh screenshots as the new baseline for visual regression testing.

## Instructions

1. Determine current project from working directory:
   - salvator-standalone → salvator
   - em-hoettche-restaurant-standalone → em-hoettche
   - restaurant-os → restaurant-os

2. Get the deployed URL:
   - Salvator: https://www.salvator-bonn.de
   - Em Höttche: https://www.em-hoettche.de
   - Restaurant OS: https://restaurant-os-three.vercel.app

3. Use chrome-devtools MCP to take screenshots:

   **For Salvator:**
   - / at 1920x1080 → ~/.claude/baselines/salvator/home-desktop.png
   - / at 375x812 → ~/.claude/baselines/salvator/home-mobile.png
   - /speisekarte at 1920x1080 → ~/.claude/baselines/salvator/menu-desktop.png
   - /kontakt at 1920x1080 → ~/.claude/baselines/salvator/contact-desktop.png

   **For Em Höttche:**
   - / at 1920x1080 → ~/.claude/baselines/em-hoettche/home-desktop.png
   - / at 375x812 → ~/.claude/baselines/em-hoettche/home-mobile.png
   - /speisekarte at 1920x1080 → ~/.claude/baselines/em-hoettche/menu-desktop.png
   - /kontakt at 1920x1080 → ~/.claude/baselines/em-hoettche/contact-desktop.png

   **For Restaurant OS:**
   - /admin at 1920x1080 → ~/.claude/baselines/restaurant-os/admin-desktop.png

4. Report:
   ```
   BASELINES UPDATED - [project]

   [x] home-desktop.png
   [x] home-mobile.png
   [x] menu-desktop.png
   [x] contact-desktop.png

   Visual regression baselines are now current.
   Use /check-design to compare future deploys.
   ```

## Notes

- Run this after intentional design changes
- Baselines stored in ~/.claude/baselines/[project]/
- Each screenshot overwrites the previous baseline
