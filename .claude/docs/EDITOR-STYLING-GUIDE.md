# WordPress Block Editor Styling Best Practices

## Critical Discovery: Editor/Frontend Style Inconsistency

**Date**: October 24, 2025
**Issue**: Container block styles applied on frontend but NOT in editor
**Root Cause**: Using WordPress anti-patterns (DOM manipulation + plain InnerBlocks)

## ❌ Anti-Pattern 1: DOM Manipulation with useEffect

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

## ❌ Anti-Pattern 2: Plain `<InnerBlocks />` Instead of `useInnerBlocksProps`

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

## ✅ Correct Pattern: Declarative Styles with `useInnerBlocksProps`

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

## Key Benefits of Correct Pattern

| Benefit | Description |
|---------|-------------|
| ⚡ **Immediate Application** | Styles apply instantly in editor, no delay or race conditions |
| 🎯 **Editor/Frontend Parity** | What you see in editor matches frontend exactly |
| 🚀 **No Timing Issues** | Declarative = no race conditions or DOM queries |
| 🏛️ **WordPress-Native** | Uses official WordPress APIs that all core blocks use |
| 🔮 **Future-Proof** | Won't break with WordPress updates to block editor |
| 💪 **Better Performance** | No DOM queries, no useEffect overhead, smaller bundles |

## Real-World Impact on Container Block

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

## When to Use Inline Styles vs CSS Classes

**WordPress Best Practice**:

| Type | Use Case | Example |
|------|----------|---------|
| **Inline Styles** | User-controlled dynamic values | Colors, spacing, custom widths, column counts |
| **CSS Classes** | Static design patterns | Responsive behavior, theme variations, state indicators |

**Our Container Block**:
- **Inline Styles**: Layout type, column counts, gap, content width (user-defined)
- **CSS Classes**: Responsive visibility, video indicators, clickable state, variations

## Frontend JavaScript Implications

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

## Migration Checklist

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

## Testing Checklist

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

## Using `:where()` for Layout-Constrained Blocks

**Date**: October 28, 2025
**Discovery**: Container block heading margins weren't following layout settings like Group blocks do
**Root Cause**: Using high-specificity selectors instead of WordPress's zero-specificity pattern

### ❌ Anti-Pattern: High Specificity with `!important`

**What We Initially Did (WRONG)**:
```scss
// Container block style.scss - ANTI-PATTERN
.wp-block-designsetgo-container.is-layout-constrained > :first-child {
  margin-block-start: 0 !important;
}

.wp-block-designsetgo-container.is-layout-constrained > * {
  margin-block-start: 1.2rem !important;
  margin-block-end: 0 !important;
}
```

**Why This Fails**:
- 🚫 **Fights WordPress**: High specificity overrides WordPress's natural cascade
- 💥 **Breaks blockGap**: WordPress's spacing system can't function properly
- 🎯 **Inconsistent**: Doesn't match Group block behavior
- 🔨 **Requires `!important`**: A sign you're fighting the system, not working with it

### ✅ Correct Pattern: Zero Specificity with `:where()`

**How WordPress Group Blocks Do It**:
```scss
/**
 * Layout-Constrained Margin Rules
 * Matches WordPress Group block behavior EXACTLY for proper vertical spacing
 * Applied when layout support is enabled (type: constrained)
 *
 * CRITICAL: Uses :where() for zero specificity to allow WordPress's natural
 * cascade and blockGap system to work properly. DO NOT use higher specificity
 * or !important - it breaks WordPress's layout system.
 */

// First child should have no top margin
:root :where(.wp-block-designsetgo-container.is-layout-constrained) > :first-child {
  margin-block-start: 0;
}

// All children get consistent vertical spacing
:root :where(.wp-block-designsetgo-container.is-layout-constrained) > * {
  margin-block-start: 1.2rem;
  margin-block-end: 0;
}

// Last child should have no bottom margin
:root :where(.wp-block-designsetgo-container.is-layout-constrained) > :last-child {
  margin-block-end: 0;
}
```

**Why This Works**:
- ✅ **Zero Specificity**: `:where()` has 0-0-0 specificity, allowing WordPress's cascade to work
- ✅ **Matches Core**: Exact same pattern as `core/group` block
- ✅ **blockGap Support**: WordPress's spacing system functions correctly
- ✅ **No `!important`**: Works with WordPress, not against it
- ✅ **Theme Compatible**: Themes can override if needed

### Understanding `:where()` Specificity

**CSS Specificity Comparison**:
```scss
// Specificity: 0-0-0 (zero specificity)
:where(.block.is-layout-constrained) > * {
  margin-block-start: 1.2rem;
}

// Specificity: 0-2-0 (class selectors)
.block.is-layout-constrained > * {
  margin-block-start: 1.2rem;
}

// Specificity: 0-2-0 + !important (nuclear option)
.block.is-layout-constrained > * {
  margin-block-start: 1.2rem !important;
}
```

**Why Zero Specificity Matters**:
- WordPress applies blockGap spacing via theme.json with normal specificity
- Your block's rules need to be *defaults*, not *overrides*
- `:where()` provides defaults that can be naturally overridden
- High specificity or `!important` prevents WordPress's spacing from working

### When to Use `:where()` Pattern

**Use this pattern for**:
1. ✅ Layout-constrained spacing rules (margin-block)
2. ✅ Default typography styles that themes should override
3. ✅ Any rule where WordPress or themes need control
4. ✅ BlockGap and spacing system integration

**Don't use for**:
1. ❌ User-chosen features (those CAN use `!important` for accessibility)
2. ❌ Critical accessibility overrides (e.g., white text on dark overlay)
3. ❌ Block-specific styles that shouldn't be overridden

### Key Takeaways

1. **Match WordPress Core Patterns**: When in doubt, copy how core blocks do it
2. **Zero Specificity for Layout**: Use `:where()` for margin/padding/spacing rules
3. **Let WordPress Control Spacing**: Don't fight the blockGap system
4. **Test with Group Blocks**: Your block should behave like Group blocks for layout
5. **Avoid `!important` for Layout**: Save it for accessibility overrides only

## Golden Rules for WordPress Block Development

1. ✅ **DO** use `useInnerBlocksProps` for all blocks with InnerBlocks
2. ✅ **DO** calculate styles declaratively based on attributes
3. ✅ **DO** apply styles via React props, not DOM manipulation
4. ❌ **DON'T** use `useEffect` for styling (anti-pattern)
5. ❌ **DON'T** use `querySelector` or direct DOM access (anti-pattern)
6. ❌ **DON'T** wrap `<InnerBlocks />` in extra divs (breaks layouts)
7. ✅ **DO** match edit.js and save.js markup exactly (validation)
8. ✅ **DO** test in both editor AND frontend before considering complete

## Resources

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
