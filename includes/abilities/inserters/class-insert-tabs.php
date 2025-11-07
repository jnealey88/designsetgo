<?php
/**
 * Insert Tabs Ability.
 *
 * Inserts a Tabs block container for organizing content into tabbed sections
 * with support for icons, deep linking, and responsive modes.
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
 * Insert Tabs ability class.
 */
class Insert_Tabs extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-tabs';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'             => __( 'Insert Tabs', 'designsetgo' ),
			'description'       => __( 'Inserts a Tabs container for organizing content into tabbed sections with icons, deep linking, and responsive accordion mode.', 'designsetgo' ),
			'thinking_message'  => __( 'Creating tabs container...', 'designsetgo' ),
			'success_message'   => __( 'Tabs container inserted successfully.', 'designsetgo' ),
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
					'attributes'  => array(
						'type'       => 'object',
						'description' => __( 'Tabs attributes', 'designsetgo' ),
						'properties' => array(
							'orientation'     => array(
								'type'        => 'string',
								'description' => __( 'Tab orientation', 'designsetgo' ),
								'enum'        => array( 'horizontal', 'vertical' ),
								'default'     => 'horizontal',
							),
							'activeTab'       => array(
								'type'        => 'number',
								'description' => __( 'Index of initially active tab (0-based)', 'designsetgo' ),
								'default'     => 0,
								'minimum'     => 0,
							),
							'alignment'       => array(
								'type'        => 'string',
								'description' => __( 'Tab alignment', 'designsetgo' ),
								'enum'        => array( 'left', 'center', 'right', 'justified' ),
								'default'     => 'left',
							),
							'tabStyle'        => array(
								'type'        => 'string',
								'description' => __( 'Visual style of tabs', 'designsetgo' ),
								'enum'        => array( 'default', 'pills', 'underline', 'minimal' ),
								'default'     => 'default',
							),
							'gap'             => array(
								'type'        => 'string',
								'description' => __( 'Gap between tabs (e.g., "8px")', 'designsetgo' ),
								'default'     => '8px',
							),
							'mobileMode'      => array(
								'type'        => 'string',
								'description' => __( 'How tabs display on mobile', 'designsetgo' ),
								'enum'        => array( 'accordion', 'dropdown', 'tabs' ),
								'default'     => 'accordion',
							),
							'mobileBreakpoint' => array(
								'type'        => 'number',
								'description' => __( 'Breakpoint for mobile mode in pixels', 'designsetgo' ),
								'default'     => 768,
								'minimum'     => 320,
								'maximum'     => 1024,
							),
							'enableDeepLinking' => array(
								'type'        => 'boolean',
								'description' => __( 'Enable URL hash navigation for tabs', 'designsetgo' ),
								'default'     => false,
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Tab blocks to insert (designsetgo/tab)', 'designsetgo' ),
						'items'       => array(
							'type'       => 'object',
							'properties' => array(
								'name'        => array(
									'type'        => 'string',
									'description' => __( 'Block name (should be "designsetgo/tab")', 'designsetgo' ),
									'default'     => 'designsetgo/tab',
								),
								'attributes'  => array(
									'type'        => 'object',
									'description' => __( 'Tab attributes including title and icon', 'designsetgo' ),
									'properties'  => array(
										'title' => array(
											'type'        => 'string',
											'description' => __( 'Tab title', 'designsetgo' ),
										),
										'icon'  => array(
											'type'        => 'string',
											'description' => __( 'Optional icon name', 'designsetgo' ),
										),
									),
								),
								'innerBlocks' => array(
									'type'        => 'array',
									'description' => __( 'Content blocks for this tab', 'designsetgo' ),
								),
							),
							'required'   => array( 'name' ),
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
			'designsetgo/tabs',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
