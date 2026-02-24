# Table of Contents Block

Auto-generate a table of contents from page headings with smooth scroll navigation, scroll spy highlighting, and responsive mobile support.

## Features

- **Auto-scanning**: Automatically detects headings (H2-H6) on the page
- **Customizable levels**: Select which heading levels to include via checkboxes
- **Display modes**: Hierarchical (nested) or flat list
- **List styles**: Ordered (numbered) or unordered (bullets)
- **Smooth scrolling**: Click links to smoothly scroll to sections
- **Scroll spy**: Automatically highlights the current section as you scroll
- **Sticky positioning**: Use WordPress core position support for sticky TOC
- **Mobile responsive**: Automatically becomes collapsible on mobile devices
- **Accessible**: Full keyboard navigation and screen reader support
- **Auto-generated anchors**: Automatically generates IDs for headings that lack them

## Use Cases

- Long blog posts
- Documentation pages
- Tutorial content
- Legal pages
- Guides and resources
- Multi-section articles

## Settings

### Heading Levels Panel

Select which heading levels to include in the table of contents:

- **Include H2** - Show H2 headings (default: on)
- **Include H3** - Show H3 headings (default: on)
- **Include H4** - Show H4 headings (default: off)
- **Include H5** - Show H5 headings (default: off)
- **Include H6** - Show H6 headings (default: off)

### Display Settings Panel

- **Display Mode**
  - Hierarchical (Nested) - Shows headings in a nested structure
  - Flat List - Shows all headings in a single-level list

- **List Style**
  - Unordered (Bullets) - Uses bullet points
  - Ordered (Numbers) - Uses numbers for list items

### Title Settings Panel

- **Show Title** - Toggle the TOC title on/off (default: on)
- **Title Text** - Customize the TOC heading text (default: "Table of Contents")

### Scroll Settings Panel

- **Smooth Scroll** - Enable smooth scrolling when clicking links (default: on)
- **Scroll Offset** - Offset from top when scrolling (0-200px, default: 0)
  - Useful for sticky headers or navigation bars

### Color Settings (Sidebar Group)

- **Link Color** - Color for TOC links
- **Active Link Color** - Color for the currently active link (scroll spy)

### Block Supports

The block also supports:

- **Position**: Sticky positioning for fixed TOC
- **Spacing**: Padding, margin, and block gap controls
- **Typography**: Font size, line height, and font family
- **Colors**: Background, text, and link colors
- **Border**: Border color, radius, style, and width

## Usage

### Basic Usage

1. Insert the "Table of Contents" block where you want it to appear
2. The block will automatically scan your page for headings
3. Customize which heading levels to include using the checkboxes
4. Adjust display mode and list style as needed

### With Sticky Positioning

1. Add the Table of Contents block
2. In the block toolbar, click the "Position" button
3. Select "Sticky" from the position options
4. The TOC will now stay fixed while scrolling

### With Scroll Offset

If you have a sticky header:

1. Measure your header height (e.g., 80px)
2. Set "Scroll Offset" to that value
3. Links will scroll to account for the header

### Custom Colors

1. Open the "Colors" panel in the sidebar
2. Set "Link Color" to match your theme
3. Set "Active Link Color" to highlight the current section
4. Colors will use theme presets by default

## Technical Details

### How It Works

1. **On page load**: JavaScript scans the DOM for heading elements (H2-H6)
2. **ID generation**: Headings without IDs automatically get unique IDs
3. **TOC population**: The list is built based on display mode (hierarchical or flat)
4. **Click handling**: Links smoothly scroll to their target heading
5. **Scroll spy**: IntersectionObserver tracks which heading is currently visible
6. **Active highlighting**: The corresponding link is highlighted as you scroll

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses IntersectionObserver API for scroll spy
- Gracefully degrades in older browsers

### Performance

- Lightweight: ~15KB total JavaScript (5.4KB frontend + 10.4KB editor, unminified)
- Frontend: Only 2.1KB gzipped
- Uses IntersectionObserver (not scroll events) for performance
- Single initialization per block (prevents duplicate instances)
- Efficient DOM queries with data attribute caching

### Accessibility

- Semantic HTML with proper heading hierarchy
- ARIA labels on links for screen readers
- Keyboard navigation support
- Focus management for keyboard users
- High contrast mode support
- Reduced motion support

## Developer Notes

### Data Attributes

The block uses data attributes for configuration:

- `data-unique-id` - Unique identifier for the block
- `data-heading-levels` - Comma-separated list of levels (e.g., "h2,h3")
- `data-display-mode` - "hierarchical" or "flat"
- `data-scroll-smooth` - "true" or "false"
- `data-scroll-offset` - Number in pixels

### CSS Custom Properties

The block uses CSS custom properties for styling:

- `--dsgo-toc-link-color` - Color for links
- `--dsgo-toc-active-link-color` - Color for active link
- `--dsgo-toc-indent` - Indentation for nested lists (default: 1.5rem desktop, 1rem mobile)

### JavaScript API

Initialize or re-initialize the block:

```javascript
// Re-initialize all TOC blocks
window.dispatchEvent(new Event('dsgo-reinit-toc'));
```

### Implementation Note

All heading scanning and hierarchy building functionality is handled internally by the `DSGTableOfContents` class in [view.js](view.js). No external utilities are required.

## Limitations

- Only scans static content (not dynamically loaded after page load)
- Headings inside the TOC block itself are excluded
- Requires JavaScript for full functionality
- Mobile collapsible feature is CSS-only (always on at mobile breakpoints)

## Future Enhancements

Potential future features:

- Exclude specific headings by CSS selector
- Custom collapse/expand icons
- Animation options for scroll spy
- Print-friendly styling
- Copy link to section
- Progress indicator
- Multi-page support

## Version History

- **1.0.0** (2025-11-19) - Initial release
  - Auto-scanning of headings
  - Hierarchical and flat display modes
  - Smooth scroll with offset
  - Scroll spy highlighting
  - Mobile responsive
  - Full accessibility support

## Support

For issues or feature requests, please visit the [GitHub repository](https://github.com/jnealey-godaddy/designsetgo).
