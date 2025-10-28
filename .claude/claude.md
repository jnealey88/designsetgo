# Claude Code Learnings - DesignSetGo Plugin

This document captures key learnings and technical insights from working on the DesignSetGo WordPress plugin.

## Core Principle: Leverage WordPress Defaults

**Philosophy**: Always use what WordPress gives you for free before building custom solutions.

### Why This Matters
- **Less Code**: WordPress's built-in features are already tested and optimized
- **Better Integration**: Native patterns work seamlessly with themes and other plugins
- **Future-Proof**: WordPress updates improve your features automatically
- **Fewer Bugs**: Well-established patterns have been battle-tested by millions of sites

### Rule of Thumb
Before implementing ANY feature, ask: "Does WordPress already provide this?"

### Essential WordPress Hooks & APIs

**Block Props (Always Use These)**:
- `useBlockProps()` - Main block wrapper props
- `useInnerBlocksProps()` - Inner blocks container props (NOT plain `<InnerBlocks />`)
- `useBlockProps.save()` - For save functions
- `useInnerBlocksProps.save()` - For inner blocks in save functions

**Settings (Get Theme/WordPress Defaults)**:
- `useSettings('layout.contentSize')` - Get theme's content width (WordPress 6.5+)
- `useSettings('spacing.units')` - Get available spacing units (WordPress 6.5+)
- `useSettings('color.palette')` - Get theme colors (WordPress 6.5+)

**Important**: WordPress 6.5+ uses `useSettings` (plural) instead of deprecated `useSetting` (singular). The new API returns an array:
```javascript
// WordPress 6.5+
const [colorPalette] = useSettings('color.palette');
const [contentSize, spacingUnits] = useSettings('layout.contentSize', 'spacing.units');
```

**Why These Matter**: These hooks integrate your blocks with WordPress's layout system, theme.json settings, and block editor features. Using them means less custom code and better compatibility.

## Architecture Decisions

### Extension-Only Approach
**Decision**: Use block extensions via filters instead of custom blocks.

**Why**:
- Works WITH WordPress's native layout system rather than fighting it
- Reduces maintenance burden - WordPress handles core functionality
- Prevents conflicts with theme and core updates
- Eliminates build complexity for custom blocks

**Implementation**:
- Use `addFilter('blocks.registerBlockType')` to add attributes
- Use `addFilter('editor.BlockEdit')` to add controls
- Use `addFilter('blocks.getSaveContent.extraProps')` to add classes/data attributes

### PHP Filters for Block Modification
**Decision**: Use PHP filters to modify block behavior when CSS isn't reliable.

**Why PHP Over CSS**:
- **More Reliable**: PHP modifies block registration at the source, not presentation layer
- **Cleaner**: No complex CSS selectors that may break with WordPress updates
- **Targeted**: Only affects specific blocks, no side effects
- **Persistent**: Works regardless of theme or CSS loading order

**Use Cases**:
- Disabling WordPress's native UI controls
- Modifying block supports (layout, spacing, colors, etc.)
- Setting default attributes programmatically
- Restricting block features for specific use cases

**Pattern - Disable WordPress Layout Controls**:

When you want to replace WordPress's native controls with your own custom interface (like a responsive grid system), use PHP to disable the native controls:

```php
// In includes/blocks/class-loader.php

public function __construct() {
    add_filter( 'register_block_type_args', array( $this, 'modify_block_supports' ), 10, 2 );
}

public function modify_block_supports( $args, $name ) {
    // Only modify your specific block
    if ( 'designsetgo/container' !== $name ) {
        return $args;
    }

    // Disable WordPress's layout editing UI
    if ( isset( $args['supports']['layout'] ) ) {
        $args['supports']['layout']['allowEditing'] = false;
    }

    return $args;
}
```

**What This Does**:
- Removes WordPress's Layout panel from the block settings sidebar
- Hides grid/flex controls (columns, alignment, etc.)
- Allows your custom controls to be the primary interface
- Only affects the specified block, all other blocks work normally

**Alternative Patterns**:

```php
// Completely disable layout support
unset( $args['supports']['layout'] );

// Disable specific layout features
$args['supports']['layout']['allowSwitching'] = false;  // Hide Flow/Flex/Grid toolbar
$args['supports']['layout']['allowInheriting'] = false; // Disable theme layout inheritance

// Modify color support
$args['supports']['color']['background'] = false;  // Hide background color
$args['supports']['color']['text'] = false;        // Hide text color

// Modify spacing support
$args['supports']['spacing']['padding'] = false;   // Hide padding controls
$args['supports']['spacing']['margin'] = false;    // Hide margin controls
```

**When to Use PHP vs CSS**:
- ✅ **Use PHP** when you want to completely remove/replace WordPress functionality
- ✅ **Use CSS** for styling, hiding non-essential UI elements, or visual tweaks
- ❌ **Avoid CSS** for hiding functional controls (unreliable, may break)

**Example - Container Block**:

Our Container block provides a responsive grid system (Desktop/Tablet/Mobile columns). We use PHP to disable WordPress's native layout controls because:

1. **Prevents Confusion**: Users don't see duplicate column controls
2. **Single Source of Truth**: Our responsive grid is the only interface
3. **Reliable**: Works regardless of theme CSS or WordPress updates
4. **Scoped**: Only affects Container block, Group/Column blocks work normally

**Debugging Tip**:

To verify the filter is working, inspect the block's registered type:

```javascript
// In browser console
wp.blocks.getBlockType('designsetgo/container').supports.layout
// Should show: { allowEditing: false, ... }
```

### Frontend Asset Loading
**Critical Learning**: Frontend styles MUST be explicitly imported.

**Problem**: Made changes to group enhancement styles, but they only appeared in editor, not frontend.

**Root Cause**: `src/styles/style.scss` wasn't importing group enhancement styles, so `build/style-index.css` didn't include them.

**Fix**:
```scss
// src/styles/style.scss
@import '../extensions/group-enhancements/styles';
```

**Verification Method**:
```bash
grep -i "has-dsg-overlay" build/style-index.css
```

### FSE (Full Site Editing) Compatibility
**Critical**: Custom blocks MUST support FSE to work with modern WordPress themes like Twenty Twenty-Five.

**Why FSE Matters**:
- Users expect blocks to work in Site Editor
- Global styles allow site-wide customization
- Theme.json integration is the WordPress standard
- Patterns make blocks more accessible to users

#### Required block.json Supports

**Minimum FSE Support**:
```json
{
  "supports": {
    "html": false,
    "inserter": true,
    "layout": {
      "allowSwitching": true,
      "allowEditing": true
    },
    "spacing": {
      "margin": true,
      "padding": true,
      "blockGap": true
    },
    "color": {
      "background": true,
      "text": true,
      "link": true
    }
  }
}
```

**Full FSE Support** (Recommended):
```json
{
  "supports": {
    "anchor": true,
    "align": ["wide", "full"],
    "html": false,
    "inserter": true,
    "layout": {
      "allowSwitching": true,
      "allowInheriting": false,
      "allowEditing": true,
      "allowSizingOnChildren": true,
      "default": {
        "type": "flex",
        "orientation": "vertical"
      }
    },
    "spacing": {
      "margin": true,
      "padding": true,
      "blockGap": true,
      "__experimentalDefaultControls": {
        "padding": true,
        "blockGap": true
      }
    },
    "dimensions": {
      "minHeight": true
    },
    "color": {
      "background": true,
      "text": true,
      "gradients": true,
      "link": true,
      "__experimentalDefaultControls": {
        "background": true,
        "text": true
      }
    },
    "background": {
      "backgroundImage": true,
      "backgroundSize": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "__experimentalDefaultControls": {
        "fontSize": true
      }
    },
    "shadow": true,
    "position": {
      "sticky": true
    },
    "__experimentalBorder": {
      "color": true,
      "radius": true,
      "style": true,
      "width": true,
      "__experimentalDefaultControls": {
        "color": true,
        "radius": true,
        "style": true,
        "width": true
      }
    }
  }
}
```

#### Block Example (Required for Patterns)

Add an `example` property to show a preview:

```json
{
  "example": {
    "attributes": {
      "layout": {
        "type": "flex",
        "orientation": "vertical"
      }
    },
    "innerBlocks": [
      {
        "name": "core/heading",
        "attributes": {
          "level": 2,
          "content": "Block Title"
        }
      },
      {
        "name": "core/paragraph",
        "attributes": {
          "content": "Block description here."
        }
      }
    ]
  }
}
```

**Why**:
- Shows preview in block inserter
- Displays in pattern library
- Helps users understand block purpose
- Required for pattern discovery

