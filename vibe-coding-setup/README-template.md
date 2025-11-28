# [Project Name]

> [One-line description of what this project does]

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
pnpm dev

# Build for production
pnpm build
```

## What This Does

[2-3 sentences describing the project's purpose and main features]

## Stack

- [Framework] (e.g., Next.js 14)
- [Database] (e.g., Supabase PostgreSQL)
- [Styling] (e.g., Tailwind CSS)
- [Deployment] (e.g., Vercel)

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL` - Database connection string
- `NEXT_PUBLIC_API_URL` - API endpoint URL

## Deploy

```bash
# Deploy to production
pnpm build
# Push to main branch → Vercel auto-deploys
```

## Project Structure

```
src/
├── app/          # Next.js app directory
├── components/   # React components
├── lib/          # Utilities and helpers
└── types/        # TypeScript types
```

## Common Tasks

### Run Tests
```bash
pnpm test
```

### Type Check
```bash
pnpm validate:types
```

### Lint
```bash
pnpm lint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Project-specific docs in .claude/](./.claude/CLAUDE.md)

---

For detailed architecture, gotchas, and invariants, see [.claude/CLAUDE.md](./.claude/CLAUDE.md)
