# Codebase Concerns

**Analysis Date:** 2026-02-26

## Tech Debt

**icon-button Block: Excessive Deprecation Accumulation:**
- Issue: Six deprecation versions (v1–v6) spanning 1,187 lines. Each structural change creates a new deprecation entry instead of migrating old content.
- Files: `src/blocks/icon-button/deprecated.js`
- Impact: Every block render must walk the deprecation chain until a match is found, increasing parse time. Future changes require adding v7, compounding the issue indefinitely.
- Fix approach: Run a post migration using `Block_Migrator` to upgrade old icon-button instances to current structure, then prune v1–v4 from the deprecation chain.

**Oversized Edit Components Violating 300-Line Max:**
- Issue: Several `edit.js` files far exceed the 300-line maximum stated in CLAUDE.md. The slider, card, comparison-table, and section editors are all 500–1,100 lines.
- Files: `src/blocks/slider/edit.js` (1,077), `src/blocks/card/edit.js` (865), `src/blocks/comparison-table/edit.js` (857), `src/blocks/section/edit.js` (616), `src/blocks/tabs/edit.js` (571), `src/blocks/grid/edit.js` (551), `src/blocks/countdown-timer/edit.js` (526)
- Impact: Difficult to maintain, review, and test. Changes in one area risk regressions in another.
- Fix approach: Extract inspector panel sections into dedicated component files under `components/inspector/`, following the pattern already used in `countdown-timer/components/inspector/`.

**BlocksExtensions Admin Component Is a Monolith:**
- Issue: `src/admin/components/BlocksExtensions.js` is 815 lines with no sub-components.
- Files: `src/admin/components/BlocksExtensions.js`
- Impact: Hard to test in isolation; any change requires reading the entire file.
- Fix approach: Extract individual settings panels (already started for `LLMSTxtPanel.js`, `StickyHeaderPanel.js`) into their own components, then reduce `BlocksExtensions.js` to a composition layer.

**modal/view.js Is a Single 1,823-Line Class:**
- Issue: The entire modal system lives in one IIFE with a single `DSGModal` class. It handles open/close, focus trapping, gallery navigation, swipe, hash routing, exit intent, scroll detection, and external API.
- Files: `src/blocks/modal/view.js`
- Impact: Very high cyclomatic complexity. A bug in one behavior can affect all others. Unit test coverage is minimal.
- Fix approach: Split into strategy objects: `DSGModalBehavior` (open/close/focus), `DSGModalGallery`, `DSGModalTrigger`, `DSGModalAPI`.

**Largest PHP Classes Exceed 1,000+ Lines:**
- Issue: `class-block-inserter.php` (2,248 lines), `class-block-migrator.php` (1,198 lines), `class-block-configurator.php` (1,120 lines), `class-plugin.php` (1,102 lines).
- Files: `includes/abilities/class-block-inserter.php`, `includes/admin/class-block-migrator.php`, `includes/abilities/class-block-configurator.php`, `includes/class-plugin.php`
- Impact: Single-responsibility violations. Hard to trace execution paths and write unit tests.
- Fix approach: Extract specific responsibilities into smaller service classes. `class-plugin.php` already delegates well; continue splitting the abilities classes by block type or operation.

**Nominatim API Debouncing Disabled:**
- Issue: Debounce for geocoding address search was explicitly removed (comment reads "Debouncing removed for now"). Nominatim's terms of service require a maximum of 1 request/second per user.
- Files: `src/blocks/map/components/inspector/MapSettingsPanel.js` (lines 82–86)
- Impact: Rapid typing in the address field fires one Nominatim request per keypress. This can get the site IP rate-limited or blocked by Nominatim.
- Fix approach: Re-enable the commented-out debounce or use `useCallback` with a 1,000 ms delay before calling `handleAddressSearch`.

**Turnstile Secret Key Stored in Plain Text in `wp_options`:**
- Issue: `turnstile_secret_key` and `google_maps_api_key` are stored as plain text via `update_option('designsetgo_settings', ...)`. No encryption is applied.
- Files: `includes/admin/class-settings.php` (lines 95–97, 610–612), `includes/blocks/class-form-security.php` (lines 130–131)
- Impact: Any code that can read `wp_options` (plugins, shell access) can retrieve the Cloudflare secret key, which can be used to bypass Turnstile verification entirely.
- Fix approach: Encrypt the secret key before storing (e.g., using `openssl_encrypt` with a site-specific salt), decrypt on read. Or document that users should use environment variables via a `define('DSGO_TURNSTILE_SECRET', ...)` approach.

