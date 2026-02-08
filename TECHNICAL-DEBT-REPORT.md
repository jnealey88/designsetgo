# Technical Debt Inventory Report

**Repository**: DesignSetGo WordPress Plugin
**Analysis Date**: 2026-02-07
**Plugin Version**: 1.4.1
**Total Debt Items**: 46 (some items appear in multiple categories)

---

## Executive Summary

| Severity | Count | Action Required |
|----------|-------|-----------------|
| **Critical** | 3 | Fix immediately |
| **High** | 9 | Next sprint |
| **Medium** | 16 | Next quarter |
| **Low** | 14 | Backlog |

The DesignSetGo plugin has strong foundations -- excellent inline documentation (100% PHPDoc coverage), well-designed extension architecture, and smart frontend asset optimization. The most significant debt concentrates in three areas: **God objects** (`Block_Inserter` at ~2.8k lines), **test coverage gaps** (no edit/save component tests for blocks, and only 1 E2E spec covering group enhancements), and **performance patterns** (global `render_block` filters, redundant settings calls, block style variation filter accumulation).

---

## Debt by Category

| Category | Items | Severity | Estimated Effort |
|----------|-------|----------|------------------|
| Code Quality | 10 | High | 8-12 days |
| Test Coverage | 7 | Critical/High | 15-20 days |
| Dependencies | 6 | Medium | 2-3 days |
| Documentation | 5 | Low/Medium | 3-4 days |
| Design/Architecture | 8 | High/Medium | 10-15 days |
| Infrastructure | 4 | Medium | 2-3 days |
| Performance | 6 | High/Medium | 5-8 days |

---

## Top 15 Highest Impact Items

### 1. [Critical] Zero E2E test coverage for 51 custom blocks

- **Impact**: Any block regression (editor rendering, save output, frontend behavior) goes undetected until manual QA or user reports. The single E2E spec only covers Group block enhancements.
- **Effort**: 15+ days (prioritize Section, Accordion, Tabs, Slider, Form Builder first)
- **Fix**: Add smoke-level E2E tests for the 10 most-used blocks, expand to full coverage iteratively
- **Files**: `tests/e2e/group-enhancements.spec.js` (only existing spec)

### 2. [Critical] Zero JS component tests for block edit/save functions

- **Impact**: No block edit/save components have dedicated unit tests (existing JS tests cover view scripts and utilities only). Combined with the 50% Jest coverage threshold, this means large portions of the JS codebase have no quality gate.
- **Effort**: 10-15 days
- **Fix**: Add unit tests for edit/save components starting with the most complex blocks (slider, comparison-table, form-builder, card, modal)
- **Files**: `tests/unit/` (12 test files exist, none test block components)

### 3. [Critical] `Block_Inserter` God object (~2.8k lines, 34 methods)

- **Impact**: This is the most-changed abilities file (8 commits in 90 days). The `generate_designsetgo_wrapper_html()` method has 104 conditional branches in a single switch statement. Every new block type requires modifying this method, creating merge conflicts and increasing regression risk.
- **Effort**: 5-8 days
- **Fix**: Extract per-block HTML generators into individual strategy classes. Extract 12 identical `generate_form_*_field_html()` methods into a single generic form field renderer.
- **File**: `includes/abilities/class-block-inserter.php`

### 4. [High] Global `render_block` filters instead of block-specific filters

- **Impact**: Two filters run on every rendered block on every page load: map API key injection (`class-plugin.php:289`) and custom CSS collection (`class-custom-css-renderer.php:93`). With 20+ blocks on a page, that's 40+ unnecessary function calls.
- **Effort**: 0.5 days
- **Fix**: Replace `render_block` with `render_block_designsetgo/map` for map injection. For custom CSS, collect block names at registration and use block-specific filters.
- **Files**: `includes/class-plugin.php:289`, `includes/class-custom-css-renderer.php:93`

