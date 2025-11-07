<?php
/**
 * Insert Icon Button Ability.
 *
 * Inserts an Icon Button block with customizable text, icon, and link.
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
 * Insert Icon Button ability class.
 */
class Insert_Icon_Button extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-icon-button';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'             => __( 'Insert Icon Button', 'designsetgo' ),
			'description'       => __( 'Inserts an Icon Button block with customizable text, icon, link, and styling. Perfect for CTAs and navigation.', 'designsetgo' ),
			'thinking_message'  => __( 'Inserting icon button...', 'designsetgo' ),
			'success_message'   => __( 'Icon button inserted successfully.', 'designsetgo' ),
			'category'          => 'blocks',
			'input_schema'      => $this->get_input_schema(),
			'output_schema'     => Block_Inserter::get_default_output_schema(),
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
			'type'       => 'object',
			'properties' => array_merge(
				$common,
				array(
					'attributes' => array(
						'type'       => 'object',
						'description' => __( 'Icon button attributes', 'designsetgo' ),
						'properties' => array(
							'text'         => array(
								'type'        => 'string',
								'description' => __( 'Button text', 'designsetgo' ),
								'default'     => '',
							),
							'url'          => array(
								'type'        => 'string',
								'description' => __( 'Button URL', 'designsetgo' ),
								'default'     => '',
							),
							'linkTarget'   => array(
								'type'        => 'string',
								'description' => __( 'Link target', 'designsetgo' ),
								'enum'        => array( '_self', '_blank' ),
								'default'     => '_self',
							),
							'rel'          => array(
								'type'        => 'string',
								'description' => __( 'Link rel attribute', 'designsetgo' ),
							),
							'icon'         => array(
								'type'        => 'string',
								'description' => __( 'Icon name (e.g., "lightbulb", "arrow-right")', 'designsetgo' ),
								'default'     => 'lightbulb',
							),
							'iconPosition' => array(
								'type'        => 'string',
								'description' => __( 'Icon position relative to text', 'designsetgo' ),
								'enum'        => array( 'start', 'end' ),
								'default'     => 'start',
							),
							'iconSize'     => array(
								'type'        => 'number',
								'description' => __( 'Icon size in pixels', 'designsetgo' ),
								'default'     => 20,
								'minimum'     => 8,
								'maximum'     => 64,
							),
							'iconGap'      => array(
								'type'        => 'string',
								'description' => __( 'Gap between icon and text (e.g., "8px")', 'designsetgo' ),
								'default'     => '8px',
							),
							'width'        => array(
								'type'        => 'string',
								'description' => __( 'Button width (e.g., "auto", "100%", "200px")', 'designsetgo' ),
								'default'     => 'auto',
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

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/icon-button',
			$attributes,
			array(),
			$position
		);
	}
}
