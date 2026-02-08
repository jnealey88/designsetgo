<?php
/**
 * Insert Section Ability.
 *
 * Inserts a Section block for creating full-width page sections
 * with optional width constraints and background styling.
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
 * Insert Section ability class.
 */
class Insert_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Section', 'designsetgo' ),
			'description'         => __( 'Inserts a Section block for creating full-width page sections with optional content width constraints, shape dividers, hover effects, and overlays. Perfect for hero sections, feature areas, and page layouts.', 'designsetgo' ),
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
						'description' => __( 'Section attributes. Note: WordPress block supports (minHeight, backgroundColor, textColor, padding, margin, borders) should be set via the "style" object attribute following WordPress block supports format.', 'designsetgo' ),
						'properties'  => array(
							// Layout settings.
							'align'                      => array(
								'type'        => 'string',
								'description' => __( 'Block alignment', 'designsetgo' ),
								'enum'        => array( 'wide', 'full' ),
								'default'     => 'full',
							),
							'tagName'                    => array(
								'type'        => 'string',
								'description' => __( 'HTML tag for the section', 'designsetgo' ),
								'enum'        => array( 'div', 'section', 'article', 'header', 'footer', 'main', 'aside' ),
								'default'     => 'div',
							),
							'constrainWidth'             => array(
								'type'        => 'boolean',
								'description' => __( 'Constrain inner content width', 'designsetgo' ),
								'default'     => true,
							),
							'contentWidth'               => array(
								'type'        => 'string',
								'description' => __( 'Content max width (e.g., "1200px"). Leave empty to use theme default.', 'designsetgo' ),
							),

							// Overlay.
							'overlayColor'               => array(
								'type'        => 'string',
								'description' => __( 'Overlay color to dim backgrounds for better content readability (CSS color value)', 'designsetgo' ),
							),

							// Hover effects.
							'hoverBackgroundColor'       => array(
								'type'        => 'string',
								'description' => __( 'Background color on hover (CSS color value)', 'designsetgo' ),
							),
							'hoverTextColor'             => array(
								'type'        => 'string',
								'description' => __( 'Text color on hover (CSS color value)', 'designsetgo' ),
							),
							'hoverIconBackgroundColor'   => array(
								'type'        => 'string',
								'description' => __( 'Icon background color on hover, passed to child blocks (CSS color value)', 'designsetgo' ),
							),
							'hoverButtonBackgroundColor' => array(
								'type'        => 'string',
								'description' => __( 'Button background color on hover, passed to child blocks (CSS color value)', 'designsetgo' ),
							),

							// Shape divider - Top.
							'shapeDividerTop'            => array(
								'type'        => 'string',
								'description' => __( 'Top shape divider type', 'designsetgo' ),
								'enum'        => array(
									'',
									'wave',
									'wave-double',
									'wave-layered',
									'wave-asymmetric',
									'tilt',
									'tilt-reverse',
									'curve',
									'curve-asymmetric',
									'triangle',
									'triangle-asymmetric',
									'arrow',
									'arrow-wide',
									'peaks',
									'peaks-soft',
									'zigzag',
									'book',
									'clouds',
									'drops',
									'split',
									'fan',
									'steps',
									'torn',
									'slime',
								),
							),
							'shapeDividerTopColor'       => array(
								'type'        => 'string',
								'description' => __( 'Top shape fill color (CSS color value)', 'designsetgo' ),
							),
							'shapeDividerTopBackgroundColor' => array(
								'type'        => 'string',
								'description' => __( 'Top shape background/container color (CSS color value)', 'designsetgo' ),
							),
							'shapeDividerTopHeight'      => array(
								'type'        => 'number',
								'description' => __( 'Top shape height in pixels', 'designsetgo' ),
								'default'     => 100,
							),
							'shapeDividerTopWidth'       => array(
								'type'        => 'number',
								'description' => __( 'Top shape width as percentage (100 = 100%)', 'designsetgo' ),
								'default'     => 100,
							),
							'shapeDividerTopFlipX'       => array(
								'type'        => 'boolean',
								'description' => __( 'Flip top shape horizontally', 'designsetgo' ),
								'default'     => false,
							),
							'shapeDividerTopFlipY'       => array(
								'type'        => 'boolean',
								'description' => __( 'Flip top shape vertically', 'designsetgo' ),
								'default'     => false,
							),
							'shapeDividerTopFront'       => array(
								'type'        => 'boolean',
								'description' => __( 'Bring top shape to front (above content)', 'designsetgo' ),
								'default'     => false,
							),

							// Shape divider - Bottom.
							'shapeDividerBottom'         => array(
								'type'        => 'string',
								'description' => __( 'Bottom shape divider type', 'designsetgo' ),
								'enum'        => array(
									'',
									'wave',
									'wave-double',
									'wave-layered',
									'wave-asymmetric',
									'tilt',
									'tilt-reverse',
									'curve',
									'curve-asymmetric',
									'triangle',
									'triangle-asymmetric',
									'arrow',
									'arrow-wide',
									'peaks',
									'peaks-soft',
									'zigzag',
									'book',
									'clouds',
									'drops',
									'split',
									'fan',
									'steps',
									'torn',
									'slime',
								),
							),
							'shapeDividerBottomColor'    => array(
								'type'        => 'string',
								'description' => __( 'Bottom shape fill color (CSS color value)', 'designsetgo' ),
							),
							'shapeDividerBottomBackgroundColor' => array(
								'type'        => 'string',
								'description' => __( 'Bottom shape background/container color (CSS color value)', 'designsetgo' ),
							),
							'shapeDividerBottomHeight'   => array(
								'type'        => 'number',
								'description' => __( 'Bottom shape height in pixels', 'designsetgo' ),
								'default'     => 100,
							),
							'shapeDividerBottomWidth'    => array(
								'type'        => 'number',
								'description' => __( 'Bottom shape width as percentage (100 = 100%)', 'designsetgo' ),
								'default'     => 100,
							),
							'shapeDividerBottomFlipX'    => array(
								'type'        => 'boolean',
								'description' => __( 'Flip bottom shape horizontally', 'designsetgo' ),
								'default'     => false,
							),
							'shapeDividerBottomFlipY'    => array(
								'type'        => 'boolean',
								'description' => __( 'Flip bottom shape vertically', 'designsetgo' ),
								'default'     => false,
							),
							'shapeDividerBottomFront'    => array(
								'type'        => 'boolean',
								'description' => __( 'Bring bottom shape to front (above content)', 'designsetgo' ),
								'default'     => false,
							),

							// WordPress block supports (set via style object).
							'style'                      => array(
								'type'        => 'object',
								'description' => __( 'WordPress block supports styling. Use this for minHeight, spacing (padding/margin), colors (background/text/gradient), borders, and typography.', 'designsetgo' ),
								'properties'  => array(
									'dimensions' => array(
										'type'        => 'object',
										'description' => __( 'Dimension settings', 'designsetgo' ),
										'properties'  => array(
											'minHeight' => array(
												'type' => 'string',
												'description' => __( 'Minimum height (e.g., "500px", "100vh")', 'designsetgo' ),
											),
										),
									),
									'spacing'    => array(
										'type'        => 'object',
										'description' => __( 'Spacing settings', 'designsetgo' ),
										'properties'  => array(
											'padding'  => array(
												'type' => 'object',
												'description' => __( 'Padding values (top, right, bottom, left)', 'designsetgo' ),
											),
											'margin'   => array(
												'type' => 'object',
												'description' => __( 'Margin values (top, right, bottom, left)', 'designsetgo' ),
											),
											'blockGap' => array(
												'type' => 'string',
												'description' => __( 'Gap between inner blocks', 'designsetgo' ),
											),
										),
									),
									'color'      => array(
										'type'        => 'object',
										'description' => __( 'Color settings', 'designsetgo' ),
										'properties'  => array(
											'background' => array(
												'type' => 'string',
												'description' => __( 'Background color', 'designsetgo' ),
											),
											'text'       => array(
												'type' => 'string',
												'description' => __( 'Text color', 'designsetgo' ),
											),
											'gradient'   => array(
												'type' => 'string',
												'description' => __( 'Background gradient', 'designsetgo' ),
											),
										),
									),
									'border'     => array(
										'type'        => 'object',
										'description' => __( 'Border settings (color, radius, style, width)', 'designsetgo' ),
									),
								),
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Content blocks inside the section', 'designsetgo' ),
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
		$inner_blocks = $input['innerBlocks'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Validate inner blocks.
		if ( ! empty( $inner_blocks ) ) {
			$validation = Block_Inserter::validate_inner_blocks( $inner_blocks );
			if ( is_wp_error( $validation ) ) {
				return $validation;
			}
		}

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/section',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
