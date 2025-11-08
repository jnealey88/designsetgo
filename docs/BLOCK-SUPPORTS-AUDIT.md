# Block Supports Audit - DesignSetGo Plugin

**Audit Date**: 2025-11-08
**WordPress Version**: 6.4+
**Total Blocks Analyzed**: 41

---

## Executive Summary

✅ **Good News**: Your blocks are already well-optimized! Most blocks demonstrate excellent use of WordPress Block Supports.

🎯 **Opportunity**: Found ~135 lines of code that could be eliminated across 3 blocks by using native WordPress features.

**Overall Grade**: **A-** (85/100)
- Most blocks follow WordPress best practices
- Only 3 blocks have significant optimization opportunities
- No critical issues or anti-patterns found

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Total Blocks | 41 |
| Blocks Already Optimized | 38 (93%) |
| Blocks with Opportunities | 3 (7%) |
| Total Custom Controls Found | 138 instances |
| Redundant Controls | ~12 instances |
| Potential Code Reduction | ~135 lines (8% in affected blocks) |

---

## Optimization Opportunities by Priority

### 🔴 HIGH Priority - Countdown Timer

**Impact**: 95 lines removed (~20% reduction)
**Effort**: Medium (2-3 hours)
**Files**: 3 files to modify

**Current Issues**:
1. ❌ Custom `numberFontSize` + `labelFontSize` attributes with `FontSizePicker`
2. ❌ Custom `textAlign` with `AlignmentToolbar`
3. ❌ Custom `unitBorderWidth` + `unitBorderRadius` (duplicates existing `__experimentalBorder` support)

**Solution**:
```json
// src/blocks/countdown-timer/block.json
{
  "supports": {
    "typography": {
      "fontSize": true,
      "__experimentalTextAlign": true,  // ← ADD THIS
      "__experimentalDefaultControls": {
        "fontSize": true,
        "textAlign": true  // ← ADD THIS
      }
    },
    "__experimentalBorder": {
      // Already enabled - remove duplicate custom controls
    }
  }
}
```

**What to Remove**:
- ✂️ `numberFontSize` attribute
- ✂️ `labelFontSize` attribute
- ✂️ `textAlign` attribute
- ✂️ `FontSizePicker` components (2 instances)
- ✂️ `AlignmentToolbar` component
- ✂️ Custom border width/radius controls (use native border support)

**CSS Strategy**:
```scss
// Use CSS variables to inherit from parent fontSize
.wp-block-designsetgo-countdown-timer {
  font-size: var(--wp--preset--font-size--medium); // From supports

  .countdown-number {
    font-size: calc(var(--countdown-font-size, 1em) * 2); // 2x parent
  }

  .countdown-label {
    font-size: calc(var(--countdown-font-size, 1em) * 0.75); // 0.75x parent
  }
}
```

**Files to Modify**:
1. `src/blocks/countdown-timer/block.json` - Update supports
2. `src/blocks/countdown-timer/components/inspector/StylingPanel.js` - Remove FontSizePicker, border controls
3. `src/blocks/countdown-timer/edit.js` - Remove AlignmentToolbar
4. `src/blocks/countdown-timer/style.scss` - Add CSS variables pattern

---

### 🟡 MEDIUM Priority - Progress Bar

**Impact**: 25 lines removed (~7% reduction)
**Effort**: Low (1 hour)
**Files**: 2 files to modify

**Current Issues**:
1. ❌ Custom `height` attribute with `UnitControl`
2. ❌ Custom `borderRadius` attribute (duplicates existing border support)

**Solution**:
```json
// src/blocks/progress-bar/block.json
{
  "supports": {
    "dimensions": {
      "minHeight": true,  // ← ADD THIS
      "__experimentalDefaultControls": {
        "minHeight": true
      }
    },
    "__experimentalBorder": {
      "radius": true  // ← Already enabled, use it
    }
  }
}
```

**What to Remove**:
- ✂️ `height` attribute
- ✂️ `borderRadius` attribute
- ✂️ Custom `UnitControl` for height
- ✂️ Custom `RangeControl` for border radius

**Files to Modify**:
1. `src/blocks/progress-bar/block.json` - Add dimensions support
2. `src/blocks/progress-bar/edit.js` - Remove custom height/borderRadius controls

