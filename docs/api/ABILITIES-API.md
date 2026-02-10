# WordPress Abilities API Integration

## Overview

DesignSetGo is **the first WordPress block library** to integrate with the WordPress 6.9 Abilities API, making it the **most AI-friendly WordPress block plugin** available.

The Abilities API provides a centralized, machine-readable registry of all plugin capabilities, enabling AI agents (like Claude, ChatGPT, and custom automation tools) to discover and interact with DesignSetGo blocks programmatically.

## What is the Abilities API?

The WordPress Abilities API is a new core initiative that creates a structured way for plugins to expose their functionality to AI agents and automation tools. Think of it as a "capabilities registry" that AI can read to understand what your WordPress site can do.

### Key Benefits

- **AI-Native**: AI agents can discover abilities without hardcoding
- **Self-Documenting**: JSON Schema provides automatic validation
- **Machine-Readable**: Structured data that tools can parse
- **Permission-Controlled**: Built-in security through capability checks
- **REST API Enabled**: Access via standard WordPress REST endpoints

## Available Abilities

DesignSetGo currently provides **110 abilities** across 4 categories:

- **4 Info** - Discover abilities, list blocks, inspect post content, find blocks across posts
- **34 Inserters** - Insert any DesignSetGo block programmatically, including child-block inserters
- **62 Configurators** - Configure block attributes, apply animations/effects, form fields, and operations (batch update, delete)
- **10 Generators** - Generate complete page sections (hero, features, stats, FAQ, contact, pricing, team, testimonials, CTA, gallery)

### 1. Info Abilities (4)

#### `designsetgo/list-abilities`

Returns a manifest of all registered DesignSetGo abilities with their names, descriptions, categories, and input schemas. **Call this first** to discover what's available.

**Input:**
```json
{
  "category": "all"  // Options: "all", "inserter", "configurator", "generator", "info"
}
```

**Output:**
```json
{
  "abilities": [
    {
      "name": "designsetgo/insert-section",
      "label": "Insert Section",
      "description": "Inserts a Section block...",
      "category": "inserter",
      "input_schema": { ... }
    }
  ],
  "total": 110
}
```

**REST API Example:** (readonly — uses GET)
```bash
curl -X GET "http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/list-abilities/run?category=inserter" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### `designsetgo/list-blocks`

Lists all available DesignSetGo blocks with their metadata, attributes, and capabilities.

**Input:**
```json
{
  "category": "all",  // Options: "all", "layout", "interactive", "visual", "dynamic"
  "detail": "summary" // Options: "summary", "full"
}
```

**REST API Example:** (readonly — uses GET)
```bash
curl -X GET "http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/list-blocks/run?category=layout" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### `designsetgo/get-post-blocks`

Retrieves all blocks from a post with their attributes, enabling inspection of current content structure. Returns `blockIndex` values needed for configurator and delete abilities.

**Input:**
```json
{
  "post_id": 123,
  "block_name": "designsetgo/accordion",  // Optional: filter by block type
  "include_inner": true,                   // Include inner blocks (default: true)
  "flatten": false                         // Return flat list instead of nested (default: false)
}
```

**Output:**
```json
{
  "success": true,
  "post_id": 123,
  "blocks": [
    {
      "blockIndex": 0,
      "blockName": "designsetgo/section",
      "attrs": { "contentWidth": "1140px" },
      "innerBlocks": [ ... ]
    }
  ],
  "total": 5
}
```

**REST API Example:** (readonly — uses GET)
```bash
curl -X GET "http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/get-post-blocks/run?post_id=123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### `designsetgo/find-blocks`

Searches for blocks of a specific type across posts, returning locations and counts. Useful for content audits and bulk operations.

**Input:**
```json
{
  "block_name": "designsetgo/accordion",  // Required
  "post_type": "page",                    // Default: "page"
  "post_status": "publish",               // Default: "publish"
  "limit": 50                             // Max posts to search (1-100)
}
```

**Output:**
```json
{
  "success": true,
  "block_name": "designsetgo/accordion",
  "total_found": 8,
  "posts": [
    {
      "post_id": 123,
      "post_title": "FAQ Page",
      "post_type": "page",
      "edit_url": "http://yoursite.com/wp-admin/post.php?post=123&action=edit",
      "block_count": 3
    }
  ]
}
```

**REST API Example:** (readonly — uses GET)
```bash
curl -X GET "http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/find-blocks/run?block_name=designsetgo/accordion" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Block Insertion Abilities (34)

#### `designsetgo/insert-flex-container`

Inserts a Flex Container block with customizable layout settings.

**Input:**
```json
{
  "post_id": 123,
  "position": -1,  // -1 = append, 0 = prepend, or specific index
  "attributes": {
    "direction": "row",
    "justifyContent": "center",
    "alignItems": "center",
    "wrap": true,
    "gap": "20px"
  },
  "innerBlocks": [
    {
      "name": "core/button",
      "attributes": {
        "text": "Click Me"
      }
    }
  ]
}
```

