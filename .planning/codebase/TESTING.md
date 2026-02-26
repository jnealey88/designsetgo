# Testing Patterns

**Analysis Date:** 2026-02-26

## Test Framework

**JS Unit Runner:**
- Jest 30.x
- Config: `jest.config.js`
- Extends `@wordpress/scripts/config/jest-unit.config`
- Environment: jsdom (via `jest-environment-jsdom`)
- Coverage provider: V8

**JS E2E Runner:**
- Playwright 1.56.x
- Config: `playwright.config.js`
- Target: WordPress wp-env (localhost:8888)

**PHP Runner:**
- PHPUnit 9.x
- Config: `phpunit.xml.dist`
- Bootstrap: `tests/phpunit/bootstrap.php`
- Environment: WordPress test suite via wp-env

**Assertion Libraries (JS Unit):**
- Jest built-in matchers
- `@testing-library/jest-dom` (imported per-file: `import '@testing-library/jest-dom'`)
- Custom matchers: `toContainCSSRule`, `toBeValidCSSClassName` (defined in `tests/unit/setup.js`)

**Assertion Libraries (PHP):**
- `WP_UnitTestCase` (extends PHPUnit with WordPress helpers)

**Run Commands:**
```bash
npm run test:unit                    # Run all Jest unit tests
npm run test:unit -- --watch         # Watch mode (via jest --watch)
npm run test:unit -- --coverage      # Coverage report
npm run test:e2e                     # Run all Playwright E2E tests
npm run test:e2e:ui                  # Playwright with interactive UI
npm run test:e2e:headed              # Playwright visible browser
npm run test:e2e:chromium            # Single browser
npm run test:php                     # PHPUnit via composer
```

## Test File Organization

**Unit tests location:** `tests/unit/` (separate from source)

**E2E tests location:** `tests/e2e/`

**PHP tests location:** `tests/phpunit/`

**Naming (JS unit):**
- Pattern: `{feature}.test.js`
- Examples: `utils.test.js`, `css-generator.test.js`, `block-registration.test.js`, `extensions.test.js`

**Naming (JS E2E):**
- Pattern: `{feature}.spec.js`
- Examples: `group-enhancements.spec.js`

**Naming (PHP):**
- Pattern: `{feature}-test.php` (PHPUnit config uses `suffix="-test.php"`)
- Examples: `helpers-test.php`, `plugin-test.php`, `custom-css-renderer-test.php`

**Structure:**
```
tests/
├── unit/
│   ├── setup.js                        # Global Jest setup, all mocks
│   ├── __mocks__/
│   │   └── fileMock.js                 # Static asset stub
│   ├── utils.test.js
│   ├── css-generator.test.js
│   ├── breakpoints.test.js
│   ├── extensions.test.js
│   ├── block-registration.test.js
│   ├── block-schema-validation.test.js
│   ├── block-attributes.test.js
│   ├── modal.test.js
│   ├── sanitize-color.test.js
│   ├── svg-patterns.test.js
│   ├── draft-mode-controls.test.js
│   ├── draft-mode-settings-panel.test.js
│   └── draft-mode-panel.test.js
├── e2e/
│   ├── auth.setup.js                   # Playwright auth state setup
│   ├── cleanup.teardown.js             # Playwright teardown
│   ├── helpers/
│   │   └── wordpress.js                # WP admin/editor helper functions
│   └── group-enhancements.spec.js
├── phpunit/
│   ├── bootstrap.php                   # PHPUnit + WordPress bootstrap
│   ├── plugin-test.php
│   ├── helpers-test.php
│   ├── custom-css-renderer-test.php
│   ├── extension-attributes-test.php
│   ├── draft-mode-test.php
│   ├── draft-mode-admin-test.php
│   ├── draft-mode-rest-test.php
│   ├── form-handler-test.php
│   ├── abilities-test.php
│   ├── abilities-security-test.php
│   ├── abilities-smoke-test.php
│   ├── security-fixes-test.php
│   ├── patterns-loader-test.php
│   ├── block-loader-test.php
│   ├── overlay-header-test.php
│   └── llms-txt-test.php
└── js/
    └── setup.js                        # Legacy modal test setup
```

## Test Structure

**Suite Organization (JS unit):**
```javascript
/**
 * CSS Generator Utility Tests
 *
 * @package
 */
import { generateResponsiveCSS } from '../../src/utils/css-generator';

describe('CSS Generator Utilities', () => {
    describe('generateResponsiveCSS', () => {
        it('generates desktop-only CSS when only desktop value provided', () => {
            const result = generateResponsiveCSS('.test', 'width', { desktop: '100px' });
            expect(result).toContain('.test');
            expect(result).toContain('width: 100px');
        });
    });
});
```

