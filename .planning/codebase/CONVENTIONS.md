# Coding Conventions

**Analysis Date:** 2026-02-26

## Naming Patterns

**Files:**
- Block files: `block.json`, `edit.js`, `save.js`, `index.js`, `view.js`, `style.scss`, `editor.scss`
- PHP class files: `class-plugin.php`, `class-assets.php`, `class-custom-css-renderer.php` (lowercase, hyphenated)
- PHP test files: `helpers-test.php`, `plugin-test.php` (suffix `-test.php`)
- JS test files: `utils.test.js`, `css-generator.test.js` (suffix `.test.js`)
- Utility files: `css-generator.js`, `convert-preset-to-css-var.js`, `should-extend-block.js` (kebab-case)
- Extension directories: `block-animations/`, `custom-css/`, `draft-mode/` (kebab-case)
- Block directories: `accordion/`, `card/`, `flip-card/` (kebab-case matching block name)

**Functions (JS):**
- Named exports: `camelCase` — `generateResponsiveCSS`, `sanitizeCSSUnit`, `convertPresetToCSSVar`
- Default exports (React components): `PascalCase` — `AccordionEdit`, `AccordionSave`, `CardEdit`
- Filter callback functions: `camelCase` — `addAnimationAttributes`, `addCustomCSSAttribute`

**Functions (PHP):**
- Global helpers: `designsetgo_` prefix + snake_case — `designsetgo_get_block_class()`, `designsetgo_sanitize_css_value()`
- Class methods: `snake_case` — `test_get_block_class()`, `test_singleton_instance()`
- Test methods: `test_` prefix — `test_plugin_loaded()`, `test_sanitize_css_size_valid()`

**Variables:**
- JS: `camelCase` — `blockProps`, `innerBlocksProps`, `accordionClasses`, `customStyles`
- PHP: `snake_case` — `$block_name`, `$unique_id`, `$wp_tests_dir`

**CSS Classes:**
- Block wrapper: `dsgo-{block-name}` — `dsgo-accordion`, `dsgo-modal`
- BEM modifiers: `dsgo-{block-name}--{modifier}` — `dsgo-accordion--multiple`, `dsgo-accordion--icon-left`
- BEM elements: `dsgo-{block-name}__{element}` — `dsgo-accordion__items`, `dsgo-modal__backdrop`
- Extension classes: `dsgo-hide-mobile`, `dsgo-clickable`, `dsgo-has-responsive-visibility`

**Attributes (JS/block.json):**
- Plugin attributes: `dsgo` prefix + camelCase — `dsgoAnimationEnabled`, `dsgoCustomCSS`, `dsgoEntranceAnimation`
- Block-specific attributes: plain camelCase — `allowMultipleOpen`, `iconStyle`, `itemGap`

**CSS Custom Properties:**
- Convention: `--dsgo-{block-name}-{property}` — `--dsgo-accordion-open-bg`, `--dsgo-accordion-gap`

**Data Attributes (HTML):**
- Convention: `data-dsgo-{feature}` — `data-dsgo-modal`, `data-dsgo-initialized`
- Selector attributes: `data-{feature}` — `data-allow-multiple`, `data-icon-style`, `data-link-url`

**Filter Namespaces (WordPress Hooks):**
- Convention: `designsetgo/{extension-name}/{action}` — `designsetgo/block-animations/add-attributes`, `designsetgo/add-custom-css-attribute`

## Code Style

**Formatting:**
- Indentation: Tabs for JS, SCSS, and PHP
- JSON/YAML: 2 spaces
- Tool: `wp-scripts format` (Prettier under the hood)

**Linting:**
- JS: `wp-scripts lint-js` (ESLint with WordPress ruleset)
- CSS/SCSS: `wp-scripts lint-style`
- PHP: PHPCS with WordPress-Core, WordPress-Docs, WordPress-Extra rulesets (`phpcs.xml`)
- PHP minimum version: 7.4+, minimum WP version: 6.0
- ESLint exception pattern for experimental WordPress APIs: `// eslint-disable-next-line @wordpress/no-unsafe-wp-apis`

**Pre-commit:**
- Husky hook runs `lint-staged` on staged files (non-blocking — warns but does not abort commits)
- lint-staged auto-fixes JS (`--fix`), auto-fixes SCSS (`--fix`), syntax-checks PHP (`php -l`)

## Import Organization

**Order in JS files:**
1. `@wordpress/*` packages — `@wordpress/i18n`, `@wordpress/block-editor`, `@wordpress/components`
2. Third-party packages — `classnames`
3. Local plugin utilities — `../../utils/convert-preset-to-css-var`
4. Local block components — `./components/inspector`
5. Style imports — `./editor.scss`, `./style.scss`

**Example from `src/blocks/accordion/edit.js`:**
```javascript
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls, ... } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, ... } from '@wordpress/components';
import classnames from 'classnames';
import { encodeColorValue, decodeColorValue } from '../../utils/encode-color-value';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';
```

**Path Aliases:**
- None configured — use relative paths (`../../utils/`, `./components/`)

## Block Component Patterns