**Output:**
```json
{
  "success": true,
  "post_id": 123,
  "block_id": "block-abc123",
  "position": -1
}
```

**REST API Example:**
```bash
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/insert-flex-container/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "post_id": 123,
    "attributes": {
      "direction": "row",
      "justifyContent": "center"
    }
  }'
```

---

#### `designsetgo/insert-grid-container`

Inserts a responsive Grid Container with column configurations for different devices.

**Input:**
```json
{
  "post_id": 123,
  "position": -1,
  "attributes": {
    "desktopColumns": 3,
    "tabletColumns": 2,
    "mobileColumns": 1,
    "gap": "20px"
  },
  "innerBlocks": []
}
```

**Output:**
```json
{
  "success": true,
  "post_id": 123,
  "block_id": "block-def456"
}
```

**REST API Example:**
```bash
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/insert-grid-container/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "post_id": 123,
    "attributes": {
      "desktopColumns": 3,
      "tabletColumns": 2,
      "mobileColumns": 1
    }
  }'
```

---

### 3. Block Configuration Abilities (62)

#### Extension Configurators

These abilities apply cross-cutting extensions (animations, parallax, etc.) to any compatible block.

#### `designsetgo/configure-counter-animation`

Updates animation settings for Counter blocks.

**Input:**
```json
{
  "post_id": 123,
  "block_client_id": "abc-123",  // Optional: specific block to update
  "update_all": false,            // Update all counters in post?
  "settings": {
    "startValue": 0,
    "endValue": 1000,
    "duration": 2,
    "prefix": "$",
    "suffix": "+",
    "decimals": 0,
    "label": "Revenue"
  }
}
```

**Output:**
```json
{
  "success": true,
  "post_id": 123,
  "updated_count": 1,
  "block_name": "designsetgo/counter",
  "new_attributes": { ... }
}
```

**REST API Example:**
```bash
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/configure-counter-animation/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "post_id": 123,
    "settings": {
      "endValue": 500,
      "suffix": "+"
    }
  }'
```

---

#### `designsetgo/apply-animation`

Applies entrance/exit animations to any WordPress block.

**Input:**
```json
{
  "post_id": 123,
  "block_name": "core/heading",
  "block_client_id": null,
  "update_all": false,
  "animation": {
    "enabled": true,
    "entranceAnimation": "fadeInUp",
    "exitAnimation": "",
    "trigger": "scroll",
    "duration": 600,
    "delay": 0,
    "easing": "ease-out",
    "offset": 100,
    "once": true
  }
}
```

**Output:**
```json
{
  "success": true,
  "post_id": 123,
  "updated_count": 1,
  "block_name": "core/heading",
  "new_attributes": { ... }
}
```

**REST API Example:**
```bash
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/apply-animation/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "post_id": 123,
    "block_name": "core/paragraph",
    "animation": {
      "entranceAnimation": "fadeIn",
      "trigger": "scroll"
    }
  }'
```

---

#### `designsetgo/apply-scroll-parallax` (v1.3.0)

Applies Elementor-style scroll parallax effects to container and visual blocks.

**Input:**
```json
{
  "post_id": 123,
  "block_name": "core/group",
  "parallax": {
    "enabled": true,
    "direction": "up",
    "speed": 5,
    "viewportStart": 0,
    "viewportEnd": 100,
    "relativeTo": "viewport",
    "enableDesktop": true,
    "enableTablet": true,
    "enableMobile": false
  }
}
```

---

#### `designsetgo/apply-text-reveal` (v1.3.0)

Applies scroll-triggered text color reveal effect to paragraphs and headings.

**Input:**
```json
{
  "post_id": 123,
  "block_name": "core/heading",
  "textReveal": {
    "enabled": true,
    "revealColor": "#2563eb",
    "splitMode": "word",
    "transitionDuration": 150
  }
}
```

---

#### `designsetgo/apply-expanding-background` (v1.3.0)

Applies scroll-driven expanding background effect to Group and Section blocks.

**Input:**
```json
{
  "post_id": 123,
  "block_name": "core/group",
  "expandingBackground": {
    "enabled": true,
    "color": "#e8e8e8",
    "initialSize": 50,
    "blur": 30,
    "speed": 1,
    "triggerOffset": 0,
    "completionPoint": 80
  }
}
```

---

#### Block-Specific Configurators (38)

All per-block configurators share a common interface. They target blocks by `post_id` + either `block_index` (from `get-post-blocks`) or `block_client_id`, then merge the provided `attributes` into the block. The available attributes are auto-generated from each block's `block.json` schema.

**Common Input Pattern:**
```json
{
  "post_id": 123,
  "block_index": 2,          // Document-order index (preferred)
  "block_client_id": "abc",  // Alternative: target by client ID
  "attributes": {
    "attributeName": "value"  // Block-specific attributes
  }
}
```

