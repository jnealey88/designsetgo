# Block Animations Extension - User Guide

**Compatible With**: All blocks (core and DesignSetGo)
**Since**: 1.0.0

## Overview

The **Block Animations Extension** adds entrance and exit animations to any WordPress block. Animate blocks when they scroll into view or when the page loads, creating engaging, dynamic page experiences.

**Key Features:**
- Scroll-triggered or load-triggered animations
- 20+ entrance and exit animation presets
- Full control over duration, delay, and easing
- Works with all blocks (paragraphs, images, containers, etc.)
- Animate once or repeat on scroll
- Intersection Observer API (performant, no janky scrolling)

## 🚀 Quick Start

1. Select any block (heading, image, section, etc.)
2. Open the **Block Animations** panel in sidebar (or use toolbar icon)
3. Toggle **Enable Animation**
4. Choose an **Entrance Animation** (e.g., "Fade Up")
5. Preview on frontend by scrolling the block into view

## ⚙️ Settings & Configuration

### Animation Controls
- **Enable Animation**: Toggle animations on/off
- **Entrance Animation**: Animation when block enters viewport (fade, slide, zoom, rotate, bounce, etc.)
- **Exit Animation**: Optional animation when block leaves viewport
- **Trigger**: When animation fires (scroll into view, page load)
- **Duration**: Animation speed in milliseconds (default: 800ms)
- **Delay**: Wait time before animation starts (default: 0ms)
- **Easing**: Timing function (ease, ease-in, ease-out, linear, etc.)
- **Offset**: Distance from viewport edge before trigger (default: 100px)
- **Animate Once**: If true, animation plays once. If false, repeats on every scroll.

### Animation Presets
**Entrance**: Fade, Fade Up, Fade Down, Fade Left, Fade Right, Slide Up, Slide Down, Slide Left, Slide Right, Zoom In, Zoom Out, Flip, Rotate, Bounce, and more.

**Exit**: Same options, applied when scrolling away.

## 💡 Common Use Cases

### 1. Hero Section Entrance
Fade in headings and buttons when page loads to capture attention.

### 2. Feature Cards
Stagger multiple cards with delays (100ms, 200ms, 300ms) for cascading effect.

### 3. Statistics/Counters
Zoom in stats blocks when they scroll into view for emphasis.

### 4. Call-to-Action
Bounce or pulse CTA buttons to draw the eye.

## ✅ Best Practices

**DO:**
- Use subtle animations (800ms or less) for professional feel
- Stagger delays for multiple blocks (creates flow)
- Test on mobile (animations still smooth)
- Combine with reveal-on-scroll for progressive disclosure
- Use "Animate Once" for most cases (avoids distraction)

**DON'T:**
- Animate every block (overwhelming, slows perceived performance)
- Use long durations (>1500ms feels sluggish)
- Mix too many different animation types on one page
- Rely on animations for critical content (accessibility)
- Use exit animations for navigation blocks

## 💡 Tips & Tricks

- **Cascading Effect**: Select multiple blocks, apply same animation, but increment delays (0ms, 100ms, 200ms)
- **Performance**: Animations use CSS transforms (GPU accelerated)
- **Accessibility**: Respects `prefers-reduced-motion` media query
- **Debugging**: If animation doesn't play, check offset value (may be too high)
- **Page Load Trigger**: Great for above-the-fold hero sections
- **Scroll Trigger**: Best for content below the fold
