# Claude Code Learnings - DesignSetGo Plugin

This document captures key learnings and technical insights from working on the DesignSetGo WordPress plugin.

## Core Principle: Leverage WordPress Defaults

**Philosophy**: Attempt use what WordPress gives you for free before building custom solutions.

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

### Color Controls - CRITICAL PATTERN

**ALWAYS use ColorGradientSettingsDropdown, NEVER use PanelColorSettings**

**Why**:
- `PanelColorSettings` is deprecated and will be removed in future WordPress versions
- `ColorGradientSettingsDropdown` is the modern, WordPress-standard approach
- Places color controls in the **Styles tab** (where users expect them)
- Better integration with theme colors and gradients
- Native clear/reset functionality



**Required Pattern for ALL new blocks**:
```javascript
// 1. Import required components
import {
    InspectorControls,
    // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

// 2. Add clientId to function signature (REQUIRED)
export default function MyBlockEdit({ attributes, setAttributes, clientId }) {

// 3. Add hook to get theme colors
const colorGradientSettings = useMultipleOriginColorsAndGradients();

// 4. Add color controls in Styles tab (group="color")
<InspectorControls group="color">
    <ColorGradientSettingsDropdown
        panelId={clientId}
        title={__('Colors', 'designsetgo')}
        settings={[
            {
                label: __('Text Color', 'designsetgo'),
                colorValue: textColor,
                onColorChange: (color) =>
                    setAttributes({ textColor: color || '' }),
                clearable: true,
            },
            {
                label: __('Background Color', 'designsetgo'),
                colorValue: backgroundColor,
                onColorChange: (color) =>
                    setAttributes({ backgroundColor: color || '' }),
                clearable: true,
            },
        ]}
        {...colorGradientSettings}
    />
</InspectorControls>
```

**For Conditional Color Controls**:
```javascript
// Use when colors should only appear if a feature is enabled
{showArrows && (
    <InspectorControls group="color">
        <ColorGradientSettingsDropdown
            panelId={clientId}
            title={__('Arrow Colors', 'designsetgo')}
            settings={[
                {
                    label: __('Arrow Color', 'designsetgo'),
                    colorValue: arrowColor,
                    onColorChange: (color) =>
                        setAttributes({ arrowColor: color || '' }),
                    clearable: true,
                },
            ]}
            {...colorGradientSettings}
        />
    </InspectorControls>
)}
```

**Key Differences**:
- ❌ OLD: `PanelColorSettings` with `colorSettings` array and `value`/`onChange`
- ✅ NEW: `ColorGradientSettingsDropdown` with `settings` array and `colorValue`/`onColorChange`
- ❌ OLD: Appears in Settings tab
- ✅ NEW: Appears in Styles tab via `group="color"`
- ❌ OLD: Requires `__experimentalHasMultipleOrigins` prop
- ✅ NEW: Uses `{...colorGradientSettings}` spread
- ❌ OLD: Missing `clientId` requirement
- ✅ NEW: Requires `panelId={clientId}`

## Architecture Decisions

### Block Supports Over Custom Controls
**Decision**: Use WordPress Block Supports (color, typography, spacing, border, dimensions) instead of custom InspectorControls wherever possible.

**Why**:
- **Less Code**: Block Supports auto-register attributes and UI controls
- **Better UX**: Users see familiar WordPress controls
- **Theme Integration**: Automatic access to theme.json settings
- **Future-Proof**: WordPress improvements benefit blocks automatically
- **Maintainability**: Fewer custom implementations to maintain

📖 **See [BLOCK-SUPPORTS-AUDIT.md](../docs/BLOCK-SUPPORTS-AUDIT.md) for comprehensive audit results**


**Quick Reference - What to Use**:
```json
// Instead of custom controls, use Block Supports:
{
  "supports": {
    "color": { "text": true, "background": true },           // Not custom ColorPalette
    "typography": { "fontSize": true, "textAlign": true },   // Not custom FontSizePicker/AlignmentToolbar
    "spacing": { "padding": true, "margin": true },          // Not custom spacing controls
    "__experimentalBorder": { "radius": true, "width": true }, // Not custom border controls
    "dimensions": { "minHeight": true }                      // Not custom height controls
  }
}
```

📖 **See [BLOCK-CONTROLS-ORGANIZATION.md](../docs/BLOCK-CONTROLS-ORGANIZATION.md) for detailed patterns**

