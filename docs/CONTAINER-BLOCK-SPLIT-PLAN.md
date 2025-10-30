# Container Block Split - Implementation Plan

**Date**: 2025-10-30
**Decision**: Split monolithic Container block into 3 specialized blocks + 2 extensions

## Why Split?

### Problems with Current Container Block
- **Too complex**: 658 lines → 349 lines after refactoring, still too large
- **Specificity wars**: Grid/Flex CSS conflicts with WordPress core and max-width
- **User confusion**: Too many layout options in one block
- **Hard to maintain**: Every change risks breaking multiple use cases
- **Poor discoverability**: Users don't know which settings to use when

### Benefits of Split
- ✅ **Simpler code**: Each block ~150-250 lines
- ✅ **Clear purpose**: Users know which block to pick
- ✅ **Easier maintenance**: Changes isolated to specific block
- ✅ **Better performance**: Only load needed CSS/JS
- ✅ **WordPress-aligned**: Matches core philosophy (Group, Stack, Row, Columns)
- ✅ **Fewer bugs**: Less complexity = fewer edge cases

## New Block Architecture

### 1. Stack Container (`designsetgo/stack`)

**Purpose**: Simple vertical stacking with consistent gaps

**Use Cases**:
- Vertical sections (hero, features, testimonials)
- Simple content stacking
- Alternative to Group block with better defaults

**Attributes**:
```json
{
  "gap": "string",
  "constrainWidth": "boolean",
  "contentWidth": "string",
  "padding": "object",
  "align": "string",
  "textAlign": "string"
}
```

**Controls**:
- Gap (spacing between items)
- Constrain width toggle + content width
- Padding (top/right/bottom/left)
- Alignment

**Code Estimate**: ~150 lines

**Icon**: Vertical stacked bars

---

### 2. Flex Container (`designsetgo/flex`)

**Purpose**: Flexible horizontal/vertical layouts with wrapping

**Use Cases**:
- Button groups (horizontal row)
- Hero sections (row with image + text)
- Cards that wrap responsively
- Centered content

**Attributes**:
```json
{
  "direction": "string", // row | column
  "wrap": "boolean",
  "justifyContent": "string",
  "alignItems": "string",
  "gap": "string",
  "mobileStack": "boolean",
  "padding": "object"
}
```

**Controls**:
- Direction (row/column)
- Wrap toggle
- Justify content (start/center/end/space-between)
- Align items (start/center/end/stretch)
- Gap
- Mobile stack toggle
- Padding

**Code Estimate**: ~200 lines

**Icon**: Horizontal bars with arrows

---

### 3. Grid Container (`designsetgo/grid`)

**Purpose**: Responsive multi-column grid layouts

**Use Cases**:
- Feature grids (3 columns on desktop, 2 on tablet, 1 on mobile)
- Product listings
- Team member grids
- Card grids

**Attributes**:
```json
{
  "desktopColumns": "number",
  "tabletColumns": "number",
  "mobileColumns": "number",
  "gap": "string",
  "rowGap": "string",
  "columnGap": "string",
  "alignItems": "string",
  "padding": "object"
}
```

**Controls**:
- Desktop columns (1-12)
- Tablet columns (1-6)
- Mobile columns (1-3)
- Gap (unified or separate row/column)
- Align items (start/stretch/center)
- Padding

**Child Block Extension**:
- Column span control (for featured items)

**Code Estimate**: ~250 lines

**Icon**: Grid pattern (3x3 squares)

---

## Block Extensions (Apply to ALL Blocks)

### 1. Background Video Extension

**Purpose**: Add video backgrounds to any block

**Attributes**:
```json
{
  "videoUrl": "string",
  "videoPoster": "string",
  "videoLoop": "boolean",
  "videoMuted": "boolean",
  "videoAutoplay": "boolean",
  "videoPauseOnMobile": "boolean"
}
```

**Applies to**: All blocks (Group, Stack, Flex, Grid, Cover, Container, etc.)

**Controls Panel**: "Background Video"
- Video URL picker (Media Library)
- Poster image
- Loop toggle
- Muted toggle (default: true for autoplay)
- Autoplay toggle
- Pause on mobile toggle

**Frontend Rendering**:
- PHP filter adds `<video>` element before block content
- CSS positions video absolutely
- JavaScript handles mobile behavior

**Code Estimate**: ~200 lines (extension) + ~100 lines (PHP renderer)

---

### 2. Overlay Extension

**Purpose**: Add color overlay to any block

**Attributes**:
```json
{
  "overlayEnabled": "boolean",
  "overlayColor": "string",
  "overlayOpacity": "number"
}
```

