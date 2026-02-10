# DesignSetGo Abilities API Guide

## Overview

The DesignSetGo Abilities API provides AI-native endpoints for programmatically creating and modifying WordPress content using DesignSetGo blocks.

## Important Note: Block Validation

**Blocks inserted via REST API will show "unexpected or invalid content" warnings in the WordPress editor until the post is saved.**

### Why This Happens

This is a WordPress architectural limitation:

1. **Block save functions are in JavaScript** (client-side)
2. **REST API inserts happen in PHP** (server-side)
3. **Server cannot execute client-side save functions**
4. **WordPress expects saved HTML** to match current save function output

When blocks are inserted via REST API, they contain only attributes (data), not the rendered HTML that WordPress expects. This causes validation warnings.

### How to Resolve

**Option 1: Save in Editor (Recommended for Production)**
1. Insert blocks via REST API
2. Open the post in WordPress editor
3. WordPress will show "Attempt recovery" buttons
4. Click "Attempt recovery" on each block (or save the post)
5. WordPress calls the save functions and generates proper HTML
6. Validation warnings disappear

**Option 2: Publish Without Editor (For AI/Automation)**
- Blocks WILL render correctly on the frontend despite validation warnings
- The warnings only appear in the editor
- Content displays properly to site visitors
- Suitable for fully automated workflows where human review isn't required

### Verification

```bash
# After inserting blocks via API, the frontend will render correctly:
curl http://localhost:8888/?p=POST_ID

# Editor will show validation warnings until saved:
# Open: http://localhost:8888/wp-admin/post.php?post=POST_ID&action=edit
```

## Available Abilities (110 Total)

DesignSetGo provides **110 abilities** across 4 categories:

| Category | Count | Description |
|----------|-------|-------------|
| **Info** | 4 | Discover abilities, list blocks, find/get blocks in posts |
| **Inserters** | 34 | Insert any DesignSetGo block programmatically |
| **Configurators** | 62 | Configure blocks, apply extensions, manage form fields |
| **Generators** | 10 | Generate complete page sections in one call |

### Info Abilities

#### list-abilities
Returns a manifest of all registered abilities with names, descriptions, categories, and input schemas. **Call this first** to discover what's available.

**Endpoint**: `GET /wp-abilities/v1/abilities/designsetgo/list-abilities/run`

**Input**:
```json
{
  "input": {
    "category": "all"
  }
}
```

**Output**: Array of ability objects with name, label, description, category, input_schema.

**Filter by category**:
```json
{
  "input": {
    "category": "inserter"
  }
}
```

#### list-blocks
Lists all available DesignSetGo blocks with their metadata.

**Endpoint**: `GET /wp-abilities/v1/abilities/designsetgo/list-blocks/run`

**Input**:
```json
{
  "input": {
    "category": "all"
  }
}
```

**Output**: Array of block objects with name, category, description, etc.

#### get-post-blocks
Retrieves all blocks from a post with document-order `blockIndex` values. Essential for targeting blocks with configurators and operations.

**Endpoint**: `GET /wp-abilities/v1/abilities/designsetgo/get-post-blocks/run`

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_name": "designsetgo/section",
    "include_inner": true,
    "flatten": false
  }
}
```

Only `post_id` is required. Use `block_name` to filter, `include_inner` to include nested blocks, `flatten` to get a flat list.

**Output**: Array of block objects with `blockIndex`, `blockName`, `attrs`, `innerBlocks`.

#### find-blocks
Searches for blocks across multiple posts. Useful for finding all posts that use a specific block type.

**Endpoint**: `GET /wp-abilities/v1/abilities/designsetgo/find-blocks/run`

**Input**:
```json
{
  "input": {
    "block_name": "designsetgo/accordion",
    "post_type": "post",
    "post_status": "publish",
    "limit": 10
  }
}
```

Only `block_name` is required. Returns posts containing the specified block with occurrence counts.

### Inserter Abilities

#### insert-flex-container
Inserts a Flexbox container block.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "position": -1,
    "attributes": {
      "direction": "row",
      "justifyContent": "center",
      "alignItems": "center"
    },
    "innerBlocks": []
  }
}
```

