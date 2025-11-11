# Width and Layout Patterns - DesignSetGo Plugin

**Purpose**: Prevent conflicts with nested items when handling width, contentSize, and layout across blocks.

**Last Updated**: 2025-11-11
**Status**: 🔴 Multiple conflicts identified - requires refactoring

---

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [Current Patterns](#current-patterns)
3. [Known Conflicts](#known-conflicts)
4. [Best Practices](#best-practices)
5. [Migration Guide](#migration-guide)

---

## Core Architecture

### The Two-Div Pattern

**All container blocks use this structure:**

```jsx
<div className="dsg-{block}">        // Outer wrapper (full-width, alignfull)
  <div className="dsg-{block}__inner"> // Inner container (constrained width)
    <InnerBlocks />                   // Children
  </div>
</div>
```

**Why?**
- **Outer div**: Handles full-width backgrounds, borders, padding
- **Inner div**: Handles content width constraints (max-width, auto margins)
- **Separation**: Background effects can be full-width while content is constrained

**Implementation:**
- [Section](../src/blocks/section/save.js) (lines 68-70)
- [Row](../src/blocks/row/save.js) (lines 117-120)
- [Grid](../src/blocks/grid/save.js) (lines 79-81)

---

## Current Patterns

### 1. Width Constraint Attributes

**Standard Pattern (block.json):**

```json
{
  "attributes": {
    "constrainWidth": {
      "type": "boolean",
      "default": true  // OR false, depends on block purpose
    },
    "contentWidth": {
      "type": "string",
      "default": ""
    }
  },
  "supports": {
    "align": ["wide", "full"]
  }
}
```

**Current Defaults:**

| Block | `constrainWidth` Default | Rationale |
|-------|-------------------------|-----------|
| Section | `true` | Content sections should constrain by default |
| Row | `false` | Full-width layouts more common |
| Grid | `false` | Full-width layouts more common |

**Implementation:**
- [Section block.json](../src/blocks/section/block.json) (lines 82-89)
- [Row block.json](../src/blocks/row/block.json) (lines 85-92)
- [Grid block.json](../src/blocks/grid/block.json) (lines 138-145)

---

### 2. Using WordPress Theme Settings

**All container blocks retrieve theme contentSize:**

```javascript
import { useSettings } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
    const [themeContentSize] = useSettings('layout.contentSize');
    const { constrainWidth, contentWidth } = attributes;

    // Editor preview
    const innerStyle = {};
    if (constrainWidth) {
        const effectiveWidth = contentWidth || themeContentSize;
        if (effectiveWidth) {
            innerStyle.maxWidth = effectiveWidth;
            innerStyle.marginLeft = 'auto';
            innerStyle.marginRight = 'auto';
        }
    }

    return (
        <div {...blockProps}>
            <div className="dsg-block__inner" style={innerStyle}>
                {/* children */}
            </div>
        </div>
    );
}
```

**Frontend (save.js):**

```javascript
const innerStyle = {};
if (constrainWidth) {
    innerStyle.maxWidth = contentWidth || 'var(--wp--style--global--content-size, 1140px)';
    innerStyle.marginLeft = 'auto';
    innerStyle.marginRight = 'auto';
}
```

**⚠️ Note the difference:**
- **Editor**: Uses actual theme value from `useSettings` (e.g., "1200px")
- **Frontend**: Uses CSS variable with fallback (e.g., "var(--wp--style--global--content-size, 1140px)")

**Implementation:**
- [Section edit.js](../src/blocks/section/edit.js) (line 86, 169-176)
- [Section save.js](../src/blocks/section/save.js) (lines 54-59)

---

### 3. Alignment Support

**CSS Pattern for Alignment Classes:**

```scss
.dsg-block {
    &.alignfull {
        max-width: none;
        width: 100%;
        margin-left: 0;
        margin-right: 0;
    }

    &.alignwide {
        max-width: var(--wp--custom--layout--wide-size, 1200px);
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    }
}
```

**Implementation:**
- [Grid style.scss](../src/blocks/grid/style.scss) (lines 36-48)

---

### 4. Nested Container Handling

**Critical Pattern: Force full-width for nested containers**

```scss
.dsg-section {
    // When this block is inside another container's inner div
    .dsg-stack__inner > &,
    .dsg-flex__inner > &,
    .dsg-grid__inner > & {
        width: 100% !important;

        // And force its own inner to be unconstrained
        .dsg-section__inner {
            max-width: none !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
    }
}
```

**Why?**
When containers nest, the inner container should:
1. Take full width of its parent's constrained area
2. Ignore its own width constraints
3. Let its parent handle the width constraint

**Implementation:**
- [Section style.scss](../src/blocks/section/style.scss) (lines 25-35)
- [Row style.scss](../src/blocks/row/style.scss) (lines 29-39)
- [Grid style.scss](../src/blocks/grid/style.scss) (lines 86-96)

---

### 5. WordPress Layout System Integration

**Different Blocks, Different Approaches:**

#### Section - Flex Layout (Vertical)

```json
{
  "layout": {
    "allowSwitching": false,
    "allowInheriting": false,
    "allowEditing": true,
    "allowSizingOnChildren": true,
    "default": {
      "type": "flex",
      "orientation": "vertical",
      "justifyContent": "center"
    }
  }
}
```

#### Row - Flex Layout (Horizontal)

```json
{
  "layout": {
    "allowSwitching": false,
    "allowInheriting": false,
    "allowEditing": true,
    "allowSizingOnChildren": true,
    "allowVerticalAlignment": true,
    "default": {
      "type": "flex",
      "orientation": "horizontal",
      "justifyContent": "left",
      "flexWrap": "wrap"
    }
  }
}
```

**⚠️ But Row manually implements flex in save.js (Issue #2)**

#### Grid - Constrained Layout

```json
{
  "layout": {
    "allowSwitching": false,
    "allowInheriting": false,
    "allowEditing": false,
    "allowSizingOnChildren": true,
    "allowContentEditing": false,
    "default": {
      "type": "constrained"
    }
  }
}
```

**⚠️ But Grid manually implements grid in save.js**

**Implementation:**
- [Section block.json](../src/blocks/section/block.json) (lines 16-26)
- [Row block.json](../src/blocks/row/block.json) (lines 16-28)
- [Grid block.json](../src/blocks/grid/block.json) (lines 16-25)

---

## Known Conflicts

### 🔴 Issue #1: Missing `dsg-no-width-constraint` Class

**Problem:** CSS references a class that's never applied.

**History:**
- **Deprecated version**: Applied `dsg-no-width-constraint` when `constrainWidth: false`
  - [section/deprecated.js](../src/blocks/section/deprecated.js) (lines 52-57)
- **Current version**: Only uses base class `dsg-stack`
  - [section/save.js](../src/blocks/section/save.js) (line 30)

**CSS Still Expects It:**

```scss
// This selector never matches!
.dsg-stack.alignfull.dsg-no-width-constraint > .dsg-stack__inner[class*="wp-container-"] {
    > :not(.alignleft):not(.alignright) {
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
}
```

**Impact:** When `constrainWidth: false`, children still get WordPress's default max-width constraint instead of being truly full-width.

**Location:** [section/style.scss](../src/blocks/section/style.scss) (lines 148-156)

**Fix Required:**
```javascript
// In save.js
const className = [
    'dsg-stack',
    !constrainWidth && 'dsg-no-width-constraint',
].filter(Boolean).join(' ');
```

---

### 🔴 Issue #2: Row Block Manual Flex Implementation

**Problem:** Row duplicates WordPress's flex layout system.

**Current Implementation:**

```javascript
// row/save.js lines 79-99
const rawGapValue = attributes.style?.spacing?.blockGap;
const gapValue = convertPresetToCSSVar(rawGapValue);

if (blockProps.style?.gap) {
    delete blockProps.style.gap;  // Remove WordPress's gap
}

const innerStyle = {
    display: 'flex',                              // Manual
    justifyContent: layout?.justifyContent || 'left',  // Manual
    flexWrap: layout?.flexWrap || 'wrap',         // Manual
    ...(gapValue && { gap: gapValue }),           // Manual conversion
};
```

**Why It's Problematic:**
1. Duplicates WordPress functionality
2. Requires manual preset-to-CSS-var conversion
3. Different from Section (which uses WordPress layout classes)
4. More maintenance overhead
5. May break when WordPress updates its layout system

**Location:** [row/save.js](../src/blocks/row/save.js) (lines 79-99)

**Should Be:**
Let WordPress handle flex via layout classes (like Section does).

---

### 🔴 Issue #3: Grid Block Hard-coded Gaps

**Problem:** Hard-coded spacing preset instead of respecting WordPress blockGap.

```javascript
// grid/save.js
const innerStyles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
    alignItems: alignItems || 'start',
    rowGap: rowGap || 'var(--wp--preset--spacing--50)',    // ❌ Hard-coded
    columnGap: columnGap || 'var(--wp--preset--spacing--50)', // ❌ Hard-coded
};
```

**Should Use:**
```javascript
const blockGap = attributes.style?.spacing?.blockGap || 'var(--wp--preset--spacing--50)';
rowGap: rowGap || blockGap,
columnGap: columnGap || blockGap,
```

**Location:** [grid/save.js](../src/blocks/grid/save.js) (lines 55-61)

---

### 🔴 Issue #4: Extension Duplicates Native Attributes

**Problem:** Max-width extension adds attributes that blocks already have.

**Extension Code:**

```javascript
// extensions/max-width/index.js lines 54-75
const isContainerBlock = [
    'designsetgo/section',
    'designsetgo/row',
    'designsetgo/grid',
].includes(name);

if (isContainerBlock) {
    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            constrainWidth: {      // ❌ Already in block.json
                type: 'boolean',
                default: true,
            },
            contentWidth: {        // ❌ Already in block.json
                type: 'string',
                default: '',
            },
        },
    };
}
```

**Result:** Duplicate controls in two places:
1. Native panel from block's own code (Section Settings, Row Settings, Grid Settings)
2. Extension-created "Width" panel

**Location:** [extensions/max-width/index.js](../src/extensions/max-width/index.js) (lines 54-203)

**Fix Required:** Remove extension entirely or refactor to only add controls to blocks that DON'T have them (e.g., Accordion, Tabs).

---

### 🔴 Issue #5: Editor/Frontend Parity

**Problem:** Different contentSize sources in editor vs frontend.

**Editor:**
```javascript
const [themeContentSize] = useSettings('layout.contentSize'); // Actual value: "1200px"
innerStyle.maxWidth = contentWidth || themeContentSize;       // Uses: "1200px"
```

**Frontend:**
```javascript
innerStyle.maxWidth = contentWidth || 'var(--wp--style--global--content-size, 1140px)';
// Uses CSS var (might not be set) with different fallback
```

**Impact:**
- Theme sets contentSize to "800px"
- Editor shows 800px width
- Frontend might show 1140px if CSS variable isn't available

**Fix Required:** Use consistent approach or ensure CSS variable is always available.

---

### 🟡 Issue #6: Accordion/Tabs Lack Width Controls

**Current State:**

**Accordion & Tabs:**
- No `constrainWidth` attribute
- No `contentWidth` attribute
- No width controls in inspector
- Always 100% width

**Inconsistency:** Container blocks have width controls, but Accordion/Tabs (which also contain content) don't.

**Is This a Problem?**
- Maybe not - they might intentionally always be full-width
- But users might want to constrain tab panels or accordion content

**Files:**
- [accordion/edit.js](../src/blocks/accordion/edit.js)
- [accordion/style.scss](../src/blocks/accordion/style.scss) (line 18: `width: 100%;`)
- [tabs/edit.js](../src/blocks/tabs/edit.js)
- [tabs/style.scss](../src/blocks/tabs/style.scss) (line 21: `width: 100%;`)

---

### 🟡 Issue #7: CSS Specificity Wars

**Problem:** Fighting WordPress's generated classes with !important.

**WordPress Generates:**
```css
.wp-container-designsetgo-stack-is-layout-abc123 > :where(:not(.alignleft):not(.alignright):not(.alignfull)) {
    max-width: 1200px;
}
```

**Plugin Fights Back:**
```scss
.dsg-stack.alignfull.dsg-no-width-constraint > .dsg-stack__inner[class*="wp-container-"] {
    > :not(.alignleft):not(.alignright) {
        max-width: none !important;  // ⚔️ Specificity war
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
}
```

**Better Approach:** Work with WordPress's system instead of against it.

**Location:** [section/style.scss](../src/blocks/section/style.scss) (lines 148-156)

---

## Best Practices

### ✅ DO: Use the Two-Div Pattern

```jsx
// ✅ GOOD
<div {...useBlockProps({ className: 'dsg-block' })}>
  <div className="dsg-block__inner" style={innerStyle}>
    {children}
  </div>
</div>
```

```jsx
// ❌ BAD - Single div can't separate background from content width
<div {...useBlockProps({ className: 'dsg-block', style: innerStyle })}>
  {children}
</div>
```

---

### ✅ DO: Let WordPress Handle Layouts

```json
// ✅ GOOD - Use WordPress layout system
{
  "layout": {
    "type": "flex",
    "orientation": "vertical"
  }
}
```

```javascript
// ❌ BAD - Manual implementation
const innerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};
```

**Why?**
- WordPress handles responsive behavior
- Automatic gap support
- Theme integration
- Less code to maintain

---

### ✅ DO: Use WordPress Settings

```javascript
// ✅ GOOD
const [themeContentSize] = useSettings('layout.contentSize');
const effectiveWidth = contentWidth || themeContentSize;
```

```javascript
// ❌ BAD - Hard-coded fallback
const effectiveWidth = contentWidth || '1140px';
```

---

### ✅ DO: Handle Nesting Explicitly

```scss
// ✅ GOOD - Explicit nesting rules
.dsg-my-block {
    // When nested inside other containers
    .dsg-stack__inner > &,
    .dsg-flex__inner > &,
    .dsg-grid__inner > & {
        width: 100% !important;

        .dsg-my-block__inner {
            max-width: none !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
    }
}
```

---

### ✅ DO: Use CSS Variables with Fallbacks

```javascript
// ✅ GOOD - Frontend
innerStyle.maxWidth = contentWidth || 'var(--wp--style--global--content-size, 1140px)';
```

```javascript
// ❌ BAD - No fallback
innerStyle.maxWidth = 'var(--wp--style--global--content-size)';
```

---

### ✅ DO: Apply Conditional Classes

```javascript
// ✅ GOOD - Apply classes based on attributes
const className = [
    'dsg-block',
    !constrainWidth && 'dsg-no-width-constraint',
    isNested && 'dsg-nested',
].filter(Boolean).join(' ');
```

**Why?** CSS can target specific states without !important wars.

---

### ❌ DON'T: Create Duplicate Attributes via Extensions

```javascript
// ❌ BAD - Extension adds attributes that block already has
addFilter('blocks.registerBlockType', 'dsg/add-width', (settings, name) => {
    if (name === 'designsetgo/section') {
        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                constrainWidth: { ... }  // Already in block.json!
            }
        };
    }
    return settings;
});
```

**Check First:**
```bash
grep -r "constrainWidth" src/blocks/section/block.json
```

---

### ❌ DON'T: Mix WordPress and Manual Layout

```javascript
// ❌ BAD - Block.json says "flex" but save.js manually implements
// block.json
{
  "layout": {
    "type": "flex"
  }
}

// save.js
const innerStyle = {
  display: 'flex',  // Duplicates WordPress's layout classes
  gap: '20px'
};
```

**Pick one approach and stick with it.**

---

### ❌ DON'T: Hard-code Spacing Presets

```javascript
// ❌ BAD
rowGap: 'var(--wp--preset--spacing--50)'
```

```javascript
// ✅ GOOD
const blockGap = attributes.style?.spacing?.blockGap || 'var(--wp--preset--spacing--50)';
rowGap: blockGap
```

---

## Migration Guide

### Priority 1: Fix Missing Class (Issue #1)

**File:** `src/blocks/section/save.js`

**Change:**
```javascript
// Before
const className = 'dsg-stack';

// After
const className = [
    'dsg-stack',
    !constrainWidth && 'dsg-no-width-constraint',
].filter(Boolean).join(' ');
```

**Also Fix:** Row and Grid blocks (apply same pattern)

**Test:**
1. Create Section with `constrainWidth: false`
2. Add child blocks
3. Verify children are full-width (no max-width constraint)

---

### Priority 2: Remove Duplicate Extension (Issue #4)

**Option A: Remove Extension Entirely**

If Section, Row, and Grid already have width controls, delete:
- `src/extensions/max-width/` (entire directory)
- Remove from `src/extensions/index.js`

**Option B: Refactor to Only Target Blocks Without Native Controls**

```javascript
// extensions/max-width/index.js
const blocksNeedingWidth = [
    'designsetgo/accordion',
    'designsetgo/tabs',
    // NOT section/row/grid - they already have it
];
```

**Test:**
1. Open Section block → Should only see ONE width control panel
2. Open Accordion block → Should see width controls (if keeping extension)

---

### Priority 3: Fix Row Manual Flex (Issue #2)

**File:** `src/blocks/row/save.js`

**Goal:** Let WordPress handle flex layout via `useInnerBlocksProps`.

**Current:**
```javascript
const innerStyle = {
    display: 'flex',
    justifyContent: layout?.justifyContent || 'left',
    flexWrap: layout?.flexWrap || 'wrap',
    gap: gapValue,
};
```

**Refactor To:**
```javascript
// Let WordPress handle flex via layout classes
const innerBlocksProps = useInnerBlocksProps.save({
    className: 'dsg-row__inner',
    style: innerStyle,  // Only width constraint, not flex properties
});
```

**Test:**
1. Create Row with various justify/wrap settings
2. Verify editor matches frontend
3. Check gap spacing with theme presets

---

### Priority 4: Fix Grid Hard-coded Gaps (Issue #3)

**File:** `src/blocks/grid/save.js`

**Change:**
```javascript
// Before
const innerStyles = {
    rowGap: rowGap || 'var(--wp--preset--spacing--50)',
    columnGap: columnGap || 'var(--wp--preset--spacing--50)',
};

// After
const blockGap = attributes.style?.spacing?.blockGap || 'var(--wp--preset--spacing--50)';
const innerStyles = {
    rowGap: rowGap || blockGap,
    columnGap: columnGap || blockGap,
};
```

**Test:**
1. Create Grid without custom gaps → Should use theme blockGap
2. Set custom blockGap in Dimensions → Should apply

---

### Priority 5: Fix Editor/Frontend Parity (Issue #5)

**Option A: Use CSS Variable in Both**

```javascript
// edit.js - Change to match frontend
const effectiveWidth = contentWidth || 'var(--wp--style--global--content-size, 1140px)';
```

**Option B: Ensure CSS Variable is Always Set**

```php
// includes/class-designsetgo-public.php
public function add_inline_styles() {
    $content_size = get_theme_support('editor-settings')[0]['contentSize'] ?? '1140px';
    $inline_css = "
        :root {
            --wp--style--global--content-size: {$content_size};
        }
    ";
    wp_add_inline_style('designsetgo-style', $inline_css);
}
```

**Test:**
1. Switch themes
2. Verify editor width matches frontend width

---

### Priority 6: Decide on Accordion/Tabs Width Controls (Issue #6)

**Decision Required:**

**Option A: Add Width Controls**
- Consistent with Section/Row/Grid
- Users can constrain tab panels or accordion content

**Option B: Keep Full-Width**
- Simpler for users
- Less configuration needed
- Rely on parent containers for width

**If Adding Width Controls:**
1. Add `constrainWidth` and `contentWidth` to block.json
2. Add useSettings('layout.contentSize') to edit.js
3. Apply two-div pattern in save.js
4. Add width constraint styles
5. Add inspector controls

---

## Quick Reference

### Checklist for New Container Blocks

When creating a new container block with width constraints:

- [ ] **Attributes** in block.json:
  ```json
  {
    "constrainWidth": { "type": "boolean", "default": true/false },
    "contentWidth": { "type": "string", "default": "" },
    "align": { "type": "string", "default": "full" }
  }
  ```

- [ ] **Supports** in block.json:
  ```json
  {
    "align": ["wide", "full"]
  }
  ```

- [ ] **useSettings** in edit.js:
  ```javascript
  const [themeContentSize] = useSettings('layout.contentSize');
  ```

- [ ] **Two-div structure** in save.js:
  ```jsx
  <div className="dsg-block">
    <div className="dsg-block__inner" style={innerStyle}>
      {children}
    </div>
  </div>
  ```

- [ ] **Conditional class** in save.js:
  ```javascript
  const className = [
      'dsg-block',
      !constrainWidth && 'dsg-no-width-constraint',
  ].filter(Boolean).join(' ');
  ```

- [ ] **CSS nesting rules** in style.scss:
  ```scss
  .dsg-block {
      .dsg-stack__inner > &,
      .dsg-flex__inner > &,
      .dsg-grid__inner > & {
          width: 100% !important;
          .dsg-block__inner {
              max-width: none !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
          }
      }
  }
  ```

- [ ] **Inspector controls** for width (if not using block supports)

- [ ] **Test nesting**: Place inside Section, Row, and Grid

- [ ] **Test alignfull/alignwide**

- [ ] **Test with different themes** (different contentSize values)

---

## Common Nesting Scenarios

### Scenario 1: Section > Row > Grid > Content

```
Section (constrainWidth: true, 1140px)
└─ Section__inner (max-width: 1140px)
   └─ Row (constrainWidth: false)
      └─ Row__inner (width: 100% of 1140px = 1140px)
         └─ Grid (constrainWidth: false)
            └─ Grid__inner (width: 100% of 1140px = 1140px)
               └─ Content (width: 100% of grid cell)
```

**Expected Behavior:**
- Section constrains to 1140px
- Row and Grid are full-width within that constraint
- Content respects grid columns

---

### Scenario 2: Section (alignfull) > Section (nested)

```
Section (alignfull, constrainWidth: true, 1140px)
└─ Section__inner (max-width: 1140px, centered)
   └─ Section (nested, constrainWidth: true, 800px)
      └─ Section__inner (should be FULL WIDTH of parent, not 800px!)
```

**Expected Behavior:**
- Outer Section: constrained to 1140px
- Nested Section: IGNORES its 800px constraint, becomes 1140px
- Nested Section__inner: 1140px (not 800px)

**Why?** Nested containers inherit their parent's constraint and can't be narrower.

---

### Scenario 3: Row (alignfull, no constraint) > Section (with constraint)

```
Row (alignfull, constrainWidth: false)
└─ Row__inner (full viewport width)
   └─ Section (constrainWidth: true, 1140px)
      └─ Section__inner (should be 1140px, centered)
```

**Expected Behavior:**
- Row: Full viewport width
- Section: Can apply its own constraint because parent is unconstrained

**Why?** When parent is full-width, children can apply their own constraints.

---

## Testing Matrix

### Width Constraint Tests

| Test | Setup | Expected Result | Check |
|------|-------|-----------------|-------|
| Constrained Section | Section with default contentSize | Inner div: max-width = theme contentSize | ✅ |
| Custom Width | Section with contentWidth = "900px" | Inner div: max-width = 900px | ✅ |
| No Constraint | Section with constrainWidth = false | Inner div: no max-width, full width | ❌ Issue #1 |
| Nested Containers | Section > Row > Grid | All full width of outermost constraint | ✅ |
| AlignFull | Section with alignfull | Outer div: full viewport, inner: constrained | ✅ |
| AlignWide | Section with alignwide | Outer div: wide size, inner: constrained | ✅ |

### Cross-Block Nesting Tests

| Parent | Child | Expected Child Width | Status |
|--------|-------|---------------------|--------|
| Section (1140px) | Row | 1140px | ✅ |
| Section (1140px) | Grid | 1140px | ✅ |
| Section (1140px) | Section (800px) | 1140px (ignores 800px) | ✅ |
| Row (full-width) | Section (1140px) | 1140px (applies own) | ? |
| Grid (full-width) | Section (1140px) | 1140px (applies own) | ? |
| Section | Accordion | Full width of section | ? |
| Section | Tabs | Full width of section | ? |

**Legend:**
- ✅ Working correctly
- ❌ Known issue
- ? Needs testing

---

## Resources

**Related Documentation:**
- [BLOCK-SUPPORTS-AUDIT.md](BLOCK-SUPPORTS-AUDIT.md) - Comprehensive audit of block supports usage
- [BLOCK-CONTROLS-ORGANIZATION.md](BLOCK-CONTROLS-ORGANIZATION.md) - Inspector controls organization
- [CLAUDE.md](../.claude/CLAUDE.md) - Main development guide

**WordPress Resources:**
- [Block Supports API](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [Layout Support](https://developer.wordpress.org/block-editor/how-to-guides/layout/layout-support/)
- [Theme.json Settings](https://developer.wordpress.org/themes/global-settings-and-styles/settings/)

---

## Changelog

### 2025-11-11
- Initial documentation based on codebase analysis
- Identified 7 major issues
- Created migration guide
- Established best practices

---

**Questions?** See [CLAUDE.md](../.claude/CLAUDE.md) or [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)
