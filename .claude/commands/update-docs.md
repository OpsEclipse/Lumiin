---
allowed-tools: Read, Glob, Grep, Write, Edit, ListDir
description: Update all project documentation (CLAUDE.md and docs/) to reflect current codebase state
---

# Update Documentation Task

Review the current state of the codebase and update all project documentation to be accurate, precise relevant, and concise.

## Documentation Files to Update

1. **`CLAUDE.md`** (root) - Project overview, architecture, and quick-start for future Claude sessions
2. **`docs/instructions.md`** - High-level project vision and coding standards
3. **`docs/mediapipe-implementation.md`** - Technical CV implementation details
4. **`docs/database-schema.md`** - Supabase schema and migrations

## Update Process

### Step 1: Analyze Current State

- Scan the `src/` directory structure to understand what components exist
- Check `package.json` for current dependencies
- Review any recent additions or changes visible in the codebase

### Step 2: Update CLAUDE.md

Keep it **concise** (under 500 words). Include:

- One-sentence project description
- Current tech stack (only what's actually installed)
- Directory structure overview
- Key commands (`npm run dev`, etc.)
- Any gotchas or important context for future sessions

### Step 3: Update docs/ Files

For each doc file:

- Remove outdated information, or docs that dont need to be there anymore
- Add any new components, APIs, or schemas that have been implemented
- Keep instructions actionable and specific
- Remove placeholder/TODO items that have been completed

## Quality Standards

- **Precision over comprehensiveness** - Only document what exists, not what's planned
- **Actionable** - Every section should help Claude or a developer take action
- **No redundancy** - If something is documented in one place, don't repeat it elsewhere
- **Current state only** - Remove references to features that don't exist yet

## Output

After updating, provide a brief summary of what changed in each file.
