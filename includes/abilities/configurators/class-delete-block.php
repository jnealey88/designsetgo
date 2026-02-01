<?php
/**
 * Delete Block Ability.
 *
 * Removes blocks from a post by block name or client ID.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Configurators;

use DesignSetGo\Abilities\Abstract_Ability;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Delete Block ability class.
 */
class Delete_Block extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/delete-block';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Delete Block', 'designsetgo' ),
			'description'         => __( 'Removes blocks from a post by block name or client ID. Can delete first match, specific block, or all matching blocks.', 'designsetgo' ),
			'thinking_message'    => __( 'Removing block(s)...', 'designsetgo' ),
			'success_message'     => __( 'Block(s) deleted successfully.', 'designsetgo' ),
			'category'            => 'blocks',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => $this->get_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
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
				'post_id'         => array(
					'type'        => 'integer',
					'description' => __( 'Post ID to remove blocks from', 'designsetgo' ),
				),
				'block_name'      => array(
					'type'        => 'string',
					'description' => __( 'Block name to delete (e.g., "designsetgo/accordion")', 'designsetgo' ),
				),
				'block_client_id' => array(
					'type'        => 'string',
					'description' => __( 'Specific block client ID to delete (takes precedence over block_name)', 'designsetgo' ),
				),
				'delete_all'      => array(
					'type'        => 'boolean',
					'description' => __( 'Delete all matching blocks (only when using block_name)', 'designsetgo' ),
					'default'     => false,
				),
				'position'        => array(
					'type'        => 'integer',
					'description' => __( 'Delete block at specific position (0-indexed, only when using block_name)', 'designsetgo' ),
				),
			),
			'required'             => array( 'post_id' ),
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
				'success'       => array(
					'type'        => 'boolean',
					'description' => __( 'Whether the deletion succeeded', 'designsetgo' ),
				),
				'post_id'       => array(
					'type'        => 'integer',
					'description' => __( 'The post ID', 'designsetgo' ),
				),
				'deleted_count' => array(
					'type'        => 'integer',
					'description' => __( 'Number of blocks deleted', 'designsetgo' ),
				),
				'block_name'    => array(
					'type'        => 'string',
					'description' => __( 'Block name that was deleted', 'designsetgo' ),
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
		$block_name      = $input['block_name'] ?? '';
		$block_client_id = $input['block_client_id'] ?? null;
		$delete_all      = (bool) ( $input['delete_all'] ?? false );
		$position        = isset( $input['position'] ) ? (int) $input['position'] : null;

		// Validate post ID.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		// Need either block_name or block_client_id.
		if ( empty( $block_name ) && empty( $block_client_id ) ) {
			return $this->error(
				'missing_block_identifier',
				__( 'Either block_name or block_client_id is required.', 'designsetgo' )
			);
		}

		// Validate post exists.
		$post = get_post( $post_id );
		if ( ! $post ) {
			return $this->error(
				'invalid_post',
				__( 'Post not found.', 'designsetgo' )
			);
		}

		// Check permission for this specific post.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return $this->permission_error();
		}

		// Parse blocks.
		$blocks = parse_blocks( $post->post_content );

		// Track deleted count.
		$deleted_count = 0;
		$target_block_name = $block_name;

		// Delete by client ID (specific block).
		if ( $block_client_id ) {
			$result = $this->delete_block_by_client_id( $blocks, $block_client_id );
			$blocks = $result['blocks'];
			$deleted_count = $result['deleted'];
			$target_block_name = $result['block_name'] ?? $block_name;
		}
		// Delete by block name.
		elseif ( $block_name ) {
			if ( null !== $position ) {
				// Delete at specific position.
				$result = $this->delete_block_at_position( $blocks, $block_name, $position );
			} elseif ( $delete_all ) {
				// Delete all matching.
				$result = $this->delete_all_blocks_by_name( $blocks, $block_name );
			} else {
				// Delete first match.
				$result = $this->delete_first_block_by_name( $blocks, $block_name );
			}

			$blocks = $result['blocks'];
			$deleted_count = $result['deleted'];
		}

		// Check if any blocks were deleted.
		if ( 0 === $deleted_count ) {
			return $this->error(
				'block_not_found',
				__( 'No matching blocks found to delete.', 'designsetgo' )
			);
		}

		// Serialize and update post.
		$content = serialize_blocks( $blocks );

		$updated = wp_update_post(
			array(
				'ID'           => $post_id,
				'post_content' => $content,
			),
			true
		);

		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		return array(
			'success'       => true,
			'post_id'       => $post_id,
			'deleted_count' => $deleted_count,
			'block_name'    => $target_block_name,
		);
	}

	/**
	 * Delete a block by client ID.
	 *
	 * @param array<int, array<string, mixed>> $blocks    Blocks array.
	 * @param string                           $client_id Client ID to find and delete.
	 * @return array{blocks: array, deleted: int, block_name: string|null}
	 */
	private function delete_block_by_client_id( array $blocks, string $client_id ): array {
		$deleted = 0;
		$block_name = null;

		$blocks = array_values( array_filter(
			$blocks,
			function ( &$block ) use ( $client_id, &$deleted, &$block_name ) {
				// Check if this block matches.
				if ( isset( $block['attrs']['clientId'] ) && $block['attrs']['clientId'] === $client_id ) {
					$deleted++;
					$block_name = $block['blockName'];
					return false;
				}

				// Check inner blocks.
				if ( ! empty( $block['innerBlocks'] ) ) {
					$result = $this->delete_block_by_client_id( $block['innerBlocks'], $client_id );
					$block['innerBlocks'] = $result['blocks'];
					$deleted += $result['deleted'];
					if ( $result['block_name'] ) {
						$block_name = $result['block_name'];
					}
				}

				return true;
			}
		) );

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
	private function delete_first_block_by_name( array $blocks, string $block_name ): array {
		$deleted = 0;
		$found = false;

		$blocks = array_values( array_filter(
			$blocks,
			function ( &$block ) use ( $block_name, &$deleted, &$found ) {
				if ( $found ) {
					return true;
				}

				// Check if this block matches.
				if ( $block['blockName'] === $block_name ) {
					$deleted++;
					$found = true;
					return false;
				}

				// Check inner blocks.
				if ( ! empty( $block['innerBlocks'] ) ) {
					$result = $this->delete_first_block_by_name( $block['innerBlocks'], $block_name );
					$block['innerBlocks'] = $result['blocks'];
					$deleted += $result['deleted'];
					if ( $result['deleted'] > 0 ) {
						$found = true;
					}
				}

				return true;
			}
		) );

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
	private function delete_all_blocks_by_name( array $blocks, string $block_name ): array {
		$deleted = 0;

		$blocks = array_values( array_filter(
			$blocks,
			function ( &$block ) use ( $block_name, &$deleted ) {
				// Check if this block matches.
				if ( $block['blockName'] === $block_name ) {
					$deleted++;
					return false;
				}

				// Check inner blocks.
				if ( ! empty( $block['innerBlocks'] ) ) {
					$result = $this->delete_all_blocks_by_name( $block['innerBlocks'], $block_name );
					$block['innerBlocks'] = $result['blocks'];
					$deleted += $result['deleted'];
				}

				return true;
			}
		) );

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
	private function delete_block_at_position( array $blocks, string $block_name, int $position ): array {
		$current_position = 0;
		$deleted = 0;

		$blocks = array_values( array_filter(
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
		) );

		return array(
			'blocks'  => $blocks,
			'deleted' => $deleted,
		);
	}
}
