<?php
/**
 * Product Categories Grid Block - Server-side Rendering
 *
 * @package DesignSetGo
 * @since 2.1.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content (unused for dynamic blocks).
 * @param WP_Block $block      Block instance.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Bail if WooCommerce is not active.
if ( ! function_exists( 'wc_get_product' ) ) {
	return '';
}
