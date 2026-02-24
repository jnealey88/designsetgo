# Scrolling Gallery Block - User Guide

**Version**: 1.0.0
**Category**: Design
**Also Known As**: Scroll Marquee
**Keywords**: scrolling, gallery, images, parallax, scroll, infinite

## Overview

The Scrolling Gallery block (internally called Scroll Marquee) creates an eye-catching infinite scrolling image gallery where images move horizontally as you scroll down the page. Create multiple rows of images that scroll in alternating directions, producing a dynamic parallax effect perfect for showcasing portfolios, logos, products, or visual content.

**Key Features:**
- Infinite scroll effect - images duplicate seamlessly for continuous loop
- Multiple rows with alternating scroll directions
- Scroll-based animation - movement tied to page scroll position
- Fully customizable image dimensions and spacing
- Performance warnings for optimal user experience
- Automatic reduced motion support
- Only animates when visible in viewport

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [How It Works](#how-it-works)
3. [Settings & Configuration](#settings--configuration)
4. [Adding & Managing Images](#adding--managing-images)
5. [Common Use Cases](#common-use-cases)
6. [Performance Optimization](#performance-optimization)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Basic Setup

1. **Add the Scrolling Gallery Block**
   - In the block editor, click the `+` button
   - Search for "Scrolling Gallery" or find it in the "Design" category
   - Block starts with one empty row

2. **Add Images to First Row**
   - Click "Add Images" button
   - Select multiple images from your media library
   - Images appear in the row preview
   - Note: Row starts with left scroll direction

3. **Add More Rows** (Optional)
   - Click "Add Row" button at bottom
   - Each new row automatically alternates direction (left, right, left, etc.)
   - Add images to each row

4. **Adjust Settings**
   - Open Inspector (sidebar settings)
   - Adjust scroll speed, image dimensions, spacing
   - Preview on frontend to see the scroll effect

5. **Preview in Action**
   - Save and view page on frontend
   - Scroll down the page
   - Images move horizontally as you scroll vertically
   - Each row moves in its designated direction

---

## How It Works

### Scroll Animation Mechanics

**Movement:**
- As you scroll DOWN the page, images move HORIZONTALLY
- Movement is tied to your scroll position (not time-based)
- Scroll faster = images move faster
- Scroll backwards = images reverse direction

**Infinite Loop:**
- Each row of images is duplicated 6 times internally
- Creates seamless infinite loop effect
- No gaps or jumps when looping
- Modulo math ensures perfect continuity

**Direction:**
- **Left**: Images move from right to left as you scroll down
- **Right**: Images move from left to right as you scroll down
- Toggle direction with button above each row

**Viewport Detection:**
- Animation only runs when gallery is visible
- Uses Intersection Observer for performance
- Saves CPU/GPU when scrolled past

---

## Settings & Configuration

### Performance Panel

Located in Inspector sidebar, this panel monitors your gallery health:

**Total Images Counter:**
- Shows total number of images across all rows
- Remember: Each image is duplicated 6x for infinite scroll
- Example: 10 images = 60 rendered images

**Performance Warnings:**
- **Green Notice** (20 or fewer images): "Optimal performance"
- **Yellow Warning** (21+ images): "Consider using fewer images or optimizing"

**Why It Matters:**
- More images = more DOM elements = potential performance issues
- Especially important on mobile devices
- Each image is duplicated 6 times for smooth looping

**Recommendations:**
- Ideal: 10-15 total images
- Maximum: 20 images
- Above 20: Optimize images or reduce quantity

---

### Scroll Settings Panel

**Scroll Speed**
- Range: 0.1 to 2.0
- Default: 0.5
- Controls how fast images move based on scroll

**Values Explained:**
- **0.1-0.3**: Very slow, subtle movement
- **0.5**: Default, balanced movement (recommended)
- **0.8-1.2**: Fast, energetic movement
- **1.5-2.0**: Very fast, aggressive movement

**When to Adjust:**
- Slow (0.3): Professional sites, subtle effect
- Default (0.5): Most use cases, balanced
- Fast (1.0): Creative sites, high energy
- Very Fast (1.5+): Bold statements, short pages

**Help Text:** "Controls how fast images move based on scroll"

---

### Image Dimensions Panel

**Image Height**
- Default: 200px
- Units: px, rem, vh
- All images in gallery use same height

**Image Width**
- Default: 300px
- Units: px, rem, vw
- All images in gallery use same width

**Border Radius**
- Default: 8px
- Units: px, rem, %
- Rounds image corners
- 0px = square, 50% = circle (if width = height)

**Tips:**
- Use consistent dimensions across all images
- Aspect ratio affects visual rhythm
- Common ratios: 3:2 (300x200), 16:9 (320x180), 1:1 (square)

**Responsive Considerations:**
- Use `vw` for width to scale with viewport
- Use `rem` for proportional sizing
- Test on mobile - reduce dimensions if needed

---

### Spacing Panel

**Gap Between Images**
- Default: 20px
- Horizontal space between images in a row
- Affects visual density

**Gap Between Rows**
- Default: 20px
- Vertical space between rows
- Creates breathing room

**Recommendations:**
- Tight spacing: 10-15px (dense, energetic)
- Default spacing: 20px (balanced)
- Loose spacing: 30-40px (minimal, spacious)
- Match row gap to image height for squares

---

### Block Supports

**Color:**
- **Background**: Background color behind entire gallery
- **Text**: Not applicable (no text in this block)
- **Gradient**: Gradient background option

**Spacing:**
- **Block Gap**: Space between rows (also in Spacing panel)
- Note: Margin and Padding are disabled for this block

**Best Practices:**
- Use background color to integrate with page design
- Or leave transparent to show page background
- Block Gap duplicates Row Gap setting

---

## Adding & Managing Images

### Adding Images to a Row

**First Time (Empty Row):**
1. Click "Add Images" button
2. Select multiple images from media library
3. Images load immediately into row preview
4. Add more images later with "Add More Images"

**Adding More Images:**
1. Click "Add More Images" on existing row
2. Previously selected images are pre-checked
3. Select additional images
4. All images (existing + new) appear in row

**Bulk Selection:**
- Hold Ctrl/Cmd to select multiple images
- Or use "Bulk Select" in media library
- Maximum recommended: 8-10 images per row

---

### Removing Images

**Individual Image Removal:**
1. Hover over image in editor preview
2. Click the red X button (top-right corner)
3. Image is removed immediately
4. Remaining images adjust automatically

---

### Managing Rows

**Add Row:**
- Click "Add Row" button at bottom of gallery
- New row appears with empty state
- Direction automatically alternates
- Add images to new row

**Remove Row:**
1. Click red X button in row header
2. Row and all its images are deleted
3. Remaining rows reorder

**Change Row Direction:**
1. Click direction button above row
2. Toggles between:
   - "← Scroll Left"
   - "Scroll Right →"
3. Preview shows new direction on frontend

**Row Order:**
- Rows appear in editor order on frontend
- Drag rows in List View to reorder
- Directions don't auto-alternate if reordered

---

## Common Use Cases

### 1. Logo Showcase

**Goal**: Display client logos, partner brands, or certifications

**Setup:**
- 1-2 rows
- Square images (200x200px recommended)
- All logos same size
- Transparent backgrounds (PNG)
- Slow scroll speed (0.3-0.5)

**Content:**
- Black & white or colored logos
- Consistent padding around logos
- Equal image sizes

**Tips:**
- Use grayscale filter for uniform look
- Add white or colored background to gallery
- Keep spacing tight for density

---

### 2. Portfolio Gallery

**Goal**: Showcase design work, photography, or creative projects

**Setup:**
- 2-3 rows
- Landscape images (400x300px or 16:9)
- Alternating directions for dynamic effect
- Medium scroll speed (0.5-0.8)

**Content:**
- High-quality project images
- Consistent aspect ratio
- Curated selection (best work only)

**Tips:**
- Use 8-12 images total (4 per row)
- Add border radius for modern look
- Consider background color that complements images

---

### 3. Product Showcase

**Goal**: Display product range or e-commerce inventory

**Setup:**
- 2-4 rows
- Square product images (300x300px)
- Fast scroll for energy (0.8-1.2)
- White background for clean look

**Content:**
- Product photos on white background
- Consistent lighting and styling
- Mix of product types or colors

**Tips:**
- Use WebP format for smaller file sizes
- Add subtle shadow to images
- Link to product pages from images (custom dev needed)

---

### 4. Testimonial Images / Team Photos

**Goal**: Show faces of customers or team members

**Setup:**
- 1-2 rows
- Square or portrait images
- Circular images (50% border radius)
- Slow to medium speed (0.4-0.6)

**Content:**
- Headshot photos
- Consistent cropping
- Similar background tones

**Tips:**
- Use circle images for friendly feel
- Add overlay content below gallery with names
- Keep to 6-10 images total

---

### 5. Infinite Pattern Background

**Goal**: Create animated background texture

**Setup:**
- 3+ rows
- Small, abstract images or patterns
- Tight spacing (10px)
- Variable speeds per row for depth effect

**Content:**
- Abstract shapes, gradients, or textures
- Low-opacity images
- Repeating patterns

**Tips:**
- Use as page section background
- Lower scroll speed for subtlety
- Test performance with many images

---

## Performance Optimization

### Image Optimization

**Format:**
- **Best**: WebP (smaller file size, modern browsers)
- **Good**: JPEG (compressed, 80-85% quality)
- **Avoid**: PNG for photos (larger files)

**File Size:**
- Target: < 100KB per image
- Maximum: 200KB per image
- Compress before upload

**Dimensions:**
- Upload images at display size (not larger)
- Don't upload 4000px images to display at 300px
- Use responsive images (WordPress handles this)

**Tools:**
- WordPress media settings (automatic compression)
- TinyPNG or ShortPixel plugins
- Photoshop "Save for Web"
- Online tools: Squoosh, ImageOptim

---

### Gallery Performance

**Total Image Count:**
- Optimal: 10-15 images
- Maximum: 20 images
- Above 20: Yellow warning appears

**Why Limit Images?**
- Each image duplicated 6x = 60-120 DOM elements
- More DOM nodes = slower rendering
- Mobile devices especially affected
- Scroll performance can degrade

**Performance Checklist:**
- Compress all images
- Use WebP format
- Limit to 20 images or less
- Test on mobile devices
- Check scroll smoothness

---

### Browser Performance

**Automatic Optimizations:**
- Intersection Observer: Only animates when visible
- RequestAnimationFrame: Smooth 60fps animation
- Passive event listeners: Better scroll performance
- Reduced motion support: Disables for sensitive users

**What You Can Do:**
- Reduce total image count
- Optimize image file sizes
- Test on real devices (not just desktop)
- Consider removing other heavy animations on page

---

## Best Practices

### Visual Design

**Image Selection:**
- Maintain consistent aspect ratio
- Use similar visual style (color, tone, subject)
- Curate quality over quantity
- Mix up composition for interest

**Spacing:**
- Match gap to image size (20px gap for 300px images)
- Tighter spacing for dense, energetic feel
- Wider spacing for minimal, spacious feel
- Row gap should complement design

**Colors:**
- Consider background color behind images
- Transparent background lets page show through
- Solid background creates contained gallery
- Match theme colors for cohesion

---

### Content Strategy

**DO:**
- Use high-quality, relevant images
- Optimize file sizes before uploading
- Keep total count under 20 images
- Test scroll effect on frontend
- Ensure images load quickly

**DON'T:**
- Upload massive, unoptimized images
- Add 30+ images without testing
- Use wildly different image sizes
- Forget to check mobile experience
- Use images with text (may be unreadable while scrolling)

---

### Accessibility

**Reduced Motion:**
- Automatically detected via CSS media query
- Gallery remains static for motion-sensitive users
- All images still visible (no functionality lost)

**Alt Text:**
- Add descriptive alt text to all images
- Screen readers announce images
- Important for SEO and accessibility

**Keyboard Navigation:**
- Gallery is visual decoration (not interactive)
- No keyboard interaction needed
- Content is accessible without animation

---

## Troubleshooting

### Images Not Scrolling

**Symptom**: Images appear but don't move when scrolling

**Possible Causes:**
1. Viewing in editor (effect only works on frontend)
2. JavaScript error in console
3. Reduced motion preference enabled

**Solutions:**
- Preview on frontend, not editor
- Check browser console (F12) for errors
- Verify JavaScript is enabled
- Check accessibility settings (reduced motion)

---

### Images Jumping or Stuttering

**Symptom**: Scroll animation is janky or choppy

**Possible Causes:**
1. Too many images (performance bottleneck)
2. Images not optimized (large file sizes)
3. Other heavy scripts on page
4. Device performance limitations

**Solutions:**
- Reduce total image count
- Compress and optimize images
- Test on different devices
- Remove other animations on page
- Check network speed (slow image loading)

---

### Images Not Loading

**Symptom**: Placeholder or broken images

**Possible Causes:**
1. Images deleted from media library
2. Permission issues
3. CDN or caching issues

**Solutions:**
- Re-upload images
- Check media library for missing files
- Clear cache (site + browser)
- Verify image URLs are accessible

---

### Row Direction Not Changing

**Symptom**: All rows scroll same direction

**Solutions:**
1. Click direction toggle button
2. Check on frontend (not editor)
3. Save and refresh page
4. Verify row has `data-direction` attribute

---

### Performance Warning Won't Dismiss

**Symptom**: Yellow warning shows even with optimized images

**Solution:**
- Warning is based on total image count
- Reduce number of images to 20 or fewer
- Warning is informational (gallery still works)
- Optimize and test - if performance is fine, warning can be ignored

---

## Advanced Tips

### Creating Depth with Multiple Rows

**Technique**: Vary scroll speeds per row
**Implementation**: Currently not available per row (feature request)

**Workaround**:
- Use multiple Scrolling Gallery blocks
- Set different scroll speeds
- Stack vertically

---

### Combining with Other Blocks

**Hero Section:**
```
Stack (Full Width)
├─ Heading (Centered)
├─ Paragraph (Centered)
├─ Scrolling Gallery (logos or images)
└─ Button (Centered CTA)
```

**Background Layer:**
```
Cover Block
├─ Scrolling Gallery (as background)
└─ Content overlay
```

---

### Seasonal or Themed Galleries

**Use Case**: Change images seasonally

**Implementation:**
1. Create gallery with holiday/seasonal images
2. Replace images in existing gallery
3. Or duplicate page and swap galleries

**Tips:**
- Keep image dimensions consistent
- Maintain aspect ratios
- Test after swapping images

---

## Frequently Asked Questions

**Q: How many images should I use?**
A: Optimal: 10-15 images total. Maximum: 20 images. Above 20 may impact performance.

**Q: Can each row have different scroll speeds?**
A: Not currently. All rows use the same scroll speed setting. Use multiple gallery blocks for different speeds.

**Q: Why don't I see the effect in the editor?**
A: The scroll effect only works on the frontend. Save and preview your page to see it in action.

**Q: Can I link images to pages or URLs?**
A: Not built-in. This requires custom development or a plugin extension.

**Q: Does it work on mobile?**
A: Yes! Optimized for mobile with viewport detection and performance features.

**Q: Can I use videos instead of images?**
A: No, this block is designed for static images only.

**Q: How do I change image order within a row?**
A: Currently not available. Remove and re-add images in desired order (feature request).

**Q: Will this work with lazy loading plugins?**
A: Yes, but test to ensure images load before coming into viewport.

**Q: Can I pause the scroll animation?**
A: Animation is tied to scroll position, not time. It "pauses" when you stop scrolling.

**Q: Does it work with page caching?**
A: Yes! The effect is JavaScript-based and works with all caching plugins.

---

## Related Blocks

- **Scroll Accordion**: Stacking cards with scroll animation
- **Image Accordion**: Expandable image panels
- **Gallery**: Standard WordPress image gallery (no scroll effect)

---

**Need Help?**
- [GitHub Issues](https://github.com/jnealey-godaddy/designsetgo/issues) - Report bugs
- [GitHub Discussions](https://github.com/jnealey-godaddy/designsetgo/discussions) - Ask questions
- [Documentation](https://github.com/jnealey-godaddy/designsetgo/wiki) - Full wiki

---

*Last Updated: 2025-11-19*
*DesignSetGo v1.0.0*
*WordPress 6.4+*