### 5. [High] Block style variation filter accumulation

- **Impact**: `register_json_block_styles()` adds one closure per block style variation to the `wp_theme_json_data_default` filter (`class-loader.php:234-251`). Each closure creates a new `WP_Theme_JSON_Data` object. This filter runs on every page in WordPress 6.7+. With N style variations, performance degrades linearly.
- **Effort**: 1-2 days
- **Fix**: Batch all style variations into a single filter callback that applies all theme.json modifications at once.
- **File**: `includes/blocks/class-loader.php:234-251`

### 6. [High] `Form_Handler` class has 6+ responsibilities (~1k lines)

- **Impact**: 11 commits in 90 days (3rd most-changed file). The class handles REST registration, form validation, spam detection, rate limiting, Turnstile verification, email sending, submission storage, and GDPR export hooks. Changes to one concern risk breaking others.
- **Effort**: 3-5 days
- **Fix**: Extract `SpamDetector`, `RateLimiter`, `EmailNotifier`, and `FieldValidator` into separate classes.
- **File**: `includes/blocks/class-form-handler.php`

### 7. [High] 12 duplicated form field configurators (~720 lines)

- **Impact**: Adding or modifying form field abilities requires changing 12 identical files (11 field types + form-builder). The corresponding `generate_form_*_field_html()` methods in `Block_Inserter` are also structurally identical.
- **Effort**: 1-2 days
- **Fix**: Create a single `Configure_Form_Field` class with a data-driven registration approach where field type, label, and description are passed as constructor parameters.
- **Files**: `includes/abilities/configurators/class-configure-form-*.php` (12 files)

### 8. [High] Deploy workflows use Node 18 (EOL) while CI uses Node 20

- **Impact**: Production builds shipped to WordPress.org are built with Node 18 (EOL since April 2025), while CI validates with Node 20. The code tested in CI is not the same environment used for production.
- **Effort**: 0.5 days
- **Fix**: Update `deploy.yml` and `deploy-assets.yml` to use Node 20. Also update from `actions/checkout@v3` to `@v4`.
- **Files**: `.github/workflows/deploy.yml`, `.github/workflows/deploy-assets.yml`

### 9. [High] PHP 8.3 in dev environment but not tested in CI

- **Impact**: Developers run PHP 8.3 locally (`.wp-env.json`), but CI only tests 8.0, 8.1, 8.2. PHP 8.3 deprecations or behavior changes will only be caught locally, not in the automated pipeline.
- **Effort**: 0.5 days
- **Fix**: Add PHP 8.3 to the CI matrix in `ci.yml`.
- **File**: `.github/workflows/ci.yml:18-20`

### 10. [High] Missing PHP tests for 20+ classes

- **Impact**: Major subsystems have zero test coverage: `Settings` (~860 lines, 13 commits), `GDPR_Compliance` (~570 lines), `Global_Styles` (~610 lines), `Admin_Menu`, `Block_Manager`, `Revision_Renderer`, `Revision_REST_API`, `Block_Differ`, and all 50+ individual configurator/generator abilities.
- **Effort**: 5-8 days
- **Fix**: Prioritize tests for Settings (most-changed) and GDPR (compliance-critical), then admin classes.
- **Files**: `tests/phpunit/` (15 test files exist for ~70+ classes)

### 11. [High] `Settings::get_settings()` called redundantly without static caching

- **Impact**: Called 18+ times across the codebase including 3 times per frontend page load in `Sticky_Header` alone. Each call runs `get_option()` + `wp_parse_args()` + `get_defaults()`. While `get_option()` is cached by WordPress, the array merge overhead is unnecessary.
- **Effort**: 0.5 days
- **Fix**: Add a static `$cached_settings` variable that is invalidated when settings are saved.
- **File**: `includes/admin/class-settings.php:542`

### 12. [Medium] Inconsistent error construction in abilities system

