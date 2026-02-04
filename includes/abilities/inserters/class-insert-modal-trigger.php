<?php
/**
 * Insert Modal Trigger Ability.
 *
 * Inserts a Modal Trigger button block for opening modal dialogs.
 * This block provides a button-style trigger with icon support.
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
 * Insert Modal Trigger ability class.
 */
class Insert_Modal_Trigger extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-modal-trigger';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Modal Trigger', 'designsetgo' ),
			'description'         => __( 'Inserts a Modal Trigger button for opening modal dialogs. Includes customizable text, icons, and styling options.', 'designsetgo' ),
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
						'description' => __( 'Modal trigger attributes', 'designsetgo' ),
						'properties'  => array(
							'text'          => array(
								'type'        => 'string',
								'description' => __( 'Button text', 'designsetgo' ),
								'default'     => __( 'Open Modal', 'designsetgo' ),
							),
							'targetModalId' => array(
								'type'        => 'string',
								'description' => __( 'ID of the modal to open', 'designsetgo' ),
							),
							'buttonStyle'   => array(
								'type'        => 'string',
								'description' => __( 'Button visual style', 'designsetgo' ),
								'enum'        => array( 'fill', 'outline', 'link' ),
								'default'     => 'fill',
							),
							'icon'          => array(
								'type'        => 'string',
								'description' => __( 'Dashicon name (e.g., "admin-site-alt")', 'designsetgo' ),
							),
							'iconPosition'  => array(
								'type'        => 'string',
								'description' => __( 'Icon position relative to text', 'designsetgo' ),
								'enum'        => array( 'start', 'end', 'none' ),
								'default'     => 'none',
							),
							'width'         => array(
								'type'        => 'string',
								'description' => __( 'Button width', 'designsetgo' ),
								'enum'        => array( 'auto', 'full' ),
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
	 * @return bool|WP_Error
	 */
	public function check_permission_callback() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to insert modal triggers.', 'designsetgo' ),
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

		// Validate inner blocks if provided.
		if ( ! empty( $inner_blocks ) ) {
			$validation = Block_Inserter::validate_inner_blocks( $inner_blocks );
			if ( is_wp_error( $validation ) ) {
				return $validation;
			}
		}

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/modal-trigger',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
