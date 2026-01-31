<?php
/**
 * Revision REST API Class
 *
 * Handles REST API endpoints for visual revision comparison.
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
 * Revision_REST_API Class
 *
 * Registers and handles REST API routes for revision comparison.
 */
class Revision_REST_API {

	/**
	 * Block differ instance
	 *
	 * @var Block_Differ
	 */
	private $differ;

	/**
	 * Revision renderer instance
	 *
	 * @var Revision_Renderer
	 */
	private $renderer;

	/**
	 * Performance warning threshold for diff
	 */
	const DIFF_WARNING_THRESHOLD = 200;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->differ   = new Block_Differ();
		$this->renderer = new Revision_Renderer();
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST API routes
	 */
	public function register_routes() {
		$id_arg = array(
			'required'          => true,
			'validate_callback' => function ( $param ) {
				return is_numeric( $param );
			},
			'sanitize_callback' => 'absint',
		);

		register_rest_route(
			'designsetgo/v1',
			'/revisions/(?P<post_id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_revisions' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array( 'post_id' => $id_arg ),
			)
		);

		register_rest_route(
			'designsetgo/v1',
			'/revisions/render/(?P<revision_id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'render_revision' ),
				'permission_callback' => array( $this, 'check_revision_permission' ),
				'args'                => array( 'revision_id' => $id_arg ),
			)
		);

		register_rest_route(
			'designsetgo/v1',
			'/revisions/diff/(?P<from_id>\d+)/(?P<to_id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_diff' ),
				'permission_callback' => array( $this, 'check_diff_permission' ),
				'args'                => array(
					'from_id' => $id_arg,
					'to_id'   => $id_arg,
				),
			)
		);

		register_rest_route(
			'designsetgo/v1',
			'/revisions/restore/(?P<revision_id>\d+)',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'restore_revision' ),
				'permission_callback' => array( $this, 'check_restore_permission' ),
				'args'                => array( 'revision_id' => $id_arg ),
			)
		);
	}

	/**
	 * Check permission for listing revisions
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool True if user has permission.
	 */
	public function check_permission( $request ) {
		return current_user_can( 'edit_post', $request->get_param( 'post_id' ) );
	}

	/**
	 * Check permission for rendering a revision
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool True if user has permission.
	 */
	public function check_revision_permission( $request ) {
		$parent_id = $this->get_post_parent_id( $request->get_param( 'revision_id' ) );
		return $parent_id && current_user_can( 'edit_post', $parent_id );
	}

	/**
	 * Check permission for diff endpoint
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool True if user has permission.
	 */
	public function check_diff_permission( $request ) {
		$from_parent = $this->get_post_parent_id( $request->get_param( 'from_id' ) );
		$to_parent   = $this->get_post_parent_id( $request->get_param( 'to_id' ) );

		// Both must exist and belong to the same post.
		if ( ! $from_parent || ! $to_parent || $from_parent !== $to_parent ) {
			return false;
		}

		return current_user_can( 'edit_post', $from_parent );
	}

	/**
	 * Check permission for restore endpoint
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool True if user has permission.
	 */
	public function check_restore_permission( $request ) {
		$revision = wp_get_post_revision( $request->get_param( 'revision_id' ) );
		return $revision && current_user_can( 'edit_post', $revision->post_parent );
	}

	/**
	 * Get parent post ID for a revision or post
	 *
	 * @param int $id Post or revision ID.
	 * @return int|false Parent post ID or false.
	 */
	private function get_post_parent_id( $id ) {
		$revision = wp_get_post_revision( $id );
		if ( $revision ) {
			return $revision->post_parent;
		}

		$post = get_post( $id );
		return ( $post && 'revision' !== $post->post_type ) ? $post->ID : false;
	}

	/**
	 * Get revisions for a post
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_revisions( $request ) {
		$post_id   = $request->get_param( 'post_id' );
		$revisions = wp_get_post_revisions( $post_id );

		if ( empty( $revisions ) ) {
			return rest_ensure_response( array(
				'post_id'   => $post_id,
				'revisions' => array(),
			) );
		}

		$revision_data = array_map( array( $this, 'format_revision' ), $revisions );

		// Add current post as the latest "revision".
		$post = get_post( $post_id );
		array_unshift( $revision_data, $this->format_post_as_revision( $post ) );

		return rest_ensure_response( array(
			'post_id'   => $post_id,
			'post_type' => get_post_type( $post_id ),
			'revisions' => $revision_data,
		) );
	}

	/**
	 * Format a revision for API response
	 *
	 * @param \WP_Post $revision Revision post object.
	 * @return array Formatted revision data.
	 */
	private function format_revision( $revision ) {
		$author = get_userdata( (int) $revision->post_author );

		return array(
			'id'          => $revision->ID,
			'date'        => $revision->post_date,
			'date_gmt'    => $revision->post_date_gmt,
			'modified'    => $revision->post_modified,
			'author'      => array(
				'id'     => $revision->post_author,
				'name'   => $author ? $author->display_name : __( 'Unknown', 'designsetgo' ),
				'avatar' => get_avatar_url( $revision->post_author, array( 'size' => 32 ) ),
			),
			'is_autosave' => wp_is_post_autosave( $revision->ID ) !== false,
			'restore_url' => wp_nonce_url(
				admin_url( 'revision.php?action=restore&revision=' . $revision->ID ),
				'restore-post_' . $revision->ID
			),
		);
	}

	/**
	 * Format a post as a revision (for current version)
	 *
	 * @param \WP_Post $post Post object.
	 * @return array Formatted revision data.
	 */
	private function format_post_as_revision( $post ) {
		$author = get_userdata( (int) $post->post_author );

		return array(
			'id'          => $post->ID,
			'date'        => $post->post_date,
			'date_gmt'    => $post->post_date_gmt,
			'modified'    => $post->post_modified,
			'author'      => array(
				'id'     => $post->post_author,
				'name'   => $author ? $author->display_name : __( 'Unknown', 'designsetgo' ),
				'avatar' => get_avatar_url( $post->post_author, array( 'size' => 32 ) ),
			),
			'is_autosave' => false,
			'is_current'  => true,
		);
	}

	/**
	 * Render a revision as HTML
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function render_revision( $request ) {
		$result = $this->renderer->render( $request->get_param( 'revision_id' ) );
		return is_wp_error( $result ) ? $result : rest_ensure_response( $result );
	}

	/**
	 * Get diff between two revisions
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_diff( $request ) {
		$from_post = get_post( $request->get_param( 'from_id' ) );
		$to_post   = get_post( $request->get_param( 'to_id' ) );

		if ( ! $from_post || ! $to_post ) {
			return new \WP_Error(
				'revision_not_found',
				__( 'One or both revisions not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		$from_blocks = $this->get_valid_blocks( $from_post->post_content );
		$to_blocks   = $this->get_valid_blocks( $to_post->post_content );
		$changes     = $this->differ->compute_diff( $from_blocks, $to_blocks );

		$response = array(
			'from_id' => $request->get_param( 'from_id' ),
			'to_id'   => $request->get_param( 'to_id' ),
			'changes' => $changes,
			'summary' => array( 'total' => count( $changes ) ),
		);

		// Add performance warning for large block counts.
		$total_blocks = count( $from_blocks ) + count( $to_blocks );
		if ( $total_blocks > self::DIFF_WARNING_THRESHOLD ) {
			$response['performance_warning'] = sprintf(
				/* translators: %d: total number of blocks being compared */
				__( 'Comparing %d blocks total. This may take a moment.', 'designsetgo' ),
				$total_blocks
			);
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Get valid (non-empty) blocks from content
	 *
	 * @param string $content Post content.
	 * @return array Valid blocks.
	 */
	private function get_valid_blocks( $content ) {
		return array_values( array_filter(
			parse_blocks( $content ),
			function ( $block ) {
				return ! empty( $block['blockName'] );
			}
		) );
	}

	/**
	 * Restore a revision
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function restore_revision( $request ) {
		$revision_id = $request->get_param( 'revision_id' );
		$revision    = wp_get_post_revision( $revision_id );

		if ( ! $revision ) {
			return new \WP_Error(
				'revision_not_found',
				__( 'Revision not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		$restored = wp_restore_post_revision( $revision_id );

		if ( ! $restored ) {
			return new \WP_Error(
				'restore_failed',
				__( 'Failed to restore revision.', 'designsetgo' ),
				array( 'status' => 500 )
			);
		}

		return rest_ensure_response( array(
			'success'  => true,
			'post_id'  => $revision->post_parent,
			'edit_url' => get_edit_post_link( $revision->post_parent, 'raw' ) ?? '',
		) );
	}
}