| Ability | Target Block |
|---------|-------------|
| `configure-section` | Section (includes layout, shape dividers, hover effects, overlay) |
| `configure-row` | Row (flex layout) |
| `configure-grid` | Grid (responsive columns) |
| `configure-accordion` | Accordion container |
| `configure-accordion-item` | Accordion item |
| `configure-tabs` | Tabs container |
| `configure-tab` | Individual tab |
| `configure-slider` | Slider/carousel |
| `configure-slide` | Individual slide |
| `configure-flip-card` | Flip card container |
| `configure-flip-card-front` | Flip card front face |
| `configure-flip-card-back` | Flip card back face |
| `configure-reveal` | Reveal container |
| `configure-scroll-accordion` | Scroll accordion |
| `configure-scroll-accordion-item` | Scroll accordion item |
| `configure-scroll-marquee` | Scroll marquee |
| `configure-image-accordion` | Image accordion |
| `configure-image-accordion-item` | Image accordion item |
| `configure-modal` | Modal dialog |
| `configure-modal-trigger` | Modal trigger button |
| `configure-card` | Card |
| `configure-icon` | Icon |
| `configure-icon-button` | Icon button |
| `configure-icon-list` | Icon list container |
| `configure-icon-list-item` | Icon list item |
| `configure-pill` | Pill/badge |
| `configure-divider` | Divider |
| `configure-progress-bar` | Progress bar |
| `configure-breadcrumbs` | Breadcrumbs |
| `configure-table-of-contents` | Table of contents |
| `configure-countdown-timer` | Countdown timer |
| `configure-counter` | Counter |
| `configure-counter-group` | Counter group |
| `configure-blobs` | Blobs |
| `configure-map` | Map |
| `configure-form-builder` | Form builder |

---

#### Form Field Configurators (12)

Each form field type has a dedicated configurator that follows the same common interface. Attributes are auto-generated from the field block's `block.json`.

| Ability | Target Block |
|---------|-------------|
| `configure-form-text-field` | Text input |
| `configure-form-email-field` | Email input |
| `configure-form-textarea` | Textarea |
| `configure-form-checkbox-field` | Checkbox |
| `configure-form-select-field` | Dropdown select |
| `configure-form-date-field` | Date picker |
| `configure-form-time-field` | Time picker |
| `configure-form-number-field` | Number input |
| `configure-form-phone-field` | Phone input |
| `configure-form-url-field` | URL input |
| `configure-form-hidden-field` | Hidden field |

---

#### Utility Configurators

##### `designsetgo/configure-block-attributes`

Generic ability to update **any** block's attributes by document-order index, block name, or client ID. Use this when no block-specific configurator exists or when working with core WordPress blocks.

**Input:**
```json
{
  "post_id": 123,
  "block_index": 0,                        // Target by index (from get-post-blocks)
  "block_name": "designsetgo/section",     // Optional safety check
  "attributes": {
    "style": {
      "spacing": { "padding": { "top": "40px", "bottom": "40px" } },
      "color": { "background": "#f5f5f5" }
    }
  }
}
```

---

##### `designsetgo/configure-shape-divider`

Adds or updates shape dividers on a section block. Provides a user-friendly interface mapping to the section's 16 shape divider attributes.

**Input:**
```json
{
  "post_id": 123,
  "block_index": 0,
  "position": "bottom",  // "top", "bottom", or "both"
  "shape": "wave",        // 23 options: wave, wave-double, tilt, curve, triangle, arrow, peaks, zigzag, clouds, etc.
  "color": "#ffffff",
  "height": 80,           // 0-300 pixels
  "width": 100,           // 50-200 percent
  "flipX": false,
  "flipY": false,
  "inFront": false
}
```

---

#### Operations

##### `designsetgo/batch-update`

Applies attribute changes to multiple blocks at once. Supports updating by block name across an entire post, with optional attribute filters.

**Input:**
```json
{
  "post_id": 123,
  "operations": [
    {
      "block_name": "core/heading",
      "attributes": { "style": { "color": { "text": "#333333" } } }
    },
    {
      "block_name": "designsetgo/icon-button",
      "attributes": { "size": "large" },
      "filter": { "style": "primary" }  // Only update buttons matching this filter
    }
  ]
}
```

**Output:**
```json
{
  "success": true,
  "post_id": 123,
  "total_updated": 5,
  "operation_results": [
    { "block_name": "core/heading", "updated_count": 3, "success": true },
    { "block_name": "designsetgo/icon-button", "updated_count": 2, "success": true }
  ]
}
```

---

##### `designsetgo/delete-block`

Removes blocks from a post by block name, client ID, or position. **Destructive** — uses DELETE HTTP method.

**Input:**
```json
{
  "post_id": 123,
  "block_name": "designsetgo/divider",  // Delete by block type
  "delete_all": false,                   // Delete all matches? (default: first only)
  "position": 2                          // Or delete at specific position
}
```

**Output:**
```json
{
  "success": true,
  "post_id": 123,
  "deleted_count": 1,
  "block_name": "designsetgo/divider"
}
```

**REST API Example:** (destructive — uses DELETE)
```bash
curl -X DELETE http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/delete-block/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"post_id": 123, "block_name": "designsetgo/divider"}'
```

