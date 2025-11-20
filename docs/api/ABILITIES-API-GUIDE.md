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

## Available Abilities

### Information Abilities

#### list-blocks
Lists all available DesignSetGo blocks with their metadata.

**Endpoint**: `POST /wp-abilities/v1/abilities/designsetgo/list-blocks/run`

**Input**:
```json
{
  "input": {
    "category": "all"
  }
}
```

**Output**: Array of block objects with name, category, description, etc.

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

### Configurator Abilities

#### apply-animation
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

#### configure-counter-animation
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

## Authentication

Use WordPress Application Passwords for REST API authentication:

```bash
curl -X POST -u "username:app_password" \
  "http://yoursite.com/?rest_route=/wp-abilities/v1/abilities/ABILITY_NAME/run" \
  -H "Content-Type: application/json" \
  -d '{"input": {...}}'
```

## Best Practices

1. **Always specify post_id**: Required for all inserter and generator abilities
2. **Use position parameter**: Control where blocks are inserted (0=prepend, -1=append, N=specific index)
3. **Validate on frontend first**: Test that blocks render correctly for visitors
4. **Plan your layout**: Use generators for complete sections, inserters for individual blocks
5. **Test with real content**: Use representative text lengths and images
6. **Review in editor before publishing**: Resolve validation warnings by saving once

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

# 1. Generate hero section
curl -X POST -u "$USER:$PASS" \
  "$URL/?rest_route=/wp-abilities/v1/abilities/designsetgo/generate-hero-section/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"heading\": \"Welcome\", \"description\": \"Our awesome product\"}}"

# 2. Generate feature grid
curl -X POST -u "$USER:$PASS" \
  "$URL/?rest_route=/wp-abilities/v1/abilities/designsetgo/generate-feature-grid/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"columns\": 3, \"features\": [...]}}"

# 3. Generate stats section
curl -X POST -u "$USER:$PASS" \
  "$URL/?rest_route=/wp-abilities/v1/abilities/designsetgo/generate-stats-section/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"columns\": 4, \"stats\": [...]}}"

# 4. Generate FAQ section
curl -X POST -u "$USER:$PASS" \
  "$URL/?rest_route=/wp-abilities/v1/abilities/designsetgo/generate-faq-section/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"title\": \"FAQ\", \"faqs\": [...]}}"

# 5. Apply animations
curl -X POST -u "$USER:$PASS" \
  "$URL/?rest_route=/wp-abilities/v1/abilities/designsetgo/apply-animation/run" \
  -H "Content-Type: application/json" \
  -d "{\"input\": {\"post_id\": $POST_ID, \"block_name\": \"core/heading\", \"animation\": {...}}}"
```

## Future Roadmap

- [ ] Server-side render callbacks to eliminate validation warnings
- [ ] Bulk operations (apply settings to multiple blocks at once)
- [ ] Query abilities (search/filter existing blocks)
- [ ] Template abilities (save/load pre-designed layouts)
- [ ] MCP Server integration for direct AI agent access

## Support

- **GitHub Issues**: https://github.com/yourusername/designsetgo/issues
- **Documentation**: https://designsetgo.com/docs
- **Community**: https://designsetgo.com/community

---

**Version**: 2.0.0
**Last Updated**: 2025-11-07
