# WordPress Block Editor Best Practices - DesignSetGo

**Date:** October 24, 2025
**Status:** Technical Documentation
**Issue:** Container block styles apply on frontend but not in editor
**Root Cause:** Using WordPress anti-patterns for block development

---

## Executive Summary

Our Container block was experiencing editor/frontend inconsistency because we were using **DOM manipulation with `useEffect`** and **plain `<InnerBlocks />`** instead of WordPress's recommended patterns. This document outlines the correct approach based on WordPress core block development standards.

---

## ❌ Anti-Pattern 1: DOM Manipulation with useEffect

### What We Were Doing (WRONG):

```javascript
// src/blocks/container/edit.js (lines 85-129)
useEffect(() => {
  const container = document.querySelector(`[data-block="${clientId}"]`);
  const inner = container.querySelector('.dsg-container__inner');

  // Manual style manipulation
  inner.style.display = 'grid';
  inner.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
  inner.style.gap = gap;
}, [layoutType, gridColumns, gap, clientId]);
```

### Why This Fails:

1. **Timing Issues**: WordPress block editor uses iframes in modern versions
2. **Race Conditions**: DOM queries may run before elements are rendered
3. **Not Declarative**: Doesn't match WordPress's React-based architecture
4. **Unreliable**: The block wrapper might not exist when `useEffect` runs
5. **Result**: Styles inconsistently apply or don't apply at all in editor

### WordPress Documentation Says:

> "The save function should be a pure and stateless function that depends only on the attributes used to invoke it and **shouldn't use any APIs such as useState or useEffect**."
> — [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)

---

## ❌ Anti-Pattern 2: Plain `<InnerBlocks />` Instead of `useInnerBlocksProps`

### What We Were Doing (WRONG):

```javascript
// src/blocks/container/edit.js (line 660)
<div className="dsg-container__inner" style={{ position: 'relative', zIndex: 2 }}>
  <InnerBlocks />
</div>
```

### Why This Breaks Layouts:

1. **Wrapper Divs**: WordPress adds `block-editor-inner-blocks` and `block-editor-block-list__layout` wrapper divs
2. **Broken Grid/Flexbox**: These wrapper divs **break CSS Grid and Flexbox layouts** because styles apply to the wrong element
3. **Editor/Frontend Mismatch**: Editor markup doesn't match frontend markup
4. **Block Appender Issues**: Block inserter and appender may not work correctly

### WordPress Community Insight:

