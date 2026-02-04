<?php
/**
 * Insert Image Accordion Ability.
 *
 * Inserts an Image Accordion block for creating expandable
 * image galleries with hover/click interactions.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Inserters;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Inserter;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Insert Image Accordion ability class.
 */
class Insert_Image_Accordion extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-image-accordion';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Image Accordion', 'designsetgo' ),
			'description'         => __( 'Inserts an Image Accordion block where images expand on hover or click. Perfect for showcasing portfolios, team members, or product categories in an interactive way.', 'designsetgo' ),
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
					'attributes'  => array(
						'type'        => 'object',
						'description' => __( 'Image accordion attributes', 'designsetgo' ),
						'properties'  => array(
							'height'             => array(
								'type'        => 'string',
								'description' => __( 'Accordion height (e.g., "400px", "50vh")', 'designsetgo' ),
								'default'     => '400px',
							),
							'expandTrigger'      => array(
								'type'        => 'string',
								'description' => __( 'How items expand', 'designsetgo' ),
								'enum'        => array( 'hover', 'click' ),
								'default'     => 'hover',
							),
							'expandRatio'        => array(
								'type'        => 'number',
								'description' => __( 'How much the active item expands (1.5 = 50% larger)', 'designsetgo' ),
								'default'     => 2,
								'minimum'     => 1.1,
								'maximum'     => 5,
							),
							'gap'                => array(
								'type'        => 'string',
								'description' => __( 'Gap between items', 'designsetgo' ),
								'default'     => '10px',
							),
							'borderRadius'       => array(
								'type'        => 'string',
								'description' => __( 'Border radius for items', 'designsetgo' ),
								'default'     => '8px',
							),
							'transitionDuration' => array(
								'type'        => 'string',
								'description' => __( 'Animation duration (e.g., "0.5s")', 'designsetgo' ),
								'default'     => '0.5s',
							),
							'overlayOpacity'     => array(
								'type'        => 'number',
								'description' => __( 'Overlay opacity for inactive items (0-100)', 'designsetgo' ),
								'default'     => 30,
								'minimum'     => 0,
								'maximum'     => 100,
							),
						),
					),
					'items'       => array(
						'type'        => 'array',
						'description' => __( 'Accordion item definitions', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'imageUrl' => array(
									'type'        => 'string',
									'description' => __( 'Image URL', 'designsetgo' ),
								),
								'imageId'  => array(
									'type'        => 'number',
									'description' => __( 'Image attachment ID', 'designsetgo' ),
								),
								'title'    => array(
									'type'        => 'string',
									'description' => __( 'Item title', 'designsetgo' ),
								),
								'subtitle' => array(
									'type'        => 'string',
									'description' => __( 'Item subtitle', 'designsetgo' ),
								),
								'url'      => array(
									'type'        => 'string',
									'description' => __( 'Link URL', 'designsetgo' ),
								),
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Pre-built accordion item blocks', 'designsetgo' ),
						'items'       => array(
							'type' => 'object',
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
	 * @return bool|WP_Error
	 */
	public function check_permission_callback() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to insert image accordions.', 'designsetgo' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
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
		$attributes   = $input['attributes'] ?? array();
		$items        = $input['items'] ?? array();
		$inner_blocks = $input['innerBlocks'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return new WP_Error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Build inner blocks from items array if provided.
		if ( ! empty( $items ) && empty( $inner_blocks ) ) {
			$inner_blocks = array();
			foreach ( $items as $item ) {
				$item_attrs = array();
				if ( ! empty( $item['imageUrl'] ) ) {
					$item_attrs['imageUrl'] = esc_url_raw( $item['imageUrl'] );
				}
				if ( ! empty( $item['imageId'] ) ) {
					$item_attrs['imageId'] = (int) $item['imageId'];
				}
				if ( ! empty( $item['title'] ) ) {
					$item_attrs['title'] = sanitize_text_field( $item['title'] );
				}
				if ( ! empty( $item['subtitle'] ) ) {
					$item_attrs['subtitle'] = sanitize_text_field( $item['subtitle'] );
				}
				if ( ! empty( $item['url'] ) ) {
					$item_attrs['url'] = esc_url_raw( $item['url'] );
				}
				$inner_blocks[] = array(
					'name'       => 'designsetgo/image-accordion-item',
					'attributes' => $item_attrs,
				);
			}
		}

		// Create default items if none provided.
		if ( empty( $inner_blocks ) ) {
			$inner_blocks = array(
				array(
					'name'       => 'designsetgo/image-accordion-item',
					'attributes' => array( 'uniqueId' => 'image-accordion-item-' . substr( str_replace( '-', '', wp_generate_uuid4() ), 0, 9 ) ),
				),
				array(
					'name'       => 'designsetgo/image-accordion-item',
					'attributes' => array( 'uniqueId' => 'image-accordion-item-' . substr( str_replace( '-', '', wp_generate_uuid4() ), 0, 9 ) ),
				),
				array(
					'name'       => 'designsetgo/image-accordion-item',
					'attributes' => array( 'uniqueId' => 'image-accordion-item-' . substr( str_replace( '-', '', wp_generate_uuid4() ), 0, 9 ) ),
				),
			);
		}

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/image-accordion',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
