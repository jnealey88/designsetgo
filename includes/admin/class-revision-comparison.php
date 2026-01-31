<?php
/**
 * Revision Comparison Class
 *
 * Provides visual revision comparison for block-based content.
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
 * Revision_Comparison Class - Visual revision comparison for blocks
 */
class Revision_Comparison {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_page' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'setup_revision_button' ) );

		// Redirect to visual comparison by default.
		add_action( 'admin_init', array( $this, 'maybe_redirect_to_visual_comparison' ) );
	}

	/**
	 * Maybe redirect to visual comparison page
	 *
	 * Redirects users from the standard revision.php page to visual comparison by default.
	 */
	public function maybe_redirect_to_visual_comparison() {
		// Only redirect on revision.php page.
		global $pagenow;

		if ( 'revision.php' !== $pagenow ) {
			return;
		}

		// Check if user explicitly wants standard view.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameter check.
		if ( isset( $_GET['view'] ) && 'standard' === $_GET['view'] ) {
			return;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameter check.
		$revision_id = isset( $_GET['revision'] ) ? absint( $_GET['revision'] ) : 0;

		if ( ! $revision_id ) {
			return;
		}

		$revision = wp_get_post_revision( $revision_id );

		if ( ! $revision ) {
			return;
		}

		$post = get_post( $revision->post_parent );

		if ( ! $post || ! current_user_can( 'edit_post', $post->ID ) ) {
			return;
		}

		$visual_url = add_query_arg(
			array(
				'page'     => 'designsetgo-revisions',
				'post_id'  => $post->ID,
				'revision' => $revision_id,
			),
			admin_url( 'admin.php' )
		);

		wp_safe_redirect( $visual_url );
		exit;
	}

	/**
	 * Register hidden admin page for visual revision comparison
	 */
	public function register_page() {
		add_submenu_page(
			null, // Hidden from menu.
			__( 'Visual Revision Comparison', 'designsetgo' ),
			__( 'Visual Revision Comparison', 'designsetgo' ),
			'edit_posts',
			'designsetgo-revisions',
			array( $this, 'render_page' )
		);
	}

	/**
	 * Setup visual comparison button on revision screen
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function setup_revision_button( $hook ) {
		if ( 'revision.php' !== $hook ) {
			return;
		}

		// Add the button via admin_footer for reliability.
		add_action( 'admin_footer', array( $this, 'output_revision_button_script' ) );
	}

	/**
	 * Output the script that adds the visual comparison tab navigation
	 */
	public function output_revision_button_script() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameter check.
		$revision_id = isset( $_GET['revision'] ) ? absint( $_GET['revision'] ) : 0;

		if ( ! $revision_id ) {
			return;
		}

		$revision = wp_get_post_revision( $revision_id );

		if ( ! $revision ) {
			return;
		}

		$post = get_post( $revision->post_parent );

		if ( ! $post || ! current_user_can( 'edit_post', $post->ID ) ) {
			return;
		}

		$visual_url = add_query_arg(
			array(
				'page'     => 'designsetgo-revisions',
				'post_id'  => $post->ID,
				'revision' => $revision_id,
			),
			admin_url( 'admin.php' )
		);

		?>
		<style>
			.dsgo-revisions-tabs {
				display: inline-flex;
				gap: 4px;
				position: absolute;
				right: 20px;
				top: 12px;
			}
			.wrap {
				position: relative;
			}
			.dsgo-revisions-tab {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				padding: 6px 12px;
				background: #f0f0f1;
				border: 1px solid #c3c4c7;
				border-radius: 4px;
				color: #50575e;
				text-decoration: none;
				font-size: 13px;
				font-weight: 500;
				cursor: pointer;
				transition: all 0.15s ease;
			}
			.dsgo-revisions-tab:hover {
				background: #fff;
				border-color: #2271b1;
				color: #2271b1;
			}
			.dsgo-revisions-tab--active {
				background: #2271b1;
				border-color: #2271b1;
				color: #fff;
				cursor: default;
			}
			.dsgo-revisions-tab--active:hover {
				background: #2271b1;
				border-color: #2271b1;
				color: #fff;
			}
			.dsgo-revisions-tab .dashicons {
				font-size: 14px;
				width: 14px;
				height: 14px;
				line-height: 14px;
			}
		</style>
		<script>
		(function() {
			var postId = <?php echo wp_json_encode( $post->ID ); ?>;
			var adminUrl = <?php echo wp_json_encode( admin_url( 'admin.php' ) ); ?>;

			function getVisualComparisonUrl() {
				// Get current revision from URL (WordPress updates this when slider moves)
				var urlParams = new URLSearchParams(window.location.search);
				var revisionId = urlParams.get('revision') || <?php echo wp_json_encode( $revision_id ); ?>;
				return adminUrl + '?page=designsetgo-revisions&post_id=' + postId + '&revision=' + revisionId;
			}

			function updateVisualTabHref() {
				var visualTab = document.querySelector('#dsgo-revisions-tabs a[href*="designsetgo-revisions"]');
				if (visualTab) {
					visualTab.href = getVisualComparisonUrl();
				}
			}

			function addVisualComparisonTabs() {
				// Check if tabs already exist.
				if (document.getElementById('dsgo-revisions-tabs')) {
					return;
				}

				var tabsNav = document.createElement('nav');
				tabsNav.id = 'dsgo-revisions-tabs';
				tabsNav.className = 'dsgo-revisions-tabs';
				tabsNav.setAttribute('role', 'tablist');

				// Code Changes tab (active on this page)
				var codeTab = document.createElement('span');
				codeTab.className = 'dsgo-revisions-tab dsgo-revisions-tab--active';
				codeTab.setAttribute('role', 'tab');
				codeTab.setAttribute('aria-selected', 'true');
				codeTab.innerHTML = '<span class="dashicons dashicons-editor-code"></span>' + <?php echo wp_json_encode( __( 'Code Changes', 'designsetgo' ) ); ?>;

				// Visual Comparison tab - dynamically get URL
				var visualTab = document.createElement('a');
				visualTab.href = getVisualComparisonUrl();
				visualTab.className = 'dsgo-revisions-tab';
				visualTab.setAttribute('role', 'tab');
				visualTab.innerHTML = '<span class="dashicons dashicons-visibility"></span>' + <?php echo wp_json_encode( __( 'Visual Comparison', 'designsetgo' ) ); ?>;

				tabsNav.appendChild(codeTab);
				tabsNav.appendChild(visualTab);

				// Append to .wrap container (tabs are absolutely positioned to the right)
				var wrap = document.querySelector('.wrap');
				if (wrap) {
					wrap.appendChild(tabsNav);
				}
			}

			// Try immediately and also on DOMContentLoaded.
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', addVisualComparisonTabs);
			} else {
				addVisualComparisonTabs();
			}

			// Also try after a short delay for React-based revision screen.
			setTimeout(addVisualComparisonTabs, 500);
			setTimeout(addVisualComparisonTabs, 1500);

			// Listen for URL changes (WordPress updates URL when slider moves)
			// Use popstate for back/forward and also poll for pushState/replaceState changes
			window.addEventListener('popstate', updateVisualTabHref);

			// Poll for URL changes since WordPress uses replaceState which doesn't fire popstate
			var lastUrl = window.location.href;
			setInterval(function() {
				if (window.location.href !== lastUrl) {
					lastUrl = window.location.href;
					updateVisualTabHref();
				}
			}, 500);
		})();
		</script>
		<?php
	}

	/**
	 * Enqueue assets for revision comparison page
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function enqueue_assets( $hook ) {
		if ( 'admin_page_designsetgo-revisions' !== $hook ) {
			return;
		}

		$asset_file = DESIGNSETGO_PATH . 'build/revisions.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = include $asset_file;

		wp_enqueue_script(
			'designsetgo-revisions',
			DESIGNSETGO_URL . 'build/revisions.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_set_script_translations(
			'designsetgo-revisions',
			'designsetgo',
			DESIGNSETGO_PATH . 'languages'
		);

		wp_enqueue_style(
			'designsetgo-revisions',
			DESIGNSETGO_URL . 'build/revisions.css',
			array( 'wp-components' ),
			$asset['version']
		);

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameters.
		$post_id     = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : 0;
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameters.
		$revision_id = isset( $_GET['revision'] ) ? absint( $_GET['revision'] ) : 0;

		// If no post_id but we have a revision, get post_id from revision.
		if ( ! $post_id && $revision_id ) {
			$revision = wp_get_post_revision( $revision_id );
			if ( $revision ) {
				$post_id = $revision->post_parent;
			} else {
				// Maybe it's the current post ID, not a revision.
				$maybe_post = get_post( $revision_id );
				if ( $maybe_post && 'revision' !== $maybe_post->post_type ) {
					$post_id = $revision_id;
				}
			}
		}

		wp_localize_script(
			'designsetgo-revisions',
			'designSetGoRevisions',
			array(
				'apiUrl'     => esc_url_raw( rest_url( 'designsetgo/v1' ) ),
				'nonce'      => wp_create_nonce( 'wp_rest' ),
				'postId'     => $post_id,
				'revisionId' => $revision_id,
				'adminUrl'   => esc_url( admin_url() ),
				'editUrl'    => $post_id ? esc_url( get_edit_post_link( $post_id, 'raw' ) ?? '' ) : '',
			)
		);
	}

	/**
	 * Render the revision comparison page
	 */
	public function render_page() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameters.
		$post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : 0;
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only URL parameters.
		$revision_id = isset( $_GET['revision'] ) ? absint( $_GET['revision'] ) : 0;

		// If no post_id but we have a revision, get post_id from revision.
		if ( ! $post_id && $revision_id ) {
			$revision = wp_get_post_revision( $revision_id );
			if ( $revision ) {
				$post_id = $revision->post_parent;
			} else {
				// Maybe it's the current post ID, not a revision.
				$maybe_post = get_post( $revision_id );
				if ( $maybe_post && 'revision' !== $maybe_post->post_type ) {
					$post_id = $revision_id;
				}
			}
		}

		if ( ! $post_id ) {
			wp_die( esc_html__( 'No post specified.', 'designsetgo' ) );
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			wp_die( esc_html__( 'You do not have permission to view revisions for this post.', 'designsetgo' ) );
		}

		$post = get_post( $post_id );

		if ( ! $post ) {
			wp_die( esc_html__( 'Post not found.', 'designsetgo' ) );
		}

		// Build URLs for navigation.
		$standard_url = add_query_arg(
			array(
				'revision' => $revision_id ? $revision_id : '',
				'view'     => 'standard',
			),
			admin_url( 'revision.php' )
		);

		$edit_url = get_edit_post_link( $post_id, 'raw' ) ?? '';

		?>
		<div class="wrap dsgo-revisions-wrap">
			<div class="dsgo-revisions-header">
				<h1 class="dsgo-revisions-title">
					<?php
					printf(
						/* translators: %s: post title with link */
						esc_html__( 'Compare Revisions of "%s"', 'designsetgo' ),
						$edit_url ? '<a href="' . esc_url( $edit_url ) . '">' . esc_html( $post->post_title ) . '</a>' : esc_html( $post->post_title )
					);
					?>
				</h1>
				<?php if ( $edit_url ) : ?>
				<a href="<?php echo esc_url( $edit_url ); ?>" class="dsgo-revisions-editor-link">
					<?php esc_html_e( '← Go to editor', 'designsetgo' ); ?>
				</a>
				<?php endif; ?>
				<nav class="dsgo-revisions-tabs" role="tablist">
					<a href="<?php echo esc_url( $standard_url ); ?>" class="dsgo-revisions-tab" role="tab">
						<span class="dashicons dashicons-editor-code"></span>
						<?php esc_html_e( 'Code Changes', 'designsetgo' ); ?>
					</a>
					<span class="dsgo-revisions-tab dsgo-revisions-tab--active" role="tab" aria-selected="true">
						<span class="dashicons dashicons-visibility"></span>
						<?php esc_html_e( 'Visual Comparison', 'designsetgo' ); ?>
					</span>
				</nav>
			</div>
			<div id="designsetgo-revisions-root"></div>
		</div>
		<style>
			.dsgo-revisions-wrap {
				max-width: 100%;
			}
			.dsgo-revisions-header {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				gap: 16px;
				margin-bottom: 20px;
				padding-bottom: 16px;
				border-bottom: 1px solid #c3c4c7;
			}
			.dsgo-revisions-title {
				margin: 0;
				padding: 0;
				font-size: 23px;
				font-weight: 400;
				line-height: 1.3;
			}
			.dsgo-revisions-title a {
				text-decoration: none;
			}
			.dsgo-revisions-title a:hover {
				text-decoration: underline;
			}
			.dsgo-revisions-editor-link {
				color: #2271b1;
				text-decoration: none;
				font-size: 13px;
			}
			.dsgo-revisions-editor-link:hover {
				color: #135e96;
				text-decoration: underline;
			}
			.dsgo-revisions-tabs {
				display: flex;
				gap: 4px;
				margin-left: auto;
			}
			.dsgo-revisions-tab {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				padding: 8px 16px;
				background: #f0f0f1;
				border: 1px solid #c3c4c7;
				border-radius: 4px;
				color: #50575e;
				text-decoration: none;
				font-size: 13px;
				font-weight: 500;
				cursor: pointer;
				transition: all 0.15s ease;
			}
			.dsgo-revisions-tab:hover {
				background: #fff;
				border-color: #2271b1;
				color: #2271b1;
			}
			.dsgo-revisions-tab--active {
				background: #2271b1;
				border-color: #2271b1;
				color: #fff;
				cursor: default;
			}
			.dsgo-revisions-tab--active:hover {
				background: #2271b1;
				border-color: #2271b1;
				color: #fff;
			}
			.dsgo-revisions-tab .dashicons {
				font-size: 16px;
				width: 16px;
				height: 16px;
			}
		</style>
		<?php
	}

	/**
	 * Register REST API routes
	 */
	public function register_rest_routes() {
		// List revisions for a post.
		register_rest_route(
			'designsetgo/v1',
			'/revisions/(?P<post_id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_revisions' ),
				'permission_callback' => array( $this, 'check_permission' ),
				'args'                => array(
					'post_id' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
						'sanitize_callback' => 'absint',
					),
				),
			)
		);

		// Render a single revision.
		register_rest_route(
			'designsetgo/v1',
			'/revisions/render/(?P<revision_id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'render_revision' ),
				'permission_callback' => array( $this, 'check_revision_permission' ),
				'args'                => array(
					'revision_id' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
						'sanitize_callback' => 'absint',
					),
				),
			)
		);

		// Get diff between two revisions.
		register_rest_route(
			'designsetgo/v1',
			'/revisions/diff/(?P<from_id>\d+)/(?P<to_id>\d+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_diff' ),
				'permission_callback' => array( $this, 'check_diff_permission' ),
				'args'                => array(
					'from_id' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
						'sanitize_callback' => 'absint',
					),
					'to_id'   => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
						'sanitize_callback' => 'absint',
					),
				),
			)
		);

		// Restore a revision.
		register_rest_route(
			'designsetgo/v1',
			'/revisions/restore/(?P<revision_id>\d+)',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'restore_revision' ),
				'permission_callback' => array( $this, 'check_restore_permission' ),
				'args'                => array(
					'revision_id' => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
						'sanitize_callback' => 'absint',
					),
				),
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
		$post_id = $request->get_param( 'post_id' );
		return current_user_can( 'edit_post', $post_id );
	}

	/**
	 * Check permission for rendering a revision
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool True if user has permission.
	 */
	public function check_revision_permission( $request ) {
		$revision_id = $request->get_param( 'revision_id' );

		// First try as a revision.
		$revision = wp_get_post_revision( $revision_id );

		if ( $revision ) {
			return current_user_can( 'edit_post', $revision->post_parent );
		}

		// Might be the current post (not a revision).
		$post = get_post( $revision_id );

		if ( $post && 'revision' !== $post->post_type ) {
			return current_user_can( 'edit_post', $post->ID );
		}

		return false;
	}

	/**
	 * Check permission for diff endpoint
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool True if user has permission.
	 */
	public function check_diff_permission( $request ) {
		$from_id = $request->get_param( 'from_id' );
		$to_id   = $request->get_param( 'to_id' );

		// Get parent post ID for each (handles both revisions and current post).
		$from_parent = $this->get_post_parent_id( $from_id );
		$to_parent   = $this->get_post_parent_id( $to_id );

		if ( ! $from_parent || ! $to_parent ) {
			return false;
		}

		// Both must belong to the same post.
		if ( $from_parent !== $to_parent ) {
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
		$revision_id = $request->get_param( 'revision_id' );
		$revision    = wp_get_post_revision( $revision_id );

		if ( ! $revision ) {
			return false;
		}

		return current_user_can( 'edit_post', $revision->post_parent );
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

		$post_id = $revision->post_parent;

		// Use WordPress core function to restore the revision.
		$restored = wp_restore_post_revision( $revision_id );

		if ( ! $restored ) {
			return new \WP_Error(
				'restore_failed',
				__( 'Failed to restore revision.', 'designsetgo' ),
				array( 'status' => 500 )
			);
		}

		return rest_ensure_response(
			array(
				'success'  => true,
				'post_id'  => $post_id,
				'edit_url' => get_edit_post_link( $post_id, 'raw' ) ?? '',
			)
		);
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

		// Might be the current post.
		$post = get_post( $id );

		if ( $post && 'revision' !== $post->post_type ) {
			return $post->ID;
		}

		return false;
	}

	/**
	 * Get revisions for a post
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_revisions( $request ) {
		$post_id   = $request->get_param( 'post_id' );
		$revisions = wp_get_post_revisions( $post_id );

		if ( empty( $revisions ) ) {
			return rest_ensure_response(
				array(
					'post_id'   => $post_id,
					'revisions' => array(),
				)
			);
		}

		$revision_data = array();

		foreach ( $revisions as $revision ) {
			$author = get_userdata( $revision->post_author );

			// Generate restore URL with proper nonce for this specific revision.
			$restore_url = wp_nonce_url(
				admin_url( 'revision.php?action=restore&revision=' . $revision->ID ),
				'restore-post_' . $revision->ID
			);

			$revision_data[] = array(
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
				'restore_url' => $restore_url,
			);
		}

		// Add current post as the latest "revision".
		$post   = get_post( $post_id );
		$author = get_userdata( $post->post_author );

		array_unshift(
			$revision_data,
			array(
				'id'          => $post_id,
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
			)
		);

		return rest_ensure_response(
			array(
				'post_id'   => $post_id,
				'post_type' => get_post_type( $post_id ),
				'revisions' => $revision_data,
			)
		);
	}

	/**
	 * Render a revision as HTML
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function render_revision( $request ) {
		$revision_id = $request->get_param( 'revision_id' );

		// Check if this is the current post or a revision.
		$post = get_post( $revision_id );

		if ( ! $post ) {
			return new \WP_Error(
				'revision_not_found',
				__( 'Revision not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		$content = $post->post_content;

		// Parse and render blocks.
		$blocks        = parse_blocks( $content );
		$rendered_html = '';
		$block_count   = 0;

		foreach ( $blocks as $index => $block ) {
			// Skip empty blocks.
			if ( empty( $block['blockName'] ) ) {
				continue;
			}

			$block_count++;

			// Render block and add index attribute for diff highlighting.
			$rendered_block = render_block( $block );
			$rendered_block = $this->add_block_index_attribute( $rendered_block, $index );

			$rendered_html .= $rendered_block;
		}

		// Get theme stylesheet URL for preview.
		$theme_styles = $this->get_theme_styles();

		return rest_ensure_response(
			array(
				'revision_id'  => $revision_id,
				'html'         => $rendered_html,
				'styles'       => $theme_styles,
				'blocks_count' => $block_count,
			)
		);
	}

	/**
	 * Add block index data attribute to rendered HTML
	 *
	 * @param string $html  Rendered block HTML.
	 * @param int    $index Block index.
	 * @return string Modified HTML.
	 */
	private function add_block_index_attribute( $html, $index ) {
		// Find the first HTML tag and add the data attribute.
		$pattern     = '/^(\s*<[a-zA-Z][a-zA-Z0-9]*)/';
		$replacement = '$1 data-dsgo-block-index="' . esc_attr( $index ) . '"';

		return preg_replace( $pattern, $replacement, $html, 1 );
	}

	/**
	 * Get theme stylesheet URLs
	 *
	 * @return array Theme style URLs.
	 */
	private function get_theme_styles() {
		$styles = array();

		// Add theme stylesheet.
		$styles[] = get_stylesheet_uri();

		// Add block library styles.
		$styles[] = includes_url( 'css/dist/block-library/style.min.css' );

		// Add DesignSetGo styles.
		$styles[] = DESIGNSETGO_URL . 'build/style-index.css';

		return array_filter( $styles );
	}

	/**
	 * Get diff between two revisions
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_diff( $request ) {
		$from_id = $request->get_param( 'from_id' );
		$to_id   = $request->get_param( 'to_id' );

		$from_post = get_post( $from_id );
		$to_post   = get_post( $to_id );

		if ( ! $from_post || ! $to_post ) {
			return new \WP_Error(
				'revision_not_found',
				__( 'One or both revisions not found.', 'designsetgo' ),
				array( 'status' => 404 )
			);
		}

		$from_blocks = parse_blocks( $from_post->post_content );
		$to_blocks   = parse_blocks( $to_post->post_content );

		// Filter out empty blocks.
		$from_blocks = array_values( array_filter( $from_blocks, array( $this, 'is_valid_block' ) ) );
		$to_blocks   = array_values( array_filter( $to_blocks, array( $this, 'is_valid_block' ) ) );

		$changes = $this->compute_block_diff( $from_blocks, $to_blocks );

		return rest_ensure_response(
			array(
				'from_id' => $from_id,
				'to_id'   => $to_id,
				'changes' => $changes,
				'summary' => array(
					'total' => count( $changes ),
				),
			)
		);
	}

	/**
	 * Check if a block is valid (has a block name)
	 *
	 * @param array $block Block array.
	 * @return bool True if valid.
	 */
	private function is_valid_block( $block ) {
		return ! empty( $block['blockName'] );
	}

	/**
	 * Compute differences between two block arrays
	 *
	 * Compares top-level blocks and highlights any block that has changes
	 * (including changes to nested innerBlocks).
	 *
	 * @param array $from_blocks From revision blocks.
	 * @param array $to_blocks   To revision blocks.
	 * @return array Changes array.
	 */
	private function compute_block_diff( $from_blocks, $to_blocks ) {
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
	 * Compare content between two blocks
	 *
	 * @param array $from_block From block.
	 * @param array $to_block   To block.
	 * @return array Changed aspects.
	 */
	private function compare_block_content( $from_block, $to_block ) {
		$changes = array();

		// Check attributes.
		$attr_changes = $this->compare_block_attributes( $from_block, $to_block );
		if ( ! empty( $attr_changes ) ) {
			$changes = array_merge( $changes, $attr_changes );
		}

		// Check innerHTML.
		$from_html = $from_block['innerHTML'] ?? '';
		$to_html   = $to_block['innerHTML'] ?? '';

		if ( $from_html !== $to_html ) {
			$changes[] = 'content';
		}

		return array_unique( $changes );
	}

	/**
	 * Compare attributes between two blocks
	 *
	 * @param array $from_block From block.
	 * @param array $to_block   To block.
	 * @return array Changed attribute names.
	 */
	private function compare_block_attributes( $from_block, $to_block ) {
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
