# DesignSetGo Claude Skills

This directory contains modern Claude Code skills for the DesignSetGo WordPress plugin development workflow. All skills have been migrated from `.claude/commands/` to the modern `.claude/skills/` format with enhanced features.

## Skills Directory Structure

```
.claude/skills/
├── {skill-name}/
│   └── SKILL.md          # Main skill file with frontmatter + instructions
└── README.md             # This file
```

## Available Skills (20 Total)

### Development Workflow (5 skills)

| Skill | Command | Description | Features |
|-------|---------|-------------|----------|
| **build** | `/build` | Build plugin and watch for changes | Manual-only, restricted tools |
| **test** | `/test` | Run all plugin tests (Jest, E2E) | Manual-only, restricted tools |
| **lint** | `/lint` | Lint and auto-fix JavaScript, CSS, and PHP files | Manual-only, restricted tools |
| **deploy** | `/deploy` | Prepare plugin for WordPress.org deployment | Manual-only, restricted tools |
| **i18n-update** | `/i18n-update` | Update translation files and check for untranslated strings | Manual-only, restricted tools |

### Block Development (3 skills)

| Skill | Command | Description | Features |
|-------|---------|-------------|----------|
| **add-block** | `/add-block [name]` | Create a new Gutenberg block with scaffolding | Argument hint, restricted tools |
| **add-extension** | `/add-extension [name]` | Create a block extension to enhance core WordPress blocks | Argument hint, restricted tools |
| **add-variation** | `/add-variation [name]` | Create a block variation with preset configurations | Argument hint, restricted tools |

### Code Quality & Refactoring (4 skills)

| Skill | Command | Description | Features |
|-------|---------|-------------|----------|
| **refactor** | `/refactor` | Refactor code following WordPress best practices | Subagent (Explore), restricted tools |
| **review-extension** | `/review-extension` | Review block extension for WordPress best practices | Subagent (Explore), restricted tools |
| **block-supports-audit** | `/block-supports-audit` | Audit blocks for Block Supports optimization opportunities | Subagent (Explore), restricted tools |
| **color-controls-migrate** | `/color-controls-migrate [block]` | Migrate PanelColorSettings to ColorGradientSettingsDropdown | Argument hint, restricted tools |

### Audits & Reviews (5 skills)

| Skill | Command | Description | Features |
|-------|---------|-------------|----------|
| **plugin-review** | `/plugin-review` | Comprehensive WordPress plugin audit | Subagent (Explore), 711 lines, deep analysis |
| **security-audit** | `/security-audit` | Run comprehensive security audit | Subagent (Explore), restricted tools |
| **performance-audit** | `/performance-audit` | Deep performance and optimization audit | Subagent (Explore), 926 lines, deep analysis |
| **review-pr** | `/review-pr` | Review pull request for DesignSetGo standards | Subagent (Explore), 382 lines |
| **check-compat** | `/check-compat` | Check compatibility with WordPress and Gutenberg versions | Subagent (Explore), restricted tools |

### Information & Troubleshooting (3 skills)

| Skill | Command | Description | Features |
|-------|---------|-------------|----------|
| **plugin-info** | `/plugin-info` | Display DesignSetGo plugin architecture and structure | Restricted tools |
| **quick-fix** | `/quick-fix` | Quick fixes for common issues | 363 lines, diagnostic tool |
| **README** | `/README` | DesignSetGo Claude Commands reference | Read-only |

## Skill Features Explained

### Modern Frontmatter Enhancements

Each skill includes enhanced frontmatter with modern Claude Code features:

```yaml
---
name: skill-name                    # Skill identifier
description: What this skill does   # When/why to use it
disable-model-invocation: true      # Manual-only (not auto-invoked)
context: fork                       # Run in isolated subagent
agent: Explore                      # Use Explore agent for analysis
allowed-tools: Read, Bash(npm *)    # Restrict tool access
argument-hint: [block-name]         # Autocomplete hint
---
```

### Skill Categories by Features

**Manual-Only Skills** (`disable-model-invocation: true`)
- build, test, lint, deploy, i18n-update
- These skills are only invoked when you explicitly call them (e.g., `/build`)
- Prevents Claude from auto-running builds during conversations

**Subagent Skills** (`context: fork`, `agent: Explore`)
- plugin-review, security-audit, performance-audit, review-pr, review-extension, refactor, block-supports-audit, check-compat
- Run in isolated subagent environment for heavy analysis
- Use Explore agent for comprehensive code analysis
- Don't pollute main conversation context

**Code Generation Skills** (with `argument-hint`)
- add-block, add-extension, add-variation, color-controls-migrate
- Accept arguments for block/component names
- Provide autocomplete hints in CLI

