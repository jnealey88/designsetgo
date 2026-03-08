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

DesignSetGo provides a focused set of abilities across 3 categories:

- **Info** - Discover abilities, list blocks, list extensions, inspect post content, find blocks across posts (`list-abilities`, `list-blocks`, `list-extensions`, `get-post-blocks`, `find-blocks`)
- **Inserters** - `add-block` (generic top-level), `add-child-block` (nested), plus child-block inserters (`add-accordion-item`, `add-tab`, `add-timeline-item`)
- **Configurators** - `update-block` (generic), block-specific configurators with custom logic, and operations (`batch-update`, `delete-block`)

### 1. Info Abilities (5)

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
      "name": "designsetgo/add-block",
      "label": "Add Block",
      "description": "Inserts any block at the top level of a post...",
      "category": "inserter",
      "input_schema": { ... }
    }
  ],
  "total": ...
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

#### `designsetgo/list-extensions`

Returns all DesignSetGo block extensions with their attribute schemas, applicable blocks, and descriptions. Extensions add features like animation, parallax, responsive visibility to existing blocks. Use `update-block` with the extension attribute names to apply them.

**Input:**
```json
{
  "detail": "summary"  // Options: "summary", "full"
}
```

**Output:**
```json
{
  "success": true,
  "extensions": [
    {
      "name": "animation",
      "description": "Entrance/exit animations with scroll triggers",
      "applicable_blocks": ["core/*", "designsetgo/*"],
      "attributes": {
        "dsgAnimationEnabled": { "type": "boolean", "default": false },
        "dsgEntranceAnimation": { "type": "string", "default": "" },
        "dsgAnimationTrigger": { "type": "string", "default": "scroll" },
        "dsgAnimationDuration": { "type": "number", "default": 600 }
      }
    }
  ],
  "total": 15
}
```

**REST API Example:** (readonly — uses GET)
```bash
curl -X GET "http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/list-extensions/run?detail=full" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Block Insertion Abilities

#### `designsetgo/add-block`

Generic top-level inserter that adds any block to a post. Replaces all block-specific inserters.

**Input:**
```json
{
  "post_id": 123,
  "block_name": "designsetgo/flex",
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

`block_name` is any valid block type (e.g., `designsetgo/flex`, `designsetgo/grid`, `designsetgo/section`, `core/paragraph`).

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
curl -X POST http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/add-block/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "post_id": 123,
    "block_name": "designsetgo/flex",
    "attributes": {
      "direction": "row",
      "justifyContent": "center"
    }
  }'
