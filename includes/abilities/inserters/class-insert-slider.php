<?php
/**
 * Insert Slider Ability.
 *
 * Inserts a Slider block for creating hero carousels, image galleries,
 * and content slideshows with multiple transition effects.
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
 * Insert Slider ability class.
 */
class Insert_Slider extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-slider';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Slider', 'designsetgo' ),
			'description'         => __( 'Inserts a modern, performant Slider block for hero carousels, image galleries, and content slideshows. Supports multiple transition effects, auto-play, and full block support inside slides.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating slider...', 'designsetgo' ),
			'success_message'     => __( 'Slider inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Slider attributes', 'designsetgo' ),
						'properties'  => array(
							// Slides per view.
							'slidesPerView'       => array(
								'type'        => 'number',
								'description' => __( 'Slides visible on desktop', 'designsetgo' ),
								'default'     => 1,
								'minimum'     => 1,
								'maximum'     => 6,
							),
							'slidesPerViewTablet' => array(
								'type'        => 'number',
								'description' => __( 'Slides visible on tablet', 'designsetgo' ),
								'default'     => 1,
								'minimum'     => 1,
								'maximum'     => 4,
							),
							'slidesPerViewMobile' => array(
								'type'        => 'number',
								'description' => __( 'Slides visible on mobile', 'designsetgo' ),
								'default'     => 1,
								'minimum'     => 1,
								'maximum'     => 2,
							),
							// Dimensions.
							'height'              => array(
								'type'        => 'string',
								'description' => __( 'Slider height (e.g., "500px", "60vh")', 'designsetgo' ),
								'default'     => '500px',
							),
							'aspectRatio'         => array(
								'type'        => 'string',
								'description' => __( 'Aspect ratio (e.g., "16/9", "4/3", "1/1")', 'designsetgo' ),
								'default'     => '16/9',
							),
							'useAspectRatio'      => array(
								'type'        => 'boolean',
								'description' => __( 'Use aspect ratio instead of fixed height', 'designsetgo' ),
								'default'     => false,
							),
							'gap'                 => array(
								'type'        => 'string',
								'description' => __( 'Gap between slides (e.g., "20px")', 'designsetgo' ),
								'default'     => '20px',
							),
							// Navigation.
							'showArrows'          => array(
								'type'        => 'boolean',
								'description' => __( 'Show navigation arrows', 'designsetgo' ),
								'default'     => true,
							),
							'showDots'            => array(
								'type'        => 'boolean',
								'description' => __( 'Show pagination dots', 'designsetgo' ),
								'default'     => true,
							),
							'arrowStyle'          => array(
								'type'        => 'string',
								'description' => __( 'Arrow button style', 'designsetgo' ),
								'enum'        => array( 'default', 'circle', 'square', 'minimal' ),
								'default'     => 'default',
							),
							'arrowPosition'       => array(
								'type'        => 'string',
								'description' => __( 'Arrow position', 'designsetgo' ),
								'enum'        => array( 'sides', 'bottom', 'top-right' ),
								'default'     => 'sides',
							),
							'dotStyle'            => array(
								'type'        => 'string',
								'description' => __( 'Pagination dot style', 'designsetgo' ),
								'enum'        => array( 'default', 'line', 'number' ),
								'default'     => 'default',
							),
							'dotPosition'         => array(
								'type'        => 'string',
								'description' => __( 'Dot position', 'designsetgo' ),
								'enum'        => array( 'bottom', 'top', 'sides' ),
								'default'     => 'bottom',
							),
							// Effects.
							'effect'              => array(
								'type'        => 'string',
								'description' => __( 'Transition effect', 'designsetgo' ),
								'enum'        => array( 'slide', 'fade', 'flip', 'cube', 'coverflow' ),
								'default'     => 'slide',
							),
							'transitionDuration'  => array(
								'type'        => 'string',
								'description' => __( 'Transition duration (e.g., "0.5s")', 'designsetgo' ),
								'default'     => '0.5s',
							),
							'transitionEasing'    => array(
								'type'        => 'string',
								'description' => __( 'Transition easing function', 'designsetgo' ),
								'enum'        => array( 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear' ),
								'default'     => 'ease-in-out',
							),
							// Autoplay.
							'autoplay'            => array(
								'type'        => 'boolean',
								'description' => __( 'Enable auto-play', 'designsetgo' ),
								'default'     => false,
							),
							'autoplayInterval'    => array(
								'type'        => 'number',
								'description' => __( 'Auto-play interval in milliseconds', 'designsetgo' ),
								'default'     => 3000,
								'minimum'     => 1000,
								'maximum'     => 10000,
							),
							'pauseOnHover'        => array(
								'type'        => 'boolean',
								'description' => __( 'Pause auto-play on hover', 'designsetgo' ),
								'default'     => true,
							),
							// Behavior.
							'loop'                => array(
								'type'        => 'boolean',
								'description' => __( 'Enable infinite loop', 'designsetgo' ),
								'default'     => true,
							),
							'draggable'           => array(
								'type'        => 'boolean',
								'description' => __( 'Enable drag navigation', 'designsetgo' ),
								'default'     => true,
							),
							'centeredSlides'      => array(
								'type'        => 'boolean',
								'description' => __( 'Center active slide', 'designsetgo' ),
								'default'     => false,
							),
						),
					),
					'slides'      => array(
						'type'        => 'array',
						'description' => __( 'Slide content definitions', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'backgroundImage' => array(
									'type'        => 'string',
									'description' => __( 'Background image URL', 'designsetgo' ),
								),
								'innerBlocks'     => array(
									'type'        => 'array',
									'description' => __( 'Content blocks inside the slide', 'designsetgo' ),
								),
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Pre-built slide blocks (alternative to slides array)', 'designsetgo' ),
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
		$attributes   = $input['attributes'] ?? array();
		$slides       = $input['slides'] ?? array();
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

		// Build inner blocks from slides array if provided and innerBlocks not set.
		if ( ! empty( $slides ) && empty( $inner_blocks ) ) {
			$inner_blocks = array();
			foreach ( $slides as $slide ) {
				$slide_attrs = array();
				if ( ! empty( $slide['backgroundImage'] ) ) {
					$slide_attrs['backgroundImage'] = array(
						'url' => esc_url_raw( $slide['backgroundImage'] ),
					);
				}
				$inner_blocks[] = array(
					'name'        => 'designsetgo/slide',
					'attributes'  => $slide_attrs,
					'innerBlocks' => $slide['innerBlocks'] ?? array(),
				);
			}
		}

		// If no inner blocks provided, create default empty slides.
		if ( empty( $inner_blocks ) ) {
			$inner_blocks = array(
				array(
					'name'       => 'designsetgo/slide',
					'attributes' => array(),
				),
				array(
					'name'       => 'designsetgo/slide',
					'attributes' => array(),
				),
				array(
					'name'       => 'designsetgo/slide',
					'attributes' => array(),
				),
			);
		}

		// Validate inner blocks.
		$validation = Block_Inserter::validate_inner_blocks( $inner_blocks );
		if ( is_wp_error( $validation ) ) {
			return $validation;
		}

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/slider',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