### Dual Categorization for Maximum Discoverability
**Decision**: Blocks appear in BOTH WordPress core categories AND custom DesignSetGo category.

**Why**:
- **Better Discovery**: Users find blocks in familiar WordPress categories (Design, Text, Widgets)
- **Brand Presence**: All blocks still grouped in DesignSetGo category
- **Best Practice**: Follows patterns from major plugins like CoBlocks

**Implementation**:
```json
// block.json - Use WordPress core category
{
  "category": "design"  // or "text", "widgets", etc.
}
```

```javascript
// src/block-category-filter.js - Register collection for DesignSetGo
wp.blocks.registerBlockCollection('designsetgo', {
  title: 'DesignSetGo',
  icon: 'layout',
});
```

**Category Mapping**:
- **Design**: Container blocks (Flex, Grid, Stack), UI elements (Icon, Pill, Accordion, Tabs, Icon Button)
- **Text**: Content blocks (Icon List)
- **Widgets**: Dynamic blocks (Counter Group, Progress Bar)

**Files**:
- [src/block-category-filter.js](src/block-category-filter.js:1) - Collection registration
- [webpack.config.js](webpack.config.js:51) - Build configuration
- [includes/class-plugin.php](includes/class-plugin.php:129) - Asset enqueuing

### Extension-Only Approach
**Decision**: Use block extensions via filters instead of custom blocks where appropriate.

**Why**:
- Works WITH WordPress's native layout system
- Reduces maintenance burden
- Prevents conflicts with theme and core updates
- Eliminates build complexity

**Implementation**:
- Use `addFilter('blocks.registerBlockType')` to add attributes
- Use `addFilter('editor.BlockEdit')` to add controls
- Use `addFilter('blocks.getSaveContent.extraProps')` to add classes/data attributes

### PHP Filters for Block Modification
**Decision**: Use PHP filters to modify block behavior when CSS isn't reliable.

**Pattern - Disable WordPress Layout Controls**:
```php
public function modify_block_supports( $args, $name ) {
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

**When to Use PHP vs CSS**:
- ✅ **Use PHP** when you want to completely remove/replace WordPress functionality
- ✅ **Use CSS** for styling, hiding non-essential UI elements
- ❌ **Avoid CSS** for hiding functional controls (unreliable)

### Frontend Asset Loading
**Critical Learning**: Frontend styles MUST be explicitly imported.

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
**Critical**: Custom blocks MUST support FSE to work with modern WordPress themes.

📖 **See [FSE-COMPATIBILITY-GUIDE.md](docs/FSE-COMPATIBILITY-GUIDE.md) for complete details**

**Quick Checklist**:
- [ ] Add comprehensive `supports` in block.json
- [ ] Include `example` property for pattern library
- [ ] Use WordPress spacing/color presets (no hardcoded values)
- [ ] Test with Twenty Twenty-Five theme
- [ ] Create block patterns for discoverability

## UI/UX Patterns

### Simplicity Over Flexibility
**Learning**: When a complex feature doesn't work reliably, simplify it.

**Case Study - Overlay Color**:
- **Initial**: Color picker with opacity slider, dynamic CSS variables
- **Problem**: CSS variables weren't being applied reliably
- **Solution**: Boolean toggle with fixed `rgba(0, 0, 0, 0.75)`
- **Result**: Simpler, more reliable, easier to maintain

**Takeaway**: Fixed, well-designed defaults often beat complex customization.

### Accessibility First
Always consider contrast and readability. Force white text when overlay is enabled:
```scss
.has-dsg-overlay {
    color: #ffffff !important;
    h1, h2, h3, h4, h5, h6, p, a, span {
        color: #ffffff !important;
    }
}
```

**Why `!important`**: Accessibility > CSS specificity rules.

### Use WordPress Native Color Controls
Always use `PanelColorSettings` instead of custom color pickers for:
- **Familiar UX**: Users already know WordPress color controls
- **Theme Integration**: Automatically shows theme colors
- **Consistent UI**: Matches WordPress design system

**Pattern - Parent-Child Color Inheritance**:
```javascript
// Parent provides context
"providesContext": {
  "namespace/parentBlock/hoverColor": "hoverColor"
}

// Child receives context
"usesContext": ["namespace/parentBlock/hoverColor"]

