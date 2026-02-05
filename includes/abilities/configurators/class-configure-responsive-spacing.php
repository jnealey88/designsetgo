<?php
/**
 * Configure Responsive Spacing Ability.
 *
 * Sets responsive padding and margin overrides for tablet and mobile
 * breakpoints on container blocks (Section, Row, Grid, Card).
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.1.0
 */

namespace DesignSetGo\Abilities\Configurators;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Configurator;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Configure Responsive Spacing ability class.
 */
class Configure_Responsive_Spacing extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-responsive-spacing';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Configure Responsive Spacing', 'designsetgo' ),
			'description'         => __( 'Sets responsive padding and margin overrides for tablet and mobile breakpoints. Desktop spacing uses WordPress native style.spacing. Tablet (max-width: 1023px) and mobile (max-width: 767px) overrides are rendered as CSS media queries. Values follow a desktop-down inheritance cascade: tablet inherits desktop, mobile inherits tablet.', 'designsetgo' ),
			'thinking_message'    => __( 'Configuring responsive spacing...', 'designsetgo' ),
			'success_message'     => __( 'Responsive spacing configured successfully.', 'designsetgo' ),
			'category'            => 'blocks',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => Block_Configurator::get_default_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
		);
	}

	/**
	 * Get the spacing sides schema (top, right, bottom, left).
	 *
	 * @return array<string, mixed>
	 */
	private function get_spacing_sides_schema(): array {
		return array(
			'type'        => 'object',
			'description' => __( 'Spacing values for each side. Accepts CSS values (e.g., "20px", "2rem") or WordPress preset format (e.g., "var:preset|spacing|md").', 'designsetgo' ),
			'properties'  => array(
				'top'    => array(
					'type'        => 'string',
					'description' => __( 'Top spacing value', 'designsetgo' ),
				),
				'right'  => array(
					'type'        => 'string',
					'description' => __( 'Right spacing value', 'designsetgo' ),
				),
				'bottom' => array(
					'type'        => 'string',
					'description' => __( 'Bottom spacing value', 'designsetgo' ),
				),
				'left'   => array(
					'type'        => 'string',
					'description' => __( 'Left spacing value', 'designsetgo' ),
				),
			),
		);
	}

	/**
	 * Get input schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_input_schema(): array {
		$common       = Block_Configurator::get_common_input_schema();
		$sides_schema = $this->get_spacing_sides_schema();

		return array(
			'type'                 => 'object',
			'properties'           => array_merge(
				$common,
				array(
					'block_name'          => array(
						'type'        => 'string',
						'description' => __( 'Block type to configure. Supported: designsetgo/section, designsetgo/row, designsetgo/grid, designsetgo/card.', 'designsetgo' ),
						'enum'        => array(
							'designsetgo/section',
							'designsetgo/row',
							'designsetgo/grid',
							'designsetgo/card',
						),
					),
					'responsive_spacing'  => array(
						'type'        => 'object',
						'description' => __( 'Responsive spacing overrides for tablet and mobile. Desktop spacing should be set via the block style.spacing attribute. Tablet inherits from desktop unless overridden, mobile inherits from tablet unless overridden.', 'designsetgo' ),
						'properties'  => array(
							'tablet' => array(
								'type'        => 'object',
								'description' => __( 'Tablet overrides (max-width: 1023px). Omit to inherit from desktop.', 'designsetgo' ),
								'properties'  => array(
									'padding' => $sides_schema,
									'margin'  => $sides_schema,
								),
							),
							'mobile' => array(
								'type'        => 'object',
								'description' => __( 'Mobile overrides (max-width: 767px). Omit to inherit from tablet.', 'designsetgo' ),
								'properties'  => array(
									'padding' => $sides_schema,
									'margin'  => $sides_schema,
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
	 * Sanitize a spacing value.
	 *
	 * @param string $value Raw spacing value.
	 * @return string|false Sanitized value or false if invalid.
	 */
	private function sanitize_spacing_value( $value ) {
		if ( empty( $value ) || ! is_string( $value ) ) {
			return false;
		}

		// WordPress preset format.
		if ( 0 === strpos( $value, 'var:preset|' ) ) {
			$parts = explode( '|', str_replace( 'var:preset|', '', $value ) );
			foreach ( $parts as $part ) {
				if ( ! preg_match( '/^[a-zA-Z0-9_-]+$/', $part ) ) {
					return false;
				}
			}
			return $value;
		}

		// CSS variable.
		if ( preg_match( '/^var\(--[a-zA-Z0-9_-]+(?:--[a-zA-Z0-9_-]+)*\)$/', $value ) ) {
			return $value;
		}

		// Plain CSS value.
		if ( preg_match( '/^[0-9]+(\.[0-9]+)?(px|em|rem|%|vh|vw|ch|ex|cm|mm|in|pt|pc)$/', $value ) ) {
			return $value;
		}

		return false;
	}

	/**
	 * Sanitize spacing sides object.
	 *
	 * @param array<string, string> $sides Raw sides data.
	 * @return array<string, string> Sanitized sides.
	 */
	private function sanitize_spacing_sides( $sides ) {
		if ( ! is_array( $sides ) ) {
			return array();
		}

		$sanitized    = array();
		$valid_sides  = array( 'top', 'right', 'bottom', 'left' );

		foreach ( $valid_sides as $side ) {
			if ( ! empty( $sides[ $side ] ) ) {
				$value = $this->sanitize_spacing_value( $sides[ $side ] );
				if ( $value ) {
					$sanitized[ $side ] = $value;
				}
			}
		}

		return $sanitized;
	}

	/**
	 * Execute the ability.
	 *
	 * @param array<string, mixed> $input Input parameters.
	 * @return array<string, mixed>|WP_Error
	 */
	public function execute( array $input ) {
		$post_id            = (int) ( $input['post_id'] ?? 0 );
		$block_client_id    = $input['block_client_id'] ?? null;
		$update_all         = (bool) ( $input['update_all'] ?? false );
		$block_name         = $input['block_name'] ?? '';
		$responsive_spacing = $input['responsive_spacing'] ?? array();

		// Validate required parameters.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		if ( empty( $responsive_spacing ) ) {
			return $this->error(
				'missing_responsive_spacing',
				__( 'Responsive spacing settings are required.', 'designsetgo' )
			);
		}

		// Build the sanitized responsive spacing attribute.
		$sanitized_spacing = array();

		foreach ( array( 'tablet', 'mobile' ) as $device ) {
			if ( empty( $responsive_spacing[ $device ] ) || ! is_array( $responsive_spacing[ $device ] ) ) {
				continue;
			}

			$device_spacing = array();

			if ( ! empty( $responsive_spacing[ $device ]['padding'] ) ) {
				$padding = $this->sanitize_spacing_sides( $responsive_spacing[ $device ]['padding'] );
				if ( ! empty( $padding ) ) {
					$device_spacing['padding'] = $padding;
				}
			}

			if ( ! empty( $responsive_spacing[ $device ]['margin'] ) ) {
				$margin = $this->sanitize_spacing_sides( $responsive_spacing[ $device ]['margin'] );
				if ( ! empty( $margin ) ) {
					$device_spacing['margin'] = $margin;
				}
			}

			if ( ! empty( $device_spacing ) ) {
				$sanitized_spacing[ $device ] = $device_spacing;
			}
		}

		if ( empty( $sanitized_spacing ) ) {
			return $this->error(
				'invalid_spacing',
				__( 'No valid spacing values provided.', 'designsetgo' )
			);
		}

		$new_attributes = array(
			'dsgoResponsiveSpacing' => $sanitized_spacing,
		);

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