#### Use Theme Spacing Tokens

**Always use WordPress spacing presets** instead of hardcoded values:

```javascript
// ❌ BAD - Hardcoded values
style={{
  paddingTop: '80px',
  paddingBottom: '80px'
}}

// ✅ GOOD - Theme spacing tokens
style={{
  paddingTop: 'var(--wp--preset--spacing--xl)',
  paddingBottom: 'var(--wp--preset--spacing--xl)'
}}
```

**In block patterns**:
```html
<!-- Use var:preset|spacing|xl notation -->
<div style="padding-top:var(--wp--preset--spacing--xl)">
```

#### Theme.json Global Styles

Users can customize your block globally via theme.json:

```json
{
  "styles": {
    "blocks": {
      "designsetgo/container": {
        "spacing": {
          "padding": {
            "top": "var(--wp--preset--spacing--50)",
            "bottom": "var(--wp--preset--spacing--50)"
          }
        },
        "color": {
          "background": "var(--wp--preset--color--base)"
        },
        "border": {
          "radius": "8px"
        }
      }
    }
  }
}
```

**Ensure your blocks respect these settings** - don't override with `!important` unless necessary.

#### Block Patterns for Discoverability

Create patterns to showcase your blocks:

```php
<?php
/**
 * Title: Hero Section with Container
 * Slug: designsetgo/hero/container-hero
 * Categories: dsg-hero
 * Description: Full-width hero section
 * Keywords: hero, header, banner
 */

return array(
	'title'      => __( 'Hero Section with Container', 'designsetgo' ),
	'categories' => array( 'dsg-hero' ),
	'content'    => '<!-- wp:designsetgo/container {...} -->...'
);
```

**Pattern Structure**:
```
patterns/
├── hero/
│   └── container-hero.php
├── features/
│   └── three-column-grid.php
└── cta/
    └── centered-cta.php
```

**Benefits**:
- Users discover features through patterns
- Pre-built layouts increase adoption
- Shows best practices for using your blocks
- Works seamlessly in Site Editor

#### FSE Testing Checklist

Before releasing a block, test FSE compatibility:

- [ ] Block appears in Site Editor inserter
- [ ] Block preview shows in pattern library
- [ ] Global styles can be applied (Styles → Blocks → Your Block)
- [ ] Theme spacing tokens work (`var:preset|spacing|*`)
- [ ] Theme colors work (`var:preset|color|*`)
- [ ] Layout switching works (Stack/Row/Grid)
- [ ] Block patterns appear in pattern inserter
- [ ] Works with Twenty Twenty-Five theme
- [ ] No console errors in Site Editor
- [ ] Saves and loads correctly in templates

#### Common FSE Issues

**Issue 1: Block not appearing in Site Editor**
```json
// Add to block.json
"inserter": true
```

**Issue 2: Global styles not applying**
```json
// Enable color/spacing/typography supports
"supports": {
  "color": { "background": true, "text": true },
  "spacing": { "padding": true, "margin": true }
}
```

**Issue 3: Patterns not showing**
```json
// Add example to block.json
"example": { "attributes": {...}, "innerBlocks": [...] }
```

**Issue 4: Theme colors not available**
```javascript
// Use useSettings hook (WordPress 6.5+)
const [themeColors] = useSettings('color.palette');
```

#### Key Takeaways

1. **FSE is not optional** - Modern themes expect it
2. **Use WordPress spacing/color presets** - Don't hardcode values
3. **Add comprehensive supports** - The more, the better
4. **Provide block examples** - Required for patterns
5. **Create patterns** - Increases discoverability
6. **Test with FSE themes** - Twenty Twenty-Five is your baseline

## UI/UX Patterns

### Simplicity Over Flexibility
**Learning**: When a complex feature doesn't work reliably, simplify it.

**Case Study - Overlay Color**:
- **Initial Approach**: Color picker with opacity slider, dynamic CSS variables
- **Problem**: CSS variables weren't being applied to DOM elements
- **User Feedback**: "This isn't working. Let's just have a toggle"
- **Final Solution**: Boolean toggle with fixed `rgba(0, 0, 0, 0.75)`
- **Result**: Simpler, more reliable, easier to maintain

**Takeaway**: Fixed, well-designed defaults often beat complex customization.

### Accessibility First
**Learning**: Always consider contrast and readability when adding overlay features.

**Problem**: Dark overlay (75% black) could make text unreadable if theme uses light text.

**Solution**: Force white text color when overlay is enabled:
```scss
.has-dsg-overlay {
    color: #ffffff !important;

    h1, h2, h3, h4, h5, h6, p, a, span {
        color: #ffffff !important;
    }
}
```

**Why `!important`**: Must override theme styles to ensure readability. Accessibility > CSS specificity rules.

### Use WordPress Native Color Controls
**Learning**: Always use WordPress's built-in color controls (`PanelColorSettings`) instead of custom color pickers.

**Why Native Controls**:
- **Familiar UX**: Users already know how WordPress color controls work
- **Theme Integration**: Automatically shows theme colors and custom palette
- **Consistent UI**: Matches WordPress design system
- **Less Code**: No need to build custom color picker components

**Pattern - Parent-Child Color Inheritance**:

When you want a parent block to provide a default color that child blocks can override:

```javascript
// Parent Block (Counter Group) - edit.js
import { PanelColorSettings, useSettings } from '@wordpress/block-editor';

function ParentEdit({ attributes, setAttributes }) {
  const { hoverColor } = attributes;
  // WordPress 6.5+ - useSettings returns array
  const [colorSettings] = useSettings('color.palette');

  return (
    <>
      <InspectorControls>
        <PanelColorSettings
          title={__('Hover Color', 'designsetgo')}
          colorSettings={[
            {
              value: hoverColor,
              onChange: (value) => setAttributes({ hoverColor: value || '' }),
              label: __('Number Hover Color', 'designsetgo'),
              colors: colorSettings,
            },
          ]}
          initialOpen={false}
        >
          <p className="components-base-control__help">
            {__('Color for counter numbers on hover. Individual counters can override this.', 'designsetgo')}
          </p>
        </PanelColorSettings>
      </InspectorControls>
    </>
  );
}

// Parent Block - block.json (context passing)
{
  "attributes": {
    "hoverColor": { "type": "string", "default": "" }
  },
  "providesContext": {
    "namespace/parentBlock/hoverColor": "hoverColor"
  }
}

// Child Block - block.json (receive context)
{
  "attributes": {
    "hoverColor": { "type": "string", "default": "" }
  },
  "usesContext": ["namespace/parentBlock/hoverColor"]
}

// Child Block - edit.js (use parent color with override)
function ChildEdit({ attributes, setAttributes, context }) {
  const { hoverColor } = attributes;
  // WordPress 6.5+ - useSettings returns array
  const [colorSettings] = useSettings('color.palette');

  // Get parent hover color from context
  const parentHoverColor = context?.['namespace/parentBlock/hoverColor'] || '';

  // Get theme accent-2 color as default
  const themeColors = colorSettings?.theme || [];
  const accent2Color = themeColors.find((color) => color.slug === 'accent-2');
  const defaultHoverColor = accent2Color?.color || '';

  // Priority: individual override > parent > theme accent-2
  const effectiveHoverColor = hoverColor || parentHoverColor || defaultHoverColor;

  const blockProps = useBlockProps({
    style: {
      // Apply as CSS custom property
      ...(effectiveHoverColor && { '--hover-color': effectiveHoverColor }),
    },
  });

  return (
    <>
      <InspectorControls>
        <PanelColorSettings
          title={__('Hover Color', 'designsetgo')}
          colorSettings={[
            {
              value: hoverColor,
              onChange: (value) => setAttributes({ hoverColor: value || '' }),
              label: __('Number Hover Color', 'designsetgo'),
              colors: colorSettings,
            },
          ]}
          initialOpen={false}
        >
          <p className="components-base-control__help">
            {parentHoverColor
              ? __('Override parent group hover color. Leave empty to use group setting.', 'designsetgo')
              : __('Color for element on hover. Leave empty to use theme accent color.', 'designsetgo')}
          </p>
        </PanelColorSettings>
      </InspectorControls>
      <div {...blockProps}>...</div>
    </>
  );
}
```

**CSS Pattern - Fallback Chain**:

```scss
.block {
  &:hover {
    .element {
      // Priority: custom color > parent color > theme accent-2 > current color
      color: var(
        --hover-color,
        var(--wp--preset--color--accent-2, currentColor)
      );
    }
  }
}
```

