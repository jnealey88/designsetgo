# Responsive Visibility Extension - Technical Specification

**Version:** 1.0.0
**Date:** 2025-11-12
**Status:** Planning/Design Phase
**Extension Type:** Block Extension (applies to all blocks)

---

## Executive Summary

The Responsive Visibility Extension adds device-based visibility controls to both DesignSetGo custom blocks and WordPress core blocks. Users can hide blocks on desktop, tablet, and/or mobile devices through intuitive toggle controls in the block inspector.

**Key Features:**
- Hide blocks on desktop (≥1024px), tablet (768-1023px), or mobile (<768px)
- Works on ALL blocks (core and custom)
- Visual indication in editor when blocks are hidden
- Leverages existing CSS utilities (`.dsg-hide-desktop`, `.dsg-hide-tablet`, `.dsg-hide-mobile`)
- Follows WordPress block extension best practices
- Performance-optimized (CSS-only, no JavaScript on frontend)

---

## Current State Analysis

### Existing Infrastructure

**✅ CSS Utilities Already Exist** (`src/styles/_utilities.scss:13-32`)
```scss
.dsg-hide-desktop {
    @include desktop-up {
        display: none !important;
    }
}

.dsg-hide-tablet {
    @include tablet {
        display: none !important;
    }
}

.dsg-hide-mobile {
    @include mobile-only {
        display: none !important;
    }
}
```

**Breakpoint Definitions** (`src/styles/_variables.scss:7-10`)
- Mobile: `< 768px`
- Tablet: `768px - 1023px`
- Desktop: `≥ 1024px`

**Empty Extension Placeholder** (`src/extensions/responsive/index.js`)
- Currently just exports empty object
- Perfect location to implement this feature

### Similar Extensions to Learn From

1. **Grid Span Extension** - Conditional controls based on parent block
2. **Background Video Extension** - ALLOWED_BLOCKS pattern for selective application
3. **Max Width Extension** - Simple attribute + class application

---

## Architecture Design

### 1. Block Attributes

Add three boolean attributes to **ALL blocks**:

```javascript
{
    dsgHideOnDesktop: {
        type: 'boolean',
        default: false,
    },
    dsgHideOnTablet: {
        type: 'boolean',
        default: false,
    },
    dsgHideOnMobile: {
        type: 'boolean',
        default: false,
    }
}
```

**Naming Convention:**
- Prefix: `dsg` (plugin namespace)
- Pattern: `dsgHideOn[Device]`
- Prevents conflicts with core or other plugins

### 2. Inspector Controls

Add controls to **Settings** sidebar under a new "Responsive Visibility" panel:

```javascript
<InspectorControls>
    <PanelBody
        title={__('Responsive Visibility', 'designsetgo')}
        initialOpen={false}
    >
        <ToggleControl
            label={__('Hide on Desktop', 'designsetgo')}
            checked={dsgHideOnDesktop}
            onChange={(value) => setAttributes({ dsgHideOnDesktop: value })}
            help={__('Hide this block on desktop devices (≥1024px)', 'designsetgo')}
            __nextHasNoMarginBottom
        />
        <ToggleControl
            label={__('Hide on Tablet', 'designsetgo')}
            checked={dsgHideOnTablet}
            onChange={(value) => setAttributes({ dsgHideOnTablet: value })}
            help={__('Hide this block on tablets (768-1023px)', 'designsetgo')}
            __nextHasNoMarginBottom
        />
        <ToggleControl
            label={__('Hide on Mobile', 'designsetgo')}
            checked={dsgHideOnMobile}
            onChange={(value) => setAttributes({ dsgHideOnMobile: value })}
            help={__('Hide this block on mobile devices (<768px)', 'designsetgo')}
            __nextHasNoMarginBottom
        />
    </PanelBody>
</InspectorControls>
```

**UX Considerations:**
- Panel closed by default (`initialOpen={false}`) - not commonly used
- Clear help text showing exact breakpoint ranges
- Future-proof toggle controls (`__nextHasNoMarginBottom`)
- Simple on/off toggles (no complex multi-select)

### 3. CSS Class Application

Apply CSS classes to block wrapper based on attributes:

**Frontend** (via `blocks.getSaveContent.extraProps` filter):
```javascript
function applyResponsiveVisibilityClasses(props, blockType, attributes) {
    const { dsgHideOnDesktop, dsgHideOnTablet, dsgHideOnMobile } = attributes;

    // Build class list
    const classes = [
        props.className || '',
        dsgHideOnDesktop && 'dsg-hide-desktop',
        dsgHideOnTablet && 'dsg-hide-tablet',
        dsgHideOnMobile && 'dsg-hide-mobile',
    ].filter(Boolean).join(' ');

    return {
        ...props,
        className: classes,
    };
}
```

**Editor** (via `editor.BlockListBlock` filter):
- Apply same classes in editor
- PLUS add visual indicator when block is hidden

### 4. Editor Visual Indication

When a block is hidden on one or more devices, show a visual indicator:

```javascript
const withVisibilityIndicator = createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
        const { attributes } = props;
        const { dsgHideOnDesktop, dsgHideOnTablet, dsgHideOnMobile } = attributes;

        const hasHiddenDevices = dsgHideOnDesktop || dsgHideOnTablet || dsgHideOnMobile;

        if (!hasHiddenDevices) {
            return <BlockListBlock {...props} />;
        }

        // Build list of hidden devices
        const hiddenOn = [];
        if (dsgHideOnDesktop) hiddenOn.push('Desktop');
        if (dsgHideOnTablet) hiddenOn.push('Tablet');
        if (dsgHideOnMobile) hiddenOn.push('Mobile');

        return (
            <div className="dsg-responsive-visibility-wrapper">
                <div className="dsg-responsive-visibility-indicator">
                    Hidden on: {hiddenOn.join(', ')}
                </div>
                <BlockListBlock {...props} />
            </div>
        );
    };
}, 'withVisibilityIndicator');
```

**Visual Design** (editor.scss):
```scss
.dsg-responsive-visibility-wrapper {
    position: relative;
}

.dsg-responsive-visibility-indicator {
    position: absolute;
    top: -28px;
    left: 0;
    z-index: 10;
    padding: 4px 8px;
    background: var(--wp-admin-theme-color, #2271b1);
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    border-radius: 2px;
    pointer-events: none;
    opacity: 0.9;
}
```

---

## Implementation Details

### File Structure

```
src/extensions/responsive/
├── index.js           # Main extension logic
├── editor.scss        # Editor-only styles (visual indicators)
└── README.md          # Extension documentation
```

**Note:** Frontend styles already exist in `src/styles/_utilities.scss`

### Filter Application Order

Following plugin patterns from existing extensions:

```javascript
// 1. Add attributes (runs during block registration)
addFilter(
    'blocks.registerBlockType',
    'designsetgo/responsive-visibility-attributes',
    addResponsiveVisibilityAttributes
);

// 2. Add inspector controls (priority 10 - default)
addFilter(
    'editor.BlockEdit',
    'designsetgo/responsive-visibility-controls',
    withResponsiveVisibilityControls,
    10
);

// 3. Add visual indicators in editor (priority 15 - after controls)
addFilter(
    'editor.BlockListBlock',
    'designsetgo/responsive-visibility-indicator',
    withVisibilityIndicator,
    15
);

// 4. Apply classes to saved content
addFilter(
    'blocks.getSaveContent.extraProps',
    'designsetgo/responsive-visibility-classes',
    applyResponsiveVisibilityClasses
);
```

### Block Scope Strategy

**Option A: Apply to ALL blocks (Recommended)**
- Simplest implementation
- Most flexible for users
- Consistent with CSS class approach
- No allowlist needed

**Option B: Apply to specific blocks only**
- Use ALLOWED_BLOCKS array (like background-video)
- More control but less flexible
- Would need maintenance as new blocks added

**Decision: Use Option A** - Apply to all blocks for maximum flexibility

### Performance Considerations

**✅ Strengths:**
- CSS-only visibility (no JavaScript on frontend)
- Uses existing CSS utilities (no additional CSS generated)
- Minimal attribute storage (3 booleans per block)
- No runtime calculations