- **Impact**: Inserter classes in the same directory mix `new WP_Error()` (manual) with `$this->error()` (helper with auto status codes). This creates inconsistent API responses and makes the codebase harder to maintain.
- **Effort**: 1 day
- **Fix**: Migrate all `new WP_Error()` calls in abilities to use the `$this->error()` base class helper.
- **Files**: `includes/abilities/inserters/*.php` (34 files)

### 13. [Medium] Missing `composer.lock` file

- **Impact**: PHP dependencies are not pinned to exact versions. `composer install` may resolve to different versions across environments, creating "works on my machine" issues.
- **Effort**: 0.5 days
- **Fix**: Run `composer install` to generate `composer.lock` and commit it.
- **File**: Project root (missing file)

### 14. [Medium] `convertPresetToCSSVar()` duplicated across 4 files

- **Impact**: The same utility function is copy-pasted in `row/edit.js`, `row/save.js`, `grid/edit.js`, `grid/save.js`. Changes must be made in 4 places.
- **Effort**: 0.5 days
- **Fix**: Extract to `src/utils/convert-preset-to-css-var.js` and import.
- **Files**: `src/blocks/row/edit.js:68`, `src/blocks/row/save.js:44`, `src/blocks/grid/edit.js:45`, `src/blocks/grid/save.js`

### 15. [Medium] REST API endpoints missing `args` schemas

- **Impact**: ~10 REST endpoints in `Settings`, `Global_Styles`, and LLMS TXT controllers accept unvalidated POST bodies. No parameter type validation or sanitization callbacks defined.
- **Effort**: 2 days
- **Fix**: Add `args` arrays with `type`, `sanitize_callback`, and `validate_callback` to all REST endpoint registrations.
- **Files**: `includes/admin/class-settings.php:552-606`, `includes/admin/class-global-styles.php:463-482`, `includes/llms-txt/class-rest-controller.php`

---

## Detailed Findings by Category

### 1. Code Quality Debt

| # | Severity | Issue | File(s) | Effort |
|---|----------|-------|---------|--------|
| CQ-1 | Critical | `Block_Inserter` God object (~2.8k lines, 104-branch switch) | `includes/abilities/class-block-inserter.php` | 5-8d |
| CQ-2 | High | 12 duplicated form field configurators (~720 lines identical code) | `includes/abilities/configurators/class-configure-form-*.php` | 1-2d |
| CQ-3 | High | `Form_Handler` God object (~1k lines, 6+ responsibilities) | `includes/blocks/class-form-handler.php` | 3-5d |
| CQ-4 | Medium | `Settings.sanitize_settings()` -- 117 lines of repetitive `isset()` ternary; defaults duplicated from `get_defaults()` | `includes/admin/class-settings.php:744-861` | 1d |
| CQ-5 | Medium | `Settings.get_available_blocks()` -- 310 lines of static data that should be a config file | `includes/admin/class-settings.php:140-450` | 0.5d |
| CQ-6 | Medium | `Block_Configurator.insert_into_parent_block()` -- nesting depth 8, 7 params (3 by-reference) | `includes/abilities/class-block-configurator.php` | 1d |
| CQ-7 | Medium | `convertPresetToCSSVar()` duplicated in 4 files | `src/blocks/row/edit.js:68`, `row/save.js:44`, `grid/edit.js:45`, `grid/save.js` | 0.5d |
| CQ-8 | Medium | Header injection sanitization pattern repeated 6 times | `includes/blocks/class-form-handler.php:847-955` | 0.5d |
| CQ-9 | Low | Magic strings: `'designsetgo/v1'` used in 27 places, `'dsgo_form_submission'` in 12 | Multiple files | 0.5d |
| CQ-10 | Low | Magic numbers for settings defaults, rate limits, breakpoints not extracted to constants | `includes/admin/class-settings.php`, `class-form-handler.php` | 0.5d |

### 2. Test Debt

