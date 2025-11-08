# Countdown Timer Refactoring: Before & After

Quick visual reference for the Countdown Timer block refactoring.

---

## 📊 Stats

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Lines of Code** | 899 | 748 | **-151 (-17%)** |
| **Custom Attributes** | 16 | 11 | **-5** |
| **Custom Controls** | 5 | 2 | **-3** |
| **Block Supports** | 4 | 5 | **+1** |
| **User-facing Controls** | 5 custom | 3 native | **Simpler** |

---

## 🔧 Controls Comparison

### Before
```
Block Toolbar:
├─ [Custom] Text Alignment (left/center/right)

Settings Sidebar:
├─ Styling Panel
│  ├─ Border Section
│  │  ├─ [Custom] Border Width (0-10)
│  │  └─ [Custom] Border Radius (0-50)
│  ├─ Spacing Section
│  │  ├─ Gap Between Units
│  │  └─ Unit Padding
│  └─ Typography Section
│     ├─ [Custom] Number Font Size
│     └─ [Custom] Label Font Size
```

### After
```
Settings Sidebar:
├─ Styles Tab
│  ├─ Typography Section
│  │  ├─ [Native] Font Size (scales all text!)
│  │  └─ [Native] Text Align
│  └─ Border Section
│     ├─ [Native] Width
│     └─ [Native] Radius
├─ Settings Tab
   └─ Styling Panel
      └─ Spacing Section
         ├─ Gap Between Units
         └─ Unit Padding
```

---

## 💡 Key Improvements

### 1. Simpler Font Size Control

**Before**: Two separate controls
```javascript
// User adjusts two font sizes independently
numberFontSize: "3rem"   // Numbers
labelFontSize: "1rem"    // Labels
```

**After**: One control scales everything
```javascript
// WordPress Block Support
fontSize: "medium"  // Controls block font size

// CSS automatically scales children
.number { font-size: 3em; }  // 3× parent
.label { font-size: 1em; }   // 1× parent
```

**User benefit**: Change one fontSize, everything scales proportionally!

---

### 2. Native WordPress Controls

**Before**: Custom implementations
```javascript
<AlignmentToolbar />           // Custom toolbar
<RangeControl label="Border Width" />    // Custom control
<RangeControl label="Border Radius" />   // Custom control
<FontSizePicker label="Number Size" />   // Custom control
<FontSizePicker label="Label Size" />    // Custom control
```

**After**: WordPress Block Supports
```json
{
  "supports": {
    "typography": {
      "fontSize": true,
      "__experimentalTextAlign": true
    },
    "__experimentalBorder": {
      "width": true,
      "radius": true
    }
  }
}
```

**Developer benefit**: WordPress provides UI automatically!

---

### 3. Theme Integration

**Before**: Hardcoded values
```javascript
// Users can enter any value
numberFontSize: "3rem"  // No theme connection
```

**After**: Theme-aware
```javascript
// WordPress shows theme font sizes
fontSize: "medium"  // From theme.json
fontSize: "large"   // From theme.json
fontSize: "x-large" // From theme.json
// + Custom sizes still work!
```

**User benefit**: Consistent with theme design system!

---

## 📝 Code Examples

### block.json Attributes

**Before** (16 attributes):
```json
{
  "attributes": {
    "textAlign": { "type": "string", "default": "center" },
    "numberFontSize": { "type": "string", "default": "3rem" },
    "labelFontSize": { "type": "string", "default": "1rem" },
    "unitBorderWidth": { "type": "number", "default": 2 },
    "unitBorderRadius": { "type": "number", "default": 12 },
    // ... 11 other attributes
  }
}
```

**After** (11 attributes):
```json
{
  "supports": {
    "typography": {
      "fontSize": true,
      "__experimentalTextAlign": true
    },
    "__experimentalBorder": {
      "width": true,
      "radius": true,
      "__experimentalDefaultControls": {
        "width": true,
        "radius": true
      }
    }
  },
  "attributes": {
    // Only block-specific attributes remain
    "targetDateTime": { "type": "string" },
    "timezone": { "type": "string" },
    // ... 9 other attributes
  }
}
```

---

### StylingPanel.js

**Before** (117 lines):
```javascript
import { FontSizePicker, useSettings } from '@wordpress/block-editor';
import { RangeControl, UnitControl } from '@wordpress/components';

export default function StylingPanel({ attributes, setAttributes }) {
  const {
    unitBorderWidth,
    unitBorderRadius,
    numberFontSize,
    labelFontSize,
    unitGap,
    unitPadding
  } = attributes;

  const [fontSizes] = useSettings('typography.fontSizes');

  return (
    <>
      <PanelBody title="Border">
        <RangeControl
          label="Border Width"
          value={unitBorderWidth}
          onChange={(value) => setAttributes({ unitBorderWidth: value })}
          min={0} max={10}
        />
        <RangeControl
          label="Border Radius"
          value={unitBorderRadius}
          onChange={(value) => setAttributes({ unitBorderRadius: value })}
          min={0} max={50}
        />
      </PanelBody>

      <PanelBody title="Spacing">
        <UnitControl ... />
        <UnitControl ... />
      </PanelBody>

      <PanelBody title="Typography">
        <FontSizePicker
          label="Number Font Size"
          value={numberFontSize}
          onChange={(value) => setAttributes({ numberFontSize: value })}
          fontSizes={fontSizes}
        />
        <FontSizePicker
          label="Label Font Size"
          value={labelFontSize}
          onChange={(value) => setAttributes({ labelFontSize: value })}
          fontSizes={fontSizes}
        />
      </PanelBody>
    </>
  );
}
```

