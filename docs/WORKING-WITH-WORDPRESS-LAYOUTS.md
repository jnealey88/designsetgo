# Working WITH WordPress Layout Controls

## The Problem We Had

Our first approach **fought against** WordPress's native Group block layout system:

❌ **What We Did Wrong:**
- Created duplicate layout controls (Flexbox, Grid, Auto-Grid)
- Added our own layout type selector
- Competed with WordPress toolbar icons
- Confusing UX - two ways to do the same thing

## The Better Approach

**Work WITH WordPress, not against it.**

✅ **What We Do Now:**
- Use WordPress's native layout system (toolbar icons)
- **Enhance** it with additional features
- No duplicate controls
- Unified, familiar UX

---

## WordPress Group Block Layout System

### Toolbar Icons (Native WordPress)

The Group block has 4 layout modes in the toolbar:

```
[□] Flow      - Default stacked layout
[⊟] Flex Row  - Horizontal flexbox
[⊞] Flex Col  - Vertical flexbox
[▦] Grid      - CSS Grid
```

### What WordPress Handles

When you click these toolbar icons, WordPress:
- Sets `layout.type` to 'default', 'flex', or 'grid'
- Sets `layout.orientation` for flex (horizontal/vertical)
- Adds controls to sidebar for justify/align
- Applies the CSS automatically

### What DesignSetGo Adds

We **enhance** the native system:

**For Grid Layouts:**
- ✅ Responsive column count (desktop, tablet, mobile)
- ✅ More granular control (1-6 columns)

**For All Layouts:**
- ✅ Responsive visibility (hide on devices)
- ✅ Animation settings (future)
- ✅ Advanced spacing (future)

---

## User Experience Flow

### Old Approach (Conflicting):
```
1. User clicks Grid icon in toolbar → WordPress sets display:grid
2. User sees "DesignSetGo Layout" panel
3. User changes to "Flexbox" → CONFLICT!
4. Layout breaks, confusion ensues
```

### New Approach (Harmonious):
```
1. User clicks Grid icon in toolbar → WordPress sets display:grid
2. User sees "Grid Columns" panel (DesignSetGo)
3. User sets 3 columns desktop, 2 tablet, 1 mobile
4. Everything works together ✅
```

---

## Technical Implementation

### WordPress Layout Attribute

```javascript
{
  layout: {
    type: 'grid',              // grid | flex | default
    orientation: 'horizontal', // for flex only
    columnCount: 3,            // for grid
    minimumColumnWidth: null,  // for auto-grid
  }
}
```

### Our Enhancement Attributes

```javascript
{
  // Only shown when layout.type === 'grid'
  dsgGridColumns: 3,        // Desktop columns
  dsgGridColumnsTablet: 2,  // Tablet columns
  dsgGridColumnsMobile: 1,  // Mobile columns

  // Always available
  dsgHideOnDesktop: false,
  dsgHideOnTablet: false,
  dsgHideOnMobile: false,
}
```

### CSS Strategy

WordPress handles the base layout:
```scss
.wp-block-group {
  display: grid; // WordPress does this
}
```

We handle the enhancements:
```scss
.dsg-grid-cols-3 {
  grid-template-columns: repeat(3, 1fr) !important;
}

@media (max-width: 1023px) {
  .dsg-grid-cols-tablet-2 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
```

---

## Controls Visibility Logic

```javascript
// Only show grid controls if WordPress layout is grid
const isGridLayout = layout?.type === 'grid';

{isGridLayout && (
  <PanelBody title="Grid Columns">
    <RangeControl label="Desktop Columns" ... />
    <RangeControl label="Tablet Columns" ... />
    <RangeControl label="Mobile Columns" ... />
  </PanelBody>
)}

// Always show responsive visibility
<PanelBody title="Responsive Visibility">
  <ToggleControl label="Hide on Desktop" ... />
  <ToggleControl label="Hide on Tablet" ... />
  <ToggleControl label="Hide on Mobile" ... />
</PanelBody>
```

---

## Block Variations

Variations now use WordPress's native layout attribute:

### Hero Section (Flex Column)
```javascript
attributes: {
  layout: {
    type: 'flex',
    orientation: 'vertical',
    justifyContent: 'center',
    verticalAlignment: 'center',
  },
}
```

