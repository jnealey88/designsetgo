# Technology Stack

**Analysis Date:** 2026-02-26

## Languages

**Primary:**
- PHP 8.0+ - Server-side plugin logic, block rendering, REST API handlers
- JavaScript (ES2021+, JSX) - Gutenberg block editor and frontend interactivity

**Secondary:**
- SCSS - Block and global styles (compiled to CSS via webpack)
- JSON - Block registration manifests (`block.json` per block)

## Runtime

**Environment:**
- WordPress 6.7+ (requires at least 6.7, tested up to 6.9)
- PHP 8.0 minimum, tested on 8.0 / 8.1 / 8.2 / 8.3

**Package Manager:**
- npm 11.x (current: 11.4.2)
- Composer (PHP dependencies)
- Lockfile: `package-lock.json` present, `composer.lock` generated on install

## Frameworks

**Core:**
- WordPress Block Editor (Gutenberg) - All UI built as Gutenberg blocks and extensions
  - `@wordpress/block-editor` ^14.0.0
  - `@wordpress/blocks` ^13.0.0
  - `@wordpress/components` ^32.0.0
  - `@wordpress/data` ^10.0.0
  - `@wordpress/element` ^6.0.0 (React wrapper)
  - `@wordpress/i18n` ^5.0.0
  - `@wordpress/icons` ^10.0.0

**Testing:**
- Jest ^30.2.0 - JavaScript unit tests; config: `jest.config.js`
- `@playwright/test` ^1.56.1 - E2E browser tests; config: `playwright.config.js`
- PHPUnit ^9.0 - PHP unit tests; config: `phpunit.xml.dist`
- `@testing-library/react` ^16.3.2 - React component test utilities
- `@testing-library/user-event` ^14.6.1 - User interaction simulation

**Build/Dev:**
- `@wordpress/scripts` ^30.0.0 - Wraps webpack, ESLint, Stylelint, Prettier
- webpack 5 (via `@wordpress/scripts`) - Custom config at `webpack.config.js`
  - Multi-entry: `src/index.js`, `src/frontend.js`, `src/admin/index.js`, per-block entries
  - Filesystem cache enabled for faster rebuilds
  - Bundle analyzer: `ANALYZE=true npm run build` → `bundle-report.html`
- `@wordpress/env` ^10.0.0 - Local WordPress environment via Docker; config: `.wp-env.json`
- husky ^9.0.0 + lint-staged ^15.0.0 - Pre-commit hooks

## Key Dependencies

**Critical:**
- `leaflet` ^1.9.4 - OpenStreetMap rendering for the Map block (`src/blocks/map/`)
  - Bundled directly (not loaded from CDN) to avoid CSP violations
  - Custom webpack CSS loader rule prevents `url()` resolution for Leaflet images
- `countup.js` ^2.9.0 - Animated number counting for the Counter block (`src/blocks/counter/`)
- `classnames` ^2.3.2 - Dynamic CSS class composition across block components
- `wordpress/abilities-api` (via Composer vendor) - WordPress 6.9 Abilities API polyfill for < 6.9

**Infrastructure:**
- `webpack-bundle-analyzer` ^4.10.2 - Bundle size visualization (dev only)
- `babel-jest` ^30.2.0 - Jest transform for JSX
- `jest-environment-jsdom` ^30.2.0 - DOM simulation for unit tests
- `yoast/phpunit-polyfills` ^2.0 - PHPUnit compatibility layer
- `wp-coding-standards/wpcs` ^3.0 - WordPress PHPCS rules
- `phpstan/phpstan` ^1.10 + `szepeviktor/phpstan-wordpress` ^1.3 - PHP static analysis

## Configuration

**Environment:**
- No `.env` file required for local development
- WordPress environment configured via `.wp-env.json`:
  - WordPress 6.9, PHP 8.3, port 8891 (dev), 8892 (tests)
  - Themes: Twenty Twenty-Four 1.3, Twenty Twenty-Five 1.4
  - Debug flags: `WP_DEBUG=true`, `SCRIPT_DEBUG=true`
- Plugin settings stored in WordPress `wp_options` table under `designsetgo_settings`
- Integration API keys stored in `designsetgo_settings['integrations']`:
  - `google_maps_api_key` - Google Maps JavaScript API key
  - `turnstile_site_key` / `turnstile_secret_key` - Cloudflare Turnstile

**Build:**
- `webpack.config.js` - Extends `@wordpress/scripts` webpack config
- `jest.config.js` - Extends `@wordpress/scripts` Jest config
- `playwright.config.js` - E2E config pointing to `http://localhost:8888` (or `WP_BASE_URL`)
- `phpcs.xml` - PHPCS rules (WordPress-Core, WordPress-Docs, WordPress-Extra)
- `phpstan.neon` - PHPStan config
- `phpunit.xml.dist` - PHPUnit test suite config

## Platform Requirements

**Development:**
- Node.js 20.x (CI enforces this; local: 24.4.0)
- PHP 8.0+
- Docker (required by `@wordpress/env`)
- Composer

**Production:**
- WordPress 6.7+ (PHP min 8.0)
- Deployed to WordPress.org plugin directory via SVN
- No server-side Node.js or build step required at runtime

---

*Stack analysis: 2026-02-26*
