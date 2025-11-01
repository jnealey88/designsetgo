# Grid Block Gap/Spacing Fix

## Issue
Grid blocks were displaying with no gap/spacing between items, causing overlapping elements.

**Date**: November 1, 2025
**Severity**: High - affects layout and usability
**Blocks Affected**: Grid Container only (Flex and Stack were not affected)

## Root Cause

The Grid block was **always applying inline `rowGap` and `columnGap` styles**, which overrode WordPress's native `blockGap` support.

### The Problem Code

**Before** ([src/blocks/grid/edit.js:69-77](src/blocks/grid/edit.js#L69-L77)):
```javascript
// ❌ BAD - Always sets gap, overriding WordPress blockGap
const effectiveRowGap = rowGap || 'var(--wp--preset--spacing--50)';
const effectiveColumnGap = columnGap || 'var(--wp--preset--spacing--50)';

const innerStyles = {
  display: 'grid',
  gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
  rowGap: effectiveRowGap,     // ← Always set, even when empty
  columnGap: effectiveColumnGap, // ← Always set, even when empty
  alignItems: alignItems || 'start',
};
```

**Why This Failed**:
1. When `rowGap` and `columnGap` attributes are empty (default), the code set fallback values
2. These inline styles **override** WordPress's `blockGap` support
3. Even though block.json enabled `blockGap: true`, it couldn't work
4. Users couldn't control gap via WordPress Spacing panel
5. Default blocks had **no gap at all** (empty strings → no spacing)

## The Fix

**After** ([src/blocks/grid/edit.js:67-82](src/blocks/grid/edit.js#L67-L82)):
```javascript
// ✅ GOOD - Only set gap when custom gaps are used
const innerStyles = {
  display: 'grid',
  gridTemplateColumns: `repeat(${desktopColumns || 3}, 1fr)`,
  alignItems: alignItems || 'start',
  // Only apply custom gaps if set, otherwise use WordPress blockGap
  ...(rowGap && { rowGap }),
  ...(columnGap && { columnGap }),
  // ... rest of styles
};
```

**Key Changes**:
1. **Removed hardcoded fallback values** - no more `|| 'var(--wp--preset--spacing--50)'`
2. **Conditional gap application** - only set `rowGap`/`columnGap` when attributes have values
3. **Let WordPress handle default spacing** - when gaps are empty, WordPress blockGap support works
4. **Added default blockGap in block.json** - new blocks start with proper spacing

## Files Changed

### 1. Grid Edit Component
**File**: [src/blocks/grid/edit.js](src/blocks/grid/edit.js)

**Changes**:
- Removed `effectiveRowGap` and `effectiveColumnGap` variables
- Changed inline styles to only apply gaps when set
- Updated comments to explain WordPress blockGap integration

### 2. Grid Save Component
**File**: [src/blocks/grid/save.js](src/blocks/grid/save.js)

**Changes**:
- Same logic as edit.js (must match exactly for validation)
- Removed `effectiveRowGap` and `effectiveColumnGap` variables
- Conditional gap application

### 3. Grid Block Metadata
**File**: [src/blocks/grid/block.json](src/blocks/grid/block.json)

**Changes**:
- Added default `style.spacing.blockGap` value
- New blocks now start with `var(--wp--preset--spacing--50)` gap

```json
{
  "attributes": {
    "style": {
      "type": "object",
      "default": {
        "spacing": {
          "blockGap": "var(--wp--preset--spacing--50)"
        }
      }
    }
  }
}
```

## How It Works Now

### Default Behavior (No Custom Gaps)

**When user inserts Grid block**:
1. `rowGap` and `columnGap` attributes are empty (`""`)
2. Inline styles **don't** set gap properties
3. WordPress applies blockGap via `style.spacing.blockGap`
4. Default gap: `var(--wp--preset--spacing--50)` (24px in most themes)
5. Users can adjust via **Settings → Spacing → Block spacing**

### Custom Row/Column Gaps

**When user enables "Custom Row/Column Gaps" toggle**:
1. `rowGap` and `columnGap` attributes are set (e.g., `"32px"`)
2. Inline styles **do** set gap properties
3. These override WordPress blockGap (expected behavior)
4. Users control via custom UnitControl inputs

## User-Facing Changes

### Before Fix
```
Insert Grid block → No gap → Items overlap
User: "Where's the spacing control?"
Settings → Spacing → Block spacing = doesn't work (overridden)
```

### After Fix
```
Insert Grid block → Default gap (24px)
Settings → Spacing → Block spacing = works! ✅
Or: Enable custom gaps for separate row/column control
```

## Testing Checklist

### Basic Functionality
- [x] Insert new Grid block → has default gap spacing
- [x] Add 3+ items → items don't overlap
- [x] Settings → Spacing → Block spacing control visible
- [x] Adjust block spacing → gap changes in editor
- [x] Frontend matches editor spacing

### Custom Gaps
- [x] Enable "Custom Row/Column Gaps" toggle
- [x] Set row gap to 16px → applied correctly
- [x] Set column gap to 32px → applied correctly
- [x] Disable custom gaps → reverts to WordPress blockGap

### Responsive Behavior
- [x] Desktop: 3 columns with proper gaps
- [x] Tablet (≤1024px): 2 columns with proper gaps
- [x] Mobile (≤767px): 1 column with proper gaps

### Edge Cases
- [x] Empty Grid block (no items) → no errors
- [x] Single item in grid → no layout issues
- [x] Nested Grid blocks → gaps work independently
- [x] Grid with constrained width → gaps still work

## WordPress blockGap vs Custom Gaps

### WordPress blockGap (Default)
- **Location**: Settings → Spacing → Block spacing
- **Applies to**: All gaps (row and column equally)
- **Values**: Theme spacing presets (xs, sm, md, lg, xl, etc.)
- **Benefits**: Consistent with theme, easy to use, respects global styles

### Custom Row/Column Gaps (Advanced)
- **Location**: Grid Settings → Gap Settings → Toggle on
- **Applies to**: Row and column separately
- **Values**: Any CSS unit (px, em, rem, %)
- **Benefits**: Fine-grained control, different row/column spacing

## Technical Details

### WordPress blockGap System

WordPress applies blockGap via:
1. **block.json**: `"blockGap": true` in spacing supports
2. **User setting**: Settings panel → Spacing → Block spacing
3. **CSS output**: Inline style `style="gap: var(--wp--preset--spacing--50)"`
4. **Applies to**: Grid containers with `display: grid` or `display: flex`

### Why Inline Styles Override

CSS specificity:
```css
/* WordPress blockGap - inline style */
.dsg-grid__inner { gap: var(--wp--preset--spacing--50); }

/* Our custom gap - inline style */
.dsg-grid__inner { row-gap: 32px; column-gap: 16px; }

/* Result: row-gap and column-gap take precedence over gap */
/* That's why we only set them when custom gaps are used */
```

## Migration Impact

### Existing Blocks
- Blocks with custom gaps (`rowGap` or `columnGap` set) → **No change**
- Blocks without custom gaps → **Now have default spacing** (improvement!)
- No validation errors (markup structure unchanged)

### New Blocks
- Start with `blockGap: var(--wp--preset--spacing--50)` (24px)
- Users can adjust immediately via Spacing panel
- Or enable custom gaps for advanced control

## Related Issues

### Why Flex and Stack Blocks Don't Have This Issue

**Flex and Stack blocks** properly use WordPress blockGap:
- No custom gap attributes
- No inline rowGap/columnGap styles
- Rely entirely on WordPress blockGap support
- Users control via Spacing panel only

**Grid block is special** because:
- Needs separate row/column gap control (advanced feature)
- Provides toggle between WordPress blockGap and custom gaps
- More complex, but more powerful

## Lessons Learned

### ✅ DO
1. **Trust WordPress blockGap** - don't reinvent the wheel
2. **Conditional inline styles** - only override when necessary
3. **Default to WordPress patterns** - users expect consistency
4. **Test both modes** - default behavior AND custom overrides

### ❌ DON'T
1. **Always set inline styles** - breaks WordPress integration
2. **Hardcode fallback values** - defeats the purpose of blockGap
3. **Override WordPress controls** - confuses users
4. **Forget to match edit.js and save.js** - causes validation errors

## Future Improvements

### Potential Enhancements
1. **Visual gap indicator** - show grid lines in editor (like CSS Grid DevTools)
2. **Gap presets** - quick buttons for common gaps (tight, normal, loose)
3. **Asymmetric gaps** - different gaps for different screen sizes
4. **Auto gap calculation** - based on column count (more columns = smaller gap)

### Not Recommended
- ❌ Removing custom gap feature - some users need it
- ❌ Different gap defaults per theme - inconsistent experience
- ❌ Pixel-perfect gap controls - users prefer presets

## References

- [WordPress blockGap Support](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/#spacing)
- [CSS Grid gap Property](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)
- [WordPress Spacing Sizes](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/theme-json-living/#spacingspacingsizes)

---

**Status**: ✅ Fixed - Grid blocks now have proper default spacing
**Testing**: ✅ Complete - All scenarios tested and working
**Deployed**: Pending commit and deployment
**Last Updated**: November 1, 2025
