# Clickable Group Extension - User Guide

**Compatible With**: Group, Section, Row, Grid blocks
**Since**: 1.0.0

## Overview

The **Clickable Group Extension** makes entire container blocks clickable, perfect for card designs where the whole area should navigate to a destination. Click anywhere on the container to follow the link.

**Key Features:**
- Turn any container into a clickable link
- Open in new tab option
- Custom rel attributes (nofollow, sponsored, etc.)
- Works with nested links and buttons (they take priority)
- Respects accessibility (keyboard navigation, screen readers)
- Visual hover effects

## 🚀 Quick Start

1. Create a **Group**, **Section**, **Row**, or **Grid** block
2. Add content (image, heading, paragraph, etc.)
3. Open **Link Settings** panel in sidebar
4. Enter a **URL** (e.g., https://example.com/product)
5. Optionally enable **Open in new tab**
6. Frontend: Click anywhere on container to navigate

## ⚙️ Settings & Configuration

### Link Settings Panel
- **URL**: Destination link (internal or external)
- **Open in new tab**: Opens link in new browser tab/window
- **Link Rel**: Relationship attribute (e.g., "nofollow noopener", "sponsored")
- **Preview link**: Test link before publishing

### Supported Blocks
- **core/group**: WordPress core Group block
- **designsetgo/section**: Section block (vertical stack)
- **designsetgo/row**: Row block (horizontal flex)
- **designsetgo/grid**: Grid block

## 💡 Common Use Cases

### 1. Product/Service Cards
Image + heading + description all clickable to product page.

### 2. Blog Post Previews
Entire card (featured image, title, excerpt) links to full post.

### 3. Team Member Cards
Photo + bio + social links - card links to full profile, social icons link to respective platforms.

### 4. Portfolio Items
Project thumbnail + title links to case study.

## ✅ Best Practices

**DO:**
- Add visual hover effects (scale, shadow, opacity)
- Ensure nested links/buttons still work (they take priority)
- Use cursor pointer styling (added automatically)
- Test keyboard navigation (Enter key should work)
- Use descriptive URLs (users see in status bar)

**DON'T:**
- Make critical navigation clickable groups (use normal links)
- Nest clickable groups inside each other
- Forget to test with nested interactive elements (forms, buttons)
- Use for accordion headers (conflicts with toggle behavior)
- Set URL to "#" or empty (removes clickable behavior)

## 💡 Tips & Tricks

- **Nested Links Priority**: Links and buttons inside clickable group work normally (they prevent group click)
- **Hover Effects**: Add CSS transitions for smooth hover states
- **Accessibility**: Automatically adds ARIA attributes for screen readers
- **External Links**: Use rel="noopener noreferrer" for security when opening in new tab
- **Debugging**: If click not working, check for overlapping elements with higher z-index
- **Preview**: Use "Preview link" in sidebar to test before publishing

## Technical Notes

- Uses event delegation (clicks anywhere on container trigger navigation)
- Checks `e.target.closest('a, button')` to avoid interfering with nested links
- External links in new tab get `window.opener = null` for security
- Data attributes store link info (`data-link-url`, `data-link-target`, `data-link-rel`)
- CSS class `.dsgo-clickable` added for styling
