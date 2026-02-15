# Deactivation Block Migrator - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a deactivation modal that intercepts the "Deactivate" link on the Plugins page, scans for DSG blocks, and offers to convert them to WordPress core equivalents before deactivating.

**Architecture:** PHP class (`Block_Migrator`) handles AJAX scan/convert endpoints using `parse_blocks()`/`serialize_blocks()`. Inline JS (following `class-draft-mode-admin.php` pattern) intercepts the deactivate link on `plugins.php` and renders a plain HTML/CSS modal. No React/webpack entry point needed.

**Tech Stack:** PHP 8.0+, WordPress AJAX (`wp_ajax_*`), `parse_blocks()`/`serialize_blocks()`, vanilla JS, CSS via `wp_add_inline_style()`

---

## Block Mapping Reference

| DSG Block | Core Equivalent | Layout Type |
|-----------|----------------|-------------|
| `designsetgo/section` | `core/group` | `constrained` (or `default` if `constrainWidth=false`) |
| `designsetgo/row` | `core/group` | `flex` |
| `designsetgo/grid` | `core/group` | `grid` |
| `designsetgo/icon-button` | `core/buttons` > `core/button` | — |

### Core/group saved HTML structure

```html
<!-- wp:group {"backgroundColor":"contrast","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-contrast-background-color has-background">
  <!-- inner blocks -->
</div>
<!-- /wp:group -->
```

### Core/buttons + core/button saved HTML structure

```html
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
  <!-- wp:button {"backgroundColor":"contrast","textColor":"base"} -->
  <div class="wp-block-button">
    <a class="wp-block-button__link has-contrast-background-color has-base-color has-text-color has-background wp-element-button" href="#">Button Text</a>
  </div>
  <!-- /wp:button -->
</div>
<!-- /wp:buttons -->
```

---

### Task 1: Create Block_Migrator PHP class with scan endpoint

**Files:**
- Create: `includes/admin/class-block-migrator.php`

**Step 1: Create the PHP class with scan AJAX handler**

Create `includes/admin/class-block-migrator.php` with:
- Namespace `DesignSetGo\Admin`
- Constants: `CONVERTIBLE_BLOCKS` (section, row, grid, icon-button), `POST_TYPES` (post, page, wp_template, wp_template_part)
- Constructor: registers AJAX hooks (`wp_ajax_designsetgo_scan_blocks`, `wp_ajax_designsetgo_convert_blocks`) and `admin_enqueue_scripts`
- `ajax_scan_blocks()`: nonce check, capability check, calls `scan_for_dsgo_blocks()`, returns JSON `{posts, blocks}`
- `scan_for_dsgo_blocks()`: queries `$wpdb` with LIKE clauses for each block name, parses each post's content with `parse_blocks()`, counts DSG blocks recursively
- `count_dsgo_blocks()`: recursive counter that checks `blockName` against `CONVERTIBLE_BLOCKS`

Security: `check_ajax_referer('designsetgo_block_migrator', 'nonce')` + `current_user_can('activate_plugins')`

**Step 2: Verify syntax**

Run: `php -l includes/admin/class-block-migrator.php`
Expected: `No syntax errors detected`

**Step 3: Commit**

```bash
git add includes/admin/class-block-migrator.php
git commit -m "feat: Add Block_Migrator class with scan AJAX endpoint"
```

---

### Task 2: Add block conversion logic

**Files:**
- Modify: `includes/admin/class-block-migrator.php`

**Step 1: Add convert AJAX handler and recursive walker**

Add `ajax_convert_blocks()`:
- Nonce + capability check
- Calls `scan_for_dsgo_blocks()` to get post IDs
- For each post: `parse_blocks()` → `convert_blocks_recursive()` → `serialize_blocks()` → `wp_update_post()`
- Returns `{converted, failed}`

Add `convert_blocks_recursive()`:
- Recurse into `innerBlocks` first (depth-first)
- Switch on `blockName` to call specific converter

**Step 2: Add converter methods**

`convert_section($block)`:
- Layout: `constrained` if `constrainWidth` (default true), `default` otherwise
- If `contentWidth` set, add `contentSize` to layout
- Call `build_group_attrs()` + `build_group_block()`

`convert_row($block)`:
- Layout: `flex` with `flexWrap`, `justifyContent`, `verticalAlignment` from DSG layout attrs
- Call `build_group_attrs()` + `build_group_block()`

`convert_grid($block)`:
- Layout: `grid` with `columnCount` from `desktopColumns` (default 3)
- Call `build_group_attrs()` + `build_group_block()`

`convert_icon_button($block)`:
- Build `core/button` attrs: content (from text), url, linkTarget, rel, backgroundColor, textColor, fontSize, style
- Build `core/button` HTML: `<div class="wp-block-button"><a class="wp-block-button__link ...">text</a></div>`
- Build `core/buttons` wrapper with layout `{type: flex, justifyContent}` from align
- innerContent: `['<div class="wp-block-buttons">', null, '</div>']`

**Step 3: Add shared helper methods**

`build_group_attrs($attrs, $layout)`:
- Preserves: align, tagName, style, backgroundColor, textColor, fontSize, anchor
- Drops everything else (DSG-specific hover, overlay, shape dividers, etc.)

