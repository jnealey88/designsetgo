<?php
/**
 * Generate Pricing Section Ability.
 *
 * Generates a complete pricing table section with multiple
 * pricing tiers using Card blocks.
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
 * Generate Pricing Section ability class.
 */
class Generate_Pricing_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/generate-pricing-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Generate Pricing Section', 'designsetgo' ),
			'description'         => __( 'Generates a complete pricing table section with multiple pricing tiers. Each tier can include price, features list, and CTA button.', 'designsetgo' ),
			'thinking_message'    => __( 'Generating pricing section...', 'designsetgo' ),
			'success_message'     => __( 'Pricing section generated successfully.', 'designsetgo' ),
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
					'heading'      => array(
						'type'        => 'string',
						'description' => __( 'Section heading text', 'designsetgo' ),
						'default'     => 'Choose Your Plan',
					),
					'headingLevel' => array(
						'type'        => 'integer',
						'description' => __( 'Heading level (1-6)', 'designsetgo' ),
						'minimum'     => 1,
						'maximum'     => 6,
						'default'     => 2,
					),
					'description'  => array(
						'type'        => 'string',
						'description' => __( 'Section description text', 'designsetgo' ),
						'default'     => 'Select the plan that best fits your needs.',
					),
					'billingToggle' => array(
						'type'        => 'boolean',
						'description' => __( 'Show monthly/yearly billing toggle', 'designsetgo' ),
						'default'     => false,
					),
					'tiers'       => array(
						'type'        => 'array',
						'description' => __( 'Pricing tier definitions', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'        => array(
									'type'        => 'string',
									'description' => __( 'Tier name (e.g., "Basic", "Pro")', 'designsetgo' ),
								),
								'price'       => array(
									'type'        => 'string',
									'description' => __( 'Price (e.g., "$29")', 'designsetgo' ),
								),
								'period'      => array(
									'type'        => 'string',
									'description' => __( 'Billing period (e.g., "/month")', 'designsetgo' ),
									'default'     => '/month',
								),
								'description' => array(
									'type'        => 'string',
									'description' => __( 'Tier description', 'designsetgo' ),
								),
								'features'    => array(
									'type'        => 'array',
									'description' => __( 'List of features included', 'designsetgo' ),
									'items'       => array(
										'type' => 'string',
									),
								),
								'ctaText'     => array(
									'type'        => 'string',
									'description' => __( 'CTA button text', 'designsetgo' ),
									'default'     => 'Get Started',
								),
								'ctaUrl'      => array(
									'type'        => 'string',
									'description' => __( 'CTA button URL', 'designsetgo' ),
								),
								'featured'    => array(
									'type'        => 'boolean',
									'description' => __( 'Is this the featured/recommended tier', 'designsetgo' ),
									'default'     => false,
								),
								'badge'       => array(
									'type'        => 'string',
									'description' => __( 'Badge text (e.g., "Most Popular")', 'designsetgo' ),
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
		$post_id       = (int) ( $input['post_id'] ?? 0 );
		$position      = (int) ( $input['position'] ?? -1 );
		$heading       = sanitize_text_field( $input['heading'] ?? 'Choose Your Plan' );
		$heading_level = (int) ( $input['headingLevel'] ?? 2 );
		$description   = sanitize_textarea_field( $input['description'] ?? 'Select the plan that best fits your needs.' );
		$tiers         = $input['tiers'] ?? array();

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

		// Default tiers if none provided.
		if ( empty( $tiers ) ) {
			$tiers = array(
				array(
					'name'        => 'Basic',
					'price'       => '$9',
					'period'      => '/month',
					'description' => 'Perfect for getting started',
					'features'    => array( '5 Projects', '10GB Storage', 'Email Support' ),
					'ctaText'     => 'Start Free',
					'featured'    => false,
				),
				array(
					'name'        => 'Pro',
					'price'       => '$29',
					'period'      => '/month',
					'description' => 'Best for professionals',
					'features'    => array( 'Unlimited Projects', '100GB Storage', 'Priority Support', 'Advanced Analytics' ),
					'ctaText'     => 'Get Started',
					'featured'    => true,
					'badge'       => 'Most Popular',
				),
				array(
					'name'        => 'Enterprise',
					'price'       => '$99',
					'period'      => '/month',
					'description' => 'For large organizations',
					'features'    => array( 'Everything in Pro', 'Unlimited Storage', 'Dedicated Support', 'Custom Integrations', 'SLA' ),
					'ctaText'     => 'Contact Sales',
					'featured'    => false,
				),
			);
		}

		// Build pricing cards.
		$pricing_cards = array();
		foreach ( $tiers as $tier ) {
			// Build features list.
			$feature_items = array();
			if ( ! empty( $tier['features'] ) ) {
				foreach ( $tier['features'] as $feature ) {
					$feature_items[] = array(
						'name'       => 'designsetgo/icon-list-item',
						'attributes' => array(
							'iconName' => 'check',
							'text'     => sanitize_text_field( $feature ),
						),
					);
				}
			}

			$card_inner = array();

			// Price section.
			$card_inner[] = array(
				'name'       => 'core/heading',
				'attributes' => array(
					'level'   => 3,
					'content' => sanitize_text_field( $tier['name'] ?? 'Plan' ),
				),
			);

			if ( ! empty( $tier['description'] ) ) {
				$card_inner[] = array(
					'name'       => 'core/paragraph',
					'attributes' => array(
						'content' => sanitize_text_field( $tier['description'] ),
					),
				);
			}

			$card_inner[] = array(
				'name'       => 'core/paragraph',
				'attributes' => array(
					'content' => '<strong style="font-size:2.5rem;">' . esc_html( $tier['price'] ?? '$0' ) . '</strong><span>' . esc_html( $tier['period'] ?? '/month' ) . '</span>',
				),
			);

			// Features list.
			if ( ! empty( $feature_items ) ) {
				$card_inner[] = array(
					'name'        => 'designsetgo/icon-list',
					'attributes'  => array(),
					'innerBlocks' => $feature_items,
				);
			}

			// CTA Button.
			$card_inner[] = array(
				'name'       => 'core/buttons',
				'attributes' => array(
					'layout' => array(
						'type'           => 'flex',
						'justifyContent' => 'center',
					),
				),
				'innerBlocks' => array(
					array(
						'name'       => 'core/button',
						'attributes' => array(
							'text' => sanitize_text_field( $tier['ctaText'] ?? 'Get Started' ),
							'url'  => esc_url( $tier['ctaUrl'] ?? '#' ),
						),
					),
				),
			);

			$card_attrs = array(
				'layoutPreset'     => 'standard',
				'contentAlignment' => 'center',
				'visualStyle'      => ! empty( $tier['featured'] ) ? 'shadow' : 'outlined',
			);

			if ( ! empty( $tier['badge'] ) ) {
				$card_attrs['badgeText'] = sanitize_text_field( $tier['badge'] );
				$card_attrs['showBadge'] = true;
			}

			$pricing_cards[] = array(
				'name'        => 'designsetgo/stack',
				'attributes'  => array(),
				'innerBlocks' => array(
					array(
						'name'        => 'designsetgo/card',
						'attributes'  => $card_attrs,
						'innerBlocks' => $card_inner,
					),
				),
			);
		}

		// Build section structure.
		$inner_blocks = array();

		// Header.
		$inner_blocks[] = array(
			'name'       => 'core/heading',
			'attributes' => array(
				'level'     => $heading_level,
				'content'   => $heading,
				'textAlign' => 'center',
			),
		);

		if ( ! empty( $description ) ) {
			$inner_blocks[] = array(
				'name'       => 'core/paragraph',
				'attributes' => array(
					'content' => $description,
					'align'   => 'center',
				),
			);
		}

		// Pricing grid.
		$columns = count( $tiers );
		$inner_blocks[] = array(
			'name'        => 'designsetgo/grid',
			'attributes'  => array(
				'columnsDesktop' => min( $columns, 3 ),
				'columnsTablet'  => min( $columns, 2 ),
				'columnsMobile'  => 1,
				'gap'            => 'var(--wp--preset--spacing--50, 1.5rem)',
				'alignItems'     => 'stretch',
			),
			'innerBlocks' => $pricing_cards,
		);

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