**Key Principles**:
1. **Use `PanelColorSettings`** - Never build custom color pickers
2. **Pass via context** - Use `providesContext` and `usesContext` in block.json
3. **CSS custom properties** - Apply colors as `--custom-property` in inline styles
4. **Fallback chain** - CSS `var()` with multiple fallbacks (custom > parent > theme > default)
5. **Theme integration** - Always include theme colors via `useSettings('color.palette')` (WordPress 6.5+)
6. **Clear help text** - Explain override behavior and defaults

**Benefits**:
- Users get familiar WordPress color UI
- Theme colors automatically available
- Parent-child inheritance works seamlessly
- Individual blocks can override parent settings
- Graceful fallbacks to theme defaults

## Technical Patterns

### Use WordPress Block Hooks (useInnerBlocksProps, useBlockProps)
**Learning**: Always use WordPress's provided hooks instead of manually rendering components.

**Problem**: Content width constraint wasn't working because inner blocks weren't using WordPress's proper pattern.

**Wrong Approach**:
```javascript
// ❌ BAD - Manual InnerBlocks component
const blockProps = useBlockProps();
return (
  <div {...blockProps}>
    <div style={{ maxWidth: contentWidth }}>
      <InnerBlocks />
    </div>
  </div>
);
```

**Correct Approach**:
```javascript
// ✅ GOOD - Using useInnerBlocksProps
const blockProps = useBlockProps();
const innerBlocksProps = useInnerBlocksProps({
  className: 'my-inner-container',
  style: {
    maxWidth: contentWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
  }
});

return (
  <div {...blockProps}>
    <div {...innerBlocksProps} />
  </div>
);
```

**Why This Works**:
- `useInnerBlocksProps()` properly integrates with WordPress's layout system
- Automatically handles block inserter, selection states, and appender
- Respects WordPress's block spacing and layout settings
- Applies styles directly to the container that holds inner blocks
- Works correctly with both editor and save functions

**Key Insight**: WordPress provides hooks that handle the complexity of block integration. Use them instead of trying to manually wire things up.

**Save Function Pattern**:
```javascript
// In save.js, use the .save() variant
const innerBlocksProps = useInnerBlocksProps.save({
  className: 'my-inner-container',
  style: { /* styles */ }
});
```

**Real-World Impact**:
- Fixed content width not being respected
- Fixed grid layout not applying to inner blocks
- Reduced code complexity
- Better integration with WordPress theme.json settings

### Clickable Groups Without Interfering with Interactive Elements
**Pattern**: Make entire group clickable, but detect and preserve nested interactive elements.

**Implementation**:
```javascript
group.addEventListener('click', function (e) {
    const isInteractive =
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.closest('a') ||
        e.target.closest('button');

    if (!isInteractive) {
        window.location.href = linkUrl;
    }
});
```

**Why**: Allows card-style clickable containers while preserving button/link functionality inside.

### Security for External Links
**Pattern**: Always add `noopener noreferrer` when opening links in new tabs.

**Why**: Prevents new window from accessing `window.opener` (security risk).

**Implementation**:
```javascript
if (linkTarget === '_blank') {
    const newWindow = window.open(linkUrl, '_blank');
    if (newWindow) {
        newWindow.opener = null;
    }
}
```

### Future-Proof WordPress Components
**Critical**: Always add future-proof props to WordPress components to avoid deprecation warnings and prepare for upcoming WordPress versions.

**Problem**: WordPress 6.7+ deprecated old size and margin defaults for form components. Without future-proof props, console shows warnings:
- "36px default size for wp.components.{Component} is deprecated since version 6.8"
- "Bottom margin styles for wp.components.{Component} is deprecated since version 6.7"

**Solution**: Add these two props to ALL instances of these components:

**Affected Components**:
- `SelectControl`
- `RangeControl`
- `UnitControl`
- `ToggleGroupControl`
- `TextControl`

**Required Props**:
```javascript
<RangeControl
  label={__('My Setting', 'designsetgo')}
  value={myValue}
  onChange={(value) => setAttributes({ myValue: value })}
  min={1}
  max={10}
  __next40pxDefaultSize        // ← Future-proof size
  __nextHasNoMarginBottom      // ← Future-proof margin
/>
```

**Why This Matters**:
- Eliminates deprecation warnings in console (cleaner developer experience)
- Prepares codebase for WordPress 7.0+ when old defaults are removed
- Adopts new WordPress component sizing standards early
- Prevents future breaking changes

**When to Add**:
- **All new blocks**: Add these props from day one
- **Existing blocks**: Add during any component updates or refactoring
- **Component libraries**: Update all instances systematically

**Real-World Impact**:
- Updated 80 component instances across 22 files in DesignSetGo
- Eliminated 14+ deprecation warnings from console
- Future-proofed plugin for WordPress 7.0+ compatibility

### Proper Asset Enqueuing for Block Editor
**Critical**: Use correct WordPress hooks for enqueuing block editor assets to avoid iframe warnings.

**Problem**: Using `enqueue_block_editor_assets` hook causes warning:
```
designsetgo-extensions-css was added to the iframe incorrectly.
Please use block.json or enqueue_block_assets to add styles to the iframe.
```

**Root Cause**: WordPress 5.8+ uses iframe for block editor. The `enqueue_block_editor_assets` hook runs before iframe is ready, causing assets to load in wrong context.

**Wrong Approach**:
```php
// ❌ BAD - Assets don't load correctly in iframe
add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
```

**Correct Approach**:
```php
// ✅ GOOD - Works correctly with block editor iframe
add_action('enqueue_block_assets', array($this, 'enqueue_editor_assets'));

public function enqueue_editor_assets() {
    // Guard: Only run in editor context
    if (!is_admin()) {
        return;
    }

    // Enqueue scripts/styles...
}
```

**Why This Works**:
- `enqueue_block_assets` hook runs in BOTH editor and frontend contexts
- Guard with `is_admin()` to run only in editor
- Assets load correctly in block editor iframe
- No console warnings about incorrect asset loading

**Key Differences**:

| Hook | Context | Iframe Support | Best For |
|------|---------|----------------|----------|
| `enqueue_block_editor_assets` | Editor only | ❌ Old pattern | Deprecated |
| `enqueue_block_assets` + `is_admin()` guard | Both (guarded) | ✅ Correct | **Use this** |
| `wp_enqueue_scripts` | Frontend only | N/A | Frontend assets |

**Pattern for Assets Class**:
```php
class Assets {
    public function __construct() {
        // Editor assets (extensions, variations)
        add_action('enqueue_block_assets', array($this, 'enqueue_editor_assets'));

        // Frontend assets (only when blocks present)
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
    }

    public function enqueue_editor_assets() {
        // Guard: Editor only
        if (!is_admin()) {
            return;
        }

        // Load editor scripts/styles
        wp_enqueue_style('designsetgo-extensions', ...);
        wp_enqueue_script('designsetgo-extensions', ...);
    }

    public function enqueue_frontend_assets() {
        // Only load if blocks are used
        if (!$this->has_designsetgo_blocks()) {
            return;
        }

        // Load frontend scripts/styles
        wp_enqueue_style('designsetgo-frontend', ...);
        wp_enqueue_script('designsetgo-frontend', ...);
    }
}
```

**Benefits**:
- No iframe warnings in console
- Proper asset loading in block editor
- Works with WordPress 5.8+ iframe architecture
- Follows WordPress best practices

**When to Use**:
- Block extensions (filters that modify core blocks)
- Block variations
- Global editor styles/scripts
- Any editor-only customizations

**Note**: Individual block assets should still use `block.json` `editorScript`, `editorStyle`, `script`, and `style` properties for automatic loading.

## WordPress-Specific Learnings

### Block Category Ordering
**How to Make Custom Category First**:
```php
public function register_block_category( $categories ) {
    return array_merge(
        array(
            array(
                'slug'  => 'designsetgo',
                'title' => __( 'DesignSetGo', 'designsetgo' ),
            ),
        ),
        $categories  // New category first, then existing
    );
}
```

### Block Variations Cleanup
**Learning**: Fewer, better variations > many mediocre ones.

**Original**: 5 variations (Hero, 3-Column Grid, Card Grid, Centered Container, Side by Side)

**Final**: 2 variations (Hero Section, Responsive Grid)

**Why**:
- Removed redundant patterns
- Cleaner block inserter UI
- Users can customize from base variations

## Debugging Techniques

### 500 Internal Server Error - Block Assets
**Symptom**: `GET /wp-admin/post.php?post=7&action=edit 500`