---

### 🟢 LOW Priority - Slider

**Impact**: 15 lines removed (~2% reduction)
**Effort**: Low (30 minutes)
**Files**: 2 files to modify

**Current Issues**:
1. ❌ Custom `height` attribute

**Solution**:
```json
// src/blocks/slider/block.json
{
  "supports": {
    "dimensions": {
      "minHeight": true,  // ← ADD THIS
      "__experimentalDefaultControls": {
        "minHeight": true
      }
    }
  }
}
```

**What to Remove**:
- ✂️ `height` attribute
- ✂️ Custom `UnitControl` for height

**Files to Modify**:
1. `src/blocks/slider/block.json` - Add dimensions support
2. `src/blocks/slider/edit.js` - Remove custom height control

---

## WordPress Block Supports Reference

### What Block Supports Can Replace

| Custom Control | Block Support | Support Key |
|----------------|---------------|-------------|
| `FontSizePicker` | ✅ Typography | `supports.typography.fontSize: true` |
| `AlignmentToolbar` | ✅ Typography | `supports.typography.__experimentalTextAlign: true` |
| Custom text color | ✅ Color | `supports.color.text: true` |
| Custom background | ✅ Color | `supports.color.background: true` |
| Custom padding | ✅ Spacing | `supports.spacing.padding: true` |
| Custom margin | ✅ Spacing | `supports.spacing.margin: true` |
| Custom gap | ✅ Spacing | `supports.spacing.blockGap: true` |
| Custom border width | ✅ Border | `supports.__experimentalBorder.width: true` |
| Custom border radius | ✅ Border | `supports.__experimentalBorder.radius: true` |
| Custom border color | ✅ Border | `supports.__experimentalBorder.color: true` |
| Custom height | ✅ Dimensions | `supports.dimensions.minHeight: true` |
| Custom width (limited) | ✅ Dimensions | `supports.dimensions.maxWidth: true` |
| Custom HTML anchor | ✅ Advanced | `supports.anchor: true` |
| Custom CSS class | ✅ Advanced | `supports.customClassName: true` |

### Complete Block Supports Checklist

```json
{
  "supports": {
    // Color
    "color": {
      "text": true,
      "background": true,
      "gradients": true,
      "link": true,
      "__experimentalDefaultControls": {
        "text": true,
        "background": true
      }
    },

    // Typography
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "fontFamily": true,
      "fontWeight": true,
      "letterSpacing": true,
      "textTransform": true,
      "__experimentalTextAlign": true,
      "__experimentalDefaultControls": {
        "fontSize": true,
        "lineHeight": true
      }
    },

    // Spacing
    "spacing": {
      "margin": true,
      "padding": true,
      "blockGap": true,
      "__experimentalDefaultControls": {
        "padding": true,
        "margin": false,
        "blockGap": true
      }
    },

    // Border
    "__experimentalBorder": {
      "color": true,
      "radius": true,
      "style": true,
      "width": true,
      "__experimentalDefaultControls": {
        "radius": true,
        "width": true
      }
    },

    // Dimensions
    "dimensions": {
      "minHeight": true,
      "aspectRatio": true,
      "__experimentalDefaultControls": {
        "minHeight": true
      }
    },

    // Layout
    "align": true,
    "alignWide": true,
    "layout": {
      "allowSwitching": false,
      "allowEditing": false,
      "default": { "type": "flex" }
    },

    // Advanced
    "anchor": true,
    "customClassName": true,
    "html": false,

    // Effects
    "shadow": true,
    "position": {
      "sticky": true
    }
  }
}
```

---

## Blocks Already Optimized (Keep As-Is)

These blocks demonstrate **excellent** use of Block Supports and should serve as templates:

### 🏆 Exemplary Implementations

1. **Pill Block** (`src/blocks/pill/`)
   - ✅ Comprehensive typography, color, spacing, border supports
   - ✅ Uses `__experimentalSelector` for precise style targeting
   - ✅ Zero redundant custom controls

2. **Flex Container** (`src/blocks/flex-container/`)
   - ✅ Full layout, dimensions, shadow, position supports
   - ✅ Proper `allowEditing: false` for layout controls

