# KSES CSS Allowlist Guide

## Overview

WordPress sanitizes inline `style` attributes through `wp_kses_post()` using a strict allowlist. This affects any context where the current user doesn't have `unfiltered_html` capability:

- **Multisite** (editors don't have `unfiltered_html`)
- **REST API** content creation (e.g., MCP, programmatic tools)
- **Any code** that calls `wp_kses_post()` on block content

DesignSetGo blocks use modern CSS properties (flex, grid, transform, etc.) in their `save()` output. Without explicit allowlisting, these properties are silently stripped, breaking block layouts.

## How WordPress KSES Handles Inline Styles

WordPress validates inline styles in two stages:

### Stage 1: Property Name Check (`safe_style_css` filter)

WordPress maintains a list of allowed CSS property names. Properties not in the list are stripped entirely. The default list includes common properties like `color`, `background-*`, `margin-*`, `padding-*`, `width`, `height`, `border-*`, `font-*`, `opacity`, etc.

**Not included by default:** `display`, `gap`, `flex-*`, `grid-*`, `align-items`, `justify-content`, `transform`, `transition`, `aspect-ratio`, `object-fit`, `position`, `overflow`, `backdrop-filter`, `box-sizing`.

We register these via the `safe_style_css` filter in `Plugin::allow_block_style_properties()`.

### Stage 2: Value Check (`safecss_filter_attr_allow_css` filter)

After a property name passes, WordPress checks the **value** for potentially dangerous patterns. Specifically, it strips any value containing parentheses `(` unless the function is in its internal allowlist:

**WordPress allows:** `var()`, `calc()`, `min()`, `max()`, `minmax()`, `clamp()`, `repeat()`

**WordPress strips:** `rotate()`, `scale()`, `blur()`, `translate()`, and all other CSS functions

This means `transform: rotate(45deg)` passes the property name check but fails the value check - the `rotate()` function contains parentheses that WordPress considers unsafe.

We handle this via the `safecss_filter_attr_allow_css` filter in `Plugin::allow_block_css_functions()`, which uses the same strip-and-check technique WordPress uses internally.

## Implementation

All KSES allowlisting lives in `includes/class-plugin.php`:

| Constant/Method | Purpose |
|----------------|---------|
| `SAFE_STYLE_PROPERTIES` | CSS property names to allow (22 properties) |
| `SAFE_CSS_FUNCTIONS_PATTERN` | Regex matching safe CSS function values |
| `allow_block_style_properties()` | Filter callback for `safe_style_css` |
| `allow_block_css_functions()` | Filter callback for `safecss_filter_attr_allow_css` |

Both filters are registered in `Plugin::init()`.

## Adding New CSS Properties

When a new block uses an inline CSS property not already allowlisted:

1. Check if the property is in [WordPress's default list](https://developer.wordpress.org/reference/hooks/safe_style_css/) - if so, no action needed
2. If not, add it to the `SAFE_STYLE_PROPERTIES` constant in `includes/class-plugin.php`
3. If the property's value uses CSS functions (parentheses), check if the function is in `SAFE_CSS_FUNCTIONS_PATTERN` and add it if missing
4. Add a test assertion in `tests/phpunit/plugin-test.php` (in the appropriate `test_kses_preserves_*` method)
5. Run `npx wp-env run tests-cli --env-cwd=wp-content/plugins/designsetgo vendor/bin/phpunit --filter test_kses` to verify

## Debugging Stripped Styles

If a block's inline styles are being stripped:

```bash
# Quick check - does a CSS declaration survive wp_kses_post()?
npx wp-env run cli wp eval '
  $html = "<div style=\"your-property:value\">test</div>";
  echo wp_kses_post($html);
'
```

If the style attribute is missing or the property is gone:
- **Property gone, others remain** → Property name not in `SAFE_STYLE_PROPERTIES`
- **Entire style attribute gone** → The only property had a blocked value (likely a CSS function)
- **Property there but value changed** → Value-level filtering (check for parentheses in the value)

## Security Notes

- The `safe_style_css` filter only **adds** to the allowlist; it cannot reduce what WordPress allows
- CSS functions in the allowlist (`rotate`, `scale`, `blur`, etc.) are purely visual and cannot execute scripts
- The value check still runs after stripping known-safe functions - if anything suspicious remains (backslash, unmatched parentheses, comments), the value is rejected
- Dangerous patterns like `expression()`, `-moz-binding`, and `url(javascript:)` are never allowed

## Tests

PHPUnit tests in `tests/phpunit/plugin-test.php` cover:
- Filter registration verification
- All 22 property names (grouped by category: layout, flex, positioning, visual)
- CSS function values (`rotate()`, `blur()`)
- Display variants (`flex`, `grid`, `inline-flex`, `none`)
- Realistic block HTML (Row and Grid blocks with combined properties)

Run with:
```bash
npx wp-env run tests-cli --env-cwd=wp-content/plugins/designsetgo vendor/bin/phpunit --filter test_kses
```
