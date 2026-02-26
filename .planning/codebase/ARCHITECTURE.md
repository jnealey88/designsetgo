# Architecture

**Analysis Date:** 2026-02-26

## Pattern Overview

**Overall:** WordPress Block Plugin — Plugin-per-Block with Extension Overlay

DesignSetGo is a WordPress Gutenberg block plugin that registers ~52 custom blocks plus 16 cross-cutting extensions. It follows the WordPress block architecture (block.json registration, React edit/save components, PHP server-side rendering hooks) with a custom extension system layered on top.

**Key Characteristics:**
- Each block is a self-contained unit: `block.json`, `edit.js`, `save.js`, `view.js`, `index.js`, `editor.scss`, `style.scss`
- Extensions use `addFilter('blocks.registerBlockType')` to inject attributes/UI into ALL blocks (or a filtered subset)
- PHP mirrors JS extension attribute definitions via `includes/class-extension-attributes.php` for REST API parity
- Singleton `Plugin` class (`includes/class-plugin.php`) bootstraps all server-side components
- An AI-native Abilities API (`includes/abilities/`) exposes block insertion/configuration programmatically

## Layers

**Plugin Bootstrap:**
- Purpose: Entry point, constants, singleton init
- Location: `designsetgo.php`
- Contains: PHP constants (`DESIGNSETGO_VERSION`, `DESIGNSETGO_PATH`, `DESIGNSETGO_URL`), `designsetgo_init()`, activation/deactivation hooks
- Depends on: `includes/class-plugin.php`
- Used by: WordPress plugin loader

**Core Plugin Singleton:**
- Purpose: Dependency injection container; loads all PHP classes and hooks into WordPress
- Location: `includes/class-plugin.php`
- Contains: `Plugin::instance()` (singleton), `load_dependencies()`, `init()`, KSES/SVG/form element allowlist constants
- Depends on: All `includes/` classes
- Used by: `designsetgo.php`

**Block Registration (PHP):**
- Purpose: Auto-discovers and registers blocks from the `build/` directory
- Location: `includes/blocks/class-loader.php`
- Contains: `register_blocks()` (glob over `build/blocks/*/block.json`), shared chunk registration, block style variation registration
- Depends on: WordPress `register_block_type()`, `build/` directory
- Used by: `Plugin::init()`

**Block Source (JS/SCSS):**
- Purpose: Editor + frontend implementation of each block
- Location: `src/blocks/{block-name}/`
- Contains: `index.js` (registers block), `edit.js` (editor React component), `save.js` (serialized HTML), `view.js` (frontend script), `block.json` (schema + supports), `editor.scss`, `style.scss`
- Depends on: `@wordpress/blocks`, `@wordpress/block-editor`, shared utils
- Used by: Webpack build → PHP `register_block_type()`

**Extensions (JS):**
- Purpose: Cross-cutting attribute/UI additions to existing blocks (core + custom)
- Location: `src/extensions/{extension-name}/`
- Contains: `index.js`, `attributes.js` (filter: `blocks.registerBlockType`), `editor.js` (filter: `editor.BlockEdit`), optional `view.js`
- Depends on: `@wordpress/hooks`, `src/utils/should-extend-block.js`
- Used by: `src/index.js` (imported in editor bundle)

**Extension Attributes Mirror (PHP):**
- Purpose: Registers JS extension attributes server-side so the REST API block-types endpoint exposes them
- Location: `includes/class-extension-attributes.php`
- Contains: `inject_extension_attributes()` filter on `register_block_type_args`
- Depends on: `includes/extension-configs/*.php` (one config file per extension)
- Used by: `Plugin::init()`

**Admin Layer:**
- Purpose: Plugin settings, admin menu, GDPR compliance, block manager, draft mode, revision comparison
- Location: `includes/admin/`
- Contains: `class-settings.php`, `class-admin-menu.php`, `class-block-manager.php`, `class-gdpr-compliance.php`, `class-draft-mode.php`, `class-revision-comparison.php`, `class-block-migrator.php`, `class-global-styles.php`
- Depends on: WordPress admin APIs, REST API
- Used by: `Plugin::init()` (some only under `is_admin()`)

