# DesignSetGo Design System

## Overview

The DesignSetGo Design System integrates seamlessly with WordPress's Full Site Editing (FSE) global styles, allowing you to customize your blocks from the Site Editor's Styles panel.

## How It Works

### 1. **FSE Integration**

Your blocks now appear in the Site Editor under:
```
Appearance → Editor → Styles → Blocks → [Your Block Name]
```

Users can customize:
- **Colors**: Background, text, borders (using your design tokens)
- **Typography**: Fonts, sizes (using your design tokens)
- **Spacing**: Padding, margin, gap (using your design tokens)
- **Layout**: Default layouts and presets
- **Style Variations**: Pre-designed block styles

### 2. **Design Tokens**

Design tokens are centralized values that ensure consistency across your entire site. They're implemented using WordPress's native CSS custom properties.

#### Color Tokens

**Available Colors:**
- `--wp--preset--color--dsg-primary` (#2563eb - Blue)
- `--wp--preset--color--dsg-secondary` (#7c3aed - Purple)
- `--wp--preset--color--dsg-accent` (#f59e0b - Orange)
- `--wp--preset--color--dsg-success` (#10b981 - Green)
- `--wp--preset--color--dsg-warning` (#f59e0b - Orange)
- `--wp--preset--color--dsg-error` (#ef4444 - Red)

**Gradients:**
- `--wp--preset--gradient--dsg-primary-to-secondary`
- `--wp--preset--gradient--dsg-sunset`
- `--wp--preset--gradient--dsg-ocean`

**Usage in CSS:**
```css
.my-element {
  background: var(--wp--preset--color--dsg-primary);
  background: var(--wp--preset--gradient--dsg-sunset);
}
```

**Usage in Block Attributes:**
```javascript
// In block.json or save.js
style: {
  color: {
    background: 'var:preset|color|dsg-primary'
  }
}
```

#### Spacing Tokens

**Available Sizes:**
- `--wp--preset--spacing--xs` (0.5rem / 8px)
- `--wp--preset--spacing--sm` (1rem / 16px)
- `--wp--preset--spacing--md` (1.5rem / 24px)
- `--wp--preset--spacing--lg` (2rem / 32px)
- `--wp--preset--spacing--xl` (3rem / 48px)
- `--wp--preset--spacing--xxl` (4rem / 64px)

**Usage:**
```css
.my-element {
  padding: var(--wp--preset--spacing--lg);
  margin-bottom: var(--wp--preset--spacing--md);
  gap: var(--wp--preset--spacing--sm);
}
```

#### Typography Tokens

**Font Sizes:**
- `--wp--preset--font-size--small` (0.875rem / 14px)
- `--wp--preset--font-size--medium` (1rem / 16px)
- `--wp--preset--font-size--large` (1.5rem / 24px)
- `--wp--preset--font-size--x-large` (2rem / 32px)
- `--wp--preset--font-size--xx-large` (2.5rem / 40px)

**Font Families:**
- `--wp--preset--font-family--system` (System font stack)

**Usage:**
```css
.my-element {
  font-size: var(--wp--preset--font-size--large);
  font-family: var(--wp--preset--font-family--system);
}
```

#### Custom Design Tokens

**Border Radius:**
- `--wp--custom--designsetgo--border-radius--none` (0)
- `--wp--custom--designsetgo--border-radius--small` (0.25rem)
- `--wp--custom--designsetgo--border-radius--medium` (0.5rem)
- `--wp--custom--designsetgo--border-radius--large` (1rem)
- `--wp--custom--designsetgo--border-radius--full` (9999px)

**Shadows:**
- `--wp--custom--designsetgo--shadow--small`
- `--wp--custom--designsetgo--shadow--medium`
- `--wp--custom--designsetgo--shadow--large`
- `--wp--custom--designsetgo--shadow--xlarge`

**Usage:**
```css
.my-element {
  border-radius: var(--wp--custom--designsetgo--border-radius--medium);
  box-shadow: var(--wp--custom--designsetgo--shadow--medium);
}
```

### 3. **Block Style Variations**

Style variations provide pre-designed styles for your blocks that users can select with one click.

#### Container Block Variations

**Available Styles:**
1. **Default** - Clean, minimal container
2. **Card** - Elevated card with shadow
3. **Elevated** - Stronger shadow with hover effect
4. **Bordered** - Clean border, no shadow
5. **Gradient** - Gradient background
6. **Glass** - Glassmorphism effect

**How to Use:**
1. Select a Container block
2. In the block toolbar or sidebar, click "Styles"
3. Choose a variation (Card, Elevated, etc.)

**Technical Implementation:**

Style variations are registered in PHP:
```php
register_block_style(
  'designsetgo/container',
  array(
    'name'  => 'card',
    'label' => __( 'Card', 'designsetgo' ),
  )
);
```

And styled in CSS:
```scss
.wp-block-designsetgo-container.is-style-card {
  background: var(--wp--preset--color--base);
  border-radius: var(--wp--custom--designsetgo--border-radius--medium);
  box-shadow: var(--wp--custom--designsetgo--shadow--medium);
}
```

### 4. **Utility Classes**

Utility classes provide quick styling without custom CSS.

#### Responsive Utilities

**Hide on Specific Devices:**
```html
<div class="dsg-hide-mobile">Hidden on mobile</div>
<div class="dsg-hide-tablet">Hidden on tablet</div>
<div class="dsg-hide-desktop">Hidden on desktop</div>
```

#### Spacing Utilities

**Padding:**
```html
<div class="dsg-p-xs">8px padding</div>
<div class="dsg-p-sm">16px padding</div>
<div class="dsg-p-md">24px padding</div>
<div class="dsg-p-lg">32px padding</div>
<div class="dsg-p-xl">48px padding</div>
```

**Margin:**
```html
<div class="dsg-m-sm">16px margin</div>
<div class="dsg-m-md">24px margin</div>
<div class="dsg-m-lg">32px margin</div>
```

#### Color Utilities

**Background Colors:**
```html
<div class="dsg-bg-primary">Primary background</div>
<div class="dsg-bg-secondary">Secondary background</div>
<div class="dsg-bg-accent">Accent background</div>
```

**Text Colors:**
```html
<p class="dsg-text-primary">Primary text</p>
<p class="dsg-text-secondary">Secondary text</p>
<p class="dsg-text-accent">Accent text</p>
```

#### Border Radius Utilities

```html
<div class="dsg-rounded-none">No radius</div>
<div class="dsg-rounded-sm">Small radius</div>
<div class="dsg-rounded-md">Medium radius</div>
<div class="dsg-rounded-lg">Large radius</div>
<div class="dsg-rounded-full">Fully rounded</div>
```

#### Shadow Utilities

```html
<div class="dsg-shadow-sm">Small shadow</div>
<div class="dsg-shadow-md">Medium shadow</div>
<div class="dsg-shadow-lg">Large shadow</div>
<div class="dsg-shadow-xl">Extra large shadow</div>
```

#### Animation Utilities

**Entrance Animations:**
```html
<div class="dsg-fade-in">Fades in</div>
<div class="dsg-slide-up">Slides up</div>
<div class="dsg-zoom-in">Zooms in</div>
```

**Note:** Respects `prefers-reduced-motion` user preference.

#### Layout Utilities

```html
<div class="dsg-flex dsg-items-center dsg-justify-center dsg-gap-md">
  Flexbox centered with gap
</div>

<div class="dsg-grid dsg-gap-lg">
  Grid layout with gap
</div>
```

### 5. **Customizing the Design System**

#### Option 1: Via Site Editor (Recommended)

1. Go to **Appearance → Editor**
2. Click **Styles** (top right)
3. Customize global settings:
   - **Colors**: Add/edit color palette
   - **Typography**: Set fonts and sizes
   - **Layout**: Set content width, spacing
4. Customize per-block:
   - Click **Blocks** in Styles panel
   - Select **Container** (or other DesignSetGo block)
   - Customize spacing, colors, etc.
5. Click **Save**

Changes apply globally across your entire site!

#### Option 2: Via Plugin Settings

1. Go to **DesignSetGo** in WordPress admin
2. Configure design tokens:
   - Primary/Secondary/Accent colors
   - Spacing scale
   - Typography presets
3. Save changes

These settings feed into the FSE global styles system.

#### Option 3: Via Code (Advanced)

**Filter the design tokens:**

```php
add_filter( 'designsetgo_global_styles', function( $styles ) {
  $styles['colors']['dsg-primary'] = '#your-color';
  $styles['spacing']['lg'] = '2.5rem';
  return $styles;
} );
```

**Override theme.json:**

Create a `theme.json` file in your theme with:

```json
{
  "version": 2,
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "dsg-primary",
          "color": "#your-color",
          "name": "DSG Primary"
        }
      ]
    }
  }
}
```

Your theme's `theme.json` takes precedence over plugin settings.

## Best Practices

### 1. **Use Design Tokens Consistently**

❌ **Don't:**
```css
.my-block {
  padding: 24px;
  color: #2563eb;
}
```

✅ **Do:**
```css
.my-block {
  padding: var(--wp--preset--spacing--md);
  color: var(--wp--preset--color--dsg-primary);
}
```

### 2. **Let Users Customize**

Design tokens allow users to customize your blocks from the Site Editor. Always use tokens instead of hardcoded values.

### 3. **Test in FSE**

After making changes:
1. Go to Site Editor
2. Check **Styles → Blocks → [Your Block]**
3. Verify customizations work
4. Test on frontend

### 4. **Respect User Preferences**

Always check for `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: no-preference) {
  .my-animation {
    animation: slide 0.6s ease;
  }
}
```

### 5. **Follow WordPress Conventions**

- Use `var:preset|*|*` notation in block attributes
- Use `var(--wp--preset--*)` in CSS
- Follow [WordPress's design system patterns](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/)

## Troubleshooting

### Design tokens not working?

1. **Rebuild assets:**
   ```bash
   npm run build
   ```

2. **Clear cache:**
   - Clear WordPress cache
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

3. **Check theme.json:**
   Your theme's `theme.json` may override plugin settings

### Block styles not appearing?

1. **Verify registration:**
   Check that `register_block_style()` was called

2. **Check CSS:**
   Ensure `.is-style-[name]` classes exist in CSS

3. **Rebuild:**
   ```bash
   npm run build
   ```

### Customizations not saving?

1. **Check permissions:**
   User needs `manage_options` capability

2. **Check nonce:**
   Verify REST API security token

3. **Check console:**
   Look for JavaScript errors

## Resources

- [WordPress Theme.json Documentation](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/)
- [WordPress Global Styles](https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/)
- [Block Supports Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## Examples

### Example 1: Customizing Container Block Globally

**Via Site Editor:**
1. Appearance → Editor → Styles
2. Click **Blocks** → **Container**
3. Set default padding: **Large (32px)**
4. Set background: **DSG Primary**
5. Save

**All Container blocks now use these settings by default!**

### Example 2: Creating Custom Style Variation

**1. Register the variation (PHP):**
```php
register_block_style(
  'designsetgo/container',
  array(
    'name'  => 'neon',
    'label' => __( 'Neon', 'designsetgo' ),
  )
);
```

**2. Add styles (SCSS):**
```scss
.wp-block-designsetgo-container.is-style-neon {
  background: var(--wp--preset--color--dsg-primary);
  border: 2px solid var(--wp--preset--color--dsg-accent);
  box-shadow: 0 0 20px var(--wp--preset--color--dsg-primary);
  color: white;
}
```

**3. Rebuild and use!**

### Example 3: Using Design Tokens in Custom Block

```javascript
// In block.json
{
  "attributes": {
    "style": {
      "type": "object",
      "default": {
        "spacing": {
          "padding": {
            "top": "var:preset|spacing|lg",
            "bottom": "var:preset|spacing|lg"
          }
        },
        "color": {
          "background": "var:preset|color|dsg-primary"
        }
      }
    }
  }
}
```

```javascript
// In edit.js
const blockProps = useBlockProps({
  style: {
    backgroundColor: 'var(--wp--preset--color--dsg-primary)',
    padding: 'var(--wp--preset--spacing--lg)'
  }
});
```

## Summary

The DesignSetGo Design System provides:

✅ **FSE Integration** - Customize from Site Editor
✅ **Design Tokens** - Consistent, theme-able values
✅ **Style Variations** - Pre-designed block styles
✅ **Utility Classes** - Quick styling without custom CSS
✅ **User Customization** - Let users make it their own

**Philosophy**: "Leverage WordPress defaults, empower users, maintain consistency"
