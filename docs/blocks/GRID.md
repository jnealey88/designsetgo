# Grid Container Block - User Guide

**Version**: 1.0.0
**Category**: Design
**Keywords**: grid, columns, layout, container, responsive

## Overview

The **Grid Block** is the backbone of responsive layout design. While the standard "Columns" block is useful, the Grid block offers true 2-dimensional layout control, allowing for complex arrangements that adapt fluidly to any screen size without complex nesting.

## 🚀 Quick Start: Building a 3-Column Feature Section

1.  **Insert Block**: Add the **Grid** block.
2.  **Configure Columns**:
    *   Desktop: `3`
    *   Tablet: `2`
    *   Mobile: `1`
3.  **Add Content**:
    *   Insert a **Card** block (or Group) into the grid. This is Item 1.
    *   Duplicate it twice to create Item 2 and Item 3.
4.  **Adjust Spacing**:
    *   Set **Column Gap** to `2rem` (32px).
    *   Set **Row Gap** to `2rem`.
5.  **Equal Heights**: Ensure **Align Items** is set to `Stretch`. Now, if one card has more text, the others will stretch to match its height.

## ⚙️ Settings & Configuration

### Grid Settings Panel

**Desktop Columns**
- Range: 1-12 columns
- Controls the number of columns on screens wider than 1024px.

**Tablet Columns**
- Range: 1 to desktop column count
- Controls columns on screens 768px-1024px wide.

**Mobile Columns**
- Range: 1 to tablet column count
- Controls columns on screens below 768px.
- **Tip**: Keep at 1 for best readability.

**Align Items**
- **Stretch** (Default): Items expand to fill the full height of their cell.
- **Start**: Items align to top.
- **Center**: Items center vertically.
- **End**: Items align to bottom.

### Gap Settings Panel

**Custom Row/Column Gaps**
- **Block Gap** (Default): Uses WordPress spacing presets.
- **Custom**: Set independent Row and Column gaps (e.g., `20px` row, `40px` column).

### Width Settings Panel

**Constrain Inner Width**
- Centers content with a maximum width constraint (e.g., `1140px`).
- Useful for maintaining readable line lengths in full-width sections.

## 💡 Common Use Cases

### 1. Feature Section
Showcase 3-6 key features. Use `Stretch` alignment for equal height cards.

### 2. Photo Galleries
Create a masonry-style or rigid grid of images.

### 3. Footer Layouts
Organize footer widgets into columns (Logo, Links, Contact, Social).

### 4. Team Member Grid
Showcase team members with photos and bios.

## 🎨 Styling & Customization

*   **Hover Effects**: Use the "Hover Settings" panel to change background/text colors on hover.
*   **Spanning**: Some Grid implementations allow children to "span" multiple columns.
*   **Backgrounds**: You can apply a background color to the entire Grid container.

## ✅ Best Practices

**DO:**
- Use odd number of columns (3, 5) for visual balance on desktop.
- Reduce columns on smaller screens (Desktop 4 → Tablet 2 → Mobile 1).
- Use "Stretch" alignment for uniform card heights.

**DON'T:**
- Use too many columns (6+ makes items too narrow).
- Forget to test tablet and mobile breakpoints.

## ♿ Accessibility

*   **Semantic HTML**: Choose appropriate HTML elements (`<section>`, `<article>`, etc.) in the Advanced settings.
*   **Reading Order**: Ensure reading order makes sense (top to bottom, left to right).
*   **Keyboard Navigation**: Interactive grid items must be keyboard accessible.

## 👨‍💻 Developer Notes

*   **CSS Grid**: This block outputs `display: grid`.
*   **Variables**: It uses CSS variables for the column counts:
    ```css
    .wp-block-designsetgo-grid {
        display: grid;
        grid-template-columns: repeat(var(--grid-cols-desktop), 1fr);
        gap: var(--grid-gap);
    }
    @media (max-width: 768px) {
        .wp-block-designsetgo-grid {
            grid-template-columns: repeat(var(--grid-cols-tablet), 1fr);
        }
    }
    ```
*   **Tag Name**: You can change the HTML tag from `div` to `ul` (for lists) or `section` for semantic correctness.

## ❓ FAQ

**Q: What's the difference between Grid and Row blocks?**
A: Grid uses CSS Grid for multi-column layouts. Row uses Flexbox for 1D layouts.

**Q: How do I make all grid items the same height?**
A: Set "Align Items" to "Stretch".

**Q: Why do my gaps disappear on mobile?**
A: Check if you used `vw` units for gaps. Use `px` or `rem` for consistency.