**Assets Management:**
- Purpose: Enqueue editor and frontend scripts/CSS with performance optimizations
- Location: `includes/class-assets.php`
- Contains: `enqueue_editor_assets()`, `enqueue_frontend_assets()`, `has_designsetgo_blocks()` (cached block detection), critical CSS inlining, non-critical CSS deferral
- Depends on: WordPress enqueue APIs, `build/` directory
- Used by: `Plugin::init()`

**Abilities API (PHP):**
- Purpose: AI-native programmatic access to block insertion, configuration, layout generation
- Location: `includes/abilities/`
- Contains: `class-abilities-registry.php` (singleton, auto-discovers classes), abstract base classes, `inserters/`, `configurators/`, `generators/`, `info/` subdirectories
- Depends on: WordPress Abilities API (`wp_register_ability`) polyfilled from `vendor/wordpress/abilities-api/`
- Used by: `Plugin::init()`

**Patterns:**
- Purpose: Registered block patterns grouped by category
- Location: `patterns/` (PHP template files), `includes/patterns/class-loader.php`
- Contains: Category subdirectories (`hero/`, `cta/`, `features/`, etc.) with PHP pattern registration files
- Depends on: WordPress `register_block_pattern()`
- Used by: `Plugin::init()`

**Frontend Scripts:**
- Purpose: Block interactivity on the frontend (no editor dependency)
- Location: `src/blocks/{block}/view.js` (per-block), `src/frontend/lazy-icon-injector.js` (global)
- Contains: DOM manipulation, intersection observers, event listeners; uses `data-dsgo-*` selectors
- Depends on: `window.dsgoSettings`, `window.dsgoIcons` (injected by PHP via `wp_localize_script`)
- Used by: `build/frontend.js` bundle, per-block `viewScript` in block.json

## Data Flow

**Block Rendering (Frontend):**

1. PHP `register_block_type()` reads `build/blocks/{name}/block.json`
2. WordPress serializes block attributes into post content as HTML comments
3. On frontend request, WordPress parses block comment delimiters and calls PHP `render_callback` (if dynamic) or returns static save HTML
4. `render_block` filter hooks in `Plugin` inject parallax data attributes, API keys, and animation defaults into HTML output
5. `enqueue_frontend_assets()` conditionally loads CSS + JS only when blocks are detected on page

**Extension Attribute Injection:**

1. `src/index.js` imports all extensions before any blocks load
2. Each extension calls `addFilter('blocks.registerBlockType', ...)` to merge `dsgo*` attributes into every block's schema
3. On the PHP side, `Extension_Attributes::inject_extension_attributes()` mirrors the same attributes via `register_block_type_args` filter
4. Settings exclusion list (`dsgoSettings.excludedBlocks`) is passed from PHP to JS via `wp_localize_script` to allow per-namespace opt-out

**Form Submission:**

1. Frontend `view.js` captures form submit event, prevents default
2. AJAX POST to WP REST API endpoint registered by `includes/blocks/class-form-handler.php`
3. `Form_Security` validates honeypot, rate limit, Cloudflare Turnstile
4. `Form_Handler` sanitizes fields, stores submission via `Form_Submissions`, sends email notification
5. Action hooks (`designsetgo_form_submitted`, etc.) allow external integrations

**State Management:**
- Block attributes are the canonical state store (WordPress standard)
- Parent→child context passing via `providesContext` / `usesContext` in block.json (accordion, tabs, form-builder, section all use this)
- No Redux store beyond `@wordpress/data` / `core/block-editor`
- Frontend state via DOM data attributes (`data-dsgo-*`) and CSS custom properties (`--dsgo-*`)

## Key Abstractions

**Block (`src/blocks/{name}/`):**
- Purpose: Self-contained UI component registered with WordPress block system
- Examples: `src/blocks/accordion/`, `src/blocks/section/`, `src/blocks/form-builder/`
- Pattern: `index.js` calls `registerBlockType(metadata.name, { edit, save })` importing from `block.json`

**Extension (`src/extensions/{name}/`):**
- Purpose: Adds attributes and inspector controls to blocks outside the block's own code
- Examples: `src/extensions/block-animations/`, `src/extensions/responsive/`, `src/extensions/max-width/`
- Pattern: `attributes.js` uses `addFilter('blocks.registerBlockType')`, `editor.js` uses `addFilter('editor.BlockEdit')`

