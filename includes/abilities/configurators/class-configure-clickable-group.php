<?php
/**
 * Configure Clickable Group Ability.
 *
 * Makes container blocks clickable with link functionality,
 * turning the entire block into an interactive element.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Configurators;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Configurator;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Configure Clickable Group ability class.
 */
class Configure_Clickable_Group extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-clickable-group';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Configure Clickable Group', 'designsetgo' ),
			'description'         => __( 'Makes container blocks clickable, turning them into interactive link areas. Perfect for card layouts, feature boxes, and call-to-action sections.', 'designsetgo' ),
			'category'            => 'blocks',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => Block_Configurator::get_default_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
		);
	}

	/**
	 * Get input schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_input_schema(): array {
		$common = Block_Configurator::get_common_input_schema();

		return array(
			'type'                 => 'object',
			'properties'           => array_merge(
				$common,
				array(
					'block_name' => array(
						'type'        => 'string',
						'description' => __( 'Block type to configure', 'designsetgo' ),
						'enum'        => array( 'core/group', 'core/column', 'core/columns', 'designsetgo/stack', 'designsetgo/card' ),
						'default'     => 'core/group',
					),
					'link'       => array(
						'type'        => 'object',
						'description' => __( 'Clickable link settings', 'designsetgo' ),
						'properties'  => array(
							'enabled'      => array(
								'type'        => 'boolean',
								'description' => __( 'Enable clickable group', 'designsetgo' ),
								'default'     => true,
							),
							'url'          => array(
								'type'        => 'string',
								'description' => __( 'Link URL', 'designsetgo' ),
							),
							'openInNewTab' => array(
								'type'        => 'boolean',
								'description' => __( 'Open link in new tab', 'designsetgo' ),
								'default'     => false,
							),
							'noFollow'     => array(
								'type'        => 'boolean',
								'description' => __( 'Add nofollow rel attribute', 'designsetgo' ),
								'default'     => false,
							),
							'ariaLabel'    => array(
								'type'        => 'string',
								'description' => __( 'Accessible label for the link', 'designsetgo' ),
							),
							'hoverEffect'  => array(
								'type'        => 'string',
								'description' => __( 'Hover effect style', 'designsetgo' ),
								'enum'        => array( 'none', 'lift', 'scale', 'shadow', 'border' ),
								'default'     => 'none',
							),
							'cursorStyle'  => array(
								'type'        => 'string',
								'description' => __( 'Cursor style on hover', 'designsetgo' ),
								'enum'        => array( 'pointer', 'default' ),
								'default'     => 'pointer',
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
		$post_id         = (int) ( $input['post_id'] ?? 0 );
		$block_client_id = $input['block_client_id'] ?? null;
		$update_all      = (bool) ( $input['update_all'] ?? false );
		$block_name      = $input['block_name'] ?? 'core/group';
		$link            = $input['link'] ?? array();

		// Validate required parameters.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		if ( empty( $link ) ) {
			return $this->error(
				'missing_link',
				__( 'Link settings are required.', 'designsetgo' )
			);
		}

		// Map link settings to block attributes.
		$attribute_mapping = array(
			'enabled'      => 'dsgoClickableEnabled',
			'url'          => 'dsgoClickableUrl',
			'openInNewTab' => 'dsgoClickableNewTab',
			'noFollow'     => 'dsgoClickableNoFollow',
			'ariaLabel'    => 'dsgoClickableAriaLabel',
			'hoverEffect'  => 'dsgoClickableHoverEffect',
			'cursorStyle'  => 'dsgoClickableCursor',
		);

		$new_attributes = array();
		foreach ( $link as $key => $value ) {
			if ( isset( $attribute_mapping[ $key ] ) ) {
				$new_attributes[ $attribute_mapping[ $key ] ] = $value;
			}
		}

		// Apply the configuration.
		return Block_Configurator::configure_block(
			$post_id,
			$block_name,
			$new_attributes,
			$block_client_id,
			$update_all
		);
	}
}
