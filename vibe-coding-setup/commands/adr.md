Create an Architecture Decision Record:

1. Count existing ADRs in `.claude/decisions/`
2. Next number = count + 1 (padded to 3 digits: 001, 002, etc.)

3. Ask for (or parse from argument):
   - **Title**: What decision? (e.g., "Use Supabase RLS for multi-tenancy")
   - **Context**: Why was this needed? (1-2 sentences)
   - **Decision**: What did we choose? (1 sentence)
   - **Consequences**: What does this mean? (1-2 bullet points)

4. Create `.claude/decisions/[NUMBER]-[slug].md`:

   ```markdown
   # [NUMBER]: [Title]

   ## Context

   [Why this decision was needed]

   ## Decision

   [What we chose]

   ## Consequences

   - [Consequence 1]
   - [Consequence 2]
   ```

5. Keep under 15 lines total.

6. Confirm: "✓ Created ADR [NUMBER]: [Title]"

Example: `/adr Use Supabase for auth because we need RLS`