**Extension Config (`includes/extension-configs/*.php`):**
- Purpose: PHP mirror of JS extension attribute schemas for server-side/REST API awareness
- Examples: `includes/extension-configs/block-animations.php`, `includes/extension-configs/responsive.php`
- Pattern: Returns array with `blocks` (string `'all'` or array), `exclude` (array), `attributes` (array matching block.json schema format)

**Ability (`includes/abilities/`):**
- Purpose: Programmatic block operations exposed to AI agents via WordPress Abilities API
- Examples: `includes/abilities/inserters/class-insert-section.php`, `includes/abilities/configurators/class-configure-accordion.php`
- Pattern: Extends `Abstract_Ability`, auto-discovered by `Abilities_Registry` from directory scan

**Shared Utilities (`src/utils/`):**
- Purpose: Cross-block JS helpers
- Examples: `src/utils/should-extend-block.js`, `src/utils/convert-preset-to-css-var.js`, `src/utils/encode-color-value.js`, `src/utils/css-generator.js`
- Pattern: Named exports, imported directly by blocks and extensions

## Entry Points

**PHP Plugin Bootstrap:**
- Location: `designsetgo.php`
- Triggers: WordPress plugin load
- Responsibilities: Define constants, require `class-plugin.php`, call `Plugin::instance()`, register activation/deactivation hooks

**Editor JavaScript Bundle:**
- Location: `src/index.js` → compiled to `build/index.js`
- Triggers: `enqueue_block_assets` hook via `Assets::enqueue_editor_assets()`
- Responsibilities: Import all extensions (in order, before blocks), register RichText formats, set container default padding filter

**Individual Block Editor Scripts:**
- Location: `src/blocks/{name}/index.js` → compiled to `build/blocks/{name}/index.js`
- Triggers: `editorScript` in `block.json`, auto-enqueued by WordPress when block is rendered in editor
- Responsibilities: `registerBlockType()` with edit/save components

**Frontend JavaScript Bundle:**
- Location: `src/frontend.js` → compiled to `build/frontend.js`
- Triggers: `wp_enqueue_scripts` hook via `Assets::enqueue_frontend_assets()` (conditional on block presence)
- Responsibilities: Global frontend behaviors (animations, sticky header utilities, icon injection)

**Per-Block Frontend Scripts:**
- Location: `src/blocks/{name}/view.js` → compiled to `build/blocks/{name}/view.js`
- Triggers: `viewScript` in `block.json`, auto-enqueued by WordPress on pages using that block
- Responsibilities: Block-specific interactivity (accordion toggle, tabs switching, countdown, etc.)

**Admin Dashboard:**
- Location: `src/admin/index.js` → compiled to `build/admin.js`
- Triggers: Admin menu pages registered by `Admin\Admin_Menu`
- Responsibilities: Plugin settings UI, form submissions list, GDPR tools

## Error Handling

**Strategy:** Fail silently on frontend; log to `error_log` in WP_DEBUG mode on backend

**Patterns:**
- PHP: `if (!file_exists($path)) return;` guards before any asset include
- PHP: `WP_DEBUG && error_log(...)` for missing build artifacts
- JS: `try/catch` in icon injector; extensions use `shouldExtendBlock()` cache to avoid repeated lookups on bad block names
- Form handler: Returns `WP_Error` objects via REST API, frontend translates to user messages
- Build-time: Asset `.asset.php` manifest files checked for existence before `include`

## Cross-Cutting Concerns

**Logging:** `error_log()` in PHP (WP_DEBUG only); `console.error()` in JS for icon injection failures only

**Validation:** PHP — `sanitize_*()`, `esc_*()`, `wp_kses_post()`, `$wpdb->prepare()`. Form fields validated in `Form_Handler` and `Form_Security`. JS — block attributes validated via block.json `enum` constraints

**Authentication:** WordPress nonces for AJAX/REST; `current_user_can()` checks in admin operations; form submissions use REST API with custom nonce verification via `Form_Security`

**KSES:** `Plugin` class extends `safe_style_css`, `safecss_filter_attr_allow_css`, and `wp_kses_allowed_html` filters to allow modern CSS properties, SVG elements, and form elements that block save() output requires

**Asset Optimization:** Critical block CSS (grid, row, icon, pill) inlined in `<head>`; non-critical block CSS (tabs, accordion, maps, forms) deferred via `media="print"` trick; block presence detection cached in object cache keyed by post ID + modified time

---

*Architecture analysis: 2026-02-26*