**⚠️ Considerations:**
- Adds 3 attributes to every block (minimal overhead)
- Hidden blocks still in DOM (good for SEO, but loads content)
- Editor wrapper adds one div per affected block

**Optimization:**
- Only add visual indicator when block has hidden devices
- Attributes default to `false` (saves storage when not used)

---

## User Experience Flow

### Typical Usage

1. **User selects any block** in editor
2. **Opens Settings sidebar** (right panel)
3. **Finds "Responsive Visibility" panel** (collapsed by default)
4. **Expands panel and toggles devices** to hide on
5. **Sees visual indicator** appear above block
6. **Saves/publishes** - block is hidden on selected devices on frontend

### Edge Cases

**What if user hides on all devices?**
- Show warning notice: "Block is hidden on all devices and won't be visible to visitors"
- Still allow (user might be testing or preparing content)

**What about nested blocks?**
- Each block independently controlled
- Parent hidden = children hidden (standard CSS cascade)
- Children can't override parent's hidden state

**What about reusable blocks/patterns?**
- Settings are per-instance (each use can have different visibility)
- Visibility is NOT saved in reusable block template
- This is correct behavior - visibility is content decision, not design decision

---

## Testing Strategy

### Unit Tests

**Attribute Registration:**
```javascript
it('adds responsive visibility attributes to all blocks', () => {
    const block = registerBlockType('core/paragraph', metadata);
    expect(block.attributes.dsgHideOnDesktop).toBeDefined();
    expect(block.attributes.dsgHideOnTablet).toBeDefined();
    expect(block.attributes.dsgHideOnMobile).toBeDefined();
});
```

**Class Application:**
```javascript
it('applies correct CSS classes based on attributes', () => {
    const props = applyResponsiveVisibilityClasses(
        { className: 'wp-block-paragraph' },
        blockType,
        { dsgHideOnMobile: true }
    );
    expect(props.className).toContain('dsg-hide-mobile');
});
```

### Manual Testing Checklist

**Core Blocks to Test:**
- [ ] Paragraph
- [ ] Heading
- [ ] Image
- [ ] Group
- [ ] Columns
- [ ] Button
- [ ] List
- [ ] Quote

**Custom Blocks to Test:**
- [ ] Section
- [ ] Row
- [ ] Grid
- [ ] Accordion
- [ ] Tabs
- [ ] Icon
- [ ] Icon Button

**Scenarios:**
- [ ] Hide on single device (desktop/tablet/mobile)
- [ ] Hide on multiple devices
- [ ] Hide on all devices (should show warning)
- [ ] Nested blocks with different visibility
- [ ] Container with hidden children
- [ ] Responsive preview in editor
- [ ] Frontend visibility at different viewport sizes

**Browser Testing:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Compatibility Testing:**
- [ ] WordPress 6.4
- [ ] WordPress 6.5
- [ ] WordPress 6.6+
- [ ] Classic themes
- [ ] Block themes (Twenty Twenty-Five)
- [ ] With other visibility plugins installed

---

## Security Considerations

### Sanitization

**Attributes are booleans:**
- WordPress core handles boolean sanitization
- No additional sanitization needed

**CSS Classes:**
- Only apply predefined classes (`.dsg-hide-*`)
- No user input in class names
- No XSS risk

### Capability Checks

**Block Editor:**
- Uses WordPress editor permissions
- No additional checks needed (editor already restricted)

**Frontend:**
- Pure CSS, no PHP processing
- No security concerns

---

## Accessibility (a11y) Considerations

### Screen Readers

**✅ Proper behavior:**
- `display: none` removes content from accessibility tree
- Screen readers won't announce hidden blocks
- This is correct - if hidden visually, should be hidden for all users

**⚠️ Alternative approach:**
- Could use `aria-hidden="true"` + visual hiding
- Would keep in accessibility tree but mark hidden
- **Decision:** Use `display: none` - simpler and more semantic

### Keyboard Navigation

- Hidden blocks not focusable (correct behavior)
- No tab stops on hidden content
- No additional handling needed

### Focus Management

- Editor: Block still selectable when hidden (allows editing)
- Frontend: No focus issues (block truly hidden)

