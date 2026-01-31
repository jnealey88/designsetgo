<?php
/**
 * Revision Renderer Class
 *
 * Handles rendering revision content as HTML for visual comparison.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

namespace DesignSetGo\Admin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Revision_Renderer Class
 *
 * Renders revision block content as HTML with styling for previews.
 */
class Revision_Renderer {

	/**
	 * Performance warning threshold (number of blocks)
	 */
	const BLOCK_WARNING_THRESHOLD = 100;

	/**
	 * Render a revision's content as HTML
	 *
	 * @param int $revision_id The revision or post ID.
	 * @return array|\WP_Error Rendered content data or error.
	 */
	public function render( $revision_id ) {
		$post = get_post( $revision_id );

		if ( ! $post ) {
			return new \WP_Error(
				'revision_not_found',
				__( 'Revision not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		$content = $post->post_content;

		// Parse and render blocks.
		$blocks        = parse_blocks( $content );
		$rendered_html = '';
		$block_count   = 0;

		foreach ( $blocks as $index => $block ) {
			// Skip empty blocks.
			if ( empty( $block['blockName'] ) ) {
				continue;
			}

			$block_count++;

			// Render block and add index attribute for diff highlighting.
			$rendered_block = render_block( $block );
			$rendered_block = $this->add_block_index_attribute( $rendered_block, $index );

			$rendered_html .= $rendered_block;
		}

		// Get theme stylesheet URL for preview.
		$theme_styles = $this->get_theme_styles();

		$response = array(
			'revision_id'  => $revision_id,
			'html'         => $rendered_html,
			'styles'       => $theme_styles,
			'blocks_count' => $block_count,
		);

		// Add performance warning for posts with many blocks.
		if ( $block_count > self::BLOCK_WARNING_THRESHOLD ) {
			$response['performance_warning'] = sprintf(
				/* translators: %d: number of blocks */
				__( 'This revision contains %d blocks. Comparison may be slow.', 'designsetgo' ),
				$block_count
			);
		}

		return $response;
	}

	/**
	 * Add block index data attribute to rendered HTML
	 *
	 * @param string $html  Rendered block HTML.
	 * @param int    $index Block index.
	 * @return string Modified HTML.
	 */
	private function add_block_index_attribute( $html, $index ) {
		// Find the first HTML tag and add the data attribute.
		$pattern     = '/^(\s*<[a-zA-Z][a-zA-Z0-9]*)/';
		$replacement = '$1 data-dsgo-block-index="' . esc_attr( (string) $index ) . '"';

		return preg_replace( $pattern, $replacement, $html, 1 );
	}

	/**
	 * Get theme stylesheet URLs
	 *
	 * @return array Theme style URLs.
	 */
	private function get_theme_styles() {
		$styles = array();

		// Add theme stylesheet.
		$styles[] = get_stylesheet_uri();

		// Add block library styles.
		$styles[] = includes_url( 'css/dist/block-library/style.min.css' );

		// Add DesignSetGo styles.
		$styles[] = DESIGNSETGO_URL . 'build/style-index.css';

		return array_filter( $styles );
	}
}
