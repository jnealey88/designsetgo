<?php
/**
 * Generate Hero Section Ability.
 *
 * Generates a complete hero section with heading, description, and call-to-action buttons
 * in a properly styled container.
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
 * Generate Hero Section ability class.
 */
class Generate_Hero_Section extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/generate-hero-section';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Generate Hero Section', 'designsetgo' ),
			'description'         => __( 'Generates a complete hero section with heading, description text, and call-to-action buttons in a centered Stack container.', 'designsetgo' ),
			'thinking_message'    => __( 'Generating hero section...', 'designsetgo' ),
			'success_message'     => __( 'Hero section generated successfully.', 'designsetgo' ),
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
						'description' => __( 'Hero heading text', 'designsetgo' ),
						'default'     => 'Welcome to Our Website',
					),
					'description'     => array(
						'type'        => 'string',
						'description' => __( 'Hero description text', 'designsetgo' ),
						'default'     => 'We help you build amazing websites with powerful blocks and components.',
					),
					'primaryButton'   => array(
						'type'        => 'object',
						'description' => __( 'Primary call-to-action button', 'designsetgo' ),
						'properties'  => array(
							'text' => array(
								'type'        => 'string',
								'description' => __( 'Button text', 'designsetgo' ),
								'default'     => 'Get Started',
							),
							'url'  => array(
								'type'        => 'string',
								'description' => __( 'Button URL', 'designsetgo' ),
								'default'     => '#',
							),
							'icon' => array(
								'type'        => 'string',
								'description' => __( 'Optional icon name', 'designsetgo' ),
								'default'     => 'arrow-right',
							),
						),
					),
					'secondaryButton' => array(
						'type'        => 'object',
						'description' => __( 'Optional secondary button', 'designsetgo' ),
						'properties'  => array(
							'text' => array(
								'type'        => 'string',
								'description' => __( 'Button text', 'designsetgo' ),
								'default'     => 'Learn More',
							),
							'url'  => array(
								'type'        => 'string',
								'description' => __( 'Button URL', 'designsetgo' ),
								'default'     => '#',
							),
						),
					),
					'layout'          => array(
						'type'        => 'string',
						'description' => __( 'Hero layout style', 'designsetgo' ),
						'enum'        => array( 'centered', 'left-aligned' ),
						'default'     => 'centered',
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
		$post_id     = (int) ( $input['post_id'] ?? 0 );
		$position    = (int) ( $input['position'] ?? -1 );
		$heading     = sanitize_text_field( $input['heading'] ?? 'Welcome to Our Website' );
		$description = sanitize_textarea_field( $input['description'] ?? 'We help you build amazing websites with powerful blocks and components.' );
		$primary     = $input['primaryButton'] ?? array();
		$secondary   = $input['secondaryButton'] ?? array();
		$layout      = $input['layout'] ?? 'centered';

		// Validate post.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Build inner blocks for hero section.
		$inner_blocks = array();

		// Add heading.
		$inner_blocks[] = array(
			'name'       => 'core/heading',
			'attributes' => array(
				'level'     => 1,
				'content'   => $heading,
				'textAlign' => $layout === 'centered' ? 'center' : 'left',
			),
		);

		// Add description paragraph.
		$inner_blocks[] = array(
			'name'       => 'core/paragraph',
			'attributes' => array(
				'content' => $description,
				'align'   => $layout === 'centered' ? 'center' : 'left',
			),
		);

		// Add buttons container (Flex).
		$buttons = array();

		// Primary button.
		if ( ! empty( $primary['text'] ) ) {
			$buttons[] = array(
				'name'       => 'designsetgo/icon-button',
				'attributes' => array(
					'text'         => sanitize_text_field( $primary['text'] ),
					'url'          => esc_url_raw( $primary['url'] ?? '#' ),
					'icon'         => sanitize_text_field( $primary['icon'] ?? 'arrow-right' ),
					'iconPosition' => 'end',
				),
			);
		}

		// Secondary button.
		if ( ! empty( $secondary['text'] ) ) {
			$buttons[] = array(
				'name'       => 'designsetgo/icon-button',
				'attributes' => array(
					'text' => sanitize_text_field( $secondary['text'] ),
					'url'  => esc_url_raw( $secondary['url'] ?? '#' ),
				),
			);
		}

		// Add button group if buttons exist.
		if ( ! empty( $buttons ) ) {
			$inner_blocks[] = array(
				'name'        => 'designsetgo/flex',
				'attributes'  => array(
					'direction'      => 'row',
					'justifyContent' => $layout === 'centered' ? 'center' : 'flex-start',
					'wrap'           => true,
				),
				'innerBlocks' => $buttons,
			);
		}

		// Create Stack container attributes.
		$stack_attributes = array(
			'alignItems'     => $layout === 'centered' ? 'center' : 'flex-start',
			'textAlign'      => $layout === 'centered' ? 'center' : 'left',
			'constrainWidth' => true,
		);

		// Insert the hero section.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/stack',
			$stack_attributes,
			$inner_blocks,
			$position
		);
	}
}
