<?php
/**
 * Block Inserter helper for DesignSetGo abilities.
 *
 * Provides common functionality for inserting blocks into posts,
 * including validation, positioning, and inner blocks handling.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities;

use WP_Error;
use WP_Post;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Inserter helper class.
 */
class Block_Inserter {

	/**
	 * Insert a block into a post at the specified position.
	 *
	 * @param int $post_id Post ID.
	 * @param string $block_name Block name (e.g., 'designsetgo/flex').
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param array<int, array<string, mixed>> $inner_blocks Inner blocks.
	 * @param int $position Position to insert (-1 for append, 0 for prepend, or specific index).
	 * @return array<string, mixed>|WP_Error Success data or error.
	 */
	public static function insert_block( int $post_id, string $block_name, array $attributes = array(), array $inner_blocks = array(), int $position = -1 ) {
		// Validate post.
		$post = get_post( $post_id );
		if ( ! $post ) {
			return new WP_Error(
				'invalid_post',
				__( 'Post not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		// Check permissions.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return new WP_Error(
				'permission_denied',
				__( 'You do not have permission to edit this post.', 'designsetgo' ),
				array( 'status' => 403 )
			);
		}

		// Build block markup.
		$block_markup = self::build_block_markup( $block_name, $attributes, $inner_blocks );

		// Parse existing blocks.
		$blocks = parse_blocks( $post->post_content );

		// Parse new block.
		$new_block = parse_blocks( $block_markup )[0];

		// Insert at position.
		if ( -1 === $position ) {
			// Append to end.
			$blocks[] = $new_block;
		} elseif ( 0 === $position ) {
			// Prepend to beginning.
			array_unshift( $blocks, $new_block );
		} else {
			// Insert at specific index.
			array_splice( $blocks, $position, 0, array( $new_block ) );
		}

		// Serialize blocks back to content.
		$content = serialize_blocks( $blocks );

		// Update post.
		$updated = wp_update_post(
			array(
				'ID'           => $post->ID,
				'post_content' => $content,
			),
			true
		);

		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		return array(
			'success'  => true,
			'post_id'  => $post->ID,
			'block_id' => wp_unique_id( 'block-' ),
			'position' => $position,
			'note'     => 'Blocks inserted successfully. Open the post in the WordPress editor to validate and save the blocks.',
		);
	}

	/**
	 * Build block markup from block name, attributes, and inner blocks.
	 *
	 * @param string $block_name Block name.
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param array<int, array<string, mixed>> $inner_blocks Inner blocks.
	 * @return string Block markup.
	 */
	public static function build_block_markup( string $block_name, array $attributes = array(), array $inner_blocks = array() ): string {
		// Convert simplified block structure to WordPress block array format.
		$block = self::convert_to_block_array( $block_name, $attributes, $inner_blocks );

		// Use WordPress's native serialize_block function.
		return serialize_block( $block );
	}

	/**
	 * Convert simplified block structure to WordPress block array format.
	 *
	 * Handles extraction of innerHTML from 'content' attribute for core blocks.
	 *
	 * @param string $block_name Block name.
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param array<int, array<string, mixed>> $inner_blocks Inner blocks.
	 * @return array<string, mixed> WordPress block array.
	 */
	private static function convert_to_block_array( string $block_name, array $attributes = array(), array $inner_blocks = array() ): array {
		$innerHTML     = '';
		$innerContent  = array();
		$parsed_inners = array();

		// Extract content attribute as innerHTML for core blocks.
		$attrs = $attributes;
		if ( isset( $attrs['content'] ) && 0 === strpos( $block_name, 'core/' ) ) {
			$content = $attrs['content'];
			unset( $attrs['content'] );

			// Generate innerHTML based on block type.
			$innerHTML = self::generate_core_block_html( $block_name, $content, $attrs );
			$innerContent[] = $innerHTML;
		}

		// Process inner blocks recursively.
		if ( ! empty( $inner_blocks ) ) {
			foreach ( $inner_blocks as $inner ) {
				$inner_name       = $inner['name'] ?? '';
				$inner_attributes = $inner['attributes'] ?? array();
				$inner_inner      = $inner['innerBlocks'] ?? array();

				if ( $inner_name ) {
					$parsed_inners[] = self::convert_to_block_array( $inner_name, $inner_attributes, $inner_inner );
					$innerContent[] = null; // Placeholder for inner block.
				}
			}
		}

		// Generate wrapper HTML for DesignSetGo blocks with inner blocks.
		// Skip dynamic blocks (those with render callbacks) - they'll be rendered server-side.
		if ( 0 === strpos( $block_name, 'designsetgo/' ) && ! empty( $inner_blocks ) && ! self::is_dynamic_block( $block_name ) ) {
			$wrapper_html = self::generate_designsetgo_wrapper_html( $block_name, $attributes );
			if ( ! empty( $wrapper_html ) ) {
				// Add opening wrapper before inner blocks.
				array_unshift( $innerContent, $wrapper_html['opening'] );
				// Add closing wrapper after inner blocks.
				$innerContent[] = $wrapper_html['closing'];
				// Set innerHTML to complete wrapper.
				$innerHTML = $wrapper_html['opening'] . $wrapper_html['closing'];
			}
		}

		return array(
			'blockName'    => $block_name,
			'attrs'        => $attrs,
			'innerBlocks'  => $parsed_inners,
			'innerHTML'    => $innerHTML,
			'innerContent' => ! empty( $innerContent ) ? $innerContent : array( $innerHTML ),
		);
	}

	/**
	 * Generate wrapper HTML for DesignSetGo blocks.
	 *
	 * Creates opening and closing HTML that approximates the block's save output.
	 *
	 * @param string $block_name Block name.
	 * @param array<string, mixed> $attributes Block attributes.
	 * @return array<string, string>|null Array with 'opening' and 'closing' keys, or null if not supported.
	 */
	private static function generate_designsetgo_wrapper_html( string $block_name, array $attributes ): ?array {
		$block_slug = str_replace( 'designsetgo/', '', $block_name );
		$block_class = 'wp-block-designsetgo-' . $block_slug . ' dsg-' . $block_slug;

		switch ( $block_name ) {
			case 'designsetgo/stack':
				$align_items = isset( $attributes['alignItems'] ) ? $attributes['alignItems'] : 'flex-start';
				$constrain_width = isset( $attributes['constrainWidth'] ) ? $attributes['constrainWidth'] : false;
				$content_width = isset( $attributes['contentWidth'] ) ? $attributes['contentWidth'] : '1200px';

				// Outer div styles (must match save.js).
				$outer_style = 'width:100%;align-self:stretch';

				// Inner div styles (must match save.js).
				$inner_style = 'display:flex;flex-direction:column;align-items:' . esc_attr( $align_items );
				if ( $constrain_width ) {
					$inner_style .= ';max-width:' . esc_attr( $content_width ) . ';margin-left:auto;margin-right:auto';
				}

				return array(
					'opening' => '<div class="' . esc_attr( $block_class ) . '" style="' . esc_attr( $outer_style ) . '"><div class="dsg-stack__inner" style="' . esc_attr( $inner_style ) . '">',
					'closing' => '</div></div>',
				);

			case 'designsetgo/flex':
				$direction = isset( $attributes['direction'] ) ? $attributes['direction'] : 'row';
				$justify = isset( $attributes['justifyContent'] ) ? $attributes['justifyContent'] : 'flex-start';
				$align = isset( $attributes['alignItems'] ) ? $attributes['alignItems'] : 'center';
				$wrap = isset( $attributes['wrap'] ) ? $attributes['wrap'] : true;
				$constrain_width = isset( $attributes['constrainWidth'] ) ? $attributes['constrainWidth'] : false;
				$content_width = isset( $attributes['contentWidth'] ) ? $attributes['contentWidth'] : '1200px';

				// Outer div styles.
				$outer_style = 'width:100%;align-self:stretch';

				// Inner div styles (must match save.js).
				$inner_style = 'display:flex;flex-direction:' . esc_attr( $direction ) . ';flex-wrap:' . ( $wrap ? 'wrap' : 'nowrap' ) . ';justify-content:' . esc_attr( $justify ) . ';align-items:' . esc_attr( $align );
				if ( $constrain_width ) {
					$inner_style .= ';max-width:' . esc_attr( $content_width ) . ';margin-left:auto;margin-right:auto';
				}

				return array(
					'opening' => '<div class="' . esc_attr( $block_class ) . '" style="' . esc_attr( $outer_style ) . '"><div class="dsg-flex__inner" style="' . esc_attr( $inner_style ) . '">',
					'closing' => '</div></div>',
				);

			case 'designsetgo/grid':
				$desktop_cols = isset( $attributes['desktopColumns'] ) ? $attributes['desktopColumns'] : 3;
				$align = isset( $attributes['alignItems'] ) ? $attributes['alignItems'] : 'start';
				$constrain_width = isset( $attributes['constrainWidth'] ) ? $attributes['constrainWidth'] : false;
				$content_width = isset( $attributes['contentWidth'] ) ? $attributes['contentWidth'] : '1200px';

				// Outer div styles.
				$outer_style = 'width:100%;align-self:stretch';

				// Inner div styles (must match save.js).
				$inner_style = 'display:grid;grid-template-columns:repeat(' . intval( $desktop_cols ) . ', 1fr);align-items:' . esc_attr( $align );
				if ( $constrain_width ) {
					$inner_style .= ';max-width:' . esc_attr( $content_width ) . ';margin-left:auto;margin-right:auto';
				}

				return array(
					'opening' => '<div class="' . esc_attr( $block_class ) . '" style="' . esc_attr( $outer_style ) . '"><div class="dsg-grid__inner" style="' . esc_attr( $inner_style ) . '">',
					'closing' => '</div></div>',
				);

			case 'designsetgo/counter-group':
				return array(
					'opening' => '<div class="' . esc_attr( $block_class ) . '"><div class="dsg-counter-group__inner">',
					'closing' => '</div></div>',
				);

			case 'designsetgo/accordion':
				return array(
					'opening' => '<div class="' . esc_attr( $block_class ) . '"><div class="dsg-accordion__items">',
					'closing' => '</div></div>',
				);

			case 'designsetgo/tabs':
				$unique_id = isset( $attributes['uniqueId'] ) ? $attributes['uniqueId'] : wp_unique_id( 'tabs-' );
				$orientation = isset( $attributes['orientation'] ) ? $attributes['orientation'] : 'horizontal';
				$tab_style = isset( $attributes['tabStyle'] ) ? $attributes['tabStyle'] : 'default';
				$classes = $block_class . ' dsg-tabs-' . $unique_id . ' dsg-tabs--' . $orientation . ' dsg-tabs--' . $tab_style;
				return array(
					'opening' => '<div class="' . esc_attr( $classes ) . '"><div class="dsg-tabs__nav"></div><div class="dsg-tabs__panels">',
					'closing' => '</div></div>',
				);

			default:
				return null;
		}
	}

	/**
	 * Generate HTML for core WordPress blocks.
	 *
	 * @param string $block_name Block name.
	 * @param string $content Content text.
	 * @param array<string, mixed> $attributes Block attributes.
	 * @return string Generated HTML.
	 */
	private static function generate_core_block_html( string $block_name, string $content, array $attributes ): string {
		$text_align = isset( $attributes['textAlign'] ) ? ' has-text-align-' . $attributes['textAlign'] : '';
		$align      = isset( $attributes['align'] ) ? ' has-text-align-' . $attributes['align'] : '';

		switch ( $block_name ) {
			case 'core/heading':
				$level = isset( $attributes['level'] ) ? (int) $attributes['level'] : 2;
				$class = 'wp-block-heading' . $text_align;
				return '<h' . $level . ' class="' . trim( $class ) . '">' . wp_kses_post( $content ) . '</h' . $level . '>';

			case 'core/paragraph':
				$class = trim( $align );
				$class_attr = $class ? ' class="' . $class . '"' : '';
				return '<p' . $class_attr . '>' . wp_kses_post( $content ) . '</p>';

			default:
				return wp_kses_post( $content );
		}
	}

	/**
	 * Check if a block is dynamic (has a render callback).
	 *
	 * Dynamic blocks are rendered server-side via PHP and should not have
	 * wrapper HTML generated during insertion.
	 *
	 * @param string $block_name Block name (e.g., 'designsetgo/stack').
	 * @return bool True if block has a render callback, false otherwise.
	 */
	private static function is_dynamic_block( string $block_name ): bool {
		$registry = \WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( $block_name );

		if ( ! $block_type ) {
			return false;
		}

		// Check if block has a render callback.
		return ! empty( $block_type->render_callback );
	}

	/**
	 * Sanitize block attributes recursively.
	 *
	 * @param array<string, mixed> $attributes Attributes to sanitize.
	 * @return array<string, mixed> Sanitized attributes.
	 */
	public static function sanitize_attributes( array $attributes ): array {
		$sanitized = array();

		foreach ( $attributes as $key => $value ) {
			if ( is_string( $value ) ) {
				$sanitized[ $key ] = sanitize_text_field( $value );
			} elseif ( is_array( $value ) ) {
				$sanitized[ $key ] = self::sanitize_attributes( $value );
			} elseif ( is_bool( $value ) || is_int( $value ) || is_float( $value ) || is_null( $value ) ) {
				$sanitized[ $key ] = $value;
			}
		}

		return $sanitized;
	}

	/**
	 * Validate inner blocks structure.
	 *
	 * @param array<int, array<string, mixed>> $inner_blocks Inner blocks array.
	 * @return bool|WP_Error True if valid, WP_Error otherwise.
	 */
	public static function validate_inner_blocks( array $inner_blocks ) {
		foreach ( $inner_blocks as $index => $block ) {
			if ( ! isset( $block['name'] ) || ! is_string( $block['name'] ) ) {
				return new WP_Error(
					'invalid_inner_block',
					sprintf(
						/* translators: %d: Block index */
						__( 'Inner block at index %d is missing a valid name.', 'designsetgo' ),
						$index
					)
				);
			}

			if ( isset( $block['attributes'] ) && ! is_array( $block['attributes'] ) ) {
				return new WP_Error(
					'invalid_inner_block_attributes',
					sprintf(
						/* translators: %d: Block index */
						__( 'Inner block at index %d has invalid attributes (must be an array).', 'designsetgo' ),
						$index
					)
				);
			}

			if ( isset( $block['innerBlocks'] ) && ! is_array( $block['innerBlocks'] ) ) {
				return new WP_Error(
					'invalid_nested_blocks',
					sprintf(
						/* translators: %d: Block index */
						__( 'Inner block at index %d has invalid innerBlocks (must be an array).', 'designsetgo' ),
						$index
					)
				);
			}

			// Recursively validate nested inner blocks.
			if ( isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$nested_validation = self::validate_inner_blocks( $block['innerBlocks'] );
				if ( is_wp_error( $nested_validation ) ) {
					return $nested_validation;
				}
			}
		}

		return true;
	}

	/**
	 * Get default common input schema properties.
	 *
	 * @return array<string, mixed> Common schema properties.
	 */
	public static function get_common_input_schema(): array {
		return array(
			'post_id'  => array(
				'type'        => 'integer',
				'description' => __( 'Target post ID', 'designsetgo' ),
				'required'    => true,
			),
			'position' => array(
				'type'        => 'integer',
				'description' => __( 'Block position (0 = prepend, -1 = append, or specific index)', 'designsetgo' ),
				'default'     => -1,
			),
		);
	}

	/**
	 * Get default output schema.
	 *
	 * @return array<string, mixed> Output schema.
	 */
	public static function get_default_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'success'  => array(
					'type'        => 'boolean',
					'description' => __( 'Whether the operation was successful', 'designsetgo' ),
				),
				'post_id'  => array(
					'type'        => 'integer',
					'description' => __( 'Post ID where block was inserted', 'designsetgo' ),
				),
				'block_id' => array(
					'type'        => 'string',
					'description' => __( 'Unique block identifier', 'designsetgo' ),
				),
				'position' => array(
					'type'        => 'integer',
					'description' => __( 'Position where block was inserted', 'designsetgo' ),
				),
			),
			'required'   => array( 'success' ),
		);
	}
}
