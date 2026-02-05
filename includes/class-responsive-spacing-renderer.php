<?php
/**
 * Responsive Spacing Renderer
 *
 * Collects responsive spacing attributes from blocks during render
 * and outputs CSS with media queries in the footer.
 *
 * @package DesignSetGo
 * @since 1.5.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Responsive Spacing Renderer Class
 *
 * Follows the same pattern as Custom_CSS_Renderer:
 * - Collects data from blocks during render via render_block filter
 * - Outputs CSS in footer via wp_footer action
 */
class Responsive_Spacing_Renderer {

	/**
	 * Breakpoint for tablet (max-width).
	 *
	 * @var int
	 */
	const BREAKPOINT_TABLET = 1023;

	/**
	 * Breakpoint for mobile (max-width).
	 *
	 * @var int
	 */
	const BREAKPOINT_MOBILE = 767;

	/**
	 * Collected responsive spacing data from blocks.
	 * Format: [ blockStyleId => [ 'spacing' => array, 'block' => string ] ]
	 *
	 * @var array
	 */
	private $collected_styles = array();

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'render_block', array( $this, 'collect_responsive_spacing' ), 10, 2 );
		add_action( 'wp_footer', array( $this, 'render_responsive_spacing_css' ), 999 );
	}

	/**
	 * Collect responsive spacing data from blocks as they render.
	 *
	 * @param string $block_content Rendered block content.
	 * @param array  $block         Block data including name and attributes.
	 * @return string Unmodified block content.
	 */
	public function collect_responsive_spacing( $block_content, $block ) {
		// Check if this block has responsive spacing attributes.
		if (
			empty( $block['attrs']['dsgoResponsiveSpacing'] ) ||
			empty( $block['attrs']['dsgoBlockStyleId'] ) ||
			empty( $block['blockName'] )
		) {
			return $block_content;
		}

		$responsive_spacing = $block['attrs']['dsgoResponsiveSpacing'];
		$block_style_id     = $block['attrs']['dsgoBlockStyleId'];

		// Validate the block style ID format (alphanumeric with hyphens only).
		if ( ! preg_match( '/^dsgo-rs-[a-z0-9]+$/', $block_style_id ) ) {
			return $block_content;
		}

		// Apply filter to allow modification.
		$responsive_spacing = apply_filters(
			'designsetgo/responsive_spacing_block',
			$responsive_spacing,
			$block['blockName'],
			$block
		);

		if ( empty( $responsive_spacing ) ) {
			return $block_content;
		}

		// Store collected data (keyed by block style ID to avoid duplicates).
		$this->collected_styles[ $block_style_id ] = array(
			'spacing' => $responsive_spacing,
			'block'   => $block['blockName'],
		);

		return $block_content;
	}

	/**
	 * Render all collected responsive spacing CSS in the footer.
	 */
	public function render_responsive_spacing_css() {
		if ( empty( $this->collected_styles ) ) {
			return;
		}

		$tablet_css = '';
		$mobile_css = '';

		foreach ( $this->collected_styles as $block_style_id => $data ) {
			$spacing = $data['spacing'];
			$selector = '.' . esc_attr( $block_style_id );

			// Generate tablet CSS.
			if ( ! empty( $spacing['tablet'] ) ) {
				$tablet_declarations = $this->build_spacing_declarations( $spacing['tablet'] );
				if ( $tablet_declarations ) {
					$tablet_css .= $selector . " {\n" . $tablet_declarations . "}\n";
				}
			}

			// Generate mobile CSS.
			if ( ! empty( $spacing['mobile'] ) ) {
				$mobile_declarations = $this->build_spacing_declarations( $spacing['mobile'] );
				if ( $mobile_declarations ) {
					$mobile_css .= $selector . " {\n" . $mobile_declarations . "}\n";
				}
			}
		}

		// Only output if there's CSS to render.
		if ( empty( $tablet_css ) && empty( $mobile_css ) ) {
			return;
		}

		$output = '';

		if ( $tablet_css ) {
			$output .= '@media (max-width: ' . self::BREAKPOINT_TABLET . "px) {\n" . $tablet_css . "}\n";
		}

		if ( $mobile_css ) {
			$output .= '@media (max-width: ' . self::BREAKPOINT_MOBILE . "px) {\n" . $mobile_css . "}\n";
		}

		// Apply final output filter.
		$output = apply_filters( 'designsetgo/responsive_spacing_css_output', $output, $this->collected_styles );

		if ( ! empty( $output ) ) {
			echo "\n<!-- DesignSetGo Responsive Spacing -->\n";
			echo '<style id="designsetgo-responsive-spacing">' . "\n";
			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS is sanitized via convert_preset_value.
			echo '</style>' . "\n";
		}
	}

	/**
	 * Build CSS declarations for a device's spacing values.
	 *
	 * @param array $device_spacing Device spacing data with 'padding' and/or 'margin' keys.
	 * @return string CSS declarations string.
	 */
	private function build_spacing_declarations( $device_spacing ) {
		$css = '';

		foreach ( array( 'padding', 'margin' ) as $type ) {
			if ( empty( $device_spacing[ $type ] ) || ! is_array( $device_spacing[ $type ] ) ) {
				continue;
			}

			foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
				if ( ! empty( $device_spacing[ $type ][ $side ] ) ) {
					$value = $this->convert_preset_value( $device_spacing[ $type ][ $side ] );
					if ( $value ) {
						$css .= "\t" . $type . '-' . $side . ': ' . $value . " !important;\n";
					}
				}
			}
		}

		return $css;
	}

	/**
	 * Convert WordPress preset value to CSS variable format.
	 * Handles: "var:preset|spacing|md" -> "var(--wp--preset--spacing--md)"
	 *
	 * @param string $value The spacing value.
	 * @return string|false Sanitized CSS value or false if invalid.
	 */
	private function convert_preset_value( $value ) {
		if ( empty( $value ) || ! is_string( $value ) ) {
			return false;
		}

		// Already a CSS variable (no fallback values allowed for security).
		if ( 0 === strpos( $value, 'var(--' ) ) {
			if ( preg_match( '/^var\(--[a-zA-Z0-9_-]+(?:--[a-zA-Z0-9_-]+)*\)$/', $value ) ) {
				return $value;
			}
			return false;
		}

		// WordPress preset format: var:preset|spacing|md.
		if ( 0 === strpos( $value, 'var:preset|' ) ) {
			$parts = explode( '|', str_replace( 'var:preset|', '', $value ) );
			// Validate parts contain only safe characters.
			foreach ( $parts as $part ) {
				if ( ! preg_match( '/^[a-zA-Z0-9_-]+$/', $part ) ) {
					return false;
				}
			}
			return 'var(--wp--preset--' . implode( '--', $parts ) . ')';
		}

		// Plain CSS value - sanitize for safe CSS values (numbers, units, calc).
		if ( preg_match( '/^[0-9]+(\.[0-9]+)?(px|em|rem|%|vh|vw|ch|ex|cm|mm|in|pt|pc)$/', $value ) ) {
			return $value;
		}

		// Allow calc() expressions with only numbers, units, operators, and whitespace.
		if ( preg_match( '/^calc\([\d\s+\-*\/.()]+(?:px|em|rem|%|vh|vw)?\)$/', $value ) ) {
			return $value;
		}

		return false;
	}
}