**icon/utils/svg-icons.js Is a 1,942-Line Icon Lookup Table:**
- Issue: All SVG icon paths are concatenated into a single JavaScript module. This is imported by both editor and frontend contexts.
- Files: `src/blocks/icon/utils/svg-icons.js`
- Impact: Large bundle impact even when only a small subset of icons is used per page. The `lazy-icon-injector.js` attempts to address this on the frontend, but the full file is still bundled.
- Fix approach: Convert to a JSON file split by category, loaded on demand. The lazy loading infrastructure already exists in `src/frontend/lazy-icon-injector.js` and `src/utils/lazy-icon-library.js`.

**`!important` Overuse in SCSS (567 occurrences):**
- Issue: 567 non-accessibility `!important` declarations across block SCSS files, particularly in `tabs/style.scss`, `section/editor.scss`, and `countdown-timer/editor.scss`.
- Files: `src/blocks/tabs/style.scss`, `src/blocks/section/editor.scss`, `src/blocks/countdown-timer/editor.scss`, and many others.
- Impact: High specificity cascade makes theme customization fragile. Third-party plugins cannot predictably override styles.
- Fix approach: Use `:where()` scoping and more specific selectors to win specificity without `!important`. Reserve `!important` for accessibility and WP core overrides per CLAUDE.md.

---

## Known Bugs / Issues

**Form Submission Table: Unescaped HTML Output:**
- Symptoms: The `render_submission_details()` method echoes a pre-built HTML string with `phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped`.
- Files: `includes/blocks/class-form-submissions.php` (line 145)
- Trigger: Viewing any form submission detail page in wp-admin when the submitted value is an email or URL type.
- Workaround: The email and URL values are escaped before being wrapped in the link HTML (lines 134–136), so exploitability is limited, but the pattern is unsafe.
- Fix approach: Use `wp_kses()` with a restricted allowed-HTML allowlist on the final output rather than ignoring the rule.

**Slider Arrows Use `innerHTML` with Static Strings:**
- Symptoms: `arrowsContainer.innerHTML` is assigned a template literal containing hardcoded HTML button elements.
- Files: `src/blocks/slider/view.js` (lines 201–208)
- Trigger: Any page rendering the slider block with arrows enabled.
- Workaround: The strings are static, so there is no XSS risk, but the aria-labels (`"Previous slide"`, `"Next slide"`, `"Slide navigation"`, `"Go to slide N"`) are not translatable.
- Fix approach: Build elements using `document.createElement()` and set `aria-label` from a localized data attribute on the container.

**Slider Dot Navigation: Hardcoded Non-Translatable Aria Labels:**
- Symptoms: `dot.setAttribute('aria-label', \`Go to slide ${i + 1}\`)` and `dotsContainer.setAttribute('aria-label', 'Slide navigation')` are English-only.
- Files: `src/blocks/slider/view.js` (lines 237, 248)
- Impact: Non-English sites have non-translated accessible labels in a critical navigation element.
- Fix approach: Pass localized strings via a `data-dsgo-i18n` JSON attribute from PHP render, read in JS.

---

## Security Considerations

**`/designsetgo/v1/llms-txt/markdown/{post_id}` Is Publicly Accessible:**
- Risk: Any unauthenticated request can retrieve the Markdown-converted content of any published post. While only published public posts are exposed, this bypasses normal WordPress REST API content checks and could expose content before caches are populated.
- Files: `includes/llms-txt/class-rest-controller.php` (lines 112–130)
- Current mitigation: Checks `post_status = 'publish'`, `post_password_required()`, and `is_post_publicly_viewable()`. Excluded posts are respected.
- Recommendations: Add an optional `permission_callback` that checks `current_user_can('read')` for sites that treat published content as restricted. Document the intentional public exposure in endpoint registration.

**`phpcs:ignore` on Revision Comparison Nonce Checks:**
- Risk: `class-revision-comparison.php` suppresses nonce verification on multiple read operations using URL parameters.
- Files: `includes/admin/class-revision-comparison.php` (lines 68, 74, 79, 143, 204, 206, 255, 257)
- Current mitigation: Capability checks (`current_user_can('edit_post', $post->ID)`) are present on all write operations (line 269).
- Recommendations: Add nonce verification even for read-only URL parameters to prevent CSRF-based information disclosure in admin views.

