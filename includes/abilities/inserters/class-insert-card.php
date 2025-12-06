<?php
/**
 * Insert Card Ability.
 *
 * Inserts a Card block for displaying content in styled card layouts
 * with image, badge, title, subtitle, body text, and CTA button.
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
 * Insert Card ability class.
 */
class Insert_Card extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-card';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Card', 'designsetgo' ),
			'description'         => __( 'Inserts a Card block for displaying content in styled layouts with image, badge, title, subtitle, body text, and CTA. Perfect for pricing tables, feature cards, team members, and service listings.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating card...', 'designsetgo' ),
			'success_message'     => __( 'Card inserted successfully.', 'designsetgo' ),
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
						'description' => __( 'Card attributes', 'designsetgo' ),
						'properties'  => array(
							// Layout.
							'layoutPreset'     => array(
								'type'        => 'string',
								'description' => __( 'Card layout style', 'designsetgo' ),
								'enum'        => array( 'standard', 'horizontal-left', 'horizontal-right', 'background', 'minimal', 'featured' ),
								'default'     => 'standard',
							),
							'visualStyle'      => array(
								'type'        => 'string',
								'description' => __( 'Visual appearance style', 'designsetgo' ),
								'enum'        => array( 'default', 'outlined', 'filled', 'shadow', 'minimal' ),
								'default'     => 'default',
							),
							'contentAlignment' => array(
								'type'        => 'string',
								'description' => __( 'Content text alignment', 'designsetgo' ),
								'enum'        => array( 'left', 'center', 'right' ),
								'default'     => 'center',
							),
							// Content.
							'title'            => array(
								'type'        => 'string',
								'description' => __( 'Card title text', 'designsetgo' ),
								'default'     => '',
							),
							'subtitle'         => array(
								'type'        => 'string',
								'description' => __( 'Card subtitle text', 'designsetgo' ),
								'default'     => '',
							),
							'bodyText'         => array(
								'type'        => 'string',
								'description' => __( 'Card body/description text', 'designsetgo' ),
								'default'     => '',
							),
							// Badge.
							'badgeText'        => array(
								'type'        => 'string',
								'description' => __( 'Badge text (e.g., "New", "Popular", "Sale")', 'designsetgo' ),
								'default'     => '',
							),
							'badgeStyle'       => array(
								'type'        => 'string',
								'description' => __( 'Badge display style', 'designsetgo' ),
								'enum'        => array( 'floating', 'inline' ),
								'default'     => 'floating',
							),
							'badgeFloatingPosition' => array(
								'type'        => 'string',
								'description' => __( 'Floating badge position', 'designsetgo' ),
								'enum'        => array( 'top-left', 'top-right', 'bottom-left', 'bottom-right' ),
								'default'     => 'top-right',
							),
							'badgeBackgroundColor'  => array(
								'type'        => 'string',
								'description' => __( 'Badge background color', 'designsetgo' ),
							),
							'badgeTextColor'        => array(
								'type'        => 'string',
								'description' => __( 'Badge text color', 'designsetgo' ),
							),
							// Image.
							'imageUrl'         => array(
								'type'        => 'string',
								'description' => __( 'Card image URL', 'designsetgo' ),
								'default'     => '',
							),
							'imageId'          => array(
								'type'        => 'number',
								'description' => __( 'Card image attachment ID', 'designsetgo' ),
								'default'     => 0,
							),
							'imageAlt'         => array(
								'type'        => 'string',
								'description' => __( 'Image alt text', 'designsetgo' ),
								'default'     => '',
							),
							'imageAspectRatio' => array(
								'type'        => 'string',
								'description' => __( 'Image aspect ratio', 'designsetgo' ),
								'enum'        => array( '16-9', '4-3', '1-1', 'original', 'custom' ),
								'default'     => '16-9',
							),
							'imageObjectFit'   => array(
								'type'        => 'string',
								'description' => __( 'How image fills the container', 'designsetgo' ),
								'enum'        => array( 'cover', 'contain', 'fill', 'scale-down' ),
								'default'     => 'cover',
							),
							// Visibility toggles.
							'showImage'        => array(
								'type'        => 'boolean',
								'description' => __( 'Show image section', 'designsetgo' ),
								'default'     => true,
							),
							'showTitle'        => array(
								'type'        => 'boolean',
								'description' => __( 'Show title', 'designsetgo' ),
								'default'     => true,
							),
							'showSubtitle'     => array(
								'type'        => 'boolean',
								'description' => __( 'Show subtitle', 'designsetgo' ),
								'default'     => true,
							),
							'showBody'         => array(
								'type'        => 'boolean',
								'description' => __( 'Show body text', 'designsetgo' ),
								'default'     => true,
							),
							'showBadge'        => array(
								'type'        => 'boolean',
								'description' => __( 'Show badge', 'designsetgo' ),
								'default'     => true,
							),
							'showCta'          => array(
								'type'        => 'boolean',
								'description' => __( 'Show CTA button', 'designsetgo' ),
								'default'     => true,
							),
							// Overlay (for background layout).
							'overlayOpacity'   => array(
								'type'        => 'number',
								'description' => __( 'Overlay opacity (0-100) for background layout', 'designsetgo' ),
								'default'     => 80,
								'minimum'     => 0,
								'maximum'     => 100,
							),
							'overlayColor'     => array(
								'type'        => 'string',
								'description' => __( 'Overlay color for background layout', 'designsetgo' ),
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
			return new WP_Error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Insert the block (Card doesn't have inner blocks).
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/card',
			$attributes,
			array(), // No inner blocks.
			$position
		);
	}
}