---

## Migration & Backwards Compatibility

### Existing Content

**No migration needed:**
- New attributes default to `false`
- Existing blocks continue working unchanged
- No deprecations required

### CSS Utilities

**Already exist:**
- `.dsg-hide-desktop`, `.dsg-hide-tablet`, `.dsg-hide-mobile`
- Any manually applied classes continue working
- Extension complements existing functionality

### Future-Proofing

**Attribute naming:**
- Using `dsg` prefix prevents conflicts
- Specific device names (not generic "hide")
- Easy to extend (add more breakpoints later)

**Breakpoint changes:**
- Breakpoints defined in SCSS variables
- Easy to adjust if needed
- Single source of truth

---

## Documentation Requirements

### User Documentation

**Block Editor Help:**
- Tooltip help text on each toggle
- Breakpoint ranges clearly shown
- Visual examples in plugin docs

**Gutenberg Handbook:**
- Add section to plugin documentation
- Screenshots showing controls
- Common use cases (hide hero on mobile, hide sidebar on tablet, etc.)

### Developer Documentation

**Extension README:**
- Implementation details
- Filter reference
- CSS class documentation
- Extending/customizing

**Code Comments:**
- JSDoc for all functions
- Inline comments for complex logic
- PHPDoc if any PHP needed

---

## Success Metrics

### Functionality

- [ ] Works on all core blocks (tested top 10)
- [ ] Works on all custom blocks
- [ ] Visual indicator shows correctly
- [ ] CSS classes applied correctly
- [ ] No console errors in editor or frontend
- [ ] No block validation errors

### Performance

- [ ] No measurable impact on editor load time
- [ ] No impact on frontend page speed
- [ ] Bundle size increase < 5KB
- [ ] No layout shifts when toggling visibility

### User Experience

- [ ] Controls are intuitive (no training needed)
- [ ] Visual indicator is clear and unobtrusive
- [ ] Works in responsive preview mode
- [ ] Consistent with WordPress design patterns

---

## Implementation Phases

### Phase 1: Core Functionality (MVP)
- Add attributes to all blocks
- Add inspector controls
- Apply CSS classes
- Basic editor indicator
- Test with core blocks

### Phase 2: Enhanced UX
- Improve visual indicator styling
- Add warning for "hidden on all devices"
- Test with all custom blocks
- Add unit tests

### Phase 3: Documentation & Polish
- Write user documentation
- Add code comments
- Create examples
- Final testing and bug fixes

### Phase 4: Optional Enhancements
- Custom breakpoint support
- Show/hide instead of hide-only
- Preview mode integration
- Advanced visibility rules

---

## Known Limitations

1. **Hidden content still loads:**
   - Hidden blocks are in DOM, just not displayed
   - Good for SEO, but loads images/videos
   - Can't be avoided with CSS approach

2. **No custom breakpoints:**
   - Uses plugin's fixed breakpoints
   - Would require significant complexity to customize
   - Not planned for v1

3. **No show-only mode:**
   - Only supports hiding, not showing exclusively
   - E.g., can't do "show ONLY on mobile"
   - Could add in future version

4. **Parent/child cascade:**
   - Hidden parent hides all children
   - Children can't override
   - This is expected CSS behavior

---

## Alternative Approaches Considered

### 1. JavaScript-based Visibility
**Pros:** Could conditionally load content, save bandwidth
**Cons:** Worse for SEO, requires JS, more complex
**Decision:** Rejected - CSS is simpler and more reliable

### 2. Block Variations
**Pros:** More WordPress-native
**Cons:** Would need variations for every block, too complex
**Decision:** Rejected - Extension is more flexible

### 3. Separate Plugin
**Pros:** Could work with any blocks, not just DesignSetGo
**Cons:** Maintenance overhead, branding dilution
**Decision:** Rejected - Keep as extension for tighter integration

### 4. Theme.json Settings
**Pros:** Could integrate with WordPress settings
**Cons:** Not block-level control, theme-dependent
**Decision:** Rejected - Need per-block control

---

## References

### WordPress Documentation
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [Block Filters](https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/)
- [Block Supports](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)

