# Reveal Block - User Guide

**Version**: 1.0.0
**Category**: Design
**Parent Block**: Hidden Blocks
**Keywords**: reveal, hover, hidden, show, container

## Overview

The Reveal block creates a container that reveals hidden content when users hover over it. This simple yet effective interaction pattern is perfect for progressive disclosure, where you want to show additional information without cluttering the interface until users express interest.

Unlike the Flip Card block which requires a two-sided structure, the Reveal block gives you complete freedom to show and hide any combination of content with smooth animations.

**Key Features:**
- 4 Animation Types - Fade, Slide Up, Slide Down, and Scale effects
- Customizable Duration - Control reveal speed from 100ms to 1000ms
- Flexible Content - Any WordPress blocks can be revealed (text, images, buttons, etc.)
- Full Styling Support - Colors, spacing, typography, borders, and layouts
- Wide & Full Width Support - Works with alignments for full-width sections
- Context-Aware - Provides context to child blocks for advanced integrations
- Mobile Optimized - Hover becomes tap/touch on mobile devices
- Accessible - Keyboard and screen reader friendly

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Settings & Configuration](#settings--configuration)
3. [Styling Options](#styling-options)
4. [Animation Effects Explained](#animation-effects-explained)
5. [Common Use Cases](#common-use-cases)
6. [Best Practices](#best-practices)
7. [Accessibility](#accessibility)
8. [Tips & Tricks](#tips--tricks)
9. [FAQ](#faq)

---

## Quick Start

### Basic Reveal Setup

1. **Add the Reveal Block**
   - In the block editor, click the `+` button
   - Search for "Reveal" or find it in the "Design" category
   - Insert the block into your page

2. **Add Content**
   - Click the `+` button inside the Reveal block
   - Add any blocks you want to reveal on hover
   - Example: Add a Heading and Paragraph

3. **Choose Animation Type** (Optional)
   - In the sidebar, find "Reveal Settings"
   - Default is "Fade" - content fades in on hover
   - Try "Slide Up", "Slide Down", or "Scale" for different effects

4. **Adjust Animation Speed** (Optional)
   - In "Reveal Settings", adjust "Animation Duration"
   - Default is 300ms (0.3 seconds)
   - Increase for slower, more dramatic reveals

5. **Preview Your Reveal**
   - Save and preview your page
   - Hover over the block to see the reveal effect
   - Adjust settings as needed

**Note**: The placeholder content you see ("Hover over me", "This content appears on hover") is just a template. Replace it with your own content.

---

## Settings & Configuration

### Reveal Settings Panel

All reveal settings are found in the sidebar under **Reveal Settings**.

#### Animation Type

Controls how the hidden content appears when revealed.

**Options:**

1. **Fade** (Default)
   - Content fades in by changing opacity from 0 to 100%
   - Smooth, subtle appearance
   - No movement, just transparency change
   - Professional, minimal effect

2. **Slide Up**
   - Content slides upward from below
   - Combines opacity fade with vertical movement
   - Creates sense of content emerging
   - Modern, dynamic feel

3. **Slide Down**
   - Content slides downward from above
   - Combines opacity fade with vertical movement
   - Creates sense of content dropping in
   - Attention-grabbing

4. **Scale**
   - Content scales up from smaller to full size
   - Combines opacity fade with size change
   - Creates zoom-in effect
   - Bold, impactful

**Choosing the Right Animation:**
- **Professional/Corporate**: Fade (subtle, refined)
- **Modern/Tech**: Slide Up (dynamic, progressive)
- **Attention-Grabbing**: Slide Down (top-down reveal)
- **Bold/Creative**: Scale (zoom effect)

---

#### Animation Duration

Controls the speed of the reveal animation.

**Settings:**
- Range: 100ms to 1000ms (0.1s to 1s)
- Default: 300ms (0.3 seconds)
- Slider control for easy adjustment

**Recommendations:**

**Fast (100-200ms)**
- Instant feel
- Snappy, responsive
- Good for simple content (text only)
- Modern, quick interactions

**Medium (250-400ms)**
- Balanced speed
- Default 300ms works for most cases
- Noticeable but not slow
- Universal appeal

**Slow (500-1000ms)**
- Dramatic, emphasized
- Draws attention to reveal
- Good for important content
- Can feel sluggish if too slow (avoid 800ms+)

**Pro Tips:**
- Match duration to animation type:
  - Fade: 200-400ms (simple opacity change)
  - Slide Up/Down: 300-500ms (movement needs time)
  - Scale: 350-600ms (size change needs time)
- Shorter durations feel more responsive
- Longer durations feel more intentional

---

## Styling Options

The Reveal block supports extensive WordPress block styling.

### Colors

**Background Color**
- Solid color fill for the entire container
- Revealed content inherits or can override
- Access: Settings sidebar → Color panel → Background

**Gradient Background**
- Two or more colors blending together
- Creates depth and visual interest
- Access: Settings sidebar → Color panel → Gradient

**Text Color**
- Default text color for content inside
- Individual blocks inside can override
- Access: Settings sidebar → Color panel → Text

**Link Color**
- Color for links inside the reveal container
- Access: Settings sidebar → Color panel → Link

**Best Practices:**
- Use subtle backgrounds for text-heavy reveals
- Ensure sufficient contrast (4.5:1 ratio for text)
- Test readability before and during reveal
- Consider using gradients for visual depth

---

### Spacing

**Padding**
- Inner spacing around content
- Creates breathing room
- Access: Settings sidebar → Spacing panel → Padding
- Recommendation: 2-3rem for comfortable spacing

**Margin**
- Outer spacing around the entire block
- Separates from surrounding content
- Access: Settings sidebar → Spacing panel → Margin

**Block Gap**
- Space between blocks inside the reveal container
- Access: Settings sidebar → Spacing panel → Block Gap
- Default: Inherited from theme

**Visual Impact:**
- **Large padding** (3-4rem): Spacious, premium feel
- **Medium padding** (2rem): Balanced, professional
- **Small padding** (1rem): Compact, dense

---

### Typography

**Font Size**
- Base font size for text inside
- Access: Settings sidebar → Typography panel → Font Size

**Line Height**
- Spacing between lines of text
- Access: Settings sidebar → Typography panel → Line Height
- Recommendation: 1.5-1.6 for body text

**Additional Typography Options:**
- Font Family
- Font Weight
- Font Style
- Text Transform
- Text Decoration
- Letter Spacing

Access: Settings sidebar → Typography panel

---

### Border & Radius

**Border Radius**
- Rounds the corners of the container
- Access: Settings sidebar → Border panel → Radius
- Common: 8-16px for modern, friendly look

**Border Color, Width, Style**
- Add outline border to container
- Access: Settings sidebar → Border panel
- Useful for defining boundaries

---

### Layout

**Default Layout**: Flex (Vertical)
- Content stacks vertically inside container
- Centered alignment by default

**Alignment Options:**
- **Wide** - Extends beyond content width
- **Full** - Spans full viewport width
- Access: Block toolbar → Alignment

**Note**: Layout controls are intentionally limited to maintain the vertical flex structure that works best for reveal effects.

---

## Animation Effects Explained

### Fade

**How It Works:**
- Opacity changes from 0% (invisible) to 100% (fully visible)
- No position or size change
- Pure transparency transition

**Best For:**
- Text-heavy content
- Professional, subtle reveals
- Minimal, elegant designs
- Quick, non-distracting interactions

**Visual Example:**
```
Before Hover: Content is invisible (opacity: 0)
During Reveal: Content gradually becomes visible
After Reveal: Content is fully visible (opacity: 100%)
```

---

### Slide Up

**How It Works:**
- Content starts slightly below its final position (translateY: 10px)
- Simultaneously fades in (opacity: 0 to 100%)
- Moves upward to final position (translateY: 0)

**Best For:**
- Modern, dynamic reveals
- Progressive disclosure (content "emerges")
- Mobile-friendly (natural upward movement)
- CTAs or action items

**Visual Example:**
```
Before Hover: Content is 10px below, invisible
During Reveal: Content slides up while fading in
After Reveal: Content at final position, fully visible
```

---

### Slide Down

**How It Works:**
- Content starts slightly above its final position (translateY: -10px)
- Simultaneously fades in (opacity: 0 to 100%)
- Moves downward to final position (translateY: 0)

**Best For:**
- Attention-grabbing reveals
- Dropdown-style interactions
- Menu or navigation reveals
- Important announcements

**Visual Example:**
```
Before Hover: Content is 10px above, invisible
During Reveal: Content slides down while fading in
After Reveal: Content at final position, fully visible
```

---

### Scale

**How It Works:**
- Content starts at 95% of final size (scale: 0.95)
- Simultaneously fades in (opacity: 0 to 100%)
- Grows to full size (scale: 1)

**Best For:**
- Bold, impactful reveals
- Image or media reveals
- Product showcases
- Creative, playful designs

**Visual Example:**
```
Before Hover: Content is 95% size, invisible
During Reveal: Content zooms in while fading in
After Reveal: Content at 100% size, fully visible
```

---

## Common Use Cases

### 1. Image Captions

**Goal**: Show image descriptions only on hover

**Setup:**
- Add Reveal block
- Inside: Add Image block (full width)
- Inside: Add Paragraph block (caption)
- Animation: Fade or Slide Up
- Duration: 300ms

**Styling:**
- Padding: 0 (image fills container)
- Caption: Positioned over image with background overlay
- Text: White on semi-transparent dark background

**Result**: Users hover over image to see caption appear.

---

### 2. Feature Highlights

**Goal**: Show detailed info on hover for feature cards

**Setup:**
- Add Reveal block inside a Column or Grid
- Front content: Icon + Heading (visible always)
- Hidden content: Paragraph with details
- Animation: Slide Up
- Duration: 400ms

**Styling:**
- Background: Brand color or gradient
- Padding: 2-3rem
- Text: High contrast

**Result**: Feature name and icon visible, details appear on hover.

---

### 3. Team Member Bios

**Goal**: Show bio information on hover

**Setup:**
- Add Reveal block
- Visible: Image (photo) + Heading (name)
- Hidden: Paragraph (bio) + Buttons (contact)
- Animation: Fade
- Duration: 350ms

**Styling:**
- Background: Matches brand
- Padding: 2rem
- Image: Circular or square

**Result**: Name and photo visible, bio and contact revealed on hover.

**Note**: This is similar to Flip Card but simpler (no flip animation, just reveal).

---

### 4. Product Quick View

**Goal**: Show product details on hover in a grid

**Setup:**
- Add Reveal block inside product grid
- Visible: Product image
- Hidden: Product name, price, "Add to Cart" button
- Animation: Slide Up
- Duration: 300ms

**Styling:**
- Padding: 1rem (tight)
- Background: Dark overlay on image
- Text: White for contrast

**Result**: Product image visible, details revealed on hover.

---

### 5. Progressive Disclosure Sections

**Goal**: Show additional content sections on demand

**Setup:**
- Add Reveal block in main content area
- Visible: Heading (section title) + Paragraph (intro)
- Hidden: Full content (detailed paragraphs, lists, images)
- Animation: Slide Down
- Duration: 500ms

**Styling:**
- Background: Subtle color difference from page
- Padding: 3rem
- Border: 1px subtle outline

**Result**: Summary visible, full content revealed on hover (or click on mobile).

---

### 6. Tooltip-Style Information

**Goal**: Provide extra context without cluttering UI

**Setup:**
- Add Reveal block inline or within text
- Visible: Icon (info icon) or text ("Learn more")
- Hidden: Paragraph or list with details
- Animation: Fade
- Duration: 200ms

**Styling:**
- Minimal padding (1rem)
- Subtle background
- Small font size

**Result**: Compact info icon, detailed tooltip on hover.

---

## Best Practices

### User Experience

**DO:**
- Keep revealed content concise (users shouldn't have to read a lot on hover)
- Provide visual cues that content is revealable (subtle hover state change)
- Use consistent animation across similar reveal blocks on a page
- Test on mobile devices (hover becomes tap)
- Ensure revealed content adds value (don't hide critical info)
- Make visible content enticing (encourages exploration)

**DON'T:**
- Hide critical information only in reveals (some users may not hover)
- Use very long animations (over 600ms feels sluggish)
- Overwhelm with too much hidden content (hard to read on hover)
- Use reveals for primary CTAs (make CTAs always visible)
- Mix different animation types on the same page (inconsistent UX)

---

### Performance

**Optimize Content:**
- Compress images before adding
- Limit number of blocks inside reveal (keeps animation smooth)
- Use CSS animations (hardware-accelerated, smooth 60fps)

**Technical:**
- Reveal uses CSS transitions (very performant)
- No JavaScript for animation (pure CSS)
- Respects reduced motion preferences (accessibility)

---

### Accessibility

**Keyboard Navigation:**
- Reveal content shows on focus (keyboard users can access)
- Tab through focusable elements inside reveal
- No content is keyboard-inaccessible

**Screen Readers:**
- All content (visible and hidden) is announced to screen readers
- Content is in DOM, just visually hidden
- No accessibility barriers

**Reduced Motion:**
- Respects `prefers-reduced-motion` setting
- Users who disable animations see instant reveal (no animation)

**Color Contrast:**
- Ensure text meets contrast requirements (4.5:1 for body, 3:1 for large)
- Test with contrast checker tools
- Don't rely on color alone to indicate interactivity

**Best Practices:**
- Don't hide critical information only in reveals
- Ensure focus states are visible
- Provide alternative access methods (e.g., "Click to expand" text)
- Test with keyboard only (no mouse)

---

## Tips & Tricks

### Always-Visible Preview

Create a reveal with a preview that's always visible:

**Structure:**
```
- Heading (always visible)
- Paragraph (short intro, always visible)
- Separator or divider
- Paragraph (detailed content, revealed on hover)
```

**How**: Use opacity or visual hierarchy to differentiate preview from revealed content.

---

### Hover State Styling

Add subtle hover effects to indicate interactivity:

**Using Custom CSS** (if available):
```css
.dsgo-reveal-container:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}
```

---

### Grid of Reveals

Create a grid of hover-reveal cards:

1. **Add Grid or Columns block** (WordPress core)
2. **Add Reveal block in each cell**
3. **Use consistent animation and duration** across all
4. **Match styling** (padding, colors, borders)

**Example: 3-Column Feature Grid**
- Each column has a Reveal block
- Visible: Icon + Feature name
- Hidden: Feature details
- Animation: Slide Up, 300ms
- Matching brand colors

---

### Mobile Behavior

On touch devices (mobile, tablet):
- Hover becomes tap/touch
- First tap reveals content
- Tap outside hides content
- Ensure revealed content is readable on small screens

**Mobile Optimization:**
- Test on actual mobile devices
- Keep revealed content short (mobile screens are small)
- Use larger font sizes for mobile (16px minimum)
- Reduce padding if needed for mobile

---

### Layered Reveals

Create depth with multiple reveal blocks:

**Example: Nested Information**
```
Reveal Block 1 (outer)
  - Heading (visible)
  - Paragraph (visible)
  - Reveal Block 2 (inner, revealed on hover of outer)
    - Paragraph (details)
    - Button (CTA)
```

**Note**: Use sparingly, can be confusing if overused.

---

## FAQ

**Q: Can I trigger the reveal on click instead of hover?**
A: The Reveal block is designed for hover interactions. For click-based reveals, consider using the Accordion block or Flip Card block with click trigger.

**Q: Does the reveal work on mobile?**
A: Yes! On touch devices, hover is interpreted as a tap. Users tap to reveal, tap outside to hide.

**Q: Can I reveal images or videos?**
A: Absolutely! You can reveal any WordPress blocks, including images, videos, galleries, buttons, forms, etc.

**Q: How do I make content always visible (no reveal)?**
A: If you don't want reveal behavior, use a different block (like Group or Stack). The Reveal block is specifically for hover-reveal interactions.

**Q: Can I change the reveal direction (e.g., slide left/right)?**
A: Currently, the Reveal block supports Fade, Slide Up, Slide Down, and Scale. Left/right slides aren't available but may be added in future versions.

**Q: Why doesn't my reveal work in the editor?**
A: Reveal interactions may not fully function in the editor preview. Save and preview your page on the frontend to see the full reveal effect.

**Q: Can I reveal only specific blocks inside the container?**
A: The Reveal block reveals all content inside it. For selective reveals, you might need custom CSS or use multiple Reveal blocks.

**Q: How do I prevent layout shift when content is revealed?**
A: Set a minimum height on the Reveal block or use absolute positioning for revealed content (requires custom CSS).

**Q: Is there a way to keep content revealed after the first hover?**
A: Not by default. The reveal hides when hover ends. For persistent reveals, consider using the Accordion block with "open by default" setting.

**Q: Can I use the Reveal block inside other blocks?**
A: Yes! Reveal works inside Columns, Grid, Section, Stack, and most container blocks.

**Q: Does the reveal animation work with page builders?**
A: The Reveal block is designed for the WordPress block editor (Gutenberg). Compatibility with third-party page builders is not guaranteed.

**Q: Can I customize the animation easing (e.g., ease-in-out)?**
A: The block uses CSS transitions with default easing. Custom easing would require custom CSS.

**Q: How do I create a grid of reveal cards with equal heights?**
A: Use a Grid or Columns block, add Reveal blocks inside each cell, and set a minimum height on each Reveal block.

---

## Related Documentation

**Similar Blocks:**
- [Flip Card Block](FLIP-CARD.md) - Two-sided flip card with advanced interactions
- [Accordion Block](ACCORDION.md) - Collapsible content sections
- [Tabs Block](TABS.md) - Tabbed content organization

**Container Blocks:**
- [Stack Block](STACK.md) - Vertical stacking container
- [Grid Block](GRID.md) - Grid layout container
- [Section Block](SECTION.md) - Full-width section container

**General Resources:**
- [Block Development Best Practices](../BLOCK-DEVELOPMENT-BEST-PRACTICES-COMPREHENSIVE.md)
- [Accessibility Guide](../ACCESSIBILITY-COLOR-CONTRAST-GUIDE.md)
- [Editor Styling Guide](../EDITOR-STYLING-GUIDE.md)

---

## Changelog

**Version 1.0.0**
- Initial release
- 4 animation types (Fade, Slide Up, Slide Down, Scale)
- Customizable animation duration (100-1000ms)
- Full styling support (colors, spacing, typography, borders)
- Wide and Full width support
- Context provision for child blocks
- Mobile optimized (hover → tap on touch devices)
- Accessibility compliant (WCAG 2.1 AA)
- Reduced motion support

---

**Need Help?**
- [GitHub Issues](https://github.com/jnealey88/designsetgo/issues) - Report bugs
- [GitHub Discussions](https://github.com/jnealey88/designsetgo/discussions) - Ask questions
- [Documentation](https://github.com/jnealey88/designsetgo/wiki) - Full wiki

---

*Last Updated: 2025-11-19*
*DesignSetGo v1.0.0*
*WordPress 6.4+*