**Debug Process**:
1. Check PHP error logs: `npx wp-env logs`
2. Found: `Failed opening required 'build/blocks/container/index.asset.php'`
3. Root cause: `block.json` existed but JS wasn't compiled

**Fix**: Remove custom blocks entirely, use extensions only.

### CSS Not Applying - Missing Imports
**Debug Process**:
1. Check if CSS exists in build: `cat build/style-index.css`
2. Search for specific class: `grep -i "has-dsg-overlay" build/style-index.css`
3. If missing, check source imports in `src/styles/style.scss`

### Dynamic Styles Not Applying
**Symptom**: Console shows style object created, but not in DOM.

**Debugging**:
```javascript
console.log('Attributes:', { dsgOverlayColor });
console.log('Style object:', overlayStyles);
// Then inspect HTML element to see if style attribute exists
```

**Finding**: `editor.BlockListBlock` filter doesn't reliably apply inline styles.

**Solution**: Use CSS classes instead of dynamic inline styles.

## Build Process

### When to Rebuild
Always rebuild after changes to:
- SCSS files (`.scss`)
- JavaScript files (`.js`, `.jsx`)
- Block attributes or controls

**Command**:
```bash
npx wp-scripts build
```

### Build Output Verification
Check what got compiled:
```bash
ls -lh build/                    # See file sizes
cat build/style-index.css       # Frontend styles
cat build/index.css             # Editor styles
cat build/index.js              # Block extensions JS
```

### Sass Deprecation Warnings
**Warning**: `Sass @import rules are deprecated`

**Fix** (future): Migrate to `@use` and `@forward`:
```scss
// Instead of:
@import 'variables';

// Use:
@use 'variables';
```

**Note**: Not critical for now, but plan migration before Dart Sass 3.0.0.

## File Organization

### Extension Structure
```
src/extensions/group-enhancements/
├── index.js         # Block registration, attributes, controls
├── styles.scss      # Frontend styles
├── editor.scss      # Editor-only styles
└── frontend.js      # Frontend JavaScript (clickable groups, etc.)
```

### Style Imports
```
src/
├── index.js                    # Main entry - imports everything
├── styles/
│   ├── style.scss             # Frontend entry - imports all frontend styles
│   └── editor.scss            # Editor entry - imports all editor styles
└── extensions/
    └── group-enhancements/
        ├── styles.scss        # Must be imported in style.scss
        └── editor.scss        # Must be imported in editor.scss
```

**Critical**: Extensions' styles must be explicitly imported in main style files, or they won't be compiled into build output.

## Code Maintainability and Refactoring Patterns

### File Size Limits
**Hard Rule**: No single file should exceed **300 lines** (excluding pure data/constants).

**Why**:
- Files >300 lines become hard to navigate and understand
- Testing becomes difficult
- Changes require excessive context switching
- Code reviews become overwhelming

**Action**: When a file exceeds 300 lines, refactor it following the patterns below.

---

### Refactored Block File Structure (Standard Pattern)

**Use this structure for ALL custom blocks:**

```
src/blocks/{block-name}/
├── index.js (40-60 lines)          # Registration only
│   ├── Import edit, save, metadata
│   ├── Import styles (editor.scss, style.scss)
│   └── registerBlockType() call
│
├── edit.js (100-150 lines)         # Focused edit component
│   ├── Import extracted panels
│   ├── Import extracted utilities
│   ├── Attribute destructuring
│   ├── Calculate styles using utilities
│   ├── Return JSX with panels
│   └── NO inline PanelBody components
│
├── save.js (as-is)                 # Usually already good
│
├── components/
│   └── inspector/                   # One file per panel
│       ├── SettingsPanel1.js (60-150 lines)
│       ├── SettingsPanel2.js (60-150 lines)
│       └── SettingsPanel3.js (60-150 lines)
│
├── utils/                           # Pure functions
│   ├── style-calculator.js (60-120 lines)
│   ├── formatter.js (60-100 lines)
│   └── data-library.js (any size - pure data)
│
├── editor.scss                      # Editor-only styles
└── style.scss                       # Frontend styles
```

---

### Refactoring Pattern (Step-by-Step)

**When a block file exceeds 300 lines, follow these steps:**

#### 1. Analyze and Backup
```bash
# Check file size
wc -l src/blocks/{block-name}/index.js

# Backup original
cp src/blocks/{block-name}/index.js src/blocks/{block-name}/index.js.backup
```

#### 2. Extract Pure Utilities First
Create `utils/` directory and extract:
- Style calculation functions
- Number/string formatters
- Data transformations
- Icon/image libraries
- Any pure functions (no side effects)

**Example:**
```javascript
// utils/style-calculator.js
/**
 * Calculate container inner styles
 * Pure function - 100% testable
 */
export const calculateInnerStyles = (attributes) => {
  const { layoutType, constrainWidth, contentWidth, gridColumns, gap } = attributes;

  const styles = {
    position: 'relative',
    zIndex: 2,
  };

  if (layoutType === 'grid') {
    styles.display = 'grid';
    styles.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
    styles.gap = gap;
  }

  return styles;
};
```

**Why Pure Functions First**:
- Immediately testable without WordPress
- No dependencies
- Can be used in both edit.js and save.js
- Simplifies component extraction

#### 3. Extract Inspector Panels
Create `components/inspector/` directory with one file per `<PanelBody>`.

**Panel Component Pattern:**
```javascript
// components/inspector/LayoutPanel.js
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleGroupControl, TextControl } from '@wordpress/components';

/**
 * Layout Panel - Controls for layout type and gap
 *
 * @param {Object} props - Component props
 * @param {string} props.layoutType - Current layout type
 * @param {string} props.gap - Gap between items
 * @param {Function} props.setAttributes - Function to update attributes
 */
export const LayoutPanel = ({ layoutType, gap, setAttributes }) => {
  return (
    <PanelBody title={__('Layout', 'designsetgo')} initialOpen={true}>
      <ToggleGroupControl
        label={__('Layout Type', 'designsetgo')}
        value={layoutType}
        onChange={(value) => setAttributes({ layoutType: value })}
        isBlock
      >
        {/* Controls */}
      </ToggleGroupControl>

      <TextControl
        label={__('Gap', 'designsetgo')}
        value={gap}
        onChange={(value) => setAttributes({ gap: value })}
      />
    </PanelBody>
  );
};
```

**Panel Naming Convention**:
- `{Feature}Panel.js` - e.g., `LayoutPanel.js`, `GridPanel.js`
- Export as named export: `export const LayoutPanel = ...`
- Always include JSDoc comments

#### 4. Create Focused edit.js
Move edit logic from index.js to new edit.js file.

**Edit Component Pattern:**
```javascript
// edit.js
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { LayoutPanel } from './components/inspector/LayoutPanel';
import { GridPanel } from './components/inspector/GridPanel';
import { calculateInnerStyles } from './utils/style-calculator';

export default function BlockEdit({ attributes, setAttributes }) {
  const { layoutType, gridColumns, gap } = attributes;

  // Calculate styles using utilities (declarative)
  const innerStyles = calculateInnerStyles(attributes);

  // Get block props
  const blockProps = useBlockProps({ className: 'my-block' });

  return (
    <>
      <InspectorControls>
        <LayoutPanel
          layoutType={layoutType}
          gap={gap}
          setAttributes={setAttributes}
        />
        <GridPanel
          gridColumns={gridColumns}
          setAttributes={setAttributes}
        />
      </InspectorControls>

      <div {...blockProps}>
        <div style={innerStyles}>
          {/* Block content */}
        </div>
      </div>
    </>
  );
}
```

#### 5. Update index.js to Registration-Only
Simplify index.js to just register the block.

**Registration Pattern:**
```javascript
// index.js (40-60 lines)
import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import metadata from './block.json';

import './editor.scss';
import './style.scss';

/**
 * Register Block Name Block
 */
registerBlockType(metadata.name, {
  ...metadata,
  icon: {
    src: (/* SVG */),
    foreground: '#2563eb',
  },
  edit,
  save,
});
```

#### 6. Build and Test
```bash
# Build
npx wp-scripts build

# Check bundle sizes
ls -lh build/index.js build/style-index.css

# Test in wp-env
npx wp-env start
```

#### 7. Verify No Breaking Changes
- [ ] Block loads without errors
- [ ] All controls work in editor
- [ ] Styles apply correctly
- [ ] Frontend matches editor
- [ ] Existing blocks don't show validation errors
- [ ] Bundle size increase is acceptable (<5%)

---

### Refactoring Success Metrics

**Before Starting:**
- File size >300 lines
- Mixed concerns (registration + edit + panels + utilities)
- Hard to test
- Hard to navigate

