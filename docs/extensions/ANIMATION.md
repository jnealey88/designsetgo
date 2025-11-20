# Animation Extension - User Guide

**Compatible With**: Manual data attributes only (no UI controls)
**Since**: 1.0.0
**Status**: Placeholder for future development

## Overview

The **Animation Extension** is a lightweight, frontend-only animation system that triggers on page load. Currently supports manual data attribute configuration only. Full block editor controls are planned for a future release.

**Current Features:**
- Load-triggered animations (DOMContentLoaded)
- Manual data attribute configuration
- Duration, delay, and easing controls
- CSS-based animations (performant)

**Planned Features:**
- Block editor controls for animation settings
- Scroll-triggered animations (Intersection Observer)
- Animation presets (fade, slide, zoom, etc.)
- Visual animation picker

## 🚀 Current Usage (Manual)

Add data attributes directly to blocks via Custom HTML or Custom CSS extension:

```html
<div data-dsgo-animation="fade-in"
     data-dsgo-animation-duration="500"
     data-dsgo-animation-delay="100"
     data-dsgo-animation-easing="ease-in-out">
  Content here
</div>
```

## ⚙️ Data Attributes

### Available Attributes
- `data-dsgo-animation`: Animation type (currently no presets, custom CSS required)
- `data-dsgo-animation-duration`: Duration in milliseconds (default: 500)
- `data-dsgo-animation-delay`: Delay before animation starts in milliseconds (default: 0)
- `data-dsgo-animation-easing`: CSS timing function (default: ease-in-out)

### Supported Easing
- `ease`
- `ease-in`
- `ease-out`
- `ease-in-out`
- `linear`
- Custom cubic-bezier (e.g., `cubic-bezier(0.4, 0, 0.2, 1)`)

## 💡 Use Cases (Future)

### 1. Hero Section Load Animations
Fade in hero content when page loads.

### 2. Staggered Content Reveals
Sequential animations with delays for cascading effect.

### 3. Scroll-Triggered Animations
Animate blocks when they enter viewport (planned).

## ✅ Best Practices

**DO:**
- Wait for full editor controls before heavy use
- Use Custom CSS extension for complex animations
- Consider Block Animations extension for current needs
- Keep durations reasonable (300-800ms)

**DON'T:**
- Rely on this for production sites (incomplete)
- Expect UI controls (not yet implemented)
- Use for critical content animations

## 💡 Alternative: Block Animations Extension

For full-featured animations with editor controls, use the **Block Animations Extension** instead:
- Scroll-triggered and load-triggered
- 20+ animation presets
- Full editor UI
- Entrance and exit animations
- Production-ready

See: `/docs/extensions/BLOCK-ANIMATIONS.md`

## Roadmap

### Version 1.1 (Planned)
- [ ] Block editor controls (InspectorControls panel)
- [ ] Animation preset library (fade, slide, zoom, rotate)
- [ ] Visual animation preview in editor
- [ ] Scroll-triggered animations (Intersection Observer)

### Version 1.2 (Future)
- [ ] Custom animation builder
- [ ] Keyframe editor
- [ ] Animation timeline
- [ ] Advanced easing options

## Technical Notes

- Currently frontend-only (JavaScript on DOMContentLoaded)
- Applies CSS animation properties via inline styles
- No database attributes (manual data attributes only)
- Placeholder for future full-featured animation system
- Consider using Block Animations extension for production needs
