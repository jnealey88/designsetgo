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
		$found_first   = false;

		// Update blocks.
		$blocks = self::walk_blocks(
			$blocks,
			function ( $block ) use ( $block_name, $attributes, $client_id, $update_all, &$updated_count, &$found_first ) {
				// Check if this block matches.
				if ( $block['blockName'] === $block_name ) {
					// If client_id is specified, check if it matches.
					if ( null !== $client_id ) {
						$block_client_id = $block['attrs']['clientId'] ?? '';
						if ( $block_client_id !== $client_id ) {
							return $block;
						}
					}

					// If not updating all, skip after first match.
					if ( ! $update_all && null === $client_id && $found_first ) {
						return $block;
					}

					// Merge attributes.
					$block['attrs'] = array_merge( $block['attrs'] ?? array(), $attributes );
					$updated_count++;
					$found_first = true;
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
			'block_index'     => array(
				'type'        => 'integer',
				'description' => __( 'Document-order index of the block to update (from get-post-blocks). Alternative to block_client_id.', 'designsetgo' ),
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
	 * Update a block's attributes by document-order index.
	 *
	 * Walks the block tree in depth-first order, counting each block.
	 * When the target index is reached, merges the provided attributes.
	 * Optionally validates the block name matches for safety.
	 *
	 * @param int                  $post_id             Post ID.
	 * @param int                  $block_index         Document-order index of the target block.
	 * @param array<string, mixed> $attributes          Attributes to merge.
	 * @param string               $expected_block_name Optional. If provided, validates the block at this index has this name.
	 * @return array<string, mixed>|WP_Error Success data or error.
	 */
	public static function update_block_by_index( int $post_id, int $block_index, array $attributes, string $expected_block_name = '' ) {
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

		// Walk blocks in document order and update at the target index.
		$counter      = 0;
		$updated      = false;
		$matched_name = '';

		$blocks = self::walk_blocks_with_index(
			$blocks,
			$block_index,
			$attributes,
			$expected_block_name,
			$counter,
			$updated,
			$matched_name
		);

		if ( ! $updated ) {
			if ( ! empty( $matched_name ) && '' !== $expected_block_name && $matched_name !== $expected_block_name ) {
				return new WP_Error(
					'block_name_mismatch',
					sprintf(
						/* translators: 1: expected block name, 2: actual block name, 3: block index */
						__( 'Expected block "%1$s" at index %3$d, but found "%2$s".', 'designsetgo' ),
						$expected_block_name,
						$matched_name,
						$block_index
					),
					array( 'status' => 400 )
				);
			}

			return new WP_Error(
				'block_not_found',
				sprintf(
					/* translators: %d: block index */
					__( 'No block found at index %d.', 'designsetgo' ),
					$block_index
				),
				array( 'status' => 404 )
			);
		}

		// Serialize blocks back to content.
		$content = serialize_blocks( $blocks );

		// Update post.
		$result = wp_update_post(
			array(
				'ID'           => $post->ID,
				'post_content' => $content,
			),
			true
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return array(
			'success'        => true,
			'post_id'        => $post->ID,
			'updated_count'  => 1,
			'block_name'     => $matched_name,
			'block_index'    => $block_index,
			'new_attributes' => $attributes,
		);
	}

	/**
	 * Walk blocks in document order and update the block at the target index.
	 *
	 * @param array<int, array<string, mixed>> $blocks              Blocks array.
	 * @param int                              $target_index        Target document-order index.
	 * @param array<string, mixed>             $attributes          Attributes to merge.
	 * @param string                           $expected_block_name Expected block name for validation.
	 * @param int                              $counter             Current counter (by reference).
	 * @param bool                             $updated             Whether a block was updated (by reference).
	 * @param string                           $matched_name        Name of block found at index (by reference).
	 * @return array<int, array<string, mixed>> Modified blocks.
	 */
	private static function walk_blocks_with_index( array $blocks, int $target_index, array $attributes, string $expected_block_name, int &$counter, bool &$updated, string &$matched_name ): array {
		$modified = array();

		foreach ( $blocks as $block ) {
			if ( ! empty( $block['blockName'] ) && ! $updated ) {
				if ( $counter === $target_index ) {
					$matched_name = $block['blockName'];

					// Validate block name if expected name provided.
					if ( '' !== $expected_block_name && $block['blockName'] !== $expected_block_name ) {
						$counter++;
						$modified[] = $block;
						continue;
					}

					// Merge attributes.
					$block['attrs'] = array_merge( $block['attrs'] ?? array(), $attributes );
					$updated        = true;
				}

				$counter++;
			}

			// Recursively walk inner blocks.
			if ( ! empty( $block['innerBlocks'] ) && ! $updated ) {
				$block['innerBlocks'] = self::walk_blocks_with_index(
					$block['innerBlocks'],
					$target_index,
					$attributes,
					$expected_block_name,
					$counter,
					$updated,
					$matched_name
				);
			}

			$modified[] = $block;
		}

		return $modified;
	}

	/**
	 * Insert a block as a child of an existing block identified by document-order index.
	 *
	 * Critical: Updates both innerBlocks AND innerContent on the parent block.
	 * WordPress parsed blocks use innerContent to interleave HTML strings with null
	 * placeholders for inner block positions. If innerContent is not updated,
	 * serialize_blocks() will silently drop the new block.
	 *
	 * @param int                              $post_id            Post ID.
	 * @param int                              $parent_block_index Document-order index of the parent block.
	 * @param string                           $block_name         Block type to insert.
	 * @param array<string, mixed>             $attributes         Block attributes.
	 * @param array<int, array<string, mixed>> $inner_blocks       Inner blocks of the new block.
	 * @param int                              $position           Position within parent's inner blocks (-1 = append).
	 * @return array<string, mixed>|WP_Error Success data or error.
	 */
	public static function insert_inner_block( int $post_id, int $parent_block_index, string $block_name, array $attributes = array(), array $inner_blocks = array(), int $position = -1 ) {
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

		// Build the new block using Block_Inserter markup generation then parse it.
		$new_block_markup = Block_Inserter::build_block_markup( $block_name, $attributes, $inner_blocks );
		$parsed           = parse_blocks( $new_block_markup );
		$new_block        = $parsed[0];

		// Parse existing blocks.
		$blocks = parse_blocks( $post->post_content );

		// Find and update the parent block.
		$counter = 0;
		$found   = false;

		$blocks = self::insert_into_parent_block(
			$blocks,
			$parent_block_index,
			$new_block,
			$position,
			$counter,
			$found
		);

		if ( ! $found ) {
			return new WP_Error(
				'block_not_found',
				sprintf(
					/* translators: %d: block index */
					__( 'No parent block found at index %d.', 'designsetgo' ),
					$parent_block_index
				),
				array( 'status' => 404 )
			);
		}

		// Serialize blocks back to content.
		$content = serialize_blocks( $blocks );

		// Update post.
		$result = wp_update_post(
			array(
				'ID'           => $post->ID,
				'post_content' => $content,
			),
			true
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return array(
			'success'            => true,
			'post_id'            => $post->ID,
			'parent_block_index' => $parent_block_index,
			'block_name'         => $block_name,
			'position'           => $position,
			'note'               => __( 'Block inserted as child. Open the post in the WordPress editor to validate and save.', 'designsetgo' ),
		);
	}

	/**
	 * Recursively find a parent block by index and insert a child block.
	 *
	 * Updates both innerBlocks and innerContent arrays on the parent.
	 *
	 * @param array<int, array<string, mixed>> $blocks       Blocks array.
	 * @param int                              $target_index Target parent block index.
	 * @param array<string, mixed>             $new_block    New block to insert.
	 * @param int                              $position     Position within parent (-1 = append).
	 * @param int                              $counter      Document-order counter (by reference).
	 * @param bool                             $found        Whether the parent was found (by reference).
	 * @return array<int, array<string, mixed>> Modified blocks.
	 */
	private static function insert_into_parent_block( array $blocks, int $target_index, array $new_block, int $position, int &$counter, bool &$found ): array {
		$modified = array();

		foreach ( $blocks as $block ) {
			if ( ! empty( $block['blockName'] ) && ! $found ) {
				if ( $counter === $target_index ) {
					// Found the parent block - insert the new block as a child.
					$inner_blocks  = $block['innerBlocks'] ?? array();
					$inner_content = $block['innerContent'] ?? array();

					if ( -1 === $position || $position >= count( $inner_blocks ) ) {
						// Append to end.
						$inner_blocks[] = $new_block;

						// Find last non-null entry position in innerContent and insert null after it.
						// This places the new inner block placeholder at the end (before closing HTML).
						$insert_pos = count( $inner_content );
						// If there's closing HTML (last entry is a string), insert before it.
						if ( ! empty( $inner_content ) && is_string( end( $inner_content ) ) ) {
							$insert_pos = count( $inner_content ) - 1;
						}
						array_splice( $inner_content, $insert_pos, 0, array( null ) );
					} else {
						// Insert at specific position.
						array_splice( $inner_blocks, $position, 0, array( $new_block ) );

						// Find the corresponding position in innerContent.
						// Count null entries to find where the Nth inner block placeholder is.
						$null_count       = 0;
						$content_position = 0;
						foreach ( $inner_content as $idx => $entry ) {
							if ( null === $entry ) {
								if ( $null_count === $position ) {
									$content_position = $idx;
									break;
								}
								$null_count++;
							}
						}
						array_splice( $inner_content, $content_position, 0, array( null ) );
					}

					$block['innerBlocks']  = $inner_blocks;
					$block['innerContent'] = $inner_content;
					$found                 = true;
				}

				$counter++;
			}

			// Recursively search inner blocks.
			if ( ! empty( $block['innerBlocks'] ) && ! $found ) {
				$block['innerBlocks'] = self::insert_into_parent_block(
					$block['innerBlocks'],
					$target_index,
					$new_block,
					$position,
					$counter,
					$found
				);
			}

			$modified[] = $block;
		}

		return $modified;
	}

	/**
	 * Delete a block by client ID.
	 *
	 * @param array<int, array<string, mixed>> $blocks    Blocks array.
	 * @param string                           $client_id Client ID to find and delete.
	 * @return array{blocks: array, deleted: int, block_name: string|null}
	 */
	public static function delete_block_by_client_id( array $blocks, string $client_id ): array {
		$result_blocks = array();
		$deleted       = 0;
		$block_name    = null;

		foreach ( $blocks as $block ) {
			// Check if this block matches the client ID.
			if ( isset( $block['attrs']['clientId'] ) && $block['attrs']['clientId'] === $client_id ) {
				$deleted++;
				$block_name = $block['blockName'];
				continue; // Skip this block (delete it).
			}

			// Recursively process inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$inner_result         = self::delete_block_by_client_id( $block['innerBlocks'], $client_id );
				$block['innerBlocks'] = $inner_result['blocks'];
				$deleted             += $inner_result['deleted'];
				if ( $inner_result['block_name'] ) {
					$block_name = $inner_result['block_name'];
				}
			}

			$result_blocks[] = $block;
		}

		return array(
			'blocks'     => $result_blocks,
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
		$result_blocks = array();
		$deleted       = 0;
		$found         = false;

		foreach ( $blocks as $block ) {
			// If already found, just keep remaining blocks.
			if ( $found ) {
				$result_blocks[] = $block;
				continue;
			}

			// Check if this block matches the name.
			if ( $block['blockName'] === $block_name ) {
				$deleted++;
				$found = true;
				continue; // Skip this block (delete it).
			}

			// Recursively process inner blocks if not yet found.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$inner_result         = self::delete_first_block_by_name( $block['innerBlocks'], $block_name );
				$block['innerBlocks'] = $inner_result['blocks'];
				$deleted             += $inner_result['deleted'];
				if ( $inner_result['deleted'] > 0 ) {
					$found = true;
				}
			}

			$result_blocks[] = $block;
		}

		return array(
			'blocks'  => $result_blocks,
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
		$result_blocks = array();
		$deleted       = 0;

		foreach ( $blocks as $block ) {
			// Check if this block matches the name.
			if ( $block['blockName'] === $block_name ) {
				$deleted++;
				continue; // Skip this block (delete it).
			}

			// Recursively process inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$inner_result         = self::delete_all_blocks_by_name( $block['innerBlocks'], $block_name );
				$block['innerBlocks'] = $inner_result['blocks'];
				$deleted             += $inner_result['deleted'];
			}

			$result_blocks[] = $block;
		}

		return array(
			'blocks'  => $result_blocks,
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
		$result_blocks    = array();
		$current_position = 0;
		$deleted          = 0;

		foreach ( $blocks as $block ) {
			if ( $block['blockName'] === $block_name ) {
				if ( $current_position === $position ) {
					$deleted++;
					$current_position++;
					continue; // Skip this block (delete it).
				}
				$current_position++;
			}

			$result_blocks[] = $block;
		}

		return array(
			'blocks'  => $result_blocks,
			'deleted' => $deleted,
		);
	}
}