---

### 4. Generator Abilities (10)

#### `designsetgo/generate-contact-section`

Generates a complete contact section with form, optional map, and contact info.

**Input:**
```json
{
  "post_id": 123,
  "heading": "Get In Touch",
  "description": "Have a question? Fill out the form below.",
  "layout": "form-left",
  "formFields": ["name", "email", "phone", "message"],
  "submitText": "Send Message",
  "includeMap": true,
  "mapLocation": {
    "lat": 40.7128,
    "lng": -74.006,
    "zoom": 14,
    "address": "New York, NY"
  },
  "contactInfo": {
    "email": "hello@example.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Main St, New York, NY",
    "hours": "Mon-Fri 9am-5pm"
  }
}
```

**Layout Options:** `form-only`, `form-left`, `form-right`, `form-top`

---

### 5. Additional Inserter Abilities

#### `designsetgo/insert-block-into` (v2.1.0)

Inserts a block as a **child of an existing block** (nested insertion). Use `get-post-blocks` to find the parent's `blockIndex` first.

**Input:**
```json
{
  "post_id": 123,
  "parent_block_index": 0,          // Document-order index of parent block
  "block_name": "core/paragraph",   // Any block type (core or custom)
  "attributes": {
    "content": "Hello world"
  },
  "inner_blocks": [],                // Optional nested blocks
  "position": -1                     // -1 = append (default), 0 = prepend
}
```

---

#### `designsetgo/insert-accordion-item` (v2.1.0)

Inserts an accordion item into an existing accordion container.

**Input:**
```json
{
  "post_id": 123,
  "title": "How do I get started?",
  "content": "Simply install the plugin and...",
  "accordion_client_id": "abc-123",  // Optional: target specific accordion
  "is_open": false
}
```

---

#### `designsetgo/insert-tab` (v2.1.0)

Inserts a tab into an existing tabs container.

**Input:**
```json
{
  "post_id": 123,
  "title": "Features",
  "content": "Our product includes...",
  "tabs_client_id": "abc-123"  // Optional: target specific tabs block
}
```

---

#### `designsetgo/insert-timeline-item` (v2.1.0)

Inserts a timeline item into an existing timeline container.

**Input:**
```json
{
  "post_id": 123,
  "title": "Company Founded",
  "date": "2020",
  "content": "We started with a simple idea...",
  "timeline_client_id": "abc-123",
  "is_active": true
}
```

---

#### `designsetgo/insert-slider`

Inserts a Slider block for hero carousels and galleries.

**Input:**
```json
{
  "post_id": 123,
  "attributes": {
    "slidesPerView": 1,
    "height": "500px",
    "effect": "slide",
    "autoplay": true,
    "autoplayInterval": 3000,
    "showArrows": true,
    "showDots": true,
    "loop": true
  }
}
```

---

#### `designsetgo/insert-card`

Inserts a Card block for pricing, features, team members, etc.

**Input:**
```json
{
  "post_id": 123,
  "attributes": {
    "layoutPreset": "standard",
    "title": "Card Title",
    "subtitle": "Card Subtitle",
    "bodyText": "Description text",
    "badgeText": "New",
    "imageUrl": "https://example.com/image.jpg",
    "visualStyle": "shadow",
    "contentAlignment": "center"
  }
}
```

**Layout Presets:** `standard`, `horizontal-left`, `horizontal-right`, `background`, `minimal`, `featured`

---

### 6. Complete Abilities Reference

#### Info Abilities (4)

| Ability | Description | Annotation |
|---------|-------------|------------|
| `list-abilities` | Discover all registered abilities with schemas | readonly |
| `list-blocks` | List all available DesignSetGo blocks | readonly |
| `get-post-blocks` | Retrieve blocks from a post with blockIndex values | readonly |
| `find-blocks` | Search for blocks across posts by type | readonly |

#### Inserter Abilities (34)

| Ability | Description |
|---------|-------------|
| `insert-block-into` | Insert any block as a child of an existing block |
| `insert-flex-container` | Horizontal/vertical flexbox layout |
| `insert-grid-container` | Responsive CSS grid layout |
| `insert-stack-container` | Vertical stack layout |
| `insert-section` | Full-width page section |
| `insert-divider` | Visual separator/divider |
| `insert-breadcrumbs` | Navigation breadcrumbs |
| `insert-table-of-contents` | Auto-generated ToC from headings |
| `insert-icon` | Lucide icon display |
| `insert-icon-button` | Icon with button styling |
| `insert-icon-list` | List with icons |
| `insert-icon-list-item` | Single icon list item |
| `insert-pill` | Badge/tag element |
| `insert-counter` | Animated number counter |
| `insert-counter-group` | Multiple counters in layout |
| `insert-countdown-timer` | Countdown to target date |
| `insert-progress-bar` | Animated progress indicator |
| `insert-tabs` | Tabbed content container |
| `insert-tab` | Individual tab into existing tabs |
| `insert-accordion` | Expandable content panels |
| `insert-accordion-item` | Individual item into existing accordion |
| `insert-flip-card` | 3D flip card |
| `insert-reveal` | Scroll reveal animation container |
| `insert-scroll-accordion` | Scroll-triggered accordion |
| `insert-scroll-marquee` | Infinite scrolling marquee |
| `insert-slider` | Carousel/slideshow |
| `insert-card` | Styled content card |
| `insert-image-accordion` | Expandable image gallery |
| `insert-timeline` | Chronological event display |
| `insert-timeline-item` | Individual item into existing timeline |
| `insert-map` | Interactive OpenStreetMap |
| `insert-modal` | Modal/popup dialog |
| `insert-modal-trigger` | Modal trigger button |
| `insert-form-builder` | Contact form with fields |