**Google Maps API Key Exposed to Editor Context:**
- Risk: `googleMapsApiKey` is localized to the editor via `dsgoIntegrations` JavaScript object. Any editor-role user can read it from the page source.
- Files: `includes/class-plugin.php` (line 673)
- Current mitigation: This object is only localized on `enqueue_block_editor_assets`, meaning it is admin-only and not exposed on the frontend. However, editor-level users seeing the raw API key may be undesirable.
- Recommendations: Use server-side injection of the API key into the map block's render output rather than exposing it via localized script data. This is already done for the map frontend via `inject_map_api_key()` (line 613).

**IP Spoofing via Proxy Headers Without Default Trust List:**
- Risk: `get_client_ip()` reads `HTTP_X_FORWARDED_FOR`, `HTTP_CF_CONNECTING_IP`, and other headers only when the `designsetgo_trusted_proxies` filter returns a non-empty array. By default, the filter returns an empty array so proxy headers are ignored. However, sites behind load balancers or Cloudflare who forget to configure this filter may log incorrect IPs.
- Files: `includes/blocks/class-form-security.php` (lines 191–227)
- Current mitigation: Falls back to `REMOTE_ADDR` when no trusted proxies are configured.
- Recommendations: Add documentation/admin notice prompting Cloudflare-proxied sites to configure the `designsetgo_trusted_proxies` filter. Consider auto-detecting Cloudflare by checking `HTTP_CF_RAY`.

---

## Performance Bottlenecks

**`class-block-loader.php` Calls `file_get_contents` on Every Block Registration:**
- Problem: During block registration, the loader reads `block.json` files using `file_get_contents()` followed by `json_decode()` for blocks that need style data. No object cache layer is used.
- Files: `includes/blocks/class-loader.php` (lines 141, 236)
- Cause: `register_block_type_from_metadata()` handles the main registration, but custom style map processing requires a separate JSON read.
- Improvement path: Cache the decoded JSON in a static property or use `wp_cache_set()` with a reasonable expiry to avoid repeated disk reads on every request.

**Pattern Cache Is Not Invalidated on Plugin Update:**
- Problem: `class-loader.php` uses a transient (`CACHE_TRANSIENT`) for pattern data. Updating the plugin does not invalidate this cache, so new patterns may not appear until the transient expires.
- Files: `includes/patterns/class-loader.php` (lines 265, 363, 406, 410)
- Cause: No hook on `upgrader_process_complete` or `activate_{plugin}` to flush the pattern transient.
- Improvement path: Add a `flush_cache()` call in the plugin deactivation/activation hooks or on `upgrader_process_complete`.

**`has_designsetgo_blocks()` LIKE Query on Every Frontend Page:**
- Problem: Determining whether a page uses DesignSetGo blocks to conditionally enqueue assets uses `WP_Query` or direct `$wpdb` queries without proper object caching on uncached pages.
- Files: `includes/class-assets.php` (lines 185, 363, 411)
- Cause: Transient is per-post-ID (`dsgo_has_blocks_{$post_id}`), which is correct, but the transient is deleted on `save_post`, causing the next frontend load to re-query.
- Improvement path: Acceptable pattern, but ensure the transient lifetime is generous (currently undefined — defaults to no expiry). Verify the transient is being set with `set_transient` with a long TTL.

**Modal View.js Attaches Per-Instance Document Listeners Without Shared Management:**
- Problem: Each `DSGModal` instance attaches its own `keydown` listeners to `document`. On pages with many modals, multiple identical handlers exist simultaneously.
- Files: `src/blocks/modal/view.js` (lines 302–317)
- Cause: Listeners are added per-modal on open and removed on close. With many modals open simultaneously this multiplies event processing.
- Improvement path: Use a shared event manager at the `DSGModalManager` level instead of per-instance listeners. The `DSGModalManager` class already manages all modals globally.

---

## Fragile Areas

**Section Block: Highly Complex CSS Specificity System:**
- Files: `src/blocks/section/style.scss` (583 lines), `src/blocks/section/editor.scss` (641 lines)
- Why fragile: The section block uses descendant selectors intentionally (per inline NOTE comments) to handle nested sections, inline blocks, and layout types. Many rules are annotated with "Do NOT change" warnings. The z-index system (0/1/2/3/10 for layers) is documented in SCSS comments.
- Safe modification: Read all NOTE comments in both SCSS files before changing any selector. Test nested sections with overlay, parallax, and shape divider features enabled simultaneously.
- Test coverage: No automated tests for CSS output.