#### insert-grid-container
Inserts a CSS Grid container block.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "attributes": {
      "desktopColumns": 3,
      "tabletColumns": 2,
      "mobileColumns": 1
    },
    "innerBlocks": []
  }
}
```

#### insert-stack-container
Inserts a vertical Stack container block.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "attributes": {
      "alignItems": "center",
      "constrainWidth": true
    },
    "innerBlocks": []
  }
}
```

#### insert-icon
Inserts an SVG icon block.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "attributes": {
      "icon": "star",
      "iconSize": 64,
      "iconStyle": "filled"
    }
  }
}
```

#### insert-icon-button
Inserts a button with an icon.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "attributes": {
      "text": "Get Started",
      "url": "/start",
      "icon": "arrow-right",
      "iconPosition": "end"
    }
  }
}
```

#### insert-progress-bar
Inserts an animated progress bar.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "attributes": {
      "percentage": 75,
      "labelText": "Progress",
      "showLabel": true,
      "showPercentage": true
    }
  }
}
```

#### insert-counter-group
Inserts a container for animated stat counters.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "attributes": {
      "columns": 4,
      "columnsTablet": 2,
      "columnsMobile": 1
    },
    "innerBlocks": []
  }
}
```

#### insert-tabs
Inserts a tabbed interface block.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "attributes": {
      "orientation": "horizontal",
      "tabStyle": "pills"
    },
    "innerBlocks": []
  }
}
```

#### insert-accordion
Inserts a collapsible accordion block.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "attributes": {
      "allowMultipleOpen": false,
      "initiallyOpen": "first",
      "iconStyle": "chevron"
    },
    "innerBlocks": []
  }
}
```

#### insert-block-into (Nested Insertion)
Inserts a block as a child of an existing block. Use `get-post-blocks` first to find the parent's `blockIndex`.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "parent_block_index": 2,
    "block_name": "core/paragraph",
    "attributes": {
      "content": "Added inside the section"
    },
    "position": -1
  }
}
```

`parent_block_index` is the document-order index from `get-post-blocks`. `position` controls where within the parent: -1 appends, 0 prepends, N inserts at index.

#### insert-accordion-item
Adds a new item to an existing accordion block.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_index": 5,
    "title": "New Question",
    "content": "Answer content here"
  }
}
```

#### insert-tab
Adds a new tab to an existing tabs block.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_index": 3,
    "title": "New Tab",
    "content": "Tab content here"
  }
}
```

#### insert-timeline-item
Adds a new item to an existing timeline block.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_index": 7,
    "title": "2024",
    "content": "Major milestone achieved"
  }
}
```

#### All Inserter Abilities (34)

| Ability | Block |
|---------|-------|
| `insert-section` | Section container |
| `insert-row` | Row container |
| `insert-flex-container` | Flexbox container |
| `insert-grid-container` | CSS Grid container |
| `insert-stack-container` | Stack (vertical) container |
| `insert-accordion` | Accordion |
| `insert-accordion-item` | Accordion item (nested) |
| `insert-tabs` | Tabs |
| `insert-tab` | Tab item (nested) |
| `insert-timeline` | Timeline |
| `insert-timeline-item` | Timeline item (nested) |
| `insert-flip-card` | Flip card |
| `insert-reveal` | Reveal/spoiler |
| `insert-scroll-accordion` | Scroll-triggered accordion |
| `insert-modal` | Modal/popup |
| `insert-slider` | Image/content slider |
| `insert-icon` | SVG icon |
| `insert-icon-button` | Button with icon |
| `insert-icon-list` | List with icons |
| `insert-pill` | Pill/badge |
| `insert-card` | Card |
| `insert-divider` | Divider |
| `insert-counter` | Single counter |
| `insert-counter-group` | Counter group container |
| `insert-countdown-timer` | Countdown timer |
| `insert-progress-bar` | Progress bar |
| `insert-map` | Map embed |
| `insert-breadcrumbs` | Breadcrumbs |
| `insert-table-of-contents` | Table of contents |
| `insert-form-builder` | Form builder |
| `insert-marquee` | Marquee/ticker |
| `insert-lottie` | Lottie animation |
| `insert-alert` | Alert/notice |
| `insert-block-into` | Nested insertion |

### Generator Abilities

Generators create complete, pre-composed sections in a single API call.

