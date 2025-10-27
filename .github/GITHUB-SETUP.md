# GitHub Repository Security Setup

This document outlines the security and contribution workflow configured for the DesignSetGo repository.

## 🔒 Security Features

### 1. Branch Protection Rules

**Main branch is protected with:**
- ✅ Requires pull request reviews (minimum 1 approval)
- ✅ Requires review from Code Owners
- ✅ Dismisses stale PR approvals when new commits pushed
- ✅ Requires status checks to pass before merging
- ✅ Requires conversation resolution before merging
- ✅ No force pushes allowed
- ✅ No branch deletion allowed

**To enable** (run in your terminal):
```bash
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["build-and-test"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null \
  --field required_conversation_resolution=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

### 2. Code Owners

**File:** `.github/CODEOWNERS`

- All files require approval from @jnealey by default
- Critical files (security, main plugin file, configs) explicitly require your approval
- You can add trusted contributors for specific areas

**How it works:**
- When someone opens a PR, you're automatically assigned as reviewer
- PR cannot be merged without your approval
- GitHub shows "Required" next to your review status

### 3. Automated Security Checks

**GitHub Actions workflows** (`.github/workflows/`):

1. **CI Workflow** (`ci.yml`):
   - ✅ Builds plugin on Node 20.x and PHP 8.0/8.1/8.2
   - ✅ Runs JavaScript linter
   - ✅ Runs CSS linter
   - ✅ Checks PHP syntax
   - ✅ Validates bundle sizes
   - ✅ Uploads build artifacts

2. **Security Audit** (`ci.yml`):
   - ✅ Runs `npm audit` to check for vulnerable dependencies
   - ✅ Fails on critical vulnerabilities
   - ✅ Warns on moderate vulnerabilities

3. **File Size Check** (`ci.yml`):
   - ✅ Flags files over 300 lines for refactoring
   - ✅ Helps maintain code quality

4. **Accessibility Check** (`ci.yml`):
   - ✅ Verifies ARIA labels present
   - ✅ Checks for semantic HTML usage
   - ✅ Ensures accessibility considerations

5. **Internationalization Check** (`ci.yml`):
   - ✅ Counts translated strings
   - ✅ Flags potential untranslated user-facing text

6. **Auto-labeling** (`label-pr.yml`):
   - ✅ Labels PRs by affected files (blocks, PHP, JS, styles)
   - ✅ Labels PRs by size (xs, s, m, l, xl)
   - ✅ Makes triage easier

**All checks must pass before PR can be merged.**

### 4. Issue & PR Templates

**Issue Templates:**
- `.github/ISSUE_TEMPLATE/bug_report.yml` - Structured bug reports
- `.github/ISSUE_TEMPLATE/feature_request.yml` - Feature suggestions

**PR Template:**
- `.github/pull_request_template.md` - Comprehensive checklist

**Benefits:**
- Contributors provide all necessary information upfront
- Consistency in submissions
- Less back-and-forth in reviews

### 5. Security Policy

**File:** `.github/SECURITY.md`

- Private vulnerability reporting process
- Supported versions
- Response timelines
- Security best practices for contributors
- Disclosure policy

**To enable private vulnerability reporting:**
1. Go to Settings → Security → Code security and analysis
2. Enable "Private vulnerability reporting"

### 6. Contributing Guidelines

**File:** `.github/CONTRIBUTING.md`

Comprehensive guide covering:
- How to report bugs/suggest features
- Development environment setup
- Coding standards
- Testing requirements
- Commit message format
- Pull request process
- Code review expectations

## 🛡️ Additional Security Settings (Manual Setup)

### In GitHub Web UI

**Settings → General:**
- [ ] Enable Issues
- [ ] Disable Projects (unless needed)
- [ ] Disable Wiki (unless needed)
- [ ] Enable Discussions (optional)

**Settings → Branches:**
- [ ] Set default branch to `main`
- [ ] Configure branch protection rules (see above)

**Settings → Moderation:**
- [ ] Limit interactions to prior contributors (during beta)
- [ ] Enable temporary interaction limits if spam occurs

**Settings → Code security and analysis:**
- [ ] Enable Dependency graph
- [ ] Enable Dependabot alerts
- [ ] Enable Dependabot security updates
- [ ] Enable Secret scanning
- [ ] Enable Private vulnerability reporting

**Settings → Actions:**
- [ ] Allow GitHub Actions
- [ ] Allow local actions only (more secure)
- [ ] Require approval for first-time contributors

## 🔄 Contribution Workflow

### For Contributors

1. **Fork the repository**
   ```bash
   gh repo fork jnealey/designsetgo --clone
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make changes and test**
   ```bash
   npm install
   npx wp-env start
   npx wp-scripts build
   # Test in editor and frontend
   ```

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/my-feature
   gh pr create --fill
   ```

6. **Wait for automated checks**
   - CI builds plugin ✅
   - Security audit passes ✅
   - All linters pass ✅

7. **Code review by maintainer**
   - @jnealey or assigned reviewer reviews
   - May request changes
   - Approves when ready

8. **Merge** (only maintainers can merge)

### For You (Maintainer)

1. **Receive PR notification**
   - Email/GitHub notification
   - Automatically assigned as reviewer (CODEOWNERS)

2. **Review automated checks**
   - All CI checks passed? ✅
   - Security audit clean? ✅
   - File sizes acceptable? ✅

3. **Code review**
   - Review code changes
   - Test locally if needed
   - Request changes or approve

4. **Merge when ready**
   - Squash and merge (recommended)
   - Merge commit (for feature branches)
   - Rebase and merge (for linear history)

## 📋 Checklist for Initial Setup

**In your terminal:**
```bash
# 1. Commit all GitHub configuration files
cd /Users/jnealey/Documents/GitHub/designsetgo
git add .github/
git commit -m "chore: Configure GitHub security and contribution workflow"
git push origin main

