# Contributing to DesignSetGo

Thank you for your interest in contributing to DesignSetGo! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and considerate. We follow the [WordPress Community Code of Conduct](https://make.wordpress.org/handbook/community-code-of-conduct/).

## Before You Start

1. **Search existing issues** to avoid duplicates
2. **Read [CLAUDE.md](.claude/CLAUDE.md)** to understand our development philosophy
3. **Review [Best Practices](docs/BEST-PRACTICES-SUMMARY.md)** for coding standards
4. **Test locally** with `npx wp-env` before submitting

## How to Contribute

### Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml) and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (WP version, theme, etc.)
- Screenshots/error logs if applicable

### Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml) and include:
- Problem you're trying to solve
- Proposed solution
- Alternative approaches considered
- Why this benefits DesignSetGo users

### Submitting Pull Requests

#### 1. Fork & Clone

```bash
gh repo fork jnealey/designsetgo --clone
cd designsetgo
```

#### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

#### 3. Set Up Development Environment

```bash
# Install dependencies
npm install

# Start WordPress environment
npx wp-env start

# Build plugin
npx wp-scripts build

# Watch for changes during development
npx wp-scripts start
```

**Access your site:**
- Frontend: http://localhost:8888
- Admin: http://localhost:8888/wp-admin
  - Username: `admin`
  - Password: `password`

#### 4. Make Your Changes

**Follow our coding standards:**

- **File Size**: No file over 300 lines (see [CLAUDE.md](.claude/CLAUDE.md) for refactoring patterns)
- **WordPress Standards**: Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- **JSDoc**: Document all functions with JSDoc comments
- **Accessibility**: WCAG 2.1 AA compliance required
- **Security**: Sanitize input, escape output, validate nonces
- **Internationalization**: Use `__()` for all user-facing strings with `'designsetgo'` text domain

**Key patterns to follow:**
```javascript
// ✅ GOOD - Declarative styles with useInnerBlocksProps
const innerBlocksProps = useInnerBlocksProps({
  style: { /* styles */ }
});

// ❌ BAD - DOM manipulation
useEffect(() => {
  document.querySelector('.block').style.color = 'red';
}, []);
```

#### 5. Test Your Changes

**Required testing:**
- [ ] Works in block editor
- [ ] Works on frontend
- [ ] No console errors
- [ ] No PHP errors (`npx wp-env logs`)
- [ ] Responsive (mobile/tablet/desktop)
- [ ] Keyboard accessible
- [ ] Screen reader compatible

**Run linters:**
```bash
npm run lint:js     # JavaScript linting
npm run lint:css    # CSS linting
npm run lint:php    # PHP linting (if configured)
```

#### 6. Build for Production

```bash
npx wp-scripts build

# Verify build output
ls -lh build/
```

#### 7. Commit Your Changes

Follow our commit message format:

```bash
git commit -m "type: description"
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `style:` - CSS/styling changes
- `docs:` - Documentation updates
- `test:` - Adding tests
- `chore:` - Build, dependencies, cleanup

**Examples:**
```
feat: Add accordion block with ARIA support
fix: Resolve grid layout issue on mobile devices
refactor: Extract container panels into separate files
docs: Update best practices for useInnerBlocksProps
```

#### 8. Push & Create Pull Request

```bash
git push origin feature/your-feature-name

# Create PR via GitHub CLI
gh pr create --fill
```

**Or use GitHub web interface:**
- Our [PR template](.github/pull_request_template.md) will guide you
- Link to related issue
- Describe changes clearly
- Check all applicable boxes

### Code Review Process

1. **Automated Checks**: Must pass before review
   - Build succeeds
   - Linters pass
   - No console/PHP errors

2. **Maintainer Review**: @jnealey or assigned reviewers will:
   - Review code quality
   - Test functionality
   - Check WordPress/accessibility standards
   - Suggest improvements

3. **Approval**: At least 1 approval required from CODEOWNERS

4. **Merge**: Maintainer will merge when ready

**Review timeline:**
- **Initial review**: Within 3-5 business days
- **Follow-ups**: Within 1-2 business days

## Development Guidelines

### Block Development

**Always use custom blocks** for unique functionality. Extensions are rare.

**Required block.json supports:**
```json
{
  "supports": {
    "html": false,
    "anchor": true,
    "align": ["wide", "full"],
    "spacing": { "margin": true, "padding": true },
    "color": { "background": true, "text": true }
  }
}
```

**Use WordPress hooks:**
- `useBlockProps()` - Always
- `useInnerBlocksProps()` - For nested blocks
- `useSelect()` / `useDispatch()` - For WordPress stores

### File Structure

```
src/blocks/block-name/
├── index.js (40-60 lines) - Registration only
├── edit.js (100-150 lines) - Edit component
├── save.js - Save function
├── components/
│   └── inspector/
│       ├── Panel1.js (60-150 lines each)
│       └── Panel2.js
├── utils/
│   └── helpers.js - Pure functions
├── editor.scss
└── style.scss
```

### Performance Budgets

| Asset | Target | Maximum |
|-------|--------|---------|
| Block JS | < 10 KB | 15 KB |
| Block CSS | < 3 KB | 5 KB |
| Frontend JS | < 5 KB | 10 KB |

### Accessibility Requirements

- WCAG 2.1 AA compliance (minimum 4.5:1 contrast)
- Full keyboard navigation
- ARIA labels for custom controls
- Semantic HTML
- Screen reader tested

### Security Checklist

**JavaScript:**
- Validate all user input
- Use `isURL()` for URL validation

**PHP:**
- `esc_html()`, `esc_attr()`, `esc_url()` for output
- `sanitize_text_field()`, `sanitize_url()` for input
- `wp_kses_post()` for rich content
- `wp_verify_nonce()` for forms
- `current_user_can()` for permissions

## Questions?

- **General questions**: Open a discussion
- **Bug reports**: Use bug report template
- **Feature ideas**: Use feature request template
- **Security issues**: See [SECURITY.md](.github/SECURITY.md)

## Resources

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [DesignSetGo Best Practices](docs/BEST-PRACTICES-SUMMARY.md)
- [DesignSetGo Learnings](.claude/CLAUDE.md)

## License

By contributing, you agree that your contributions will be licensed under the same license as this project (GPL-2.0-or-later).

---

Thank you for contributing to DesignSetGo! 🎉
