<?php
/**
 * Insert Map Ability.
 *
 * Inserts a Map block for displaying interactive maps with markers,
 * supporting OpenStreetMap with customizable styling.
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
 * Insert Map ability class.
 */
class Insert_Map extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-map';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Map', 'designsetgo' ),
			'description'         => __( 'Inserts an interactive Map block with OpenStreetMap. Supports custom markers, zoom levels, and map styling. Perfect for contact pages and location displays.', 'designsetgo' ),
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
						'description' => __( 'Map attributes', 'designsetgo' ),
						'properties'  => array(
							'dsgoLat'          => array(
								'type'        => 'number',
								'description' => __( 'Map center latitude', 'designsetgo' ),
								'default'     => 40.7128,
							),
							'dsgoLng'          => array(
								'type'        => 'number',
								'description' => __( 'Map center longitude', 'designsetgo' ),
								'default'     => -74.006,
							),
							'dsgoZoom'         => array(
								'type'        => 'number',
								'description' => __( 'Map zoom level (1-20)', 'designsetgo' ),
								'default'     => 14,
								'minimum'     => 1,
								'maximum'     => 20,
							),
							'dsgoHeight'       => array(
								'type'        => 'string',
								'description' => __( 'Map height (e.g., "400px", "50vh")', 'designsetgo' ),
								'default'     => '400px',
							),
							'dsgoMapStyle'     => array(
								'type'        => 'string',
								'description' => __( 'Map tile style', 'designsetgo' ),
								'enum'        => array( 'default', 'light', 'dark', 'satellite' ),
								'default'     => 'default',
							),
							'dsgoMarkers'      => array(
								'type'        => 'array',
								'description' => __( 'Map markers', 'designsetgo' ),
								'items'       => array(
									'type'       => 'object',
									'properties' => array(
										'lat'   => array(
											'type'        => 'number',
											'description' => __( 'Marker latitude', 'designsetgo' ),
										),
										'lng'   => array(
											'type'        => 'number',
											'description' => __( 'Marker longitude', 'designsetgo' ),
										),
										'title' => array(
											'type'        => 'string',
											'description' => __( 'Marker popup title', 'designsetgo' ),
										),
									),
								),
							),
							'dsgoScrollWheel'  => array(
								'type'        => 'boolean',
								'description' => __( 'Enable scroll wheel zoom', 'designsetgo' ),
								'default'     => false,
							),
							'dsgoDraggable'    => array(
								'type'        => 'boolean',
								'description' => __( 'Enable map dragging', 'designsetgo' ),
								'default'     => true,
							),
							'dsgoShowControls' => array(
								'type'        => 'boolean',
								'description' => __( 'Show zoom controls', 'designsetgo' ),
								'default'     => true,
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
				__( 'Sorry, you are not allowed to insert maps.', 'designsetgo' ),
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

		// Insert the block (Map doesn't have inner blocks).
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/map',
			$attributes,
			array(),
			$position
		);
	}
}
