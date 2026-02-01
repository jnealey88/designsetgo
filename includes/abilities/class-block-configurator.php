<?php
/**
 * Block Configurator helper for DesignSetGo abilities.
 *
 * Provides common functionality for updating block attributes,
 * finding blocks by client ID, and applying configurations.
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
 * Block Configurator helper class.
 */
class Block_Configurator {

	/**
	 * Update block attributes by block name or client ID.
	 *
	 * @param int                  $post_id Post ID.
	 * @param string               $block_name Block name to update (e.g., 'designsetgo/row').
	 * @param array<string, mixed> $attributes New attributes to merge.
	 * @param string|null          $client_id Optional. Specific block client ID to update.
	 * @param bool                 $update_all Whether to update all matching blocks or just the first.
	 * @return array<string, mixed>|WP_Error Success data or error.
	 */
	public static function update_block_attributes( int $post_id, string $block_name, array $attributes, ?string $client_id = null, bool $update_all = false ) {
		// Validate post.
		$post = get_post( $post_id );
		if ( ! $post ) {
			return new WP_Error(
				'invalid_post',
				__( 'Post not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		// Check permissions.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return new WP_Error(
				'permission_denied',
				__( 'You do not have permission to edit this post.', 'designsetgo' ),
				array( 'status' => 403 )
			);
		}

		// Parse blocks.
		$blocks = parse_blocks( $post->post_content );

		// Track if any blocks were updated.
		$updated_count = 0;

		// Update blocks.
		$blocks = self::walk_blocks(
			$blocks,
			function ( $block ) use ( $block_name, $attributes, $client_id, $update_all, &$updated_count ) {
				// Check if this block matches.
				if ( $block['blockName'] === $block_name ) {
					// If client_id is specified, check if it matches.
					if ( null !== $client_id ) {
						$block_client_id = $block['attrs']['clientId'] ?? '';
						if ( $block_client_id !== $client_id ) {
							return $block;
						}
					}

					// Merge attributes.
					$block['attrs'] = array_merge( $block['attrs'] ?? array(), $attributes );
					$updated_count++;

					// If not updating all, we can stop after first match.
					if ( ! $update_all && null === $client_id ) {
						return $block;
					}
				}

				return $block;
			}
		);

		if ( 0 === $updated_count ) {
			return new WP_Error(
				'block_not_found',
				__( 'No matching blocks found to update.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		// Serialize blocks back to content.
		$content = serialize_blocks( $blocks );

		// Update post.
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

		return array(
			'success'        => true,
			'post_id'        => $post->ID,
			'updated_count'  => $updated_count,
			'block_name'     => $block_name,
			'new_attributes' => $attributes,
		);
	}

	/**
	 * Walk through blocks recursively and apply a callback.
	 *
	 * @param array<int, array<string, mixed>> $blocks Blocks array.
	 * @param callable                         $callback Callback function to apply to each block.
	 * @return array<int, array<string, mixed>> Modified blocks.
	 */
	public static function walk_blocks( array $blocks, callable $callback ): array {
		$modified = array();

		foreach ( $blocks as $block ) {
			// Apply callback to current block.
			$block = $callback( $block );

			// Recursively walk inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$block['innerBlocks'] = self::walk_blocks( $block['innerBlocks'], $callback );
			}

			$modified[] = $block;
		}

		return $modified;
	}

	/**
	 * Find a block by client ID.
	 *
	 * @param array<int, array<string, mixed>> $blocks Blocks array.
	 * @param string                           $client_id Client ID to search for.
	 * @return array<string, mixed>|null Found block or null.
	 */
	public static function find_block_by_client_id( array $blocks, string $client_id ): ?array {
		foreach ( $blocks as $block ) {
			$block_client_id = $block['attrs']['clientId'] ?? '';

			if ( $block_client_id === $client_id ) {
				return $block;
			}

			// Search in inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$found = self::find_block_by_client_id( $block['innerBlocks'], $client_id );
				if ( null !== $found ) {
					return $found;
				}
			}
		}

		return null;
	}

	/**
	 * Find all blocks by block name.
	 *
	 * @param array<int, array<string, mixed>> $blocks Blocks array.
	 * @param string                           $block_name Block name to search for.
	 * @return array<int, array<string, mixed>> Found blocks.
	 */
	public static function find_blocks_by_name( array $blocks, string $block_name ): array {
		$found = array();

		foreach ( $blocks as $block ) {
			if ( $block['blockName'] === $block_name ) {
				$found[] = $block;
			}

			// Search in inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$found = array_merge( $found, self::find_blocks_by_name( $block['innerBlocks'], $block_name ) );
			}
		}

		return $found;
	}

	/**
	 * Sanitize configuration attributes.
	 *
	 * @param array<string, mixed> $attributes Attributes to sanitize.
	 * @return array<string, mixed> Sanitized attributes.
	 */
	public static function sanitize_attributes( array $attributes ): array {
		$sanitized = array();

		foreach ( $attributes as $key => $value ) {
			if ( is_string( $value ) ) {
				// Don't sanitize CSS values (they can contain special characters).
				if ( self::is_css_property( $key ) ) {
					$sanitized[ $key ] = wp_strip_all_tags( $value );
				} else {
					$sanitized[ $key ] = sanitize_text_field( $value );
				}
			} elseif ( is_array( $value ) ) {
				$sanitized[ $key ] = self::sanitize_attributes( $value );
			} elseif ( is_bool( $value ) || is_int( $value ) || is_float( $value ) || is_null( $value ) ) {
				$sanitized[ $key ] = $value;
			}
		}

		return $sanitized;
	}

	/**
	 * Check if a key is likely a CSS property.
	 *
	 * @param string $key Attribute key.
	 * @return bool
	 */
	private static function is_css_property( string $key ): bool {
		$css_properties = array(
			'color',
			'backgroundColor',
			'background',
			'border',
			'borderColor',
			'padding',
			'margin',
			'gap',
			'width',
			'height',
			'maxWidth',
			'minWidth',
			'fontSize',
			'fontFamily',
			'transform',
			'transition',
			'boxShadow',
			'textShadow',
		);

		return in_array( $key, $css_properties, true );
	}

	/**
	 * Get default configuration input schema.
	 *
	 * @return array<string, mixed> Common schema properties.
	 */
	public static function get_common_input_schema(): array {
		return array(
			'post_id'         => array(
				'type'        => 'integer',
				'description' => __( 'Target post ID', 'designsetgo' ),
				'required'    => true,
			),
			'block_client_id' => array(
				'type'        => 'string',
				'description' => __( 'Specific block client ID to update (optional)', 'designsetgo' ),
			),
			'update_all'      => array(
				'type'        => 'boolean',
				'description' => __( 'Whether to update all matching blocks or just the first', 'designsetgo' ),
				'default'     => false,
			),
		);
	}

	/**
	 * Configure a block with new attributes.
	 *
	 * Alias for update_block_attributes() for API consistency.
	 *
	 * @param int                  $post_id Post ID.
	 * @param string               $block_name Block name to update (e.g., 'designsetgo/row').
	 * @param array<string, mixed> $attributes New attributes to merge.
	 * @param string|null          $client_id Optional. Specific block client ID to update.
	 * @param bool                 $update_all Whether to update all matching blocks or just the first.
	 * @return array<string, mixed>|WP_Error Success data or error.
	 */
	public static function configure_block( int $post_id, string $block_name, array $attributes, ?string $client_id = null, bool $update_all = false ) {
		return self::update_block_attributes( $post_id, $block_name, $attributes, $client_id, $update_all );
	}

	/**
	 * Get default configuration output schema.
	 *
	 * @return array<string, mixed> Output schema.
	 */
	public static function get_default_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'success'        => array(
					'type'        => 'boolean',
					'description' => __( 'Whether the operation was successful', 'designsetgo' ),
				),
				'post_id'        => array(
					'type'        => 'integer',
					'description' => __( 'Post ID where blocks were updated', 'designsetgo' ),
				),
				'updated_count'  => array(
					'type'        => 'integer',
					'description' => __( 'Number of blocks updated', 'designsetgo' ),
				),
				'block_name'     => array(
					'type'        => 'string',
					'description' => __( 'Name of the block that was updated', 'designsetgo' ),
				),
				'new_attributes' => array(
					'type'        => 'object',
					'description' => __( 'New attributes that were applied', 'designsetgo' ),
				),
			),
			'required'   => array( 'success' ),
		);
	}

	/**
	 * Delete a block by client ID.
	 *
	 * @param array<int, array<string, mixed>> $blocks    Blocks array.
	 * @param string                           $client_id Client ID to find and delete.
	 * @return array{blocks: array, deleted: int, block_name: string|null}
	 */
	public static function delete_block_by_client_id( array $blocks, string $client_id ): array {
		$deleted    = 0;
		$block_name = null;

		$blocks = array_values(
			array_filter(
				$blocks,
				function ( &$block ) use ( $client_id, &$deleted, &$block_name ) {
					if ( isset( $block['attrs']['clientId'] ) && $block['attrs']['clientId'] === $client_id ) {
						$deleted++;
						$block_name = $block['blockName'];
						return false;
					}

					if ( ! empty( $block['innerBlocks'] ) ) {
						$result               = self::delete_block_by_client_id( $block['innerBlocks'], $client_id );
						$block['innerBlocks'] = $result['blocks'];
						$deleted             += $result['deleted'];
						if ( $result['block_name'] ) {
							$block_name = $result['block_name'];
						}
					}

					return true;
				}
			)
		);

		return array(
			'blocks'     => $blocks,
			'deleted'    => $deleted,
			'block_name' => $block_name,
		);
	}

	/**
	 * Delete first block matching name.
	 *
	 * @param array<int, array<string, mixed>> $blocks     Blocks array.
	 * @param string                           $block_name Block name to delete.
	 * @return array{blocks: array, deleted: int}
	 */
	public static function delete_first_block_by_name( array $blocks, string $block_name ): array {
		$deleted = 0;
		$found   = false;

		$blocks = array_values(
			array_filter(
				$blocks,
				function ( &$block ) use ( $block_name, &$deleted, &$found ) {
					if ( $found ) {
						return true;
					}

					if ( $block['blockName'] === $block_name ) {
						$deleted++;
						$found = true;
						return false;
					}

					if ( ! empty( $block['innerBlocks'] ) ) {
						$result               = self::delete_first_block_by_name( $block['innerBlocks'], $block_name );
						$block['innerBlocks'] = $result['blocks'];
						$deleted             += $result['deleted'];
						if ( $result['deleted'] > 0 ) {
							$found = true;
						}
					}

					return true;
				}
			)
		);

		return array(
			'blocks'  => $blocks,
			'deleted' => $deleted,
		);
	}

	/**
	 * Delete all blocks matching name.
	 *
	 * @param array<int, array<string, mixed>> $blocks     Blocks array.
	 * @param string                           $block_name Block name to delete.
	 * @return array{blocks: array, deleted: int}
	 */
	public static function delete_all_blocks_by_name( array $blocks, string $block_name ): array {
		$deleted = 0;

		$blocks = array_values(
			array_filter(
				$blocks,
				function ( &$block ) use ( $block_name, &$deleted ) {
					if ( $block['blockName'] === $block_name ) {
						$deleted++;
						return false;
					}

					if ( ! empty( $block['innerBlocks'] ) ) {
						$result               = self::delete_all_blocks_by_name( $block['innerBlocks'], $block_name );
						$block['innerBlocks'] = $result['blocks'];
						$deleted             += $result['deleted'];
					}

					return true;
				}
			)
		);

		return array(
			'blocks'  => $blocks,
			'deleted' => $deleted,
		);
	}

	/**
	 * Delete block at specific position.
	 *
	 * @param array<int, array<string, mixed>> $blocks     Blocks array.
	 * @param string                           $block_name Block name to match.
	 * @param int                              $position   Position to delete (0-indexed).
	 * @return array{blocks: array, deleted: int}
	 */
	public static function delete_block_at_position( array $blocks, string $block_name, int $position ): array {
		$current_position = 0;
		$deleted          = 0;

		$blocks = array_values(
			array_filter(
				$blocks,
				function ( $block ) use ( $block_name, $position, &$current_position, &$deleted ) {
					if ( $block['blockName'] === $block_name ) {
						if ( $current_position === $position ) {
							$deleted++;
							$current_position++;
							return false;
						}
						$current_position++;
					}
					return true;
				}
			)
		);

		return array(
			'blocks'  => $blocks,
			'deleted' => $deleted,
		);
	}
}
