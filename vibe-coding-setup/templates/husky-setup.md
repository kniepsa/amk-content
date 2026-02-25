# Pre-Commit Hooks Setup (Husky + lint-staged)

Quick setup for any TypeScript/Next.js project.

## Installation

```bash
# Install dependencies
pnpm add -D husky lint-staged eslint prettier typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin jscpd

# Initialize husky
pnpm exec husky init

# Create pre-commit hook
echo 'pnpm lint-staged' > .husky/pre-commit
```

## Configuration

### Add to package.json:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "dry-check": "jscpd src/"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

## Copy Config Files

```bash
# From vibe-coding-setup templates
cp ~/Projects/amk-content/vibe-coding-setup/templates/eslint.config.mjs .
cp ~/Projects/amk-content/vibe-coding-setup/templates/.prettierrc .
cp ~/Projects/amk-content/vibe-coding-setup/templates/.jscpd.json .

# Claude Code hooks (auto-format on edit)
mkdir -p .claude
cp ~/Projects/amk-content/vibe-coding-setup/templates/.claude/settings.json .claude/

# Merge strict TypeScript settings into your tsconfig.json
# See: ~/Projects/amk-content/vibe-coding-setup/templates/tsconfig.strict.json
```

## DRY Code Detection (jscpd)

jscpd detects copy/paste code across files - something ESLint can't do.

### Add to pre-commit hook:

Update `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Lint staged files
pnpm lint-staged

# Check for code duplication
pnpm dry-check || echo "⚠️ Duplicate code detected - consider refactoring"
```

### Configure thresholds in .jscpd.json:

- `minLines: 5` - Minimum lines to consider duplicate
- `minTokens: 50` - Minimum tokens to consider duplicate
- `threshold: 5` - Max % duplication allowed

## What Happens

On every `git commit`:

1. **lint-staged** runs on staged files only (fast!)
2. **ESLint** checks for errors and auto-fixes what it can
3. **Prettier** formats the code
4. **jscpd** checks for code duplication (warns but doesn't block)
5. **If ESLint/Prettier fails** → commit is rejected

## Bypass (Emergency Only)

```bash
# Skip hooks (use sparingly!)
git commit --no-verify -m "emergency fix"
```

## Troubleshooting

### "husky: command not found"

```bash
pnpm exec husky install
```

### ESLint taking too long

Add to `.eslintignore`:

```
node_modules
.next
dist
build
```

### Prettier conflicts with ESLint

Install eslint-config-prettier:

```bash
pnpm add -D eslint-config-prettier
```