// Priority: individual override > parent > theme default
const effectiveColor = hoverColor || parentHoverColor || defaultHoverColor;
```

## Technical Patterns

### Use WordPress Block Hooks
**Critical**: Always use `useInnerBlocksProps()` instead of plain `<InnerBlocks />`.

```javascript
// ❌ WRONG - Manual InnerBlocks component
<div style={{ maxWidth: contentWidth }}>
  <InnerBlocks />
</div>

// ✅ CORRECT - Using useInnerBlocksProps
const innerBlocksProps = useInnerBlocksProps({
  className: 'my-inner-container',
  style: { maxWidth: contentWidth }
});
<div {...innerBlocksProps} />
```

📖 **See [EDITOR-STYLING-GUIDE.md](docs/EDITOR-STYLING-GUIDE.md) for complete styling patterns**

### Clickable Groups Without Interfering with Interactive Elements
```javascript
group.addEventListener('click', function (e) {
    const isInteractive = e.target.tagName === 'A' ||
                         e.target.tagName === 'BUTTON' ||
                         e.target.closest('a') ||
                         e.target.closest('button');

    if (!isInteractive) {
        window.location.href = linkUrl;
    }
});
```

### Security for External Links
Always add `noopener noreferrer` when opening links in new tabs:
```javascript
if (linkTarget === '_blank') {
    const newWindow = window.open(linkUrl, '_blank');
    if (newWindow) {
        newWindow.opener = null;
    }
}
```

### Future-Proof WordPress Components
Add these props to ALL form components to avoid deprecation warnings:

**Affected Components**: `SelectControl`, `RangeControl`, `UnitControl`, `ToggleGroupControl`, `TextControl`

```javascript
<RangeControl
  label={__('My Setting', 'designsetgo')}
  value={myValue}
  onChange={(value) => setAttributes({ myValue: value })}
  __next40pxDefaultSize        // ← Future-proof size
  __nextHasNoMarginBottom      // ← Future-proof margin
/>
```

### Proper Asset Enqueuing for Block Editor
Use `enqueue_block_assets` hook with `is_admin()` guard instead of `enqueue_block_editor_assets`:

```php
// ✅ CORRECT - Works with block editor iframe
add_action('enqueue_block_assets', array($this, 'enqueue_editor_assets'));

