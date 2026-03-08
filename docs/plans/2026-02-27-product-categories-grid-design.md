# Product Categories Grid Block — Design

**Date:** 2026-02-27
**Status:** Draft
**Block:** `designsetgo/product-categories-grid`
**Category:** `design`
**Version:** Next release
**Depends on:** WooCommerce (graceful bailout if not active)

---

## Overview

Displays WooCommerce product categories in a responsive grid. Each card shows the category image, name, and optionally the product count. Categories can be flagged as "featured" to span two columns for visual hierarchy.

Pairs with the existing Product Showcase Hero block to form a complete shop landing page story: hero highlights one product, categories grid helps users navigate the rest of the catalog.

**JTBD:** "When customers land on my shop page, I want visual category navigation with images, so they find product types quickly."

---

## Selection Modes

Two modes, toggled via a `categorySource` attribute (mirrors `productSource` pattern from Product Showcase Hero):

### All Categories (default)

- Queries all top-level `product_cat` terms
- Ordered by `menu_order` then `name` (WooCommerce default)
- Optional exclude list (multi-select of categories to hide)
- Hides empty categories by default (toggleable via `showEmpty` attribute)

### Manual

- Category picker in the sidebar (ComboboxControl, same pattern as ProductPicker)
- Users hand-pick categories and control display order via drag-and-drop reordering
- Featured flag is per-category in this mode
- No limit on count, but grid columns constrain visual layout

---

## Attributes

```json
{
  "categorySource": {
    "type": "string",
    "default": "all",
    "enum": ["all", "manual"]
  },
  "selectedCategories": {
    "type": "array",
    "default": [],
    "items": {
      "type": "object",
      "properties": {
        "id": { "type": "number" },
        "featured": { "type": "boolean" }
      }
    }
  },
  "excludeCategories": {
    "type": "array",
    "default": [],
    "items": { "type": "number" }
  },
  "columns": {
    "type": "number",
    "default": 3,
    "minimum": 2,
    "maximum": 5
  },
  "showProductCount": {
    "type": "boolean",
    "default": true
  },
  "showEmpty": {
    "type": "boolean",
    "default": false
  },
  "imageAspectRatio": {
    "type": "string",
    "default": "3/4",
    "enum": ["1/1", "3/4", "4/3", "16/9"]
  }
}
```

**Note:** `selectedCategories` is only used when `categorySource` is `"manual"`. The `featured` boolean on each entry controls the 2-column span. In "all" mode, featured is not available (all categories render equally).

---

## Block Supports

Leverage `block.json` supports before custom controls:

```json
{
  "supports": {
    "anchor": true,
    "align": ["wide", "full"],
    "html": false,
    "color": {
      "background": true,
      "text": true,
      "gradients": true,
      "link": true,
      "__experimentalDefaultControls": {
        "background": true,
        "text": true
      }
    },
    "spacing": {
      "margin": true,
      "padding": true,
      "blockGap": true,
      "__experimentalDefaultControls": {
        "blockGap": true
      }
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "__experimentalDefaultControls": {
        "fontSize": true
      }
    },
    "__experimentalBorder": {
      "color": true,
      "radius": true,
      "style": true,
      "width": true,
      "__experimentalDefaultControls": {
        "radius": true
      }
    },
    "shadow": true
  }
}
```

---

## Editor Experience

### Placeholder (no categories / WooCommerce not active)

- Icon: `category` or `grid`
- Label: "Product Categories Grid"
- Instructions: "Display your WooCommerce product categories in a visual grid."
- If WooCommerce not detected: show notice "This block requires WooCommerce."

### Sidebar (InspectorControls)

**Panel: Categories**
- Toggle: "All categories" / "Manual selection" (controls `categorySource`)
- All mode: Multi-select to exclude categories
- Manual mode: Category picker (ComboboxControl searching `/wc/store/v1/products/categories`), sortable list of selected categories with featured toggle per item, remove button per item

**Panel: Display**
- `showProductCount` toggle (default: on)
- `showEmpty` toggle (default: off, only visible in "all" mode)

