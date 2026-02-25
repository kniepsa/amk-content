# Audit Ecosystem

Comprehensive health check for the BMAD + Vibe-Coding + AgentVibes unified ecosystem.

## Checks to Perform

### 1. BMAD Method (BMM) Status

```
Check: .bmad/_cfg/manifest.yaml exists
Check: .bmad/bmm/agents/ contains agent files
Check: .bmad/_cfg/agent-voice-map.csv has voice mappings
Report:
  ✓ BMAD v[version] installed
  ✓ [N] agents available
  ✓ Voice mappings configured
  OR
  ✗ BMAD not installed - run: npx bmad-method@alpha install
```

### 2. Vibe-Coding Setup

```
Check: .claude/CLAUDE.md exists (project memory)
Check: .claude/NEXT.md exists OR docs/sprint-status.yaml exists
Check: Commands directory has core commands (warmup, next, ship, session-end)
Report:
  ✓ Project memory configured
  ✓ Task tracking: [Solo/NEXT.md | BMM/sprint-status]
  ✓ [N] vibe commands available
  OR
  ✗ Missing: [list of missing files]
```

### 3. AgentVibes TTS

```
Check: .claude/hooks/play-tts.sh exists and executable
Check: .claude/hooks/session-start-tts.sh exists
Check: .claude/config/unified.json exists (new) OR .claude/tts-provider.txt (legacy)
Check: TTS provider installed (piper or elevenlabs configured)
Report:
  ✓ AgentVibes installed
  ✓ Provider: [piper/elevenlabs]
  ✓ Config: [unified.json/legacy]
  ✓ Verbosity: [low/medium/high]
  ✓ Current voice: [voice-name]
  OR
  ✗ TTS not configured - run /agent-vibes:provider setup
```

### 4. Git Hooks

```
Check: .husky directory exists
Check: .husky/pre-commit exists (lint-staged)
Check: .husky/pre-push exists (validate:all)
Report:
  ✓ Husky configured
  ✓ Pre-commit: lint-staged
  ✓ Pre-push: validate:all
  OR
  ⚠ Git hooks not configured (optional)
```

### 5. Integration Health

```
Check: Agent context file (.claude/agent-context.json)
Check: Voice mapping file readable
Check: BMM + Vibe-Coding task bridge:
  - If sprint-status.yaml exists: warmup/next should detect it
Report:
  ✓ Agent context: [active/inactive]
  ✓ BMAD voice integration: [enabled/disabled]
  ✓ Task bridge: [BMM mode/Solo mode]
```

### 6. MECE Validation

```
Verify no responsibility overlaps:
- Task tracking: NEXT.md XOR sprint-status.yaml (not both actively used)
- Voice config: unified.json XOR legacy .txt files
- Agent context: agent-context.json XOR .bmad-agent-context
Report:
  ✓ MECE: No duplicate configs
  OR
  ⚠ Found legacy files that should be migrated
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                   ECOSYSTEM HEALTH REPORT                     ║
╠══════════════════════════════════════════════════════════════╣
║ BMAD Method (BMM)                                            ║
║   ✓ v6.0.0-alpha.13 installed                                ║
║   ✓ 10 agents available                                      ║
║   ✓ Voice mappings configured                                ║
╠══════════════════════════════════════════════════════════════╣
║ Vibe-Coding                                                  ║
║   ✓ Project memory: .claude/CLAUDE.md                        ║
║   ✓ Task tracking: BMM mode (sprint-status.yaml)             ║
║   ✓ 21 commands available                                    ║
╠══════════════════════════════════════════════════════════════╣
║ AgentVibes TTS                                               ║
║   ✓ Provider: piper                                          ║
║   ✓ Config: unified.json (v2)                                ║
║   ✓ Voice: en_US-ryan-high                                   ║
║   ✓ Verbosity: low                                           ║
╠══════════════════════════════════════════════════════════════╣
║ Git Automation                                               ║
║   ✓ Husky pre-commit: lint-staged                            ║
║   ✓ Husky pre-push: validate:all                             ║
╠══════════════════════════════════════════════════════════════╣
║ Integration                                                  ║
║   ✓ MECE: No config overlaps                                 ║
║   ✓ Task bridge: Active (BMM ↔ Vibe-Coding)                  ║
║   ⚠ Legacy files found: .bmad-agent-context (can delete)     ║
╚══════════════════════════════════════════════════════════════╝

Recommended actions:
1. Delete .bmad-agent-context (superseded by agent-context.json)
```

## Quick Mode

For a shorter report, just check critical systems:

```
/audit-ecosystem quick

Ecosystem: ✓ BMAD | ✓ Vibe-Coding | ✓ AgentVibes | ✓ Husky
Mode: BMM (sprint-status.yaml)
```