### 3-Column Grid
```javascript
attributes: {
  layout: {
    type: 'grid',
    columnCount: 3,
  },
  dsgGridColumns: 3,
  dsgGridColumnsTablet: 2,
  dsgGridColumnsMobile: 1,
}
```

### Side by Side (Flex Row)
```javascript
attributes: {
  layout: {
    type: 'flex',
    orientation: 'horizontal',
    verticalAlignment: 'center',
  },
}
```

---

## Benefits of This Approach

### 1. Familiar UX
- Users already know WordPress toolbar
- No learning curve
- Consistent with WordPress patterns

### 2. No Conflicts
- WordPress handles base layout
- We enhance, not replace
- Everything works together

### 3. Theme Compatible
- WordPress layout system is universal
- Themes already style it
- Our enhancements layer on top

### 4. Future Proof
- WordPress updates the layout system
- We benefit automatically
- Less maintenance

### 5. Less Code
- Don't rebuild what exists
- Focus on unique features
- Smaller bundle size

---

## What You'll See in the Editor

### Toolbar (WordPress Native)
```
[□ Flow] [⊟ Flex Row] [⊞ Flex Col] [▦ Grid]
```
User clicks these to switch layout type.

### Sidebar Panels

**When Grid is Active:**
```
├── Layout (WordPress)
│   └── Column count, gap controls
├── Grid Columns (DesignSetGo) ⭐
│   ├── Desktop: 3 columns
│   ├── Tablet: 2 columns
│   └── Mobile: 1 column
└── Responsive Visibility (DesignSetGo) ⭐
    ├── Hide on Desktop
    ├── Hide on Tablet
    └── Hide on Mobile
```

**When Flex is Active:**
```
├── Layout (WordPress)
│   ├── Orientation
│   ├── Justify
│   └── Align
└── Responsive Visibility (DesignSetGo) ⭐
    ├── Hide on Desktop
    ├── Hide on Tablet
    └── Hide on Mobile
```

---

## Testing Guide

### Test 1: Grid Enhancement
1. Insert Group block
2. Click **Grid** icon in toolbar
3. Sidebar shows **Grid Columns** panel
4. Set Desktop: 3, Tablet: 2, Mobile: 1
5. Add 6 blocks inside
6. **Desktop:** 3 columns (2 rows)
7. **Tablet:** 2 columns (3 rows)
8. **Mobile:** 1 column (6 rows)

### Test 2: Flex Enhancement
1. Insert Group block
2. Click **Flex Row** icon in toolbar
3. Sidebar shows WordPress Layout panel
4. No Grid Columns panel (correct!)
5. Add 3 blocks inside
6. They appear horizontally

### Test 3: Responsive Visibility
1. Insert any Group variation
2. Open **Responsive Visibility** panel
3. Toggle "Hide on Mobile"
4. Preview on mobile → block is hidden ✅

### Test 4: Variations
1. Search "grid" → Insert 3-Column Grid
2. Automatically has Grid layout active
3. Grid Columns panel shows 3/2/1 preset
4. Toolbar shows Grid icon selected

---

## Future Enhancements

Using this pattern, we can add:

### Grid
- ✅ Responsive columns (done)
- 🔄 Row gap vs column gap
- 🔄 Auto-flow (row vs column)
- 🔄 Masonry layout option

### Flex
- 🔄 Flex wrap control
- 🔄 Gap per direction
- 🔄 Flex grow/shrink per item

### All Layouts
- 🔄 Animation on scroll
- 🔄 Sticky positioning
- 🔄 Background effects
- 🔄 Custom breakpoints

---

## Key Principles

1. **Use WordPress layout attribute** - Don't create custom layout types
2. **Detect layout type** - Show relevant controls only
3. **Enhance, don't replace** - Add features, not duplicate them
4. **Respect the toolbar** - Let WordPress handle layout switching
5. **Think responsive** - Make layouts work on all devices

---

## Summary

✅ **DO:**
- Use WordPress `layout` attribute
- Show controls conditionally based on layout type
- Enhance with responsive features
- Work with the toolbar icons

❌ **DON'T:**
- Create custom layout type selectors
- Duplicate WordPress controls
- Fight with native functionality
- Confuse users with conflicting options

This approach makes DesignSetGo feel like a **natural extension** of WordPress rather than a separate system.