**Suite Organization (PHP):**
```php
class Test_Helpers extends WP_UnitTestCase {
    /**
     * Test designsetgo_get_block_class function
     */
    public function test_get_block_class() {
        $this->assertEquals('dsgo-stack', designsetgo_get_block_class('stack'));
    }
}
```

**Patterns:**
- Both `test()` and `it()` are used in JS (no strict preference)
- `beforeEach` / `afterEach` used for setup/teardown
- `jest.clearAllMocks()` called in `beforeEach` to reset mock state
- `jest.resetModules()` used when tests need fresh module imports (extensions pattern)

## Mocking

**Framework (JS):** Jest built-in mocking (`jest.mock`, `jest.fn`, `jest.spyOn`)

**Global Setup (`tests/unit/setup.js`):**
All tests globally have these mocks pre-configured without explicit setup per file:
- `global.wp` — WordPress global object stub
- `global.__`, `global._x`, `global._n`, `global.sprintf` — i18n functions (pass-through)
- `window.scrollTo`, `window.scroll`, `window.scrollBy` — scroll APIs
- `window.requestAnimationFrame`, `window.cancelAnimationFrame` — animation APIs
- `window.matchMedia` — configurable via `global.setMatchMedia(matches)`
- `global.IntersectionObserver` — with `simulateIntersection()` helper
- `global.ResizeObserver` — with `simulateResize()` helper
- `global.MutationObserver`
- `window.getComputedStyle`
- `window.localStorage` — full mock with store, auto-cleared in `beforeEach`
- `global.fetch` — returns `{ ok: true, json: () => {}, text: () => '' }`, cleared in `beforeEach`

**Module-level mocking (per test file):**
```javascript
// Mock before importing the module under test
jest.mock('@wordpress/hooks', () => ({
    addFilter: jest.fn(),
}));

jest.mock('@wordpress/i18n', () => ({
    __: jest.fn((text) => text),
}));

jest.mock('@wordpress/block-editor', () => ({
    InspectorControls: ({ children }) => children,
}));

jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }) => children,
    Button: ({ children, onClick, ...props }) => <button onClick={onClick} {...props}>{children}</button>,
}));

jest.mock('@wordpress/element', () => ({
    ...jest.requireActual('react'),   // Use real React hooks where possible
    createPortal: (children) => children,
}));
```

**Extension module reset pattern** (required when testing `addFilter` calls):
```javascript
beforeEach(() => {
    jest.resetModules();
    jest.mock('@wordpress/hooks', () => ({
        addFilter: jest.fn(),
    }));
    // Re-import after mocks
    require('../../src/extensions/block-animations/attributes');
    const { addFilter: mockAddFilter } = require('@wordpress/hooks');
    const calls = mockAddFilter.mock.calls.filter(call =>
        call[0] === 'blocks.registerBlockType' && call[1].includes('block-animations')
    );
    if (calls.length > 0) {
        addAnimationAttributes = calls[0][2];
    }
});
```

**What to Mock:**
- All `@wordpress/*` packages (not available in jsdom)
- Browser APIs not in jsdom (`matchMedia`, `IntersectionObserver`, `ResizeObserver`)
- External API calls (`fetch`)
- `window.dsgoSettings` (set directly on global, restore in `afterEach`)

**What NOT to Mock:**
- The module under test
- React hooks (prefer `jest.requireActual('react')` to get real implementations)
- Pure utility functions in `src/utils/` (test them directly)

## Fixtures and Factories

**Test Data (JS):**
Block attributes and settings are constructed inline per test. The global setup provides a context factory:
```javascript
// From tests/unit/setup.js
global.testUtils = {
    createMockContext: (values = {}) => ({
        'designsetgo/form/formId': values.formId || 'test-form',
        'designsetgo/accordion/allowMultipleOpen': values.allowMultipleOpen || false,
        ...values,
    }),
    simulateAttributeChange: (setAttributes, changes) => {
        setAttributes(changes);
        return changes;
    },
    getCallsFor: (mockFn) => mockFn.mock.calls,
};
```

**DOM fixtures (unit tests):**
Helper functions create DOM elements directly:
```javascript
function createMockModal(options = {}) {
    const modal = document.createElement('div');
    modal.setAttribute('data-dsgo-modal', 'true');
    modal.setAttribute('data-modal-id', options.id || 'dsgo-modal-test');
    document.body.appendChild(modal);
    return modal;
}
```
Always paired with cleanup:
```javascript
afterEach(() => {
    document.querySelectorAll('[data-dsgo-modal]').forEach(el => el.remove());
});
```

