<?php
/**
 * Draft Mode Class
 *
 * Provides "draft mode" functionality for published pages, allowing users
 * to work on changes without affecting the live site until ready to publish.
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
 * Draft Mode Class - Manages draft versions of published pages
 */
class Draft_Mode {
	/**
	 * Meta key for storing original post ID on draft.
	 */
	const META_DRAFT_OF = '_dsgo_draft_of';

	/**
	 * Meta key for storing draft post ID on original.
	 */
	const META_HAS_DRAFT = '_dsgo_has_draft';

	/**
	 * Meta key for storing draft creation timestamp.
	 */
	const META_DRAFT_CREATED = '_dsgo_draft_created';

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
		add_filter( 'page_row_actions', array( $this, 'add_row_actions' ), 10, 2 );
		add_filter( 'manage_pages_columns', array( $this, 'add_draft_status_column' ) );
		add_action( 'manage_pages_custom_column', array( $this, 'render_draft_status_column' ), 10, 2 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
		add_action( 'before_delete_post', array( $this, 'cleanup_draft_meta' ) );
	}

	/**
	 * Register REST API routes
	 */
	public function register_rest_routes() {
		// Create draft of a published page.
		register_rest_route(
			'designsetgo/v1',
			'/draft-mode/create',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'create_draft_endpoint' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'post_id' => array(
						'required'          => true,
						'type'              => 'integer',
						'sanitize_callback' => 'absint',
						'description'       => __( 'The ID of the published page to create a draft of.', 'designsetgo' ),
					),
					'content' => array(
						'required'          => false,
						'type'              => 'string',
						'description'       => __( 'Optional content to use instead of published content (captures unsaved edits).', 'designsetgo' ),
					),
					'title' => array(
						'required'          => false,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
						'description'       => __( 'Optional title to use instead of published title.', 'designsetgo' ),
					),
					'excerpt' => array(
						'required'          => false,
						'type'              => 'string',
						'description'       => __( 'Optional excerpt to use instead of published excerpt.', 'designsetgo' ),
					),
				),
			)
		);

		// Publish (merge) a draft into original.
		register_rest_route(
			'designsetgo/v1',
			'/draft-mode/(?P<id>\d+)/publish',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'publish_draft_endpoint' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'id' => array(
						'required'          => true,
						'type'              => 'integer',
						'sanitize_callback' => 'absint',
						'description'       => __( 'The draft post ID.', 'designsetgo' ),
					),
				),
			)
		);

		// Discard a draft.
		register_rest_route(
			'designsetgo/v1',
			'/draft-mode/(?P<id>\d+)',
			array(
				'methods'             => 'DELETE',
				'callback'            => array( $this, 'discard_draft_endpoint' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'id' => array(
						'required'          => true,
						'type'              => 'integer',
						'sanitize_callback' => 'absint',
						'description'       => __( 'The draft post ID.', 'designsetgo' ),
					),
				),
			)
		);

		// Get draft status for a post.
		register_rest_route(
			'designsetgo/v1',
			'/draft-mode/status/(?P<post_id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_status_endpoint' ),
				'permission_callback' => array( $this, 'check_read_permission' ),
				'args'                => array(
					'post_id' => array(
						'required'          => true,
						'type'              => 'integer',
						'sanitize_callback' => 'absint',
						'description'       => __( 'The post ID to check status for.', 'designsetgo' ),
					),
				),
			)
		);
	}

	/**
	 * Check permission for draft operations
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool|\WP_Error True if user has permission.
	 */
	public function check_permission( $request ) {
		if ( ! current_user_can( 'publish_posts' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'You do not have permission to manage drafts.', 'designsetgo' ),
				array( 'status' => 403 )
			);
		}

		// Verify nonce for write operations.
		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new \WP_Error(
				'rest_invalid_nonce',
				__( 'Invalid security token.', 'designsetgo' ),
				array( 'status' => 403 )
			);
		}

		return true;
	}

	/**
	 * Check read permission
	 *
	 * @return bool True if user has permission.
	 */
	public function check_read_permission() {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Create draft endpoint
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function create_draft_endpoint( $request ) {
		$post_id = $request->get_param( 'post_id' );

		// Optional content overrides (captures unsaved edits).
		$overrides = array(
			'content' => $request->get_param( 'content' ),
			'title'   => $request->get_param( 'title' ),
			'excerpt' => $request->get_param( 'excerpt' ),
		);

		// Remove null values.
		$overrides = array_filter( $overrides, function( $v ) { return null !== $v; } );

		$result = $this->create_draft( $post_id, $overrides );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		$draft_post = get_post( $result );

		return rest_ensure_response(
			array(
				'success'      => true,
				'draft_id'     => $result,
				'edit_url'     => get_edit_post_link( $result, 'raw' ),
				'message'      => __( 'Draft created successfully.', 'designsetgo' ),
				'draft_title'  => $draft_post->post_title,
				'original_id'  => $post_id,
			)
		);
	}

	/**
	 * Publish draft endpoint
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function publish_draft_endpoint( $request ) {
		$draft_id = $request->get_param( 'id' );

		$result = $this->publish_draft( $draft_id );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response(
			array(
				'success'     => true,
				'original_id' => $result,
				'edit_url'    => get_edit_post_link( $result, 'raw' ),
				'view_url'    => get_permalink( $result ),
				'message'     => __( 'Changes published successfully.', 'designsetgo' ),
			)
		);
	}

	/**
	 * Discard draft endpoint
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function discard_draft_endpoint( $request ) {
		$draft_id = $request->get_param( 'id' );

		$result = $this->discard_draft( $draft_id );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response(
			array(
				'success'     => true,
				'original_id' => $result,
				'message'     => __( 'Draft discarded.', 'designsetgo' ),
			)
		);
	}

	/**
	 * Get status endpoint
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_status_endpoint( $request ) {
		$post_id = $request->get_param( 'post_id' );
		$post    = get_post( $post_id );

		if ( ! $post ) {
			return rest_ensure_response(
				array(
					'exists'     => false,
					'is_draft'   => false,
					'has_draft'  => false,
					'draft_id'   => null,
					'original_id' => null,
				)
			);
		}

		// Check if this post is a draft of another.
		$original_id = get_post_meta( $post_id, self::META_DRAFT_OF, true );

		if ( $original_id ) {
			// This IS a draft.
			$original = get_post( $original_id );
			return rest_ensure_response(
				array(
					'exists'            => true,
					'is_draft'          => true,
					'has_draft'         => false,
					'draft_id'          => $post_id,
					'original_id'       => (int) $original_id,
					'original_title'    => $original ? $original->post_title : '',
					'original_edit_url' => $original ? get_edit_post_link( $original_id, 'raw' ) : '',
					'original_view_url' => $original ? get_permalink( $original_id ) : '',
					'draft_created'     => get_post_meta( $post_id, self::META_DRAFT_CREATED, true ),
				)
			);
		}

		// Check if this post has a draft.
		$draft_id = get_post_meta( $post_id, self::META_HAS_DRAFT, true );

		if ( $draft_id ) {
			$draft = get_post( $draft_id );
			// Verify the draft still exists and is actually a draft.
			if ( $draft && 'draft' === $draft->post_status ) {
				return rest_ensure_response(
					array(
						'exists'         => true,
						'is_draft'       => false,
						'has_draft'      => true,
						'draft_id'       => (int) $draft_id,
						'draft_edit_url' => get_edit_post_link( $draft_id, 'raw' ),
						'original_id'    => $post_id,
						'draft_created'  => get_post_meta( $draft_id, self::META_DRAFT_CREATED, true ),
					)
				);
			} else {
				// Draft no longer exists, clean up meta.
				delete_post_meta( $post_id, self::META_HAS_DRAFT );
			}
		}

		// This is a regular post with no draft relationship.
		return rest_ensure_response(
			array(
				'exists'         => true,
				'is_draft'       => false,
				'has_draft'      => false,
				'draft_id'       => null,
				'original_id'    => null,
				'can_create'     => 'page' === $post->post_type && 'publish' === $post->post_status,
			)
		);
	}

	/**
	 * Create a draft copy of a published page
	 *
	 * @param int   $post_id   The published post ID.
	 * @param array $overrides Optional content overrides (title, content, excerpt) to capture unsaved edits.
	 * @return int|\WP_Error Draft post ID on success, WP_Error on failure.
	 */
	public function create_draft( $post_id, $overrides = array() ) {
		$post = get_post( $post_id );

		// Validation.
		if ( ! $post ) {
			return new \WP_Error(
				'invalid_post',
				__( 'Post not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		if ( 'page' !== $post->post_type ) {
			return new \WP_Error(
				'invalid_post_type',
				__( 'Draft mode is only available for pages.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		if ( 'publish' !== $post->post_status ) {
			return new \WP_Error(
				'invalid_status',
				__( 'Only published pages can have a draft version.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Check if draft already exists.
		if ( $this->has_draft( $post_id ) ) {
			$existing_draft_id = get_post_meta( $post_id, self::META_HAS_DRAFT, true );
			return new \WP_Error(
				'draft_exists',
				__( 'A draft version already exists for this page.', 'designsetgo' ),
				array(
					'status'   => 400,
					'draft_id' => $existing_draft_id,
				)
			);
		}

		// Create draft copy - use overrides if provided (captures unsaved edits).
		$draft_data = array(
			'post_title'   => isset( $overrides['title'] ) ? $overrides['title'] : $post->post_title,
			'post_content' => isset( $overrides['content'] ) ? $overrides['content'] : $post->post_content,
			'post_excerpt' => isset( $overrides['excerpt'] ) ? $overrides['excerpt'] : $post->post_excerpt,
			'post_status'  => 'draft',
			'post_type'    => 'page',
			'post_author'  => get_current_user_id(),
			'post_parent'  => $post->post_parent,
			'menu_order'   => $post->menu_order,
		);

		$draft_id = wp_insert_post( $draft_data, true );

		if ( is_wp_error( $draft_id ) ) {
			return $draft_id;
		}

		// Copy post meta.
		$this->copy_post_meta( $post_id, $draft_id );

		// Copy featured image.
		$thumbnail_id = get_post_thumbnail_id( $post_id );
		if ( $thumbnail_id ) {
			set_post_thumbnail( $draft_id, $thumbnail_id );
		}

		// Set draft relationship meta.
		update_post_meta( $draft_id, self::META_DRAFT_OF, $post_id );
		update_post_meta( $draft_id, self::META_DRAFT_CREATED, current_time( 'mysql' ) );
		update_post_meta( $post_id, self::META_HAS_DRAFT, $draft_id );

		/**
		 * Fires after a draft is created.
		 *
		 * @param int $draft_id    The new draft post ID.
		 * @param int $original_id The original published post ID.
		 */
		do_action( 'designsetgo_draft_created', $draft_id, $post_id );

		return $draft_id;
	}

	/**
	 * Publish (merge) a draft into its original post
	 *
	 * @param int $draft_id The draft post ID.
	 * @return int|\WP_Error Original post ID on success, WP_Error on failure.
	 */
	public function publish_draft( $draft_id ) {
		$draft = get_post( $draft_id );

		if ( ! $draft ) {
			return new \WP_Error(
				'invalid_draft',
				__( 'Draft not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		$original_id = get_post_meta( $draft_id, self::META_DRAFT_OF, true );

		if ( ! $original_id ) {
			return new \WP_Error(
				'not_a_draft',
				__( 'This post is not a draft version.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		$original = get_post( $original_id );

		if ( ! $original ) {
			return new \WP_Error(
				'original_not_found',
				__( 'The original page no longer exists.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		// Update original post content.
		$update_data = array(
			'ID'           => $original_id,
			'post_title'   => $draft->post_title,
			'post_content' => $draft->post_content,
			'post_excerpt' => $draft->post_excerpt,
		);

		$result = wp_update_post( $update_data, true );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		// Sync post meta from draft to original.
		$this->sync_post_meta( $draft_id, $original_id );

		// Sync featured image.
		$draft_thumbnail = get_post_thumbnail_id( $draft_id );
		if ( $draft_thumbnail ) {
			set_post_thumbnail( $original_id, $draft_thumbnail );
		} else {
			delete_post_thumbnail( $original_id );
		}

		// Clean up relationship meta.
		delete_post_meta( $original_id, self::META_HAS_DRAFT );

		/**
		 * Fires after a draft is published (merged into original).
		 *
		 * @param int $original_id The original published post ID.
		 * @param int $draft_id    The draft post ID (about to be deleted).
		 */
		do_action( 'designsetgo_draft_published', $original_id, $draft_id );

		// Delete the draft post.
		wp_delete_post( $draft_id, true );

		return $original_id;
	}

	/**
	 * Discard a draft without publishing
	 *
	 * @param int $draft_id The draft post ID.
	 * @return int|\WP_Error Original post ID on success, WP_Error on failure.
	 */
	public function discard_draft( $draft_id ) {
		$draft = get_post( $draft_id );

		if ( ! $draft ) {
			return new \WP_Error(
				'invalid_draft',
				__( 'Draft not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		$original_id = get_post_meta( $draft_id, self::META_DRAFT_OF, true );

		if ( ! $original_id ) {
			return new \WP_Error(
				'not_a_draft',
				__( 'This post is not a draft version.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Clean up relationship meta on original.
		delete_post_meta( $original_id, self::META_HAS_DRAFT );

		/**
		 * Fires after a draft is discarded.
		 *
		 * @param int $draft_id    The draft post ID (about to be deleted).
		 * @param int $original_id The original published post ID.
		 */
		do_action( 'designsetgo_draft_discarded', $draft_id, $original_id );

		// Delete the draft post.
		wp_delete_post( $draft_id, true );

		return $original_id;
	}

	/**
	 * Get the draft for a published post
	 *
	 * @param int $post_id The published post ID.
	 * @return \WP_Post|null Draft post or null.
	 */
	public function get_draft( $post_id ) {
		$draft_id = get_post_meta( $post_id, self::META_HAS_DRAFT, true );

		if ( ! $draft_id ) {
			return null;
		}

		$draft = get_post( $draft_id );

		if ( ! $draft || 'draft' !== $draft->post_status ) {
			// Draft no longer exists or is not a draft, clean up.
			delete_post_meta( $post_id, self::META_HAS_DRAFT );
			return null;
		}

		return $draft;
	}

	/**
	 * Check if a post has an active draft
	 *
	 * @param int $post_id The post ID.
	 * @return bool True if draft exists.
	 */
	public function has_draft( $post_id ) {
		return null !== $this->get_draft( $post_id );
	}

	/**
	 * Copy post meta from one post to another
	 *
	 * @param int $source_id Source post ID.
	 * @param int $target_id Target post ID.
	 */
	private function copy_post_meta( $source_id, $target_id ) {
		$meta = get_post_meta( $source_id );

		// Meta keys to exclude from copying.
		$excluded_keys = array(
			'_edit_lock',
			'_edit_last',
			self::META_DRAFT_OF,
			self::META_HAS_DRAFT,
			self::META_DRAFT_CREATED,
			'_wp_old_slug',
			'_wp_old_date',
		);

		/**
		 * Filter the meta keys to copy when creating a draft.
		 *
		 * @param array $excluded_keys Keys to exclude from copying.
		 * @param int   $source_id     Source post ID.
		 */
		$excluded_keys = apply_filters( 'designsetgo_draft_excluded_meta_keys', $excluded_keys, $source_id );

		foreach ( $meta as $key => $values ) {
			if ( in_array( $key, $excluded_keys, true ) ) {
				continue;
			}

			foreach ( $values as $value ) {
				add_post_meta( $target_id, $key, maybe_unserialize( $value ) );
			}
		}
	}

	/**
	 * Sync post meta from draft to original (for publishing)
	 *
	 * @param int $draft_id    Draft post ID.
	 * @param int $original_id Original post ID.
	 */
	private function sync_post_meta( $draft_id, $original_id ) {
		// Keys to preserve on original (not overwrite).
		$preserve_keys = array(
			'_edit_lock',
			'_edit_last',
			self::META_DRAFT_OF,
			self::META_HAS_DRAFT,
			self::META_DRAFT_CREATED,
			'_wp_old_slug',
			'_wp_old_date',
			'_wp_page_template',
		);

		/**
		 * Filter the meta keys to preserve on the original when publishing.
		 *
		 * @param array $preserve_keys Keys to preserve (not overwrite).
		 * @param int   $original_id   Original post ID.
		 */
		$preserve_keys = apply_filters( 'designsetgo_draft_preserve_meta_keys', $preserve_keys, $original_id );

		// Get draft meta.
		$draft_meta = get_post_meta( $draft_id );

		// Get original meta keys (to detect deletions).
		$original_meta = get_post_meta( $original_id );

		// Delete meta that exists on original but not on draft (except preserved).
		foreach ( array_keys( $original_meta ) as $key ) {
			if ( in_array( $key, $preserve_keys, true ) ) {
				continue;
			}
			if ( ! isset( $draft_meta[ $key ] ) ) {
				delete_post_meta( $original_id, $key );
			}
		}

		// Copy/update meta from draft to original.
		foreach ( $draft_meta as $key => $values ) {
			if ( in_array( $key, $preserve_keys, true ) ) {
				continue;
			}

			// Delete existing values on original.
			delete_post_meta( $original_id, $key );

			// Add values from draft.
			foreach ( $values as $value ) {
				add_post_meta( $original_id, $key, maybe_unserialize( $value ) );
			}
		}
	}

	/**
	 * Add row actions to page list
	 *
	 * @param array    $actions Existing actions.
	 * @param \WP_Post $post    Post object.
	 * @return array Modified actions.
	 */
	public function add_row_actions( $actions, $post ) {
		if ( 'page' !== $post->post_type ) {
			return $actions;
		}

		if ( ! current_user_can( 'publish_posts' ) ) {
			return $actions;
		}

		// Check if this is a draft of another post.
		$original_id = get_post_meta( $post->ID, self::META_DRAFT_OF, true );
		if ( $original_id ) {
			// This is a draft - add publish/discard actions.
			$original = get_post( $original_id );
			if ( $original ) {
				$actions['dsgo_view_original'] = sprintf(
					'<a href="%s">%s</a>',
					esc_url( get_permalink( $original_id ) ),
					esc_html__( 'View Live', 'designsetgo' )
				);
			}
			return $actions;
		}

		// Check if published page has a draft.
		if ( 'publish' === $post->post_status ) {
			$draft = $this->get_draft( $post->ID );

			if ( $draft ) {
				// Has draft - show "Edit Draft" action.
				$actions['dsgo_edit_draft'] = sprintf(
					'<a href="%s" style="color: #2271b1; font-weight: 500;">%s</a>',
					esc_url( get_edit_post_link( $draft->ID, 'raw' ) ),
					esc_html__( 'Edit Draft', 'designsetgo' )
				);
			} else {
				// No draft - show "Create Draft" action.
				$actions['dsgo_create_draft'] = sprintf(
					'<a href="#" class="dsgo-create-draft" data-post-id="%d" data-nonce="%s">%s</a>',
					$post->ID,
					wp_create_nonce( 'wp_rest' ),
					esc_html__( 'Create Draft', 'designsetgo' )
				);
			}
		}

		return $actions;
	}

	/**
	 * Add draft status column to pages list
	 *
	 * @param array $columns Existing columns.
	 * @return array Modified columns.
	 */
	public function add_draft_status_column( $columns ) {
		// Insert after title column.
		$new_columns = array();
		foreach ( $columns as $key => $value ) {
			$new_columns[ $key ] = $value;
			if ( 'title' === $key ) {
				$new_columns['dsgo_draft_status'] = __( 'Draft Status', 'designsetgo' );
			}
		}
		return $new_columns;
	}

	/**
	 * Render draft status column
	 *
	 * @param string $column_name Column name.
	 * @param int    $post_id     Post ID.
	 */
	public function render_draft_status_column( $column_name, $post_id ) {
		if ( 'dsgo_draft_status' !== $column_name ) {
			return;
		}

		$post = get_post( $post_id );

		// Check if this post is a draft of another.
		$original_id = get_post_meta( $post_id, self::META_DRAFT_OF, true );
		if ( $original_id ) {
			$original = get_post( $original_id );
			if ( $original ) {
				printf(
					'<span class="dsgo-draft-badge dsgo-draft-badge--is-draft" title="%s">%s</span>',
					esc_attr( sprintf( __( 'Draft of: %s', 'designsetgo' ), $original->post_title ) ),
					esc_html__( 'Draft Version', 'designsetgo' )
				);
			}
			return;
		}

		// Check if this post has a draft.
		if ( 'publish' === $post->post_status ) {
			$draft = $this->get_draft( $post_id );
			if ( $draft ) {
				$created = get_post_meta( $draft->ID, self::META_DRAFT_CREATED, true );
				printf(
					'<span class="dsgo-draft-badge dsgo-draft-badge--has-draft" title="%s">%s</span>',
					esc_attr( sprintf( __( 'Draft created: %s', 'designsetgo' ), $created ) ),
					esc_html__( 'Has Draft', 'designsetgo' )
				);
				return;
			}
		}

		echo '<span class="dsgo-draft-badge dsgo-draft-badge--none">&mdash;</span>';
	}

	/**
	 * Enqueue admin scripts for draft mode functionality
	 *
	 * @param string $hook_suffix Admin page hook suffix.
	 */
	public function enqueue_admin_scripts( $hook_suffix ) {
		if ( 'edit.php' !== $hook_suffix ) {
			return;
		}

		$screen = get_current_screen();
		if ( ! $screen || 'page' !== $screen->post_type ) {
			return;
		}

		// Inline styles for draft badges and row actions.
		$styles = '
			.dsgo-draft-badge {
				display: inline-block;
				padding: 2px 8px;
				border-radius: 3px;
				font-size: 12px;
				line-height: 1.4;
			}
			.dsgo-draft-badge--is-draft {
				background: #fff3cd;
				color: #856404;
			}
			.dsgo-draft-badge--has-draft {
				background: #cce5ff;
				color: #004085;
			}
			.dsgo-draft-badge--none {
				color: #999;
			}
			.dsgo-create-draft.loading {
				opacity: 0.5;
				pointer-events: none;
			}
		';
		wp_add_inline_style( 'wp-admin', $styles );

		// Inline script for "Create Draft" action.
		$script = "
			document.addEventListener('click', function(e) {
				if (!e.target.classList.contains('dsgo-create-draft')) return;
				e.preventDefault();

				var link = e.target;
				if (link.classList.contains('loading')) return;

				var postId = link.dataset.postId;
				var nonce = link.dataset.nonce;

				link.classList.add('loading');
				link.textContent = '" . esc_js( __( 'Creating...', 'designsetgo' ) ) . "';

				fetch('" . esc_url( rest_url( 'designsetgo/v1/draft-mode/create' ) ) . "', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': nonce
					},
					body: JSON.stringify({ post_id: parseInt(postId) })
				})
				.then(function(response) { return response.json(); })
				.then(function(data) {
					if (data.success && data.edit_url) {
						window.location.href = data.edit_url;
					} else {
						alert(data.message || '" . esc_js( __( 'Failed to create draft.', 'designsetgo' ) ) . "');
						link.classList.remove('loading');
						link.textContent = '" . esc_js( __( 'Create Draft', 'designsetgo' ) ) . "';
					}
				})
				.catch(function() {
					alert('" . esc_js( __( 'Failed to create draft.', 'designsetgo' ) ) . "');
					link.classList.remove('loading');
					link.textContent = '" . esc_js( __( 'Create Draft', 'designsetgo' ) ) . "';
				});
			});
		";
		wp_add_inline_script( 'jquery', $script );
	}

	/**
	 * Clean up draft meta when a post is deleted
	 *
	 * @param int $post_id Post ID being deleted.
	 */
	public function cleanup_draft_meta( $post_id ) {
		// If this is a draft being deleted, clean up the original's meta.
		$original_id = get_post_meta( $post_id, self::META_DRAFT_OF, true );
		if ( $original_id ) {
			delete_post_meta( $original_id, self::META_HAS_DRAFT );
		}

		// If this is an original being deleted, delete its draft too.
		$draft_id = get_post_meta( $post_id, self::META_HAS_DRAFT, true );
		if ( $draft_id ) {
			// Prevent infinite loop by removing meta first.
			delete_post_meta( $draft_id, self::META_DRAFT_OF );
			wp_delete_post( $draft_id, true );
		}
	}
}
