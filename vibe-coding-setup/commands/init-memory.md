Initialize vibe coding memory for this project:

1. Create `.claude/` directory if it doesn't exist
2. Create `.claude/decisions/` directory

3. Analyze the project:
   - Read package.json for stack detection
   - Scan folder structure for architecture patterns
   - Identify key services/components

4. Generate `.claude/CLAUDE.md` (~30 lines max):

   ```markdown
   # [Project Name from package.json]

   ## The Graph

   [Infer data flow from folder structure, e.g.: User → API Routes → Services → Database]

   ## Invariants (NEVER break)

   - [Infer from existing patterns, or use placeholders]

   ## Gotchas

   - [Leave as TODO for user to fill]

   ## Stack

   [Detected from package.json]

   ## Commands

   [From package.json scripts]
   ```

5. Create `.claude/NEXT.md`:

   ```markdown
   # Next Actions

   ## Now

   - [ ] [Ask user: What are you working on?]

   ## Up Next

   - [ ]
   ```

6. Create `.claude/GOLDEN_PATH.md` based on detected stack

7. Symlink global post-commit hook if git repo:
   `ln -sf ~/.claude/hooks/post-commit.mjs .git/hooks/post-commit`

Keep everything lean. Total lines < 60.
