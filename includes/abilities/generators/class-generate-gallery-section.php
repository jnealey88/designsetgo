<?php
/**
 * Generate Gallery Section Ability.
 *
 * Generates an image gallery section with various layout
 * options including grid, masonry, and slider.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Generators;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Inserter;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Generate Gallery Section ability class.
 */
class Generate_Gallery_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/generate-gallery-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Generate Gallery Section', 'designsetgo' ),
			'description'         => __( 'Generates an image gallery section with various layout options. Supports grid, masonry, and slider layouts with lightbox functionality.', 'designsetgo' ),
			'thinking_message'    => __( 'Generating gallery section...', 'designsetgo' ),
			'success_message'     => __( 'Gallery section generated successfully.', 'designsetgo' ),
			'category'            => 'blocks',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => Block_Inserter::get_default_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
		);
	}

	/**
	 * Get input schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_input_schema(): array {
		$common = Block_Inserter::get_common_input_schema();

		return array(
			'type'                 => 'object',
			'properties'           => array_merge(
				$common,
				array(
					'heading'       => array(
						'type'        => 'string',
						'description' => __( 'Section heading text', 'designsetgo' ),
						'default'     => 'Our Gallery',
					),
					'description'   => array(
						'type'        => 'string',
						'description' => __( 'Section description text', 'designsetgo' ),
						'default'     => '',
					),
					'layout'        => array(
						'type'        => 'string',
						'description' => __( 'Gallery layout style', 'designsetgo' ),
						'enum'        => array( 'grid', 'masonry', 'slider', 'image-accordion' ),
						'default'     => 'grid',
					),
					'columns'       => array(
						'type'        => 'number',
						'description' => __( 'Number of columns (2-6)', 'designsetgo' ),
						'default'     => 3,
						'minimum'     => 2,
						'maximum'     => 6,
					),
					'gap'           => array(
						'type'        => 'string',
						'description' => __( 'Gap between images', 'designsetgo' ),
						'default'     => '10px',
					),
					'aspectRatio'   => array(
						'type'        => 'string',
						'description' => __( 'Image aspect ratio for grid', 'designsetgo' ),
						'enum'        => array( '1-1', '4-3', '16-9', 'original' ),
						'default'     => '1-1',
					),
					'lightbox'      => array(
						'type'        => 'boolean',
						'description' => __( 'Enable lightbox on click', 'designsetgo' ),
						'default'     => true,
					),
					'images'        => array(
						'type'        => 'array',
						'description' => __( 'Gallery image definitions', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'url'     => array(
									'type'        => 'string',
									'description' => __( 'Image URL', 'designsetgo' ),
								),
								'id'      => array(
									'type'        => 'number',
									'description' => __( 'Image attachment ID', 'designsetgo' ),
								),
								'alt'     => array(
									'type'        => 'string',
									'description' => __( 'Image alt text', 'designsetgo' ),
								),
								'caption' => array(
									'type'        => 'string',
									'description' => __( 'Image caption', 'designsetgo' ),
								),
							),
						),
					),
				)
			),
			'additionalProperties' => false,
		);
	}

	/**
	 * Permission callback.
	 *
	 * @return bool
	 */
	public function check_permission_callback(): bool {
		return $this->check_permission( 'edit_posts' );
	}

	/**
	 * Execute the ability.
	 *
	 * @param array<string, mixed> $input Input parameters.
	 * @return array<string, mixed>|WP_Error
	 */
	public function execute( array $input ) {
		$post_id      = (int) ( $input['post_id'] ?? 0 );
		$position     = (int) ( $input['position'] ?? -1 );
		$heading      = sanitize_text_field( $input['heading'] ?? 'Our Gallery' );
		$description  = sanitize_textarea_field( $input['description'] ?? '' );
		$layout       = $input['layout'] ?? 'grid';
		$columns      = (int) ( $input['columns'] ?? 3 );
		$gap          = sanitize_text_field( $input['gap'] ?? '10px' );
		$aspect_ratio = $input['aspectRatio'] ?? '1-1';
		$lightbox     = (bool) ( $input['lightbox'] ?? true );
		$images       = $input['images'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Build section content.
		$inner_blocks = array();

		// Header.
		if ( ! empty( $heading ) ) {
			$inner_blocks[] = array(
				'name'       => 'core/heading',
				'attributes' => array(
					'level'     => 2,
					'content'   => $heading,
					'textAlign' => 'center',
				),
			);
		}

		if ( ! empty( $description ) ) {
			$inner_blocks[] = array(
				'name'       => 'core/paragraph',
				'attributes' => array(
					'content' => $description,
					'align'   => 'center',
				),
			);
		}

		// Build gallery based on layout.
		if ( 'slider' === $layout ) {
			// Slider gallery.
			$slides = array();
			foreach ( $images as $image ) {
				$img_attrs = array(
					'sizeSlug' => 'large',
				);
				if ( ! empty( $image['id'] ) ) {
					$img_attrs['id'] = (int) $image['id'];
				}
				if ( ! empty( $image['url'] ) ) {
					$img_attrs['url'] = esc_url( $image['url'] );
				}
				if ( ! empty( $image['alt'] ) ) {
					$img_attrs['alt'] = sanitize_text_field( $image['alt'] );
				}
				if ( ! empty( $image['caption'] ) ) {
					$img_attrs['caption'] = sanitize_text_field( $image['caption'] );
				}
				if ( $lightbox ) {
					$img_attrs['lightbox'] = array( 'enabled' => true );
				}

				$slides[] = array(
					'name'        => 'designsetgo/slide',
					'attributes'  => array(),
					'innerBlocks' => array(
						array(
							'name'       => 'core/image',
							'attributes' => $img_attrs,
						),
					),
				);
			}

			$inner_blocks[] = array(
				'name'        => 'designsetgo/slider',
				'attributes'  => array(
					'slidesPerView' => min( $columns, 3 ),
					'showArrows'    => true,
					'showDots'      => true,
					'loop'          => true,
					'gap'           => $gap,
				),
				'innerBlocks' => $slides,
			);
		} elseif ( 'image-accordion' === $layout ) {
			// Image accordion gallery.
			$accordion_items = array();
			foreach ( $images as $image ) {
				$item_attrs = array();
				if ( ! empty( $image['id'] ) ) {
					$item_attrs['imageId'] = (int) $image['id'];
				}
				if ( ! empty( $image['url'] ) ) {
					$item_attrs['imageUrl'] = esc_url( $image['url'] );
				}
				if ( ! empty( $image['alt'] ) ) {
					$item_attrs['title'] = sanitize_text_field( $image['alt'] );
				}
				if ( ! empty( $image['caption'] ) ) {
					$item_attrs['subtitle'] = sanitize_text_field( $image['caption'] );
				}

				$accordion_items[] = array(
					'name'       => 'designsetgo/image-accordion-item',
					'attributes' => $item_attrs,
				);
			}

			$inner_blocks[] = array(
				'name'        => 'designsetgo/image-accordion',
				'attributes'  => array(
					'height' => '400px',
					'gap'    => $gap,
				),
				'innerBlocks' => $accordion_items,
			);
		} else {
			// Grid layout (default).
			$gallery_images = array();
			foreach ( $images as $image ) {
				$img_attrs = array(
					'sizeSlug' => 'large',
				);
				if ( ! empty( $image['id'] ) ) {
					$img_attrs['id'] = (int) $image['id'];
				}
				if ( ! empty( $image['url'] ) ) {
					$img_attrs['url'] = esc_url( $image['url'] );
				}
				if ( ! empty( $image['alt'] ) ) {
					$img_attrs['alt'] = sanitize_text_field( $image['alt'] );
				}
				if ( ! empty( $image['caption'] ) ) {
					$img_attrs['caption'] = sanitize_text_field( $image['caption'] );
				}
				if ( $lightbox ) {
					$img_attrs['lightbox'] = array( 'enabled' => true );
				}

				// Wrap each image in a stack for grid item.
				$gallery_images[] = array(
					'name'        => 'designsetgo/stack',
					'attributes'  => array(),
					'innerBlocks' => array(
						array(
							'name'       => 'core/image',
							'attributes' => $img_attrs,
						),
					),
				);
			}

			$inner_blocks[] = array(
				'name'        => 'designsetgo/grid',
				'attributes'  => array(
					'columnsDesktop' => min( $columns, 6 ),
					'columnsTablet'  => min( $columns, 3 ),
					'columnsMobile'  => 2,
					'gap'            => $gap,
				),
				'innerBlocks' => $gallery_images,
			);
		}

		// Create section container.
		$section_attributes = array(
			'constrainWidth' => true,
		);

		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/section',
			$section_attributes,
			$inner_blocks,
			$position
		);
	}
}
