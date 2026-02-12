<?php
/**
 * Generate Team Section Ability.
 *
 * Generates a team members section with profile cards
 * including photos, names, roles, and social links.
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
 * Generate Team Section ability class.
 */
class Generate_Team_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/generate-team-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Generate Team Section', 'designsetgo' ),
			'description'         => __( 'Generates a team members section with profile cards. Each member can include photo, name, role, bio, and social media links.', 'designsetgo' ),
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
						'default'     => 'Meet Our Team',
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
						'default'     => 'The talented people behind our success.',
					),
					'columns'      => array(
						'type'        => 'number',
						'description' => __( 'Number of columns on desktop (2-4)', 'designsetgo' ),
						'default'     => 3,
						'minimum'     => 2,
						'maximum'     => 4,
					),
					'cardStyle'    => array(
						'type'        => 'string',
						'description' => __( 'Card visual style', 'designsetgo' ),
						'enum'        => array( 'standard', 'minimal', 'overlay' ),
						'default'     => 'standard',
					),
					'members'      => array(
						'type'        => 'array',
						'description' => __( 'Team member definitions', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'     => array(
									'type'        => 'string',
									'description' => __( 'Member name', 'designsetgo' ),
								),
								'role'     => array(
									'type'        => 'string',
									'description' => __( 'Job title/role', 'designsetgo' ),
								),
								'bio'      => array(
									'type'        => 'string',
									'description' => __( 'Short bio', 'designsetgo' ),
								),
								'imageUrl' => array(
									'type'        => 'string',
									'description' => __( 'Profile photo URL', 'designsetgo' ),
								),
								'imageId'  => array(
									'type'        => 'number',
									'description' => __( 'Profile photo attachment ID', 'designsetgo' ),
								),
								'social'   => array(
									'type'        => 'object',
									'description' => __( 'Social media links', 'designsetgo' ),
									'properties'  => array(
										'linkedin'  => array( 'type' => 'string' ),
										'twitter'   => array( 'type' => 'string' ),
										'github'    => array( 'type' => 'string' ),
										'instagram' => array( 'type' => 'string' ),
										'email'     => array( 'type' => 'string' ),
									),
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
		$heading       = sanitize_text_field( $input['heading'] ?? 'Meet Our Team' );
		$heading_level = (int) ( $input['headingLevel'] ?? 2 );
		$description   = sanitize_textarea_field( $input['description'] ?? 'The talented people behind our success.' );
		$columns       = (int) ( $input['columns'] ?? 3 );
		$card_style    = $input['cardStyle'] ?? 'standard';
		$members       = $input['members'] ?? array();

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

		// Default members if none provided.
		if ( empty( $members ) ) {
			$members = array(
				array(
					'name' => 'John Smith',
					'role' => 'CEO & Founder',
					'bio'  => 'Visionary leader with 15+ years of experience.',
				),
				array(
					'name' => 'Sarah Johnson',
					'role' => 'Head of Design',
					'bio'  => 'Creative director passionate about user experience.',
				),
				array(
					'name' => 'Mike Chen',
					'role' => 'Lead Developer',
					'bio'  => 'Full-stack engineer who loves clean code.',
				),
			);
		}

		// Build team member cards.
		$member_cards = array();
		foreach ( $members as $member ) {
			$card_inner = array();

			// Profile image.
			if ( ! empty( $member['imageUrl'] ) || ! empty( $member['imageId'] ) ) {
				$img_attrs = array(
					'sizeSlug' => 'medium',
				);
				if ( ! empty( $member['imageId'] ) ) {
					$img_attrs['id'] = (int) $member['imageId'];
				}
				if ( ! empty( $member['imageUrl'] ) ) {
					$img_attrs['url'] = esc_url( $member['imageUrl'] );
				}
				$card_inner[] = array(
					'name'       => 'core/image',
					'attributes' => $img_attrs,
				);
			}

			// Name.
			$card_inner[] = array(
				'name'       => 'core/heading',
				'attributes' => array(
					'level'     => 3,
					'content'   => sanitize_text_field( $member['name'] ?? 'Team Member' ),
					'textAlign' => 'center',
				),
			);

			// Role.
			if ( ! empty( $member['role'] ) ) {
				$card_inner[] = array(
					'name'       => 'core/paragraph',
					'attributes' => array(
						'content'  => '<strong>' . sanitize_text_field( $member['role'] ) . '</strong>',
						'align'    => 'center',
						'fontSize' => 'small',
					),
				);
			}

			// Bio.
			if ( ! empty( $member['bio'] ) ) {
				$card_inner[] = array(
					'name'       => 'core/paragraph',
					'attributes' => array(
						'content' => sanitize_text_field( $member['bio'] ),
						'align'   => 'center',
					),
				);
			}

			// Social links.
			if ( ! empty( $member['social'] ) ) {
				$social_icons   = array();
				$social_mapping = array(
					'linkedin'  => 'linkedin',
					'twitter'   => 'x',
					'github'    => 'github',
					'instagram' => 'instagram',
					'email'     => 'mail',
				);

				foreach ( $social_mapping as $key => $icon ) {
					if ( ! empty( $member['social'][ $key ] ) ) {
						$url = 'email' === $key
							? 'mailto:' . sanitize_email( $member['social'][ $key ] )
							: esc_url( $member['social'][ $key ] );

						$social_icons[] = array(
							'name'       => 'designsetgo/icon-button',
							'attributes' => array(
								'iconName' => $icon,
								'url'      => $url,
								'size'     => 'small',
							),
						);
					}
				}

				if ( ! empty( $social_icons ) ) {
					$card_inner[] = array(
						'name'        => 'designsetgo/flex',
						'attributes'  => array(
							'justifyContent' => 'center',
							'gap'            => '0.5rem',
						),
						'innerBlocks' => $social_icons,
					);
				}
			}

			$card_attrs = array(
				'layoutPreset'     => 'standard',
				'contentAlignment' => 'center',
				'visualStyle'      => 'overlay' === $card_style ? 'shadow' : ( 'minimal' === $card_style ? 'minimal' : 'default' ),
			);

			$member_cards[] = array(
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

		// Team grid.
		$inner_blocks[] = array(
			'name'        => 'designsetgo/grid',
			'attributes'  => array(
				'columnsDesktop' => min( $columns, 4 ),
				'columnsTablet'  => min( $columns, 2 ),
				'columnsMobile'  => 1,
				'gap'            => 'var(--wp--preset--spacing--50, 1.5rem)',
			),
			'innerBlocks' => $member_cards,
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
