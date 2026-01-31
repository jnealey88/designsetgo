# Block Exclusion System Guide

## Overview

The Block Exclusion System allows you to prevent DesignSetGo (DSG) extensions from being applied to specific third-party blocks. This is particularly useful for resolving compatibility issues with server-side rendered blocks like Gravity Forms, MailPoet, WooCommerce, and Jetpack.

## When to Use Block Exclusions

Use the exclusion system when you encounter:

- **REST API validation errors** with third-party blocks
- **Unexpected behavior** when DSG extensions are applied to certain blocks
- **Conflicts** between DSG features and block-specific functionality
- **Performance issues** with specific block types

## Common Symptoms of Conflicts

- Block validation errors in the editor
- "This block contains unexpected or invalid content" warnings
- Failed block saves or updates
- Missing block attributes after save
- Console errors mentioning REST API validation

## How to Exclude Blocks

### Via Admin UI

1. Navigate to **WordPress Admin > DSG Settings > Blocks & Extensions**
2. Click the **Exclusions** tab
3. Enter the block name in one of two formats:
   - **Exact match**: `gravityforms/form` (excludes only this specific block)
   - **Namespace wildcard**: `gravityforms/*` (excludes all Gravity Forms blocks)
4. Click **Add**
5. Click **Save Changes** at the bottom

### Block Name Formats

**Valid formats:**
- `namespace/blockname` - e.g., `gravityforms/form`
- `namespace/*` - e.g., `woocommerce/*`

**Invalid formats:**
- Missing namespace separator: `gravityformsform` ❌
- Special characters: `gravity-forms/form!` ❌
- Uppercase letters: `GravityForms/Form` ❌ (block names are case-sensitive)

## Default Exclusions

### Fresh Installations

New installations automatically exclude these commonly problematic blocks:
- `gravityforms/*` - All Gravity Forms blocks
- `mailpoet/*` - All MailPoet blocks
- `woocommerce/*` - All WooCommerce blocks
- `jetpack/*` - All Jetpack blocks

### Existing Installations

Existing installations maintain their current behavior with no automatic exclusions. You can manually add exclusions as needed.

## Common Blocks to Exclude

### Form Builders
- `gravityforms/*` - Gravity Forms
- `mailpoet/*` - MailPoet
- `wpforms/*` - WPForms
- `formidable/*` - Formidable Forms
- `ninja-forms/*` - Ninja Forms

### E-commerce
- `woocommerce/*` - WooCommerce blocks
- `edd/*` - Easy Digital Downloads
- `bigcommerce/*` - BigCommerce

### Third-Party Integrations
- `jetpack/*` - Jetpack blocks
- `yoast/*` - Yoast SEO blocks
- `hubspot/*` - HubSpot blocks

### Page Builders
- `elementor/*` - Elementor blocks (if using Elementor with Gutenberg)
- `beaver-builder/*` - Beaver Builder blocks

## What Gets Excluded

When you exclude a block, DSG will not apply ANY of the following extensions to it:

1. **Background Video** - Video backgrounds behind blocks
2. **Block Animations** - Entrance animations and scroll-triggered effects
3. **Clickable Group** - Make entire blocks clickable
4. **Custom CSS** - Per-block custom CSS
5. **Expanding Background** - Scroll-driven expanding backgrounds
6. **Grid Span** - Grid column/row spanning
7. **Max Width** - Maximum width controls
8. **Responsive** - Device-specific visibility
9. **Reveal Control** - Progressive content reveal
10. **Sticky Header Controls** - Sticky positioning
11. **Text Alignment Inheritance** - Alignment inheritance
12. **Text Reveal** - Scroll-triggered text reveals
13. **Vertical Scroll Parallax** - Parallax scroll effects

**Important:** The block itself will continue to work normally - only DSG extensions are prevented from being applied.

## Troubleshooting

### Block Still Shows Errors After Exclusion

1. **Clear browser cache** - DSG settings are cached in JavaScript
2. **Refresh the editor** - Reload the WordPress editor page
3. **Check exact block name** - Ensure you used the correct namespace and block name
4. **Verify format** - Block names must be lowercase with `/` separator

### How to Find a Block's Name

