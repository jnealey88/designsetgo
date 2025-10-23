# DesignSetGo - Claude Development Notes

## Project Overview

DesignSetGo is a WordPress Gutenberg block library that **extends core WordPress blocks** rather than creating custom blocks from scratch. This provides better UX, theme compatibility, and maintainability.

## Architecture Philosophy

### Hybrid Approach

**✅ Extend WordPress Blocks When:**
- Similar functionality already exists in WordPress
- Users are familiar with the core block
- Example: Group, Heading, Button, Image blocks

**✅ Create Custom Blocks When:**
- Functionality is completely unique
- No core block equivalent exists
- Example: Icon picker, Accordion, Tabs, Advanced Carousel

## Key Technical Decisions

### 1. Working WITH WordPress Layout System

**DON'T** create duplicate layout controls that conflict with WordPress toolbar icons.

**DO** detect WordPress's `layout` attribute and enhance it:

```javascript
// Check WordPress layout type
const isGridLayout = layout?.type === 'grid';

// Only show our grid enhancements when WordPress Grid is active
{isGridLayout && (
  <PanelBody title="Grid Columns">
    <RangeControl label="Desktop Columns" />
    <RangeControl label="Tablet Columns" />
    <RangeControl label="Mobile Columns" />
  </PanelBody>
)}
```

### 2. WordPress Group Block Toolbar

The Group block has these native layout modes:
- **Flow** - Default stacked layout
- **Flex Row** - Horizontal flexbox
- **Flex Column** - Vertical flexbox
- **Grid** - CSS Grid

Users switch layouts via toolbar icons. We enhance the selected layout, not replace it.

### 3. Conditional Controls

Show controls based on what's relevant:

```javascript
// Grid columns - only when Grid layout active
if (layout?.type === 'grid') {
  // Show column controls
}

// Responsive visibility - always available
// Animation - always available (future)
```

### 4. WordPress Layout Attribute

Use WordPress's native layout attribute in variations:

```javascript
// Grid variation
attributes: {
  layout: {
    type: 'grid',
    columnCount: 3,
  },
  dsgGridColumns: 3,        // Our enhancement
  dsgGridColumnsTablet: 2,  // Our enhancement
  dsgGridColumnsMobile: 1,  // Our enhancement
}

// Flex variation
attributes: {
  layout: {
    type: 'flex',
    orientation: 'horizontal',
    verticalAlignment: 'center',
  },
}
```

## File Structure

### Extensions
```
src/extensions/
└── group-enhancements/
    ├── index.js         ← Filters to extend Group block
    ├── styles.scss      ← Frontend styles
    ├── editor.scss      ← Editor-only styles
    └── frontend.js      ← Frontend JavaScript
```

### Variations
```
src/variations/
└── group-variations/
    └── index.js         ← Pre-built layouts using WordPress layout
```

## File Versioning Guidelines

**IMPORTANT: Do NOT create versioned file names (e.g., index-v2.js, styles-v2.scss)**

### Why?
- Clutters the codebase with old/duplicate files
- Makes it unclear which version is active
- Requires updating imports when versions change
- Creates maintenance confusion

### ✅ DO:
```
src/extensions/group-enhancements/
├── index.js
└── styles.scss
```

### ❌ DON'T:
```
src/extensions/group-enhancements/
├── index.js        ← Which one is used?
├── index-v2.js     ← Confusing!
├── styles.scss
└── styles-v2.scss
```

### How to Handle Rewrites:
1. **Use Git for version history** - Git is our version control system
2. **Delete old file, create new** - Don't keep both versions
3. **If testing new approach:**
   - Create a feature branch
   - OR use a descriptive name like `index-experimental.js`
   - Once stable, replace the main file and delete the experimental one

### Git is Your Version Control:
```bash
# See previous versions
git log -- src/extensions/group-enhancements/index.js

# Restore old version if needed
git checkout <commit-hash> -- src/extensions/group-enhancements/index.js
```

## Block Extension Pattern

```javascript
// 1. Add attributes
addFilter('blocks.registerBlockType', 'dsg/group-attrs', (settings, name) => {
  if (name !== 'core/group') return settings;

  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      dsgGridColumns: { type: 'number', default: 3 },
      // ... more attributes
    },
  };
});

// 2. Add controls (conditionally)
addFilter('editor.BlockEdit', 'dsg/group-controls', createHigherOrderComponent(
  (BlockEdit) => (props) => {
    const { layout } = props.attributes;
    const isGrid = layout?.type === 'grid';

    return (
      <>
        <BlockEdit {...props} />
        <InspectorControls>
          {isGrid && (
            <PanelBody title="Grid Columns">
              {/* Grid-specific controls */}
            </PanelBody>
          )}
          <PanelBody title="Responsive Visibility">
            {/* Always show responsive controls */}
          </PanelBody>
        </InspectorControls>
      </>
    );
  }
));

// 3. Add classes on save
addFilter('blocks.getSaveContent.extraProps', 'dsg/group-save',
  (extraProps, blockType, attributes) => {
    if (blockType.name !== 'core/group') return extraProps;

    const { layout, dsgGridColumns } = attributes;
    const isGrid = layout?.type === 'grid';

    return {
      ...extraProps,
      className: classnames(extraProps.className, {
        'dsg-grid-enhanced': isGrid,
        [`dsg-grid-cols-${dsgGridColumns}`]: isGrid,
      }),
    };
  }
);
```

