---
description: Lint and auto-fix JavaScript, CSS, and PHP files
---

Lint JavaScript, CSS, and PHP files for code quality and standards compliance.

## Lint Commands

**JavaScript:**

```bash
npm run lint:js
```

**Auto-fix JavaScript:**

```bash
npm run lint:js -- --fix
```

**CSS/SCSS:**

```bash
npm run lint:css
```

**Auto-fix CSS:**

```bash
npm run lint:css -- --fix
```

**PHP (WordPress Coding Standards):**

```bash
npm run lint:php
```

**Run all linters:**

```bash
npm run lint:js && npm run lint:css && npm run lint:php
```

## What Gets Checked

**JavaScript:**
- ESLint with @wordpress/eslint-plugin
- WordPress coding standards
- No deprecated APIs
- Proper i18n usage

**CSS:**
- Stylelint
- BEM naming conventions
- No duplicate selectors
- Property ordering

**PHP:**
- WordPress PHP Coding Standards (WPCS)
- Security best practices
- Proper escaping and sanitization
- Documentation standards

## Before Committing

Always lint before committing:

```bash
npm run lint:js -- --fix && npm run lint:css -- --fix
```
