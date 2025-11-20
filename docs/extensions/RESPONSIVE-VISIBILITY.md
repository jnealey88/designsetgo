# Responsive Visibility Extension - User Guide

**Compatible With**: All blocks (core and DesignSetGo)
**Since**: 1.0.0

## Overview

The **Responsive Visibility Extension** allows you to hide blocks on specific devices (desktop, tablet, or mobile). Perfect for showing different content layouts on different screen sizes.

**Key Features:**
- Hide on desktop (≥1024px)
- Hide on tablet (768px - 1023px)
- Hide on mobile (<768px)
- Works with all blocks
- Visual indicators in editor
- Pure CSS (no JavaScript, fast)

## 🚀 Quick Start

1. Select any block (heading, image, group, etc.)
2. Open **Responsive Visibility** panel in sidebar
3. Toggle **Hide on Desktop**, **Tablet**, or **Mobile**
4. Editor shows badge indicating hidden devices (D/T/M)
5. Preview on frontend at different screen sizes

## ⚙️ Settings & Configuration

### Responsive Visibility Panel
- **Hide on Desktop**: Hide on screens ≥1024px wide
- **Hide on Tablet**: Hide on screens 768px - 1023px
- **Hide on Mobile**: Hide on screens <768px

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

### Editor Indicators
When block is hidden on any device, editor shows badge with letters:
- **D**: Hidden on Desktop
- **T**: Hidden on Tablet
- **M**: Hidden on Mobile

## 💡 Common Use Cases

### 1. Mobile-Specific CTAs
Show simplified CTA button on mobile, detailed version on desktop.

### 2. Image Variations
Show landscape image on desktop, portrait on mobile.

### 3. Navigation Menus
Hide desktop nav on mobile, show hamburger menu instead.

### 4. Content Simplification
Hide supplementary content (sidebars, extras) on mobile for focused reading.

### 5. Tablet Layouts
Create tablet-specific layouts between mobile and desktop.

## ✅ Best Practices

**DO:**
- Test at all breakpoints (use browser dev tools)
- Use for layout variations, not hiding critical content
- Provide alternative content for hidden blocks
- Check SEO impact (hidden content still in HTML)
- Combine with container width controls for adaptive layouts

**DON'T:**
- Hide navigation without replacement
- Hide conversion elements without mobile alternative
- Use to remove content from mobile (bad UX)
- Forget to test actual devices (not just browser resize)
- Rely solely on hiding (consider responsive design first)

## 💡 Tips & Tricks

- **Duplicate & Hide**: Create two versions of a block, hide each on different devices
- **Performance**: Uses CSS `display: none` (no JS, very fast)
- **SEO**: Hidden content still indexed by search engines
- **Editor Preview**: Badge shows which devices block is hidden on
- **Combine with Animations**: Hide/show with animations for smooth transitions
- **Debugging**: If block not hiding, check for CSS conflicts (!important)

## Technical Notes

- CSS classes: `.dsgo-hide-desktop`, `.dsgo-hide-tablet`, `.dsgo-hide-mobile`
- Uses `@media` queries for responsive behavior
- Content remains in DOM (accessibility tools can still read it)
- No JavaScript required (pure CSS solution)
- Works with all block types (native and third-party)