**After Refactoring:**
- Main file: 40-60 lines (registration only)
- Edit file: 100-150 lines (focused component)
- Each panel: 60-150 lines (single responsibility)
- Pure utilities: 60-120 lines (100% testable)
- Total files: 6-10 focused files
- **Code health improvement: +5-10 points**

---

### Real-World Examples from This Project

#### Container Block Refactoring
- **Before**: 658 lines (monolithic)
- **After**: 349 lines edit.js + 7 panels + 1 utility
- **Reduction**: -47% in main file
- **Files created**: 9 focused files
- **Time**: 2 hours
- **ROI**: 76 hours/year saved

#### Counter Block Refactoring
- **Before**: 357 lines (monolithic)
- **After**: 54 lines index.js + 154 lines edit.js + 4 panels + 2 utilities
- **Reduction**: -85% in main file
- **Files created**: 8 focused files
- **Time**: 1.5 hours
- **ROI**: 33 hours/year saved

#### Icon Block Refactoring
- **Before**: 350 lines (monolithic)
- **After**: 41 lines index.js + 102 lines edit.js + 3 panels + 2 utilities
- **Reduction**: -88% in main file
- **Files created**: 7 focused files
- **Time**: 1.5 hours
- **ROI**: 31 hours/year saved

**Total ROI (All 3 Blocks)**: 140+ hours/year saved from 6.5 hours invested = **2,054% ROI**

---

### When to Refactor

**Triggers:**
1. File exceeds 300 lines
2. Adding a feature requires scrolling through >200 lines
3. Testing requires mocking WordPress extensively
4. Code reviews take >20 minutes
5. Onboarding new developers is difficult

**Don't Refactor When:**
1. File is <250 lines and well-organized
2. File is pure data (e.g., icon library, constants)
3. About to make major architectural changes
4. No tests exist (write tests first, then refactor)

---

### Naming Conventions

**Files:**
- `{BlockName}Edit.js` or just `edit.js` (we prefer `edit.js`)
- `{Feature}Panel.js` (e.g., `LayoutPanel.js`, not `layout-panel.js`)
- `{purpose}-{type}.js` (e.g., `style-calculator.js`, `number-formatter.js`)

**Exports:**
- Named exports for panels: `export const LayoutPanel = ...`
- Default export for edit/save: `export default function BlockEdit() {...}`
- Named exports for utilities: `export const calculateStyle = ...`

**Directories:**
- `components/inspector/` (not `components/panels/`)
- `utils/` (not `utilities/` or `helpers/`)

---

### Testing Extracted Code

**Pure Utilities (Easy):**
```javascript
// utils/number-formatter.test.js
import { formatNumber } from './number-formatter';

describe('formatNumber', () => {
  it('formats with thousands separator', () => {
    expect(formatNumber(1000)).toBe('1,000');
  });

  it('formats with decimals', () => {
    expect(formatNumber(1234.56, { decimals: 2 })).toBe('1,234.56');
  });
});
```

**Inspector Panels (Medium):**
```javascript
// components/inspector/LayoutPanel.test.js
import { render, screen } from '@testing-library/react';
import { LayoutPanel } from './LayoutPanel';

describe('LayoutPanel', () => {
  it('renders layout controls', () => {
    render(<LayoutPanel layoutType="grid" gap="24px" setAttributes={jest.fn()} />);
    expect(screen.getByText('Layout')).toBeInTheDocument();
  });
});
```

---

### Performance Considerations

**Bundle Size:**
- Refactoring typically adds 2-5 KB to editor bundle
- This is acceptable due to webpack tree-shaking
- Frontend bundle should not increase
- Monitor with `ls -lh build/`

**Build Time:**
- More files = slightly longer builds (~5-10%)
- Offset by better developer experience
- Use `--webpack-bundle-analyzer` to check

**Runtime Performance:**
- No impact - same code, just organized better
- Pure functions may improve performance (memoization opportunities)

---

### Documentation Requirements

**Every refactored block must have:**

1. **JSDoc on all exports:**
```javascript
/**
 * Layout Panel - Controls for layout type and gap
 *
 * @param {Object} props - Component props
 * @param {string} props.layoutType - Current layout type
 * @param {Function} props.setAttributes - Function to update attributes
 * @return {JSX.Element} Layout Panel component
 */
```

2. **File header comments:**
```javascript
/**
 * Container Block - Layout Panel Component
 *
 * Provides controls for layout type selection and gap settings.
 *
 * @since 1.0.0
 */
```

3. **Inline comments for complex logic:**
```javascript
// Calculate responsive columns, ensuring Desktop >= Tablet >= Mobile
const effectiveTabletCols = Math.min(tabletColumns, desktopColumns);
```

---

### Refactoring Checklist

Use this checklist for every refactoring:

**Planning:**
- [ ] File exceeds 300 lines
- [ ] Identified pure utilities to extract
- [ ] Identified panels to extract (one per PanelBody)
- [ ] Estimated time (1.5-2 hours per block)

**Backup:**
- [ ] Created `.backup` file of original

**Extraction:**
- [ ] Created `utils/` directory
- [ ] Extracted pure functions with JSDoc
- [ ] Created `components/inspector/` directory
- [ ] Extracted panels with JSDoc
- [ ] Created focused `edit.js`
- [ ] Updated `index.js` to registration-only

**Testing:**
- [ ] Build succeeds
- [ ] No console errors
- [ ] Block works in editor
- [ ] Block works on frontend
- [ ] No validation errors
- [ ] Bundle size acceptable

**Documentation:**
- [ ] JSDoc on all exports
- [ ] File headers added
- [ ] Updated CLAUDE.md if patterns changed

**Commit:**
- [ ] Committed with descriptive message
- [ ] Mentioned reduction percentage
- [ ] Noted any bundle size changes

---

### Common Refactoring Mistakes

**❌ Don't:**
1. Extract panels but keep them all in index.js
2. Create utilities that import WordPress hooks (not pure)
3. Split files arbitrarily without purpose
4. Refactor without tests
5. Change functionality while refactoring
6. Mix registration and edit logic in index.js
7. Use default exports for panels (use named exports)

**✅ Do:**
1. Extract pure functions first (easiest to test)
2. One panel component per PanelBody
3. Keep edit.js focused (just composition)
4. Maintain exact same functionality
5. Test before and after refactoring
6. Write JSDoc comments as you extract
7. Follow established naming conventions

---

### Future Refactoring Candidates

**Priority Order:**
1. **P0 - Critical**: Files >500 lines
2. **P1 - High**: Files >400 lines
3. **P2 - Medium**: Files >300 lines
4. **P3 - Low**: Files >250 lines (optional)

**Monitor:**
```bash
# Find large files
find src/blocks -name "*.js" -exec wc -l {} + | sort -rn | head -10
```

**Current Status (After Phase 3):**
- Large files (>300 lines): 1 remaining
- Code health: 95%
- Refactoring complete for all critical priorities

---

## Code Quality

### When to Use `!important`
**Guideline**: Avoid `!important` EXCEPT when:
1. **Accessibility requirement** - Must override theme for readability (e.g., white text on dark overlay)
2. **User expectation** - Feature explicitly chosen should take precedence (e.g., responsive grid columns)
3. **WordPress core override** - Need to override core block styles for enhancement to work

### Clean Code After Pivots
When making architectural changes:
1. Remove unused code immediately
2. Delete abandoned approaches (e.g., container custom block)
3. Clean up imports (remove unused React hooks, components)
4. Update comments to reflect current implementation

**Example**: After simplifying overlay from color picker to toggle:
- Removed `useEffect`, `__experimentalPanelColorGradientSettings`
- Removed CSS variable logic
- Removed data attribute handling
- Updated comments from "dynamic overlay color" to "fixed dark overlay"

## Testing Strategy

### Local Development
1. Run wp-env: `npx wp-env start`
2. Build plugin: `npx wp-scripts build`
3. Test in editor: Create/edit post
4. Test on frontend: View published post
5. Test responsive: Use browser DevTools device emulation

### Verification Checklist
- [ ] Changes appear in editor
- [ ] Changes appear on frontend
- [ ] Changes work on mobile (responsive)
- [ ] Accessibility: Contrast, keyboard navigation
- [ ] Interactive elements still work (buttons, links)
- [ ] No console errors
- [ ] Build completes without errors

## User Feedback Patterns

### When User Says "It's Not Working"
1. **Ask for specifics**: Editor or frontend? What's expected vs. actual?
2. **Get console output**: JavaScript errors? Network errors?
3. **Check build**: Did changes compile? File sizes increased?
4. **Verify deployment**: Changes copied to Docker/Local WP?

