# Block Extension Strategy

## Philosophy: Extend, Don't Rebuild

Rather than creating custom blocks that duplicate WordPress core functionality, we should extend existing blocks with additional features. This approach provides:

✅ **Better UX** - Users already know core blocks
✅ **Theme Compatibility** - Core blocks are universally supported
✅ **Less Code** - Extend rather than rebuild
✅ **Future-Proof** - Core blocks get WordPress updates
✅ **Standards Compliant** - Follow WordPress best practices

---

## Extension Methods

### 1. Block Variations
Create preset versions of existing blocks with predefined settings.

**Use Cases:**
- Pre-configured layouts (3-column grid, hero section, etc.)
- Common design patterns
- Template starting points

**Example:** Instead of creating a custom "Container" block, create variations of the Group block:
- "Flex Row Container"
- "3-Column Grid"
- "Centered Hero Section"

### 2. Block Styles
Add visual style options to existing blocks.

**Use Cases:**
- Design variations (outlined, filled, shadow, etc.)
- Brand-specific styling
- Visual effects

**Example:** Add styles to Group block:
- "Card Style"
- "Elevated"
- "Bordered"

### 3. Block Filters
Add custom attributes and controls to existing blocks.

**Use Cases:**
- Additional functionality
- Custom attributes
- Enhanced controls

**Example:** Add to Group block:
- Flexbox/Grid layout controls
- Animation settings
- Responsive visibility

### 4. Custom Blocks (When Necessary)
Only create custom blocks when:
- Functionality is completely unique
- No core block can be extended
- Requires special rendering logic

---

## WordPress Core Blocks We Should Extend

### Group Block → DesignSetGo Layout Extensions
Instead of custom Container block, extend Group with:
- ✅ Flexbox/Grid layout controls
- ✅ Advanced spacing options
- ✅ Animation settings
- ✅ Responsive visibility

### Heading Block → DesignSetGo Typography Extensions
Instead of custom heading block, extend Heading with:
- ✅ Gradient text
- ✅ Text effects (shadow, outline)
- ✅ Icon integration
- ✅ Subtitle support

### Button Block → DesignSetGo Button Extensions
Instead of custom button block, extend Button with:
- ✅ Additional style variations
- ✅ Icon position options
- ✅ Hover effects
- ✅ Animation on scroll

### Image Block → DesignSetGo Image Extensions
Instead of custom image block, extend Image with:
- ✅ Advanced hover effects
- ✅ Lightbox functionality
- ✅ Overlay options
- ✅ Parallax effects

### Columns Block → DesignSetGo Grid Extensions
Instead of custom grid block, add:
- ✅ Auto-grid variations
- ✅ Responsive column controls
- ✅ Gap controls
- ✅ Advanced alignment

---

## Recommended Architecture

### Phase 1: Block Extensions (Weeks 1-8)
Focus on extending core blocks rather than creating custom ones.

**Priority Extensions:**
1. **Group Block** - Flexbox/Grid controls, animations
2. **Heading Block** - Typography effects, gradients
3. **Button Block** - Icons, advanced styles
4. **Image Block** - Effects, lightbox
5. **Columns Block** - Auto-grid, responsive

### Phase 2: Block Variations (Weeks 9-12)
Create variations of extended blocks for common patterns.

**Priority Variations:**
1. Hero section (Group variation)
2. Feature cards (Group variation)
3. Pricing tables (Group variation)
4. Testimonials (Group variation)
5. Team members (Group variation)

### Phase 3: Custom Blocks (Weeks 13-16)
Only create custom blocks for truly unique functionality.

**Candidates for Custom Blocks:**
1. **Accordion** - Unique interaction pattern
2. **Tabs** - Unique state management
3. **Modal/Popup** - Special rendering
4. **Icon Picker** - Complex UI component
5. **Advanced Carousel** - Complex navigation

---

## Implementation Examples

### Example 1: Extend Group Block with Flexbox