**Block Deprecation Chain for Multiple Blocks:**
- Files: `src/blocks/icon-button/deprecated.js`, `src/blocks/countdown-timer/deprecated.js`, `src/blocks/row/deprecated.js`, `src/blocks/modal-trigger/deprecated.js`, `src/blocks/form-phone-field/deprecated.js`
- Why fragile: Deprecation `isEligible` and `migrate` functions have complex conditional logic. A bug in a v2 migration silently corrupts all blocks from that era. The `icon-button` has 6 versions; adding a v7 requires carefully constructing v7's attributes from scratch.
- Safe modification: Always test deprecation by saving a post with an old block format, refreshing, and verifying the block loads without a block recovery notice. Use `wp-env` with a snapshot of old content.
- Test coverage: No unit tests for deprecation migrations.

**Form Builder: formId Is Derived from clientId at Block Mount:**
- Files: `src/blocks/form-builder/edit.js` (lines 114–118)
- Why fragile: `formId` is set to `clientId.substring(0, 8)` the first time the block is rendered if `formId` is empty. This is fine for new blocks, but duplicating a block creates a collision: the duplicate inherits the parent's `formId` until remounted. Submissions from the duplicate would be attributed to the original form.
- Safe modification: When duplicating form-builder blocks, always verify the new `formId` is unique in the post meta.
- Test coverage: No test for duplicate/copy scenario.

**LLMs.txt Feature Writes Physical Files to ABSPATH:**
- Files: `includes/llms-txt/class-rest-controller.php` (lines 221, 229, 261), `includes/llms-txt/class-controller.php` (lines 430, 483), `includes/llms-txt/class-file-manager.php` (line 251)
- Why fragile: Writing directly to `ABSPATH . 'llms.txt'` bypasses WordPress Filesystem API. On managed hosts with read-only webroot or non-standard configurations, this silently fails. Multiple code paths write the same files without atomic operations (risk of partial writes during concurrent cache flushes).
- Safe modification: Always check `file_put_contents` return value (already done in some locations). Add write-permission check before enabling the physical file feature.
- Test coverage: No integration tests for file write failure scenarios.

**SVG KSES Allowlist Uses Broad `safe_style_css` Filter:**
- Files: `includes/class-plugin.php` (lines 52–97, 625–627)
- Why fragile: The `safe_style_css`, `safecss_filter_attr_allow_css`, and `wp_kses_allowed_html` filters run globally, not scoped to DesignSetGo contexts. Third-party plugins that depend on WordPress's default behavior may be affected. The recursive regex for CSS functions (`SAFE_CSS_FUNCTIONS_PATTERN`) uses PCRE recursion which can fail on certain PHP builds with small backtrack limits.
- Safe modification: Consider applying the CSS allowlist only within `render_block` hooks where you control the output, or check if the context is a DesignSetGo block before expanding the allowlist.
- Test coverage: Manual testing required for multisite environments.

---

## Scaling Limits

**Form Submissions Stored as Custom Post Type:**
- Current capacity: Suitable for low-to-medium volume. Each submission is a `wp_posts` row with associated `wp_postmeta` rows.
- Limit: WordPress post storage degrades with millions of rows in `wp_posts`. High-traffic forms collecting thousands of submissions/day will cause slow wp-admin queries.
- Scaling path: Introduce a dedicated custom database table (`{$wpdb->prefix}dsgo_form_submissions`) with indexed columns for form_id, email, and submission_date. The `GDPR_Compliance` class already has an abstraction layer that would localize the change.

**Pattern Cache: Single Transient for All Patterns:**
- Current capacity: All pattern categories are cached in a single transient (`CACHE_TRANSIENT`). Performance is acceptable for < 100 patterns.
- Limit: The transient stores the full pattern array serialized. Very large pattern libraries (hundreds of patterns with SVGs embedded) will inflate the serialized size.
- Scaling path: The per-category transient prefix (`CACHE_TRANSIENT_PREFIX`) is already implemented; make it the primary cache key rather than the fallback.

---

## Dependencies at Risk