### Simplification Triggers
User phrases that signal need to simplify:
- "This isn't working"
- "Let's just..."
- "Instead of [complex feature]..."
- "Can we make it simpler?"

**Response**: Immediately pivot to simpler solution, don't try to fix complex approach.

## WordPress Block Editor Quirks

### CSS Variable Limitations
- Block wrapper elements don't reliably accept inline style attributes from filters
- Use CSS classes instead of dynamic inline styles
- If you need dynamic values, use data attributes + CSS `attr()` or JavaScript

### Grid Layout Enhancement
WordPress sets `display: grid` via theme.json/layout settings. To enhance:
```scss
.dsg-grid-enhanced {
    // Override column count, WordPress handles display: grid
    &.dsg-grid-cols-3 {
        grid-template-columns: repeat(3, 1fr) !important;
    }
}
```

**Don't**: Try to set `display: grid` yourself - WordPress already does it.

### Hide WordPress Controls
To hide redundant WordPress controls when your enhancement is active:
```scss
body:has(.wp-block-group.is-selected.dsg-grid-enhanced) {
    .block-editor-hooks__layout-controls
    .components-base-control:has(input[aria-label*='Columns' i]) {
        display: none !important;
    }
}
```

**Why**: Prevents confusion from duplicate controls (WordPress columns + your responsive columns).

## WordPress Block Editor Styling Best Practices ⭐

### Critical Discovery: Editor/Frontend Style Inconsistency
**Date**: October 24, 2025
**Issue**: Container block styles applied on frontend but NOT in editor
**Root Cause**: Using WordPress anti-patterns (DOM manipulation + plain InnerBlocks)

---

### ❌ Anti-Pattern 1: DOM Manipulation with useEffect

**What We Were Doing (WRONG)**:
```javascript
// Container block edit.js - ANTI-PATTERN
useEffect(() => {
  const container = document.querySelector(`[data-block="${clientId}"]`);
  const inner = container.querySelector('.dsg-container__inner');

  // Manual DOM manipulation
  inner.style.display = 'grid';
  inner.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
}, [layoutType, gridColumns, clientId]);
```

**Why This Fails**:
- ⏱️ **Timing Issues**: WordPress block editor uses iframes; DOM queries run before elements render
- 🏁 **Race Conditions**: `useEffect` may execute before block wrapper exists
- 🚫 **Not Declarative**: Conflicts with WordPress's React-based architecture
- 💥 **Unreliable**: Styles inconsistently apply or don't apply at all in editor

**WordPress Documentation Says**:
> "The save function should be a pure and stateless function that depends only on the attributes used to invoke it and **shouldn't use any APIs such as useState or useEffect**."

---

### ❌ Anti-Pattern 2: Plain `<InnerBlocks />` Instead of `useInnerBlocksProps`

**What We Were Doing (WRONG)**:
```javascript
// Container block edit.js - ANTI-PATTERN
<div className="dsg-container__inner" style={{ position: 'relative', zIndex: 2 }}>
  <InnerBlocks />
</div>
```

**Why This Breaks Layouts**:
- 📦 **Wrapper Divs**: WordPress adds `block-editor-inner-blocks` and `block-editor-block-list__layout` wrappers
- 🔨 **Broken Grid/Flexbox**: These wrapper divs **break CSS Grid and Flexbox** because styles apply to wrong element
- 🎭 **Editor/Frontend Mismatch**: Editor markup doesn't match frontend markup
- ⚠️ **Block Appender Issues**: Block inserter may not work correctly