| # | Severity | Issue | File(s) | Effort |
|---|----------|-------|---------|--------|
| TD-1 | Critical | Zero E2E tests for any of 51 custom blocks | `tests/e2e/` | 15+d |
| TD-2 | Critical | Zero JS unit tests for block edit/save components | `tests/unit/` | 10-15d |
| TD-3 | High | 20+ PHP classes with no test coverage (Settings, GDPR, Admin, Revision system) | `tests/phpunit/` | 5-8d |
| TD-4 | High | Jest coverage threshold at 50% (industry standard: 80%) | `jest.config.js` | Ongoing |
| TD-5 | Medium | Some JS utility tests re-implement functions locally instead of importing from source | `tests/unit/utils.test.js` | 1d |
| TD-6 | Medium | 11 PHP tests conditionally skipped (`markTestSkipped`) based on runtime state | `tests/phpunit/` | 1d |
| TD-7 | Low | No shared PHP test fixtures or mock helpers beyond WordPress factory | `tests/phpunit/` | 2d |

### 3. Dependency Debt

| # | Severity | Issue | File(s) | Effort |
|---|----------|-------|---------|--------|
| DD-1 | High | Deploy workflows use Node 18 (EOL) while dev/CI use Node 20 | `.github/workflows/deploy.yml`, `deploy-assets.yml` | 0.5d |
| DD-2 | Medium | Missing `composer.lock` -- PHP deps not reproducible | Project root | 0.5d |
| DD-3 | Medium | `@wordpress/components` 4 major versions behind (28.x vs 32.x) | `package.json` | 2-3d |
| DD-4 | Low | Unused devDep `@wordpress/e2e-test-utils` (project uses Playwright) | `package.json` | 0.1d |
| DD-5 | Low | Unused devDep `baseline-browser-mapping` | `package.json` | 0.1d |
| DD-6 | Low | 4 npm overrides pinning transitive deps -- should revisit on next major update | `package.json` | 0.5d |

### 4. Documentation Debt

| # | Severity | Issue | File(s) | Effort |
|---|----------|-------|---------|--------|
| DOC-1 | Medium | No unified REST API reference document (26 endpoints scattered across 6 controllers) | Missing `docs/api/REST-API-REFERENCE.md` | 2d |
| DOC-2 | Medium | ~10 REST endpoints lack `args` schemas (no validation, no description) | `class-settings.php`, `class-global-styles.php`, LLMS TXT | 2d |
| DOC-3 | Low | README says "Google reCAPTCHA v3" but code uses Cloudflare Turnstile | `README.md:192` | 0.1d |
| DOC-4 | Low | 2 stale TODOs (webpack splitChunks + icon-injector -- migration is 6/6 complete) | `webpack.config.js:154-156`, `class-icon-injector.php:116` | 0.1d |
| DOC-5 | Low | No hook/filter developer reference (inline docs exist but no consolidated list) | Missing `docs/api/HOOKS-REFERENCE.md` | 1d |

### 5. Design & Architecture Debt

| # | Severity | Issue | File(s) | Effort |
|---|----------|-------|---------|--------|
| DA-1 | High | `Plugin` class is a God Object (19 public subsystem properties, 3 embedded responsibilities) | `includes/class-plugin.php` | 2-3d |
| DA-2 | High | Zero dependency injection -- all deps hardcoded via `new` | Entire `includes/` | 5-8d |
| DA-3 | High | Inconsistent error handling in abilities: mix of `new WP_Error()` and `$this->error()` | `includes/abilities/inserters/*.php` | 1d |
| DA-4 | Medium | Cross-block import: divider imports directly from icon internals | `src/blocks/divider/edit.js:13-14` | 0.5d |
| DA-5 | Medium | No PHP interfaces -- all dependencies on concrete classes | Entire `includes/` | 3-5d |
| DA-6 | Low | Inconsistent component naming (`Edit` vs `SectionEdit` vs `DividerEdit`) | `src/blocks/*/edit.js` | 1d |
| DA-7 | Low | Inconsistent `classnames` usage (library import vs manual string building) | Various block files | 1d |
| DA-8 | Low | Inconsistent singleton accessor naming (`instance()` vs `get_instance()`) | `class-plugin.php`, `class-abilities-registry.php` | 0.1d |