`build_group_block($attrs, $inner_blocks)`:
- Builds CSS classes: `wp-block-group`, color classes (`has-{slug}-background-color`, etc.)
- Builds inline style string from `style` object (padding, margin, border-radius, custom colors)
- Constructs `innerHTML` and `innerContent` with proper open/close tags
- Uses `tagName` from attrs (default `div`)

`convert_preset_to_css_var($value)`:
- Converts `var:preset|spacing|50` → `var(--wp--preset--spacing--50)`

**Step 4: Verify syntax**

Run: `php -l includes/admin/class-block-migrator.php`
Expected: `No syntax errors detected`

**Step 5: Commit**

```bash
git add includes/admin/class-block-migrator.php
git commit -m "feat: Add block conversion logic for section, row, grid, icon-button"
```

---

### Task 3: Add deactivation modal JS/CSS (inline)

**Files:**
- Modify: `includes/admin/class-block-migrator.php`

**Step 1: Add enqueue method**

`enqueue_deactivation_scripts($hook_suffix)`:
- Guard: `if ('plugins.php' !== $hook_suffix) return;`
- `wp_add_inline_style('wp-admin', $this->get_modal_styles())`
- Register empty script handle, `wp_localize_script()` with `ajaxUrl`, `nonce`, `pluginBasename`
- `wp_add_inline_script()` with modal JS

**Step 2: Add `get_modal_styles()`**

CSS for:
- `.dsgo-deactivation-overlay` — fixed fullscreen overlay with centered flex
- `.dsgo-deactivation-modal` — white card with border-radius, padding, shadow
- `.dsgo-warning` — yellow left-border warning box
- `.dsgo-modal-actions` — flex row for buttons
- `.dsgo-spinner` — loading state with WP spinner
- `.dsgo-result.success` / `.dsgo-result.error` — result message colors

**Step 3: Add `get_modal_script()`**

All translatable strings extracted via `esc_js(__())` at top.

Modal JS flow (IIFE, 'use strict'):
1. Find deactivate link via `tr[data-plugin="BASENAME"] .deactivate a`
2. Save original `href` (deactivation URL)
3. On click → `e.preventDefault()` → create overlay + modal DOM via safe DOM methods (createElement/textContent — NOT innerHTML with user data)
4. Fire AJAX scan → on success:
   - If 0 blocks → `window.location.href = deactivateUrl`
   - Otherwise → show summary with button row
5. "Convert & Deactivate" → AJAX convert → show result → redirect to deactivateUrl after 1.5s
6. "Just Deactivate" → `<a>` tag with deactivateUrl (regular link)
7. "Cancel" → remove overlay
8. Close on overlay click (not modal body)
9. Close on Escape key
10. Focus management: focus "Convert" button when summary shown

IMPORTANT: Use safe DOM construction methods (createElement, textContent, appendChild) for all dynamic content. Static HTML structure (no user data) can use template strings for the initial skeleton. All translatable strings are pre-escaped via `esc_js()`.

**Step 4: Verify syntax**

Run: `php -l includes/admin/class-block-migrator.php`
Expected: `No syntax errors detected`

**Step 5: Commit**

```bash
git add includes/admin/class-block-migrator.php
git commit -m "feat: Add deactivation modal with inline JS/CSS"
```

---

### Task 4: Register Block_Migrator in the plugin

**Files:**
- Modify: `includes/class-plugin.php`

**Step 1: Add require statement**

Add after the other admin class requires (around line 394, after `class-revision-comparison.php`):

```php
require_once DESIGNSETGO_PATH . 'includes/admin/class-block-migrator.php';
```

**Step 2: Add instantiation inside `is_admin()` block**

Add after `$this->admin_menu` (around line 471):

```php
$this->block_migrator = new Admin\Block_Migrator();
```

**Step 3: Verify syntax**

Run: `php -l includes/class-plugin.php`
Expected: `No syntax errors detected`

**Step 4: Commit**

```bash
git add includes/class-plugin.php
git commit -m "feat: Register Block_Migrator in plugin initialization"
```

---

### Task 5: Build, lint, and verify

**Step 1: PHP lint**

Run: `php -l includes/admin/class-block-migrator.php && php -l includes/class-plugin.php`
Expected: Both pass

**Step 2: PHP linter**

Run: `npm run lint:php`
Expected: No new errors (fix any that appear)

**Step 3: Build**

Run: `npm run build`
Expected: Build succeeds (no new webpack entry — all inline)

**Step 4: Commit any lint fixes**

```bash
git add includes/admin/class-block-migrator.php includes/class-plugin.php
git commit -m "fix: Address lint issues in block migrator"
```

---

### Task 6: Manual testing in wp-env

**Test checklist:**

1. Start wp-env: `npx wp-env start`
2. Create a test post with DSG section, row, grid, and icon-button blocks
3. Go to Plugins page → click "Deactivate" on DesignSetGo
4. Verify modal appears with scanning spinner
5. Verify summary shows correct block/post count
6. Click "Cancel" → verify modal closes, plugin still active
7. Click "Deactivate" again → "Just Deactivate" → verify normal deactivation, blocks show as unsupported
8. Reactivate plugin → click "Deactivate" → "Convert & Deactivate"
9. Verify success message appears, then plugin deactivates
10. Open the test post → verify blocks are now core/group and core/buttons
11. Verify content looks reasonable (layout, colors, spacing preserved)
12. Check post revision history → verify revision was created before conversion
