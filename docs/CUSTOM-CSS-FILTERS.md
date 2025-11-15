# Custom CSS Filter Hooks

This document describes the filter hooks available for customizing the Custom CSS output in DesignSetGo.

## Overview

The Custom CSS Renderer provides five filter hooks that allow developers to customize how custom CSS is processed and output. These hooks enable use cases such as:

- CSS minification and optimization
- Custom preprocessing/postprocessing
- Integration with external CSS systems
- Conditional CSS loading
- Custom class naming schemes
- Additional sanitization rules

## Available Filters

### 1. `designsetgo/custom_css_block`

**Description:** Filters individual block CSS during collection (before any processing).

**Parameters:**
- `$custom_css` (string) - The raw CSS from the block attribute
- `$block_name` (string) - The full block name (e.g., 'core/paragraph', 'designsetgo/stack')
- `$block` (array) - The complete block data array

**Returns:** `string|null` - Modified CSS string, or null/empty to skip this block's CSS entirely

**Use Cases:**
- Modify CSS per block type
- Add preprocessing
- Conditionally skip CSS for specific blocks
- Add block-specific transformations

#### Example 1: Skip CSS for Specific Blocks
```php
add_filter( 'designsetgo/custom_css_block', function( $css, $block_name ) {
    // Don't output custom CSS for paragraph blocks
    if ( 'core/paragraph' === $block_name ) {
        return null;
    }
    return $css;
}, 10, 2 );
```

#### Example 2: Add Preprocessing
```php
add_filter( 'designsetgo/custom_css_block', function( $css, $block_name, $block ) {
    // Replace custom variables before processing
    $css = str_replace( '{{primary-color}}', '#007cba', $css );
    $css = str_replace( '{{spacing}}', '1rem', $css );
    return $css;
}, 10, 3 );
```

#### Example 3: Conditional CSS Based on Context
```php
add_filter( 'designsetgo/custom_css_block', function( $css, $block_name ) {
    // Only apply custom CSS on frontend, not in admin
    if ( is_admin() ) {
        return null;
    }
    return $css;
}, 10, 2 );
```

---

### 2. `designsetgo/custom_css_class_name`

**Description:** Filters the CSS class name generated for custom CSS.

**Parameters:**
- `$class_name` (string) - The generated class name (e.g., 'dsgo-custom-css-abc123')
- `$hash` (string) - The hash generated from CSS content and block name
- `$block_name` (string) - The full block name
- `$custom_css` (string) - The CSS content being processed

**Returns:** `string` - Modified class name

**Use Cases:**
- Custom class naming schemes
- Integration with existing CSS systems
- Namespacing for multi-site setups
- Debugging/logging

#### Example 1: Custom Prefix
```php
add_filter( 'designsetgo/custom_css_class_name', function( $class_name, $hash ) {
    // Use your own prefix instead of 'dsgo-custom-css-'
    return 'my-site-css-' . $hash;
}, 10, 2 );
```

#### Example 2: Include Block Type in Class Name
```php
add_filter( 'designsetgo/custom_css_class_name', function( $class_name, $hash, $block_name ) {
    // Extract block type (e.g., 'stack' from 'designsetgo/stack')
    $block_type = str_replace( 'designsetgo/', '', $block_name );
    $block_type = str_replace( 'core/', '', $block_type );
    return 'custom-' . $block_type . '-' . $hash;
}, 10, 3 );
```

#### Example 3: Multi-Site Namespacing
```php
add_filter( 'designsetgo/custom_css_class_name', function( $class_name, $hash ) {
    $site_id = get_current_blog_id();
    return 'site-' . $site_id . '-css-' . $hash;
}, 10, 2 );
```

---

### 3. `designsetgo/custom_css_sanitize`

**Description:** Filters CSS after default security sanitization.

**Parameters:**
- `$css` (string) - The sanitized CSS after default security processing
- `$original_css` (string) - The original CSS before sanitization

**Returns:** `string` - Further sanitized or modified CSS

**Use Cases:**
- Additional sanitization rules
- Allowlist specific CSS features
- Remove vendor prefixes
- Custom security policies

**⚠️ WARNING:** Use with caution. Ensure any custom sanitization maintains security standards.

