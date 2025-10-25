# DesignSetGo Testing

End-to-end tests for the DesignSetGo WordPress plugin using Playwright.

## Quick Start

### 1. Install Dependencies

```bash
npm install
npm run test:install
```

### 2. Start WordPress

```bash
npm run wp-env:start
```

### 3. Run Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI (recommended for development)
npm run test:e2e:ui
```

## Test Structure

```
tests/
├── e2e/
│   ├── auth.setup.js              # Login and authentication
│   ├── cleanup.teardown.js        # Post-test cleanup
│   ├── group-enhancements.spec.js # Group block enhancement tests
│   └── helpers/
│       └── wordpress.js           # Helper functions
├── unit/                          # Jest unit tests
└── phpunit/                       # PHP unit tests
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run all E2E tests (headless) |
| `npm run test:e2e:ui` | Run tests in interactive UI mode |
| `npm run test:e2e:headed` | Run tests with browser visible |
| `npm run test:e2e:debug` | Debug tests step-by-step |
| `npm run test:e2e:chromium` | Run tests in Chrome only |
| `npm run test:e2e:firefox` | Run tests in Firefox only |
| `npm run test:e2e:webkit` | Run tests in Safari only |
| `npm run test:e2e:mobile` | Run tests on mobile devices |
| `npm run test:e2e:report` | View HTML test report |

## Writing Tests

Example test:

```javascript
const { test, expect } = require('@playwright/test');
const { createNewPost, insertBlock } = require('./helpers/wordpress');

test('should add responsive grid columns', async ({ page }) => {
  // Create new post
  await createNewPost(page, 'post');

  // Insert Group block
  await insertBlock(page, 'core/group');

  // Your test assertions here
  await expect(page.locator('.wp-block-group')).toBeVisible();
});
```

## MCP Integration

Claude Code can interact with Playwright tests through MCP (Model Context Protocol).

Configuration is in [.claude/mcp.json](../.claude/mcp.json).

## Documentation

Full testing documentation: [docs/TESTING.md](../docs/TESTING.md)

## Troubleshooting

### WordPress Not Starting

```bash
npm run wp-env:stop
npm run wp-env:clean
npm run wp-env:start
```

### Browsers Not Installed

```bash
npm run test:install
```

### Tests Failing

1. Ensure WordPress is running: http://localhost:8888
2. Check credentials: `admin` / `password`
3. Clear artifacts: `rm -rf artifacts`
4. Re-run setup: `npx playwright test --project=setup`

## Resources

- [Playwright Documentation](https://playwright.dev)
- [DesignSetGo Testing Guide](../docs/TESTING.md)
- [WordPress E2E Testing](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-e2e-test-utils/)
