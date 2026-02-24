# AI Code Review Workflows

This directory contains templates for automated AI code review.

## Available Options

### Option 1: GitHub Copilot (Recommended - Free for OSS)

**Setup:**
1. Go to https://github.com/settings/copilot
2. Apply for free OSS access OR subscribe ($10/mo)
3. Enable "Code review" feature
4. No workflow file needed - it's built into GitHub!

**Cost:** FREE for verified open source maintainers

### Option 2: CodeRabbit ($12/month)

**Setup:**
1. Rename `ai-code-review-coderabbit.yml.template` to `ai-code-review.yml`
2. Install app at https://github.com/apps/coderabbitai
3. Select this repository

**Cost:** $12/user/month (14-day free trial)

### Option 3: DIY with OpenAI API (~$5-10/month)

Create `.github/workflows/ai-code-review-openai.yml`:

```yaml
name: AI Code Review (OpenAI)

on:
  pull_request_target:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  ai-review:
    runs-on: ubuntu-latest
    if: github.event.pull_request.user.login != 'jnealey-godaddy'

    steps:
      - uses: actions/checkout@v4

      - name: AI Code Review
        uses: anc95/ChatGPT-CodeReview@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        with:
          OPENAI_API_MODEL: "gpt-4"
          LANGUAGE: en
          top_p: 1
          temperature: 1
          max_tokens: 2000
          review_comment_lgtm: false
```

Then add `OPENAI_API_KEY` to repository secrets:
1. Get API key from https://platform.openai.com/api-keys
2. Add to https://github.com/jnealey-godaddy/designsetgo/settings/secrets/actions

**Cost:** ~$5-10/month based on PR volume

## Recommendation

For this open source project:
1. **Best:** Apply for GitHub Copilot for OSS (free forever)
2. **Alternative:** Use OpenAI API (~$5-10/month, full control)
3. **Trial:** Try CodeRabbit (14 days free, then $12/mo)

## Current Status

⚠️ **No AI review currently active**

To activate, choose one of the options above.