#### Configurator Abilities (62)

**Extension Configurators (7)** — Apply cross-cutting features to any compatible block:

| Ability | Description |
|---------|-------------|
| `apply-animation` | Entrance/exit animations |
| `apply-scroll-parallax` | Vertical scroll parallax effect |
| `apply-text-reveal` | Scroll-triggered text color reveal |
| `apply-expanding-background` | Expanding background effect |
| `configure-background-video` | Background video for containers |
| `configure-clickable-group` | Make containers clickable |
| `configure-custom-css` | Custom CSS per block |

**Utility Configurators (5)** — Generic and specialized configuration tools:

| Ability | Description |
|---------|-------------|
| `configure-block-attributes` | Update any block's attributes (generic) |
| `configure-shape-divider` | Shape dividers on sections (23 shapes) |
| `configure-counter-animation` | Counter animation settings |
| `configure-responsive-visibility` | Show/hide by device |
| `configure-max-width` | Max width constraints |

**Block Configurators (36)** — Per-block attribute configurators (auto-generated from block.json):

`configure-section`, `configure-row`, `configure-grid`, `configure-accordion`, `configure-accordion-item`, `configure-tabs`, `configure-tab`, `configure-slider`, `configure-slide`, `configure-flip-card`, `configure-flip-card-front`, `configure-flip-card-back`, `configure-reveal`, `configure-scroll-accordion`, `configure-scroll-accordion-item`, `configure-scroll-marquee`, `configure-image-accordion`, `configure-image-accordion-item`, `configure-modal`, `configure-modal-trigger`, `configure-card`, `configure-icon`, `configure-icon-button`, `configure-icon-list`, `configure-icon-list-item`, `configure-pill`, `configure-divider`, `configure-progress-bar`, `configure-breadcrumbs`, `configure-table-of-contents`, `configure-countdown-timer`, `configure-counter`, `configure-counter-group`, `configure-blobs`, `configure-map`, `configure-form-builder`

**Form Field Configurators (12)** — Per-field-type configurators:

`configure-form-text-field`, `configure-form-email-field`, `configure-form-textarea`, `configure-form-checkbox-field`, `configure-form-select-field`, `configure-form-date-field`, `configure-form-time-field`, `configure-form-number-field`, `configure-form-phone-field`, `configure-form-url-field`, `configure-form-hidden-field`, `configure-form-field`

**Operations (2)** — Bulk and destructive operations:

| Ability | Description | Annotation |
|---------|-------------|------------|
| `batch-update` | Update multiple blocks in one call | — |
| `delete-block` | Remove blocks from a post | destructive |

#### Generator Abilities (10)

| Ability | Description |
|---------|-------------|
| `generate-hero-section` | Hero with heading, description, CTA |
| `generate-feature-grid` | Feature cards in grid layout |
| `generate-stats-section` | Statistics/counters display |
| `generate-faq-section` | FAQ accordion |
| `generate-contact-section` | Contact form with map/info |
| `generate-pricing-section` | Pricing table with tiers |
| `generate-team-section` | Team member cards |
| `generate-testimonial-section` | Customer testimonials |
| `generate-cta-section` | Call-to-action section |
| `generate-gallery-section` | Image gallery (grid/slider) |

---

## Authentication

All abilities require proper WordPress authentication. You can use:

1. **Application Passwords** (recommended for API access)
2. **Cookie Authentication** (for logged-in users)
3. **OAuth 2.0** (via plugins like WP OAuth Server)

### Creating Application Password

1. Go to **Users → Profile**
2. Scroll to **Application Passwords**
3. Enter name (e.g., "AI Agent")
4. Click **Add New Application Password**
5. Copy the generated password

### Using Application Password

```bash
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/{namespace}/{ability}/run \
  -H "Content-Type: application/json" \
  -u "username:APPLICATION_PASSWORD" \
  -d '{ ... }'
```

---

## AI Agent Integration

### Claude (via MCP)

DesignSetGo abilities are automatically discoverable through the Model Context Protocol:

```javascript
// Claude automatically discovers abilities
const abilities = await mcp.listTools();

// Execute ability
const result = await mcp.callTool("designsetgo/insert-flex-container", {
  post_id: 123,
  attributes: { direction: "row" }
});
```

### Custom Automation