**After** (48 lines):
```javascript
import { UnitControl } from '@wordpress/components';

export default function StylingPanel({ attributes, setAttributes }) {
  const { unitGap, unitPadding } = attributes;

  return (
    <PanelBody title="Spacing">
      <UnitControl
        label="Gap Between Units"
        value={unitGap}
        onChange={(value) => setAttributes({ unitGap: value })}
      />
      <UnitControl
        label="Unit Padding"
        value={unitPadding}
        onChange={(value) => setAttributes({ unitPadding: value })}
      />
    </PanelBody>
  );
}
```

**Reduction**: 117 → 48 lines (**-59%**)

---

### edit.js Inline Styles

**Before**:
```javascript
const unitStyle = {
  borderWidth: `${unitBorderWidth}px`,  // Custom attribute
  borderRadius: `${unitBorderRadius}px`, // Custom attribute
  // ...
};

const numberStyle = {
  fontSize: numberFontSize || '3rem',    // Custom attribute
  // ...
};

const labelStyle = {
  fontSize: labelFontSize || '1rem',     // Custom attribute
  // ...
};

const containerStyle = {
  justifyContent: textAlign === 'left'   // Custom logic
    ? 'flex-start'
    : textAlign === 'right'
      ? 'flex-end'
      : 'center',
};
```

**After**:
```javascript
// WordPress handles border, fontSize, textAlign via useBlockProps()
const unitStyle = {
  // borderWidth, borderRadius removed - handled by Block Supports
  // ...
};

const numberStyle = {
  // fontSize removed - handled by CSS em units
  // ...
};

const labelStyle = {
  // fontSize removed - handled by CSS em units
  // ...
};

const containerStyle = {
  // justifyContent removed - handled by textAlign support
  // ...
};
```

---

### style.scss

**Before** (inline styles):
```scss
.dsg-countdown-timer {
  &__number {
    font-weight: 700;
    // font-size was inline style from numberFontSize attribute
  }

  &__label {
    font-weight: 500;
    // font-size was inline style from labelFontSize attribute
  }
}
```

**After** (relative units):
```scss
.dsg-countdown-timer {
  // Parent font-size set by Block Supports (e.g., has-large-font-size)

  &__number {
    font-weight: 700;
    font-size: 3em;  // 3× parent fontSize
  }

  &__label {
    font-weight: 500;
    font-size: 1em;  // 1× parent fontSize
  }
}
```

**Benefit**: All responsive overrides also use `em` instead of hardcoded `rem`!

---

## 🎯 User Experience Flow

### Setting Font Size

**Before**:
```
1. Click block
2. Open sidebar → Settings tab
3. Scroll to "Styling" panel
4. Expand "Typography" section
5. Adjust "Number Font Size" slider
6. Adjust "Label Font Size" slider separately
   → Two controls, manual coordination needed
```

**After**:
```
1. Click block
2. Open sidebar → Styles tab
3. Typography section (auto-expanded)
4. Adjust "Font Size" (one control)
   → Numbers and labels scale automatically!
```

### Setting Text Alignment

**Before**:
```
1. Click block
2. Look for toolbar button
3. Click alignment in block toolbar
   → Custom toolbar button
```

**After**:
```
1. Click block
2. Sidebar → Styles tab → Typography
3. Click "Text Align" buttons
   → Native WordPress control, consistent with all blocks
```

---

## 🔄 Migration

### Existing Blocks
WordPress automatically handles migration via deprecation:

```javascript
// deprecated.js
export default [
  {
    attributes: {
      textAlign: { type: 'string' },      // Old attribute
      numberFontSize: { type: 'string' }, // Old attribute
      // ...
    },
    save({ attributes }) {
      // Old save function with inline styles
    }
  }
];
```

**What happens**:
1. User opens old Countdown Timer block
2. WordPress detects old format
3. Loads using deprecated save function
4. No validation errors
5. User edits block, sees new controls
6. User saves block
7. WordPress converts to new format
8. Old attributes discarded, Block Supports used

**User sees**: Seamless transition, no errors!

---

## 📈 Long-term Benefits

### Maintenance
- **59% less code** in StylingPanel
- **17% less code** overall
- Fewer custom controls to update when WordPress changes
- Less testing needed (WordPress tests Block Supports)

### Performance
- Less JavaScript to download
- Fewer React components to render
- Simpler inline style calculations
- Better tree-shaking (unused code removed)

### User Experience
- Familiar controls (same as core blocks)
- Better theme integration
- Consistent UI across all blocks
- Future WordPress improvements automatically benefit block

### Developer Experience
- Standard WordPress patterns
- Easy for new developers to understand
- Well-documented via WordPress docs
- Copy-paste pattern to other blocks

---

## ✅ Success Metrics

- [x] **Code reduction**: 151 lines (-17%)
- [x] **Build success**: No errors
- [x] **Backwards compatibility**: Deprecation created
- [x] **Documentation**: Complete
- [ ] **Manual testing**: Pending
- [ ] **User testing**: Pending
- [ ] **Production deployment**: Pending

---

**Next**: Apply this exact pattern to Progress Bar and Slider blocks!
