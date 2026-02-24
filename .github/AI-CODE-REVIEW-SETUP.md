# AI Code Review Setup Guide

This repository is configured for automatic AI-powered code reviews on all Pull Requests.

## What's Configured

✅ **AI Review Workflow** (`.github/workflows/ai-code-review.yml`)
- Automatically reviews all external contributor PRs
- Skips reviews for maintainer (@jnealey-godaddy) PRs
- Focuses on WordPress, security, accessibility, and performance

✅ **CodeRabbit Configuration** (`.coderabbit.yaml`)
- WordPress-specific review rules
- Path-based instructions for different file types
- References project documentation (.claude/CLAUDE.md)

## Activation Options

### Option 1: GitHub Copilot (Truly Free for OSS) ⭐ **RECOMMENDED**

**What it does:**
- Official GitHub AI code reviewer
- Integrated directly into PR interface
- High-quality contextual reviews
- **FREE for verified open source maintainers**

**Cost:**
- **FREE** for verified open source projects
- $10/month for individuals (if not OSS-verified)
- $19/user/month for teams

**Activation Steps:**

1. **Apply for GitHub Copilot for Open Source:**
   - Visit: https://github.com/settings/copilot
   - Look for "Apply for Copilot for Open Source"
   - OR just subscribe ($10/mo if you want it immediately)

2. **Enable Code Review:**
   - Go to: https://github.com/settings/copilot
   - Enable "Code review" feature
   - Configure review triggers

3. **Enable for Repository:**
   - Repository Settings → Copilot
   - Enable automatic reviews

**Features:**
- ✅ Integrated into GitHub natively
- ✅ Line-by-line suggestions
- ✅ Security vulnerability detection
- ✅ Best practice recommendations
- ✅ FREE for OSS maintainers
- ✅ No third-party app installation needed

### Option 2: CodeRabbit AI ⚠️ **PAID SERVICE**

**What it does:**
- Automatically reviews every PR
- Provides inline comments with suggestions
- Learns from your codebase and patterns

**Cost:** $12/user/month (14-day free trial available)

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

### Option 3: Completely Free DIY Solution

**For when you want $0 cost:**

Use the existing workflow with manual triggers or create your own using free AI APIs:

1. **Keep the current workflow** (already configured)
2. **Manual review trigger:** Comment `/review` on PRs to trigger AI review
3. **Or build custom solution** with:
   - GitHub Actions (free)
   - OpenAI API ($0.002/1K tokens - ~$0.10 per PR)
   - Anthropic Claude API (similar pricing)

**Example custom workflow** (costs ~$0.10 per PR):
```yaml
# .github/workflows/custom-ai-review.yml
# Uses OpenAI API - need to add OPENAI_API_KEY secret
on:
  pull_request_target:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: AI Review with OpenAI
        uses: anc95/ChatGPT-CodeReview@main
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          LANGUAGE: en
```

**Cost:** ~$5-10/month for typical usage

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
3. Check workflow runs: https://github.com/jnealey-godaddy/designsetgo/actions
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

## Cost Comparison

| Option | Initial Cost | Ongoing Cost | Best For |
|--------|-------------|--------------|----------|
| **GitHub Copilot** | Free (OSS) or $10/mo | Free (OSS) or $10/mo | ✅ **Best overall** - Free for OSS |
| **CodeRabbit** | 14-day trial | $12/user/mo | Good features but paid |
| **DIY OpenAI** | $0 setup | ~$5-10/mo usage | Budget-conscious, full control |
| **Do Nothing** | $0 | $0 | Manual reviews only |

**Recommendation for this project:**
1. **Best:** GitHub Copilot (apply for free OSS access)
2. **Alternative:** DIY with OpenAI API (~$5-10/month)
3. **Trial:** Try CodeRabbit (14 days free) to see if worth $12/mo

## Resources

- **CodeRabbit Docs**: https://docs.coderabbit.ai
- **GitHub Copilot**: https://docs.github.com/en/copilot
- **WordPress Standards**: https://developer.wordpress.org/coding-standards/

---

## Current Status

⚠️ **No AI review currently active** - Templates are ready but not enabled

## Next Steps

**Choose your AI reviewer:**

1. **GitHub Copilot** (Recommended for OSS):
   - Apply at: https://github.com/settings/copilot
   - Enable code review feature
   - FREE for verified OSS projects

2. **CodeRabbit** (14-day trial):
   - Rename `.github/workflows/ai-code-review-coderabbit.yml.template` to `.yml`
   - Install app at: https://github.com/apps/coderabbitai
   - $12/month after trial

3. **DIY OpenAI** (~$5-10/month):
   - See `.github/workflows/README-AI-REVIEW.md` for setup
   - Add OPENAI_API_KEY to repository secrets
   - Full control over prompts

**Questions?** Check the resources below or create an issue.