### Plugin Documentation
- [CLAUDE.md](../CLAUDE.md) - Quick reference
- [BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md](BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)
- [BEST-PRACTICES-SUMMARY.md](BEST-PRACTICES-SUMMARY.md)

### Similar Plugins (Research)
- Responsive Visibility for Blocks Editor
- Visibility Controls for Editor Blocks
- Block Responsive
- Responsive Block Control

### Existing Extensions
- [Grid Span](../../src/extensions/grid-span/index.js) - Conditional controls pattern
- [Background Video](../../src/extensions/background-video/index.js) - ALLOWED_BLOCKS pattern
- [Max Width](../../src/extensions/max-width/index.js) - Simple class application

---

## Appendix A: Code Snippets

### Complete Filter Implementation Outline

```javascript
/**
 * Responsive Visibility Extension
 *
 * Adds hide on desktop/tablet/mobile controls to all blocks.
 */

import './editor.scss';
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, Notice } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';

// 1. Add attributes
function addResponsiveVisibilityAttributes(settings) {
    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            dsgHideOnDesktop: { type: 'boolean', default: false },
            dsgHideOnTablet: { type: 'boolean', default: false },
            dsgHideOnMobile: { type: 'boolean', default: false },
        },
    };
}

addFilter(
    'blocks.registerBlockType',
    'designsetgo/responsive-visibility-attributes',
    addResponsiveVisibilityAttributes
);

// 2. Add inspector controls
const withResponsiveVisibilityControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { attributes, setAttributes } = props;
        const { dsgHideOnDesktop, dsgHideOnTablet, dsgHideOnMobile } = attributes;

        const hiddenOnAll = dsgHideOnDesktop && dsgHideOnTablet && dsgHideOnMobile;

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody
                        title={__('Responsive Visibility', 'designsetgo')}
                        initialOpen={false}
                    >
                        {hiddenOnAll && (
                            <Notice status="warning" isDismissible={false}>
                                {__('This block is hidden on all devices.', 'designsetgo')}
                            </Notice>
                        )}

                        <ToggleControl
                            label={__('Hide on Desktop', 'designsetgo')}
                            checked={dsgHideOnDesktop}
                            onChange={(value) => setAttributes({ dsgHideOnDesktop: value })}
                            help={__('Hide this block on desktop devices (≥1024px)', 'designsetgo')}
                            __nextHasNoMarginBottom
                        />

                        <ToggleControl
                            label={__('Hide on Tablet', 'designsetgo')}
                            checked={dsgHideOnTablet}
                            onChange={(value) => setAttributes({ dsgHideOnTablet: value })}
                            help={__('Hide this block on tablets (768-1023px)', 'designsetgo')}
                            __nextHasNoMarginBottom
                        />

                        <ToggleControl
                            label={__('Hide on Mobile', 'designsetgo')}
                            checked={dsgHideOnMobile}
                            onChange={(value) => setAttributes({ dsgHideOnMobile: value })}
                            help={__('Hide this block on mobile devices (<768px)', 'designsetgo')}
                            __nextHasNoMarginBottom
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withResponsiveVisibilityControls');

addFilter(
    'editor.BlockEdit',
    'designsetgo/responsive-visibility-controls',
    withResponsiveVisibilityControls,
    10
);

// 3. Add visual indicator in editor
const withVisibilityIndicator = createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
        const { attributes } = props;
        const { dsgHideOnDesktop, dsgHideOnTablet, dsgHideOnMobile } = attributes;

        const hiddenDevices = [];
        if (dsgHideOnDesktop) hiddenDevices.push(__('Desktop', 'designsetgo'));
        if (dsgHideOnTablet) hiddenDevices.push(__('Tablet', 'designsetgo'));
        if (dsgHideOnMobile) hiddenDevices.push(__('Mobile', 'designsetgo'));

        if (hiddenDevices.length === 0) {
            return <BlockListBlock {...props} />;
        }

        return (
            <div className="dsg-responsive-visibility-wrapper">
                <div className="dsg-responsive-visibility-indicator">
                    {__('Hidden on:', 'designsetgo')} {hiddenDevices.join(', ')}
                </div>
                <BlockListBlock {...props} />
            </div>
        );
    };
}, 'withVisibilityIndicator');

addFilter(
    'editor.BlockListBlock',
    'designsetgo/responsive-visibility-indicator',
    withVisibilityIndicator,
    15
);

// 4. Apply CSS classes to saved content
function applyResponsiveVisibilityClasses(props, blockType, attributes) {
    const { dsgHideOnDesktop, dsgHideOnTablet, dsgHideOnMobile } = attributes;

    const classes = [
        props.className || '',
        dsgHideOnDesktop && 'dsg-hide-desktop',
        dsgHideOnTablet && 'dsg-hide-tablet',
        dsgHideOnMobile && 'dsg-hide-mobile',
    ].filter(Boolean).join(' ');

    return {
        ...props,
        className: classes,
    };
}

addFilter(
    'blocks.getSaveContent.extraProps',
    'designsetgo/responsive-visibility-classes',
    applyResponsiveVisibilityClasses
);
```