public function enqueue_editor_assets() {
    if (!is_admin()) return;
    // Enqueue scripts/styles...
}
```

## WordPress-Specific Learnings

### Block Category Ordering
Make custom category appear first:
```php
public function register_block_category( $categories ) {
    return array_merge(
        array(
            array(
                'slug'  => 'designsetgo',
                'title' => __( 'DesignSetGo', 'designsetgo' ),
            ),
        ),
        $categories
    );
}
```

### Block Variations Cleanup
**Learning**: Fewer, better variations > many mediocre ones.

## Debugging Techniques

### 500 Internal Server Error - Block Assets
**Symptom**: `GET /wp-admin/post.php 500`

**Debug**: Check PHP error logs: `npx wp-env logs`

### CSS Not Applying - Missing Imports
**Debug Process**:
1. Check build: `cat build/style-index.css`
2. Search for class: `grep -i "has-dsg-overlay" build/style-index.css`
3. Check source imports in `src/styles/style.scss`

## Build Process

### When to Rebuild
Always rebuild after changes to SCSS/JS files:
```bash
npx wp-scripts build
```

### Build Output Verification
```bash
ls -lh build/                    # File sizes
cat build/style-index.css       # Frontend styles
cat build/index.css             # Editor styles
```

## File Organization

### Extension Structure
```
src/extensions/group-enhancements/
├── index.js         # Block registration, attributes, controls
├── styles.scss      # Frontend styles
├── editor.scss      # Editor-only styles
└── frontend.js      # Frontend JavaScript
```

### Style Imports
**Critical**: Extensions' styles must be explicitly imported in main style files.

## Code Maintainability

### File Size Limits
**Hard Rule**: No single file should exceed **300 lines** (excluding pure data/constants).

📖 **See [REFACTORING-GUIDE.md](docs/REFACTORING-GUIDE.md) for complete refactoring patterns**

**Quick Pattern**:
```
src/blocks/{block-name}/
├── index.js (40-60 lines)          # Registration only
├── edit.js (100-150 lines)         # Focused edit component
├── save.js                         # Usually already good
├── components/inspector/           # One file per panel
└── utils/                          # Pure functions
```

**Real-World Results**:
- Container: 658 → 349 lines (-47%)
- Counter: 357 → 54 lines (-85%)
- Icon: 350 → 41 lines (-88%)
- **ROI**: 140+ hours/year saved from 6.5 hours invested

## Code Quality

### When to Use `!important`
Avoid `!important` EXCEPT when:
1. **Accessibility requirement** - Must override theme for readability
2. **User expectation** - Explicitly chosen feature should take precedence
3. **WordPress core override** - Need to override core block styles

### Clean Code After Pivots
When making architectural changes:
1. Remove unused code immediately
2. Delete abandoned approaches
3. Clean up imports
4. Update comments to reflect current implementation

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
- [ ] Interactive elements still work
- [ ] No console errors
- [ ] Build completes without errors

## User Feedback Patterns

### When User Says "It's Not Working"
1. Ask for specifics: Editor or frontend?
2. Get console output: JavaScript/network errors?
3. Check build: Did changes compile?
4. Verify deployment: Changes copied to environment?

### Simplification Triggers
User phrases that signal need to simplify:
- "This isn't working"
- "Let's just..."
- "Can we make it simpler?"

**Response**: Immediately pivot to simpler solution.

## Preventing Unintended Side Effects

As the plugin grows, changes can have ripple effects. Follow these protocols to prevent breaking existing functionality.

### Impact Analysis Protocol (MANDATORY Before ANY Change)

**STOP and answer these questions BEFORE making ANY code change**:

1. **What am I changing?**
   - [ ] Shared utility/component? → Audit all usage locations
   - [ ] Global CSS/SCSS? → Check all blocks that might be affected
   - [ ] Extension filter? → Verify block name targeting is specific
   - [ ] Block attribute? → Create deprecation for existing content
   - [ ] PHP class/function? → Search for all calls

2. **Who uses this code?**
   ```bash
   # Find all usages before changing anything
   grep -r "functionName" src/
   grep -r "className" src/
   grep -r "import.*from.*filepath" src/
   ```

3. **What blocks could be affected?**
   - Direct: Blocks that import/use this code
   - Indirect: Blocks that inherit styles or behavior
   - Extensions: Filters that target multiple blocks

**Required Actions Before Committing**:
```bash
# 1. Search for all usages
grep -r "ComponentName\|functionName" src/

# 2. Test ALL affected blocks (see Cross-Block Testing below)

# 3. Build and verify no new errors
npm run build

# 4. Check for console errors in editor AND frontend
```

### Shared Code Modification Rules

**Rule 1: Shared Utilities Are Sacred**

When modifying shared code in:
- `src/utils/`
- `src/components/` (shared components)
- `src/styles/` (global styles)
- `src/extensions/` (extensions affecting core blocks)

**MANDATORY Process**:
1. **Document all current usages**
   ```bash
   # Create usage map before changes
   echo "Usages of [component/function]:" > /tmp/usage-map.txt
   grep -rn "importName" src/ >> /tmp/usage-map.txt
   ```

2. **Test EVERY usage location**
   - Open EACH block that uses it
   - Test in editor
   - Test on frontend
   - Document results

3. **Consider creating new version instead of modifying**
   ```javascript
   // Instead of modifying existing:
   export function getSpacing(value) { ... }

   // Add new version and deprecate old:
   export function getSpacingV2(value) { ... }
   export const getSpacing = getSpacingV2; // Backward compat
   ```

**Rule 2: Global CSS Requires Extra Caution**

Files that affect multiple blocks:
- `src/styles/style.scss` (frontend global)
- `src/styles/editor.scss` (editor global)
- `src/styles/_variables.scss` (shared variables)

**MANDATORY Before Editing Global Styles**:
```bash
# 1. List all blocks for testing
ls src/blocks/

# 2. Test these scenarios for EACH block:
# - Default state
# - With custom colors
# - With spacing controls
# - With border/shadow
# - In container blocks (nested)
# - Responsive behavior
```

**Safe Global CSS Pattern**:
```scss
// ❌ DANGEROUS - Could affect any block
.wp-block {
  margin: 0;
}

// ✅ SAFE - Scoped to plugin blocks only
.wp-block[class*="wp-block-designsetgo-"] {
  // Safe to apply to all DesignSetGo blocks
}

