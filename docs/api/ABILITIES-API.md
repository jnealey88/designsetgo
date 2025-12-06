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

DesignSetGo currently provides **50 abilities** across 4 categories:

- **1 Discovery** - List available blocks
- **29 Inserters** - Insert specific blocks (containers, interactive, visual, dynamic, content, modal, media, forms, navigation)
- **10 Configurators** - Apply animations, scroll effects, responsive visibility, and other enhancements to existing blocks
- **10 Generators** - Generate complete page sections (hero, features, stats, FAQ, contact, pricing, team, testimonials, CTA, gallery)

### 1. Discovery Abilities

#### `designsetgo/list-blocks`

Lists all available DesignSetGo blocks with their metadata, attributes, and capabilities.

**Input:**
```json
{
  "category": "all"  // Options: "all", "layout", "interactive", "visual", "dynamic"
}
```

**Output:**
```json
[
  {
    "name": "designsetgo/flex",
    "title": "Flex Container",
    "description": "Flexible horizontal or vertical layout container...",
    "category": "layout",
    "attributes": { ... },
    "supports": [ ... ]
  }
]
```

**REST API Example:**
```bash
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"category": "layout"}'
```

---

### 2. Block Insertion Abilities

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
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/abilities/designsetgo/insert-flex-container/execute \
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
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/abilities/designsetgo/insert-grid-container/execute \
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

### 3. Block Configuration Abilities

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
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/abilities/designsetgo/configure-counter-animation/execute \
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
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/abilities/designsetgo/apply-animation/execute \
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

### 4. Generator Abilities (v1.3.0)

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

### 5. Additional Inserter Abilities (v1.3.0)

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

#### Inserter Abilities (29 total)

| Ability | Description |
|---------|-------------|
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
| `insert-tabs` | Tabbed content |
| `insert-accordion` | Expandable content panels |
| `insert-flip-card` | 3D flip card |
| `insert-reveal` | Scroll reveal animation container |
| `insert-scroll-accordion` | Scroll-triggered accordion |
| `insert-scroll-marquee` | Infinite scrolling marquee |
| `insert-slider` | Carousel/slideshow |
| `insert-card` | Styled content card |
| `insert-image-accordion` | Expandable image gallery |
| `insert-map` | Interactive OpenStreetMap |
| `insert-modal` | Modal/popup dialog |
| `insert-modal-trigger` | Modal trigger button |
| `insert-form-builder` | Contact form with fields |

#### Configurator Abilities (10 total)

| Ability | Description |
|---------|-------------|
| `apply-animation` | Entrance/exit animations |
| `configure-counter-animation` | Counter animation settings |
| `apply-scroll-parallax` | Vertical scroll parallax effect |
| `apply-text-reveal` | Scroll-triggered text color reveal |
| `apply-expanding-background` | Expanding background effect |
| `configure-background-video` | Background video for containers |
| `configure-clickable-group` | Make containers clickable |
| `configure-custom-css` | Custom CSS per block |
| `configure-responsive-visibility` | Show/hide by device |
| `configure-max-width` | Max width constraints |

#### Generator Abilities (10 total)

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
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/abilities/... \
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
// Discover all abilities
const response = await fetch('http://yoursite.com/wp-json/wp-abilities/v1/abilities');
const abilities = await response.json();

// Filter DesignSetGo abilities
const designsetgoAbilities = abilities.filter(a => a.name.startsWith('designsetgo/'));

// Execute an ability
const result = await fetch(
  'http://yoursite.com/wp-json/wp-abilities/v1/abilities/designsetgo/list-blocks/execute',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('username:password')
    },
    body: JSON.stringify({ category: 'all' })
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

| Ability | Required Capability |
|---------|-------------------|
| `list-blocks` | `read` |
| `insert-flex-container` | `edit_posts` |
| `insert-grid-container` | `edit_posts` |
| `configure-counter-animation` | `edit_posts` |
| `apply-animation` | `edit_posts` |

---

## Roadmap

### Completed in v2.0.0

- [x] Additional inserter abilities (Section, Map, Countdown Timer, Form Builder, etc.)
- [x] Layout generator abilities (hero, features, stats, FAQ, contact, pricing, team, testimonials, CTA, gallery)
- [x] Extension configurators (background video, clickable groups, custom CSS, responsive visibility)
- [x] WordPress 6.9 native Abilities API support

### Phase 3 (Future)

- [ ] Batch operation abilities (apply changes to multiple blocks)
- [ ] Pattern template generation
- [ ] Full-page layout generation from descriptions
- [ ] Advanced animation sequencing
- [ ] Theme style application

---

## Development

### Creating Custom Abilities

DesignSetGo's abilities architecture is extensible. Create your own abilities:

```php
<?php
namespace DesignSetGo\Abilities\Custom;

use DesignSetGo\Abilities\Abstract_Ability;

class My_Custom_Ability extends Abstract_Ability {
    public function get_name(): string {
        return 'designsetgo/my-custom-ability';
    }

    public function get_config(): array {
        return array(
            'label' => __('My Custom Ability', 'designsetgo'),
            'description' => __('Does something awesome', 'designsetgo'),
            'input_schema' => array( /* ... */ ),
            'output_schema' => array( /* ... */ ),
            'permission_callback' => array($this, 'check_permission_callback'),
        );
    }

    public function execute(array $input) {
        // Your logic here
        return $this->success(array('result' => 'awesome'));
    }
}
```

Register in `includes/abilities/class-abilities-registry.php`:

```php
if (class_exists('DesignSetGo\Abilities\Custom\My_Custom_Ability')) {
    $this->add_ability(new \DesignSetGo\Abilities\Custom\My_Custom_Ability());
}
```

---

## Support

- **Documentation:** [https://github.com/yourrepo/designsetgo/docs](docs/)
- **Issues:** [https://github.com/yourrepo/designsetgo/issues](issues)
- **WordPress AI Initiative:** [https://make.wordpress.org/ai/](https://make.wordpress.org/ai/)

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