**Tool-Restricted Skills**
- All skills have `allowed-tools` to limit scope and prevent unintended actions
- Example: build skill can only run `npm run *`, `npx wp-env *`, `git *`, Read, Glob

## Usage

### Invoking Skills

```bash
# Simple skill invocation
/build
/test
/plugin-info

# Skill with argument
/add-block my-custom-block
/add-extension core/paragraph

# Skill for analysis (runs in subagent)
/plugin-review
/security-audit
/review-pr
```

### Skill Workflow Examples

**Daily Development:**
```bash
/lint          # Check code quality
/build         # Build plugin
/test          # Run tests
```

**Creating New Block:**
```bash
/add-block testimonial-card
# Generates: src/blocks/testimonial-card/
/refactor      # Check if > 300 lines
/test          # Verify functionality
```

**Pre-Release Quality Gate:**
```bash
/security-audit      # Security check
/performance-audit   # Performance analysis
/plugin-review       # Comprehensive audit
/check-compat        # WordPress compatibility
/i18n-update         # Translation updates
/deploy              # Deployment prep
```

**Maintenance:**
```bash
/block-supports-audit        # Find optimization opportunities
/color-controls-migrate      # Modernize color controls
/refactor                    # Clean up anti-patterns
```

## Skill Comparison: Commands vs Skills Format

### Old Format (.claude/commands/)

```markdown
<!-- .claude/commands/build.md -->
---
description: Build plugin and watch for changes
---

Build the DesignSetGo plugin...
```

### New Format (.claude/skills/)

```markdown
<!-- .claude/skills/build/SKILL.md -->
---
name: build
description: Build plugin and watch for changes
disable-model-invocation: true
allowed-tools: Bash(npm run *), Bash(npx wp-env *), Bash(git *), Read, Glob
---

Build the DesignSetGo plugin...
```

### Benefits of New Format

1. **Better Tool Control** - Restrict which tools each skill can use
2. **Subagent Support** - Heavy analysis runs in isolated environment
3. **Manual-Only Option** - Prevent auto-invocation for build/deploy skills
4. **Argument Hints** - Better CLI autocomplete experience
5. **Directory Structure** - Room for supporting files (templates, examples, scripts)
6. **Explicit Configuration** - Clear feature flags in frontmatter

## Advanced Features

### Supporting Files (Optional)

Skills can include additional files beyond SKILL.md:

```
.claude/skills/add-block/
├── SKILL.md               # Main instructions
├── template.md            # Template for Claude to fill
├── examples/              # Example outputs
│   ├── simple-block.md
│   └── complex-block.md
└── scripts/               # Helper scripts
    └── validate-block.sh
```

### Dynamic Context with `!` Commands

Skills can inject dynamic content before execution:

```yaml
---
name: pr-summary
context: fork
agent: Explore
---

PR diff: !`gh pr diff`
PR comments: !`gh pr view --comments`

Summarize this PR focusing on...
```

Commands execute BEFORE Claude sees the prompt, injecting real-time data.

## Troubleshooting

### Skill Not Found

If `/skill-name` doesn't work:
1. Check file exists: `.claude/skills/skill-name/SKILL.md`
2. Verify frontmatter has `name: skill-name`
3. Restart Claude Code CLI

### Skill Auto-Invoking When You Don't Want It

Add to frontmatter:
```yaml
disable-model-invocation: true
```

### Skill Running Out of Context

For heavy analysis skills, add:
```yaml
context: fork
agent: Explore
```

### Tool Permission Errors

Check `allowed-tools` in frontmatter matches what the skill needs.

## Migration Notes

**Original Location:** `.claude/commands/*.md`
**New Location:** `.claude/skills/{skill-name}/SKILL.md`

**Backward Compatibility:** Both formats work, but `.claude/skills/` is the modern standard.

**Migration Date:** 2026-01-29
**Skills Migrated:** 20/20 ✅

## Reference Documentation

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills.md)
- [DesignSetGo Plugin Guide](.claude/CLAUDE.md)
- [Refactoring Guide](docs/REFACTORING-GUIDE.md)
- [Best Practices](docs/BEST-PRACTICES-SUMMARY.md)

## Maintenance

**When Adding New Skills:**

1. Create directory: `.claude/skills/new-skill/`
2. Create file: `.claude/skills/new-skill/SKILL.md`
3. Add frontmatter with appropriate features
4. Update this README with the new skill

**When Modifying Skills:**

1. Edit `.claude/skills/{skill-name}/SKILL.md`
2. Test with `/skill-name`
3. Update skill table in this README if description changes

---

**Last Updated:** 2026-01-29
**Total Skills:** 20
**Format Version:** Modern (.claude/skills/)
