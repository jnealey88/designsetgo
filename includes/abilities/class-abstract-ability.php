<?php
/**
 * Abstract base class for DesignSetGo abilities.
 *
 * Provides common functionality for all abilities including registration,
 * permission checks, validation, and sanitization.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities;

use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Abstract base class for abilities.
 */
abstract class Abstract_Ability {

	/**
	 * Get the unique name for this ability.
	 *
	 * Should be in the format 'designsetgo/ability-name'.
	 *
	 * @return string
	 */
	abstract public function get_name(): string;

	/**
	 * Get the configuration array for this ability.
	 *
	 * Should return an array with keys:
	 * - label: Human-readable name
	 * - description: What this ability does
	 * - thinking_message: Message shown while executing
	 * - success_message: Message shown on success
	 * - input_schema: JSON Schema for inputs
	 * - output_schema: JSON Schema for outputs
	 * - permission_callback: Callable for permission check
	 * - meta: Additional metadata (category, etc.)
	 *
	 * @return array<string, mixed>
	 */
	abstract public function get_config(): array;

	/**
	 * Execute the ability with the given input.
	 *
	 * @param array<string, mixed> $input Input parameters.
	 * @return array<string, mixed>|WP_Error Result data or error.
	 */
	abstract public function execute( array $input );

	/**
	 * Register this ability with WordPress.
	 *
	 * @return void
	 */
	public function register(): void {
		if ( ! function_exists( 'wp_register_ability' ) ) {
			return;
		}

		$config                     = $this->get_config();
		$config['execute_callback'] = array( $this, 'execute' );

		// Ensure ability is exposed in REST API.
		if ( ! isset( $config['meta'] ) ) {
			$config['meta'] = array();
		}
		if ( ! isset( $config['meta']['show_in_rest'] ) ) {
			$config['meta']['show_in_rest'] = true;
		}

		wp_register_ability( $this->get_name(), $config );
	}

	/**
	 * Check if the current user has the required permission.
	 *
	 * @param string $capability Required capability. Default 'edit_posts'.
	 * @return bool
	 */
	protected function check_permission( string $capability = 'edit_posts' ): bool {
		return current_user_can( $capability );
	}

