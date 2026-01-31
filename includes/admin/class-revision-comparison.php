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
	 * Output the script that adds the visual comparison button
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
		<script>
		(function() {
			function addVisualComparisonButton() {
				// Check if button already exists.
				if (document.getElementById('dsgo-visual-comparison-btn')) {
					return;
				}

				var btn = document.createElement('a');
				btn.id = 'dsgo-visual-comparison-btn';
				btn.href = <?php echo wp_json_encode( esc_url_raw( $visual_url ) ); ?>;
				btn.className = 'page-title-action';
				btn.textContent = <?php echo wp_json_encode( __( 'Visual Comparison', 'designsetgo' ) ); ?>;

				// Try to find the best insertion point.
				// Priority 1: Next to the "Go to editor" link.
				var goToEditor = document.querySelector('.wrap a[href*="post.php"]');
				if (goToEditor && goToEditor.textContent.includes('editor')) {
					goToEditor.parentNode.insertBefore(btn, goToEditor);
					return;
				}

				// Priority 2: After the page title.
				var pageTitle = document.querySelector('.wrap h1');
				if (pageTitle) {
					// Insert after the h1.
					if (pageTitle.nextSibling) {
						pageTitle.parentNode.insertBefore(btn, pageTitle.nextSibling);
					} else {
						pageTitle.parentNode.appendChild(btn);
					}
					return;
				}

				// Priority 3: In the revisions control frame.
				var controlFrame = document.querySelector('.revisions-control-frame');
				if (controlFrame) {
					controlFrame.appendChild(btn);
				}
			}

			// Try immediately and also on DOMContentLoaded.
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', addVisualComparisonButton);
			} else {
				addVisualComparisonButton();
			}

			// Also try after a short delay for React-based revision screen.
			setTimeout(addVisualComparisonButton, 500);
			setTimeout(addVisualComparisonButton, 1500);
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

		// Build restore URL base with nonce (revision ID will be appended by JS).
		$restore_base_url = '';
		if ( $post_id ) {
			$restore_base_url = wp_nonce_url(
				admin_url( 'revision.php?action=restore' ),
				'restore-post_'
			);
		}

		wp_localize_script(
			'designsetgo-revisions',
			'designSetGoRevisions',
			array(
				'apiUrl'         => esc_url_raw( rest_url( 'designsetgo/v1' ) ),
				'nonce'          => wp_create_nonce( 'wp_rest' ),
				'postId'         => $post_id,
				'revisionId'     => $revision_id,
				'adminUrl'       => esc_url( admin_url() ),
				'editUrl'        => $post_id ? esc_url( get_edit_post_link( $post_id, 'raw' ) ) : '',
				'restoreBaseUrl' => $restore_base_url,
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

		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Visual Revision Comparison', 'designsetgo' ); ?></h1>
			<p class="description">
				<?php
				printf(
					/* translators: %s: post title */
					esc_html__( 'Comparing revisions for: %s', 'designsetgo' ),
					'<strong>' . esc_html( $post->post_title ) . '</strong>'
				);
				?>
			</p>
			<div id="designsetgo-revisions-root"></div>
		</div>
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
					),
					'to_id'   => array(
						'required'          => true,
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
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

			// Add data attribute for diff highlighting.
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
					'added'    => count( array_filter( $changes, fn( $c ) => 'added' === $c['type'] ) ),
					'removed'  => count( array_filter( $changes, fn( $c ) => 'removed' === $c['type'] ) ),
					'modified' => count( array_filter( $changes, fn( $c ) => 'modified' === $c['type'] ) ),
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

				// This is a modified block.
				$changes[] = array(
					'type'              => 'modified',
					'from_index'        => $from_idx,
					'to_index'          => $best_match,
					'block_name'        => $from_block['blockName'],
					'attribute_changes' => $this->compare_block_content(
						$from_block,
						$to_blocks[ $best_match ]
					),
				);
			}
		}

		// Find removed blocks (in from but not matched).
		foreach ( $from_blocks as $idx => $block ) {
			if ( ! isset( $matched_from[ $idx ] ) ) {
				$changes[] = array(
					'type'       => 'removed',
					'from_index' => $idx,
					'block_name' => $block['blockName'],
				);
			}
		}

		// Find added blocks (in to but not matched).
		foreach ( $to_blocks as $idx => $block ) {
			if ( ! isset( $matched_to[ $idx ] ) ) {
				$changes[] = array(
					'type'       => 'added',
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

		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize
		return serialize( $attrs_a ) === serialize( $attrs_b );
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