### 6. Infrastructure Debt

| # | Severity | Issue | File(s) | Effort |
|---|----------|-------|---------|--------|
| INF-1 | High | PHP 8.3 not in CI matrix despite being dev env version | `.github/workflows/ci.yml:18-20` | 0.5d |
| INF-2 | Medium | CI builds `npm run build` 3 times (once per PHP version) -- output is identical | `.github/workflows/ci.yml` | 0.5d |
| INF-3 | Low | E2E only tests Chromium in CI despite multi-browser config | `.github/workflows/ci.yml:224` | 0.5d |
| INF-4 | Low | No `composer audit` in CI security check | `.github/workflows/ci.yml:161-180` | 0.2d |

### 7. Performance Debt

| # | Severity | Issue | File(s) | Effort |
|---|----------|-------|---------|--------|
| PF-1 | High | Global `render_block` filters for map + custom CSS (2 callbacks on every block) | `class-plugin.php:289`, `class-custom-css-renderer.php:93` | 0.5d |
| PF-2 | High | Block style variations add N filter closures to `wp_theme_json_data_default` | `includes/blocks/class-loader.php:234-251` | 1-2d |
| PF-3 | High | `Settings::get_settings()` called 18+ times with no static cache | `includes/admin/class-settings.php:542` | 0.5d |
| PF-4 | Medium | Dead code in icon migration: `has_unconverted_blocks()` always returns false | `includes/class-icon-injector.php:166-189` | 0.5d |
| PF-5 | Medium | Block.json read twice during registration (once by Loader, once by WP core) | `includes/blocks/class-loader.php:131,138` | 0.5d |
| PF-6 | Low | N+1 meta queries in GDPR export (mitigated by WP object cache) | `includes/admin/class-gdpr-compliance.php:108-160` | 0.5d |

---

## Fowler Technical Debt Quadrant Classification

### Reckless & Deliberate
- None identified. The codebase does not show signs of deliberately cutting corners for speed.

### Prudent & Deliberate
- **Icon migration temporary code** -- The webpack splitChunks and icon injector compatibility code was deliberately kept during migration. Now that migration is complete (6/6 blocks), this should be cleaned up.
- **50% Jest coverage threshold** -- Deliberately set low to avoid blocking development while building up coverage.

### Reckless & Inadvertent
- **Global `render_block` filters** -- Using the generic filter instead of block-specific `render_block_{$blockName}` suggests unawareness of the more targeted API.
- **Block style variation filter accumulation** -- Adding N closures instead of batching indicates the performance implication wasn't considered.

### Prudent & Inadvertent
- **`Block_Inserter` growth** -- Started as a reasonable utility class and grew organically as blocks were added. Now at ~2.8k lines, it needs architectural intervention.
- **Form field code duplication** -- Copy-paste was expedient when adding each form field type, but with 12 configurators, the duplication has become significant.
- **No dependency injection** -- Common in WordPress plugin development due to the global-first architecture. Not reckless, but limits testability.

---

## Sprint-Ready Work Items

### Sprint 1: Quick Wins & Performance Fixes

**Story 1: Fix global render_block filters**
- Priority: High
- Effort: 2 story points
- Acceptance Criteria:
  - [ ] Replace `render_block` with `render_block_designsetgo/map` in `class-plugin.php:289`
  - [ ] Replace `render_block` with block-specific filters in `class-custom-css-renderer.php:93`
  - [ ] All existing tests pass
  - [ ] Frontend rendering verified manually

