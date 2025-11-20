# Modal Gallery Navigation

The Modal Gallery Navigation feature allows you to link multiple modals together to create a navigable gallery experience. Users can browse through a collection of modals using navigation buttons, keyboard shortcuts, or swipe gestures on touch devices.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Configuration Options](#configuration-options)
- [Navigation Methods](#navigation-methods)
- [Gallery Variations](#gallery-variations)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

Gallery navigation is perfect for:

- **Image Galleries**: Browse through a collection of images with captions
- **Product Showcases**: Navigate through product details and images
- **Portfolio Items**: Display project details in a sequential gallery
- **Team Member Bios**: Create a browsable team directory
- **Step-by-Step Tutorials**: Guide users through sequential content

### Key Features

- **Multiple Navigation Styles**: Choose from arrows, chevrons, or text labels
- **Flexible Positioning**: Place navigation controls on sides, top, or bottom
- **Keyboard Support**: Navigate with left/right arrow keys
- **Touch Gestures**: Swipe left/right on mobile devices
- **Automatic Indexing**: Modals are automatically organized by gallery index
- **Accessible**: Full ARIA support and keyboard navigation

## Quick Start

### Creating a Gallery

1. **Add Modal Blocks**: Insert multiple Modal blocks on your page
2. **Set Gallery Group ID**: Give all modals in the gallery the same `Gallery Group ID` (e.g., "product-gallery")
3. **Set Gallery Index**: Assign each modal a unique index (0, 1, 2, etc.) to determine order
4. **Add Triggers**: Add buttons or links with `data-modal-trigger="modal-id"` to open specific modals

### Example

```html
<!-- Trigger buttons -->
<button data-modal-trigger="product-1">View Product 1</button>
<button data-modal-trigger="product-2">View Product 2</button>
<button data-modal-trigger="product-3">View Product 3</button>

<!-- Modal blocks (configured in editor) -->
<!-- Modal 1: Gallery Group ID = "products", Gallery Index = 0 -->
<!-- Modal 2: Gallery Group ID = "products", Gallery Index = 1 -->
<!-- Modal 3: Gallery Group ID = "products", Gallery Index = 2 -->
```

When a user opens any modal in the gallery, they can navigate through all modals using:
- **Prev/Next buttons** (if navigation is enabled)
- **Arrow keys** (← →)
- **Swipe gestures** (on touch devices)

## Configuration Options

All gallery settings are found in the **Gallery Navigation** panel in the block inspector.

### Gallery Group ID

**Setting**: `Gallery Group ID`
**Type**: Text
**Default**: Empty (gallery disabled)

A unique identifier that links modals together. All modals with the same Group ID become part of the same gallery.

**Examples**:
- `product-gallery`
- `portfolio-2024`
- `team-members`
- `image-carousel`

### Gallery Index

**Setting**: `Gallery Index`
**Type**: Number (0-50)
**Default**: 0

The position of this modal in the gallery sequence. Lower numbers appear first.

**Best Practice**: Use increments of 1 (0, 1, 2, 3...) for easier management, but any order works (0, 10, 20, 30... also valid).

### Show Navigation

**Setting**: `Show Navigation`
**Type**: Toggle
**Default**: Enabled

Controls whether prev/next navigation buttons are displayed in the modal.

**Note**: Keyboard navigation and swipe gestures work even if navigation buttons are hidden.

### Navigation Style

**Setting**: `Navigation Style`
**Type**: Select
**Default**: Arrows
**Options**:
- **Arrows**: SVG arrow icons (best for most use cases)
- **Chevrons**: Simple ‹ › text characters (minimal, lightweight)
- **Text**: "Previous" / "Next" text labels (most explicit)

### Navigation Position

**Setting**: `Navigation Position`
**Type**: Select
**Default**: Sides
**Options**:
- **Sides**: Buttons positioned on left/right edges
- **Bottom**: Centered buttons at bottom of modal
- **Top**: Centered buttons at top of modal

**Best Practice**:
- Use **Sides** for image galleries and full-width content
- Use **Bottom** for content-heavy modals where navigation shouldn't overlap
- Use **Top** when modal content extends to the bottom

## Navigation Methods

### Button Navigation

Prev/Next buttons are automatically rendered when:
- Gallery has 2+ modals
- `Show Navigation` is enabled

Buttons automatically hide when reaching first/last modal (non-circular navigation).

### Keyboard Navigation

**Left Arrow (←)**: Navigate to previous modal
**Right Arrow (→)**: Navigate to next modal

Keyboard navigation:
- Works even if navigation buttons are hidden
- Only active when a modal is open
- Automatically enabled for all galleries

### Swipe Gestures (Touch Devices)

**Swipe Left**: Navigate to next modal
**Swipe Right**: Navigate to previous modal

Swipe gestures:
- Require minimum 50px swipe distance
- Distinguish horizontal swipes from vertical scrolling
- Work seamlessly with modal content scrolling
- Available on all touch-enabled devices

## Gallery Variations

DesignSetGo includes pre-configured gallery variations optimized for specific use cases:

### Image Gallery Item

**Use Case**: Photo galleries, lightboxes
**Features**:
- Full-screen image display
- White text caption overlay
- Dark backdrop (95% opacity)
- Side navigation with arrows
- Minimal chrome for image focus

**Default Settings**:
- Navigation Position: Sides
- Navigation Style: Arrows
- Close Button: Top-right (outside)
- Animation: Fade

### Product Gallery

**Use Case**: E-commerce product displays
**Features**:
- Two-column layout (60% image, 40% details)
- Product name, description, and CTA button
- Side navigation for browsing products

**Default Settings**:
- Navigation Position: Sides
- Navigation Style: Arrows
- Close Button: Inside top-right
- Animation: Slide up

### Portfolio Item

**Use Case**: Project showcases, case studies
**Features**:
- Full-width project image
- Centered title and description
- Action buttons (View Site, Case Study)
- Bottom navigation with chevrons

**Default Settings**:
- Navigation Position: Bottom
- Navigation Style: Chevrons
- Close Button: Top-right (outside)
- Animation: Zoom

### Team Member Gallery

**Use Case**: Team directories, staff bios
**Features**:
- Two-column layout (35% photo, 65% bio)
- Rounded photo style
- Contact information section
- Text-based navigation at bottom

**Default Settings**:
- Navigation Position: Bottom
- Navigation Style: Text
- Close Button: Inside top-right
- Animation: Slide down

## Best Practices

### Gallery Organization

1. **Use Meaningful Group IDs**: Choose descriptive names like `summer-2024-gallery` instead of generic `gallery-1`
2. **Consistent Indexing**: Use sequential numbers (0, 1, 2...) for easier management
3. **Limit Gallery Size**: Keep galleries under 20 items for best performance
4. **Test Navigation Flow**: Verify the order makes sense by testing keyboard navigation

### Performance

1. **Lazy Load Images**: Use WordPress lazy loading for gallery images
2. **Optimize Media**: Compress images before uploading
3. **Limit Auto-Triggers**: Avoid auto-triggering gallery modals on page load

### Accessibility

1. **Descriptive Triggers**: Use clear button text like "View Product 1" not just "View"
2. **Image Alt Text**: Always provide alt text for gallery images
3. **Keyboard Testing**: Test full gallery navigation using only keyboard
4. **Screen Reader Testing**: Ensure ARIA labels are meaningful

### Mobile Experience

1. **Test Swipe Gestures**: Verify swipes don't conflict with content scrolling
2. **Touch-Friendly Buttons**: Navigation buttons auto-size for touch targets on mobile
3. **Responsive Content**: Ensure modal content adapts to small screens

## Examples

### Example 1: Image Gallery

Create a simple photo gallery with 5 images:

1. Insert 5 Modal blocks
2. In each modal:
   - Add an Image block
   - Add a Paragraph for caption
   - Set **Gallery Group ID** to `photos`
   - Set **Gallery Index** to 0-4 respectively
   - Enable **Show Navigation**
   - Set **Navigation Style** to Arrows
   - Set **Navigation Position** to Sides

3. Add trigger buttons:
```html
<button data-modal-trigger="photo-1">Photo 1</button>
<button data-modal-trigger="photo-2">Photo 2</button>
<!-- etc -->
```

### Example 2: Product Showcase with Custom Triggers

Use the Product Gallery variation with custom styling:

1. Insert 3 Product Gallery variations
2. Configure each:
   - **Gallery Group ID**: `products`
   - **Gallery Index**: 0, 1, 2
   - Add product images and details

3. Create custom trigger grid:
```html
<div class="product-grid">
  <div class="product-card">
    <img src="product-1-thumb.jpg" alt="Product 1">
    <button data-modal-trigger="product-1">Quick View</button>
  </div>
  <div class="product-card">
    <img src="product-2-thumb.jpg" alt="Product 2">
    <button data-modal-trigger="product-2">Quick View</button>
  </div>
  <!-- etc -->
</div>
```

### Example 3: Portfolio with Auto-Trigger

Create a portfolio that opens automatically on direct links:

1. Insert Portfolio Item variations
2. Configure gallery:
   - **Gallery Group ID**: `portfolio`
   - **Gallery Index**: Sequential (0, 1, 2...)
   - **Allow Hash Trigger**: Enabled
   - **Update URL on Open**: Enabled

3. Share direct links:
```
https://yoursite.com/portfolio/#project-1
https://yoursite.com/portfolio/#project-2
```

Users can navigate between projects using keyboard/swipe while URL updates.

## Troubleshooting

### Navigation buttons not appearing

**Check**:
- Gallery has 2+ modals with same Group ID
- "Show Navigation" is enabled
- Modal is actually open

### Wrong gallery order

**Fix**:
- Verify Gallery Index values (should be unique and sequential)
- Check that all modals have the same Gallery Group ID

### Swipe gestures not working

**Check**:
- Testing on an actual touch device (not desktop simulation)
- Swipe distance is at least 50px
- Horizontal swipe (not vertical)
- Gallery has 2+ modals

### Keyboard navigation not responding

**Check**:
- Modal is currently open and focused
- No other scripts intercepting arrow key events
- Gallery has 2+ modals with same Group ID

### Duplicate Group IDs

**Issue**: Multiple galleries on the same page with the same Group ID will be treated as one gallery

**Fix**: Use unique Group IDs for each separate gallery (e.g., `gallery-1`, `gallery-2`)

## Technical Details

### Data Attributes

Gallery settings are stored as data attributes on the modal element:

```html
<div class="dsgo-modal"
     data-gallery-group-id="products"
     data-gallery-index="0"
     data-show-gallery-navigation="true"
     data-navigation-style="arrows"
     data-navigation-position="sides">
```

### JavaScript Events

Custom events are dispatched during gallery navigation:

```javascript
// Modal opened
document.addEventListener('dsgo-modal-open', (e) => {
  console.log('Modal opened:', e.detail.modalId);
});

// Modal closed
document.addEventListener('dsgo-modal-close', (e) => {
  console.log('Modal closed:', e.detail.modalId);
});
```

### CSS Classes

Gallery navigation elements use these classes:

```css
.dsgo-modal__gallery-nav             /* Navigation container */
.dsgo-modal__gallery-nav--sides      /* Side positioning */
.dsgo-modal__gallery-nav--bottom     /* Bottom positioning */
.dsgo-modal__gallery-nav--top        /* Top positioning */
.dsgo-modal__gallery-prev            /* Previous button */
.dsgo-modal__gallery-next            /* Next button */
```

## Related Features

- **[Auto Triggers](MODAL-AUTO-TRIGGERS.md)**: Combine gallery navigation with auto-triggers for enhanced UX
- **Modal Variations**: Pre-built modal templates for common use cases
- **URL Hash Triggers**: Open specific gallery items via URL hash

---

**Last Updated**: November 2024
**Version**: 1.1.0