**Panel: Layout**
- `columns` RangeControl (2-5, default 3)
- `imageAspectRatio` ButtonGroup (1:1, 3:4, 4:3, 16:9)

### Editor Preview

- Fetches categories via `/wc/store/v1/products/categories` (WC Store API)
- Renders a live grid preview matching frontend output
- Categories missing images show a placeholder icon with a subtle editor-only notice: "Add images to your categories for best results"
- Loading state: Spinner in a Placeholder component

### BlockControls (Toolbar)

- Column count quick switcher (2, 3, 4 buttons)

---

## Server-Side Rendering (render.php)

### Data Flow

1. Bail if `wc_get_product` doesn't exist (WooCommerce not active)
2. Determine source mode from `categorySource` attribute
3. Query categories:
   - All mode: `get_terms('product_cat', ['hide_empty' => !$show_empty, 'parent' => 0, 'exclude' => $exclude, 'orderby' => 'menu_order', 'order' => 'ASC'])`
   - Manual mode: `get_terms('product_cat', ['include' => $selected_ids, 'hide_empty' => false, 'orderby' => 'include'])` — preserves user-defined order
4. Bail silently if no categories returned
5. Render grid HTML

### HTML Structure

```html
<div class="wp-block-designsetgo-product-categories-grid dsgo-product-categories-grid dsgo-product-categories-grid--cols-3">
  <a href="{category_archive_url}" class="dsgo-product-categories-grid__card dsgo-product-categories-grid__card--featured">
    <div class="dsgo-product-categories-grid__image-wrapper">
      <img class="dsgo-product-categories-grid__image" ... />
      <!-- OR placeholder: -->
      <div class="dsgo-product-categories-grid__placeholder-icon">
        <svg>...</svg>
      </div>
    </div>
    <div class="dsgo-product-categories-grid__info">
      <h3 class="dsgo-product-categories-grid__name">{Category Name}</h3>
      <span class="dsgo-product-categories-grid__count">{N} products</span>
    </div>
  </a>
  <!-- more cards... -->
</div>
```

**Key decisions:**
- Each card is an `<a>` tag (entire card is clickable, links to category archive)
- Featured cards get `--featured` modifier class for 2-column span
- Images use `wp_get_attachment_image()` for proper srcset/sizes
- Category name uses `<h3>` (appropriate for a grid of navigation cards)
- Product count uses `<span>` (not semantically a heading)
- All output escaped: `esc_url()`, `esc_html()`, `esc_attr()`

### No-Image Fallback

When a category has no thumbnail set:
- Render an SVG placeholder icon (inline, no external request)
- Icon: simple grid/shopping bag icon
- Styled with the text color from block supports for theme consistency

---

## CSS

### Frontend (`style.scss`)

```scss
.dsgo-product-categories-grid {
  display: grid;
  gap: var(--wp--style--block-gap, 1.5rem);

  // Column variants
  &--cols-2 { grid-template-columns: repeat(2, 1fr); }
  &--cols-3 { grid-template-columns: repeat(3, 1fr); }
  &--cols-4 { grid-template-columns: repeat(4, 1fr); }
  &--cols-5 { grid-template-columns: repeat(5, 1fr); }
}

.dsgo-product-categories-grid__card {
  display: block;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  border-radius: inherit;

  &--featured {
    grid-column: span 2;
  }

  &:hover .dsgo-product-categories-grid__image {
    transform: scale(1.05);
  }
}

.dsgo-product-categories-grid__image-wrapper {
  overflow: hidden;
  aspect-ratio: var(--dsgo-pcg-aspect-ratio, 3/4);
}

.dsgo-product-categories-grid__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.dsgo-product-categories-grid__info {
  padding: 1rem;
}

.dsgo-product-categories-grid__name {
  margin: 0;
  font-size: inherit;
}

.dsgo-product-categories-grid__count {
  opacity: 0.7;
  font-size: 0.875em;
}

// Responsive: collapse to 2 columns on tablet, 1 on mobile
@media (max-width: 781px) {
  .dsgo-product-categories-grid {
    &--cols-3,
    &--cols-4,
    &--cols-5 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .dsgo-product-categories-grid__card--featured {
    grid-column: span 2; // still featured on tablet
  }
}

@media (max-width: 480px) {
  .dsgo-product-categories-grid {
    &--cols-2,
    &--cols-3,
    &--cols-4,
    &--cols-5 {
      grid-template-columns: 1fr;
    }
  }

  .dsgo-product-categories-grid__card--featured {
    grid-column: span 1; // reset on mobile
  }
}
```

