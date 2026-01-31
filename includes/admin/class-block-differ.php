<?php
/**
 * Block Differ Class
 *
 * Computes differences between block arrays for revision comparison.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

namespace DesignSetGo\Admin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block_Differ Class
 *
 * Handles block-level diff computation for visual revision comparison.
 *
 * Note: The diff algorithm has O(n×m) complexity where n and m are block counts.
 * For posts with 100+ blocks, comparison may be noticeably slower.
 */
class Block_Differ {

	/**
	 * Compute differences between two block arrays
	 *
	 * Compares top-level blocks and highlights any block that has changes
	 * (including changes to nested innerBlocks).
	 *
	 * @param array $from_blocks From revision blocks.
	 * @param array $to_blocks   To revision blocks.
	 * @return array Changes array with 'type', 'from_index', 'to_index', 'block_name'.
	 */
	public function compute_diff( $from_blocks, $to_blocks ) {
		$changes = array();

		// Track which blocks have been matched.
		$matched_from = array();
		$matched_to   = array();

		// Phase 1: Match identical blocks (same type AND content).
		foreach ( $from_blocks as $from_idx => $from_block ) {
			foreach ( $to_blocks as $to_idx => $to_block ) {
				if ( isset( $matched_to[ $to_idx ] ) ) {
					continue;
				}

				// Check if blocks are identical.
				if ( $this->blocks_are_identical( $from_block, $to_block ) ) {
					$matched_from[ $from_idx ] = $to_idx;
					$matched_to[ $to_idx ]     = $from_idx;
					break;
				}
			}
		}

		// Phase 2: Match remaining blocks by type and position (detect modifications).
		$unmatched_from = array_diff( array_keys( $from_blocks ), array_keys( $matched_from ) );
		$unmatched_to   = array_diff( array_keys( $to_blocks ), array_keys( $matched_to ) );

		foreach ( $unmatched_from as $from_idx ) {
			$from_block = $from_blocks[ $from_idx ];
			$best_match = null;
			$best_score = -1;

			foreach ( $unmatched_to as $to_idx ) {
				if ( isset( $matched_to[ $to_idx ] ) ) {
					continue;
				}

				$to_block = $to_blocks[ $to_idx ];

				// Only match blocks of the same type.
				if ( $from_block['blockName'] !== $to_block['blockName'] ) {
					continue;
				}

				// Calculate similarity score based on position proximity.
				$position_diff = abs( $from_idx - $to_idx );
				$score         = 100 - ( $position_diff * 10 );

				if ( $score > $best_score ) {
					$best_score = $score;
					$best_match = $to_idx;
				}
			}

			// Match if we found a candidate of same type.
			if ( null !== $best_match ) {
				$matched_from[ $from_idx ] = $best_match;
				$matched_to[ $best_match ] = $from_idx;

				// This is a changed block.
				$changes[] = array(
					'type'       => 'changed',
					'from_index' => $from_idx,
					'to_index'   => $best_match,
					'block_name' => $from_block['blockName'],
				);
			}
		}

		// Find removed blocks (in from but not matched) - mark as changed.
		foreach ( $from_blocks as $idx => $block ) {
			if ( ! isset( $matched_from[ $idx ] ) ) {
				$changes[] = array(
					'type'       => 'changed',
					'from_index' => $idx,
					'block_name' => $block['blockName'],
				);
			}
		}

		// Find added blocks (in to but not matched) - mark as changed.
		foreach ( $to_blocks as $idx => $block ) {
			if ( ! isset( $matched_to[ $idx ] ) ) {
				$changes[] = array(
					'type'       => 'changed',
					'to_index'   => $idx,
					'block_name' => $block['blockName'],
				);
			}
		}

		return $changes;
	}

	/**
	 * Check if two blocks are identical
	 *
	 * @param array $block_a First block.
	 * @param array $block_b Second block.
	 * @return bool True if identical.
	 */
	private function blocks_are_identical( $block_a, $block_b ) {
		if ( $block_a['blockName'] !== $block_b['blockName'] ) {
			return false;
		}

		$content_a = $block_a['innerHTML'] ?? '';
		$content_b = $block_b['innerHTML'] ?? '';

		if ( $content_a !== $content_b ) {
			return false;
		}

		$attrs_a = $block_a['attrs'] ?? array();
		$attrs_b = $block_b['attrs'] ?? array();

		if ( wp_json_encode( $attrs_a ) !== wp_json_encode( $attrs_b ) ) {
			return false;
		}

		// Compare innerBlocks recursively.
		$inner_a = $block_a['innerBlocks'] ?? array();
		$inner_b = $block_b['innerBlocks'] ?? array();

		if ( count( $inner_a ) !== count( $inner_b ) ) {
			return false;
		}

		foreach ( $inner_a as $idx => $inner_block_a ) {
			if ( ! isset( $inner_b[ $idx ] ) ) {
				return false;
			}
			if ( ! $this->blocks_are_identical( $inner_block_a, $inner_b[ $idx ] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Compare attributes between two blocks
	 *
	 * @param array $from_block From block.
	 * @param array $to_block   To block.
	 * @return array Changed attribute names.
	 */
	public function compare_attributes( $from_block, $to_block ) {
		$from_attrs = $from_block['attrs'] ?? array();
		$to_attrs   = $to_block['attrs'] ?? array();
		$changes    = array();

		// Check for modified or removed attributes.
		foreach ( $from_attrs as $key => $value ) {
			if ( ! isset( $to_attrs[ $key ] ) ) {
				$changes[] = $key . ' (removed)';
			} elseif ( $to_attrs[ $key ] !== $value ) {
				$changes[] = $key;
			}
		}

		// Check for added attributes.
		foreach ( $to_attrs as $key => $value ) {
			if ( ! isset( $from_attrs[ $key ] ) ) {
				$changes[] = $key . ' (added)';
			}
		}

		// Also check innerHTML changes.
		if ( ( $from_block['innerHTML'] ?? '' ) !== ( $to_block['innerHTML'] ?? '' ) ) {
			$changes[] = 'content';
		}

		return $changes;
	}
}