**Fixture location:** No centralized fixture directory — test data is defined inline or in setup.js.

**PHP test data:** Inline per test method using WordPress test factories (via `WP_UnitTestCase`).

## Coverage

**Requirements:**
```javascript
// jest.config.js
coverageThreshold: {
    global: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
    },
},
```

**Coverage collection:**
```javascript
collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/index.js',         // Exclude registration files
    '!src/**/*.stories.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/build/**',
],
```

**View Coverage:**
```bash
npm run test:unit -- --coverage
# Report in coverage/ directory
```

## Test Types

**Unit Tests (JS):**
- Scope: Individual utility functions, attribute injection logic, CSS generation, data transformation
- Location: `tests/unit/`
- Approach: Import function directly, test inputs/outputs
- No React rendering — logic tested at function level

**Component Tests (JS with React):**
- Scope: React components (DraftModeControls, DraftModeSettingsPanel)
- Location: `tests/unit/draft-mode-*.test.js`
- Framework: `@testing-library/react` with `render`, `screen`, `fireEvent`, `waitFor`, `act`
- All WordPress component dependencies are mocked

**Schema Validation Tests (JS):**
- Scope: All `block.json` files discovered via filesystem scan
- Location: `tests/unit/block-schema-validation.test.js`
- Approach: `fs.readdirSync` to discover, `it.each` to test all blocks
- Validates: namespace, required properties, textdomain, apiVersion

**Unit Tests (PHP):**
- Scope: PHP helper functions, class methods, sanitization, REST endpoints
- Location: `tests/phpunit/`
- Framework: `WP_UnitTestCase` (full WordPress environment via wp-env)
- Approach: Direct function calls, `assertEquals`, `assertStringStartsWith`, `assertTrue`

**E2E Tests:**
- Framework: Playwright 1.56
- Location: `tests/e2e/`
- Browsers: Chromium, Firefox, WebKit (Safari), Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)
- Authentication: Shared state via `auth.setup.js` → `artifacts/storage-states/admin.json`
- Approach: Real WordPress instance via wp-env, full user interaction flows
- Timeout: 60s per test, 10min global

## Common Patterns

**Async Testing (JS):**
```javascript
// Jest fake timers for debounce
beforeEach(() => { jest.useFakeTimers(); });
afterEach(() => { jest.useRealTimers(); });

test('delays function execution', () => {
    const func = jest.fn();
    debouncedFunc();
    expect(func).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
});
```

**Error/Edge Case Testing:**
```javascript
test('returns undefined for falsy values', () => {
    expect(convertPresetToCSSVar(undefined)).toBeUndefined();
    expect(convertPresetToCSSVar(null)).toBeUndefined();
    expect(convertPresetToCSSVar('')).toBeUndefined();
    expect(convertPresetToCSSVar(0)).toBeUndefined();
});
```

**Cache testing (clear between tests):**
```javascript
afterEach(() => {
    window.dsgoSettings = originalDsgoSettings;
    clearExclusionCache();   // Always clear cache to prevent test interference
});
```

**E2E pattern (Playwright):**
```javascript
test('should allow hiding group on specific devices', async ({ page }) => {
    await createNewPost(page, 'post');
    await insertBlock(page, 'core/group');
    await selectBlock(page, 'core/group');
    await openBlockSettings(page);
    const visibilityPanel = page.locator('text=Responsive Visibility');
    await expect(visibilityPanel).toBeVisible();
    await visibilityPanel.click();
    await page.getByLabel(/Hide on Mobile/i).check();
    const hasVisibilityClass = await blockHasClass(page, 'core/group', 'dsgo-has-responsive-visibility');
    expect(hasVisibilityClass).toBeTruthy();
});
```

**Skipping tests with context:**
```javascript
test.skip('description of skipped feature', async ({ page }) => { ... });
// OR in PHP:
$this->markTestSkipped('Block registration requires built assets');
```

## E2E Helper API

Shared Playwright helpers are in `tests/e2e/helpers/wordpress.js`:
- `getEditorCanvas(page)` — returns `FrameLocator` for the WordPress 6.4+ iframe editor
- `createNewPost(page, postType)` — navigates to new post, waits for editor, closes welcome modal
- `insertBlock(page, blockName)` — opens inserter, searches, inserts block
- `openBlockSettings(page)` — opens sidebar Inspector panel
- `selectBlock(page, blockName)` — clicks to select a block
- `savePost(page)` — saves as draft
- `publishPost(page)` — publishes post
- `getFrontendUrl(page)` — returns frontend permalink
- `blockHasClass(page, blockName, className)` — checks if block has CSS class in editor

---

*Testing analysis: 2026-02-26*