**Story 2: Batch block style variation filter**
- Priority: High
- Effort: 3 story points
- Acceptance Criteria:
  - [ ] Single filter callback for all block style variations in `class-loader.php`
  - [ ] Theme.json data correctly applied for all style variations
  - [ ] No duplicate filter registrations

**Story 3: Add static caching to Settings::get_settings()**
- Priority: High
- Effort: 1 story point
- Acceptance Criteria:
  - [ ] Static cache variable added
  - [ ] Cache invalidated on settings update
  - [ ] Settings behavior unchanged
  - [ ] PHP tests pass

**Story 4: Fix deploy workflow Node version and actions**
- Priority: High
- Effort: 1 story point
- Acceptance Criteria:
  - [ ] `deploy.yml` uses Node 20
  - [ ] `deploy-assets.yml` uses Node 20
  - [ ] Both workflows use `actions/checkout@v4` and `actions/setup-node@v4`

**Story 5: Add PHP 8.3 to CI matrix**
- Priority: High
- Effort: 1 story point
- Acceptance Criteria:
  - [ ] PHP 8.3 added to `build-and-test` and `wordpress-compatibility` matrices
  - [ ] All tests pass on PHP 8.3

**Story 6: Clean up completed icon migration**
- Priority: Medium
- Effort: 2 story points
- Acceptance Criteria:
  - [ ] Remove stale TODOs from `webpack.config.js` and `class-icon-injector.php`
  - [ ] Remove dead `has_unconverted_blocks()` code path
  - [ ] Evaluate if splitChunks icon config can be simplified
  - [ ] All tests pass, build output unchanged

### Sprint 2: Code Quality & Deduplication

**Story 7: Consolidate form field configurators**
- Priority: High
- Effort: 3 story points
- Acceptance Criteria:
  - [ ] Single generic `Configure_Form_Field` class replaces 12 identical files
  - [ ] Each field type registered with data-driven approach
  - [ ] All abilities function identically (verified via smoke tests)

**Story 8: Standardize error handling in abilities**
- Priority: Medium
- Effort: 3 story points
- Acceptance Criteria:
  - [ ] All inserters use `$this->error()` helper
  - [ ] All permission callbacks return consistent types
  - [ ] No direct `new WP_Error()` calls in abilities except base classes

**Story 9: Extract shared utilities**
- Priority: Medium
- Effort: 2 story points
- Acceptance Criteria:
  - [ ] `convertPresetToCSSVar()` extracted to `src/utils/`
  - [ ] Icon picker/SVG utilities extracted to `src/blocks/shared/` or `src/components/`
  - [ ] Divider block imports from shared location (not icon internals)
  - [ ] Header sanitization helper extracted in `Form_Handler`
  - [ ] All builds pass

**Story 10: Generate `composer.lock` and fix README**
- Priority: Medium
- Effort: 1 story point
- Acceptance Criteria:
  - [ ] `composer.lock` committed to repository
  - [ ] README updated: reCAPTCHA reference corrected to Turnstile
  - [ ] Unused deps (`@wordpress/e2e-test-utils`, `baseline-browser-mapping`) removed from `package.json`

### Sprint 3-4: Test Coverage Foundation

**Story 11: Add E2E tests for 5 core blocks**
- Priority: Critical
- Effort: 13 story points
- Acceptance Criteria:
  - [ ] E2E tests for Section block (insert, attributes, frontend)
  - [ ] E2E tests for Accordion block (insert, open/close, frontend)
  - [ ] E2E tests for Tabs block (insert, tab switching, frontend)
  - [ ] E2E tests for Slider block (insert, slide management, frontend)
  - [ ] E2E tests for Form Builder block (insert, submit, validation)
  - [ ] All tests pass in CI

