# DesignSetGo Plugin - Quick Reference

**Core Principle**: Use WordPress defaults first. Ask "Does WordPress already provide this?" before building custom solutions.

## Critical Patterns

### WordPress Hooks & APIs (ALWAYS USE)
```javascript
// Block Props
useBlockProps()                    // Main wrapper
useInnerBlocksProps()              // NOT plain <InnerBlocks />
useBlockProps.save()               // Save function
useInnerBlocksProps.save()         // Inner blocks save

// Settings (WP 6.5+)
const [contentSize] = useSettings('layout.contentSize');
const [palette] = useSettings('color.palette');
```

### Color Controls (MANDATORY Pattern)
```javascript
// Import
import {
    InspectorControls,
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

// Add clientId to signature (REQUIRED)
export default function Edit({ attributes, setAttributes, clientId }) {
    const colorGradientSettings = useMultipleOriginColorsAndGradients();

    return (
        <InspectorControls group="color">
            <ColorGradientSettingsDropdown
                panelId={clientId}
                title={__('Colors', 'designsetgo')}
                settings={[{
                    label: __('Text Color', 'designsetgo'),
                    colorValue: textColor,
                    onColorChange: (color) => setAttributes({ textColor: color || '' }),
                    clearable: true,
                }]}
                {...colorGradientSettings}
            />
        </InspectorControls>
    );
}
```

**Why**: `PanelColorSettings` is deprecated. Use `ColorGradientSettingsDropdown` in Styles tab (`group="color"`).

### Block Supports Over Custom Controls
```json
{
  "supports": {
    "color": { "text": true, "background": true },
    "typography": { "fontSize": true, "textAlign": true },
    "spacing": { "padding": true, "margin": true },
    "__experimentalBorder": { "radius": true },
    "dimensions": { "minHeight": true }
  }
}
```
📖 See [BLOCK-SUPPORTS-AUDIT.md](../docs/BLOCK-SUPPORTS-AUDIT.md), [BLOCK-CONTROLS-ORGANIZATION.md](../docs/BLOCK-CONTROLS-ORGANIZATION.md)

### Future-Proof Components
```javascript
// Add to ALL form components
<RangeControl
  __next40pxDefaultSize
  __nextHasNoMarginBottom
  // ... other props
/>
```
**Affected**: `SelectControl`, `RangeControl`, `UnitControl`, `ToggleGroupControl`, `TextControl`

## Architecture

### Naming Conventions

**Prefix Standard**: Use `dsgo-` for ALL plugin identifiers (CSS classes, data attributes, JavaScript variables).

**Format Guidelines**:
- **CSS/HTML**: kebab-case → `.dsgo-block-name`, `data-dsgo-attribute`
- **JavaScript**: camelCase → `dsgoAttributeName`, `dsgoStickyEnabled`
- **PHP**: snake_case → `designsetgo_function_name`, `DesignSetGo\` namespace
- **Filter hooks**: `designsetgo/hook-name`

**Examples**:
```javascript
// ✅ CORRECT - dsgo prefix
attributes: {
  dsgoStickyEnabled: { type: 'boolean', default: false },
  dsgoAnimationDuration: { type: 'number', default: 600 }
}

// CSS classes
.dsgo-sticky-header
.dsgo-animation-fadeIn
data-dsgo-animation-enabled="true"

