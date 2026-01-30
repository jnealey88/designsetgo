---
name: README
description: 
allowed-tools: Read, Glob
---


### After Creating a New Block

```
/add-block → develop → /refactor (if > 300 lines) → /test → commit
```

**Checklist:**
- [ ] Block uses `useBlockProps()` and `useInnerBlocksProps()`
- [ ] Color controls use `ColorGradientSettingsDropdown`
- [ ] Comprehensive `supports` in block.json
- [ ] All strings use `__()` for translation
- [ ] Tested in editor and frontend


### After Creating an Extension

```
/add-extension → develop → /review-extension → /test → commit
```

**Checklist:**
- [ ] Works WITH WordPress attributes
- [ ] Shows controls conditionally
- [ ] Doesn't duplicate WordPress toolbar
- [ ] Uses proper filter hooks
- [ ] Includes responsive considerations


### Before Any Release

```
/lint → /test → /security-audit → /plugin-review → /i18n-update → /deploy
```

**Checklist:**
- [ ] All linters pass
- [ ] All tests pass
- [ ] No security issues
- [ ] Plugin review complete
- [ ] Translations updated
- [ ] Deployment package created


### Quarterly Maintenance

```
/check-compat → /block-supports-audit → /refactor (identified blocks)
```

**Checklist:**
- [ ] WordPress/Gutenberg compatibility verified
- [ ] Block Supports opportunities identified
- [ ] Technical debt addressed
- [ ] Performance optimizations applied


## Quick Reference by Problem

### "My build is failing"

→ `/quick-fix` (select option 1)

### "Styles aren't applying"

→ `/quick-fix` (select option 2)

### "Block validation error"

→ `/quick-fix` (select option 3)

### "Console errors in browser"

→ `/quick-fix` (select option 4)

### "Layout not working"

→ `/quick-fix` (select option 5)

### "Colors not showing"

→ `/color-controls-migrate`

### "Translations missing"

→ `/i18n-update`

### "Need to optimize code"

→ `/refactor` or `/block-supports-audit`

### "Preparing for release"

→ `/deploy`

### "Security concerns"

→ `/security-audit`

### "Full plugin review needed"

→ `/plugin-review`


## Command Details

### Development Commands

#### `/build`

Build the plugin for development or production.

**Development mode:**
```bash
npm run start
```

**Production mode:**
```bash
npm run build
```

**What it does:**
- Compiles JavaScript and SCSS
- Generates build output
- Enables hot reloading (dev mode)
- Minifies assets (production mode)


#### `/test`

Run all plugin tests.

**Run tests:**
```bash
npm test
```

**Watch mode:**
```bash
npm run test:watch
```

**With coverage:**
```bash
npm run test:coverage
```


#### `/lint`

Lint and auto-fix code.

**All linters:**
```bash
npm run lint:js
npm run lint:css
npm run lint:php
```

**Auto-fix:**
```bash
npm run lint:js -- --fix
npm run lint:css -- --fix
```


### Block Development Commands

#### `/add-block`

Create a new Gutenberg block with complete scaffolding.

**Creates:**
- Block directory structure
- block.json with metadata
- edit.js and save.js
- Style files
- Optional frontend.js and render.php

**Follows:**
- WordPress best practices
- FSE compatibility
- Modern color controls
- Internationalization


#### `/add-extension`

Create an extension to enhance WordPress core blocks.

**Use when:**
- Adding ≤3 simple controls
- No DOM restructuring needed
- CSS-only changes
- Enhancing existing blocks

**Avoid when:**
- Complex functionality needed
- Unique UI patterns
- Interactive components (tabs, accordion)


#### `/add-variation`

Create a block variation with preset configurations.

**Examples:**
- Hero section (Group variation)
- Three-column grid (Group variation)
- Testimonial card (Group variation)

**Uses:**
- WordPress native layout attributes
- Theme spacing/color presets
- Meaningful defaults


### Code Quality Commands

#### `/refactor`

Refactor code following WordPress and project best practices.

**Handles:**
- Files > 300 lines
- Anti-patterns (useEffect for styling)
- Plain `<InnerBlocks />` usage
- Missing FSE support
- Security issues
- Accessibility issues

**Output:**
- Refactored files
- Performance metrics
- Migration guide (if breaking changes)


#### `/block-supports-audit`

Find opportunities to replace custom controls with WordPress Block Supports.

**Identifies:**
- Custom color controls → `supports.color`
- Custom typography → `supports.typography`
- Custom spacing → `supports.spacing`
- Custom borders → `supports.__experimentalBorder`

**Benefits:**
- Reduce code by 50-95 lines per block
- Better UX with familiar WordPress controls
- Automatic theme.json integration


#### `/color-controls-migrate`

Migrate from deprecated `PanelColorSettings` to modern `ColorGradientSettingsDropdown`.