### Editor Styles (editor.scss)

```scss
/**
 * Responsive Visibility Extension - Editor Styles
 */

.dsg-responsive-visibility-wrapper {
    position: relative;
}

.dsg-responsive-visibility-indicator {
    position: absolute;
    top: -28px;
    left: 0;
    z-index: 10;
    padding: 4px 8px;
    background: var(--wp-admin-theme-color, #2271b1);
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.4;
    border-radius: 2px;
    pointer-events: none;
    white-space: nowrap;

    // Fade in animation
    animation: dsg-fade-in 200ms ease-in-out;
}

@keyframes dsg-fade-in {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
    to {
        opacity: 0.9;
        transform: translateY(0);
    }
}

// When block is selected, make indicator more prominent
.is-selected > .dsg-responsive-visibility-wrapper > .dsg-responsive-visibility-indicator {
    opacity: 1;
    background: var(--wp-admin-theme-color, #2271b1);
}

// Handle nested blocks
.wp-block .dsg-responsive-visibility-wrapper {
    // Ensure indicator doesn't overlap with parent block controls
    .dsg-responsive-visibility-indicator {
        z-index: 11;
    }
}
```

---

## Appendix B: Testing Scenarios Matrix

| Scenario | Desktop | Tablet | Mobile | Expected Result |
|----------|---------|--------|--------|-----------------|
| Default (no hiding) | ✅ | ✅ | ✅ | Visible everywhere |
| Hide on Desktop | ❌ | ✅ | ✅ | Hidden ≥1024px |
| Hide on Tablet | ✅ | ❌ | ✅ | Hidden 768-1023px |
| Hide on Mobile | ✅ | ✅ | ❌ | Hidden <768px |
| Hide Desktop + Tablet | ❌ | ❌ | ✅ | Visible mobile only |
| Hide Desktop + Mobile | ❌ | ✅ | ❌ | Visible tablet only |
| Hide Tablet + Mobile | ✅ | ❌ | ❌ | Visible desktop only |
| Hide All | ❌ | ❌ | ❌ | Show warning, hide everywhere |

---

## Appendix C: Breakpoint Reference

```javascript
/**
 * Breakpoint Definitions
 *
 * From: src/styles/_variables.scss
 */

const BREAKPOINTS = {
    mobile: {
        max: 767,           // < 768px
        description: 'Mobile devices',
        mediaQuery: '(max-width: 767px)',
    },
    tablet: {
        min: 768,
        max: 1023,          // 768-1023px
        description: 'Tablets',
        mediaQuery: '(min-width: 768px) and (max-width: 1023px)',
    },
    desktop: {
        min: 1024,          // >= 1024px
        description: 'Desktop computers',
        mediaQuery: '(min-width: 1024px)',
    },
};
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-12 | Claude | Initial specification document |

---

**Next Steps:**
1. Review and approve specification
2. Create GitHub issue for tracking
3. Implement Phase 1 (MVP)
4. Test with core blocks
5. Iterate and improve based on testing

**Questions/Feedback:**
- Should we add "show only on" option in addition to "hide on"?
- Should we support custom breakpoints?
- Should we add integration with WordPress responsive preview?
