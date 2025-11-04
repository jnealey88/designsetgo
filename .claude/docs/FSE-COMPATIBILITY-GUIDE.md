# Full Site Editing (FSE) Compatibility Guide

**Critical**: Custom blocks MUST support FSE to work with modern WordPress themes like Twenty Twenty-Five.

## Why FSE Matters

- Users expect blocks to work in Site Editor
- Global styles allow site-wide customization
- Theme.json integration is the WordPress standard
- Patterns make blocks more accessible to users

## Required block.json Supports

### Minimum FSE Support
```json
{
  "supports": {
    "html": false,
    "inserter": true,
    "layout": {
      "allowSwitching": true,
      "allowEditing": true
    },
    "spacing": {
      "margin": true,
      "padding": true,
      "blockGap": true
    },
    "color": {
      "background": true,
      "text": true,
      "link": true
    }
  }
}
```

### Full FSE Support (Recommended)
```json
{
  "supports": {
    "anchor": true,
    "align": ["wide", "full"],
    "html": false,
    "inserter": true,
    "layout": {
      "allowSwitching": true,
      "allowInheriting": false,
      "allowEditing": true,
      "allowSizingOnChildren": true,
      "default": {
        "type": "flex",
        "orientation": "vertical"
      }
    },
    "spacing": {
      "margin": true,
      "padding": true,
      "blockGap": true,
      "__experimentalDefaultControls": {
        "padding": true,
        "blockGap": true
      }
    },
    "dimensions": {
      "minHeight": true
    },
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
    "background": {
      "backgroundImage": true,
      "backgroundSize": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "__experimentalDefaultControls": {
        "fontSize": true
      }
    },
    "shadow": true,
    "position": {
      "sticky": true
    },
    "__experimentalBorder": {
      "color": true,
      "radius": true,
      "style": true,
      "width": true,
      "__experimentalDefaultControls": {
        "color": true,
        "radius": true,
        "style": true,
        "width": true
      }
    }
  }
}
```

## Block Example (Required for Patterns)

Add an `example` property to show a preview:

```json
{
  "example": {
    "attributes": {
      "layout": {
        "type": "flex",
        "orientation": "vertical"
      }
    },
    "innerBlocks": [
      {
        "name": "core/heading",
        "attributes": {
          "level": 2,
          "content": "Block Title"
        }
      },
      {
        "name": "core/paragraph",
        "attributes": {
          "content": "Block description here."
        }
      }
    ]
  }
}
```

**Why**:
- Shows preview in block inserter
- Displays in pattern library
- Helps users understand block purpose
- Required for pattern discovery

## Use Theme Spacing Tokens

**Always use WordPress spacing presets** instead of hardcoded values:

```javascript
// ❌ BAD - Hardcoded values
style={{
  paddingTop: '80px',
  paddingBottom: '80px'
}}

// ✅ GOOD - Theme spacing tokens
style={{
  paddingTop: 'var(--wp--preset--spacing--xl)',
  paddingBottom: 'var(--wp--preset--spacing--xl)'
}}
```

**In block patterns**:
```html
<!-- Use var:preset|spacing|xl notation -->
<div style="padding-top:var(--wp--preset--spacing--xl)">
```

## Theme.json Global Styles

Users can customize your block globally via theme.json:

```json
{
  "styles": {
    "blocks": {
      "designsetgo/container": {
        "spacing": {
          "padding": {
            "top": "var(--wp--preset--spacing--50)",
            "bottom": "var(--wp--preset--spacing--50)"
          }
        },
        "color": {
          "background": "var(--wp--preset--color--base)"
        },
        "border": {
          "radius": "8px"
        }
      }
    }
  }
}
```

**Ensure your blocks respect these settings** - don't override with `!important` unless necessary.

## Block Patterns for Discoverability

Create patterns to showcase your blocks:

```php
<?php
/**
 * Title: Hero Section with Container
 * Slug: designsetgo/hero/container-hero
 * Categories: dsg-hero
 * Description: Full-width hero section
 * Keywords: hero, header, banner
 */

return array(
	'title'      => __( 'Hero Section with Container', 'designsetgo' ),
	'categories' => array( 'dsg-hero' ),
	'content'    => '<!-- wp:designsetgo/container {...} -->...'
);
```

**Pattern Structure**:
```
patterns/
├── hero/
│   └── container-hero.php
├── features/
│   └── three-column-grid.php
└── cta/
    └── centered-cta.php
```

**Benefits**:
- Users discover features through patterns
- Pre-built layouts increase adoption
- Shows best practices for using your blocks
- Works seamlessly in Site Editor

## FSE Testing Checklist

Before releasing a block, test FSE compatibility:

- [ ] Block appears in Site Editor inserter
- [ ] Block preview shows in pattern library
- [ ] Global styles can be applied (Styles → Blocks → Your Block)
- [ ] Theme spacing tokens work (`var:preset|spacing|*`)
- [ ] Theme colors work (`var:preset|color|*`)
- [ ] Layout switching works (Stack/Row/Grid)
- [ ] Block patterns appear in pattern inserter
- [ ] Works with Twenty Twenty-Five theme
- [ ] No console errors in Site Editor
- [ ] Saves and loads correctly in templates

## Common FSE Issues

**Issue 1: Block not appearing in Site Editor**
```json
// Add to block.json
"inserter": true
```

**Issue 2: Global styles not applying**
```json
// Enable color/spacing/typography supports
"supports": {
  "color": { "background": true, "text": true },
  "spacing": { "padding": true, "margin": true }
}
```

**Issue 3: Patterns not showing**
```json
// Add example to block.json
"example": { "attributes": {...}, "innerBlocks": [...] }
```

**Issue 4: Theme colors not available**
```javascript
// Use useSettings hook (WordPress 6.5+)
const [themeColors] = useSettings('color.palette');
```

## Key Takeaways

1. **FSE is not optional** - Modern themes expect it
2. **Use WordPress spacing/color presets** - Don't hardcode values
3. **Add comprehensive supports** - The more, the better
4. **Provide block examples** - Required for patterns
5. **Create patterns** - Increases discoverability
6. **Test with FSE themes** - Twenty Twenty-Five is your baseline