**Why:**
- PanelColorSettings is deprecated
- Modern component appears in Styles tab
- Better theme integration
- Native clear/reset functionality

**Migration:**
- Updates imports
- Adds clientId parameter
- Replaces component
- Moves to Styles tab


### Audit Commands

#### `/plugin-review`

Comprehensive plugin audit covering all aspects.

**Reviews:**
- Architecture and code organization
- WordPress best practices
- FSE compatibility
- Accessibility (WCAG 2.1 AA)
- Performance
- Security
- Documentation
- Testing

**Output:**
- Detailed review document
- Priority-sorted issues
- Code fixes
- Action plan


#### `/security-audit`

Security-focused audit.

**Checks:**
- SQL injection vulnerabilities
- XSS vulnerabilities
- CSRF protection
- Input validation
- Output escaping
- Capability checks
- REST API security

**Output:**
- Security review document
- Severity ratings
- Code fixes
- Pre-deployment checklist


#### `/check-compat`

Check compatibility with WordPress and Gutenberg versions.

**Verifies:**
- WordPress version requirements
- Deprecated APIs
- Package versions
- Block.json schema
- Theme compatibility

**Output:**
- Compatibility report
- Deprecated code list
- Recommended updates


#### `/review-pr`

Review pull request against DesignSetGo plugin standards.

**Checks:**
- Code standards (indentation, prefixes, file size)
- Common pitfalls from CLAUDE.md
- WordPress best practices
- Security vulnerabilities
- Accessibility compliance
- Performance issues
- Testing requirements
- Documentation updates

**Process:**
1. Fetches PR details via gh CLI
2. Reads all changed files
3. Reviews against plugin standards
4. Checks WordPress best practices
5. Verifies testing checklist
6. Provides actionable feedback

**Output:**
- Structured PR review
- Priority-sorted issues (Critical/Important/Suggestions)
- Specific code fixes with file references
- Standards compliance checklist
- Testing checklist for author

**Use before:**
- Merging any PR
- Deploying changes
- After significant refactoring


### Deployment Commands

#### `/deploy`

Prepare plugin for WordPress.org deployment.

**Process:**
1. Run production build
2. Update version numbers
3. Run security audit
4. Run tests and lint
5. Create deployment package
6. Pre-deployment checklist

**Output:**
- Deployment zip file
- Next steps for SVN upload


#### `/i18n-update`

Update translation files.

**Workflow:**
1. Find untranslated strings
2. Generate POT file
3. Update PO files
4. Compile MO files
5. Test translations

**Languages:**
- Dutch (nl_NL)
- Spanish (es_ES)
- Add more as needed


### Information Commands

#### `/plugin-info`

Display plugin architecture and structure.

**Shows:**
- Architecture overview
- Current extensions
- Current variations
- Custom blocks
- Build configuration
- File structure
- Key principles


## Pro Tips

### Faster Development

**Use watch mode during development:**
```bash
npm run start
```

**Lint on save:**

Configure your editor to auto-fix on save:
- VSCode: Install ESLint and Stylelint extensions
- Enable "Format on Save"


### Better Code Quality

**Before every commit:**
```bash
npm run lint:js -- --fix && npm run lint:css -- --fix && npm test
```

**Use pre-commit hooks:**

Add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
npm run lint:js && npm run lint:css && npm test
```


### Debugging Tips

**Check build output:**
```bash
ls -lh build/
cat build/style-index.css | grep "your-class"
```

**Check for errors:**
- Browser console (F12)
- `npx wp-env logs`
- Build output

**Common issues:**
- Missing imports in style.scss/editor.scss
- Using plain `<InnerBlocks />` instead of `useInnerBlocksProps`
- Edit and save markup don't match


## Contributing

When adding new commands:

1. **Add frontmatter:**
   ```markdown
   ---
   description: Brief description of command
   ---
   ```

2. **Follow structure:**
   - Clear description
   - When to use
   - Step-by-step instructions
   - Code examples
   - Testing checklist
   - References

3. **Update this README:**
   - Add to appropriate table
   - Add to workflows if applicable
   - Add to "Quick Reference by Problem" if applicable


## Getting Help

**Documentation:**
- [CLAUDE.md](../.claude/CLAUDE.md) - Project learnings
- [BEST-PRACTICES-SUMMARY.md](../../docs/BEST-PRACTICES-SUMMARY.md) - Quick patterns
- [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](../../docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) - Deep dives

**Quick fixes:**
- `/quick-fix` - Common problems
- Browser console (F12) - JavaScript errors
- `npx wp-env logs` - PHP errors

**Resources:**
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Gutenberg GitHub](https://github.com/WordPress/gutenberg)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)


**Last Updated:** 2025-11-20
**Plugin Version:** 1.0.0
**Total Commands:** 18