3. **Grid Container** (`src/blocks/grid-container/`)
   - ✅ Complete supports implementation
   - ✅ Dimensions and position support

4. **Icon Block** (`src/blocks/icon/`)
   - ✅ Good use of spacing, color, border supports
   - ✅ Context usage for parent-child communication

5. **Accordion & Tabs**
   - ✅ Extensive typography and border controls via supports

### ✅ Well-Optimized (No Changes Needed)

- All Form Field blocks (10+ blocks) - Appropriate custom controls for form functionality
- Icon List & Icon List Item
- Stack Container
- Flip Card
- Image Accordion
- Scroll Marquee
- Scroll Accordion
- Reveal
- Blobs

---

## Common Patterns to Avoid

### ❌ Anti-Pattern: Duplicate Font Size Controls

```javascript
// DON'T DO THIS
attributes: {
  titleFontSize: { type: 'string' },
  subtitleFontSize: { type: 'string' }
}

<InspectorControls>
  <FontSizePicker
    value={titleFontSize}
    onChange={(value) => setAttributes({ titleFontSize: value })}
  />
  <FontSizePicker
    value={subtitleFontSize}
    onChange={(value) => setAttributes({ subtitleFontSize: value })}
  />
</InspectorControls>
```

### ✅ Better Pattern: Single Font Size + CSS Variables

```json
// block.json
{
  "supports": {
    "typography": {
      "fontSize": true
    }
  }
}
```

```scss
// style.scss
.wp-block-your-block {
  // Parent fontSize controlled by supports

  .title {
    font-size: calc(var(--wp--preset--font-size--medium, 1em) * 1.5);
  }

  .subtitle {
    font-size: calc(var(--wp--preset--font-size--medium, 1em) * 0.875);
  }
}
```

---

### ❌ Anti-Pattern: Custom Text Alignment

```javascript
// DON'T DO THIS
attributes: {
  textAlign: { type: 'string', default: 'left' }
}

<BlockControls>
  <AlignmentToolbar
    value={textAlign}
    onChange={(value) => setAttributes({ textAlign: value })}
  />
</BlockControls>
```

### ✅ Better Pattern: Use Typography Support

```json
// block.json
{
  "supports": {
    "typography": {
      "__experimentalTextAlign": true,
      "__experimentalDefaultControls": {
        "textAlign": true
      }
    }
  }
}
```

---

### ❌ Anti-Pattern: Custom Border Radius

```javascript
// DON'T DO THIS (when you already have border support)
attributes: {
  borderRadius: { type: 'number', default: 0 }
}

<InspectorControls>
  <RangeControl
    label="Border Radius"
    value={borderRadius}
    onChange={(value) => setAttributes({ borderRadius: value })}
  />
</InspectorControls>
```

### ✅ Better Pattern: Use Border Support

```json
// block.json
{
  "supports": {
    "__experimentalBorder": {
      "radius": true,
      "__experimentalDefaultControls": {
        "radius": true
      }
    }
  }
}
```

---

## Migration Checklist

When refactoring a block to use Block Supports:

### Step 1: Identify Opportunities
- [ ] Search for `FontSizePicker` in edit.js
- [ ] Search for `AlignmentToolbar` in edit.js
- [ ] Search for custom spacing `RangeControl`/`UnitControl`
- [ ] Search for custom border controls
- [ ] Check block.json `supports` object

### Step 2: Update block.json
- [ ] Add appropriate support keys
- [ ] Set `__experimentalDefaultControls` to show in sidebar
- [ ] Test in editor to verify controls appear

### Step 3: Remove Custom Code
- [ ] Remove attribute definitions
- [ ] Remove InspectorControls components
- [ ] Remove BlockControls toolbars
- [ ] Remove related state/logic

### Step 4: Update Styles
- [ ] Ensure `useBlockProps()` is used in edit.js
- [ ] Ensure `useBlockProps.save()` is used in save.js (static blocks)
- [ ] Ensure `get_block_wrapper_attributes()` is used in render.php (dynamic blocks)
- [ ] Test that styles still apply correctly