// ❌ INCORRECT - dsg prefix (deprecated)
attributes: {
  dsgStickyEnabled: { type: 'boolean' }  // Wrong prefix
}
```

**Note**: The `dsgo-` prefix was used in early development but has been standardized to `dsgo-` for consistency with the plugin name.

### Block Categories
- **Use**: WordPress core categories in `block.json` (`"category": "design"`)
- **Plus**: Custom collection via `registerBlockCollection('designsetgo', {...})`
- **Mapping**: Design (containers/UI), Text (content), Widgets (dynamic)

### Extensions vs Custom Blocks
- **Extensions**: Simple enhancements via `addFilter()` - MUST check block name
- **Custom Blocks**: Unique functionality

```javascript
// ✅ SAFE Extension Pattern
addFilter('blocks.registerBlockType', 'designsetgo/filter', (settings, name) => {
  const allowed = ['core/group', 'core/cover'];
  if (!allowed.includes(name)) return settings;
  // Modify settings
  return settings;
});
```

### Asset Loading
```php
// ✅ CORRECT
add_action('enqueue_block_assets', array($this, 'enqueue_editor_assets'));
public function enqueue_editor_assets() {
    if (!is_admin()) return;
    // Enqueue...
}
```

## File Organization & Limits

**Hard Rule**: Max **300 lines** per file (excluding data/constants)

```
src/blocks/{block}/
├── index.js (40-60)      # Registration only
├── edit.js (100-150)     # Focused component
├── save.js               # Usually good
├── components/inspector/ # One file per panel
└── utils/                # Pure functions
```

📖 See [REFACTORING-GUIDE.md](docs/REFACTORING-GUIDE.md) - ROI: 140+ hrs/year saved

## Critical Safety Rules

### BEFORE Changing Shared Code
```bash
# 1. Find ALL usages
grep -r "ComponentName\|functionName" src/

# 2. Test EVERY affected block (see checklist below)

# 3. Build
npm run build

# 4. Check console (editor + frontend)
```

### Cross-Block Testing Checklist
**Container**: Stack, Flex, Grid
**Interactive**: Accordion, Tabs, Counter Group
**Styled**: Icon, Icon Button, Pill, Progress Bar
**List**: Icon List

**Per Block**: Insert → Modify controls → Save → Frontend → Responsive → Console

### CSS Specificity Pattern
```scss
// ✅ LOW SPECIFICITY - Use :where()
:where(.wp-block-designsetgo-stack.custom) { display: flex; }

// ✅ SCOPED - Plugin blocks only
.wp-block[class*="wp-block-designsetgo-"] { /* safe */ }

// ✅ SAFEST - Specific block
.wp-block-designsetgo-stack { /* only affects Stack */ }
```

### JavaScript Scope
```javascript
// ✅ SAFEST - Data attributes
document.querySelectorAll('[data-dsgo-accordion]').forEach(el => {});

// ✅ Event delegation
document.addEventListener('click', (e) => {
  const item = e.target.closest('[data-dsgo-item]');
  if (!item) return;
  handler(item);
});
```

### Block Deprecations (CRITICAL)
**Required when changing**:
- Attribute name/type/default
- Block HTML structure
- Removing attributes

```javascript
// src/blocks/my-block/deprecated.js
const v1 = {
  attributes: { /* OLD schema */ },
  save: ({ attributes }) => { /* OLD save */ },
  migrate: (attrs) => ({ /* transform to new */ }),
};
export default [v1];
```

### Style Imports (MANDATORY)
```scss
// src/styles/style.scss (frontend)
@import '../blocks/my-block/style';
@import '../extensions/my-extension/styles';

// src/styles/editor.scss (editor)
@import '../blocks/my-block/editor';
@import '../extensions/my-extension/editor';
```

**Verify**: `grep -i "class-name" build/style-index.css`

## Pre-Commit Checklist
```bash
npm run build                    # Must succeed
# Check console (editor + frontend)
# Test changed blocks + related blocks
# Test responsive (375/768/1200px)
git status                       # No unexpected changes
```

## Top 10 Common Pitfalls

1. **Frontend imports missing** → Add to `src/styles/style.scss`
2. **style.scss ≠ editor.scss** → Edit BOTH for visual styles
3. **Plain `<InnerBlocks />`** → Use `useInnerBlocksProps()`
4. **Custom width on alignfull** → Let WordPress handle sizing
5. **Only test editor** → ALWAYS test frontend too
6. **No blockGap default in dynamic blocks** → Add to block.json attributes
7. **Change shared utility** → Test ALL consumers (`grep -r`)
8. **Broad CSS selectors** → Scope to `.wp-block-designsetgo-{block}`
9. **addFilter without name check** → Use explicit allowlist
10. **Change attributes** → Create deprecation first

## Technical Patterns

### Clickable Groups
```javascript
group.addEventListener('click', (e) => {
    const isInteractive = e.target.matches('a, button') ||
                         e.target.closest('a, button');
    if (!isInteractive) window.location.href = linkUrl;
});
```

### External Link Security
```javascript
if (linkTarget === '_blank') {
    const win = window.open(linkUrl, '_blank');
    if (win) win.opener = null;
}
```

### Parent-Child Context
```json
// Parent
"providesContext": { "ns/parent/color": "color" }

