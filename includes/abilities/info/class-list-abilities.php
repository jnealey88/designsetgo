<?php
/**
 * List Abilities Info Ability.
 *
 * Returns a manifest of all registered DesignSetGo abilities with their
 * names, descriptions, categories, and input schemas. Enables agent systems
 * to discover available tools at startup and generate tool definitions
 * dynamically.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.1.0
 */

namespace DesignSetGo\Abilities\Info;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Abilities_Registry;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * List Abilities info ability class.
 */
class List_Abilities extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/list-abilities';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'List DesignSetGo Abilities', 'designsetgo' ),
			'description'         => __( 'Returns a manifest of all registered DesignSetGo abilities with their names, descriptions, categories, and input schemas. Use this to discover what DesignSetGo can do.', 'designsetgo' ),
			'thinking_message'    => __( 'Retrieving available abilities...', 'designsetgo' ),
			'success_message'     => __( 'Successfully retrieved abilities list.', 'designsetgo' ),
			'category'            => 'info',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => $this->get_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
			'show_in_rest'        => true,
			'annotations'         => array(
				'readonly'     => true,
				'instructions' => 'Call this first to discover all available DesignSetGo abilities. Use category filter to narrow by type: inserter, configurator, generator, or info.',
			),
		);
	}

	/**
	 * Get input schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_input_schema(): array {
		return array(
			'type'                 => 'object',
			'properties'           => array(
				'category' => array(
					'type'        => 'string',
					'description' => __( 'Filter by ability category', 'designsetgo' ),
					'enum'        => array( 'all', 'inserter', 'configurator', 'generator', 'info' ),
					'default'     => 'all',
				),
			),
			'additionalProperties' => false,
		);
	}

	/**
	 * Get output schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'abilities' => array(
					'type'  => 'array',
					'items' => array(
						'type'       => 'object',
						'properties' => array(
							'name'         => array(
								'type'        => 'string',
								'description' => __( 'Ability name (e.g., designsetgo/insert-section)', 'designsetgo' ),
							),
							'label'        => array(
								'type'        => 'string',
								'description' => __( 'Human-readable label', 'designsetgo' ),
							),
							'description'  => array(
								'type'        => 'string',
								'description' => __( 'What this ability does', 'designsetgo' ),
							),
							'category'     => array(
								'type'        => 'string',
								'description' => __( 'Ability category: inserter, configurator, generator, or info', 'designsetgo' ),
							),
							'input_schema' => array(
								'type'        => 'object',
								'description' => __( 'Full JSON Schema for the ability inputs', 'designsetgo' ),
							),
						),
					),
				),
				'total'     => array(
					'type'        => 'integer',
					'description' => __( 'Total number of abilities returned', 'designsetgo' ),
				),
			),
		);
	}

	/**
	 * Permission callback.
	 *
	 * @return bool
	 */
	public function check_permission_callback(): bool {
		return $this->check_permission( 'read' );
	}

	/**
	 * Execute the ability.
	 *
	 * @param array<string, mixed> $input Input parameters.
	 * @return array<string, mixed>
	 */
	public function execute( array $input ): array {
		$category_filter = $input['category'] ?? 'all';

		$registry  = Abilities_Registry::get_instance();
		$abilities = $registry->get_abilities();
		$result    = array();

		foreach ( $abilities as $ability ) {
			$config   = $ability->get_config();
			$name     = $ability->get_name();
			$category = $this->infer_category( $name );

			// Filter by category if specified.
			if ( 'all' !== $category_filter && $category !== $category_filter ) {
				continue;
			}

			$result[] = array(
				'name'         => $name,
				'label'        => $config['label'] ?? $name,
				'description'  => $config['description'] ?? '',
				'category'     => $category,
				'input_schema' => $config['input_schema'] ?? array(),
			);
		}

		// Sort by category then name for consistent ordering.
		usort(
			$result,
			function ( $a, $b ) {
				$cat_cmp = strcmp( $a['category'], $b['category'] );
				if ( 0 !== $cat_cmp ) {
					return $cat_cmp;
				}
				return strcmp( $a['name'], $b['name'] );
			}
		);

		return array(
			'abilities' => $result,
			'total'     => count( $result ),
		);
	}

	/**
	 * Infer the ability category from its name.
	 *
	 * Uses naming conventions:
	 * - insert-* → inserter
	 * - configure-*, apply-*, batch-*, delete-* → configurator
	 * - generate-* → generator
	 * - list-*, get-*, find-* → info
	 *
	 * @param string $name Ability name (e.g., 'designsetgo/insert-section').
	 * @return string Category: inserter, configurator, generator, or info.
	 */
	private function infer_category( string $name ): string {
		// Remove namespace prefix.
		$short_name = str_replace( 'designsetgo/', '', $name );

		$prefix_map = array(
			'insert-'    => 'inserter',
			'configure-' => 'configurator',
			'apply-'     => 'configurator',
			'batch-'     => 'configurator',
			'delete-'    => 'configurator',
			'generate-'  => 'generator',
			'list-'      => 'info',
			'get-'       => 'info',
			'find-'      => 'info',
		);

		foreach ( $prefix_map as $prefix => $category ) {
			if ( 0 === strpos( $short_name, $prefix ) ) {
				return $category;
			}
		}

		return 'configurator';
	}
}
