# Sticky Header

The Sticky Header feature allows you to make your site's header sticky (fixed to the top of the viewport) as users scroll down the page.

## What is a Sticky Header?

A sticky header remains visible at the top of the screen when users scroll down your page. This improves navigation accessibility and keeps your branding visible throughout the visitor's journey.

## Features

- **Easy Activation**: Enable with a single toggle in the Site Editor
- **Scroll Effects**: Multiple visual effects when scrolling (shadow, shrink, hide on scroll, background change)
- **Mobile Control**: Option to disable sticky behavior on mobile devices
- **Smooth Animations**: Configurable transition speed for all effects
- **WordPress Integration**: Works seamlessly with the WordPress admin bar

## How to Enable Sticky Header

### Prerequisites

Your site must be using:
- A block theme (Twenty Twenty-Five, etc.)
- Full Site Editing (FSE)
- The header must be in a Template Part

### Step-by-Step Guide

1. **Open the Site Editor**
   - Go to **Appearance** → **Editor** in your WordPress admin
   - Or click **Edit Site** from the admin toolbar

2. **Select Your Header Template Part**
   - Click on your header area
   - Make sure you're selecting the **Template Part**, not just a block inside it
   - You should see "Template Part" in the block toolbar

3. **Open Settings Sidebar**
   - If not already visible, open the Settings sidebar (gear icon in top-right)

4. **Find Sticky Header Settings**
   - Scroll down in the Settings sidebar
   - Look for the **"Sticky Header"** panel
   - Click to expand it if closed

5. **Enable Sticky Header**
   - Toggle **"Enable Sticky Header"** to ON
   - The header will now stick to the top when scrolling

6. **Save Your Changes**
   - Click **Save** in the top-right corner

## Configuration Options

### Basic Settings

**Enable Sticky Header**
- Toggle on/off to enable/disable the sticky behavior
- Default: Off

**Disable on Mobile**
- When enabled, header returns to normal (non-sticky) behavior on mobile devices (<768px)
- Useful if you have a mobile menu or want to save screen space
- Default: Off

**Z-Index**
- Controls the stacking order (which elements appear above/below the header)
- Higher values = header appears above more elements
- Default: 100
- Range: 1-9999

**Transition Speed**
- How fast the animations/transitions occur (in seconds)
- Default: 0.3s
- Range: 0.1s - 2.0s

### Scroll Effects

**Add Shadow on Scroll**
- Adds a drop shadow when user scrolls down
- Options:
  - None (no shadow)
  - Small (subtle shadow: 0 2px 4px)
  - Medium (moderate shadow: 0 4px 6px)
  - Large (prominent shadow: 0 10px 15px)
- Adapts to dark mode automatically
- Default: None

**Shrink on Scroll**
- Reduces header height when user scrolls down
- Scale amount: 0.5 - 1.0 (default: 0.8 = 80% of original height)
- Smoothly animates the transformation
- Content scales proportionally
- Default: Off

**Hide When Scrolling Down**
- Hides header when user scrolls down
- Reappears when user scrolls up
- Great for maximizing content space
- Default: Off

**Change Background on Scroll**
- Changes header background color when scrolling
- Default color: Semi-transparent white (rgba(255, 255, 255, 0.95))
- Adapts to dark mode (becomes semi-transparent black)
- Click color swatch to customize
- Default: Off

## Use Cases

### Basic Sticky Header
**Goal**: Keep navigation visible while scrolling

**Settings**:
- Enable Sticky Header: ✅
- All scroll effects: Off

### Shrinking Header
**Goal**: Save space while keeping header visible

**Settings**:
- Enable Sticky Header: ✅
- Shrink on Scroll: ✅
- Scale Amount: 0.8

### Auto-Hide Header
**Goal**: Maximize content space, show header when user wants to navigate

**Settings**:
- Enable Sticky Header: ✅
- Hide When Scrolling Down: ✅
- Add Shadow on Scroll: Small

### Full-Featured Sticky Header
**Goal**: Professional look with multiple effects

**Settings**:
- Enable Sticky Header: ✅
- Add Shadow on Scroll: Medium
- Shrink on Scroll: ✅ (scale: 0.8)
- Change Background on Scroll: ✅
- Transition Speed: 0.3s

## Troubleshooting

### Header Doesn't Stick

**Problem**: Toggle is on but header scrolls away

**Solutions**:
1. Make sure you're editing the **Template Part**, not just a block inside it
2. Verify you're using a block theme with FSE
3. Check that your header is in a Template Part (not just a regular Group block)
4. Try saving and refreshing the page

### Header Covers Content

**Problem**: Sticky header overlaps page content

**Solutions**:
1. Increase the Z-Index value
2. Check your theme's CSS for conflicting styles
3. Ensure your content has appropriate top padding/margin

### Effects Not Working

**Problem**: Scroll effects (shadow, shrink, etc.) aren't appearing

**Solutions**:
1. Clear your browser cache
2. Try a hard refresh (Cmd/Ctrl + Shift + R)
3. Check browser console for JavaScript errors
4. Ensure "Sticky Header" toggle is enabled

### Mobile Issues

**Problem**: Sticky header causes issues on mobile

**Solutions**:
1. Enable "Disable on Mobile" option
2. Reduce the shrink scale amount for mobile
3. Check that mobile menu doesn't conflict

### Admin Bar Overlap

**Problem**: WordPress admin bar covers sticky header

**Solution**: This is handled automatically - the header adjusts its position when logged in

## Technical Details

### CSS Classes

The following CSS classes are automatically applied:

- `.dsg-scrolled` - Added when page is scrolled
- `.dsg-scroll-down` - Added when scrolling down
- `.dsg-scroll-up` - Added when scrolling up
- `.dsg-sticky-shadow-small` - Small shadow effect
- `.dsg-sticky-shadow-medium` - Medium shadow effect
- `.dsg-sticky-shadow-large` - Large shadow effect
- `.dsg-sticky-shrink` - Shrink effect enabled
- `.dsg-sticky-hide-on-scroll-down` - Hide on scroll enabled
- `.dsg-sticky-bg-on-scroll` - Background change enabled
- `.dsg-sticky-mobile-disabled` - Mobile disabled

### CSS Custom Properties

You can customize the sticky header using these CSS variables:

```css
:root {
  --dsg-sticky-header-z-index: 100;
  --dsg-sticky-header-transition-speed: 0.3s;
  --dsg-sticky-scale-amount: 0.8;
  --dsg-sticky-scroll-bg-color: rgba(255, 255, 255, 0.95);
}
```

### JavaScript API

The sticky header functionality is powered by `src/utils/sticky-header.js` and runs automatically on the frontend.

## Browser Support

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Respects `prefers-reduced-motion` - disables animations for users who prefer reduced motion
- Maintains keyboard navigation
- Works with screen readers
- WCAG 2.1 AA compliant

## Performance

- **Minimal Impact**: Lightweight JavaScript (~2KB)
- **Optimized Scrolling**: Uses passive event listeners
- **GPU Acceleration**: CSS transforms for smooth animations
- **No jQuery**: Pure vanilla JavaScript

## Related Features

- [Responsive Visibility](Responsive-Visibility) - Hide blocks on specific devices
- [Section Block](Section-Block) - Container for full-width sections

---

**Next Steps**: [Learn about Responsive Visibility →](Responsive-Visibility)
