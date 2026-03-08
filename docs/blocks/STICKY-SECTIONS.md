# Sticky Sections Block - User Guide

**Version**: 1.0.0
**Category**: Design
**Keywords**: sticky, stack, scroll, cards, pin, reveal, sections

## Overview

The Sticky Sections block creates a card-stacking scroll effect where full-width sections pin to the top of the viewport and stack on top of each other as the user scrolls. Each new section slides up and covers the previous one, producing a dramatic layered reveal that's ideal for landing pages, feature showcases, and storytelling.

**Key Features:**
- CSS-driven sticky stacking with JavaScript enhancement
- Configurable sticky offset for fixed headers
- Template chooser with pre-built layouts (Blank, Feature Cards, Full Screen)
- Uses Section blocks as children for full styling flexibility
- Depth shadows on stacking sections
- Responsive: falls back to normal stacking on mobile (<781px)
- Respects `prefers-reduced-motion` and print media

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [How It Works](#how-it-works)
3. [Settings & Configuration](#settings--configuration)
4. [Templates](#templates)
5. [Common Use Cases](#common-use-cases)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Accessibility](#accessibility)

---

## Quick Start

### Basic Setup

1. **Add the Sticky Sections Block**
   - In the block editor, click the `+` button
   - Search for "Sticky Sections" or find it in the "Design" category
   - A template chooser appears — pick a starting layout

2. **Choose a Template**
   - **Blank**: Three empty sections with dark gradient colors
   - **Feature Cards**: Pre-filled sections with headings and descriptions
   - **Full Screen**: 100vh sections for dramatic full-viewport stacking

3. **Customize Your Sections**
   - Each child is a Section block — add any content inside (headings, paragraphs, images, buttons)
   - Style individual sections with background colors, spacing, and typography
   - Add or remove sections as needed

4. **Adjust Sticky Offset** (if you have a fixed header)
   - Open the block settings sidebar
   - Set the **Sticky Offset** to match your header height (e.g., `80px`)

5. **Preview on Frontend**
   - Save and preview your page
   - Scroll down to see sections stack on top of each other

---

## How It Works

### Scroll Behavior

**As you scroll down the page:**
1. Each section uses `position: sticky` with `top: var(--dsgo-sticky-offset)`
2. Sections are ordered by z-index — each subsequent section sits above the previous
3. As you scroll past a section, the next one slides up and covers it
4. The effect creates a stack of cards pinned to the top of the viewport

**Visual Effect:**
- Sections appear to slide up from below and cover the previous section
- A subtle box-shadow is applied to stacking sections for depth
- Creates a layered, card-reveal experience

### Technical Notes

- **CSS-First**: The core effect uses `position: sticky` and CSS `nth-child` z-index — works without JavaScript
- **Progressive Enhancement**: `view.js` assigns dynamic z-index and shadow classes for robustness
- **Custom Property**: Sticky offset is passed via `--dsgo-sticky-offset` CSS custom property
- **WeakSet Guard**: JavaScript prevents double-initialization on dynamic content
- **Reinit Event**: Dispatch `sticky-sections:reinit` on the document to re-initialize after AJAX content loads

---

## Settings & Configuration

### Block Settings (Sidebar)

#### Sticky Offset

Controls how far from the top of the viewport sections stick. Useful when your site has a fixed header or admin bar.

- **Default**: `0px` (sticks to the very top)
- **Units**: `px`, `rem`, `vh`
- **Example**: Set to `80px` if your header is 80px tall

### Block Supports

The Sticky Sections block supports these WordPress core settings:

**Alignment:**
- **Wide** and **Full** width (defaults to Full)

**Spacing:**
- **Margin**: Space above and below the entire block

**Other:**
- **Anchor**: HTML anchor for linking directly to this block

### Allowed Inner Blocks

Only `designsetgo/section` blocks are allowed as children. This ensures consistent styling and proper sticky behavior.

---

## Templates

When you first insert the block, a template chooser appears with three options:

### Blank
Three empty sections with dark gradient backgrounds (`#1a1a2e`, `#16213e`, `#0f3460`). Each section includes placeholder heading and paragraph blocks.

### Feature Cards
Three pre-filled sections showcasing a feature presentation pattern:
- "Design that stands out" — dark navy
- "Built for performance" — dark purple
- "Scale with confidence" — dark blue

### Full Screen
Three empty sections at `100vh` minimum height for dramatic, full-viewport stacking pages.

---

## Common Use Cases

### 1. Landing Page Hero Sequence

**Goal**: Create a multi-section hero that reveals features as users scroll.

**Setup:**
1. Add Sticky Sections block at full width
2. Use 3-4 sections with contrasting dark backgrounds
3. Add large headings and supporting text to each section
4. Set min-height on sections for visual impact

**Content Structure:**
```
Sticky Sections (Full Width)
├─ Section 1: Hero intro (dark navy, 100vh)
│  ├─ Heading: "Welcome"
│  └─ Paragraph: Intro text
├─ Section 2: Key feature (dark purple)
│  ├─ Heading: "What We Do"
│  └─ Paragraph: Feature description
└─ Section 3: Call to action (dark blue)
   ├─ Heading: "Get Started"
   └─ Buttons: CTA buttons
```

### 2. Feature Showcase

**Goal**: Present product features one at a time with visual impact.

**Setup:**
1. Choose the "Feature Cards" template
2. Customize headings and descriptions for each feature
3. Add icons or images to each section
4. Use consistent padding and typography

### 3. Storytelling / Case Study

**Goal**: Walk users through a narrative with scroll-driven reveals.

**Setup:**
1. Add Sticky Sections block
2. One section per story chapter or milestone
3. Use progressive color schemes (light to dark, or themed)
4. Include images and media to enhance the story

### 4. Pricing or Service Tiers

**Goal**: Present tiers that stack dramatically as users scroll.

**Setup:**
1. One section per tier
2. Include tier name, features list, and CTA button
3. Use distinct background colors per tier
4. Set consistent section heights

---

## Best Practices

### Content Strategy

**DO:**
- Use 3-5 sections for optimal impact
- Give each section a distinct background color for visual separation
- Keep content concise — the effect works best with focused messaging
- Use the Sticky Offset setting if your theme has a fixed header
- Test with real content to ensure readability

**DON'T:**
- Use more than 6-7 sections (diminishing returns, impacts scroll length)
- Mix unrelated content in the same Sticky Sections block
- Nest Sticky Sections inside another Sticky Sections block
- Forget to preview on the frontend — the effect is disabled in the editor

### Visual Design

**Backgrounds:**
- Use contrasting or progressive colors between sections
- Dark backgrounds with light text create the most dramatic effect
- Test text readability on all backgrounds (WCAG AA: 4.5:1 contrast)

**Spacing:**
- Add generous padding to sections (use preset spacing `60` or higher)
- Section min-height helps create a more immersive feel

### Performance

- Limit to 6-8 sections maximum
- Compress images before adding
- The CSS-only fallback works even if JavaScript is delayed
- No `requestAnimationFrame` loop — the effect is scroll-native via `position: sticky`

---

## Troubleshooting

### Sections Don't Stick

**Symptom**: Sections scroll normally without pinning to the top.

**Possible Causes:**
1. **Parent overflow**: A parent element has `overflow: hidden` or `overflow: auto`
2. **Mobile viewport**: Sticky is disabled below 781px by design
3. **Reduced motion**: User has `prefers-reduced-motion: reduce` enabled
4. **Theme CSS conflict**: Theme overrides sticky positioning

**Solutions:**
- Check parent elements for `overflow` properties
- Test on desktop (>781px viewport)
- Test with `prefers-reduced-motion` disabled
- Inspect with browser DevTools for conflicting CSS

### Sections Stack Behind the Header

**Symptom**: Sections slide under a fixed header instead of below it.

**Solution:**
- Open the Sticky Sections settings sidebar
- Set **Sticky Offset** to match your header height (e.g., `80px`, `5rem`)

### No Effect Visible in the Editor

**Expected behavior**: The stacking effect is intentionally disabled in the editor so you can easily select and edit individual sections. Preview your page to see the effect.

### Shadow Not Appearing

**Symptom**: No depth shadow between stacking sections.

**Possible Causes:**
1. JavaScript not loaded — the shadow class (`dsgo-sticky-sections__stacking`) is added by `view.js`
2. Only one section exists (shadows only appear on the 2nd section and beyond)

**Solutions:**
- Ensure the block's `view.js` is loading (check for JS errors in console)
- Add at least 2 sections

---

## Accessibility

### Keyboard Navigation

- All content within sections is accessible via keyboard
- Tab navigation works normally through all sections
- No keyboard traps — the sticky effect doesn't interfere with navigation

### Screen Readers

- Content is in semantic HTML order (DOM order matches visual order)
- No content is hidden — all sections are visible and accessible
- Proper heading hierarchy is preserved within sections

### Reduced Motion

**Automatic Support:**
- Detects `prefers-reduced-motion: reduce` user preference
- Disables sticky positioning — sections stack normally
- Both CSS media query and JavaScript check are applied
- Full content remains accessible without the scroll effect

### Print

- Sticky positioning is disabled in print media
- All sections render in normal document flow
- No content is cut off or overlapping

### Mobile

- Sticky effect disabled below 781px for usability
- Sections stack vertically in normal flow
- All content remains accessible and readable

---

## Block Architecture

```
Sticky Sections (designsetgo/sticky-sections)
├─ Section (designsetgo/section)
│  └─ Any blocks (headings, paragraphs, images, etc.)
├─ Section (designsetgo/section)
│  └─ Any blocks
└─ Section (designsetgo/section)
   └─ Any blocks
```

**Key Files:**
- `src/blocks/sticky-sections/block.json` — Block metadata and attributes
- `src/blocks/sticky-sections/edit.js` — Editor component with template chooser
- `src/blocks/sticky-sections/save.js` — Frontend markup with CSS custom property
- `src/blocks/sticky-sections/view.js` — Progressive enhancement (z-index, shadows)
- `src/blocks/sticky-sections/style.scss` — Frontend styles (sticky, z-index, responsive)
- `src/blocks/sticky-sections/editor.scss` — Editor overrides (disables sticky in editor)
- `src/blocks/sticky-sections/templates.js` — Template definitions for the chooser

---

## Related Blocks

- **Section**: The required child block — provides backgrounds, padding, and content containers
- **Scroll Accordion**: Similar scroll-stacking effect with scaling animation and custom item blocks
- **Row**: Horizontal layout container
- **Grid**: Grid layout container

---

## Frequently Asked Questions

**Q: How is this different from the Scroll Accordion block?**
A: Sticky Sections uses full-width Section blocks as children and relies on pure CSS `position: sticky` for the effect. Scroll Accordion uses its own item blocks with JavaScript-driven scale animations. Sticky Sections is simpler and more performant; Scroll Accordion offers more animation control.

**Q: Can I use blocks other than Section inside?**
A: No — only `designsetgo/section` blocks are allowed as children. This constraint ensures the sticky stacking effect works correctly.

**Q: Why don't I see the stacking effect in the editor?**
A: The effect is intentionally disabled in the editor so you can easily select and edit sections. Preview your page to see the stacking in action.

**Q: How do I handle a fixed header?**
A: Set the **Sticky Offset** in the block settings to match your header height (e.g., `80px`).

**Q: Does it work on mobile?**
A: On mobile devices (<781px), sections stack normally without sticky behavior. This is by design for usability.

**Q: Can I reinitialize after dynamic content loads?**
A: Yes — dispatch a custom event: `document.dispatchEvent(new Event('sticky-sections:reinit'))`.

**Q: Can I nest Sticky Sections blocks?**
A: Not recommended — nested sticky positioning creates unpredictable scroll behavior.

---

*Last Updated: 2026-03-08*
*DesignSetGo v1.0.0*
*WordPress 6.4+*