# 2. Enable branch protection
gh api repos/jnealey/designsetgo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["build-and-test"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null \
  --field required_conversation_resolution=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

**In GitHub Web UI:**
- [ ] Go to Settings → Code security and analysis
- [ ] Enable Dependabot alerts
- [ ] Enable Dependabot security updates
- [ ] Enable Secret scanning
- [ ] Enable Private vulnerability reporting
- [ ] Go to Settings → Actions → General
- [ ] Set "Fork pull request workflows from outside collaborators" to "Require approval for first-time contributors"

**Update SECURITY.md:**
- [ ] Replace `[Your email address]` with your actual email

**Test the workflow:**
- [ ] Create a test branch: `git checkout -b test/github-workflow`
- [ ] Make a small change
- [ ] Push and open a PR
- [ ] Verify CI runs
- [ ] Verify you're auto-assigned as reviewer
- [ ] Verify auto-labels applied
- [ ] Close test PR

## 🚀 What This Achieves

### Security Benefits

1. **No Direct Commits to Main**
   - All changes go through PR review
   - Prevents accidental breaking changes
   - Maintains code quality

2. **Automated Quality Gates**
   - Build must succeed
   - Linters must pass
   - Security vulnerabilities caught early
   - File size limits enforced

3. **Code Owner Review Required**
   - You control what gets merged
   - Can delegate review to trusted contributors
   - Clear approval trail

4. **Vulnerability Management**
   - Dependabot alerts for dependencies
   - Private reporting for security issues
   - Clear security policy

5. **Transparency**
   - Clear contribution guidelines
   - Standardized issue/PR templates
   - Documented security practices

### Workflow Benefits

1. **Faster Triage**
   - Auto-labeled PRs by type and size
   - Clear categorization
   - Priority visible at a glance

2. **Better PRs**
   - Templates guide contributors
   - All necessary info provided upfront
   - Less back-and-forth

3. **Confidence in Changes**
   - Automated testing catches issues
   - Multiple validation steps
   - Can review on mobile (checks already passed)

4. **Easier Collaboration**
   - Clear guidelines for contributors
   - Documented standards
   - Predictable review process

## 📚 Additional Resources

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Dependabot](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates)
- [Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)

---

**Questions?** Open an issue with the `question` label or email directly for sensitive topics.
