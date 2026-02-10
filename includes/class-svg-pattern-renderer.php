<?php
/**
 * SVG Pattern Renderer
 *
 * Generates SVG background patterns server-side via render_block filter.
 * Reads data attributes from saved block HTML and injects the CSS custom
 * property for the SVG data URI, replacing the client-side inline version.
 *
 * @package DesignSetGo
 * @since 2.1.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * SVG Pattern Renderer class.
 */
class SVG_Pattern_Renderer {

	/**
	 * Cached pattern data.
	 *
	 * @var array|null
	 */
	private $patterns = null;

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'render_block', array( $this, 'inject_svg_pattern' ), 10, 2 );
	}

	/**
	 * Lazy-load pattern definitions.
	 *
	 * @return array Pattern data keyed by pattern ID.
	 */
	private function get_patterns() {
		if ( null === $this->patterns ) {
			$this->patterns = designsetgo_get_svg_pattern_data();
		}
		return $this->patterns;
	}

	/**
	 * Validate a CSS color value to prevent SVG attribute injection.
	 *
	 * Mirrors the JS isValidColor() function in patterns.js.
	 *
	 * @param string $color Color value to validate.
	 * @return bool True if the color is safe.
	 */
	private function is_valid_color( $color ) {
		if ( ! is_string( $color ) || '' === $color ) {
			return false;
		}

		$color = trim( $color );

		// Hex: #fff, #ffffff, #ffffffff.
		if ( preg_match( '/^#[0-9A-Fa-f]{3,8}$/', $color ) ) {
			return true;
		}

		// rgb() / rgba().
		if ( preg_match( '/^rgba?\([^)]+\)$/', $color ) ) {
			return true;
		}

		// hsl() / hsla().
		if ( preg_match( '/^hsla?\([^)]+\)$/', $color ) ) {
			return true;
		}

		// Named colors (letters only).
		if ( preg_match( '/^[a-zA-Z]+$/', $color ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Build SVG markup for a pattern definition.
	 *
	 * Mirrors the JS buildPatternSvg() function in patterns.js.
	 *
	 * @param array  $pattern Pattern definition with width, height, paths.
	 * @param string $color   Fill/stroke color.
	 * @param float  $opacity Fill/stroke opacity (0-1).
	 * @return string Complete SVG markup.
	 */
	private function build_pattern_svg( $pattern, $color, $opacity ) {
		$width  = (int) $pattern['width'];
		$height = (int) $pattern['height'];

		// Sanitize color.
		$safe_color = $this->is_valid_color( $color ) ? $color : '#9c92ac';

		// Clamp opacity.
		$safe_opacity = max( 0, min( 1, (float) $opacity ) );
		if ( 0.0 === $safe_opacity ) {
			$safe_opacity = 0.4;
		}

		$path_elements = '';

		foreach ( $pattern['paths'] as $p ) {
			$attrs = 'd="' . $p['d'] . '"';

			if ( ! empty( $p['stroke'] ) ) {
				// Stroke-based path.
				$attrs .= ' fill="none"';
				$attrs .= ' stroke="' . $safe_color . '"';
				$attrs .= ' stroke-opacity="' . $safe_opacity . '"';
				$sw     = isset( $p['strokeWidth'] ) ? max( 0.5, min( 10, (float) $p['strokeWidth'] ) ) : 1;
				$attrs .= ' stroke-width="' . $sw . '"';
				if ( ! empty( $p['strokeLinecap'] ) ) {
					$attrs .= ' stroke-linecap="' . $p['strokeLinecap'] . '"';
				}
			} else {
				// Fill-based path.
				$attrs .= ' fill="' . $safe_color . '"';
				$attrs .= ' fill-opacity="' . $safe_opacity . '"';
				if ( ! empty( $p['fillRule'] ) ) {
					$attrs .= ' fill-rule="' . $p['fillRule'] . '"';
				}
			}

			// Per-path opacity multiplier.
			if ( isset( $p['opacity'] ) && is_numeric( $p['opacity'] ) ) {
				$path_opacity = max( 0, min( 1, (float) $p['opacity'] ) );
				$attrs       .= ' opacity="' . $path_opacity . '"';
			}

			$path_elements .= '<path ' . $attrs . '/>';
		}

		return '<svg xmlns="http://www.w3.org/2000/svg" width="' . $width . '" height="' . $height . '" viewBox="0 0 ' . $width . ' ' . $height . '">' . $path_elements . '</svg>';
	}

	/**
	 * Encode SVG markup as a CSS url() data URI.
	 *
	 * Uses rawurlencode() to match JS encodeURIComponent() behavior.
	 *
	 * @param string $svg Raw SVG markup.
	 * @return string CSS url() value with encoded data URI.
	 */
	private function encode_svg( $svg ) {
		return 'url("data:image/svg+xml,' . rawurlencode( $svg ) . '")';
	}

	/**
	 * Inject SVG pattern CSS custom property into block output.
	 *
	 * Reads data attributes from saved block HTML, generates the SVG
	 * server-side, and injects/replaces the --dsgo-svg-pattern-image
	 * CSS variable in the block's inline style.
	 *
	 * @param string $block_content Rendered block content.
	 * @param array  $block         Block data including attrs.
	 * @return string Modified block content.
	 */
	public function inject_svg_pattern( $block_content, $block ) {
		// Fast bail: skip blocks without SVG pattern data attribute.
		if ( false === strpos( $block_content, 'data-dsgo-svg-pattern' ) ) {
			return $block_content;
		}

		// Skip empty content.
		if ( empty( $block_content ) ) {
			return $block_content;
		}

		$processor = new \WP_HTML_Tag_Processor( $block_content );

		if ( ! $processor->next_tag() ) {
			return $block_content;
		}

		// Read pattern configuration from data attributes.
		$pattern_type = $processor->get_attribute( 'data-dsgo-svg-pattern' );
		if ( empty( $pattern_type ) ) {
			return $block_content;
		}

		// Validate pattern type against known patterns (allowlist).
		$patterns = $this->get_patterns();
		if ( ! isset( $patterns[ $pattern_type ] ) ) {
			return $block_content;
		}

		$color   = $processor->get_attribute( 'data-dsgo-svg-pattern-color' ) ?? '#9c92ac';
		$opacity = (float) ( $processor->get_attribute( 'data-dsgo-svg-pattern-opacity' ) ?? 0.4 );
		$scale   = (float) ( $processor->get_attribute( 'data-dsgo-svg-pattern-scale' ) ?? 1 );

		// Clamp values.
		$opacity = max( 0.05, min( 1, $opacity ) );
		$scale   = max( 0.25, min( 4, $scale ) );

		// Generate SVG.
		$pattern = $patterns[ $pattern_type ];
		$svg     = $this->build_pattern_svg( $pattern, $color, $opacity );
		$bg_url  = $this->encode_svg( $svg );

		// Calculate background size.
		$bg_size = ( $pattern['width'] * $scale ) . 'px ' . ( $pattern['height'] * $scale ) . 'px';

		// Read and modify the style attribute.
		$existing_style = $processor->get_attribute( 'style' ) ?? '';

		// Replace existing --dsgo-svg-pattern-image if present, or append.
		if ( false !== strpos( $existing_style, '--dsgo-svg-pattern-image' ) ) {
			// Replace existing value (handles url(...) with nested parens and quotes).
			$existing_style = preg_replace(
				'/--dsgo-svg-pattern-image\s*:\s*url\([^)]*\)\s*;?/',
				'--dsgo-svg-pattern-image:' . $bg_url . ';',
				$existing_style
			);
		} else {
			// Append the CSS variable.
			$existing_style = rtrim( $existing_style, '; ' );
			if ( '' !== $existing_style ) {
				$existing_style .= ';';
			}
			$existing_style .= '--dsgo-svg-pattern-image:' . $bg_url;
		}

		// Replace existing --dsgo-svg-pattern-size if present, or append.
		if ( false !== strpos( $existing_style, '--dsgo-svg-pattern-size' ) ) {
			$existing_style = preg_replace(
				'/--dsgo-svg-pattern-size\s*:\s*[^;]+;?/',
				'--dsgo-svg-pattern-size:' . $bg_size . ';',
				$existing_style
			);
		} else {
			$existing_style = rtrim( $existing_style, '; ' );
			if ( '' !== $existing_style ) {
				$existing_style .= ';';
			}
			$existing_style .= '--dsgo-svg-pattern-size:' . $bg_size;
		}

		// Handle fixed background from block attributes (not in data attributes).
		$attrs = $block['attrs'] ?? array();
		if ( ! empty( $attrs['dsgoSvgPatternFixed'] ) ) {
			if ( false === strpos( $existing_style, '--dsgo-svg-pattern-attachment' ) ) {
				$existing_style = rtrim( $existing_style, '; ' );
				if ( '' !== $existing_style ) {
					$existing_style .= ';';
				}
				$existing_style .= '--dsgo-svg-pattern-attachment:fixed';
			}
		}

		$processor->set_attribute( 'style', $existing_style );

		return $processor->get_updated_html();
	}
}