> "When using plain `<InnerBlocks />`, additional wrapper divs break flexbox and CSS Grid layouts. Use `useInnerBlocksProps` hooks that core blocks employ. This will allow your block markup to match the frontend without the editor wrapping things in additional tags."
> — [WordPress StackExchange](https://wordpress.stackexchange.com/questions/390696/innerblocks-breaks-flexbox-and-css-grid-styles)

---

## ✅ Correct Pattern: Declarative Styles with `useInnerBlocksProps`

### How WordPress Core Blocks Do It:

```javascript
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ContainerEdit({ attributes }) {
  const { layoutType, constrainWidth, contentWidth, gridColumns, gap } = attributes;

  // ========================================
  // 1. Calculate styles DECLARATIVELY
  //    (NO useEffect, NO DOM queries)
  // ========================================
  const innerStyles = {};

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
    className: classnames('dsg-container', {
      'has-video-background': videoUrl,
      // ... other classes
    }),
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
      // Inner blocks configuration
      orientation: layoutType === 'flex' ? 'horizontal' : undefined,
    }
  );

  // ========================================
  // 4. Single div with spread props
  //    (NO wrapper div around InnerBlocks)
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

### Save Function (Must Match Editor):

```javascript
export default function ContainerSave({ attributes }) {
  const { layoutType, constrainWidth, contentWidth, gridColumns, gap } = attributes;

  // Same style calculation as edit.js
  const innerStyles = {};

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
    innerStyles.display = 'flex';
    innerStyles.flexDirection = 'column';
    innerStyles.gap = gap;
  }

  if (constrainWidth) {
    innerStyles.maxWidth = contentWidth;
    innerStyles.marginLeft = 'auto';
    innerStyles.marginRight = 'auto';
  }

  const blockProps = useBlockProps.save({
    className: classnames('dsg-container', {
      // ... classes
    }),
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

## Key Benefits of Correct Pattern

| Benefit | Description |
|---------|-------------|
| **Immediate Application** | Styles apply instantly in editor, no delay |
| **Editor/Frontend Parity** | What you see in editor matches frontend exactly |
| **No Timing Issues** | Declarative = no race conditions |
| **WordPress-Native** | Uses official WordPress APIs |
| **Future-Proof** | Won't break with WordPress updates |
| **Better Performance** | No DOM queries or useEffect overhead |

---

## Responsive Grid Best Practice

### Option A: CSS Custom Properties (Recommended)

**JavaScript:**
```javascript
const innerBlocksProps = useInnerBlocksProps({
  className: 'dsg-container__inner',
  style: {
    '--dsg-cols-desktop': gridColumns,
    '--dsg-cols-tablet': gridColumnsTablet,
    '--dsg-cols-mobile': gridColumnsMobile,
    '--dsg-gap': gap,
    display: 'grid',
  }
});
```

**SCSS:**
```scss
.dsg-container__inner {
  grid-template-columns: repeat(var(--dsg-cols-desktop), 1fr);
  gap: var(--dsg-gap);

  @media (max-width: 1023px) {
    grid-template-columns: repeat(var(--dsg-cols-tablet), 1fr);
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(var(--dsg-cols-mobile), 1fr);
  }
}
```

**Benefits:**
- CSS handles responsive logic
- No JavaScript needed on frontend
- Cleaner, more maintainable
- Better performance

### Option B: Inline Styles Only (Current Approach)

**JavaScript:**
```javascript
// Calculate current columns based on editor width
const editorWidth = window.innerWidth; // Simplified
let currentCols = gridColumns;

if (editorWidth < 768) {
  currentCols = gridColumnsMobile;
} else if (editorWidth < 1024) {
  currentCols = gridColumnsTablet;
}

const innerBlocksProps = useInnerBlocksProps({
  className: 'dsg-container__inner',
  style: {
    display: 'grid',
    gridTemplateColumns: `repeat(${currentCols}, 1fr)`,
    gap,
  }
});
```

**Downside**: Requires JavaScript on frontend to adjust columns on resize.

---

## When to Use Inline Styles vs CSS Classes

### WordPress Best Practice:

| Type | Use Case | Example |
|------|----------|---------|
| **Inline Styles** | User-controlled dynamic values | Colors, spacing, custom widths, column counts |
| **CSS Classes** | Static design patterns | Responsive behavior, theme variations, state indicators |

### Our Container Block:

**Inline Styles:**
- Layout type (grid/flex/stack)
- Column counts (user-defined)
- Gap spacing (user-defined)
- Content width (user-defined)

**CSS Classes:**
- Responsive visibility (`dsg-hide-desktop`, etc.)
- Video background indicator
- Clickable state indicator
- Style variations (card, elevated, etc.)

---

## Frontend JavaScript Implications

### Before (Anti-Pattern):

**frontend.js** needed to:
1. Query all `.dsg-container` elements
2. Read data attributes
3. Apply layout styles via JavaScript
4. Listen for window resize
5. Re-apply styles on resize

**Problems:**
- JavaScript required for basic layout
- Performance overhead
- Flash of unstyled content (FOUC)
- Doesn't work if JS fails to load

### After (Correct Pattern):

**frontend.js** only needs to:
1. Initialize video backgrounds (lazy loading)
2. Initialize clickable containers (event handlers)

**Benefits:**
- Layouts work without JavaScript
- Faster page load
- No FOUC
- Progressive enhancement

---

## Implementation Checklist

### Edit Component (edit.js):

- [ ] Import `useInnerBlocksProps` from `@wordpress/block-editor`
- [ ] Remove `useEffect` hook for DOM manipulation
- [ ] Calculate `innerStyles` object declaratively
- [ ] Replace plain `<InnerBlocks />` with `<div {...innerBlocksProps} />`
- [ ] Ensure no wrapper div around inner blocks
- [ ] Remove `clientId` from dependencies

### Save Component (save.js):

- [ ] Import `useInnerBlocksProps` from `@wordpress/block-editor`
- [ ] Calculate same `innerStyles` object as edit.js
- [ ] Use `useInnerBlocksProps.save()` instead of `<InnerBlocks.Content />`
- [ ] Ensure markup matches edit.js exactly

### Frontend JavaScript (frontend.js):

- [ ] Remove `initLayouts()` function entirely
- [ ] Remove window resize listener for layouts
- [ ] Keep only video background and clickable container logic

### Editor CSS (editor.scss):

- [ ] Remove data-attribute selectors for layouts (`[data-layout="grid"]`, etc.)
- [ ] Remove data-attribute selectors for constraints (`[data-constrain-width]`)
- [ ] Keep only editor-specific styles (video indicator, clickable indicator)

### Frontend CSS (style.scss):

- [ ] Add CSS custom property support for responsive grids (optional)
- [ ] Keep full-width alignment styles
- [ ] Keep responsive visibility classes

---

## Code Migration Example

### Before (Anti-Pattern):

```javascript
// edit.js - WRONG
const blockProps = useBlockProps({ /* ... */ });

useEffect(() => {
  const container = document.querySelector(`[data-block="${clientId}"]`);
  const inner = container.querySelector('.dsg-container__inner');
  inner.style.display = 'grid';
  // ...
}, [layoutType, gridColumns]);

return (
  <div {...blockProps}>
    <div className="dsg-container__inner">
      <InnerBlocks />
    </div>
  </div>
);
```

### After (Correct Pattern):

```javascript
// edit.js - CORRECT
const innerStyles = {
  display: 'grid',
  gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
  gap,
};

const blockProps = useBlockProps({ /* ... */ });
const innerBlocksProps = useInnerBlocksProps({
  className: 'dsg-container__inner',
  style: innerStyles,
});

return (
  <div {...blockProps}>
    <div {...innerBlocksProps} />
  </div>
);
```

---

## Testing Checklist

After implementing the correct pattern:

- [ ] **Editor loads without errors**
- [ ] **Layouts apply immediately in editor** (no delay)
- [ ] **Switching layouts updates instantly**
- [ ] **Grid columns adjust in editor**
- [ ] **Width constraint applies in editor**
- [ ] **Frontend matches editor exactly**
- [ ] **No JavaScript errors in console**
- [ ] **Block validation doesn't fail**
- [ ] **Existing blocks don't break** (backwards compatibility)

---

## Resources

### Official WordPress Documentation:

- [Block Wrapper (useBlockProps)](https://developer.wordpress.org/block-editor/getting-started/fundamentals/block-wrapper/)
- [useInnerBlocksProps](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useinnerblocksprops)
- [Block Styles Guide](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/applying-styles-with-stylesheets/)

### Community Resources:

- [useInnerBlocksProps Tutorial - DLX Plugins](https://dlxplugins.com/tutorials/how-to-use-useinnerblocksprops-in-nested-blocks/)
- [InnerBlocks breaks flexbox/grid - WordPress StackExchange](https://wordpress.stackexchange.com/questions/390696/innerblocks-breaks-flexbox-and-css-grid-styles)

### WordPress Core Examples:

Look at how core blocks handle inner blocks:
- `core/group` - [GitHub](https://github.com/WordPress/gutenberg/tree/trunk/packages/block-library/src/group)
- `core/columns` - [GitHub](https://github.com/WordPress/gutenberg/tree/trunk/packages/block-library/src/columns)
- `core/cover` - [GitHub](https://github.com/WordPress/gutenberg/tree/trunk/packages/block-library/src/cover)

---

## Key Takeaway

**Stop using imperative DOM manipulation. Start using declarative WordPress block hooks.**

This is the #1 issue causing editor/frontend inconsistencies in WordPress block development. Every core WordPress block uses `useBlockProps` and `useInnerBlocksProps` - we should too.

### Rules to Live By:

1. ✅ **DO** use `useInnerBlocksProps` for all blocks with InnerBlocks
2. ✅ **DO** calculate styles declaratively based on attributes
3. ✅ **DO** apply styles via React props, not DOM manipulation
4. ❌ **DON'T** use `useEffect` for styling
5. ❌ **DON'T** use `querySelector` or direct DOM access
6. ❌ **DON'T** wrap `<InnerBlocks />` in extra divs

---

**Document Owner:** Development Team
**Last Updated:** October 24, 2025
**Status:** Active - Implementation in Progress
