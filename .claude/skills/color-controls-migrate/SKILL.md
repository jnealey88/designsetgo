---
name: color-controls-migrate
description: Migrate blocks from PanelColorSettings to ColorGradientSettingsDropdown
argument-hint: [block-name]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(npm run build)
---


Migrate blocks to use the modern `ColorGradientSettingsDropdown` component instead of deprecated `PanelColorSettings`.

## Why This Matters

Per [CLAUDE.md](../.claude/CLAUDE.md#color-controls---critical-pattern):

- `PanelColorSettings` is **deprecated** and will be removed
- `ColorGradientSettingsDropdown` is the WordPress standard
- Appears in **Styles tab** (where users expect color controls)
- Better integration with theme colors and gradients
- Native clear/reset functionality

## Ask User

Which block needs migration?

- Provide block name (e.g., "countdown-timer", "progress-bar", "slider")

## Migration Steps

### 1. Update Imports

```javascript
// ❌ REMOVE
import { PanelColorSettings } from '@wordpress/block-editor';

// ✅ ADD
import {
    InspectorControls,
    // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
```

### 2. Add clientId Parameter

**CRITICAL:** Edit function MUST accept `clientId`

```javascript
// ❌ BEFORE
export default function MyBlockEdit({ attributes, setAttributes }) {

// ✅ AFTER
export default function MyBlockEdit({ attributes, setAttributes, clientId }) {
```

### 3. Add Hook for Theme Colors

```javascript
// Add this inside your edit function
const colorGradientSettings = useMultipleOriginColorsAndGradients();
```

### 4. Replace Component

```javascript
// ❌ OLD - Settings tab with PanelColorSettings
<InspectorControls>
    <PanelColorSettings
        title={__('Colors', 'designsetgo')}
        colorSettings={[
            {
                value: textColor,
                onChange: (color) => setAttributes({ textColor: color }),
                label: __('Text Color', 'designsetgo'),
            },
            {
                value: backgroundColor,
                onChange: (color) => setAttributes({ backgroundColor: color }),
                label: __('Background Color', 'designsetgo'),
            },
        ]}
    />
</InspectorControls>

// ✅ NEW - Styles tab with ColorGradientSettingsDropdown
<InspectorControls group="color">
    <ColorGradientSettingsDropdown
        panelId={clientId}
        title={__('Colors', 'designsetgo')}
        settings={[
            {
                label: __('Text Color', 'designsetgo'),
                colorValue: textColor,
                onColorChange: (color) =>
                    setAttributes({ textColor: color || '' }),
                clearable: true,
            },
            {
                label: __('Background Color', 'designsetgo'),
                colorValue: backgroundColor,
                onColorChange: (color) =>
                    setAttributes({ backgroundColor: color || '' }),
                clearable: true,
            },
        ]}
        {...colorGradientSettings}
    />
</InspectorControls>
```

## Key Differences

| Old (PanelColorSettings) | New (ColorGradientSettingsDropdown) |
|-------------------------|-------------------------------------|
| `colorSettings` array | `settings` array |
| `value` property | `colorValue` property |
| `onChange` callback | `onColorChange` callback |
| In Settings tab | In Styles tab (`group="color"`) |
| No `panelId` required | Requires `panelId={clientId}` |
| Manual theme color handling | Auto theme colors via `{...colorGradientSettings}` |

## Conditional Color Controls

For colors that should only appear when a feature is enabled:

```javascript
{showArrows && (
    <InspectorControls group="color">
        <ColorGradientSettingsDropdown
            panelId={clientId}
            title={__('Arrow Colors', 'designsetgo')}
            settings={[
                {
                    label: __('Arrow Color', 'designsetgo'),
                    colorValue: arrowColor,
                    onColorChange: (color) =>
                        setAttributes({ arrowColor: color || '' }),
                    clearable: true,
                },
            ]}
            {...colorGradientSettings}
        />
    </InspectorControls>
)}
```

## Testing Checklist

After migration:

- [ ] Color picker appears in **Styles tab** (not Settings tab)
- [ ] Theme colors appear in color palette
- [ ] Custom colors can be selected
- [ ] Clear button works (resets to empty)
- [ ] Color applies to block immediately
- [ ] No console errors
- [ ] Frontend matches editor colors
- [ ] Block validates without errors

## Verification

Check that ALL blocks use the modern component:

```bash
# Should return 0 results
grep -r "PanelColorSettings" src/blocks/
```

## Current Status

Per [CLAUDE.md](../.claude/CLAUDE.md#color-controls---critical-pattern):

- ✅ All 13 blocks migrated (as of 2025-11-08)
- ✅ Zero instances of PanelColorSettings remaining
- ✅ All color controls in Styles tab

## Reference

See [CLAUDE.md](../.claude/CLAUDE.md#color-controls---critical-pattern) for the complete pattern and project status.