**Applies to**: All blocks

**Controls Panel**: "Overlay"
- Enable overlay toggle
- Color picker (WordPress native)
- Opacity slider (0-100%)

**Frontend Rendering**:
- CSS-only (no JavaScript needed)
- Absolute positioned div with background color + opacity

**Code Estimate**: ~150 lines (extension)

---

## Migration Strategy

### Phase 1: Create New Blocks (Week 1-2)
1. ✅ Create Stack Container
2. ✅ Create Flex Container
3. ✅ Create Grid Container
4. ✅ Test each independently

### Phase 2: Create Extensions (Week 2-3)
1. ✅ Extract Background Video as extension
2. ✅ Extract Overlay as extension
3. ✅ Test on multiple blocks (Group, Stack, Flex, Grid)

### Phase 3: Deprecation (Week 3)
1. ✅ Add deprecation to old Container block
2. ✅ Show migration notice in editor
3. ✅ Provide "Convert to..." buttons

### Phase 4: Migration Tool (Week 4)
1. ✅ Detect old Container blocks in content
2. ✅ Convert based on `layoutType`:
   - `stack` → Stack Container
   - `flex` → Flex Container
   - `grid` → Grid Container
3. ✅ Migrate common attributes (padding, visibility, etc.)
4. ✅ Move video/overlay to extensions

### Phase 5: Documentation (Week 5)
1. ✅ Update plugin docs
2. ✅ Create migration guide
3. ✅ Add video tutorials

### Phase 6: Remove Old Block (6 months later)
1. ⏳ Keep old Container for 2-3 major versions
2. ⏳ Only remove after 99% migration rate
3. ⏳ Final deprecation warning before removal

---

## Code Organization

```
src/blocks/
├── stack/                    # NEW
│   ├── index.js             # Registration
│   ├── edit.js              # Edit component (~150 lines)
│   ├── save.js              # Save component
│   ├── block.json           # Metadata
│   ├── style.scss           # Frontend styles
│   └── editor.scss          # Editor styles
│
├── flex/                     # NEW
│   ├── index.js
│   ├── edit.js              # Edit component (~200 lines)
│   ├── save.js
│   ├── block.json
│   ├── style.scss
│   └── editor.scss
│
├── grid/                     # NEW
│   ├── index.js
│   ├── edit.js              # Edit component (~250 lines)
│   ├── save.js
│   ├── block.json
│   ├── components/
│   │   └── inspector/
│   │       └── GridPanel.js # Responsive column controls
│   ├── style.scss
│   └── editor.scss
│
└── container/                # DEPRECATED (keep for migration)
    ├── index.js             # Add deprecation warning
    ├── deprecated.js        # Deprecation versions
    └── ... (existing files)

src/extensions/
├── background-video/         # NEW
│   ├── index.js             # Extension logic
│   ├── style.scss           # Video positioning
│   └── frontend.js          # Mobile behavior
│
└── overlay/                  # NEW
    ├── index.js             # Extension logic
    └── style.scss           # Overlay styles
```

---

## Shared Components/Utilities

Create reusable components to avoid duplication:

```
src/components/shared/
├── PaddingPanel.js          # Reused by Stack, Flex, Grid
├── GapControl.js            # Reused by Stack, Flex, Grid
├── VisibilityPanel.js       # Reused by all blocks
└── AlignmentControl.js      # Reused by Stack, Flex
```

---

## Attribute Mapping (Old → New)

### Container → Stack
```javascript
{
  layoutType: 'stack',
  gap: '24px',
  constrainWidth: true,
  contentWidth: '800px',
  padding: { top: '2rem', ... }
}
→
Stack Container {
  gap: '24px',
  constrainWidth: true,
  contentWidth: '800px',
  padding: { top: '2rem', ... }
}
```

### Container → Flex
```javascript
{
  layoutType: 'flex',
  flexDirection: 'row',
  flexWrap: true,
  flexJustify: 'center',
  flexAlign: 'center',
  gap: '16px',
  flexMobileStack: true
}
→
Flex Container {
  direction: 'row',
  wrap: true,
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  mobileStack: true
}
```

### Container → Grid
```javascript
{
  layoutType: 'grid',
  gridColumns: 3,
  tabletColumns: 2,
  mobileColumns: 1,
  gap: '32px'
}
→
Grid Container {
  desktopColumns: 3,
  tabletColumns: 2,
  mobileColumns: 1,
  gap: '32px'
}
```