```javascript
const authHeader = 'Basic ' + btoa('username:app_password');

// Discover all abilities (requires authentication)
const response = await fetch('http://yoursite.com/wp-json/wp-abilities/v1/abilities', {
  headers: { 'Authorization': authHeader }
});
const abilities = await response.json();

// Filter DesignSetGo abilities
const designsetgoAbilities = abilities.filter(a => a.name.startsWith('designsetgo/'));

// Execute a readonly ability (GET for readonly, POST for modifications, DELETE for destructive)
const result = await fetch(
  'http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/list-blocks/run?category=all',
  {
    method: 'GET',
    headers: { 'Authorization': authHeader }
  }
);

// Execute a modification ability (POST)
const insertResult = await fetch(
  'http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/insert-flex-container/run',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({ post_id: 123, attributes: { direction: 'row' } })
  }
);
```

---

## Use Cases

### 1. AI-Assisted Page Building

**User:** "Create a landing page with a hero section, 3 feature columns, and a CTA"

**AI Agent Actions:**
1. Create new post
2. `designsetgo/insert-flex-container` → Hero with heading/button
3. `designsetgo/insert-grid-container` → 3-column grid
4. `designsetgo/insert-flex-container` → CTA section

---

### 2. Bulk Content Generation

**User:** "Add fade-in animations to all headings"

**AI Agent Actions:**
1. `core/list-blocks` → Get all heading blocks
2. Loop through each heading:
   - `designsetgo/apply-animation` with fadeIn

---

### 3. Template Generation

**User:** "Create an FAQ section with 5 questions"

**AI Agent Actions:**
1. Generate Q&A content with AI
2. Create accordion structure programmatically
3. Apply styling and animations

---

## Error Handling

All abilities return standardized error responses:

```json
{
  "code": "invalid_post",
  "message": "Post not found.",
  "data": {
    "status": 404
  }
}
```

### Common Error Codes

- `invalid_post` - Post ID not found
- `permission_denied` - User lacks required capability
- `missing_post_id` - Required post_id parameter missing
- `missing_settings` - Required settings parameter missing
- `invalid_attributes` - Attributes failed JSON Schema validation
- `block_not_found` - No matching blocks found to update

---

## Permissions

Each ability has specific permission requirements:

| Category | Required Capability |
|---------|-------------------|
| `list-abilities` | `read` |
| `list-blocks` | `read` |
| All other info abilities | `edit_posts` |
| All inserter abilities | `edit_posts` |
| All configurator abilities | `edit_posts` |
| All generator abilities | `edit_posts` |

---

## Roadmap

### Completed in v2.0.0

- [x] Additional inserter abilities (Section, Map, Countdown Timer, Form Builder, etc.)
- [x] Layout generator abilities (hero, features, stats, FAQ, contact, pricing, team, testimonials, CTA, gallery)
- [x] Extension configurators (background video, clickable groups, custom CSS, responsive visibility)
- [x] WordPress 6.9 native Abilities API support

### Completed in v2.1.0

- [x] Batch operation abilities (`batch-update`)
- [x] Block query abilities (`get-post-blocks`, `find-blocks`)
- [x] Block deletion ability (`delete-block`)
- [x] Child block inserters (`insert-accordion-item`, `insert-tab`, `insert-timeline-item`)
- [x] Nested insertion (`insert-block-into`)
- [x] Generic block configurator (`configure-block-attributes`)
- [x] Shape divider configurator (`configure-shape-divider`)
- [x] Per-block configurators for all 36 block types (auto-generated from block.json)
- [x] Form field configurators for all 12 field types
- [x] Abilities manifest (`list-abilities`)
- [x] Auto-discovery of ability classes (no manual registration needed)
- [x] Enhanced CSS sanitization for security
- [x] Standardized error responses with HTTP status codes
- [x] **Total: 110 abilities** (up from 50 in v2.0.0)

### Phase 3 (Future)

- [ ] Pattern template generation
- [ ] Full-page layout generation from descriptions
- [ ] Advanced animation sequencing
- [ ] Theme style application

---

## Development

### Creating Custom Abilities

DesignSetGo's abilities architecture is extensible. Abilities are **auto-discovered** from the following directories:

- `includes/abilities/info/` - Information/query abilities
- `includes/abilities/inserters/` - Block insertion abilities
- `includes/abilities/configurators/` - Block configuration abilities
- `includes/abilities/generators/` - Section generation abilities

Simply create a new class file following the naming convention `class-{ability-name}.php` and it will be automatically loaded and registered.

