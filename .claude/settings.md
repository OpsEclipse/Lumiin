# Claude Settings Documentation

This document provides human-readable documentation for the Claude configuration in this project.

---

## Hooks

Hooks allow Claude to automatically run commands at specific points during tool execution.

### PostToolUse Hooks

These hooks run **after** Claude finishes using a tool.

| Hook            | Trigger Tools                                                         | Action                   |
| --------------- | --------------------------------------------------------------------- | ------------------------ |
| **Format Code** | `write_to_file`, `replace_file_content`, `multi_replace_file_content` | Runs Prettier formatting |

#### Format Code Hook

**File:** `.claude/hooks/format.sh`

**Purpose:** Automatically formats all modified code files after Claude creates or edits them, ensuring consistent code style across the project.

**When it runs:**

- After any file is created (`write_to_file`)
- After any file is edited (`replace_file_content`, `multi_replace_file_content`)

**What it does:**

1. Finds all staged files in git
2. Runs Prettier on each file (if applicable)
3. Re-stages the formatted files

---

## Configuration File

The actual configuration lives in `settings.json`:

```json
{
	"hooks": {
		"PostToolUse": [
			{
				"matcher": "write_to_file|replace_file_content|multi_replace_file_content",
				"hooks": [
					{
						"type": "command",
						"command": "sh .claude/hooks/format.sh"
					}
				]
			}
		]
	}
}
```

---

## Adding New Hooks

### Available Hook Types

| Hook Point    | When It Runs           |
| ------------- | ---------------------- |
| `PreToolUse`  | Before a tool executes |
| `PostToolUse` | After a tool completes |

### Matcher Patterns

Use `|` to match multiple tools:

```json
"matcher": "tool1|tool2|tool3"
```

### Hook Actions

```json
{
	"type": "command",
	"command": "your-shell-command-here"
}
```

---

## Related Files

- **`settings.json`** — Machine-readable configuration
- **`hooks/format.sh`** — Prettier formatting script
