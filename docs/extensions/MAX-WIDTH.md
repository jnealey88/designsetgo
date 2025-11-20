# Max Width Extension - User Guide

**Compatible With**: All blocks except Spacer, Separator, Navigation, Section, Row, Grid
**Since**: 1.0.0

## Overview

The **Max Width Extension** adds a max-width control to blocks, allowing you to constrain their width directly in the editor. Perfect for creating centered content columns, limiting line length for readability, or creating asymmetric layouts.

**Key Features:**
- Set max-width in px, em, rem, %, vw, vh
- Auto-centering (margin auto)
- Respects text/block alignment (left, center, right)
- Works with all non-container blocks
- Visual preview in editor

## 🚀 Quick Start

1. Select any block (paragraph, image, heading, etc.)
2. Open **Width** panel in sidebar
3. Set **Max width** (e.g., "600px", "80%", "40rem")
4. Block automatically centers with auto margins
5. Adjust alignment if needed (left, center, right)

## ⚙️ Settings & Configuration

### Width Panel
- **Max width**: Maximum width constraint (supports px, em, rem, %, vw, vh)
- Leave empty for no constraint (full width)

### Alignment Behavior
- **Center/No Alignment**: `margin: 0 auto` (centered)
- **Left Alignment**: `margin-left: 0, margin-right: auto`
- **Right Alignment**: `margin-left: auto, margin-right: 0`

### Excluded Blocks
- **Spacer/Separator**: Already have size controls
- **Navigation/Page List**: Navigation elements
- **Section/Row/Grid**: Container blocks have native width controls

## 💡 Common Use Cases

### 1. Readable Text Columns
Limit paragraph width to 600-750px for optimal reading (45-75 characters per line).

### 2. Centered Images
Set image max-width to 800px and center in wide container.

### 3. Asymmetric Layouts
Create left-aligned content at 70% width for modern editorial style.

### 4. Callout Boxes
Constrain width of background-colored groups for emphasis.

## ✅ Best Practices

**DO:**
- Use rem/em for scalable, accessible widths
- Limit text blocks to 600-750px for readability
- Use % widths for fluid, responsive designs
- Combine with alignment for asymmetric layouts
- Test at different viewport sizes

**DON'T:**
- Set max-width larger than container (no effect)
- Use on container blocks (use their native width controls)
- Forget to test on mobile (may need responsive adjustments)
- Use for every block (let content breathe)
- Mix units inconsistently (pick px OR rem, not both)

## 💡 Tips & Tricks

- **Readable Text**: 65 characters per line = ~600-750px (16px font)
- **Golden Ratio**: Use 61.8% width for aesthetically pleasing proportions
- **Viewport Units**: `80vw` creates width relative to viewport
- **Responsive**: Combine with Responsive Visibility for device-specific widths
- **Nested Blocks**: Max-width applies to block wrapper, not nested content
- **Debugging**: If no effect, check parent container constraints

## Technical Notes

- Applies inline styles to block wrapper (high specificity)
- Uses `!important` in editor for consistent preview
- Automatically adds auto margins for centering
- Container blocks (Section/Row/Grid) excluded (use native `contentWidth` attribute)
- Works with FSE and classic editor