// ✅ SAFEST - Specific to one block
.wp-block-designsetgo-stack {
  // Only affects Stack block
}
```

**Rule 3: Extension Filters Must Be Specific**

When using `addFilter()`:

```javascript
// ❌ DANGEROUS - Affects ALL blocks
addFilter('blocks.registerBlockType', 'designsetgo/add-feature', (settings) => {
  settings.attributes.myAttribute = { type: 'string' };
  return settings;
});

// ✅ SAFE - Only affects specific blocks
addFilter('blocks.registerBlockType', 'designsetgo/add-feature', (settings, name) => {
  // Explicit allowlist
  const allowedBlocks = [
    'core/group',
    'core/cover',
  ];

  if (!allowedBlocks.includes(name)) {
    return settings;
  }

  settings.attributes.myAttribute = { type: 'string' };
  return settings;
});
```

### Cross-Block Testing Checklist

**REQUIRED: Test these blocks after ANY change to shared code**:

**Container Blocks** (most likely to be affected by layout/spacing changes):
- [ ] Stack (`src/blocks/stack/`)
- [ ] Flex (`src/blocks/flex/`)
- [ ] Grid (`src/blocks/grid/`)

**Interactive Blocks** (sensitive to JS changes):
- [ ] Accordion (`src/blocks/accordion/`)
- [ ] Tabs (`src/blocks/tabs/`)
- [ ] Counter Group (`src/blocks/counter-group/`)

**Styled Blocks** (sensitive to CSS changes):
- [ ] Icon (`src/blocks/icon/`)
- [ ] Icon Button (`src/blocks/icon-button/`)
- [ ] Pill (`src/blocks/pill/`)
- [ ] Progress Bar (`src/blocks/progress-bar/`)

**List Blocks** (sensitive to spacing/layout):
- [ ] Icon List (`src/blocks/icon-list/`)

**Testing Protocol Per Block**:
1. **Editor Test**
   - Insert block with default settings
   - Modify all available controls
   - Check inspector controls appear correctly
   - Verify no console errors
   - Check block toolbar

2. **Frontend Test**
   - Save and view on frontend
   - Verify styles match editor
   - Test responsive breakpoints
   - Check browser console for errors

3. **Integration Test**
   - Nest inside container blocks
   - Place next to other blocks
   - Test with theme variations (Twenty Twenty-Five)

### CSS Specificity Management

**Problem**: Changes to one block's CSS can affect others due to specificity conflicts.

**Solution**: Use WordPress :where() pattern for low specificity.

**Pattern for Block Styles**:
```scss
// ❌ HIGH SPECIFICITY - Can conflict with theme/other blocks
.wp-block-designsetgo-stack.has-custom-layout {
  display: flex;
}

// ✅ LOW SPECIFICITY - Easy to override, no conflicts
:where(.wp-block-designsetgo-stack.has-custom-layout) {
  display: flex;
}

// ✅ MODERATE SPECIFICITY - For overriding WordPress defaults
.wp-block-designsetgo-stack {
  &.has-custom-layout {
    display: flex;
  }
}
```

**Specificity Testing**:
```bash
# After CSS changes, test specificity doesn't break overrides
# 1. Add custom CSS via theme
# 2. Verify custom CSS can override block styles
# 3. Check no !important needed for simple overrides
```

### JavaScript Scope Management

**Problem**: Global variables/event listeners can conflict between blocks.

**Solution**: Namespace everything and use block-specific selectors.

**Pattern for Frontend JavaScript**:
```javascript
// ❌ DANGEROUS - Could affect other blocks
document.querySelectorAll('.accordion').forEach(accordion => {
  // ...
});

// ✅ SAFE - Block-specific class
document.querySelectorAll('.wp-block-designsetgo-accordion').forEach(accordion => {
  // ...
});

// ✅ SAFEST - Data attributes for behavior
document.querySelectorAll('[data-dsg-accordion]').forEach(accordion => {
  // ...
});
```

**Event Delegation Pattern**:
```javascript
// ❌ BAD - Multiple listeners
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handler);
});

