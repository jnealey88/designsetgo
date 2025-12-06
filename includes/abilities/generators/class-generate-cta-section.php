<?php
/**
 * Generate CTA Section Ability.
 *
 * Generates a call-to-action section with headline,
 * description, and action buttons.
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
 * Generate CTA Section ability class.
 */
class Generate_CTA_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/generate-cta-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Generate CTA Section', 'designsetgo' ),
			'description'         => __( 'Generates a call-to-action section with compelling headline, description, and action buttons. Perfect for conversion-focused landing pages.', 'designsetgo' ),
			'thinking_message'    => __( 'Generating CTA section...', 'designsetgo' ),
			'success_message'     => __( 'CTA section generated successfully.', 'designsetgo' ),
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
					'heading'         => array(
						'type'        => 'string',
						'description' => __( 'Main headline', 'designsetgo' ),
						'default'     => 'Ready to Get Started?',
					),
					'headingLevel'    => array(
						'type'        => 'integer',
						'description' => __( 'Heading level (1-6)', 'designsetgo' ),
						'minimum'     => 1,
						'maximum'     => 6,
						'default'     => 2,
					),
					'description'     => array(
						'type'        => 'string',
						'description' => __( 'Supporting description text', 'designsetgo' ),
						'default'     => 'Join thousands of satisfied customers and transform your business today.',
					),
					'layout'          => array(
						'type'        => 'string',
						'description' => __( 'CTA layout style', 'designsetgo' ),
						'enum'        => array( 'centered', 'split', 'minimal' ),
						'default'     => 'centered',
					),
					'primaryButton'   => array(
						'type'        => 'object',
						'description' => __( 'Primary CTA button', 'designsetgo' ),
						'properties'  => array(
							'text' => array(
								'type'        => 'string',
								'description' => __( 'Button text', 'designsetgo' ),
								'default'     => 'Get Started',
							),
							'url'  => array(
								'type'        => 'string',
								'description' => __( 'Button URL', 'designsetgo' ),
							),
						),
					),
					'secondaryButton' => array(
						'type'        => 'object',
						'description' => __( 'Secondary CTA button (optional)', 'designsetgo' ),
						'properties'  => array(
							'text' => array(
								'type'        => 'string',
								'description' => __( 'Button text', 'designsetgo' ),
							),
							'url'  => array(
								'type'        => 'string',
								'description' => __( 'Button URL', 'designsetgo' ),
							),
						),
					),
					'backgroundColor' => array(
						'type'        => 'string',
						'description' => __( 'Section background color', 'designsetgo' ),
					),
					'backgroundImage' => array(
						'type'        => 'string',
						'description' => __( 'Background image URL', 'designsetgo' ),
					),
					'overlayOpacity'  => array(
						'type'        => 'number',
						'description' => __( 'Background overlay opacity (0-100)', 'designsetgo' ),
						'default'     => 70,
						'minimum'     => 0,
						'maximum'     => 100,
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
		$post_id          = (int) ( $input['post_id'] ?? 0 );
		$position         = (int) ( $input['position'] ?? -1 );
		$heading          = sanitize_text_field( $input['heading'] ?? 'Ready to Get Started?' );
		$heading_level    = (int) ( $input['headingLevel'] ?? 2 );
		$description      = sanitize_textarea_field( $input['description'] ?? 'Join thousands of satisfied customers and transform your business today.' );
		$layout           = $input['layout'] ?? 'centered';
		$primary_button   = $input['primaryButton'] ?? array( 'text' => 'Get Started' );
		$secondary_button = $input['secondaryButton'] ?? array();
		$bg_color         = $input['backgroundColor'] ?? '';
		$bg_image         = $input['backgroundImage'] ?? '';
		$overlay_opacity  = (int) ( $input['overlayOpacity'] ?? 70 );

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Validate heading level.
		$heading_level = max( 1, min( 6, $heading_level ) );

		// Build buttons.
		$button_blocks = array();

		if ( ! empty( $primary_button['text'] ) ) {
			$button_blocks[] = array(
				'name'       => 'core/button',
				'attributes' => array(
					'text'            => sanitize_text_field( $primary_button['text'] ),
					'url'             => esc_url( $primary_button['url'] ?? '#' ),
					'backgroundColor' => 'primary',
				),
			);
		}

		if ( ! empty( $secondary_button['text'] ) ) {
			$button_blocks[] = array(
				'name'       => 'core/button',
				'attributes' => array(
					'text'      => sanitize_text_field( $secondary_button['text'] ),
					'url'       => esc_url( $secondary_button['url'] ?? '#' ),
					'className' => 'is-style-outline',
				),
			);
		}

		// Build content based on layout.
		$inner_blocks = array();

		if ( 'split' === $layout ) {
			// Split layout: text on left, buttons on right.
			$left_column = array(
				array(
					'name'       => 'core/heading',
					'attributes' => array(
						'level'   => $heading_level,
						'content' => $heading,
					),
				),
			);

			if ( ! empty( $description ) ) {
				$left_column[] = array(
					'name'       => 'core/paragraph',
					'attributes' => array(
						'content' => $description,
					),
				);
			}

			$right_column = array();
			if ( ! empty( $button_blocks ) ) {
				$right_column[] = array(
					'name'        => 'core/buttons',
					'attributes'  => array(
						'layout' => array(
							'type'           => 'flex',
							'justifyContent' => 'flex-end',
							'orientation'    => 'horizontal',
						),
					),
					'innerBlocks' => $button_blocks,
				);
			}

			$inner_blocks[] = array(
				'name'        => 'designsetgo/grid',
				'attributes'  => array(
					'columnsDesktop' => 2,
					'columnsTablet'  => 1,
					'columnsMobile'  => 1,
					'alignItems'     => 'center',
					'gap'            => 'var(--wp--preset--spacing--60, 2rem)',
				),
				'innerBlocks' => array(
					array(
						'name'        => 'designsetgo/stack',
						'attributes'  => array(),
						'innerBlocks' => $left_column,
					),
					array(
						'name'        => 'designsetgo/stack',
						'attributes'  => array(),
						'innerBlocks' => $right_column,
					),
				),
			);
		} else {
			// Centered or minimal layout.
			$inner_blocks[] = array(
				'name'       => 'core/heading',
				'attributes' => array(
					'level'     => $heading_level,
					'content'   => $heading,
					'textAlign' => 'center',
				),
			);

			if ( ! empty( $description ) && 'minimal' !== $layout ) {
				$inner_blocks[] = array(
					'name'       => 'core/paragraph',
					'attributes' => array(
						'content' => $description,
						'align'   => 'center',
					),
				);
			}

			if ( ! empty( $button_blocks ) ) {
				$inner_blocks[] = array(
					'name'        => 'core/buttons',
					'attributes'  => array(
						'layout' => array(
							'type'           => 'flex',
							'justifyContent' => 'center',
						),
					),
					'innerBlocks' => $button_blocks,
				);
			}
		}

		// Build section attributes.
		$section_attributes = array(
			'constrainWidth' => true,
			'verticalAlign'  => 'center',
		);

		// Wrap in cover block if background image is provided.
		if ( ! empty( $bg_image ) ) {
			$cover_inner = array(
				array(
					'name'        => 'designsetgo/section',
					'attributes'  => $section_attributes,
					'innerBlocks' => $inner_blocks,
				),
			);

			return Block_Inserter::insert_block(
				$post_id,
				'core/cover',
				array(
					'url'            => esc_url( $bg_image ),
					'dimRatio'       => $overlay_opacity,
					'overlayColor'   => ! empty( $bg_color ) ? $bg_color : 'black',
					'minHeight'      => 300,
					'contentPosition' => 'center center',
				),
				$cover_inner,
				$position
			);
		}

		// Regular section with optional background color.
		if ( ! empty( $bg_color ) ) {
			$section_attributes['backgroundColor'] = $bg_color;
		}

		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/section',
			$section_attributes,
			$inner_blocks,
			$position
		);
	}
}