**Story 12: Add JS unit tests for complex block components**
- Priority: High
- Effort: 8 story points
- Acceptance Criteria:
  - [ ] Unit tests for `slider/edit.js` (997 lines, most complex)
  - [ ] Unit tests for `comparison-table/edit.js` (827 lines)
  - [ ] Unit tests for `card/edit.js` (829 lines)
  - [ ] Unit tests for `form-builder/edit.js` (782 lines)
  - [ ] Coverage threshold raised to 60%

**Story 13: Add PHP tests for admin classes**
- Priority: High
- Effort: 5 story points
- Acceptance Criteria:
  - [ ] Unit tests for `Settings` class (sanitization, defaults, REST endpoints)
  - [ ] Unit tests for `GDPR_Compliance` (export, erase, data handling)
  - [ ] Unit tests for `Revision_REST_API` (endpoints, permissions)
  - [ ] All tests pass in CI

---

## Refactoring Roadmap (Quarterly)

### Phase 1 (Weeks 1-2): Quick Wins
- Performance fixes (render_block filters, settings caching, style variation batching)
- CI fixes (Node version, PHP 8.3 matrix, deploy actions)
- Icon migration cleanup
- `composer.lock` generation

### Phase 2 (Weeks 3-4): Deduplication & Consistency
- Consolidate 12 form field configurators
- Extract shared utilities
- Standardize error handling across abilities
- Remove unused dependencies

### Phase 3 (Weeks 5-8): Test Coverage
- E2E tests for top 10 blocks
- JS component tests for complex blocks
- PHP tests for admin/settings classes
- Raise Jest coverage threshold to 70%

### Phase 4 (Weeks 9-12): Architecture
- Decompose `Block_Inserter` into per-block strategy classes
- Extract `Form_Handler` responsibilities (SpamDetector, RateLimiter, EmailNotifier)
- Add REST API `args` schemas to all endpoints
- Create unified REST API reference documentation

### Phase 5 (Ongoing): Prevention
- Add PR template with technical debt checklist
- Enforce complexity limits in CI (fail build on cyclomatic complexity > 15)
- Add per-file coverage thresholds for critical paths
- Monthly dependency update cycle

---

## Metrics to Track

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| JS Test Coverage | ~50% | 80% | Q3 2026 |
| PHP Test Coverage | ~40% (estimated) | 70% | Q3 2026 |
| E2E Specs | 1 | 20+ | Q2 2026 |
| Avg. Cyclomatic Complexity | ~15 (est.) | < 10 | Q4 2026 |
| Max File Size (PHP) | ~2.8k lines | < 500 lines | Q3 2026 |
| Code Duplication | Moderate | < 5% | Q2 2026 |
| Critical/High CVEs | 0 | 0 | Maintained |
| Outdated Dependencies (major) | 5 | < 2 | Q2 2026 |
| REST Endpoints with `args` | ~16/26 | 26/26 | Q2 2026 |
| TODO/FIXME Count | 5 | 0 (tracked in issues) | Q2 2026 |

---

## Strengths (No Action Needed)

These areas demonstrate excellent engineering practices:

1. **Inline documentation**: 100% PHPDoc coverage across all 146 classes and 773 methods
2. **Frontend asset optimization**: Conditional loading, critical CSS inlining, deferred non-critical CSS
3. **Extension architecture**: Clean hook-based system with zero coupling to core blocks
4. **Abilities system design**: Template Method pattern for configurators, auto-discovery registry
5. **Pattern loading**: Editor-only registration with transient caching and security validation
6. **Security**: Thorough XSS/CSRF/injection testing, rate limiting, Turnstile integration
7. **Documentation volume**: 93 markdown docs across 14 organized subdirectories
8. **CI comprehensiveness**: 5 workflow jobs covering lint, build, test, security, and compatibility
9. **WordPress compatibility matrix**: Testing against WP 6.7, 6.8, 6.9, and latest
10. **License compliance**: All dependencies use GPL-compatible licenses

---

*Report generated by automated technical debt analysis. All line numbers reference the codebase as of 2026-02-07.*
