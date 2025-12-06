# Text Style Format - User Guide

**Compatible With**: Any text within Paragraphs, Headings, and other RichText blocks
**Since**: 1.3.0
**Status**: Production Ready

## Overview

The **Text Style Format** is a new inline formatting option that allows you to apply custom styles to selected text within any RichText content. Similar to bold or italic, you can select specific words or phrases and apply text colors, highlights, font sizes, and more.

**Features:**
- Text color (solid colors + gradient text fill)
- Background highlight (solid colors + gradient)
- Font size (S/M/L/XL presets + custom values)
- Padding (None/S/M/L presets)
- Border radius (None/S/M/L presets)
- Theme color palette integration
- Custom color picker with gradients

## How to Use

1. Select text within any **Paragraph**, **Heading**, or other RichText block
2. Look for the **Text Style** button in the block toolbar (paint brush icon)
3. Click to open the Text Style popover
4. Apply your desired styles
5. Click outside the popover to close

The format is applied to your selected text, just like bold or italic.

## Settings

### Font Size
Choose from preset sizes or enter a custom value:
- **S** (Small): 87.5% of normal size
- **M** (Medium): Reset to normal size
- **L** (Large): 125% of normal size
- **XL** (Extra Large): 150% of normal size
- **Custom**: Enter any value with units (em, px, rem, %)

### Padding
Add space around the styled text (useful with background colors):
- **None**: No padding
- **S** (Small): 0.1em 0.25em
- **M** (Medium): 0.25em 0.5em
- **L** (Large): 0.5em 0.75em

### Border Radius
Round the corners of highlighted text:
- **None**: Sharp corners
- **S** (Small): Subtle rounding (0.15em)
- **M** (Medium): Moderate rounding (0.3em)
- **L** (Large): Prominent rounding (0.5em)

### Text Color
Set the color of the text itself:
- **Solid**: Choose from theme palette or custom color
- **Gradient**: Apply a gradient fill to the text (creates eye-catching gradient text)

### Background / Highlight
Set a background color behind the text:
- **Solid**: Choose from theme palette or custom color
- **Gradient**: Apply a gradient background

## Important: Gradient Text Limitations

When using **gradient text color**, background colors are automatically cleared. This is because gradient text uses CSS `background-clip: text`, which clips ALL backgrounds to the text shape. If you need both gradient text AND a background, consider wrapping the text in a styled container block instead.

## Use Cases

### 1. Highlight Key Terms
Apply a yellow or light background to important words:
```
Our plugin offers [industry-leading performance] for your WordPress site.
```
Apply: Background color + Small padding + Small border radius

### 2. Gradient Text Headlines
Make hero text stand out with gradient fill:
```
[Welcome to the Future]
```
Apply: Gradient text color + XL font size

### 3. Call-to-Action Emphasis
Draw attention to action words:
```
[Sign up today] and get 50% off your first month.
```
Apply: Bold background color + Medium padding + text color

### 4. Pricing/Numbers
Highlight prices or statistics:
```
Starting at just [$9.99/month]
```
Apply: Larger font size + accent color

### 5. Inline Badges
Create pill-style labels within text:
```
This feature is [NEW] and available now.
```
Apply: Background + Padding + Border radius + Smaller text

## Best Practices

**DO:**
- Use sparingly for maximum impact
- Ensure sufficient color contrast for accessibility
- Test with your theme's color palette first
- Use padding with backgrounds for better appearance
- Combine font size changes with color for emphasis hierarchy

**DON'T:**
- Style entire paragraphs (use block-level controls instead)
- Apply too many different styles (visual noise)
- Use gradient text with background colors (not supported)
- Forget to check mobile appearance
- Use colors that clash with your theme

## Clearing Styles

To remove Text Style formatting:
1. Select the styled text
2. Click the Text Style button in the toolbar
3. Click **Clear All Styles** at the bottom of the popover

Alternatively, you can manually clear individual properties by clicking their clear/reset buttons.

## Technical Notes

- Implemented as a RichText format type
- Styles stored inline on `<span>` elements
- CSS class `dsgo-text-style` applied to styled spans
- Gradient text adds `dsgo-text-style--gradient-text` class
- Gradient background adds `dsgo-text-style--gradient-highlight` class
- Fully compatible with the WordPress block editor undo/redo system
- Styles persist when copying/pasting text

## Accessibility Considerations

- Always ensure text color has sufficient contrast against its background
- Gradient text should still be readable over the underlying background
- Use semantic emphasis (bold/italic) in addition to color for screen readers
- Test with browser zoom to ensure styled text scales properly
- Avoid using color alone to convey meaning

## Troubleshooting

### Style not applying
1. Ensure you have text selected before opening the popover
2. Make sure you're in a supported block (Paragraph, Heading, etc.)
3. Check that styles are being set (not just opening/closing popover)

### Gradient text not showing background
This is expected behavior. Gradient text uses `background-clip: text`, which clips any background to the text shape. Use either gradient text OR a background, not both.

### Colors look different on frontend
1. Ensure your theme isn't overriding text colors
2. Check for CSS specificity conflicts
3. Verify the style.scss is loading on the frontend

### Styles disappeared
1. Check if the text is still wrapped in the span (inspect element)
2. Try undo (Ctrl/Cmd+Z) to restore
3. Re-apply the styles if needed