### Video/Overlay → Extensions
```javascript
Container {
  videoUrl: '...',
  enableOverlay: true,
  overlayColor: 'rgba(0,0,0,0.5)'
}
→
Any Block {
  // Via extensions:
  videoUrl: '...',
  overlayEnabled: true,
  overlayColor: '#000000',
  overlayOpacity: 50
}
```

---

## Testing Checklist

### Stack Container
- [ ] Vertical stacking works
- [ ] Gap control applies correctly
- [ ] Width constraint works
- [ ] Padding applies
- [ ] Visibility controls work
- [ ] Works with InnerBlocks
- [ ] No console errors

### Flex Container
- [ ] Row direction works
- [ ] Column direction works
- [ ] Wrap toggle works
- [ ] Justify/align work
- [ ] Gap applies
- [ ] Mobile stack works
- [ ] No console errors

### Grid Container
- [ ] Desktop columns work (1-12)
- [ ] Tablet responsive works
- [ ] Mobile responsive works
- [ ] Gap applies
- [ ] Row/column gap work separately
- [ ] Align items works
- [ ] Column span extension works
- [ ] No console errors

### Background Video Extension
- [ ] Video URL picker works
- [ ] Video plays on frontend
- [ ] Poster image shows before play
- [ ] Loop works
- [ ] Muted works
- [ ] Autoplay works
- [ ] Mobile pause works
- [ ] Works on Group, Stack, Flex, Grid
- [ ] No console errors

### Overlay Extension
- [ ] Enable toggle works
- [ ] Color picker works
- [ ] Opacity slider works
- [ ] Works on all blocks
- [ ] Doesn't conflict with video
- [ ] No console errors

### Migration
- [ ] Old Container blocks still work
- [ ] Deprecation warning shows
- [ ] Convert buttons work
- [ ] Stack migration preserves data
- [ ] Flex migration preserves data
- [ ] Grid migration preserves data
- [ ] Video migrates to extension
- [ ] Overlay migrates to extension
- [ ] No data loss

---

## Performance Targets

| Metric | Target | Current Container |
|--------|--------|-------------------|
| Stack edit.js | < 150 lines | 349 lines |
| Flex edit.js | < 200 lines | 349 lines |
| Grid edit.js | < 250 lines | 349 lines |
| Editor bundle (all 3) | < 50 KB | 17 KB (1 block) |
| Frontend CSS (all 3) | < 15 KB | 5 KB (1 block) |
| Load time impact | < 10ms | N/A |

---

## Documentation Plan

### User Documentation
- "When to use Stack vs Flex vs Grid"
- "Migrating from Container block"
- "Adding video backgrounds to any block"
- "Using overlays effectively"

### Developer Documentation
- "Creating block extensions"
- "Block deprecation best practices"
- "Migration tool architecture"

---

## Rollout Plan

### Version 2.0.0 (New Blocks + Extensions)
- Add Stack, Flex, Grid blocks
- Add Background Video extension
- Add Overlay extension
- Keep Container block working
- Add deprecation notice

### Version 2.1.0 (Migration Tool)
- Add "Convert to..." buttons in editor
- Bulk migration tool in admin
- Migration progress tracking

### Version 2.2.0 (Documentation)
- Complete user guide
- Video tutorials
- Migration FAQ

### Version 3.0.0 (6 months later)
- Remove old Container block (if migration > 99%)
- Or keep deprecated for another 6 months

---

## Questions to Resolve

1. **Block Icons**: What should Stack, Flex, Grid icons look like?
2. **Block Category**: All in "DesignSetGo" or create "Layout" subcategory?
3. **Default Gap**: What's a good default gap value? (16px? 24px?)
4. **Overlay Default Color**: Black? Transparent? Theme color?
5. **Video Autoplay**: Default true or false? (UX vs accessibility)

---

## Success Metrics

- ✅ Code reduction: 349 lines → ~150-250 lines per block
- ✅ User satisfaction: Survey after migration
- ✅ Migration rate: > 99% in 6 months
- ✅ Support tickets: Decrease by 50%
- ✅ Performance: No increase in bundle size
- ✅ Adoption: New blocks used in 80% of new sites

---

## Next Steps

1. ✅ Review and approve this plan
2. ✅ Create Stack Container block
3. ✅ Create Flex Container block
4. ✅ Create Grid Container block
5. ✅ Extract Background Video extension
6. ✅ Extract Overlay extension
7. ✅ Test everything
8. ✅ Create migration tool
9. ✅ Update documentation
10. ✅ Release v2.0.0

---

**Approved by**: [Your name]
**Start Date**: [TBD]
**Target Release**: v2.0.0