**Nominatim API (Map Block Geocoding):**
- Risk: Direct dependency on a third-party free API with strict rate limits (1 req/sec). Nominatim's usage policy prohibits bulk geocoding and does not guarantee availability.
- Impact: Address-to-coordinates lookup in the editor breaks if Nominatim is rate-limited or changes its API format.
- Migration plan: Add a fallback to Google Maps Geocoding API when `google_maps_api_key` is configured. The `dsgoIntegrations.googleMapsApiKey` is already available in the editor context.

**Leaflet.js Bundled via npm Dependency:**
- Risk: Leaflet (`^1.9.4`) is listed as a `dependency` in `package.json`. WordPress block plugins normally use WordPress script dependencies to share libraries. Leaflet is loaded independently.
- Impact: If a theme or another plugin also bundles Leaflet, two instances run simultaneously. The map block loads Leaflet dynamically from a CDN (`script-loader.js`) on the frontend, creating an external network dependency.
- Migration plan: Register Leaflet as a WordPress script handle with `wp_register_script` and declare it as a dependency in `block.json`. This allows sharing and respects the WordPress script loading system.

**`@wordpress/scripts` at `^30.0.0` with `@wordpress/block-editor` at `^14.0.0`:**
- Risk: These are broad semver ranges (`^`). A major WordPress package update could introduce breaking changes that are automatically picked up on next `npm install`.
- Impact: Build failures or behavioral regressions without any code changes.
- Migration plan: Lock to exact versions or tighter ranges (`~`) after verifying compatibility. Use `npm ci` in CI pipelines to pin to `package-lock.json`.

**WP Abilities API Bundled as Vendor Code:**
- Risk: The `wp_register_ability` function is loaded from `vendor/wordpress/abilities-api/` if not already defined. This is a bundled copy of an external library.
- Files: `includes/class-plugin.php` (lines 544–548)
- Impact: If the host WordPress core eventually ships its own `wp_register_ability()`, this bundled version may conflict.
- Migration plan: Add a version check and prefer core's version. Keep the bundled copy as the fallback only.

---

## Missing Critical Features

**No PHP Unit Tests for Form Handler, Security, or REST Endpoints:**
- Problem: The form submission pipeline (`class-form-handler.php`, `class-form-security.php`) has no PHPUnit test coverage. The GDPR compliance class and all REST endpoints are similarly untested.
- Blocks: Regressions in security (honeypot, rate limiting, Turnstile) are not detectable without manual testing.

**No Browser E2E Tests for Interactive Blocks:**
- Problem: Only one E2E test file exists (`tests/e2e/group-enhancements.spec.js`). No E2E tests cover modal, tabs, accordion, slider, form submission, or countdown timer.
- Blocks: Frontend regressions go undetected until reported by users.

---

## Test Coverage Gaps

**Form Submission and Security Pipeline:**
- What's not tested: Honeypot detection, rate limiting transient logic, Turnstile token verification, field validation by type, GDPR export/erase flows.
- Files: `includes/blocks/class-form-handler.php`, `includes/blocks/class-form-security.php`, `includes/admin/class-gdpr-compliance.php`
- Risk: Silent regressions in spam protection or data privacy handling.
- Priority: High

**Block Deprecation Migrations:**
- What's not tested: None of the 19 `deprecated.js` files have unit or integration tests for their `migrate()` functions.
- Files: All `src/blocks/*/deprecated.js`
- Risk: A migration error corrupts block content with no warning until users report broken pages.
- Priority: High

**REST API Endpoints:**
- What's not tested: All `register_rest_route` handlers. No request/response integration tests.
- Files: `includes/blocks/class-form-handler.php`, `includes/admin/class-draft-mode-rest.php`, `includes/admin/class-global-styles.php`, `includes/llms-txt/class-rest-controller.php`
- Risk: Authorization bypasses or malformed responses go undetected.
- Priority: High

**LLMs.txt File Write Operations:**
- What's not tested: File write success/failure, concurrent write scenarios, conflict detection.
- Files: `includes/llms-txt/class-controller.php`, `includes/llms-txt/class-file-manager.php`
- Risk: Data loss or partial file writes on managed hosting.
- Priority: Medium

**Slider, Modal, and Tabs Frontend Behavior:**
- What's not tested: Keyboard navigation, focus trapping, swipe gestures, hash-based deep linking.
- Files: `src/blocks/modal/view.js`, `src/blocks/slider/view.js`, `src/blocks/tabs/view.js`
- Risk: Accessibility regressions shipped undetected.
- Priority: Medium

---

*Concerns audit: 2026-02-26*