// ✅ GOOD - Single delegated listener
document.addEventListener('click', (e) => {
  const item = e.target.closest('[data-dsg-accordion-item]');
  if (!item) return;
  handler(item);
});
```

### Block Deprecation Strategy

**CRITICAL**: Never change attribute schema without creating a deprecation.

**When Deprecation Is Required**:
- Changing attribute name
- Changing attribute type
- Changing attribute default value (if it affects saved content)
- Changing block structure (HTML markup)
- Removing an attribute

**Deprecation Pattern**:
```javascript
// src/blocks/my-block/deprecated.js
const v1 = {
  attributes: {
    // OLD attribute schema
    oldAttributeName: {
      type: 'string',
      default: 'old default',
    },
  },
  save: ({ attributes }) => {
    // OLD save function
  },
  migrate: (attributes) => {
    // Transform old attributes to new schema
    return {
      ...attributes,
      newAttributeName: attributes.oldAttributeName,
    };
  },
};

export default [v1]; // Array of deprecations, newest first
```

**Testing Deprecations**:
1. Create block with OLD version
2. Save post
3. Apply code changes with deprecation
4. Reload editor
5. Verify block loads without validation error
6. Verify migration works correctly

### Style Import Dependencies

**Problem**: Forgetting to import extension/component styles breaks frontend.

**Solution**: Mandatory import checklist.

**MANDATORY After Adding Any SCSS File**:

1. **Frontend Styles**:
   ```scss
   // src/styles/style.scss
   @import '../blocks/my-block/style';
   @import '../extensions/my-extension/styles';
   ```

2. **Editor Styles**:
   ```scss
   // src/styles/editor.scss
   @import '../blocks/my-block/editor';
   @import '../extensions/my-extension/editor';
   ```

3. **Verification**:
   ```bash
   # Build
   npm run build

   # Verify styles compiled
   grep -i "my-new-class" build/style-index.css
   grep -i "my-new-class" build/index.css

   # If missing, check imports above
   ```

### Pre-Commit Checklist

**MANDATORY before every commit**:

```bash
# 1. Build succeeds
npm run build
# Must complete without errors

# 2. No console errors
# Open browser console in:
# - Block editor
# - Frontend
# Look for errors, warnings

# 3. Changed blocks still work
# Test EVERY block you modified:
# - Insert in editor
# - Modify settings
# - Save and view frontend
# - Check in Twenty Twenty-Five theme

# 4. Related blocks still work
# If you changed shared code, test ALL blocks that use it
# See "Cross-Block Testing Checklist" above

# 5. Both editor and frontend tested
# - Editor: Create/edit blocks
# - Frontend: View published page
# - Must match exactly

# 6. Responsive works
# - Mobile (375px)
# - Tablet (768px)
# - Desktop (1200px+)

# 7. Git status clean
git status
# No unexpected changes
# No build files committed
```

### Emergency Rollback Procedure

If a change causes widespread issues:

```bash
# 1. Identify the commit
git log --oneline -10

# 2. Create revert commit (safe, preserves history)
git revert <commit-hash>

# 3. Or reset to previous commit (destructive)
git reset --hard <commit-hash>

# 4. Rebuild
npm run build

# 5. Test critical blocks
# - Stack, Flex, Grid
# - Any block user reported broken

# 6. Push fix
git push origin main
```

### Monitoring for Issues

**After Deploying Changes**:

1. **Check Error Logs**:
   ```bash
   # PHP errors
   npx wp-env logs

   # JavaScript errors (check browser console)
   ```

2. **Test User Workflows**:
   - Create new post
   - Insert various blocks
   - Modify block settings
   - Save and publish
   - View on frontend

3. **Validate Existing Content**:
   - Open existing posts with blocks
   - Verify no validation errors
   - Check blocks render correctly
   - Test block editing still works

### Documentation Requirements

**When changing shared code, UPDATE**:

1. **This File (claude.md)**
   - Add new patterns learned
   - Document breaking changes
   - Update examples

2. **Inline Code Comments**:
   ```javascript
   /**
    * SHARED COMPONENT - Used by: Stack, Flex, Grid
    * Breaking changes require deprecations in all consumers
    *
    * @param {Object} props - Component props
    * @return {JSX.Element} - Rendered component
    */
   ```

3. **CHANGELOG.md** (if exists):
   - Document breaking changes
   - List affected blocks
   - Provide migration guide

## Common Pitfalls

### 1. Forgetting Frontend Imports
**Mistake**: Adding styles but not importing in `src/styles/style.scss`
**Result**: Works in editor, broken on frontend
**Prevention**: Always update both source file AND import file

### 2. Only Updating style.scss Without editor.scss (or Vice Versa)
**Mistake**: Making styling changes to one file but not the other
**Result**: Different appearance in editor vs frontend
**Prevention**:
- **ALWAYS edit BOTH files** for visual styles
- Use comment: `// CRITICAL: Must be duplicated from style.scss for editor/frontend parity`
- Test in both editor AND frontend