```javascript
// src/extensions/group-layout/index.js
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

// Add custom attributes
addFilter(
    'blocks.registerBlockType',
    'designsetgo/group-layout-attributes',
    (settings, name) => {
        if (name !== 'core/group') {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                dsgLayout: {
                    type: 'string',
                    default: 'default',
                },
                dsgFlexDirection: {
                    type: 'string',
                    default: 'row',
                },
            },
        };
    }
);

// Add custom controls
addFilter(
    'editor.BlockEdit',
    'designsetgo/group-layout-controls',
    (BlockEdit) => (props) => {
        const { name, attributes, setAttributes } = props;

        if (name !== 'core/group') {
            return <BlockEdit {...props} />;
        }

        return (
            <>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody title="DesignSetGo Layout" initialOpen={true}>
                        <SelectControl
                            label="Layout Type"
                            value={attributes.dsgLayout}
                            options={[
                                { label: 'Default', value: 'default' },
                                { label: 'Flexbox', value: 'flex' },
                                { label: 'Grid', value: 'grid' },
                            ]}
                            onChange={(value) =>
                                setAttributes({ dsgLayout: value })
                            }
                        />
                    </PanelBody>
                </InspectorControls>
            </>
        );
    }
);
```

### Example 2: Create Block Variation for Hero Section

```javascript
// src/variations/hero-section/index.js
import { registerBlockVariation } from '@wordpress/blocks';

registerBlockVariation('core/group', {
    name: 'designsetgo-hero',
    title: 'Hero Section',
    description: 'Centered content with background',
    category: 'designsetgo',
    icon: 'align-center',
    attributes: {
        align: 'full',
        style: {
            spacing: {
                padding: {
                    top: '80px',
                    bottom: '80px',
                },
            },
        },
        layout: {
            type: 'constrained',
        },
    },
    innerBlocks: [
        [
            'core/heading',
            {
                level: 1,
                textAlign: 'center',
                placeholder: 'Hero Heading',
            },
        ],
        [
            'core/paragraph',
            {
                align: 'center',
                placeholder: 'Hero description goes here...',
            },
        ],
        ['core/buttons', { layout: { type: 'flex', justifyContent: 'center' } }],
    ],
    scope: ['inserter'],
});
```

### Example 3: Add Block Styles

```javascript
// src/styles/group-styles/index.js
import { registerBlockStyle } from '@wordpress/blocks';

registerBlockStyle('core/group', {
    name: 'designsetgo-card',
    label: 'Card',
});

registerBlockStyle('core/group', {
    name: 'designsetgo-elevated',
    label: 'Elevated',
});

registerBlockStyle('core/group', {
    name: 'designsetgo-bordered',
    label: 'Bordered',
});
```

---

## Benefits of This Approach

### 1. User Experience
- **Familiar Interface** - Users already know Group, Heading, Button blocks
- **Consistency** - Extensions feel native to WordPress
- **Discoverability** - Extensions appear in familiar locations

### 2. Development
- **Less Code** - Extend rather than rebuild
- **Faster Development** - Focus on enhancements, not foundations
- **Easier Maintenance** - Fewer custom blocks to maintain

### 3. Compatibility
- **Theme Agnostic** - Core blocks work everywhere
- **Plugin Compatible** - No conflicts with other plugins
- **Future-Proof** - Core blocks get WordPress updates

### 4. Performance
- **Smaller Bundle** - Less JavaScript to load
- **Conditional Loading** - Only load extensions when blocks are used
- **Native Optimization** - Core blocks are already optimized

---

## Migration Path

### From Current Container Block to Group Extension

**Current Approach (Custom Block):**
```
Custom Container Block
├── Full block registration
├── Custom edit component
├── Custom save component
├── Custom styles
└── ~40KB of code
```

**New Approach (Extension):**
```
Group Block Extension
├── Attribute filters
├── Control filters
├── Style additions
└── ~5KB of code
```

**Steps:**
1. Create Group block extension with Flexbox/Grid controls
2. Add block variations for common container patterns
3. Deprecate custom Container block
4. Provide migration notice to users

---

## Recommended Changes

### Immediate Actions

1. **Pause Custom Block Development**
   - Don't build more custom blocks yet
   - Evaluate each planned block for extension opportunities

2. **Refactor Container Block**
   - Convert to Group block extension
   - Keep existing functionality
   - Reduce code by ~80%

3. **Create Extension Architecture**
   - Build extension system
   - Create filter utilities
   - Set up variation registry

4. **Update Documentation**
   - Document extension approach
   - Provide examples
   - Update roadmap

---

## Next Steps

Would you like me to:

1. **Refactor the Container block** to extend Group block instead?
2. **Create the extension architecture** for the plugin?
3. **Build examples** of variations, styles, and filters?
4. **Update the roadmap** to focus on extensions over custom blocks?

This approach will make DesignSetGo more powerful while being lighter, faster, and more WordPress-native.
