<?php
/**
 * Flex Container Block - Server-side Render
 *
 * Dynamically renders the Flex block using get_block_wrapper_attributes().
 * This ensures proper HTML generation when blocks are inserted via REST API.
 *
 * @package DesignSetGo
 * @since 2.0.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Unescape CSS variables in block attributes.
 *
 * WordPress's serialize_block() escapes dashes in CSS variables (e.g., u002d).
 * This function recursively unescapes them so CSS variables work properly.
 *
 * @param mixed $value Attribute value to process.
 * @return mixed Processed value.
 */
if ( ! function_exists( 'dsg_unescape_css_vars' ) ) {
	function dsg_unescape_css_vars( $value ) {
		if ( is_string( $value ) ) {
			// Convert Unicode escape sequences back to dashes.
			return preg_replace( '/u002d/i', '-', $value );
		} elseif ( is_array( $value ) ) {
			return array_map( 'dsg_unescape_css_vars', $value );
		}
		return $value;
	}
}

// Unescape CSS variables in all attributes.
$attributes = dsg_unescape_css_vars( $attributes );

// Extract custom attributes.
$direction        = isset( $attributes['direction'] ) ? $attributes['direction'] : 'row';
$wrap             = isset( $attributes['wrap'] ) ? $attributes['wrap'] : true;
$justify_content  = isset( $attributes['justifyContent'] ) ? $attributes['justifyContent'] : 'flex-start';
$align_items      = isset( $attributes['alignItems'] ) ? $attributes['alignItems'] : 'center';
$mobile_stack     = isset( $attributes['mobileStack'] ) ? $attributes['mobileStack'] : false;
$constrain_width  = isset( $attributes['constrainWidth'] ) ? $attributes['constrainWidth'] : true;
$content_width    = isset( $attributes['contentWidth'] ) ? $attributes['contentWidth'] : '';
$hover_bg_color   = isset( $attributes['hoverBackgroundColor'] ) ? $attributes['hoverBackgroundColor'] : '';
$hover_text_color = isset( $attributes['hoverTextColor'] ) ? $attributes['hoverTextColor'] : '';
$hover_icon_bg    = isset( $attributes['hoverIconBackgroundColor'] ) ? $attributes['hoverIconBackgroundColor'] : '';
$hover_button_bg  = isset( $attributes['hoverButtonBackgroundColor'] ) ? $attributes['hoverButtonBackgroundColor'] : '';

// Calculate effective content width (from useSetting or default).
$effective_content_width = ! empty( $content_width ) ? $content_width : '1200px';

// Extract gap from block supports (blockGap).
// WordPress stores preset values in shorthand format: var:preset|spacing|50
// We need to convert to CSS format: var(--wp--preset--spacing--50)
$block_gap = '';
if ( isset( $attributes['style']['spacing']['blockGap'] ) ) {
	$block_gap = $attributes['style']['spacing']['blockGap'];

	// Convert WordPress preset shorthand to CSS variable format.
	if ( strpos( $block_gap, 'var:' ) === 0 ) {
		// Convert var:preset|spacing|50 to var(--wp--preset--spacing--50)
		$block_gap = preg_replace(
			'/^var:([^|]+)\|([^|]+)\|(.+)$/',
			'var(--wp--$1--$2--$3)',
			$block_gap
		);
	}
}

// Determine final gap value (priority: blockGap > default).
// IMPORTANT: Always provide a default gap to prevent items from being too close together.
$final_gap = ! empty( $block_gap ) ? $block_gap : 'var(--wp--preset--spacing--50)';

// Build inner wrapper inline styles (declarative).
$inner_styles = array(
	'display'         => 'flex',
	'flex-direction'  => $direction,
	'flex-wrap'       => $wrap ? 'wrap' : 'nowrap',
	'justify-content' => $justify_content,
	'align-items'     => $align_items,
	'gap'             => $final_gap,
);

if ( $constrain_width ) {
	$inner_styles['max-width']    = $effective_content_width;
	$inner_styles['margin-left']  = 'auto';
	$inner_styles['margin-right'] = 'auto';
}

// Convert inner styles array to CSS string.
$inner_style_string = '';
foreach ( $inner_styles as $property => $value ) {
	$inner_style_string .= esc_attr( $property ) . ':' . esc_attr( $value ) . ';';
}

// Build outer wrapper custom CSS vars and classes.
$wrapper_classes = 'dsg-flex';
if ( $mobile_stack ) {
	$wrapper_classes .= ' dsg-flex--mobile-stack';
}

// Get wrapper attributes from WordPress (handles all block supports like spacing, colors, etc.).
// Only pass the class - WordPress will add block supports styles automatically.
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $wrapper_classes,
	)
);

// Add animation attributes (for block animation extension support).
$wrapper_attributes = dsg_add_animation_to_wrapper( $wrapper_attributes, $attributes );

// Unescape CSS variables in the generated HTML attributes.
// WordPress's block serialization escapes dashes (-- becomes u002d).
$wrapper_attributes = preg_replace( '/u002d/i', '-', $wrapper_attributes );

// Build custom CSS variables and required styles to append.
$custom_styles = array();
$custom_styles[] = 'width:100%';
$custom_styles[] = 'align-self:stretch';

if ( $hover_bg_color ) {
	$custom_styles[] = '--dsg-hover-bg-color:' . esc_attr( $hover_bg_color );
}
if ( $hover_text_color ) {
	$custom_styles[] = '--dsg-hover-text-color:' . esc_attr( $hover_text_color );
}
if ( $hover_icon_bg ) {
	$custom_styles[] = '--dsg-parent-hover-icon-bg:' . esc_attr( $hover_icon_bg );
}
if ( $hover_button_bg ) {
	$custom_styles[] = '--dsg-parent-hover-button-bg:' . esc_attr( $hover_button_bg );
}

// Append custom styles to existing style attribute if present.
if ( ! empty( $custom_styles ) ) {
	$custom_style_string = implode( ';', $custom_styles ) . ';';

	// Check if style attribute exists in wrapper attributes.
	if ( strpos( $wrapper_attributes, 'style="' ) !== false ) {
		// Append to existing style attribute (before the closing quote).
		$wrapper_attributes = preg_replace(
			'/style="([^"]*)"/',
			'style="$1' . $custom_style_string . '"',
			$wrapper_attributes
		);
	} else {
		// Add new style attribute.
		$wrapper_attributes .= ' style="' . $custom_style_string . '"';
	}
}
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="dsg-flex__inner" style="<?php echo $inner_style_string; ?>">
		<?php echo $content; ?>
	</div>
</div>