### 3. Not Using WordPress Block Hooks
**Mistake**: Using plain `<InnerBlocks />` instead of `useInnerBlocksProps()`
**Result**: Layouts don't work correctly
**Prevention**: Always use `useInnerBlocksProps()` in edit/save components

### 4. Custom Width/Sizing Rules Breaking Alignfull
**Mistake**: Adding custom `width: 100%` or `box-sizing: border-box` to alignfull blocks
**Result**: Blocks don't extend edge-to-edge
**Prevention**: Let WordPress handle sizing natively
**Fix**: Remove custom width/sizing rules

### 5. Not Testing Frontend
**Mistake**: Only testing in block editor
**Result**: Frontend broken after deploy
**Prevention**: ALWAYS test both editor AND frontend

### 6. Missing Default Block Spacing in Dynamic Blocks
**Mistake**: Not setting default `blockGap` in block.json attributes for dynamic blocks
**Result**: Block spacing appears in editor but not on frontend (gap is basically 0)
**Why**: Block.json defaults aren't automatically applied during server-side rendering
**Prevention**:
- Add default blockGap to `attributes` in block.json:
  ```json
  "style": {
    "type": "object",
    "default": {
      "spacing": {
        "blockGap": "var(--wp--preset--spacing--50)"
      }
    }
  }
  ```
- Always provide fallback in render.php:
  ```php
  $final_gap = ! empty( $block_gap ) ? $block_gap : 'var(--wp--preset--spacing--50)';
  $inner_styles['gap'] = $final_gap;
  ```

### 7. Modifying Shared Utilities Without Testing All Consumers
**Mistake**: Changing a shared utility function/component and only testing one block
**Result**: Other blocks using the same utility break unexpectedly
**Prevention**:
- Before modifying shared code, search for ALL usages: `grep -r "functionName" src/`
- Test EVERY block that imports the shared code
- Consider creating a new version instead of modifying existing
**Example**:
```bash
# Before changing src/utils/spacing.js:
grep -r "spacing" src/blocks/
# Found in: stack, flex, grid, accordion
# Must test all 4 blocks after changes
```

### 8. Global CSS Selector Too Broad
**Mistake**: Using broad CSS selectors that affect unintended blocks
**Result**: Styling meant for one block affects multiple blocks
**Prevention**:
- Always scope to block-specific classes: `.wp-block-designsetgo-stack`
- Use `:where()` for low specificity
- Test affected blocks after global CSS changes
**Example**:
```scss
// ❌ TOO BROAD - Affects all blocks
.wp-block {
  margin: 0;
}

// ✅ SCOPED - Only affects DesignSetGo blocks
.wp-block[class*="wp-block-designsetgo-"] {
  margin: 0;
}
```

### 9. Extension Filter Without Block Name Check
**Mistake**: Using `addFilter()` without checking block name
**Result**: Filter affects ALL blocks, including core blocks and other plugins
**Prevention**:
- Always include explicit allowlist in filter callback
- Check `name` parameter before modifying settings
**Example**:
```javascript
// ❌ AFFECTS ALL BLOCKS
addFilter('blocks.registerBlockType', 'dsg/filter', (settings) => {
  settings.attributes.newAttr = { type: 'string' };
  return settings;
});

// ✅ ONLY AFFECTS INTENDED BLOCKS
addFilter('blocks.registerBlockType', 'dsg/filter', (settings, name) => {
  if (name !== 'core/group') return settings;
  settings.attributes.newAttr = { type: 'string' };
  return settings;
});
```

### 10. Changing Attribute Schema Without Deprecation
**Mistake**: Modifying block attributes without creating a deprecation
**Result**: Existing blocks show validation errors, content may be lost
**Prevention**:
- ALWAYS create deprecation when changing attributes
- Test with existing content before and after changes
- Document migration path
**Example**:
```javascript
// If changing from:
attributes: { color: { type: 'string' } }
// To:
attributes: { textColor: { type: 'string' } }

// MUST create src/blocks/my-block/deprecated.js:
const v1 = {
  attributes: { color: { type: 'string' } },
  save: OldSaveFunction,
  migrate: (attrs) => ({ textColor: attrs.color })
};
export default [v1];
```