## CSS Strategy

WordPress handles base layout:
```scss
// WordPress does this automatically
.wp-block-group {
  display: grid; // or flex, based on toolbar selection
}
```

We handle responsive enhancements:
```scss
// We add column count control
.dsg-grid-cols-3 {
  grid-template-columns: repeat(3, 1fr) !important;
}

@media (max-width: 1023px) {
  .dsg-grid-cols-tablet-2 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
```

## Block Variations Best Practices

### Use WordPress Layout
```javascript
// ✅ GOOD - Uses WordPress layout system
attributes: {
  layout: {
    type: 'grid',
    columnCount: 3,
  },
}

// ❌ BAD - Custom layout that conflicts
attributes: {
  dsgLayoutType: 'grid',
}
```

### Set Responsive Defaults
```javascript
// ✅ GOOD - Pre-configure responsive columns
attributes: {
  layout: { type: 'grid' },
  dsgGridColumns: 3,
  dsgGridColumnsTablet: 2,
  dsgGridColumnsMobile: 1,
}
```

## Common Patterns

### Hero Section (Centered Content)
```javascript
layout: {
  type: 'flex',
  orientation: 'vertical',
  justifyContent: 'center',
  verticalAlignment: 'center',
}
```

### 3-Column Feature Grid
```javascript
layout: {
  type: 'grid',
  columnCount: 3,
}
```

### Side-by-Side Layout
```javascript
layout: {
  type: 'flex',
  orientation: 'horizontal',
  verticalAlignment: 'center',
}
```

### Auto-Responsive Cards
```javascript
layout: {
  type: 'grid',
  columnCount: null,
  minimumColumnWidth: '250px', // Auto-fit
}
```

## Testing Checklist

When adding new Group enhancements:

- [ ] Does it work with WordPress toolbar icons?
- [ ] Are controls only shown when relevant?
- [ ] Does it respect WordPress layout choice?
- [ ] Is it responsive (desktop/tablet/mobile)?
- [ ] Does it work in variations?
- [ ] Does it save/load correctly?
- [ ] Does it work with any theme?

## Future Extensions

Using this pattern, we can extend:

### Group Block
- ✅ Responsive grid columns (done)
- ✅ Responsive visibility (done)
- 🔄 Animation on scroll
- 🔄 Sticky positioning
- 🔄 Background effects

### Heading Block
- 🔄 Gradient text
- 🔄 Text shadow effects
- 🔄 Icon integration
- 🔄 Subtitle support

### Button Block
- 🔄 Icon position (left/right)
- 🔄 Hover effects
- 🔄 Advanced styling
- 🔄 Loading states

### Image Block
- 🔄 Lightbox functionality
- 🔄 Hover overlays
- 🔄 Parallax effects
- 🔄 Shape masks

## Documentation

- `docs/BLOCK-EXTENSION-STRATEGY.md` - Overall extension strategy
- `docs/EXTENSION-VS-CUSTOM-BLOCKS.md` - Comparison analysis
- `docs/WORKING-WITH-WORDPRESS-LAYOUTS.md` - Layout integration guide

## Build Configuration

Uses custom webpack config to build both blocks AND extensions:

```javascript
// webpack.config.js
entry: {
  index: 'src/index.js',        // Extensions & variations
  ...defaultConfig.entry,       // Auto-detected blocks
}
```

Output:
```
build/
├── index.js              ← Extensions loaded in editor
├── index.css             ← Extension editor styles
├── style-index.css       ← Extension frontend styles
└── blocks/
    └── container/        ← Individual block files
```

## Key Principles

1. **Extend, don't replace** - Work with WordPress, not against it
2. **Conditional controls** - Only show what's relevant
3. **Respect native UX** - Use WordPress patterns
4. **Think responsive** - Mobile-first approach
5. **Future-proof** - WordPress updates benefit us

## Common Pitfalls to Avoid

❌ **Don't:**
- Create layout selectors that conflict with toolbar
- Add controls that duplicate WordPress
- Override WordPress CSS without `!important`
- Ignore WordPress layout attribute
- Create custom layout systems

✅ **Do:**
- Check `layout.type` before showing controls
- Enhance WordPress layouts, don't replace them
- Use WordPress layout attribute in variations
- Show controls conditionally based on context
- Work with toolbar, not against it

---

**Remember:** The goal is to make DesignSetGo feel like a natural, seamless enhancement to WordPress - not a separate, competing system.