```php
<?php
// File: includes/abilities/inserters/class-insert-my-block.php
namespace DesignSetGo\Abilities\Inserters;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Inserter;

class Insert_My_Block extends Abstract_Ability {
    public function get_name(): string {
        return 'designsetgo/insert-my-block';
    }

    public function get_config(): array {
        return array(
            'label'               => __('Insert My Block', 'designsetgo'),
            'description'         => __('Inserts a custom block', 'designsetgo'),
            'thinking_message'    => __('Creating block...', 'designsetgo'),
            'success_message'     => __('Block created successfully.', 'designsetgo'),
            'category'            => 'blocks',
            'input_schema'        => $this->get_input_schema(),
            'output_schema'       => Block_Inserter::get_default_output_schema(),
            'permission_callback' => array($this, 'check_permission_callback'),
        );
    }

    public function check_permission_callback(): bool {
        return $this->check_permission('edit_posts');
    }

    public function execute(array $input) {
        // Validate input
        $validation = $this->validate_input($input);
        if (is_wp_error($validation)) {
            return $validation;
        }

        // Your logic here
        return Block_Inserter::insert_block(
            $input['post_id'],
            'namespace/my-block',
            $input['attributes'] ?? array(),
            $input['innerBlocks'] ?? array(),
            $input['position'] ?? -1
        );
    }
}
```

### Filter Hook: `designsetgo_abilities`

Use this filter to modify, add, or remove abilities programmatically:

```php
/**
 * Filter registered abilities.
 *
 * @param array<Abstract_Ability> $abilities Registered ability instances.
 * @return array<Abstract_Ability> Modified abilities.
 */
add_filter('designsetgo_abilities', function($abilities) {
    // Remove an ability
    unset($abilities['designsetgo/some-ability']);

    // Add a custom ability
    $abilities['myplugin/custom-ability'] = new My_Custom_Ability();

    // Modify an ability (wrap with logging, etc.)
    // $abilities['designsetgo/insert-section'] = new Wrapped_Insert_Section();

    return $abilities;
});
```

### Helper Classes

DesignSetGo provides helper classes for common operations:

| Class | Purpose |
|-------|---------|
| `Block_Inserter` | Insert blocks into posts with validation and sanitization |
| `Block_Configurator` | Update block attributes, walk block trees |
| `CSS_Sanitizer` | Sanitize CSS to prevent XSS attacks |

### Base Class Methods

The `Abstract_Ability` class provides these protected methods:

| Method | Description |
|--------|-------------|
| `check_permission($cap)` | Check if user has capability |
| `permission_error($msg)` | Return standardized permission error |
| `error($code, $msg, $data)` | Return error with auto HTTP status |
| `success($data)` | Return success response |
| `validate_input($input)` | Validate against input schema |
| `validate_post($id)` | Validate post exists |
| `sanitize_attributes($attrs)` | Sanitize block attributes |

---

## WordPress Abilities API Reference