#### Example 1: Additional Sanitization
```php
add_filter( 'designsetgo/custom_css_sanitize', function( $css, $original_css ) {
    // Remove !important declarations
    $css = preg_replace( '/\s*!important\s*/i', '', $css );
    return $css;
}, 10, 2 );
```

#### Example 2: Allowlist Specific Properties
```php
add_filter( 'designsetgo/custom_css_sanitize', function( $css ) {
    // Only allow specific CSS properties
    $allowed_properties = ['color', 'background-color', 'font-size', 'margin', 'padding'];

    // This is a simplified example - you'd need more robust parsing
    foreach ( $allowed_properties as $prop ) {
        // Keep allowed properties
    }

    return $css;
} );
```

#### Example 3: Strip Vendor Prefixes
```php
add_filter( 'designsetgo/custom_css_sanitize', function( $css ) {
    // Remove vendor prefixes (-webkit-, -moz-, -ms-, -o-)
    $css = preg_replace( '/-(?:webkit|moz|ms|o)-[a-z-]+\s*:/i', '', $css );
    return $css;
} );
```

**Note:** While this filter provides two parameters (`$css` and `$original_css`), you can declare only the parameters you need in your callback. Examples 2 and 3 demonstrate accepting just `$css`, which is sufficient when you don't need access to the original unsanitized CSS. If you need both parameters, use `function( $css, $original_css )` and specify `10, 2` for the `$accepted_args` parameter (as shown in Example 1).

---

### 4. `designsetgo/custom_css_processed`

**Description:** Filters processed CSS for a single block (after selector replacement and sanitization).

**Parameters:**
- `$sanitized_css` (string) - The processed and sanitized CSS
- `$class_name` (string) - The CSS class name being used
- `$block_name` (string) - The full block name
- `$hash` (string) - The hash identifier for this CSS block

**Returns:** `string` - Modified CSS string

**Use Cases:**
- Minification
- Vendor prefixing
- Post-processing
- CSS optimization

#### Example 1: Add Vendor Prefixes
```php
add_filter( 'designsetgo/custom_css_processed', function( $css ) {
    // Add vendor prefixes for flexbox (simplified example)
    $css = str_replace( 'display: flex;', 'display: -webkit-flex; display: flex;', $css );
    return $css;
} );
```

#### Example 2: Per-Block Optimization
```php
add_filter( 'designsetgo/custom_css_processed', function( $css, $class_name, $block_name ) {
    // Add specific optimizations for Stack blocks
    if ( 'designsetgo/stack' === $block_name ) {
        // Add GPU acceleration hint
        $css .= "\n." . $class_name . " { will-change: transform; }";
    }
    return $css;
}, 10, 3 );
```

#### Example 3: Basic Minification
```php
add_filter( 'designsetgo/custom_css_processed', function( $css ) {
    // Remove comments
    $css = preg_replace( '/\/\*.*?\*\//s', '', $css );
    // Remove whitespace
    $css = preg_replace( '/\s+/', ' ', $css );
    return trim( $css );
} );
```

---

### 5. `designsetgo/custom_css_output`

**Description:** Filters the complete CSS output before rendering to the page.

**Parameters:**
- `$output_css` (string) - The complete CSS string to be output
- `$custom_css_data` (array) - All collected CSS data (hash => [css, class, block])

**Returns:** `string` - Modified CSS output (return empty string to prevent inline output)

**Use Cases:**
- Global minification
- External file generation
- Caching
- CDN integration
- Complete output control

#### Example 1: Global Minification
```php
add_filter( 'designsetgo/custom_css_output', function( $css ) {
    // Remove all whitespace and newlines
    $css = preg_replace( '/\s+/', ' ', $css );
    $css = str_replace( '; }', '}', $css );
    return trim( $css );
} );
```

