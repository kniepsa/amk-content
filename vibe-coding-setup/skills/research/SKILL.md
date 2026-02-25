---
name: research
description: Real-time research skill that searches the web and official docs to answer technical questions with current information. Use when you need up-to-date information, best practices, or solutions that might be newer than training data. Triggers on "research", "look up", "what's the latest", "find best practice for".
invocation: auto
allowed_tools:
  - WebSearch
  - WebFetch
  - Read
  - Write
  - Edit
---

# Real-Time Research

Search the web and official documentation to answer questions with current, verified information. Synthesize findings into actionable summaries.

Accept `$ARGUMENTS` as the research topic or question. If no arguments, ask: "What do you want to research?"

---

## TTS Notifications

All `**TTS**` markers in this skill should be spoken via `.claude/hooks/play-tts.sh` if available, otherwise fall back to macOS `say` command.

---

## When to Use

- Need up-to-date information beyond training data
- Looking for current best practices
- Comparing tools, libraries, or services
- Debugging an issue with no clear solution
- Checking if a library/API has changed recently
- Validating an approach against community consensus

---

## Research Process

### Step 1: Formulate Search Queries

From `$ARGUMENTS`, generate 2-3 targeted search queries:

```
RESEARCH: [topic]
================================================

Query 1: [specific technical query]
Query 2: [alternative phrasing or related angle]
Query 3: [comparison or "best practice" angle]
```

**Query formulation tips**:

- Include the year or "2025" / "2026" for current results
- Add framework/language version for specificity
- Use "vs" for comparisons
- Add "best practice" or "recommended" for guidance

### Step 2: Web Search

Use serper MCP (or WebSearch tool) for each query:

```
Searching: [query 1]
Results: [N] relevant results found

Searching: [query 2]
Results: [N] relevant results found
```

**Source prioritization**:

1. Official documentation (highest trust)
2. GitHub repositories and issues
3. Recent blog posts from known experts
4. Stack Overflow answers (check date and votes)
5. Community discussions (Reddit, Discord)

### Step 3: Documentation Lookup

Use context7 MCP for official documentation:

1. Resolve the library ID: `resolve-library-id` for the topic
2. Query docs: `query-docs` with specific questions

```
Official docs: [library/framework]
Version: [current version]
Relevant section: [docs section]
```

### Step 4: Deep Dive (If Needed)

For complex topics, use WebFetch to read full articles:

- Fetch the top 2-3 most relevant URLs
- Extract key findings, code examples, and recommendations
- Note the publication date (discard outdated info)

### Step 5: Synthesize Findings

Combine all sources into an actionable summary.

**Validation Gate**:

- [ ] At least 2 credible sources found
- [ ] Information is current (check publication dates)
- [ ] Recommendation is actionable (not vague)
- [ ] Conflicts between sources noted

**TTS**: `"Research complete. Findings ready."`

---

## Output Format

```
RESEARCH: [topic]
================================================

SUMMARY
-------
[2-3 sentence summary of the key finding]

KEY FINDINGS
------------
1. [Finding with source attribution]
2. [Finding with source attribution]
3. [Finding with source attribution]

RECOMMENDATION
--------------
[Clear, actionable recommendation based on findings]

RELEVANT CODE
-------------
[Code example if applicable]

SOURCES
-------
- [Title] ([date]) - [URL]
- [Title] ([date]) - [URL]
- [Title] ([date]) - [URL]

CONFIDENCE: [High / Medium / Low]
Reason: [why this confidence level]
================================================
```

---

## Save Findings (Optional)

If the findings are relevant to the current project:

### To CLAUDE.md

If a non-obvious gotcha or best practice was discovered:

```
Add to Gotchas section:
- **[Topic]**: [one-line finding]
```

Ask the user: "Save this finding to CLAUDE.md? [Y/n]"

### To ADR

If the research informs a significant decision:

```
Suggest: "Create an ADR for this? Run /adr [decision]"
```

### To Session Notes

Always available for `/session-end` to pick up later.

---

## Research Modes

### Quick Lookup

For simple factual questions:

```
User: "research: what is the default port for Supabase local?"

RESEARCH: Supabase local default port
================================================
Answer: Port 54321 (API), 54322 (DB), 54323 (Studio)
Source: Supabase official docs
================================================
```

Skip detailed output for simple answers.

### Comparison Research

For "X vs Y" questions:

```
RESEARCH: [X] vs [Y]
================================================

| Criteria | [X] | [Y] |
| --- | --- | --- |
| Performance | [data] | [data] |
| Bundle size | [data] | [data] |
| Community | [data] | [data] |
| Learning curve | [data] | [data] |
| Our stack fit | [data] | [data] |

Recommendation: [choice] because [reason]
================================================
```

### Deep Research

For complex topics requiring multiple sources:

- Search 3-5 queries
- Read 2-3 full articles
- Cross-reference findings
- Provide confidence assessment

---

## MCP Server Usage

| Action           | MCP Server | Method                         |
| ---------------- | ---------- | ------------------------------ |
| Web search       | serper     | google_search                  |
| Read URL content | serper     | scrape                         |
| Official docs    | context7   | resolve-library-id, query-docs |
| Fetch page       | WebFetch   | fetch URL                      |

---

## Quality Checks

Before presenting findings:

- [ ] Information is current (check dates)
- [ ] Sources are credible (official docs > random blogs)
- [ ] Recommendation is actionable (not vague)
- [ ] Code examples are verified against docs
- [ ] Conflicts between sources are noted

---

## Context Files

```
context_files:
  - .claude/CLAUDE.md (check existing gotchas, avoid duplicates)
```
