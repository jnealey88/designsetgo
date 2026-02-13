# KSES Allowlist Guide

## Overview

WordPress sanitizes HTML through `wp_kses_post()` using strict allowlists. This affects any context where the current user doesn't have `unfiltered_html` capability:

- **Multisite** (editors don't have `unfiltered_html`)
- **REST API** content creation (e.g., MCP, programmatic tools)
- **Any code** that calls `wp_kses_post()` on block content

DesignSetGo blocks use modern CSS properties (flex, grid, transform, etc.) and inline SVG elements in their `save()` output. Without explicit allowlisting, these are silently stripped, breaking block layouts and removing icons/decorations.

## How WordPress KSES Works

WordPress KSES validates content at three independent levels:

### HTML Element Allowlist (`wp_kses_allowed_html` filter)

WordPress maintains a list of allowed HTML elements and their attributes per context. The `post` context allows common HTML but **does not include SVG elements** (`<svg>`, `<path>`, `<circle>`, etc.). Any SVG in block save() output is completely stripped.

We register SVG elements and their attributes via the `wp_kses_allowed_html` filter in `Plugin::allow_block_svg_elements()`.

### Inline Style Validation

WordPress validates inline styles in two stages:

### Stage 1: Property Name Check (`safe_style_css` filter)

WordPress maintains a list of allowed CSS property names. Properties not in the list are stripped entirely. The default list includes common properties like `color`, `background-*`, `margin-*`, `padding-*`, `width`, `height`, `border-*`, `font-*`, `opacity`, etc.

**Not included by default:** `display`, `gap`, `flex-*`, `grid-*`, `align-items`, `justify-content`, `transform`, `transition`, `aspect-ratio`, `object-fit`, `position`, `overflow`, `backdrop-filter`, `box-sizing`.

We register these via the `safe_style_css` filter in `Plugin::allow_block_style_properties()`.

### Stage 2: Value Check (`safecss_filter_attr_allow_css` filter)

After a property name passes, WordPress checks the **value** for potentially dangerous patterns. Specifically, it strips any value containing parentheses `(` unless the function is in its internal allowlist:

**WordPress allows:** `var()`, `calc()`, `min()`, `max()`, `minmax()`, `clamp()`, `repeat()`

**WordPress strips:** `rotate()`, `scale()`, `blur()`, `translate()`, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `linear-gradient()`, and all other CSS functions

This means `transform: rotate(45deg)` and `background-color: rgba(99,102,241,0.1)` pass the property name check but fail the value check - the functions contain parentheses that WordPress considers unsafe.

We handle this via the `safecss_filter_attr_allow_css` filter in `Plugin::allow_block_css_functions()`, which uses the same strip-and-check technique WordPress uses internally.

## Implementation

All KSES allowlisting lives in `includes/class-plugin.php`:

| Constant/Method | Purpose |
|----------------|---------|
| `SAFE_STYLE_PROPERTIES` | CSS property names to allow (22 properties) |
| `SAFE_CSS_FUNCTIONS_PATTERN` | Regex matching safe CSS function values (color, gradient, transform, filter) |
| `SVG_ELEMENTS` | SVG element names to allow (16 elements) |
| `SVG_ATTRIBUTES` | SVG attribute names to allow (35+ attributes) |
| `allow_block_style_properties()` | Filter callback for `safe_style_css` |
| `allow_block_css_functions()` | Filter callback for `safecss_filter_attr_allow_css` |
| `allow_block_svg_elements()` | Filter callback for `wp_kses_allowed_html` |

All three filters are registered in `Plugin::init()`.

## Adding New CSS Properties

When a new block uses an inline CSS property not already allowlisted:

1. Check if the property is in [WordPress's default list](https://developer.wordpress.org/reference/hooks/safe_style_css/) - if so, no action needed
2. If not, add it to the `SAFE_STYLE_PROPERTIES` constant in `includes/class-plugin.php`
3. If the property's value uses CSS functions (parentheses), check if the function is in `SAFE_CSS_FUNCTIONS_PATTERN` and add it if missing
4. Add a test assertion in `tests/phpunit/plugin-test.php` (in the appropriate `test_kses_preserves_*` method)
5. Run `npx wp-env run tests-cli --env-cwd=wp-content/plugins/designsetgo vendor/bin/phpunit --filter test_kses` to verify

## Adding New SVG Elements

When a new block uses inline SVG elements in its save() output:

1. Check if the element is already in the `SVG_ELEMENTS` constant
2. If not, add the **lowercase** tag name (KSES normalizes to lowercase)
3. Check that all attributes used are in `SVG_ATTRIBUTES`; add any missing ones
4. Add a test in `tests/phpunit/plugin-test.php` with realistic SVG HTML
5. Run `npx wp-env run tests-cli --env-cwd=wp-content/plugins/designsetgo vendor/bin/phpunit --filter test_kses_preserves_svg` to verify

## Debugging Stripped Content

### Inline styles being stripped

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

### SVG elements being stripped

```bash
# Quick check - does an SVG element survive wp_kses_post()?
npx wp-env run cli wp eval '
  $html = "<svg viewBox=\"0 0 24 24\"><path d=\"M0,0\"></path></svg>";
  echo wp_kses_post($html);
'
```

If the SVG is missing:
- **Entire SVG gone** → Element not in `SVG_ELEMENTS`
- **SVG present but attributes missing** → Attribute not in `SVG_ATTRIBUTES`
- **SVG present but child elements gone** → Child element not in `SVG_ELEMENTS`

## Security Notes

- The `safe_style_css` filter only **adds** to the allowlist; it cannot reduce what WordPress allows
- CSS functions in the allowlist (`rotate`, `scale`, `blur`, `rgba`, `linear-gradient`, etc.) are purely visual and cannot execute scripts
- The value check still runs after stripping known-safe functions - if anything suspicious remains (backslash, unmatched parentheses, comments), the value is rejected
- Dangerous patterns like `expression()`, `-moz-binding`, and `url(javascript:)` are never allowed
- SVG elements are limited to presentation elements only; no `<script>`, `<foreignObject>`, or event handler attributes are allowed

## Tests

PHPUnit tests in `tests/phpunit/plugin-test.php` cover:

- Filter registration verification (3 filters)
- All 22 CSS property names (grouped by category: layout, flex, positioning, visual)
- CSS function values: transforms (`rotate()`, `blur()`), colors (`rgba()`, `rgb()`, `hsl()`, `hsla()`), gradients (`linear-gradient()`, `radial-gradient()`)
- Display variants (`flex`, `grid`, `inline-flex`, `none`)
- SVG elements (`<svg>`, `<path>`, `<circle>`, `<rect>`, `<line>`, `<polyline>`)
- SVG icons (accordion chevron with `fill="currentColor"`)
- Realistic block HTML (Row, Grid, and Icon blocks with combined properties)

Run with:

```bash
npx wp-env run tests-cli --env-cwd=wp-content/plugins/designsetgo vendor/bin/phpunit --filter test_kses
```