### Editor (`editor.scss`)

- Mirror frontend grid layout
- Add editor-only styles for the "no image" nudge notice
- Subtle dashed border on cards in manual mode to indicate reorderability

---

## File Structure

```
src/blocks/product-categories-grid/
  block.json
  index.js              # Block registration
  edit.js               # Editor component
  save.js               # Returns null (dynamic block)
  render.php            # Server-side rendering
  style.scss            # Frontend styles
  editor.scss           # Editor-only styles
  components/
    CategoryPicker.js   # ComboboxControl for searching categories
    CategoryList.js     # Sortable list of selected categories (manual mode)
    GridPreview.js      # Editor preview grid rendering
```

---

## API Endpoints Used

### Editor (JavaScript)

- `GET /wc/store/v1/products/categories` — list/search categories for picker and preview
- Query params: `search`, `per_page`, `parent` (for top-level filtering)

### Frontend (PHP)

- `get_terms('product_cat', ...)` — direct taxonomy query, no REST overhead
- `get_term_meta($term_id, 'thumbnail_id', true)` — category image
- `get_term_link($term)` — category archive URL

---

## Accessibility

- Each card is a single `<a>` element (one tab stop per card)
- Category images get `alt=""` (decorative, name is in the text below)
- Product count uses visually hidden full text: `<span class="screen-reader-text">24 products in Shoes</span>` with `aria-hidden="true"` on the visible abbreviated version
- Focus indicator inherits from theme (`:focus-visible` outline)
- Grid announced as navigation landmark: `role="navigation"` with `aria-label="Product categories"`

---

## Internationalization

- All user-facing strings wrapped in `__()` / `esc_html__()`
- Product count: `sprintf(_n('%d product', '%d products', $count, 'designsetgo'), $count)`
- Text domain: `designsetgo`

---

## Security

- `defined('ABSPATH') || exit;` at top of render.php
- All term data escaped on output: `esc_html()`, `esc_url()`, `esc_attr()`
- Category IDs validated with `absint()` before query
- No user input flows unvalidated into queries
- `hide_empty` and `parent` are safe taxonomy query args

---

## Edge Cases

1. **WooCommerce not active** — Block renders nothing, editor shows notice
2. **No categories exist** — Editor shows placeholder with helpful message, frontend renders nothing
3. **Category with no image** — SVG placeholder icon, editor nudge
4. **Category with no products** — Hidden by default (`showEmpty: false`), toggleable
5. **Featured card in single-column mobile** — `grid-column: span 1` reset
6. **Manual mode with deleted category** — Filter out invalid IDs at render time, skip gracefully
7. **Uncategorized category** — Excluded by default in "all" mode (WC's default "Uncategorized" term)

---

## Future Enhancements (not in v1)

- Subcategory display (nested grids or accordion)
- Category description overlay on hover
- Masonry layout option
- Custom link override per category (manual mode)
- Animation on scroll (fade-in cards)

---

## Implementation Sequence

1. Scaffold block files (`block.json`, `index.js`, `save.js`)
2. Build `render.php` — server-side query and HTML output
3. Build `style.scss` — grid layout, responsive, hover effect
4. Build `edit.js` — sidebar controls, "all" mode with live preview
5. Build `CategoryPicker.js` — ComboboxControl searching WC Store API
6. Build `CategoryList.js` — sortable selected list with featured toggle
7. Build `editor.scss` — editor-specific styles
8. Wire up manual mode in `edit.js`
9. Register block in plugin loader, add to collection
10. Test: editor + frontend + responsive + no-WooCommerce + empty states