#### generate-hero-section
Generates a complete hero section with heading, description, and CTA buttons.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "heading": "Welcome to DesignSetGo",
    "description": "Build stunning websites",
    "primaryButton": {
      "text": "Get Started",
      "url": "/start",
      "icon": "arrow-right"
    },
    "secondaryButton": {
      "text": "Learn More",
      "url": "/learn"
    }
  }
}
```

#### generate-feature-grid
Generates a responsive grid of features with icons.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "columns": 3,
    "features": [
      {
        "icon": "lightning-bolt",
        "title": "Fast",
        "description": "Lightning-fast performance"
      },
      {
        "icon": "shield",
        "title": "Secure",
        "description": "Enterprise security"
      }
    ]
  }
}
```

#### generate-stats-section
Generates animated statistics section with counters.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "columns": 4,
    "stats": [
      {
        "value": 10000,
        "suffix": "+",
        "label": "Users",
        "decimals": 0
      },
      {
        "value": 99.9,
        "decimals": 1,
        "suffix": "%",
        "label": "Uptime"
      }
    ]
  }
}
```

#### generate-faq-section
Generates FAQ section with accordion.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "title": "Frequently Asked Questions",
    "faqs": [
      {
        "question": "What is DesignSetGo?",
        "answer": "A powerful AI-native WordPress block library"
      },
      {
        "question": "Is it free?",
        "answer": "Yes, completely free and open source"
      }
    ]
  }
}
```

### Configurator Abilities (62)

Configurators modify existing blocks. They are organized into subcategories:

#### Extension Configurators (7)

These apply DesignSetGo extensions (animations, scroll effects, etc.) to blocks.

##### apply-animation
Applies entrance animations to blocks in bulk.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_name": "core/heading",
    "animation": {
      "enabled": true,
      "entranceAnimation": "fadeInUp",
      "trigger": "scroll",
      "duration": 600
    }
  }
}
```

##### apply-scroll-parallax
Applies scroll-based parallax effects.

##### apply-text-reveal
Applies text reveal animations.

##### apply-expanding-background
Applies expanding background effect on scroll.

##### configure-background-video
Configures background video on supported blocks.

##### configure-clickable-group
Makes a block group clickable as a single link.

##### configure-custom-css
Applies custom CSS to specific blocks.

#### Block-Specific Configurators (38)

Each DesignSetGo block has a dedicated configurator that accepts all of its block.json attributes. They share a common interface:

**Common Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_index": 2,
    "block_client_id": "abc-123",
    "attributes": {
      "attribute_name": "value"
    }
  }
}
```

Target a block by either `block_index` (document-order from `get-post-blocks`) or `block_client_id`. The `attributes` object accepts any valid attribute from the block's schema.

| Ability | Block |
|---------|-------|
| `configure-section` | Section |
| `configure-row` | Row |
| `configure-grid` | CSS Grid |
| `configure-flex-container` | Flexbox |
| `configure-stack-container` | Stack |
| `configure-accordion` | Accordion |
| `configure-accordion-item` | Accordion Item |
| `configure-tabs` | Tabs |
| `configure-tab` | Tab |
| `configure-timeline` | Timeline |
| `configure-timeline-item` | Timeline Item |
| `configure-flip-card` | Flip Card |
| `configure-reveal` | Reveal |
| `configure-scroll-accordion` | Scroll Accordion |
| `configure-modal` | Modal |
| `configure-slider` | Slider |
| `configure-icon` | Icon |
| `configure-icon-button` | Icon Button |
| `configure-icon-list` | Icon List |
| `configure-pill` | Pill |
| `configure-card` | Card |
| `configure-divider` | Divider |
| `configure-counter` | Counter |
| `configure-counter-group` | Counter Group |
| `configure-countdown-timer` | Countdown Timer |
| `configure-progress-bar` | Progress Bar |
| `configure-map` | Map |
| `configure-breadcrumbs` | Breadcrumbs |
| `configure-table-of-contents` | Table of Contents |
| `configure-form-builder` | Form Builder |
| `configure-marquee` | Marquee |
| `configure-lottie` | Lottie |
| `configure-alert` | Alert |
| `configure-slider-slide` | Slider Slide |
| `configure-icon-list-item` | Icon List Item |
| `configure-flip-card-front` | Flip Card Front |
| `configure-flip-card-back` | Flip Card Back |
| `configure-card-body` | Card Body |

#### Form Field Configurators (12)

Configure form fields within a form builder block. Each follows the same pattern:

**Common Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_index": 4,
    "attributes": {
      "label": "Your Name",
      "required": true,
      "placeholder": "Enter your name"
    }
  }
}
```

| Ability | Field Type |
|---------|-----------|
| `configure-form-text` | Text input |
| `configure-form-email` | Email input |
| `configure-form-textarea` | Textarea |
| `configure-form-select` | Select dropdown |
| `configure-form-radio` | Radio buttons |
| `configure-form-checkbox` | Checkboxes |
| `configure-form-number` | Number input |
| `configure-form-phone` | Phone input |
| `configure-form-date` | Date picker |
| `configure-form-url` | URL input |
| `configure-form-hidden` | Hidden field |
| `configure-form-file` | File upload |

#### Utility Configurators (5)

##### configure-block-attributes
Generic attribute configurator that works with **any** block. Validates attributes against the block registry.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_index": 0,
    "block_name": "core/heading",
    "attributes": {
      "level": 2,
      "textAlign": "center"
    }
  }
}
```

##### configure-shape-divider
Configures decorative shape dividers on section blocks. Supports 23 shapes.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_index": 0,
    "position": "top",
    "shape": "waves",
    "color": "#ffffff",
    "height": 80,
    "width": 100,
    "flipX": false,
    "flipY": false,
    "inFront": false
  }
}
```

Valid shapes: `waves`, `waves-opacity`, `curve`, `curve-asymmetrical`, `triangle`, `triangle-asymmetrical`, `tilt`, `tilt-opacity`, `arrow`, `split`, `book`, `zigzag`, `pyramids`, `clouds`, `drops`, `mountains`, `hills`, `paint-brush`, `fan`, `swirl`, `grunge`, `slime`, `custom`.

##### configure-counter-animation
Configures animation timing for counter blocks.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_name": "designsetgo/counter",
    "animation": {
      "duration": 3,
      "easing": "easeOutQuad",
      "delay": 0.2
    }
  }
}
```

##### configure-responsive-visibility
Controls block visibility across breakpoints.

##### configure-max-width
Configures maximum width constraints on blocks.

### Operation Abilities

#### batch-update
Updates multiple blocks in a single API call. Supports up to 20 operations per request.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "operations": [
      {
        "block_name": "core/heading",
        "attributes": {
          "textAlign": "center"
        }
      },
      {
        "block_name": "designsetgo/section",
        "attributes": {
          "paddingTop": "40px"
        },
        "filter": {
          "backgroundColor": "#ffffff"
        }
      }
    ]
  }
}
```

Each operation targets blocks by `block_name`. The optional `filter` object matches only blocks whose existing attributes match the filter values.

#### delete-block
Removes blocks from a post.

**Input**:
```json
{
  "input": {
    "post_id": 123,
    "block_name": "designsetgo/divider",
    "position": 0,
    "delete_all": false
  }
}
```

Target by `block_name`, `block_client_id`, or `position`. Set `delete_all: true` to remove all matching blocks. This ability has the `destructive` annotation.

## Authentication

Use WordPress Application Passwords for REST API authentication:

```bash
curl -X POST -u "username:app_password" \
  "http://yoursite.com/?rest_route=/wp-abilities/v1/abilities/ABILITY_NAME/run" \
  -H "Content-Type: application/json" \
  -d '{"input": {...}}'
```

## Best Practices

1. **Start with `list-abilities`**: Discover all available tools before building workflows
2. **Use `get-post-blocks` before modifying**: Get block indices to target specific blocks
3. **Always specify post_id**: Required for all inserter, configurator, and generator abilities
4. **Use position parameter**: Control where blocks are inserted (0=prepend, -1=append, N=specific index)
5. **Use `insert-block-into` for nesting**: Don't insert flat blocks when you need hierarchy
6. **Batch when possible**: Use `batch-update` instead of multiple individual configurator calls
7. **Validate on frontend first**: Test that blocks render correctly for visitors
8. **Plan your layout**: Use generators for complete sections, inserters for individual blocks
9. **Test with real content**: Use representative text lengths and images
10. **Review in editor before publishing**: Resolve validation warnings by saving once

## Troubleshooting

### Blocks Show "Unexpected or Invalid Content"
- **Cause**: REST API cannot generate client-side save HTML
- **Solution**: Open post in editor and save once
- **Note**: Frontend renders correctly regardless of validation warnings

### 403 Permission Denied
- **Cause**: Authentication failed or user lacks edit_posts capability
- **Solution**: Check Application Password and user permissions

### 404 Not Found
- **Cause**: Abilities API not registered or wrong endpoint URL
- **Solution**: Ensure plugin is active, check WordPress REST API is enabled

### Invalid Block Structure
- **Cause**: Missing required fields or malformed JSON
- **Solution**: Validate JSON schema, check required fields in documentation

## Example: Complete Landing Page

```bash
#!/bin/bash

