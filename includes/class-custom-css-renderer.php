<?php
/**
 * Custom CSS Renderer Class
 *
 * Handles rendering custom CSS for blocks on the frontend.
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Custom CSS Renderer Class - Handles custom CSS output
 */
class Custom_CSS_Renderer {
	/**
	 * Collected custom CSS from all blocks on the page.
	 * Format: [ hash => [ 'css' => string, 'class' => string ] ]
	 *
	 * @var array
	 */
	private $custom_css = array();

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'render_block', array( $this, 'collect_custom_css' ), 10, 2 );
		add_action( 'wp_footer', array( $this, 'render_custom_css' ), 999 );
	}

	/**
	 * Collect custom CSS from blocks as they render.
	 *
	 * @param string $block_content Block content.
	 * @param array  $block         Block data.
	 * @return string Block content.
	 */
	public function collect_custom_css( $block_content, $block ) {
		// Check if block has custom CSS attribute.
		if ( isset( $block['attrs']['dsgCustomCSS'] ) && ! empty( $block['attrs']['dsgCustomCSS'] ) ) {
			$custom_css = $block['attrs']['dsgCustomCSS'];

			// Generate hash for this CSS (same algorithm as JavaScript).
			$hash = $this->hash_code( $custom_css . $block['blockName'] );

			// Generate the CSS class name.
			$class_name = 'dsgo-custom-css-' . $hash;

			// Store CSS with hash as key to avoid duplicates.
			$this->custom_css[ $hash ] = array(
				'css'   => $custom_css,
				'class' => $class_name,
			);
		}

		return $block_content;
	}

	/**
	 * Render all collected custom CSS in the footer.
	 */
	public function render_custom_css() {
		if ( empty( $this->custom_css ) ) {
			return;
		}

		echo "\n<!-- DesignSetGo Custom CSS -->\n";
		echo '<style id="designsetgo-custom-css">' . "\n";

		foreach ( $this->custom_css as $data ) {
			$css        = $data['css'];
			$class_name = $data['class'];

			// Replace "selector" with actual class name.
			$processed_css = $this->replace_selector( $css, $class_name );

			// Sanitize CSS (remove <script> tags and other dangerous content).
			$sanitized_css = $this->sanitize_css( $processed_css );
			echo $sanitized_css . "\n";
		}

		echo '</style>' . "\n";
	}

	/**
	 * Replace "selector" keyword with actual CSS class.
	 * Supports all variations: selector, selector:hover, selector h3, etc.
	 *
	 * @param string $css        CSS code.
	 * @param string $class_name Actual CSS class to use.
	 * @return string Processed CSS with selector replaced.
	 */
	private function replace_selector( $css, $class_name ) {
		if ( empty( $css ) ) {
			return '';
		}

		// Replace "selector" with the actual class (word boundary aware).
		return preg_replace( '/\bselector\b/', '.' . $class_name, $css );
	}

	/**
	 * Sanitize CSS to remove potentially dangerous content.
	 *
	 * Enhanced security version that blocks:
	 * - Script tags and HTML
	 * - Event handlers
	 * - JavaScript protocols
	 * - Data URIs (prevent data URI attacks)
	 * - Browser-specific XSS vectors
	 * - HTML entities (bypass attempts)
	 *
	 * @param string $css CSS code.
	 * @return string Sanitized CSS.
	 */
	private function sanitize_css( $css ) {
		// Remove script tags and all HTML tags.
		$css = preg_replace( '/<script\b[^>]*>(.*?)<\/script>/is', '', $css );
		$css = preg_replace( '/<[^>]+>/i', '', $css );

		// Remove event handlers (onclick, onload, etc.).
		$css = preg_replace( '/on\w+\s*=\s*["\'].*?["\']/i', '', $css );

		// Remove dangerous protocols.
		$css = preg_replace( '/javascript:/i', '', $css );
		$css = preg_replace( '/vbscript:/i', '', $css );

		// Remove data: protocol in url() functions (prevents data URI attacks).
		$css = preg_replace( '/url\s*\(\s*["\']?data:/i', 'url(', $css );

		// Remove -moz-binding (XBL) and -moz-document.
		$css = preg_replace( '/-moz-binding\s*:/i', '', $css );
		$css = preg_replace( '/@-moz-document/i', '', $css );

		// Remove behavior (IE specific).
		$css = preg_replace( '/behavior\s*:/i', '', $css );

		// Remove @import with non-http(s) URLs.
		$css = preg_replace( '/@import\s+url\s*\(\s*["\']?(?!https?:).*?["\']?\s*\)/i', '', $css );
		$css = preg_replace( '/@import\s+["\'](?!https?:).*?["\']/i', '', $css );

		// Remove expression() (IE specific).
		$css = preg_replace( '/expression\s*\(/i', '', $css );

		// Remove HTML entities that could be used to bypass filters.
		$css = preg_replace( '/&#[xX]?[0-9a-fA-F]+;/i', '', $css );

		// Additional WordPress-recommended sanitization.
		$css = wp_strip_all_tags( $css );

		return $css;
	}

	/**
	 * Simple hash function to generate consistent IDs (matches JavaScript version).
	 *
	 * @param string $str String to hash.
	 * @return string Hash string.
	 */
	private function hash_code( $str ) {
		$hash = 0;
		$len  = strlen( $str );

		for ( $i = 0; $i < $len; $i++ ) {
			$char = ord( $str[ $i ] );
			$hash = ( ( $hash << 5 ) - $hash ) + $char;
			$hash = $hash & 0xFFFFFFFF; // Convert to 32bit integer.
		}

		return base_convert( abs( $hash ), 10, 36 );
	}
}