#### Example 2: Save to External File
```php
add_filter( 'designsetgo/custom_css_output', function( $css, $css_data ) {
    // Generate filename based on content hash
    $hash = md5( $css );
    $upload_dir = wp_upload_dir();
    $file_path = $upload_dir['basedir'] . '/designsetgo-css-' . $hash . '.css';
    $file_url = $upload_dir['baseurl'] . '/designsetgo-css-' . $hash . '.css';

    // Write CSS to file if it doesn't exist
    if ( ! file_exists( $file_path ) ) {
        file_put_contents( $file_path, $css );
    }

    // Enqueue the external file
    wp_enqueue_style( 'designsetgo-custom-css', $file_url, [], $hash );

    // Return empty string to prevent inline output
    return '';
}, 10, 2 );
```

#### Example 3: Conditional Output
```php
add_filter( 'designsetgo/custom_css_output', function( $css ) {
    // Only output CSS on specific pages
    if ( ! is_singular() ) {
        return ''; // No output on archive pages
    }
    return $css;
} );
```

#### Example 4: Add Performance Hints
```php
add_filter( 'designsetgo/custom_css_output', function( $css ) {
    // Add CSS containment for better performance
    $css = '/* Performance optimized CSS */' . "\n" . $css;
    return $css;
} );
```

---

## Complete Integration Example

Here's a complete example showing how to use multiple filters together for a production optimization setup:

```php
/**
 * DesignSetGo Custom CSS Optimization
 *
 * This example shows how to:
 * 1. Skip CSS for specific blocks
 * 2. Preprocess variables
 * 3. Minify output
 * 4. Save to external file with caching
 */

// 1. Skip CSS for blocks that don't need it
add_filter( 'designsetgo/custom_css_block', function( $css, $block_name ) {
    $skip_blocks = ['core/paragraph', 'core/heading'];
    if ( in_array( $block_name, $skip_blocks ) ) {
        return null;
    }
    return $css;
}, 10, 2 );

// 2. Preprocess custom variables
add_filter( 'designsetgo/custom_css_block', function( $css ) {
    $theme_colors = [
        '{{primary}}' => get_theme_mod( 'primary_color', '#007cba' ),
        '{{secondary}}' => get_theme_mod( 'secondary_color', '#545454' ),
    ];
    return str_replace( array_keys( $theme_colors ), array_values( $theme_colors ), $css );
}, 20 );

// 3. Add vendor prefixes
add_filter( 'designsetgo/custom_css_processed', function( $css ) {
    $prefixes = [
        'display: flex;' => 'display: -webkit-flex; display: flex;',
        'flex-direction:' => '-webkit-flex-direction:',
    ];
    return str_replace( array_keys( $prefixes ), array_values( $prefixes ), $css );
} );

// 4. Save to external file with versioning
add_filter( 'designsetgo/custom_css_output', function( $css ) {
    if ( empty( $css ) ) {
        return '';
    }

    // Minify
    $css = preg_replace( '/\s+/', ' ', $css );

    // Generate hash for cache busting
    $hash = md5( $css );
    $upload_dir = wp_upload_dir();
    $file_path = $upload_dir['basedir'] . '/custom-css/dsgo-' . $hash . '.css';
    $file_url = $upload_dir['baseurl'] . '/custom-css/dsgo-' . $hash . '.css';

    // Ensure directory exists
    wp_mkdir_p( dirname( $file_path ) );

    // Write file if it doesn't exist
    if ( ! file_exists( $file_path ) ) {
        file_put_contents( $file_path, $css );
    }

    // Enqueue external file
    wp_enqueue_style( 'designsetgo-custom', $file_url, [], $hash );

    // Prevent inline output
    return '';
} );
```

## Best Practices

1. **Performance**: Use filters efficiently - avoid heavy processing in filters that run per-block
2. **Security**: When using `designsetgo/custom_css_sanitize`, always maintain security standards
3. **Caching**: Consider caching filtered results to avoid repeated processing
4. **Priority**: Use appropriate filter priorities to ensure correct order of operations
5. **Testing**: Test filters thoroughly across different blocks and scenarios

## Filter Priority Recommendations

- **Preprocessing** (variables, conditionals): Priority 10-20
- **Sanitization additions**: Priority 10
- **Postprocessing** (prefixes, optimization): Priority 20-30
- **Output handling** (files, caching): Priority 50+

## Version History

- **1.2.0**: Initial release of filter hooks

## Support

For questions or issues related to these filters, please [open an issue](https://github.com/jnealey88/designsetgo/issues) on GitHub.
