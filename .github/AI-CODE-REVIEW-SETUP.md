# AI Code Review Setup Guide

This repository is configured for automatic AI-powered code reviews on all Pull Requests.

## What's Configured

✅ **AI Review Workflow** (`.github/workflows/ai-code-review.yml`)
- Automatically reviews all external contributor PRs
- Skips reviews for maintainer (@jnealey88) PRs
- Focuses on WordPress, security, accessibility, and performance

✅ **CodeRabbit Configuration** (`.coderabbit.yaml`)
- WordPress-specific review rules
- Path-based instructions for different file types
- References project documentation (.claude/CLAUDE.md)

## Activation Options

### Option 1: CodeRabbit AI (Free for Open Source) ⭐ **Recommended**

**What it does:**
- Automatically reviews every PR
- Provides inline comments with suggestions
- Learns from your codebase and patterns
- Free for public repositories

**Activation Steps:**

1. **Install CodeRabbit App:**
   - Visit: https://github.com/apps/coderabbitai
   - Click "Install"
   - Select "Only select repositories"
   - Choose `designsetgo`
   - Click "Install & Authorize"

2. **Configuration is already done!**
   - The workflow (`.github/workflows/ai-code-review.yml`) is ready
   - The config (`.coderabbit.yaml`) is customized for WordPress

3. **Test it:**
   - Create a test PR
   - CodeRabbit will comment within ~60 seconds
   - Review the feedback and adjust config if needed

**Features:**
- ✅ Line-by-line code review
- ✅ Security vulnerability detection
- ✅ Best practice suggestions
- ✅ WordPress-specific checks
- ✅ Responds to review comments
- ✅ Summary of changes

### Option 2: GitHub Copilot (Requires Subscription)

**What it does:**
- Official GitHub AI reviewer
- Integrated directly into PR interface
- High-quality reviews

**Activation Steps:**

1. **Subscribe to GitHub Copilot:**
   - Visit: https://github.com/settings/copilot
   - Choose plan ($10-19/month)

2. **Enable for Repository:**
   - Go to repository Settings → Copilot
   - Enable "Code review"
   - Configure review triggers

3. **Optional: Add Instructions**
   Create `.github/copilot-instructions.md`:
   ```markdown
   Review WordPress Gutenberg block code focusing on:
   - WordPress coding standards
   - Block editor best practices
   - Security (sanitization, escaping, nonces)
   - Accessibility (WCAG 2.1 AA)
   - Reference .claude/CLAUDE.md for patterns
   ```

**Cost:** $10-19/month (free for students/OSS maintainers)

### Option 3: Multiple AI Reviewers (Advanced)

Use both CodeRabbit (free) + GitHub Copilot for comprehensive reviews:

1. Set up CodeRabbit (free for public repos)
2. Add GitHub Copilot if you have a subscription
3. Get reviews from both AI systems

## What Gets Reviewed

### Included:
- ✅ All JavaScript/React files
- ✅ All PHP files
- ✅ All SCSS/CSS files
- ✅ block.json files
- ✅ Documentation updates

### Excluded (ignored):
- ❌ Build artifacts (`build/**`)
- ❌ Dependencies (`node_modules/**`, `vendor/**`)
- ❌ Lock files
- ❌ Minified files
- ❌ Asset metadata files

## Review Focus Areas

The AI reviewer checks for:

1. **WordPress Standards**
   - Proper use of useBlockProps()
   - Block Supports instead of custom controls
   - Modern color control patterns

2. **Security** (HIGH PRIORITY)
   - Input sanitization
   - Output escaping
   - Nonce verification
   - SQL injection prevention

3. **Accessibility** (REQUIRED)
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - ARIA labels
   - Screen reader support

4. **Code Quality**
   - File size limits (300 lines)
   - Internationalization
   - JSDoc comments
   - Error handling

5. **Performance**
   - Unnecessary re-renders
   - Bundle size
   - Proper React hooks usage

6. **Project Patterns**
   - References `.claude/CLAUDE.md`
   - dsgo- prefix for identifiers
   - Two-div pattern for containers

## Customizing Reviews

### Adjust Review Strictness

Edit `.coderabbit.yaml`:
```yaml
reviews:
  profile: chill      # Less strict
  # profile: assertive  # More strict (current)
```

### Add Path-Specific Rules

```yaml
path_instructions:
  - path: "src/blocks/custom-block/**"
    instructions: |
      This block has special requirements...
```

### Ignore Specific Patterns

```yaml
reviews:
  ignore_patterns:
    - "**/*.test.js"  # Ignore test files
    - "docs/**"       # Ignore documentation
```

## Testing the Setup

1. **Create a test PR:**
   ```bash
   git checkout -b test/ai-review
   echo "// Test change" >> src/test.js
   git add . && git commit -m "test: AI review"
   git push -u origin test/ai-review
   gh pr create --title "Test: AI Code Review" --body "Testing AI review setup"
   ```

2. **Wait for review:**
   - CodeRabbit comments appear in ~60 seconds
   - Check the "Files changed" tab for inline comments

3. **Interact with the AI:**
   - Reply to comments to ask questions
   - Request clarification or additional suggestions

## Troubleshooting

### CodeRabbit not commenting?

1. Check app is installed: https://github.com/settings/installations
2. Verify repository is selected in CodeRabbit settings
3. Check workflow runs: https://github.com/jnealey88/designsetgo/actions
4. Ensure PR is from external contributor (maintainer PRs are skipped)

### Too many/too few comments?

Adjust in `.coderabbit.yaml`:
```yaml
reviews:
  profile: chill  # Fewer comments
  # or
  profile: assertive  # More comments
```

### Wrong focus areas?

Update `system_message` in `.github/workflows/ai-code-review.yml` or path_instructions in `.coderabbit.yaml`

## Costs

| Option | Public Repos | Private Repos |
|--------|-------------|---------------|
| CodeRabbit | **Free** | $12/user/mo |
| GitHub Copilot | **Free** (for OSS) | $10-19/mo |
| Both | **Free** | $22-31/mo |

**Recommendation for this project:** Use CodeRabbit (free for public repos)

## Resources

- **CodeRabbit Docs**: https://docs.coderabbit.ai
- **GitHub Copilot**: https://docs.github.com/en/copilot
- **WordPress Standards**: https://developer.wordpress.org/coding-standards/

---

**Next Steps:**
1. Install CodeRabbit app (link above)
2. Create a test PR to verify setup
3. Adjust configuration based on review quality
4. Commit this setup to main branch

**Questions?** Check CodeRabbit docs or create an issue.