### Step 5: Test Thoroughly
- [ ] Create new block instance - controls appear correctly
- [ ] Edit existing block - no validation errors
- [ ] Frontend display matches editor
- [ ] Theme.json settings are respected (colors, spacing, etc.)
- [ ] Works in FSE editor
- [ ] No console errors

### Step 6: Deprecation (If Needed)
If removing attributes that were previously saved:

```javascript
// edit.js or separate deprecated.js
const deprecated = [
  {
    attributes: {
      // Old attribute schema
      customFontSize: { type: 'string' }
    },
    save({ attributes }) {
      // Old save function
    }
  }
];

export default deprecated;
```

---

## Implementation Plan

### Phase 1 - Countdown Timer (Week 1)
**Estimated Time**: 2-3 hours

1. **Day 1**: Add typography.textAlign support, remove AlignmentToolbar
2. **Day 2**: Remove custom fontSize attributes, use CSS variables pattern
3. **Day 3**: Remove duplicate border controls
4. **Day 4**: Testing and validation

**Success Criteria**:
- ✅ 95 lines of code removed
- ✅ All functionality preserved
- ✅ No validation errors on existing blocks
- ✅ Theme.json font sizes work correctly

### Phase 2 - Progress Bar (Week 2)
**Estimated Time**: 1 hour

1. Add dimensions.minHeight support
2. Remove custom height attribute
3. Remove custom borderRadius controls (use existing border support)
4. Test

**Success Criteria**:
- ✅ 25 lines of code removed
- ✅ Height control works via native dimensions support

### Phase 3 - Slider (Week 3)
**Estimated Time**: 30 minutes

1. Add dimensions.minHeight support
2. Remove custom height attribute
3. Test

**Success Criteria**:
- ✅ 15 lines of code removed
- ✅ Height control works via native dimensions support

### Phase 4 - Documentation (Week 4)
1. Update CLAUDE.md with new patterns learned
2. Document migration process
3. Update block-specific README files
4. Create deprecation guide if needed

---

## Benefits Summary

### Immediate Benefits
- **-135 lines of code** across 3 blocks
- **Less maintenance** - fewer custom controls to update
- **Better UX** - users see familiar WordPress controls
- **Theme integration** - automatic use of theme.json settings

### Long-Term Benefits
- **Future-proof** - WordPress improvements benefit blocks automatically
- **FSE compatibility** - native supports work seamlessly with Full Site Editing
- **Accessibility** - WordPress controls have built-in a11y features
- **Performance** - Less JavaScript to load and execute
- **Consistency** - All blocks use same patterns

### Developer Experience
- **Easier onboarding** - New developers recognize WordPress patterns
- **Less documentation** - WordPress docs cover Block Supports
- **Faster development** - Reuse patterns across blocks
- **Better debugging** - Fewer custom implementations to troubleshoot

---

## Risk Assessment

### Low Risk
- ✅ Only 3 blocks affected
- ✅ Changes are incremental (can do one block at a time)
- ✅ Deprecation system handles backwards compatibility
- ✅ Easy to revert if issues arise

### Mitigation Strategies
1. **Test thoroughly** before deploying
2. **Use deprecations** for any attribute changes
3. **Keep old code** in version control
4. **Deploy to staging** first
5. **Have rollback plan** ready

---

## Conclusion

**Your DesignSetGo plugin is already well-architected!** The recommended refactoring is **optional optimization**, not critical fixes.

**Recommendation**: Start with the Countdown Timer block as a pilot project. If successful, apply similar patterns to Progress Bar and Slider.

**ROI Calculation**:
- **Time Investment**: ~4 hours total
- **Code Reduction**: 135 lines
- **Maintenance Savings**: ~2-3 hours/year per block
- **Payback Period**: ~6 months

**Bottom Line**: This is a low-risk, high-value optimization that aligns your code more closely with WordPress best practices while reducing maintenance burden.

---

## Resources

- [WordPress Block Supports Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [Typography Support Documentation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/#typography)
- [Spacing Support Documentation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/#spacing)
- [Border Support Documentation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/#border)
- [Dimensions Support Documentation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/#dimensions)
- [DesignSetGo Block Controls Organization Guide](BLOCK-CONTROLS-ORGANIZATION.md)

---

**Last Updated**: 2025-11-08
**Next Review**: After completing Phase 1 (Countdown Timer)
