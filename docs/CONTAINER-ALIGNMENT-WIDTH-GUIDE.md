# Container Blocks: Alignment & Width Settings Guide

**Applies to:** Section, Row, Grid blocks
**Updated:** 2026-01-30
**Version:** 1.0.1

This document explains the alignment and width constraint systems used in DesignSetGo's container blocks (Section, Row, and Grid).

---

## Table of Contents

1. [Overview](#overview)
2. [Two-Div Architecture](#two-div-architecture)
3. [Alignment Support](#alignment-support)
4. [Width Constraint System](#width-constraint-system)
5. [Block-Specific Behavior](#block-specific-behavior)
6. [Nested Containers](#nested-containers)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Overview

All three container blocks (Section, Row, Grid) share a common architecture for handling alignment and width:

- **Outer div**: Handles WordPress alignment (wide/full), backgrounds, borders, and full-width effects
- **Inner div**: Handles width constraints, padding, and contains child blocks
- **Default alignment**: `full` (100% viewport width)
- **Width constraint**: Optional max-width applied to inner content

This separation ensures `alignfull` and `alignwide` work correctly without conflicts between padding and width calculations.

---

## Two-Div Architecture

### Structure

```html
<!-- Outer div: Full width, alignment, backgrounds -->
<div class="wp-block-designsetgo-{block} alignfull dsgo-{block}">
  <!-- Inner div: Constrained width, padding, flex/grid layout -->
  <div class="dsgo-{block}__inner">
    <!-- Child blocks here -->
  </div>
</div>
```

### Responsibilities

| Element | Handles | Does NOT Handle |
|---------|---------|-----------------|
| **Outer div** | WordPress alignment classes (`alignfull`, `alignwide`), Background colors/images, Borders, Shadows, Margins, Hover effects (CSS vars) | Padding, Width constraints, Layout (flex/grid) |
| **Inner div** | Padding, Width constraints (`maxWidth`), Layout display (`flex`/`grid`), Gap/spacing, Content positioning | Backgrounds, Borders, Alignment |

### Why This Matters

**Problem**: Applying padding to an `alignfull` element causes width calculation issues:
```css
/* ❌ WRONG: Padding + width = overflow */
.alignfull {
  width: 100vw;
  padding: 2rem; /* Breaks full-width alignment! */
}
```

**Solution**: Move padding to inner div:
```css
/* ✅ CORRECT: Padding inside constrained element */
.alignfull {
  width: 100vw; /* Full viewport width */
}
.alignfull .inner {
  padding: 2rem; /* Padding doesn't affect outer width */
  max-width: 1140px; /* Constrains content */
}
```

---

## Alignment Support

All three blocks support WordPress's alignment system via `block.json`:

```json
{
  "supports": {
    "align": ["wide", "full"]
  },
  "attributes": {
    "align": {
      "type": "string",
      "default": "full"
    }
  }
}
```

### Alignment Options

| Alignment | Class | Behavior | Use Case |
|-----------|-------|----------|----------|
| **None** | *(no class)* | Respects parent width | Rarely used for containers |
| **Wide** | `alignwide` | Uses theme's wide-size | Slightly wider than content |
| **Full** | `alignfull` (default) | 100% viewport width | Hero sections, backgrounds |

### How Alignment Works

1. **User selects alignment** via block toolbar
2. **WordPress adds class** to outer div (e.g., `alignfull`)
3. **Theme/editor CSS** applies width rules
4. **Inner div** constrains content if `constrainWidth=true`

### Migration from className

Older blocks may have alignment stored in `className` attribute. Both edit.js files include auto-migration:

```javascript
// Auto-migrate old blocks that use className for alignment
useEffect(() => {
  if (!align && className) {
    let newAlign;
    if (className.includes('alignfull')) {
      newAlign = 'full';
    } else if (className.includes('alignwide')) {
      newAlign = 'wide';
    }

    if (newAlign) {
      // Remove alignment classes from className
      const cleanClassName = className
        .split(' ')
        .filter((cls) => cls !== 'alignfull' && cls !== 'alignwide')
        .join(' ')
        .trim();

      setAttributes({
        align: newAlign,
        className: cleanClassName || undefined,
      });
    }
  }
}, []);
```

**Result**: Alignment stored in `align` attribute, not `className`.

---

## Width Constraint System

### Overview

Width constraints control the **maximum width** of inner content while the outer div spans full/wide viewport width.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `constrainWidth` | boolean | Section: `true`<br>Row: `false`<br>Grid: `false` | Enable/disable width constraint |
| `contentWidth` | string | `""` | Custom max-width (e.g., "1200px", "80rem") |

### Default Behavior by Block

#### Section
```json
{
  "constrainWidth": true,
  "contentWidth": ""
}
```
- **Default**: Constrained inner width
- **Rationale**: Sections typically contain readable content that benefits from max-width

#### Row
```json
{
  "constrainWidth": false,
  "contentWidth": ""
}
```
- **Default**: Full-width inner content
- **Rationale**: Rows often used for full-width layouts (hero sections, feature bars)

#### Grid
```json
{
  "constrainWidth": false,
  "contentWidth": ""
}
```
- **Default**: Full-width grid
- **Rationale**: Grids often used for full-width card layouts

### Width Fallback Priority

When `constrainWidth=true`, the system determines max-width using this priority:

1. **Custom `contentWidth`** (if set by user)
2. **Theme's `contentSize`** from theme.json
3. **Hardcoded fallback** (`1140px`)

#### In Editor (edit.js)

```javascript
const innerStyle = {};
if (constrainWidth) {
  innerStyle.maxWidth = contentWidth || themeContentSize || '1140px';
  innerStyle.marginLeft = 'auto';
  innerStyle.marginRight = 'auto';
}
```

- **`themeContentSize`**: Retrieved via `useSettings('layout.contentSize')`
- **Displays in UI**: Shows placeholder text "Theme default" or actual theme value

#### On Frontend (save.js)

```javascript
const innerStyle = {};
if (constrainWidth) {
  innerStyle.maxWidth =
    contentWidth || 'var(--wp--style--global--content-size, 1140px)';
  innerStyle.marginLeft = 'auto';
  innerStyle.marginRight = 'auto';
}
```

- **CSS variable**: `var(--wp--style--global--content-size, 1140px)`
- **Fallback chain**: Custom width → Theme CSS variable → 1140px

### Width Constraint Controls

Located in **Inspector Controls > Section/Row/Grid Settings**:

```javascript
<ToggleControl
  label={__('Constrain Inner Width', 'designsetgo')}
  checked={constrainWidth}
  help={
    constrainWidth
      ? __('Inner content is constrained to max width', 'designsetgo')
      : __('Inner content spans full container width', 'designsetgo')
  }
/>

{constrainWidth && (
  <UnitControl
    label={__('Max Content Width', 'designsetgo')}
    value={contentWidth}
    placeholder={themeContentSize || __('Theme default', 'designsetgo')}
    units={['px', 'em', 'rem', 'vh', 'vw', '%']}
    help={
      !contentWidth && themeContentSize
        ? sprintf(__('Using theme default: %s', 'designsetgo'), themeContentSize)
        : ''
    }
  />
)}
```

**UX Features**:
- Placeholder shows theme default if available
- Help text displays "Using theme default: 1140px" when empty
- Supports multiple units (px, em, rem, vh, vw, %)

### dsgo-no-width-constraint Class

When `constrainWidth=false`, the `dsgo-no-width-constraint` class is added to the outer div:

```javascript
// save.js
const className = [
  'dsgo-stack',
  !constrainWidth && 'dsgo-no-width-constraint',
]
  .filter(Boolean)
  .join(' ');
```

**CSS behavior** ([src/styles/utilities/_width-layout.scss:231](src/styles/utilities/_width-layout.scss#L231-L243)):
```scss
.dsgo-stack.dsgo-no-width-constraint,
.dsgo-flex.dsgo-no-width-constraint,
.dsgo-grid.dsgo-no-width-constraint {
  > .dsgo-stack__inner,
  > .dsgo-flex__inner,
  > .dsgo-grid__inner {
    > :not(.alignleft):not(.alignright) {
      max-width: none !important;
    }
  }
}
```

**Result**: Child blocks can use full container width without constraints.

---

## Block-Specific Behavior

### Section Block

**Purpose**: Vertical stacking container (flex-direction: column)

**Default Settings**:
```json
{
  "align": "full",
  "constrainWidth": true,
  "contentWidth": ""
}
```

**Layout** ([block.json:16-26](src/blocks/section/block.json#L16-L26)):
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

**WordPress handles layout**: The `layout` support means WordPress applies flex layout via classes, not custom CSS.

**Auto-conversion**: If user changes orientation to horizontal, Section auto-converts to Row ([edit.js:117-143](src/blocks/section/edit.js#L117-L143)).

---

### Row Block

**Purpose**: Horizontal flex layouts with wrapping

**Default Settings**:
```json
{
  "align": "full",
  "constrainWidth": false,
  "contentWidth": ""
}
```

**Layout** ([block.json:16-28](src/blocks/row/block.json#L16-L28)):
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

**Custom Flex Implementation**: Unlike Section, Row applies `display: flex` on inner div ([save.js:134-148](src/blocks/row/save.js#L134-L148)):

```javascript
const innerStyle = {
  display: 'flex',
  justifyContent: layout?.justifyContent || 'left',
  flexWrap: layout?.flexWrap || 'wrap',
  ...(gapValue && { gap: gapValue }),
  // ... padding
};
```

**Why manual flex?**: Row needs precise control over gap and flexWrap, so it applies flex to inner div where children actually are.

**Gap Handling**: WordPress stores gap in `attributes.style.spacing.blockGap`, but Row moves it to inner div ([save.js:93-103](src/blocks/row/save.js#L93-L103)).

**Mobile Stack** ([block.json:97-100](src/blocks/row/block.json#L97-L100)):
```json
{
  "mobileStack": {
    "type": "boolean",
    "default": false
  }
}
```

Adds `dsgo-flex--mobile-stack` class for responsive column stacking.

**Auto-conversion**: If user changes orientation to vertical, Row auto-converts to Section ([edit.js:142-170](src/blocks/row/edit.js#L142-L170)).

---

### Grid Block

**Purpose**: Responsive multi-column grid layouts

**Default Settings**:
```json
{
  "align": "full",
  "constrainWidth": false,
  "contentWidth": "",
  "desktopColumns": 3,
  "tabletColumns": 2,
  "mobileColumns": 1
}
```

**Layout** ([block.json:16-25](src/blocks/grid/block.json#L16-L25)):
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

**Custom Grid Implementation** ([save.js:99-111](src/blocks/grid/save.js#L99-L111)):

```javascript
const innerStyles = {
  display: 'grid',
  gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
  alignItems: alignItems || 'start',
  rowGap: blockGap || rowGap || defaultGap,
  columnGap: blockGap || columnGap || defaultGap,
  // ... padding
};
```

**Responsive Columns**: Uses CSS classes for breakpoints:
```javascript
className={`dsgo-grid dsgo-grid-cols-${desktopColumns} dsgo-grid-cols-tablet-${tabletColumns} dsgo-grid-cols-mobile-${mobileColumns}`}
```

**Gap Priority**:
1. WordPress `blockGap` (if using WordPress spacing panel)
2. Custom `rowGap`/`columnGap` (if "Custom Row/Column Gaps" enabled)
3. Default preset: `var(--wp--preset--spacing--50)`

**Gap Controls** ([edit.js:415-472](src/blocks/grid/edit.js#L415-L472)):
- Toggle between unified `blockGap` (WordPress) or separate row/column gaps
- Prevents accidentally having both set

---

## Nested Containers

### Behavior

When a container is nested inside another container, the nested container:

1. **Spans full parent width** (doesn't inherit parent's constraint)
2. **Can set its own width constraint**
3. **Has reset max-width on its inner div**

### CSS Rules

[src/styles/utilities/_width-layout.scss:184-202](src/styles/utilities/_width-layout.scss#L184-L202):

```scss
.dsgo-stack__inner,
.dsgo-flex__inner,
.dsgo-grid__inner {
  // Force nested containers to full width
  > .wp-block-designsetgo-section,
  > .wp-block-designsetgo-row,
  > .wp-block-designsetgo-grid {
    width: 100% !important;

    // Reset inner width constraints so nested container can set its own
    > .dsgo-stack__inner,
    > .dsgo-flex__inner,
    > .dsgo-grid__inner {
      max-width: none !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }
}
```

### Example

```html
<!-- Parent Section: constrainWidth=true, contentWidth="1140px" -->
<div class="wp-block-designsetgo-section alignfull dsgo-stack">
  <div class="dsgo-stack__inner" style="max-width: 1140px;">

    <!-- Nested Row: constrainWidth=true, contentWidth="900px" -->
    <!-- Row spans 100% of parent's 1140px -->
    <div class="wp-block-designsetgo-row alignfull dsgo-flex" style="width: 100%;">
      <!-- Inner div has own max-width, not constrained by parent -->
      <div class="dsgo-flex__inner" style="max-width: 900px;">
        <!-- Content here has max-width: 900px -->
      </div>
    </div>

  </div>
</div>
```

**Result**: Nested Row's inner content is 900px wide, not 1140px.

---

## Common Patterns

### Pattern 1: Full-Width Hero with Centered Content

**Goal**: Full-width background, centered content with max-width

```
Section
├─ align: "full"
├─ constrainWidth: true
├─ contentWidth: "1140px"
├─ Background color/image on outer div
└─ Padding + max-width on inner div
```

**HTML Output**:
```html
<section class="wp-block-designsetgo-section alignfull dsgo-stack"
         style="background: #000;">
  <div class="dsgo-stack__inner"
       style="max-width: 1140px; padding: 4rem 2rem;">
    <h1>Welcome</h1>
    <p>Content constrained to 1140px</p>
  </div>
</section>
```

---

### Pattern 2: Full-Width Grid with No Constraints

**Goal**: Grid items span full viewport width

```
Grid
├─ align: "full"
├─ constrainWidth: false
├─ desktopColumns: 4
└─ Grid spans 100vw, no inner max-width
```

**HTML Output**:
```html
<div class="wp-block-designsetgo-grid alignfull dsgo-grid dsgo-grid-cols-4 dsgo-no-width-constraint">
  <div class="dsgo-grid__inner"
       style="display: grid; grid-template-columns: repeat(4, 1fr);">
    <!-- 4 columns span full width -->
  </div>
</div>
```

---

### Pattern 3: Wide Alignment with Constraint

**Goal**: Slightly wider than content, but still constrained

```
Section
├─ align: "wide"
├─ constrainWidth: true
├─ contentWidth: "" (uses theme wide-size)
└─ Outer div uses alignwide, inner has theme's wide-size
```

**HTML Output**:
```html
<div class="wp-block-designsetgo-section alignwide dsgo-stack">
  <div class="dsgo-stack__inner"
       style="max-width: var(--wp--style--global--content-size, 1140px); padding: 2rem;">
    <!-- Content uses theme's content-size within wide alignment -->
  </div>
</div>
```

**Note**: `alignwide` outer div may be wider than inner content, creating breathing room.

---

### Pattern 4: Nested Containers with Different Widths

**Goal**: Parent at 1200px, child at 900px

```
Section (parent)
├─ align: "full"
├─ constrainWidth: true
├─ contentWidth: "1200px"
└─ Row (child)
   ├─ align: "full"
   ├─ constrainWidth: true
   └─ contentWidth: "900px"
```

**HTML Output**:
```html
<div class="wp-block-designsetgo-section alignfull dsgo-stack">
  <div class="dsgo-stack__inner" style="max-width: 1200px;">

    <div class="wp-block-designsetgo-row alignfull dsgo-flex" style="width: 100%;">
      <div class="dsgo-flex__inner" style="max-width: 900px; display: flex;">
        <!-- Content is 900px wide, centered in 1200px parent -->
      </div>
    </div>

  </div>
</div>
```

---

## Troubleshooting

### Issue: Child blocks not full width

**Symptom**: Blocks inside Section/Row/Grid appear narrow instead of filling width

**Cause**: Missing width rules or alignment classes interfering

**Solution**:
1. Check [src/styles/utilities/_width-layout.scss:38-48](src/styles/utilities/_width-layout.scss#L38-L48) is loaded
2. Verify child block doesn't have `alignleft`, `alignright`, or `aligncenter`
3. Check for custom width set on child block

---

### Issue: Padding breaks alignfull

**Symptom**: Full-width block has horizontal scrollbar or doesn't reach edges

**Cause**: Padding applied to outer div instead of inner div

**Check**:
1. Inspect outer div - should have NO padding
2. Inspect inner div - should have padding
3. Verify [edit.js](src/blocks/section/edit.js#L182-L203) and [save.js](src/blocks/section/save.js#L64-L88) extract and move padding correctly

**Fix**: Padding extraction logic in edit.js and save.js MUST match exactly.

---

### Issue: Nested container inherits parent width

**Symptom**: Nested Section inside Section only gets 1140px instead of full parent width

**Cause**: Missing nested container CSS reset

**Solution**: Verify [_width-layout.scss:184-202](src/styles/utilities/_width-layout.scss#L184-L202) is applied.

---

### Issue: Theme contentSize not applying

**Symptom**: Blocks use 1140px instead of theme's content-size

**Check**:
1. **Editor**: `useSettings('layout.contentSize')` in edit.js should return theme value
2. **Frontend**: `var(--wp--style--global--content-size)` should be defined by theme
3. **Theme.json**: Verify theme has `settings.layout.contentSize` defined

**Fallback**: If theme doesn't provide contentSize, 1140px is used as last resort.

---

### Issue: Grid gap not applying

**Symptom**: Grid items overlap or have no spacing

**Cause**: Gap priority conflict or missing default

**Solution**:
1. Check if both WordPress `blockGap` AND custom `rowGap`/`columnGap` are set
2. Verify [edit.js:162-180](src/blocks/grid/edit.js#L162-L180) gap priority logic
3. Ensure default gap `var(--wp--preset--spacing--50)` is available
4. Use "Custom Row/Column Gaps" toggle to switch between systems

---

### Issue: Row flex not working

**Symptom**: Items stack vertically instead of horizontally

**Cause**: `display: flex` not applied to inner div

**Check**: [save.js:134](src/blocks/row/save.js#L134) should have `display: 'flex'` on innerStyle.

**Common mistake**: Relying on WordPress layout support instead of manual flex on inner div.

---

### Issue: Full-width blocks not edge-to-edge

**Symptom**: `alignfull` blocks don't reach viewport edges, have gaps on left/right, or appear slightly narrower than expected

**Cause**: WordPress core theme styles (especially Twenty Twenty-Five) and WordPress defaults apply padding/margin to alignfull elements or their parents

**Common Conflicts**:

#### 1. Theme Container Padding

Many WordPress themes wrap content in containers with padding:

```css
/* Twenty Twenty-Five and similar themes */
.wp-site-blocks {
  padding-left: var(--wp--style--root--padding-left);
  padding-right: var(--wp--style--root--padding-right);
}
```

**Result**: `alignfull` blocks inherit this padding, preventing true edge-to-edge layout.

**Solution A - Override in plugin styles**:
```scss
// Force alignfull to break out of container padding
.wp-block-designsetgo-section.alignfull,
.wp-block-designsetgo-row.alignfull,
.wp-block-designsetgo-grid.alignfull {
  width: 100vw !important;
  max-width: 100vw !important;
  margin-left: calc(50% - 50vw) !important;
  margin-right: calc(50% - 50vw) !important;
}
```

**Solution B - User workaround**:

1. Add negative margins equal to theme's padding
2. Use custom CSS on specific blocks
3. Switch to a theme with better alignfull support

#### 2. WordPress Default Alignfull Max-Width

WordPress core may apply max-width to alignfull in some contexts:

```css
/* WordPress default (wp-includes/css/dist/block-library/style.css) */
.alignfull {
  margin-left: auto;
  margin-right: auto;
  max-width: var(--wp--style--global--wide-size);
}
```

**Result**: Blocks constrained to theme's wide-size instead of full viewport.

**Solution**: Plugin styles must have higher specificity:
```scss
// More specific selector wins
.wp-block-designsetgo-section.alignfull {
  max-width: none !important;
}
```

#### 3. Box-Sizing Conflicts

Some themes use `box-sizing: content-box` which causes width calculations to exclude padding:

```css
/* Theme sets content-box */
* {
  box-sizing: content-box;
}

/* Block has width + padding = overflow */
.alignfull {
  width: 100vw;
  padding: 2rem; /* Adds to width! */
}
```

**Result**: Total width becomes `100vw + 4rem`, causing horizontal scroll.

**Solution**: Plugin ensures `box-sizing: border-box` on containers:
```scss
.wp-block-designsetgo-section,
.wp-block-designsetgo-row,
.wp-block-designsetgo-grid {
  box-sizing: border-box !important;
}
```

---

### Issue: Wide-aligned blocks have extra space on right

**Symptom**: `alignwide` blocks appear off-center, with more space on the right than left, or don't center properly

**Cause**: Theme or WordPress default styles conflict with alignwide calculations

**Common Conflicts**:

#### 1. Twenty Twenty-Five Wide Size Calculation

TT5 uses asymmetric padding that affects wide alignment:

```css
/* TT5 theme.json often defines */
{
  "settings": {
    "layout": {
      "contentSize": "620px",
      "wideSize": "1280px"
    }
  }
}

/* But also applies root padding */
.wp-site-blocks {
  padding-left: var(--wp--preset--spacing--50);
  padding-right: var(--wp--preset--spacing--50);
}
```

**Problem**: If container has `max-width: 1280px` and `margin: auto`, but parent has asymmetric padding, the centering calculation is off.

**Solution**: Ensure alignwide respects parent padding:
```scss
.wp-block-designsetgo-section.alignwide,
.wp-block-designsetgo-row.alignwide,
.wp-block-designsetgo-grid.alignwide {
  // Account for parent container padding
  width: calc(100% - var(--wp--style--root--padding-left, 0px) - var(--wp--style--root--padding-right, 0px));
  margin-left: auto;
  margin-right: auto;
}
```

#### 2. Conflicting Max-Width on Parent

Some themes apply `max-width` to parent containers:

```css
/* Theme wraps everything in constrained container */
.entry-content,
.wp-block-post-content {
  max-width: 1140px;
  margin: 0 auto;
}
```

**Problem**: `alignwide` inside a constrained parent can't actually get wider than parent's max-width.

**Visual Result**:

```text
┌─────────────────────────────────────┐
│  Parent Container (max: 1140px)     │
│  ┌───────────────────────────────┐  │ ← alignwide trying to be 1280px
│  │    Alignwide Block (1280px)   │  │    but constrained by parent
│  │    Gets squished to 1140px    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Solution**: Break out of parent constraint with negative margins:
```scss
.entry-content .alignwide,
.wp-block-post-content .alignwide {
  width: min(var(--wp--style--global--wide-size, 1280px), 100vw);
  max-width: none;
  margin-left: auto;
  margin-right: auto;
}
```

#### 3. Flexbox Parent Interference

If the alignwide block's parent is a flexbox container:

```css
/* Parent is flex container */
.entry-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* ← Problem! */
}
```

**Problem**: `align-items: flex-start` prevents child from centering with `margin: auto`.

**Visual Result**:

```text
┌──────────────────────────────────────┐
│  Flex Parent                         │
│  ┌─────────────────────────┐         │ ← Alignwide pushed left
│  │  Alignwide Block        │  extra  │    Extra space on right
│  │                         │  space  │
│  └─────────────────────────┘         │
└──────────────────────────────────────┘
```

**Solution**: Override flex alignment:
```scss
.entry-content,
.wp-block-post-content {
  &.is-layout-flex,
  &[class*="is-layout"] {
    // Force center alignment for wide blocks
    > .alignwide {
      align-self: center;
    }
  }
}
```

---

### Issue: Editor vs Frontend Alignment Mismatch

**Symptom**: Block looks perfect in editor but misaligned on frontend (or vice versa)

**Cause**: Different CSS loaded in editor vs frontend

**Common Scenarios**:

#### 1. Editor-Only Styles

WordPress loads editor-specific styles that may not apply on frontend:

```css
/* Loaded ONLY in editor */
.editor-styles-wrapper .alignfull {
  width: calc(100% + 60px);
  margin-left: -30px;
}

/* Frontend has different calculation */
.alignfull {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}
```

**Solution**: Ensure both `editor.scss` and `style.scss` have same alignment rules:

```scss
// src/styles/editor.scss
@import 'utilities/width-layout';

// src/styles/style.scss
@import 'utilities/width-layout';
```

#### 2. Theme Editor Styles Override Plugin

Twenty Twenty-Five loads editor styles that can override plugin styles:

```css
/* TT5 editor styles (higher specificity in editor) */
.editor-styles-wrapper .wp-block[data-align="full"] {
  max-width: none;
  width: 100%;
}
```

**Solution**: Increase specificity in editor.scss:
```scss
// Target editor-specific wrapper
.editor-styles-wrapper {
  .wp-block-designsetgo-section.alignfull,
  .wp-block-designsetgo-row.alignfull,
  .wp-block-designsetgo-grid.alignfull {
    width: 100% !important;
    max-width: none !important;
  }
}
```

---

### Testing for Theme Conflicts

#### Quick Diagnostics Checklist

1. **Inspect outer div** in browser DevTools:

   ```text
   Should see:
   - width: 100vw (for alignfull)
   - No padding (padding should be on inner div only)
   - No unexpected margins
   - box-sizing: border-box
   ```

2. **Check computed styles** for conflicting rules:

   ```text
   Look for:
   - Multiple max-width declarations
   - Parent containers with constraining width
   - Padding from theme on .wp-site-blocks or .entry-content
   - Flexbox align-items on parent
   ```

3. **Test with default theme**:
   - Switch to Twenty Twenty-Four
   - If alignment works, conflict is theme-specific
   - Document theme-specific overrides needed

4. **Compare editor vs frontend**:

   - Save and view on frontend
   - If mismatch, check if editor.scss and style.scss both import width utilities

#### Common Theme-Specific Fixes

**Twenty Twenty-Five**:
```scss
// Override TT5 container padding for alignfull
.wp-site-blocks {
  > .alignfull {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
  }
}
```

**GeneratePress**:
```scss
// Override GeneratePress container
.site-content .alignfull {
  width: 100vw;
  max-width: 100vw;
  margin-left: calc(50% - 50vw);
}
```

**Astra**:
```scss
// Override Astra's content width
.ast-container .alignfull {
  margin-left: calc(-1 * var(--ast-container-padding, 20px));
  margin-right: calc(-1 * var(--ast-container-padding, 20px));
  width: calc(100% + 2 * var(--ast-container-padding, 20px));
}
```

---

### Prevention: Plugin Best Practices

To minimize theme conflicts, the plugin should:

1. **Use !important sparingly but strategically** on critical alignment rules
2. **Provide theme compatibility layer** in separate SCSS file
3. **Test with popular themes** (TT5, GeneratePress, Astra, Kadence)
4. **Document known conflicts** in README
5. **Offer CSS reset option** in plugin settings

**Example theme compatibility file**:

```scss
// src/styles/theme-compat.scss

// Twenty Twenty-Five
body.twentytwentyfive {
  .wp-site-blocks > .alignfull {
    width: 100vw !important;
    margin-left: calc(50% - 50vw) !important;
    margin-right: calc(50% - 50vw) !important;
  }
}

// GeneratePress
body.generatepress {
  .site-content .alignfull {
    max-width: none !important;
  }
}

// Additional themes as needed...
```

---

## Summary

### Key Principles

1. **Two-div separation**: Outer (alignment/backgrounds) + Inner (constraints/padding)
2. **Padding on inner div**: Prevents alignfull conflicts
3. **Constrain inner width**: Use `constrainWidth` + `contentWidth` attributes
4. **Fallback chain**: Custom → Theme → Hardcoded (1140px)
5. **Nested containers reset**: Child containers set their own width independently

### Quick Reference Table

| Block | Default Align | Default Constrain | Layout Type | Manual Display | Auto-Convert |
|-------|---------------|-------------------|-------------|----------------|--------------|
| **Section** | `full` | `true` | Flex vertical | No (WordPress handles) | → Row (if horizontal) |
| **Row** | `full` | `false` | Flex horizontal | Yes (`display: flex` on inner) | → Section (if vertical) |
| **Grid** | `full` | `false` | Grid | Yes (`display: grid` on inner) | No |

### Files to Reference

- **Block definitions**: [src/blocks/{section,row,grid}/block.json](src/blocks/)
- **Editor logic**: [src/blocks/{section,row,grid}/edit.js](src/blocks/)
- **Frontend output**: [src/blocks/{section,row,grid}/save.js](src/blocks/)
- **Width utilities**: [src/styles/utilities/_width-layout.scss](src/styles/utilities/_width-layout.scss)

---

**Need more details?** See:
- [CLAUDE.md](../.claude/CLAUDE.md) - Container Width Pattern section
- [BEST-PRACTICES-SUMMARY.md](BEST-PRACTICES-SUMMARY.md)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/#align)
