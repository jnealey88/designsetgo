<?php
/**
 * Insert Scroll Marquee Ability.
 *
 * Inserts a Scroll Marquee that displays rows of images scrolling horizontally
 * in alternating directions based on page scroll.
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
 * Insert Scroll Marquee ability class.
 */
class Insert_Scroll_Marquee extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-scroll-marquee';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Scroll Marquee', 'designsetgo' ),
			'description'         => __( 'Inserts a Scroll Marquee that displays rows of images scrolling horizontally in alternating directions based on page scroll. Perfect for image galleries and brand showcases.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating scroll marquee...', 'designsetgo' ),
			'success_message'     => __( 'Scroll marquee inserted successfully.', 'designsetgo' ),
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
					'attributes' => array(
						'type'        => 'object',
						'description' => __( 'Scroll Marquee attributes', 'designsetgo' ),
						'properties'  => array(
							'rows'         => array(
								'type'        => 'array',
								'description' => __( 'Rows of images with directions', 'designsetgo' ),
								'items'       => array(
									'type'       => 'object',
									'properties' => array(
										'images'    => array(
											'type'        => 'array',
											'description' => __( 'Images for this row', 'designsetgo' ),
											'items'       => array(
												'type'     => 'object',
												'properties' => array(
													'url' => array(
														'type'        => 'string',
														'description' => __( 'Image URL', 'designsetgo' ),
													),
													'alt' => array(
														'type'        => 'string',
														'description' => __( 'Image alt text', 'designsetgo' ),
													),
													'id'  => array(
														'type'        => 'number',
														'description' => __( 'WordPress media ID (optional)', 'designsetgo' ),
													),
												),
												'required' => array( 'url' ),
											),
										),
										'direction' => array(
											'type'        => 'string',
											'description' => __( 'Scroll direction for this row', 'designsetgo' ),
											'enum'        => array( 'left', 'right' ),
											'default'     => 'left',
										),
									),
									'required'   => array( 'images', 'direction' ),
								),
								'default'     => array(
									array(
										'images'    => array(),
										'direction' => 'left',
									),
								),
							),
							'scrollSpeed'  => array(
								'type'        => 'number',
								'description' => __( 'Scroll speed multiplier', 'designsetgo' ),
								'default'     => 0.5,
								'minimum'     => 0.1,
								'maximum'     => 5,
							),
							'imageHeight'  => array(
								'type'        => 'string',
								'description' => __( 'Image height (e.g., "200px")', 'designsetgo' ),
								'default'     => '200px',
							),
							'imageWidth'   => array(
								'type'        => 'string',
								'description' => __( 'Image width (e.g., "300px")', 'designsetgo' ),
								'default'     => '300px',
							),
							'gap'          => array(
								'type'        => 'string',
								'description' => __( 'Gap between images (e.g., "20px")', 'designsetgo' ),
								'default'     => '20px',
							),
							'rowGap'       => array(
								'type'        => 'string',
								'description' => __( 'Gap between rows (e.g., "20px")', 'designsetgo' ),
								'default'     => '20px',
							),
							'borderRadius' => array(
								'type'        => 'string',
								'description' => __( 'Image border radius (e.g., "8px")', 'designsetgo' ),
								'default'     => '8px',
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
		$post_id    = (int) ( $input['post_id'] ?? 0 );
		$position   = (int) ( $input['position'] ?? -1 );
		$attributes = $input['attributes'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Scroll marquee has no inner blocks (images are stored in attributes).
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/scroll-marquee',
			$attributes,
			array(), // No inner blocks
			$position
		);
	}
}