POST_ID=123
USER="admin"
PASS="your_app_password"
URL="http://yoursite.com"
API="$URL/?rest_route=/wp-abilities/v1/abilities/designsetgo"

# 0. Discover available abilities
curl -X GET -u "$USER:$PASS" \
  "$API/list-abilities/run" \
  -H "Content-Type: application/json" \
  -d '{"input": {"category": "generator"}}'

# 1. Generate hero section
curl -X POST -u "$USER:$PASS" \
  "$API/generate-hero-section/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"heading\": \"Welcome\", \"description\": \"Our awesome product\"}}"

# 2. Generate feature grid
curl -X POST -u "$USER:$PASS" \
  "$API/generate-feature-grid/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"columns\": 3, \"features\": [...]}}"

# 3. Generate stats section
curl -X POST -u "$USER:$PASS" \
  "$API/generate-stats-section/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"columns\": 4, \"stats\": [...]}}"

# 4. Generate FAQ section
curl -X POST -u "$USER:$PASS" \
  "$API/generate-faq-section/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"title\": \"FAQ\", \"faqs\": [...]}}"

# 5. Apply animations to all headings
curl -X POST -u "$USER:$PASS" \
  "$API/apply-animation/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"block_name\": \"core/heading\", \"animation\": {...}}}"

# 6. Batch update: center all headings and add padding to sections
curl -X POST -u "$USER:$PASS" \
  "$API/batch-update/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"operations\": [
    {\"block_name\": \"core/heading\", \"attributes\": {\"textAlign\": \"center\"}},
    {\"block_name\": \"designsetgo/section\", \"attributes\": {\"paddingTop\": \"60px\"}}
  ]}}"

# 7. Verify the blocks were inserted
curl -X GET -u "$USER:$PASS" \
  "$API/get-post-blocks/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID}}"
```

## WordPress Abilities API Reference

For the full official WordPress Abilities API documentation, see:

- [Abilities API Overview](https://developer.wordpress.org/apis/abilities-api/)
- [Getting Started](https://developer.wordpress.org/apis/abilities-api/getting-started/)
- [Hooks Reference](https://developer.wordpress.org/apis/abilities-api/hooks/)
- [PHP Reference](https://developer.wordpress.org/apis/abilities-api/php-reference/)
- [REST API Endpoints](https://developer.wordpress.org/apis/abilities-api/rest-api-endpoints/)

### Key API Details

**Registration hooks** (order matters):
1. `wp_abilities_api_categories_init` — register categories first
2. `wp_abilities_api_init` — register abilities after categories exist

**`wp_register_ability()` key parameters:**
- `category` — top-level parameter (not nested in `meta`)
- `show_in_rest` — top-level parameter, set `true` to expose via REST
- `annotations` — top-level parameter with `readonly`, `destructive`, `idempotent`, `instructions`

**REST endpoint for execution:**
- `GET|POST|DELETE /wp-abilities/v1/{namespace}/{ability}/run`
- HTTP method determined by `annotations`: `readonly` = GET, `destructive` = DELETE, default = POST

**Execution hooks:**
- `wp_before_execute_ability` — fires before ability runs
- `wp_after_execute_ability` — fires after successful execution

## Future Roadmap

- [x] ~~Server-side render callbacks to eliminate validation warnings~~
- [x] ~~Bulk operations (apply settings to multiple blocks at once)~~
- [x] ~~Query abilities (search/filter existing blocks)~~
- [ ] Template abilities (save/load pre-designed layouts)
- [ ] MCP Server integration for direct AI agent access

## Support

- **GitHub Issues**: https://github.com/yourusername/designsetgo/issues
- **Documentation**: https://designsetgo.com/docs
- **WordPress Abilities API Handbook**: https://developer.wordpress.org/apis/abilities-api/

---

**Version**: 2.1.0
**Last Updated**: 2026-02-09