**Edit functions — named export with destructured props:**
```javascript
export default function AccordionEdit({ attributes, setAttributes, clientId }) {
    const { allowMultipleOpen, iconStyle, ... } = attributes;
    const blockProps = useBlockProps({ className, style });
    const innerBlocksProps = useInnerBlocksProps({ className }, { allowedBlocks });
    return <div {...blockProps}><div {...innerBlocksProps} /></div>;
}
```

**Save functions — named export, use `.save()` variants:**
```javascript
export default function AccordionSave({ attributes }) {
    const blockProps = useBlockProps.save({ className, style, 'data-*': value });
    const innerBlocksProps = useInnerBlocksProps.save({ className });
    return <div {...blockProps}><div {...innerBlocksProps} /></div>;
}
```

**Index registration — always spread metadata:**
```javascript
import metadata from './block.json';
registerBlockType(metadata.name, {
    ...metadata,
    icon: { src: <svg .../>, foreground: ICON_COLOR },
    edit: Edit,
    save: Save,
});
```

**Class generation — always use `classnames` library:**
```javascript
const accordionClasses = classnames('dsgo-accordion', {
    'dsgo-accordion--multiple': allowMultipleOpen,
    'dsgo-accordion--icon-left': iconPosition === 'left',
});
```

**CSS Custom Properties — pass as inline style object:**
```javascript
const customStyles = {
    '--dsgo-accordion-open-bg': convertPresetToCSSVar(openBackgroundColor),
    '--dsgo-accordion-gap': itemGap,
    ...(borderBetweenColor && {
        '--dsgo-accordion-border-color': convertPresetToCSSVar(borderBetweenColor),
    }),
};
```

## Extension System Pattern

Extensions use `addFilter` from `@wordpress/hooks` with the `designsetgo/` namespace:
```javascript
import { addFilter } from '@wordpress/hooks';
addFilter(
    'blocks.registerBlockType',
    'designsetgo/block-animations/add-attributes',
    addAnimationAttributes
);
```

All extensions check `shouldExtendBlock(name)` from `src/utils/should-extend-block.js` before applying attributes, supporting per-block user exclusion lists.

## Error Handling

**Patterns:**
- Defensive checks for falsy values before processing: `if (!value) return undefined;`
- Optional chaining for global settings: `window.dsgoSettings?.excludedBlocks || []`
- Try/catch only for unavoidable failures (e.g., E2E test cleanup: `try { await closeButton.click() } catch { }`)
- PHP: `if ( empty( $value ) && '0' !== $value ) { return null; }` before sanitization

## Logging

**Framework:** No structured logger — uses WordPress `error_log()` (gated behind WP_DEBUG checks per PHPCS allowlist)

**JS:** `console.log` is forbidden per `CLAUDE.md`. All instances must be removed before commit. `console.error` is allowed for error callbacks.

## Comments

**When to Comment:**
- File-level: `/** @package */` or `/** @package DesignSetGo @since 1.0.0 */`
- Function-level: JSDoc/TSDoc for all exported functions and PHP methods
- Inline: Explain non-obvious logic, match comments between `edit.js` and `save.js` (e.g., `// Same classes as edit.js - MUST MATCH EXACTLY`)

**JSDoc pattern (JS):**
```javascript
/**
 * Generate responsive CSS for a property.
 *
 * @param {string} selector CSS selector.
 * @param {string} property CSS property.
 * @param {Object} values   Responsive values {desktop, tablet, mobile}.
 * @return {string} Generated CSS.
 */
```

**PHPDoc pattern (PHP):**
```php
/**
 * Get block CSS class name.
 *
 * @param string $block_name Block name without namespace.
 * @param string $unique_id  Unique block ID.
 * @return string CSS class name.
 */
```

## Function Design

**Size:** Max 300 lines per file (excluding data/constants per `CLAUDE.md`)

**Parameters:** Destructure object params in React components: `({ attributes, setAttributes, clientId })`

**Return Values:**
- Return `undefined` (not `null`) for missing/invalid JS values
- Return `null` in PHP for invalid/missing values
- Return empty string `''` for missing CSS output

## Module Design

**Exports:**
- Utilities: named exports — `export function generateResponsiveCSS(...)`, `export function clearExclusionCache()`
- Block components: default export — `export default function AccordionEdit(...)`
- Constants: named exports from constants files — `export const ICON_COLOR`

**Barrel Files:**
- `src/utils/index.js` exists as an aggregation point
- Block-level `index.js` is the registration entry point, not a barrel

## PHP Class Design

**Namespacing:** `namespace DesignSetGo;` on all plugin classes

**Singleton pattern** on main Plugin class: `Plugin::instance()` returns shared instance

**Visibility:** Properties private/public with explicit access control; constants use `private const`

**Direct access guard:** Every PHP file starts with:
```php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
```

**i18n:** All user-visible strings wrapped in `__( 'text', 'designsetgo' )` or `esc_html__()`, `esc_attr__()`

**Output escaping:** All output uses `esc_html()`, `esc_attr()`, `esc_url()`, or `wp_kses_post()`

---

*Convention analysis: 2026-02-26*
