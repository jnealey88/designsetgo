# Grid Mobile Order Extension

**Version:** 1.0.0
**Category:** Layout & Positioning

## Overview

The Grid Mobile Order extension allows you to control the visual stacking order of blocks inside a Grid container on mobile devices (screen width ≤ 767px). This solves the common problem of alternating-row layouts stacking in an undesirable order on small screens, without requiring any changes to the HTML structure.

Controls are only visible when a block is placed inside a `designsetgo/grid` container.

## Quick Start

1. Add a **Grid** container block
2. Add child blocks inside the grid
3. Select any child block
4. In the **Inspector Controls**, find the **Mobile Order** control
5. Set a value (0-10) — lower numbers appear first on mobile

## Settings

### Mobile Order

| Setting | Type | Default | Range | Description |
|---------|------|---------|-------|-------------|
| Mobile Order | Number | 1 | 0-10 | Controls the visual order of this item when the grid stacks on mobile |

- **0** moves the item to the top on mobile
- **Lower numbers** appear first
- **Reset button** returns the value to the default (1)
- Only visible when the block is inside a Grid container

## How It Works

The extension adds a `dsgoMobileOrder` attribute to blocks. On the frontend, this is output as a CSS custom property (`--dsgo-mobile-order`) which is applied via a media query:

```css
@media (max-width: 767px) {
  [style*="--dsgo-mobile-order"] {
    order: var(--dsgo-mobile-order);
  }
}
```

This approach:
- Only affects mobile layouts (≤ 767px)
- Uses CSS `order` property — no DOM reordering
- Has zero impact on desktop/tablet layouts
- Works with any block placed inside a Grid container

## Block Supports

This extension adds its attribute to all blocks (unless excluded via the Block Exclusion settings). However, the inspector control only renders when the block detects a `designsetgo/grid` parent.

## Common Use Cases

- **Hero sections**: Ensure the heading appears above the image on mobile even if the image is first in the grid
- **Alternating content rows**: Control which side appears first when columns stack
- **Feature grids**: Prioritize the most important features at the top on mobile
- **Card layouts**: Reorder cards for mobile reading flow

## Best Practices

- Use sparingly — natural document order is usually best
- Test on actual mobile viewports to verify the stacking behavior
- Remember that `order: 0` moves items before the default `order: 1`
- Screen readers follow DOM order, not visual order — keep accessibility in mind