	/**
	 * Validate post ID and return the post object.
	 *
	 * @param int $post_id Post ID to validate.
	 * @return \WP_Post|WP_Error Post object or error.
	 */
	protected function validate_post( int $post_id ) {
		$post = get_post( $post_id );

		if ( ! $post ) {
			return new WP_Error(
				'invalid_post',
				__( 'Post not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		return $post;
	}

	/**
	 * Sanitize block attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @return array<string, mixed>
	 */
	protected function sanitize_attributes( array $attributes ): array {
		$sanitized = array();

		foreach ( $attributes as $key => $value ) {
			if ( is_string( $value ) ) {
				$sanitized[ $key ] = sanitize_text_field( $value );
			} elseif ( is_array( $value ) ) {
				$sanitized[ $key ] = $this->sanitize_attributes( $value );
			} elseif ( is_bool( $value ) || is_int( $value ) || is_float( $value ) ) {
				$sanitized[ $key ] = $value;
			}
		}

		return $sanitized;
	}

	/**
	 * Create a success response.
	 *
	 * @param array<string, mixed> $data Response data.
	 * @return array<string, mixed>
	 */
	protected function success( array $data = array() ): array {
		return array_merge(
			array( 'success' => true ),
			$data
		);
	}

	/**
	 * Create an error response.
	 *
	 * Ensures all errors have a proper HTTP status code for REST API consistency.
	 *
	 * @param string               $code Error code.
	 * @param string               $message Error message.
	 * @param array<string, mixed> $data Additional error data.
	 * @return WP_Error
	 */
	protected function error( string $code, string $message, array $data = array() ): WP_Error {
		// Ensure HTTP status code is set for REST API responses.
		if ( ! isset( $data['status'] ) ) {
			$data['status'] = $this->get_default_status_for_error( $code );
		}

		return new WP_Error( $code, $message, $data );
	}

	/**
	 * Get the default HTTP status code for a given error code.
	 *
	 * @param string $code Error code.
	 * @return int HTTP status code.
	 */
	private function get_default_status_for_error( string $code ): int {
		$status_map = array(
			'invalid_post'       => 404,
			'post_not_found'     => 404,
			'block_not_found'    => 404,
			'not_found'          => 404,
			'permission_denied'  => 403,
			'rest_forbidden'     => 403,
			'unauthorized'       => 401,
			'missing_post_id'    => 400,
			'missing_block_name' => 400,
			'missing_settings'   => 400,
			'missing_animation'  => 400,
			'missing_faqs'       => 400,
			'missing_css'        => 400,
			'invalid_input'      => 400,
			'validation_failed'  => 400,
		);

		return $status_map[ $code ] ?? 400; // Default to Bad Request.
	}

	/**
	 * Create a permission denied error.
	 *
	 * Standardized method for returning permission errors with proper status codes.
	 *
	 * @param string $message Optional custom message.
	 * @return WP_Error
	 */
	protected function permission_error( string $message = '' ): WP_Error {
		if ( empty( $message ) ) {
			$message = __( 'Sorry, you are not allowed to perform this action.', 'designsetgo' );
		}

		return new WP_Error(
			'rest_forbidden',
			$message,
			array( 'status' => rest_authorization_required_code() )
		);
	}

	/**
	 * Validate input against the ability's input schema.
	 *
	 * Uses WordPress REST API schema validation when available.
	 *
	 * @param array<string, mixed> $input Input to validate.
	 * @return true|WP_Error True if valid, WP_Error otherwise.
	 */
	protected function validate_input( array $input ) {
		$config = $this->get_config();

		if ( empty( $config['input_schema'] ) ) {
			return true;
		}

		$schema = $config['input_schema'];

		// Check required fields - presence check only.
		// Uses array_key_exists() to allow falsy values (0, false, '', '0', null).
		// Type validation (int, bool, string, etc.) is handled separately below
		// via rest_validate_value_from_schema() which will reject invalid types.
		if ( isset( $schema['required'] ) && is_array( $schema['required'] ) ) {
			foreach ( $schema['required'] as $required_field ) {
				if ( ! array_key_exists( $required_field, $input ) ) {
					return $this->error(
						'missing_' . $required_field,
						sprintf(
							/* translators: %s: Field name */
							__( 'Missing required field: %s', 'designsetgo' ),
							$required_field
						)
					);
				}
			}
		}

		// Use WordPress REST API validation if available.
		if ( function_exists( 'rest_validate_value_from_schema' ) && isset( $schema['properties'] ) ) {
			foreach ( $input as $key => $value ) {
				if ( isset( $schema['properties'][ $key ] ) ) {
					$valid = rest_validate_value_from_schema( $value, $schema['properties'][ $key ], $key );
					if ( is_wp_error( $valid ) ) {
						return $this->error(
							'validation_failed',
							$valid->get_error_message(),
							array( 'field' => $key )
						);
					}
				}
			}
		}

		return true;
	}

	/**
	 * Parse and serialize blocks for post content.
	 *
	 * @param string $content Post content with blocks.
	 * @return array<int, array<string, mixed>>
	 */
	protected function parse_blocks( string $content ): array {
		return parse_blocks( $content );
	}

	/**
	 * Serialize blocks back to post content.
	 *
	 * @param array<int, array<string, mixed>> $blocks Blocks array.
	 * @return string
	 */
	protected function serialize_blocks( array $blocks ): string {
		return serialize_blocks( $blocks );
	}

	/**
	 * Insert a block into a post.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $block_markup Block markup.
	 * @param int    $position Position to insert (-1 for append, 0 for prepend).
	 * @return array<string, mixed>|WP_Error
	 */
	protected function insert_block( int $post_id, string $block_markup, int $position = -1 ) {
		$post = $this->validate_post( $post_id );

		if ( is_wp_error( $post ) ) {
			return $post;
		}

		$blocks    = $this->parse_blocks( $post->post_content );
		$new_block = $this->parse_blocks( $block_markup )[0];

		if ( -1 === $position ) {
			$blocks[] = $new_block;
		} else {
			array_splice( $blocks, $position, 0, array( $new_block ) );
		}

		$content = $this->serialize_blocks( $blocks );

		$updated = wp_update_post(
			array(
				'ID'           => $post->ID,
				'post_content' => $content,
			),
			true
		);

		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		return $this->success(
			array(
				'post_id'  => $post->ID,
				'block_id' => wp_unique_id( 'block-' ),
			)
		);
	}

	/**
	 * Build block markup from block name and attributes.
	 *
	 * @param string                           $block_name Block name (e.g., 'designsetgo/row').
	 * @param array<string, mixed>             $attributes Block attributes.
	 * @param array<int, array<string, mixed>> $inner_blocks Inner blocks.
	 * @return string
	 */
	protected function build_block_markup( string $block_name, array $attributes = array(), array $inner_blocks = array() ): string {
		$attrs_json = ! empty( $attributes ) ? ' ' . wp_json_encode( $attributes ) : '';
		$markup     = '<!-- wp:' . $block_name . $attrs_json;

		if ( ! empty( $inner_blocks ) ) {
			$markup .= " -->\n";
			foreach ( $inner_blocks as $inner ) {
				$markup .= $this->build_block_markup(
					$inner['name'],
					$inner['attributes'] ?? array(),
					$inner['innerBlocks'] ?? array()
				);
			}
			$markup .= '<!-- /wp:' . $block_name . ' -->';
		} else {
			$markup .= ' /-->';
		}

		return $markup;
	}
}