This section documents the core WordPress Abilities API functions and hooks (WP 6.9+). For the full official reference, see the [WordPress Abilities API Handbook](https://developer.wordpress.org/apis/abilities-api/).

### Compatibility Check

Before using the API, verify it's available:

```php
if ( ! class_exists( 'WP_Ability' ) ) {
    // Abilities API not available — add admin notice or skip registration.
    return;
}
```

### Registration Functions

#### `wp_register_ability_category( $slug, $args )`

Registers an organizational grouping for abilities. Must be called during `wp_abilities_api_categories_init`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `$slug` | `string` | Category slug (lowercase alphanumeric + hyphens only) |
| `$args['label']` | `string` | Human-readable category name |
| `$args['description']` | `string` | Category description |

Returns `?\WP_Ability_Category`.

#### `wp_register_ability( $name, $args )`

Registers an ability. Must be called during `wp_abilities_api_init`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `$name` | `string` | Yes | Namespaced name (`namespace/ability-name`) |
| `$args['label']` | `string` | Yes | Human-readable name |
| `$args['description']` | `string` | Yes | What the ability does |
| `$args['category']` | `string` | Yes | Category slug (must be registered first) |
| `$args['output_schema']` | `array` | Yes | JSON Schema for returned output |
| `$args['execute_callback']` | `callable` | Yes | Function that executes the ability |
| `$args['permission_callback']` | `callable` | Yes | Returns `true`/`WP_Error` for access control |
| `$args['input_schema']` | `array` | No | JSON Schema for expected input |
| `$args['show_in_rest']` | `bool` | No | Set `true` to expose via REST API (default: `false`) |
| `$args['annotations']` | `array` | No | Behavioral metadata (see below) |
| `$args['meta']` | `array` | No | Additional custom metadata |
| `$args['ability_class']` | `string` | No | Custom WP_Ability subclass |

### Annotations

Annotations provide behavioral metadata that helps clients (and AI agents) understand how an ability works. They also determine the HTTP method used for the REST `/run` endpoint.

```php
wp_register_ability( 'myplugin/get-data', array(
    // ... other args ...
    'annotations' => array(
        'readonly'     => true,   // Only reads data (REST uses GET)
        'destructive'  => false,  // Does not delete data (REST uses DELETE when true)
        'idempotent'   => true,   // Repeated calls produce same result
        'instructions' => 'Returns site analytics for the given date range.',
    ),
) );
```

| Annotation | Type | Description | REST Method |
|------------|------|-------------|-------------|
| `readonly` | `bool` | Ability only reads data | `GET` |
| `destructive` | `bool` | Ability performs deletions | `DELETE` |
| `idempotent` | `bool` | Repeated calls have no additional effect | — |
| `instructions` | `string` | Custom usage guidance for AI agents | — |

When neither `readonly` nor `destructive` is set, the REST endpoint defaults to `POST`.

### Retrieval Functions

```php
// Check if an ability is registered
$exists = wp_ability_is_registered( 'designsetgo/insert-flex-container' );

// Get a specific ability instance
$ability = wp_get_ability( 'designsetgo/insert-flex-container' );

// Get all registered abilities
$all_abilities = wp_get_abilities();

// Get a specific category
$category = wp_get_ability_category( 'designsetgo-blocks' );

// Get all registered categories
$all_categories = wp_get_ability_categories();
```

### Execution

```php
$ability = wp_get_ability( 'designsetgo/list-blocks' );

if ( $ability && ! is_wp_error( $ability ) ) {
    // Check permissions first
    $allowed = $ability->check_permissions( $input );
    if ( true === $allowed ) {
        $result = $ability->execute( array( 'category' => 'layout' ) );
        if ( is_wp_error( $result ) ) {
            // Handle error
        }
    }
}
```

### Hooks

#### Actions

| Hook | When | Parameters |
|------|------|------------|
| `wp_abilities_api_categories_init` | Category registry initializes | `$registry` (`WP_Ability_Categories_Registry`) |
| `wp_abilities_api_init` | Abilities registry initializes | `$registry` (`WP_Abilities_Registry`) |
| `wp_before_execute_ability` | Before ability runs (after permissions pass) | `$ability_name` (string), `$input` (mixed) |
| `wp_after_execute_ability` | After successful execution + output validation | `$ability_name` (string), `$input` (mixed), `$result` (mixed) |

**Logging example:**

```php
add_action( 'wp_before_execute_ability', function( $ability_name, $input ) {
    error_log( sprintf( 'Executing ability: %s', $ability_name ) );
}, 10, 2 );

add_action( 'wp_after_execute_ability', function( $ability_name, $input, $result ) {
    error_log( sprintf( 'Completed ability: %s', $ability_name ) );
}, 10, 3 );
```

#### Filters

| Filter | Purpose | Parameters |
|--------|---------|------------|
| `wp_register_ability_args` | Modify ability args before validation | `$args` (array), `$ability_name` (string) |
| `wp_register_ability_category_args` | Modify category args before validation | `$args` (array), `$slug` (string) |

**Example — override a permission callback:**

```php
add_filter( 'wp_register_ability_args', function( $args, $ability_name ) {
    if ( 'designsetgo/list-blocks' === $ability_name ) {
        $args['permission_callback'] = function() {
            return current_user_can( 'edit_posts' );
        };
    }
    return $args;
}, 10, 2 );
```

### REST API Endpoints

All endpoints live under `/wp-json/wp-abilities/v1`. Authentication is required for all requests.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/wp-abilities/v1/abilities` | `GET` | List all abilities (supports `page`, `per_page`, `category` params) |
| `/wp-abilities/v1/{namespace}/{ability}` | `GET` | Retrieve a single ability definition |
| `/wp-abilities/v1/categories` | `GET` | List all categories |
| `/wp-abilities/v1/{namespace}/{ability}/run` | `GET\|POST\|DELETE` | Execute an ability |

**HTTP method for `/run`** is determined by ability annotations:
- `GET` — when `annotations.readonly` is `true`
- `DELETE` — when `annotations.destructive` is `true`
- `POST` — default for all other abilities

**Error codes:**

| Code | Description |
|------|-------------|
| `rest_ability_not_found` | Ability not found or `show_in_rest` is `false` |
| `ability_missing_input_schema` | Ability requires input but none provided |
| `ability_invalid_input` | Input failed JSON Schema validation |
| `ability_invalid_permissions` | User lacks required permissions |
| `ability_invalid_output` | Output failed schema validation (server error) |

---

## Support

- **Documentation:** [https://github.com/yourrepo/designsetgo/docs](docs/)
- **Issues:** [https://github.com/yourrepo/designsetgo/issues](issues)
- **WordPress Abilities API Handbook:** [https://developer.wordpress.org/apis/abilities-api/](https://developer.wordpress.org/apis/abilities-api/)

---

## Requirements

- **WordPress 6.9+** (recommended) - Abilities API is included natively in WordPress 6.9
- **WordPress 6.0-6.8** - Requires the [wordpress/abilities-api](https://github.com/WordPress/abilities-api) Composer package (optional polyfill)

DesignSetGo automatically detects whether the native Abilities API is available and gracefully degrades on older WordPress versions.

---

## Credits

DesignSetGo's Abilities API integration is built on:

- [WordPress Abilities API](https://make.wordpress.org/core/2025/11/10/abilities-api-in-wordpress-6-9/) (native in WP 6.9+)
- [Model Context Protocol](https://github.com/WordPress/mcp-adapter)

**Making WordPress AI-Native Since 2025** 🤖