// Child
"usesContext": ["ns/parent/color"]
```
```javascript
const effectiveColor = color || parentColor || defaultColor;
```

### When to Use `!important`
Only for: Accessibility, User expectation, WordPress core override

### Width & Layout Patterns (Container Blocks)

**⚠️ CRITICAL: Always use two-div pattern for container blocks**

```jsx
// ✅ CORRECT - Two-div pattern
<div className="dsgo-block">        // Outer: full-width, backgrounds
  <div className="dsgo-block__inner" style={innerStyle}>  // Inner: constrained
    {children}
  </div>
</div>
```

**Width Constraint Pattern:**
```javascript
// In edit.js
const [themeContentSize] = useSettings('layout.contentSize');
const innerStyle = {};
if (constrainWidth) {
    innerStyle.maxWidth = contentWidth || themeContentSize;
    innerStyle.marginLeft = 'auto';
    innerStyle.marginRight = 'auto';
}

// In save.js
if (constrainWidth) {
    innerStyle.maxWidth = contentWidth || 'var(--wp--style--global--content-size, 1140px)';
    innerStyle.marginLeft = 'auto';
    innerStyle.marginRight = 'auto';
}
```

**Apply Conditional Classes:**
```javascript
const className = [
    'dsgo-block',
    !constrainWidth && 'dsgo-no-width-constraint',
].filter(Boolean).join(' ');
```

**Handle Nested Containers (Required CSS):**
```scss
.dsgo-my-block {
    // When nested inside another container
    .dsgo-stack__inner > &,
    .dsgo-flex__inner > &,
    .dsgo-grid__inner > & {
        width: 100% !important;
        .dsgo-my-block__inner {
            max-width: none !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
    }
}
```

**📖 See [WIDTH-LAYOUT-PATTERNS.md](docs/WIDTH-LAYOUT-PATTERNS.md) for:**
- Complete width/contentSize documentation
- Known conflicts with nested items (7 identified issues)
- Testing matrix for container nesting
- Migration guide for fixing existing issues

## FSE Compatibility

📖 See [FSE-COMPATIBILITY-GUIDE.md](docs/FSE-COMPATIBILITY-GUIDE.md)

- [ ] Comprehensive `supports` in block.json
- [ ] `example` property
- [ ] WordPress presets (no hardcoded values)
- [ ] Test Twenty Twenty-Five theme
- [ ] Block patterns

## Debugging

**500 Error**: `npx wp-env logs`
**CSS Missing**: `grep -i "class" build/style-index.css`
**Build Verify**: `ls -lh build/ && cat build/style-index.css`

## Resources

📖 **Detailed Guides** (in `docs/`):
- [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) - Complete reference
- [BEST-PRACTICES-SUMMARY.md](docs/BEST-PRACTICES-SUMMARY.md) - Quick patterns
- [EDITOR-STYLING-GUIDE.md](docs/EDITOR-STYLING-GUIDE.md) - Styling patterns
- [WIDTH-LAYOUT-PATTERNS.md](docs/WIDTH-LAYOUT-PATTERNS.md) - Width/layout patterns & nesting conflicts

**Official**:
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Block Supports](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [Theme.json](https://developer.wordpress.org/themes/global-settings-and-styles/settings/)

## Version Control

**Commit Format**: `type: description`
**Types**: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`

**Commit**: `src/`, `includes/`, `*.php`, `package.json`, `block.json`, `*.md`
**Don't Commit**: `build/`, `node_modules/`, `wp-env/`

---
**Updated**: 2025-11-11 | **Version**: 1.0.1 | **WP**: 6.4+
