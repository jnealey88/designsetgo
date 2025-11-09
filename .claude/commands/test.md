---
description: Run all plugin tests (Jest, E2E)
---

Run all plugin tests for blocks and extensions.

## Test Commands

**Run all tests:**

```bash
npm test
```

**Run tests in watch mode:**

```bash
npm run test:watch
```

**Run tests with coverage:**

```bash
npm run test:coverage
```

## What Gets Tested

- Block registration
- Attribute defaults
- Edit component rendering
- Save function output
- Utility functions
- Extension filters

## Troubleshooting

**Tests fail:**

1. Check error messages for specific failures
2. Verify imports are correct
3. Check that mocks are set up properly
4. Ensure WordPress packages are available

**Common test failures:**

- **"Cannot find module '@wordpress/...'"** - Add to jest.config.js moduleNameMapper
- **"useSelect is not a function"** - Mock @wordpress/data properly
- **"Block not registered"** - Import and register block in test setup

## Before Committing

Always run tests before committing:

```bash
npm test && npm run lint:js
```