```

---

### 3. Block Configuration Abilities

#### Generic Configurator

##### `designsetgo/update-block`

Generic ability to update **any** block's attributes by document-order index, block name, or client ID. Also used to apply extension attributes (animation, parallax, responsive visibility, etc.) -- use `list-extensions` to discover available extension attribute names and schemas.

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

Target a block by either `block_index` (document-order from `get-post-blocks`) or `block_client_id`. The `attributes` object accepts any valid attribute from the block's schema.

---

#### Block-Specific Configurators (with custom logic)

These configurators have custom logic beyond simple attribute setting:

| Ability | Description |
|---------|-------------|
| `configure-shape-divider` | Shape dividers on sections (23 shapes, position fan-out logic) |
| `configure-custom-css` | Custom CSS per block (CSS sanitization for security) |

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

### 4. Additional Inserter Abilities

#### `designsetgo/add-child-block`

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

#### `designsetgo/add-accordion-item`

Adds an item to an existing accordion container.

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

#### `designsetgo/add-tab`

Adds a tab to an existing tabs container.

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

#### `designsetgo/add-timeline-item`

Adds an item to an existing timeline container.

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

### 5. Complete Abilities Reference

#### Info Abilities

| Ability | Description | Annotation |
|---------|-------------|------------|
| `list-abilities` | Discover all registered abilities with schemas | readonly |
| `list-blocks` | List all available DesignSetGo blocks | readonly |
| `list-extensions` | List all extensions with attribute schemas and applicable blocks | readonly |
| `get-post-blocks` | Retrieve blocks from a post with blockIndex values | readonly |
| `find-blocks` | Search for blocks across posts by type | readonly |

#### Inserter Abilities

| Ability | Description |
|---------|-------------|
| `add-block` | Insert any block at the top level of a post |
| `add-child-block` | Insert any block as a child of an existing block |
| `add-accordion-item` | Add an item to an existing accordion |
| `add-tab` | Add a tab to an existing tabs block |
| `add-timeline-item` | Add an item to an existing timeline |

#### Configurator Abilities

**Generic Configurator:**

| Ability | Description |
|---------|-------------|
| `update-block` | Update any block's attributes, including extension attributes (generic) |

**Block-Specific Configurators (with custom logic):**

| Ability | Description |
|---------|-------------|
| `configure-shape-divider` | Shape dividers on sections (23 shapes, position fan-out logic) |
| `configure-custom-css` | Custom CSS per block (CSS sanitization for security) |

**Extensions** — Use `list-extensions` to discover all available extensions (animation, parallax, responsive visibility, etc.) with their attribute schemas and applicable blocks, then use `update-block` to apply extension attributes to blocks.

**Operations** — Bulk and destructive operations:

| Ability | Description | Annotation |
|---------|-------------|------------|
| `batch-update` | Update multiple blocks in one call | -- |
| `delete-block` | Remove blocks from a post | destructive |

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
const result = await mcp.callTool("designsetgo/add-block", {
  post_id: 123,
  block_name: "designsetgo/flex",
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
  'http://yoursite.com/wp-json/wp-abilities/v1/designsetgo/add-block/run',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({ post_id: 123, block_name: 'designsetgo/flex', attributes: { direction: 'row' } })
  }
);
```

---

## Use Cases

### 1. AI-Assisted Page Building

**User:** "Create a landing page with a hero section, 3 feature columns, and a CTA"

**AI Agent Actions:**
1. Create new post
2. `designsetgo/add-block` (designsetgo/section) → Hero with heading/button
3. `designsetgo/add-block` (designsetgo/grid) → 3-column grid
4. `designsetgo/add-block` (designsetgo/section) → CTA section

---

### 2. Bulk Content Generation

**User:** "Add fade-in animations to all headings"

**AI Agent Actions:**
1. `designsetgo/list-extensions` → Discover animation extension attribute names
2. `designsetgo/get-post-blocks` → Get all heading blocks with their indices
3. `designsetgo/batch-update` → Apply animation attributes to all headings via `update-block`

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
| `list-extensions` | `read` |
| All other info abilities | `edit_posts` |
| All inserter abilities | `edit_posts` |
| All configurator abilities | `edit_posts` |
| All generator abilities | `edit_posts` |

---

## Roadmap

### Completed in v2.0.0

- [x] Additional inserter abilities (Section, Map, Countdown Timer, Form Builder, etc.)
- [x] Layout generator abilities (hero, features, stats, FAQ, contact, pricing, team, testimonials, CTA, gallery)
- [x] Extension configurators (custom CSS, shape dividers)
- [x] WordPress 6.9 native Abilities API support

### Completed in v2.1.0

- [x] Batch operation abilities (`batch-update`)
- [x] Block query abilities (`get-post-blocks`, `find-blocks`)
- [x] Block deletion ability (`delete-block`)
- [x] Child block inserters (`add-accordion-item`, `add-tab`, `add-timeline-item`)
- [x] Nested insertion (`add-child-block`)
- [x] Generic block configurator (`update-block`)
- [x] Generic block inserter (`add-block`)
- [x] Shape divider configurator (`configure-shape-divider`)
- [x] Extension discovery (`list-extensions`)
- [x] Abilities manifest (`list-abilities`)
- [x] Auto-discovery of ability classes (no manual registration needed)
- [x] Enhanced CSS sanitization for security
- [x] Standardized error responses with HTTP status codes
- [x] Consolidated thin-wrapper inserters and configurators into generic abilities

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
    // $abilities['designsetgo/add-block'] = new Wrapped_Add_Block();

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
$exists = wp_ability_is_registered( 'designsetgo/add-block' );

// Get a specific ability instance
$ability = wp_get_ability( 'designsetgo/add-block' );

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