## Version Control Best Practices

### Commit Messages
Format: `type: description`

Types: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`

**Examples**:
```
feat: Add clickable group blocks with link settings
fix: Remove custom block causing 500 error
refactor: Simplify overlay from color picker to toggle
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

## Future Improvements

### Potential Enhancements
1. Custom breakpoints for responsive controls
2. Overlay opacity slider
3. Animation presets (scroll-triggered)
4. Spacing presets
5. Color scheme generator

### Technical Debt
1. Migrate from `@import` to `@use`/`@forward` for Sass
2. Add unit tests for frontend JavaScript
3. Add E2E tests for block interactions
4. Optimize CSS bundle size
5. Add translation support for all strings

## Comprehensive Block Development Resources

Following the Container block refactoring, we conducted comprehensive research into WordPress block development best practices.

### 📖 Documentation Resources

1. **[BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](docs/BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)** (2,537 lines)
   - Complete reference covering 15 major topics
   - Code examples for every pattern
   - Real-world examples from WordPress core

2. **[BEST-PRACTICES-SUMMARY.md](docs/BEST-PRACTICES-SUMMARY.md)** (583 lines)
   - Quick reference for daily development
   - Copy-paste ready code patterns
   - Complete block templates

3. **[FSE-COMPATIBILITY-GUIDE.md](docs/FSE-COMPATIBILITY-GUIDE.md)**
   - Full Site Editing support requirements
   - Block.json configuration
   - Testing checklist

4. **[REFACTORING-GUIDE.md](docs/REFACTORING-GUIDE.md)**
   - File structure patterns
   - Step-by-step refactoring process
   - Real-world examples with ROI

5. **[EDITOR-STYLING-GUIDE.md](docs/EDITOR-STYLING-GUIDE.md)**
   - Declarative styling patterns
   - useInnerBlocksProps usage
   - :where() specificity patterns

### 🎯 Top 10 Critical Principles

1. **Custom Blocks vs Extensions**: Use custom blocks for unique functionality, extensions for simple enhancements
2. **React Hooks**: Always use `useBlockProps()`, `useInnerBlocksProps()`, never `useEffect()` for styling
3. **Attribute Design**: Flat structure, typed, with defaults
4. **Styling Strategy**: Inline styles for user values, CSS classes for static patterns
5. **Performance**: Bundle size budgets (10KB per block max)
6. **Accessibility**: WCAG 2.1 AA compliance mandatory
7. **Parent-Child Communication**: Use block context (providesContext/usesContext)
8. **Security**: Validate input, escape output always
9. **Internationalization**: Use `__()` for all user-facing strings
10. **Block Validation**: Provide deprecations for attribute changes

### 💡 Golden Rules

1. **Always use WordPress patterns** - Don't fight the framework
2. **Declarative over imperative** - Calculate styles, don't manipulate DOM
3. **Editor matches frontend exactly** - Prevents validation errors
4. **Performance budgets are sacred** - Measure, optimize, repeat
5. **Accessibility is mandatory** - WCAG 2.1 AA minimum
6. **Security first, always** - Sanitize input, escape output
7. **Test everything** - Unit, E2E, accessibility
8. **Document as you code** - Future you will thank present you

## Resources

### Documentation
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Gutenberg Filters Reference](https://developer.wordpress.org/block-editor/reference-guides/filters/)
- [@wordpress/scripts Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Block Supports Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [Theme.json Documentation](https://developer.wordpress.org/themes/global-settings-and-styles/settings/)

### Tools
- [WordPress Playground](https://playground.wordpress.net/)
- [Block Editor Development Tools](https://wordpress.org/plugins/gutenberg-development-tools/)
- [Query Monitor](https://wordpress.org/plugins/query-monitor/)

### Community
- [WordPress Development Stack Exchange](https://wordpress.stackexchange.com/)
- [Gutenberg GitHub Issues](https://github.com/WordPress/gutenberg/issues)
- [Advanced WordPress Facebook Group](https://www.facebook.com/groups/advancedwp/)

---

**Last Updated**: 2025-11-09
**Plugin Version**: 1.0.0
**WordPress Compatibility**: 6.4+