**WordPress Community Insight**:
> "When using plain `<InnerBlocks />`, additional wrapper divs break flexbox and CSS Grid layouts. Use `useInnerBlocksProps` hooks that core blocks employ. This will allow your block markup to match the frontend without the editor wrapping things in additional tags."
> — [WordPress StackExchange](https://wordpress.stackexchange.com/questions/390696/innerblocks-breaks-flexbox-and-css-grid-styles)

---

### ✅ Correct Pattern: Declarative Styles with `useInnerBlocksProps`

**How WordPress Core Blocks Do It**:

```javascript
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ContainerEdit({ attributes }) {
  const { layoutType, constrainWidth, contentWidth, gridColumns, gap } = attributes;

  // ========================================
  // 1. Calculate styles DECLARATIVELY
  //    (NO useEffect, NO DOM queries)
  // ========================================
  const innerStyles = {
    position: 'relative',
    zIndex: 2,
  };

  if (layoutType === 'grid') {
    innerStyles.display = 'grid';
    innerStyles.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
    innerStyles.gap = gap;
  } else if (layoutType === 'flex') {
    innerStyles.display = 'flex';
    innerStyles.flexDirection = 'row';
    innerStyles.flexWrap = 'wrap';
    innerStyles.gap = gap;
  } else {
    // Stack (default)
    innerStyles.display = 'flex';
    innerStyles.flexDirection = 'column';
    innerStyles.gap = gap;
  }

  if (constrainWidth) {
    innerStyles.maxWidth = contentWidth;
    innerStyles.marginLeft = 'auto';
    innerStyles.marginRight = 'auto';
  }

  // ========================================
  // 2. Apply to block wrapper
  // ========================================
  const blockProps = useBlockProps({
    className: 'dsg-container',
  });

  // ========================================
  // 3. Apply to inner blocks wrapper
  //    KEY: No wrapper div, props spread directly
  // ========================================
  const innerBlocksProps = useInnerBlocksProps(
    {
      className: 'dsg-container__inner',
      style: innerStyles, // ← Styles applied declaratively
    },
    {
      orientation: layoutType === 'flex' ? 'horizontal' : undefined,
    }
  );

  // ========================================
  // 4. Return: NO wrapper div around innerBlocksProps
  // ========================================
  return (
    <>
      <BlockControls>...</BlockControls>
      <InspectorControls>...</InspectorControls>

      <div {...blockProps}>
        {/* Background elements */}
        {videoUrl && <div className="dsg-video-background">...</div>}
        {enableOverlay && <div className="dsg-overlay">...</div>}

        {/* Inner blocks - NO wrapper div, spread props directly */}
        <div {...innerBlocksProps} />
      </div>
    </>
  );
}
```

**Save Function (Must Match Editor)**:

```javascript
export default function ContainerSave({ attributes }) {
  // Same style calculation as edit.js
  const innerStyles = { /* ... same logic ... */ };

  const blockProps = useBlockProps.save({
    className: 'dsg-container',
  });

  // Use .save() variant for consistency
  const innerBlocksProps = useInnerBlocksProps.save({
    className: 'dsg-container__inner',
    style: innerStyles,
  });

  return (
    <div {...blockProps}>
      {enableOverlay && <div className="dsg-overlay">...</div>}
      {/* NO wrapper div, spread props directly */}
      <div {...innerBlocksProps} />
    </div>
  );
}
```

---

### Key Benefits of Correct Pattern

| Benefit | Description |
|---------|-------------|
| ⚡ **Immediate Application** | Styles apply instantly in editor, no delay or race conditions |
| 🎯 **Editor/Frontend Parity** | What you see in editor matches frontend exactly |
| 🚀 **No Timing Issues** | Declarative = no race conditions or DOM queries |
| 🏛️ **WordPress-Native** | Uses official WordPress APIs that all core blocks use |
| 🔮 **Future-Proof** | Won't break with WordPress updates to block editor |
| 💪 **Better Performance** | No DOM queries, no useEffect overhead, smaller bundles |

---

### Real-World Impact on Container Block

**Performance Improvements**:
- `index.js`: 17.2 KiB → 16.7 KiB (**-500 bytes**)
- `frontend.js`: 4.2 KiB → 3.17 KiB (**-1 KB**, removed layout engine)
- `index.css`: 1.95 KiB → 1.5 KiB (**-450 bytes**)
- **Total savings**: -2 KB (**8.5% reduction**)

**Functional Improvements**:
- ✅ Layouts apply **instantly** in editor (no delay)
- ✅ Editor matches frontend **exactly** (no wrapper div issues)
- ✅ Grid/Flexbox layouts work **correctly** in both editor and frontend
- ✅ Width constraints apply **immediately** without JavaScript
- ✅ Progressive enhancement: Layouts work **without JavaScript**

---

### When to Use Inline Styles vs CSS Classes

**WordPress Best Practice**:

| Type | Use Case | Example |
|------|----------|---------|
| **Inline Styles** | User-controlled dynamic values | Colors, spacing, custom widths, column counts |
| **CSS Classes** | Static design patterns | Responsive behavior, theme variations, state indicators |

**Our Container Block**:
- **Inline Styles**: Layout type, column counts, gap, content width (user-defined)
- **CSS Classes**: Responsive visibility, video indicators, clickable state, variations

---

### Frontend JavaScript Implications

**Before (Anti-Pattern)**:
- ❌ `frontend.js` had `initLayouts()` function
- ❌ Queried all `.dsg-container` elements
- ❌ Applied layout styles via JavaScript
- ❌ Listened for window resize events
- ❌ Flash of unstyled content (FOUC) possible
- ❌ Layouts broken if JavaScript fails to load

**After (Correct Pattern)**:
- ✅ `frontend.js` only handles video backgrounds and clickable containers
- ✅ Layouts applied via inline styles (no JavaScript needed)
- ✅ No FOUC, no resize listeners
- ✅ Progressive enhancement: layouts work without JavaScript
- ✅ **1 KB smaller** frontend bundle

---

### Migration Checklist

When refactoring blocks to use WordPress best practices:

**Edit Component (`edit.js`)**:
- [ ] Import `useInnerBlocksProps` from `@wordpress/block-editor`
- [ ] Remove all `useEffect` hooks with DOM manipulation
- [ ] Calculate styles declaratively in component body
- [ ] Replace plain `<InnerBlocks />` with `<div {...innerBlocksProps} />`
- [ ] Ensure NO wrapper div around inner blocks props
- [ ] Remove `clientId` from function parameters (no longer needed)

**Save Component (`save.js`)**:
- [ ] Import `useInnerBlocksProps` from `@wordpress/block-editor`
- [ ] Calculate same styles as edit.js (must match exactly)
- [ ] Use `useInnerBlocksProps.save()` instead of `<InnerBlocks.Content />`
- [ ] Ensure markup matches edit.js exactly (critical for validation)

**Frontend JavaScript (`frontend.js`)**:
- [ ] Remove layout application functions entirely
- [ ] Remove window resize listeners for layouts
- [ ] Keep only interactive features (video, clickable, etc.)

**Editor CSS (`editor.scss`)**:
- [ ] Remove data-attribute selectors for layouts
- [ ] Remove data-attribute selectors for constraints
- [ ] Keep only editor-specific indicators (video, clickable, etc.)

---

### Testing Checklist

After implementing WordPress best practices:

**Editor Testing**:
- [ ] Editor loads without errors
- [ ] Layouts apply **immediately** (no delay)
- [ ] Switching layouts updates **instantly**
- [ ] Grid columns adjust in editor
- [ ] Width constraint applies in editor
- [ ] Block inserter works correctly
- [ ] No console errors

**Frontend Testing**:
- [ ] Frontend matches editor exactly
- [ ] Layouts work without JavaScript
- [ ] No flash of unstyled content (FOUC)
- [ ] Responsive behavior works correctly

**Validation Testing**:
- [ ] Block validation doesn't fail when editing existing blocks
- [ ] Existing blocks don't break after update
- [ ] No "This block contains unexpected or invalid content" errors

---

### Resources

**Official WordPress Documentation**:
- [Block Wrapper (useBlockProps)](https://developer.wordpress.org/block-editor/getting-started/fundamentals/block-wrapper/)
- [useInnerBlocksProps](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useinnerblocksprops)
- [Block Styles Guide](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/applying-styles-with-stylesheets/)

**Community Resources**:
- [useInnerBlocksProps Tutorial - DLX Plugins](https://dlxplugins.com/tutorials/how-to-use-useinnerblocksprops-in-nested-blocks/)
- [InnerBlocks breaks flexbox/grid - WordPress StackExchange](https://wordpress.stackexchange.com/questions/390696/innerblocks-breaks-flexbox-and-css-grid-styles)

**WordPress Core Block Examples**:
- `core/group` - [GitHub](https://github.com/WordPress/gutenberg/tree/trunk/packages/block-library/src/group)
- `core/columns` - [GitHub](https://github.com/WordPress/gutenberg/tree/trunk/packages/block-library/src/columns)
- `core/cover` - [GitHub](https://github.com/WordPress/gutenberg/tree/trunk/packages/block-library/src/cover)

---

### Golden Rules for WordPress Block Development

1. ✅ **DO** use `useInnerBlocksProps` for all blocks with InnerBlocks
2. ✅ **DO** calculate styles declaratively based on attributes
3. ✅ **DO** apply styles via React props, not DOM manipulation
4. ❌ **DON'T** use `useEffect` for styling (anti-pattern)
5. ❌ **DON'T** use `querySelector` or direct DOM access (anti-pattern)
6. ❌ **DON'T** wrap `<InnerBlocks />` in extra divs (breaks layouts)
7. ✅ **DO** match edit.js and save.js markup exactly (validation)
8. ✅ **DO** test in both editor AND frontend before considering complete

---

## Common Pitfalls

### 1. Forgetting Frontend Imports
**Mistake**: Adding styles to `src/extensions/*/styles.scss` but not importing in `src/styles/style.scss`.

**Result**: Works in editor, broken on frontend.

**Prevention**: Always update both source file AND import file.

### 2. Custom Block Asset Dependencies
**Mistake**: Creating `block.json` for custom block without ensuring build process compiles it.

**Result**: 500 error - WordPress looks for `index.asset.php` that doesn't exist.

**Prevention**: If using custom blocks, verify build output in `build/blocks/*/` directory.

### 3. Assuming CSS Specificity Works
**Mistake**: Expecting your styles to override theme without `!important`.

**Result**: Styles work in isolation but fail with real themes.

**Prevention**: Test with popular themes (Twenty Twenty-Four, etc.), use `!important` when necessary for user-chosen features.

### 4. Not Testing Frontend
**Mistake**: Only testing in block editor, assuming frontend works.

**Result**: Frontend broken, user discovers after deploy.

**Prevention**: ALWAYS test both editor AND frontend before considering feature complete.

### 5. Not Using WordPress Block Hooks
**Mistake**: Using plain `<InnerBlocks />` instead of `useInnerBlocksProps()`.

**Result**:
- Content width constraints don't work
- Layout settings aren't respected
- Grid/flex layouts fail to apply
- Block inserter and appender may not work correctly

**Prevention**:
- **Always** use `useInnerBlocksProps()` in edit components
- **Always** use `useInnerBlocksProps.save()` in save components
- Apply custom classes and styles to the props object, not wrapper divs
- Let WordPress handle block integration - don't manually wire it up

**Example**:
```javascript
// ❌ WRONG
<div style={{ maxWidth: '800px' }}>
  <InnerBlocks />
</div>

// ✅ CORRECT
const innerBlocksProps = useInnerBlocksProps({
  style: { maxWidth: '800px' }
});
<div {...innerBlocksProps} />
```

## Version Control Best Practices

### Commit Messages for This Plugin
Format: `type: description`

Types:
- `feat:` - New feature (clickable groups, overlay)
- `fix:` - Bug fix (500 error, CSS not loading)
- `refactor:` - Code restructure (remove custom blocks)
- `style:` - CSS/SCSS changes
- `docs:` - Documentation updates
- `chore:` - Build, dependencies, cleanup

**Examples**:
```
feat: Add clickable group blocks with link settings
fix: Remove custom block causing 500 error
refactor: Simplify overlay from color picker to toggle
style: Add white text contrast for dark overlay
docs: Update claude.md with accessibility learnings
```

### What to Commit
- Source files (`src/`)
- PHP files (`includes/`, `*.php`)
- Configuration (`package.json`, `block.json`)
- Documentation (`*.md`)

### What NOT to Commit
- Build output (`build/`)
- Dependencies (`node_modules/`)
- WordPress environment (`wp-env/`)
- Logs

## Future Improvements

### Potential Enhancements
1. **Custom breakpoints** - Let users define tablet/mobile breakpoints
2. **Overlay opacity slider** - After CSS variable issue is resolved
3. **Animation presets** - Scroll-triggered animations
4. **Spacing presets** - Common padding/margin combinations
5. **Color scheme generator** - Auto-generate complementary colors

### Technical Debt
1. Migrate from `@import` to `@use`/`@forward` for Sass
2. Add unit tests for frontend JavaScript
3. Add E2E tests for block interactions
4. Optimize CSS bundle size (currently ~4.25 KiB, could be smaller)
5. Add translation support for all strings

## Comprehensive Block Development Best Practices 📚

**Date Added**: October 24, 2025
**Research Scope**: WordPress core patterns, industry leaders (Kadence, GenerateBlocks, Stackable), official documentation

Following the Container block refactoring, we conducted comprehensive research into WordPress block development best practices. This resulted in two essential documentation resources:

### 📖 Documentation Resources

1. **[BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)** (2,537 lines)
   - Complete reference covering 15 major topics
   - Code examples for every pattern
   - Why explanations for each practice
   - Real-world examples from WordPress core

2. **[BEST-PRACTICES-SUMMARY.md](docs/BEST-PRACTICES-SUMMARY.md)** (583 lines)
   - Quick reference for daily development
   - Copy-paste ready code patterns
   - Decision trees for common choices
   - Complete block templates

### 🎯 Top 10 Critical Findings for DesignSetGo

#### 1. Custom Blocks vs Extensions - Decision Matrix

| Criteria | Extension | Custom Block |
|----------|-----------|--------------|
| Complexity | ≤3 controls | Any complexity |
| DOM Changes | None | Restructuring needed |
| State Management | None | React state required |
| Video/Media | ❌ No | ✅ Yes |
| Interactions | Simple CSS | Tabs, accordion, carousel |
| **Recommendation for DesignSetGo** | Rarely | **Default choice** |

**Key Insight**: For unique functionality (Accordion, Tabs, Timeline, Counter), always use **custom blocks**. Extensions are only for simple enhancements to existing blocks.

#### 2. React Hooks - The Golden Rules

**ALWAYS Use:**
```javascript
✅ useBlockProps()           // Block wrapper props
✅ useInnerBlocksProps()     // For nested blocks
✅ useSelect()               // Read from WordPress stores
✅ useDispatch()             // Write to WordPress stores
```

**NEVER Use:**
```javascript
❌ useEffect() for styling   // Timing issues, race conditions
❌ querySelector()           // DOM manipulation anti-pattern
❌ useState() for block data // Use attributes instead
```

#### 3. Attribute Design - Keep It Simple

```javascript
// ✅ GOOD - Flat, typed, with defaults
{
  "columns": { "type": "number", "default": 3 },
  "gap": { "type": "string", "default": "24px" },
  "enableFeature": { "type": "boolean", "default": false }
}

// ❌ BAD - Nested, untyped, no defaults
{
  "settings": { "type": "object", "default": {} }
}
```

**Principles:**
- Flat structure > nested (easier to migrate)
- Always provide defaults
- Use specific types
- Plan for future changes from day one

#### 4. Styling Strategy Matrix

| Scenario | Solution | Example |
|----------|----------|---------|
| User-controlled | Inline styles | `backgroundColor`, `fontSize`, `padding` |
| Responsive | CSS classes + media queries | `.block--mobile`, `.block--tablet` |
| Theme variations | CSS classes | `.block--style-card`, `.block--style-minimal` |
| State indicators | CSS classes | `.is-active`, `.has-overlay`, `.is-expanded` |
| Dynamic calc | CSS custom properties | `--columns: 3; grid-template-columns: repeat(var(--columns), 1fr)` |

#### 5. Performance Budgets

| Metric | Target | Maximum | Consequence if Exceeded |
|--------|--------|---------|------------------------|
| Bundle size per block | < 10 KB | 15 KB | Lazy load |
| Editor JS (all blocks) | < 150 KB | 200 KB | Code split |
| Frontend JS (per block) | < 5 KB | 10 KB | Remove feature or optimize |
| CSS (per block) | < 3 KB | 5 KB | Remove unused styles |

**Optimization Techniques:**
- Code splitting per block
- Conditional loading (only load blocks used on page)
- Tree-shaking (import only what's needed)
- No jQuery (saves 150 KB)

#### 6. Accessibility Non-Negotiables

**Every Block MUST Have:**
- [ ] WCAG 2.1 AA compliance (4.5:1 contrast minimum)
- [ ] Full keyboard navigation (Tab, Enter, Escape, Arrows)
- [ ] ARIA labels for all custom controls
- [ ] Screen reader announcements for state changes
- [ ] Visible focus indicators
- [ ] Semantic HTML (proper heading hierarchy)
- [ ] Required alt text for images
- [ ] Color NOT the only visual indicator

**Test With:**
- axe DevTools browser extension
- Screen reader (VoiceOver/NVDA)
- Keyboard only (no mouse)

#### 7. InnerBlocks Parent-Child Communication

**Use Block Context (Official WordPress Pattern):**

```javascript
// Parent (block.json)
{
  "providesContext": {
    "designsetgo/layout": "layoutType"
  }
}

// Child (block.json)
{
  "usesContext": ["designsetgo/layout"]
}

// Child (edit.js)
export default function Edit({ context }) {
  const parentLayout = context['designsetgo/layout'];
  // Adjust child behavior based on parent
}
```

**Why Block Context?**
- No prop drilling
- Works across nesting levels
- Automatic reactivity
- Official WordPress pattern

#### 8. Security Checklist

**JavaScript (Editor):**
```javascript
// Validate ALL user input
<URLInput
  value={url}
  onChange={(value) => {
    // Validate before saving
    if (value.match(/^https?:\/\//)) {
      setAttributes({ url: value });
    }
  }}
/>
```

**PHP (Render):**
```php
// Escape ALL output
<h2><?php echo esc_html($attributes['title']); ?></h2>
<a href="<?php echo esc_url($attributes['url']); ?>">
  <?php echo esc_html($attributes['text']); ?>
</a>
<div><?php echo wp_kses_post($attributes['content']); ?></div>
```

#### 9. Internationalization Pattern

**Every User-Facing String:**
```javascript
import { __ } from '@wordpress/i18n';

__('Click here', 'designsetgo')                        // Simple
sprintf(__('You have %d items', 'designsetgo'), count) // Placeholder
_n('%d item', '%d items', count, 'designsetgo')        // Plural
```

**Always:**
- Use `'designsetgo'` text domain consistently
- Mark ALL user-facing strings
- Include translator comments for context

#### 10. Block Validation Error Prevention

**Causes:**
- Edit/Save markup mismatch
- Attribute changes without migration
- Missing defaults
- InnerBlocks template changes

**Solution - Always Provide Deprecations:**
```javascript
const deprecated = [
  {
    attributes: {
      oldAttribute: { type: 'string' }
    },
    migrate(attributes) {
      return {
        newAttribute: attributes.oldAttribute
      };
    },
    save(props) {
      // Old save function
    }
  }
];
```

### 🔗 Quick Reference Links

| Task | Document | Section |
|------|----------|---------|
| **Daily Development** | [Best Practices Summary](docs/BEST-PRACTICES-SUMMARY.md) | All |
| **Deep Dives** | [Comprehensive Guide](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) | Table of Contents |
| **Block Template** | [Best Practices Summary](docs/BEST-PRACTICES-SUMMARY.md) | Complete Edit Pattern |
| **Performance** | [Comprehensive Guide](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) | Section 6 |
| **Accessibility** | [Comprehensive Guide](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) | Section 5 |
| **Security** | [Comprehensive Guide](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) | Section 15 |
| **Testing** | [Comprehensive Guide](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md) | Section 11 |

### 💡 Golden Rules

1. **Always use WordPress patterns** - Don't fight the framework
2. **Declarative over imperative** - Calculate styles, don't manipulate DOM
3. **Editor matches frontend exactly** - Prevents validation errors
4. **Performance budgets are sacred** - Measure, optimize, repeat
5. **Accessibility is mandatory** - WCAG 2.1 AA minimum
6. **Security first, always** - Sanitize input, escape output
7. **Test everything** - Unit, E2E, accessibility
8. **Document as you code** - Future you will thank present you

---

## Resources

### Documentation
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Gutenberg Filters Reference](https://developer.wordpress.org/block-editor/reference-guides/filters/)
- [@wordpress/scripts Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Block Supports Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [Theme.json Documentation](https://developer.wordpress.org/themes/global-settings-and-styles/settings/)
- [Block Patterns Documentation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/)

### Tools
- [WordPress Playground](https://playground.wordpress.net/) - Quick testing
- [Block Editor Development Tools](https://wordpress.org/plugins/gutenberg-development-tools/) - Debug blocks
- [Query Monitor](https://wordpress.org/plugins/query-monitor/) - Debug PHP/SQL

### Community
- [WordPress Development Stack Exchange](https://wordpress.stackexchange.com/)
- [Gutenberg GitHub Issues](https://github.com/WordPress/gutenberg/issues)
- [Advanced WordPress Facebook Group](https://www.facebook.com/groups/advancedwp/)

---

**Last Updated**: 2025-10-24
**Plugin Version**: 1.0.0
**WordPress Compatibility**: 6.4+