**Method 1: Block Inspector**
1. Select the block in the editor
2. Open browser DevTools (F12)
3. Look for `data-type` attribute in the HTML - this is the block name

**Method 2: Code Editor View**
1. Select the block
2. Click the three dots (⋮) in the toolbar
3. Select "Edit as HTML"
4. Look for the comment like `<!-- wp:namespace/blockname -->`

**Method 3: Console**
```javascript
// In browser console while block is selected
wp.data.select('core/block-editor').getSelectedBlock().name
```

### Block Works in Editor but Not Frontend

This is usually NOT an exclusion issue. Exclusions only affect the editor. Check:
- Theme compatibility
- CSS conflicts
- JavaScript errors in browser console
- Block's own frontend rendering

### Exclusion Not Working

1. **Verify you clicked Save Changes** - Settings aren't saved until you click the button
2. **Check for typos** - Block names are case-sensitive
3. **Try namespace wildcard** - Use `namespace/*` instead of specific block name
4. **Clear exclusion cache** - In rare cases, refresh the page

## Performance Considerations

The exclusion check is highly optimized:
- **Cached results**: Each block name is checked once and cached
- **Minimal overhead**: Less than 0.1ms per check
- **Smart defaults**: Pre-populated exclusions for common conflicts

## For Developers

### Checking Exclusions Programmatically

```javascript
import { shouldExtendBlock } from '../../utils/should-extend-block';

// Check if a block should receive DSG extensions
if (shouldExtendBlock('gravityforms/form')) {
  // Safe to extend
} else {
  // Block is excluded
}
```

### Clearing the Cache

```javascript
import { clearExclusionCache } from '../../utils/should-extend-block';

// Clear the exclusion cache (useful for testing)
clearExclusionCache();
```

### Extension Development

All DSG extensions check exclusions in 4 places:

1. **Attribute Registration** (`attributes.js`)
   ```javascript
   export const extendBlockAttributes = (settings, name) => {
     if (!shouldExtendBlock(name)) {
       return settings;
     }
     // Add attributes...
   };
   ```

2. **Edit Controls** (`index.js` - edit)
   ```javascript
   if (!shouldExtendBlock(blockName)) {
     return null;
   }
   ```

3. **Editor Styles** (`index.js` - editor styles)
   ```javascript
   if (!shouldExtendBlock(blockName)) {
     return null;
   }
   ```

4. **Save Props** (`index.js` - save props)
   ```javascript
   if (!shouldExtendBlock(blockName)) {
     return extraProps;
   }
   ```

## FAQ

### Will excluding a block break my site?

No. Exclusions only prevent DSG extensions from being applied. The block itself will continue to function normally.

### Can I exclude WordPress core blocks?

Yes, but it's rarely necessary. Core blocks are well-tested with DSG extensions. Only exclude if you experience specific conflicts.

### Do I need to exclude all blocks from a namespace?

Not necessarily. You can exclude specific blocks (e.g., `gravityforms/form`) or all blocks in a namespace (e.g., `gravityforms/*`). Use wildcards only if multiple blocks from the same plugin cause issues.

### Will my exclusions be lost when I update DSG?

No. Your custom exclusions are stored in the WordPress database and persist across plugin updates.

### Can I programmatically add exclusions?

Yes, via the WordPress REST API or by directly modifying the `designsetgo_settings` option in the database (not recommended).

## Best Practices

1. **Start specific, go broader if needed** - Exclude specific blocks first, use wildcards only if needed
2. **Document your exclusions** - Keep a note of why you excluded certain blocks
3. **Test after excluding** - Verify the block works as expected without DSG extensions
4. **Review periodically** - After DSG updates, test if exclusions are still necessary
5. **Report conflicts** - If you find a consistent conflict, report it to DSG support

## Support

If you encounter issues not resolved by exclusions:

1. **Check the documentation** - Review DSG extension docs for known conflicts
2. **Test with default theme** - Rule out theme conflicts
3. **Disable other plugins** - Identify plugin conflicts
4. **Contact support** - Provide block name, DSG version, and error messages

---

**Last Updated:** January 30, 2026
**DSG Version:** 1.3.1+
**For Questions:** [GitHub Issues](https://github.com/jnealey88/designsetgo/issues)
