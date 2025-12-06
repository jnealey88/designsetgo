# Text Reveal Extension - User Guide

**Compatible With**: Paragraphs and Headings (core/paragraph, core/heading)
**Since**: 1.3.0
**Status**: Production Ready

## Overview

The **Text Reveal Extension** adds a scroll-triggered text color reveal effect that simulates natural reading progression. As users scroll, text progressively changes color from left-to-right, creating an engaging reading experience.

**Features:**
- Scroll-triggered color animation
- Word or character split modes
- Configurable reveal color via theme palette
- Adjustable transition speed
- Respects `prefers-reduced-motion` accessibility setting
- Performance-optimized with Intersection Observer

## How to Use

1. Select any **Paragraph** or **Heading** block
2. Open the block settings sidebar
3. Find the **Text Reveal** panel
4. Toggle **Enable Text Reveal** to ON
5. Choose your reveal color from the **Colors** panel (under "Text Reveal > Reveal Color")
6. Configure split mode and transition speed as needed

## Settings

### Enable Text Reveal
Toggle the scroll-triggered reveal effect on or off.

### Split Mode
Choose how text is divided for the animation:
- **Word** (default): Each word reveals individually - smoother, more natural reading flow
- **Character**: Each character reveals individually - more dramatic effect, best for short headings

### Transition Speed
How fast each word/character transitions to the reveal color:
- **Fast (100ms)**: Quick, snappy transitions
- **Normal (150ms)**: Balanced timing (default)
- **Slow (250ms)**: Deliberate, elegant transitions
- **Very Slow (400ms)**: Dramatic, cinematic effect
- **Custom**: Use the slider for precise control (50ms - 500ms)

### Reveal Color
Set in the **Colors** panel (appears when Text Reveal is enabled):
- Choose from your theme's color palette
- Use custom colors via the color picker
- The text transitions FROM your default text color TO this reveal color

## Use Cases

### 1. Hero Section Headlines
Apply to your main headline with character split mode for maximum impact:
```
"Welcome to the Future" - reveals character by character as users scroll
```

### 2. Article Introduction
Use word split mode on your opening paragraph to draw readers into the content.

### 3. Key Statistics or Quotes
Highlight important text that should capture attention as users scroll.

### 4. Call-to-Action Sections
Make your CTA copy more engaging with progressive color reveal.

## Best Practices

**DO:**
- Use on important content you want users to focus on
- Choose a reveal color with good contrast against your background
- Keep transitions reasonable (150-250ms feels natural)
- Test on mobile devices to ensure readability
- Use word mode for body text, character mode for short headlines

**DON'T:**
- Apply to every paragraph (causes fatigue)
- Use colors with poor contrast
- Combine with other text animations (visual overload)
- Use character mode on long paragraphs (too slow to reveal)
- Ignore accessibility - always test with reduced motion enabled

## Accessibility

The Text Reveal extension respects the `prefers-reduced-motion` media query:
- When enabled, text displays in the reveal color immediately without animation
- Screen readers receive the full text content regardless of scroll position
- All text remains readable even before/during animation

## Technical Notes

- Uses CSS transitions for smooth, performant animations
- IntersectionObserver API for efficient scroll detection
- Text is split into spans with ARIA attributes for accessibility
- Falls back gracefully if JavaScript is disabled (shows text in reveal color)
- CSS variables control timing and colors
- Clean up functions prevent memory leaks

## Troubleshooting

### Effect not appearing
1. Ensure the block is a Paragraph or Heading block
2. Verify "Enable Text Reveal" is toggled ON
3. Check that you've set a reveal color
4. Scroll the page - effect only triggers when scrolling

### Animation feels wrong
1. Adjust the transition speed to match your content
2. For long text, use "Word" mode
3. For short headlines, try "Character" mode

### Color not showing
1. Open the Colors panel in block settings
2. Look for "Text Reveal > Reveal Color"
3. Select a color from your palette or use custom

### Accessibility concerns
1. Test with browser "reduce motion" setting enabled
2. Ensure sufficient color contrast between original and reveal colors
3. Verify text is readable in both states
