# Scroll Accordion Block - User Guide

**Version**: 1.0.0
**Category**: Design
**Keywords**: scroll, accordion, sticky, stacking

## Overview

The Scroll Accordion block creates a stunning scroll-based stacking effect where content cards stack on top of each other as you scroll down the page. Cards appear to scale up and stick to the viewport, creating an engaging, modern scrolling experience that's perfect for presenting sequential content or storytelling.

**Key Features:**
- Smooth sticky stacking effect as users scroll
- Progressive reveal animation with scaling
- Customizable card alignment (left, center, right)
- Responsive and mobile-optimized
- Performance-optimized with reduced motion support
- Works seamlessly with other blocks as content

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [How It Works](#how-it-works)
3. [Settings & Configuration](#settings--configuration)
4. [Common Use Cases](#common-use-cases)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Accessibility](#accessibility)

---

## Quick Start

### Basic Setup

1. **Add the Scroll Accordion Block**
   - In the block editor, click the `+` button
   - Search for "Scroll Accordion" or find it in the "Design" category
   - The block comes pre-loaded with 3 example items

2. **Customize Your Content**
   - Each item can contain any WordPress blocks (headings, paragraphs, images, buttons, etc.)
   - Edit the default content or add/remove Scroll Accordion Items
   - Style individual items using background colors, borders, padding, and shadows

3. **Adjust Alignment**
   - Use the toolbar alignment buttons to position items left, center, or right
   - Items will stack from this alignment point

4. **Preview on Frontend**
   - Save and preview your page
   - Scroll down to see the stacking effect in action
   - Cards will scale up and stick as they reach the center of your viewport

---

## How It Works

The Scroll Accordion creates a vertical stack of content cards with a scroll-triggered animation:

### Scroll Behavior

**As you scroll down the page:**
1. Cards below the viewport center start at 85% scale
2. As cards approach the center, they scale up to 100%
3. Cards stick to the viewport as you continue scrolling
4. Previous cards remain stacked underneath
5. The effect creates a layered, card-stacking appearance

**Visual Effect:**
- Cards appear to "slide under" the current card
- Smooth scaling transition as cards enter the viewport
- Creates depth and hierarchy
- Guides users through sequential content

### Technical Notes

- **Sticky Positioning**: Uses CSS `position: sticky` for optimal performance
- **Scale Animation**: JavaScript calculates scroll position and applies smooth scaling
- **Viewport Center**: Animation triggers based on viewport center position
- **Reduced Motion**: Automatically respects user's reduced motion preferences
- **Performance**: Throttled with `requestAnimationFrame` for smooth 60fps animation

---

## Settings & Configuration

### Block Settings

The Scroll Accordion is a container block with minimal settings for maximum flexibility:

#### Alignment (Toolbar)

Choose how items align within the accordion:

- **Left** - Items align to the left edge
- **Center** - Items center within the container (default)
- **Right** - Items align to the right edge

**When to Use:**
- Left: Standard reading flow, text-heavy content
- Center: Visual impact, balanced layouts
- Right: Alternative layouts, creative designs

#### Width Alignment (Toolbar)

Set the overall block width:

- **Default** - Contained within content width
- **Wide** - Extends to wide width (if theme supports)
- **Full** - Full viewport width

**Best Practice**: Use Full or Wide width for maximum visual impact

### Block Supports

The Scroll Accordion supports WordPress core settings:

**Spacing:**
- **Margin**: Space around the entire accordion
- **Padding**: Inner spacing (applied to container)
- **Block Gap**: Vertical space between stacked items

**Color:**
- **Background**: Container background color
- **Text**: Default text color for all items
- **Gradient**: Gradient background option

**Typography:**
- **Font Size**: Default font size for content
- **Line Height**: Default line height

**Tips:**
- Use Block Gap to control spacing between stacked cards
- Add padding for better mobile experience
- Background colors are best applied to individual items (not the container)

---

## Common Use Cases

### 1. Feature Showcase

**Goal**: Present product features or services in an engaging scrolling experience

**Setup:**
1. Add Scroll Accordion block
2. Add 4-6 Scroll Accordion Items
3. Each item highlights one feature
4. Use icons, headings, and descriptions
5. Apply different background colors to each item
6. Add shadows for depth

**Content Structure:**
```
Scroll Accordion
├─ Item 1: Design Systems (dark blue background)
│  ├─ Heading: "Design Systems"
│  └─ Paragraph: Feature description
├─ Item 2: Component Library (darker blue)
│  ├─ Heading: "Component Library"
│  └─ Paragraph: Feature description
└─ Item 3: Launch & Scale (purple)
   ├─ Heading: "Launch & Scale"
   └─ Paragraph: Feature description
```

**Tips:**
- Use contrasting backgrounds for visual interest
- Keep content concise (2-3 elements per item)
- Add generous padding to items
- Use large, bold headings

---

### 2. Storytelling / Timeline

**Goal**: Tell a story or present chronological events

**Setup:**
1. Add Scroll Accordion block
2. Create one item per story section or timeline event
3. Use consistent styling for cohesion
4. Consider adding dates or numbers
5. Include images or icons for visual interest

**Example:**
- Company history timeline
- Product development journey
- Step-by-step process
- Customer success story

**Best Practices:**
- Maintain visual consistency across items
- Use sequential or progressive color schemes
- Add subtle transitions between sections
- Keep scrolling rhythm comfortable

---

### 3. Service Offerings

**Goal**: Highlight different services or pricing tiers

**Setup:**
1. Add Scroll Accordion block
2. One item per service or tier
3. Include service name, description, features list
4. Add call-to-action buttons
5. Use distinct colors for different tiers

**Content Per Item:**
- Service name (Heading)
- Brief description (Paragraph)
- Key features (List)
- Pricing information
- CTA button

---

### 4. Portfolio Sections

**Goal**: Showcase work or projects with immersive scrolling

**Setup:**
1. Add Scroll Accordion block (Full width)
2. One item per project
3. Include project images, titles, descriptions
4. Add background images with overlays
5. Link to detailed case studies

**Tips:**
- Use large, high-quality images
- Add overlay colors for text readability
- Include project metadata (date, client, role)
- Keep descriptions scannable

---

## Best Practices

### Content Strategy

**DO:**
- Keep items focused on one idea or feature
- Use 3-6 items for optimal effect (too many dilutes impact)
- Maintain consistent content structure across items
- Use compelling headlines that work in sequence
- Add visual elements (icons, images) for engagement

**DON'T:**
- Overload items with too much content
- Mix unrelated topics in the same accordion
- Use too many items (7+ can feel repetitive)
- Forget mobile users - test on smaller screens
- Use low-contrast text on backgrounds

### Visual Design

**Backgrounds:**
- Use contrasting colors between items
- Consider color progression (light to dark, or themed)
- Test text readability on all backgrounds
- Add background images sparingly (can affect performance)

**Spacing:**
- Add generous padding to items (40-60px recommended)
- Use Block Gap to control stack spacing
- Ensure content doesn't feel cramped
- Test on mobile - reduce padding if needed

**Typography:**
- Use large, bold headings (2rem - 3rem)
- Ensure sufficient text contrast (WCAG AA minimum)
- Limit text length for scannability
- Use hierarchy (heading + description + optional details)

### Performance

**Optimize for Speed:**
- Limit to 6-8 items maximum
- Compress images before adding
- Use appropriate image sizes (not unnecessarily large)
- Avoid background videos
- Test on mobile devices

**Smooth Animation:**
- Let the default scroll speed work
- Don't override with custom CSS animations
- Reduced motion users see static version automatically
- Test scrolling on different devices

---

## Troubleshooting

### Items Don't Stack Properly

**Symptom**: Items scroll normally without sticking

**Possible Causes:**
1. **Parent Container Overflow**: A parent block is hiding overflow
2. **Z-Index Conflicts**: Other elements have higher z-index
3. **CSS Conflicts**: Theme or plugin CSS overriding

**Solutions:**
- Ensure parent containers allow overflow
- Check browser console for errors
- Try removing the block from nested containers
- Test with a default WordPress theme

### Animation Is Jerky or Slow

**Symptom**: Scrolling feels laggy or stutters

**Possible Causes:**
1. Too many items
2. Large images not optimized
3. Other heavy animations on page
4. Device performance limitations

**Solutions:**
- Reduce number of items
- Compress and optimize images
- Remove background videos or animations
- Test on different devices

### Items Not Centered/Aligned Correctly

**Symptom**: Items don't align as expected

**Solution:**
1. Check toolbar alignment setting
2. Verify parent container width
3. Ensure items don't have custom alignment set
4. Check for theme CSS conflicts

### Content Overlapping or Cut Off

**Symptom**: Text or content appears outside item boundaries

**Solutions:**
- Increase padding on items
- Check for absolute positioned elements
- Verify image sizes are responsive
- Test on mobile viewport sizes

---

## Accessibility

The Scroll Accordion block is built with accessibility in mind:

### Keyboard Navigation

- All content is accessible via keyboard
- Tab navigation works normally through content
- No keyboard traps
- Scroll animations don't interfere with navigation

### Screen Readers

- Content is in semantic HTML order
- No hidden content - everything is accessible
- Proper heading hierarchy preserved
- ARIA attributes not needed (standard scroll behavior)

### Reduced Motion

**Automatic Support:**
- Detects `prefers-reduced-motion` setting
- Disables scaling animation for sensitive users
- Items still stack, but without scale transitions
- Maintains full functionality without animation

### Color Contrast

**Best Practices:**
- Ensure text meets WCAG AA contrast ratios (4.5:1 for body text)
- Test all background/text combinations
- Use WordPress color system for consistency
- Avoid relying on color alone for information

### Mobile Accessibility

- Touch targets are appropriately sized
- Content is readable on small screens
- Scroll performance optimized
- No horizontal scrolling required

---

## Advanced Tips

### Combining with Other Blocks

**Stack Block Integration:**
```
Stack (Full Width)
└─ Scroll Accordion
   ├─ Scroll Accordion Item 1
   ├─ Scroll Accordion Item 2
   └─ Scroll Accordion Item 3
```

**Benefits:**
- Stack provides section padding and background
- Scroll Accordion handles stacking effect
- Clean separation of concerns

### Custom Styling

Use the **Custom CSS Extension** for advanced styling:

```css
/* Increase gap between stacked items */
.dsgo-scroll-accordion__items {
    gap: 60px;
}

/* Add custom shadow to all items */
.dsgo-scroll-accordion-item {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* Adjust sticky position */
.dsgo-scroll-accordion-item {
    top: 100px; /* Offset from top when stuck */
}
```

### Background Image Overlays

Add dramatic visuals with background images:

1. Add background image to Scroll Accordion Item
2. Set overlay color in Color settings
3. Adjust overlay opacity for text readability
4. Use high-quality, optimized images

---

## Frequently Asked Questions

**Q: How many items should I use?**
A: 3-6 items is ideal. More than 8 can feel repetitive and impact performance.

**Q: Can I change the scroll speed?**
A: The scroll speed is optimized for smooth performance. Custom speeds aren't recommended as they can cause janky scrolling.

**Q: Why don't I see the effect in the editor?**
A: The stacking effect only works on the frontend. Preview your page to see it in action.

**Q: Can items be different widths?**
A: All items within one Scroll Accordion share the same alignment. For different widths, use multiple Scroll Accordion blocks.

**Q: Does it work on mobile?**
A: Yes! The effect scales beautifully to mobile devices with optimized performance.

**Q: Can I add videos inside items?**
A: Yes, but use sparingly as videos can impact scroll performance.

**Q: How do I remove the default example items?**
A: Select each Scroll Accordion Item and delete it, then add your own.

**Q: Can I nest Scroll Accordions?**
A: Not recommended - it creates confusing scroll behavior.

**Q: Does it work with page caching?**
A: Yes! The scroll effect is JavaScript-based and works with all caching plugins.

---

## Related Blocks

**Image Accordion**: Expandable image panels with hover/click interactions
**Scroll Marquee**: Infinite scrolling image galleries
**Stack**: Flexible container for vertical layouts
**Modal**: Interactive popups and dialogs

---

**Need Help?**
- [GitHub Issues](https://github.com/jnealey-godaddy/designsetgo/issues) - Report bugs
- [GitHub Discussions](https://github.com/jnealey-godaddy/designsetgo/discussions) - Ask questions
- [Documentation](https://github.com/jnealey-godaddy/designsetgo/wiki) - Full wiki

---

*Last Updated: 2025-11-19*
*DesignSetGo v1.0.0*
*WordPress 6.4+*
