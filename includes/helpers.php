<?php
/**
 * Helper Functions
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get block CSS class name.
 *
 * @param string $block_name Block name without namespace.
 * @param string $unique_id  Unique block ID.
 * @return string CSS class name.
 */
function designsetgo_get_block_class( $block_name, $unique_id = '' ) {
	$class = 'dsg-' . $block_name;

	if ( $unique_id ) {
		$class .= ' dsg-block-' . $unique_id;
	}

	return $class;
}

/**
 * Generate unique block ID.
 *
 * @return string Unique ID.
 */
function designsetgo_generate_block_id() {
	return 'dsg-' . wp_generate_uuid4();
}

/**
 * Sanitize CSS value.
 *
 * @param mixed $value Value to sanitize.
 * @return string Sanitized value.
 */
function designsetgo_sanitize_css_value( $value ) {
	if ( is_numeric( $value ) ) {
		return $value . 'px';
	}

	return sanitize_text_field( $value );
}

/**
 * Check if block is DesignSetGo block.
 *
 * @param string $block_name Block name.
 * @return bool
 */
function designsetgo_is_dsg_block( $block_name ) {
	return strpos( $block_name, 'designsetgo/' ) === 0;
}
