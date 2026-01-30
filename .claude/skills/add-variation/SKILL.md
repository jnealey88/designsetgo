---
name: add-variation
description: Create a block variation with preset configurations
argument-hint: [block-name]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(mkdir *), Bash(npm run *)
---


Create a new block variation for a WordPress core block.

## Ask the User For

- **Which core block?** (e.g., "core/group", "core/columns", "core/cover")
- **Variation name and description**
- **Default layout and attributes**
- **Icon** (from WordPress Dashicons)

## What Gets Created

1. Directory: `src/variations/[block-name]-variations/` (if doesn't exist)
2. Create or update `index.js` with new variation
3. Import in `src/index.js` (if new file)

## Variation Pattern

```javascript
import { registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockVariation('core/group', {
    name: 'hero-section',
    title: __('Hero Section', 'designsetgo'),
    description: __('Full-width hero section with centered content', 'designsetgo'),
    icon: 'cover-image',
    scope: ['inserter'],
    attributes: {
        layout: {
            type: 'constrained',
            contentSize: '800px',
        },
        style: {
            spacing: {
                padding: {
                    top: 'var(--wp--preset--spacing--70)',
                    bottom: 'var(--wp--preset--spacing--70)',
                },
            },
        },
    },
    innerBlocks: [
        ['core/heading', { level: 1, content: __('Hero Title', 'designsetgo') }],
        ['core/paragraph', { content: __('Hero description', 'designsetgo') }],
    ],
});
```

## Use WordPress Native Layout Attributes

**For Grid:**
```javascript
layout: { type: 'grid', columnCount: 3 }
```

**For Flex:**
```javascript
layout: { type: 'flex', orientation: 'horizontal' }
```

**For Constrained (default):**
```javascript
layout: { type: 'constrained', contentSize: '800px' }
```

## Best Practices

**Always:**
- Use WordPress spacing presets: `var(--wp--preset--spacing--50)`
- Never hardcode colors or spacing values
- Provide meaningful `innerBlocks` examples
- Keep variations focused (< 5 per block type)

**Variation Scope:**
- `['inserter']` - Appears in block inserter
- `['block']` - Appears in block transforms
- `['inserter', 'block']` - Appears in both

## After Creation

Build the plugin:

```bash
npm run build
```

Variations will appear in the block inserter under the parent block.
