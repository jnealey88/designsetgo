<?php
/**
 * Draft Mode Preview Class
 *
 * Provides site-wide preview of draft changes for logged-in administrators.
 * When the AI agent (Airo) creates drafts of published pages, admins automatically
 * see draft content while navigating the frontend. Regular visitors always see
 * published content.
 *
 * @package DesignSetGo
 * @since 1.5.0
 */

namespace DesignSetGo\Admin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Draft Mode Preview Class - Serves draft content on the frontend for admins
 */
class Draft_Mode_Preview {
	/**
	 * Cookie name for opting out of preview mode.
	 */
	const COOKIE_LIVE_MODE = 'dsgo_live_mode';

	/**
	 * Query parameter for toggling live mode.
	 */
	const PARAM_LIVE_MODE = 'dsgo_live';

	/**
	 * Draft Mode instance.
	 *
	 * @var Draft_Mode
	 */
	private $draft_mode;

	/**
	 * Whether we're currently in preview mode for this request.
	 *
	 * @var bool|null
	 */
	private $is_preview_active = null;

	/**
	 * Cache of draft mappings (original_id => draft post).
	 *
	 * @var array|null
	 */
	private $draft_map = null;

	/**
	 * Constructor
	 *
	 * @param Draft_Mode $draft_mode Draft Mode instance.
	 */
	public function __construct( Draft_Mode $draft_mode ) {
		$this->draft_mode = $draft_mode;

		// Only run on the frontend, not in admin or REST API contexts.
		if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
			return;
		}

		// Handle live mode toggle early (before template_redirect).
		add_action( 'init', array( $this, 'handle_live_mode_toggle' ) );

		// Swap content for pages with drafts.
		add_filter( 'the_posts', array( $this, 'swap_draft_content' ), 10, 2 );

		// Add the preview banner to the frontend.
		add_action( 'wp_footer', array( $this, 'render_preview_banner' ) );

		// Also swap featured images.
		add_filter( 'post_thumbnail_id', array( $this, 'swap_thumbnail' ), 10, 2 );
	}

	/**
	 * Check if preview mode is active for the current request.
	 *
	 * Preview is active when:
	 * 1. Draft mode is enabled
	 * 2. User is logged in with edit_pages capability
	 * 3. There are active drafts
	 * 4. User hasn't opted out via the live mode cookie
	 *
	 * @return bool True if preview mode is active.
	 */
	public function is_preview_active() {
		if ( null !== $this->is_preview_active ) {
			return $this->is_preview_active;
		}

		// Must be a logged-in user with edit capability.
		if ( ! is_user_logged_in() || ! current_user_can( 'edit_pages' ) ) {
			$this->is_preview_active = false;
			return false;
		}

		// Draft mode must be enabled.
		if ( ! $this->draft_mode->is_enabled() ) {
			$this->is_preview_active = false;
			return false;
		}

		// Check if user has opted out via cookie.
		if ( isset( $_COOKIE[ self::COOKIE_LIVE_MODE ] ) && '1' === $_COOKIE[ self::COOKIE_LIVE_MODE ] ) {
			$this->is_preview_active = false;
			return false;
		}

		// Check if there are any active drafts.
		if ( empty( $this->get_draft_map() ) ) {
			$this->is_preview_active = false;
			return false;
		}

		$this->is_preview_active = true;
		return true;
	}

	/**
	 * Get a map of original post IDs to their draft posts.
	 *
	 * @return array Associative array of original_id => WP_Post (draft).
	 */
	private function get_draft_map() {
		if ( null !== $this->draft_map ) {
			return $this->draft_map;
		}

		$this->draft_map = array();

		// Find all pages that have drafts.
		$pages_with_drafts = get_posts(
			array(
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'meta_key'       => Draft_Mode::META_HAS_DRAFT,
				'posts_per_page' => 100, // Reasonable upper bound.
				'fields'         => 'ids',
			)
		);

		foreach ( $pages_with_drafts as $original_id ) {
			$draft = $this->draft_mode->get_draft( $original_id );
			if ( $draft ) {
				$this->draft_map[ $original_id ] = $draft;
			}
		}

		return $this->draft_map;
	}

	/**
	 * Handle the live mode toggle via query parameter.
	 *
	 * When ?dsgo_live=1 is present, set a cookie to opt out of preview.
	 * When ?dsgo_live=0 is present, remove the cookie to opt back in.
	 */
	public function handle_live_mode_toggle() {
		if ( ! isset( $_GET[ self::PARAM_LIVE_MODE ] ) ) {
			return;
		}

		if ( ! is_user_logged_in() || ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		// Verify nonce for the toggle action.
		if ( ! isset( $_GET['_dsgo_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_dsgo_nonce'] ) ), 'dsgo_live_mode_toggle' ) ) {
			return;
		}

		$live_mode = sanitize_text_field( wp_unslash( $_GET[ self::PARAM_LIVE_MODE ] ) );

		if ( '1' === $live_mode ) {
			// Opt out of preview — set cookie for 24 hours.
			setcookie( self::COOKIE_LIVE_MODE, '1', time() + DAY_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true );
			$_COOKIE[ self::COOKIE_LIVE_MODE ] = '1';
		} else {
			// Opt back into preview — remove cookie.
			setcookie( self::COOKIE_LIVE_MODE, '', time() - YEAR_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true );
			unset( $_COOKIE[ self::COOKIE_LIVE_MODE ] );
		}

		// Reset cached state.
		$this->is_preview_active = null;

		// Redirect to remove query params from URL.
		$redirect_url = remove_query_arg( array( self::PARAM_LIVE_MODE, '_dsgo_nonce' ) );
		wp_safe_redirect( $redirect_url );
		exit;
	}

	/**
	 * Swap published content with draft content for the main query.
	 *
	 * @param \WP_Post[] $posts Array of post objects.
	 * @param \WP_Query  $query The WP_Query instance.
	 * @return \WP_Post[] Modified posts array.
	 */
	public function swap_draft_content( $posts, $query ) {
		if ( ! $this->is_preview_active() ) {
			return $posts;
		}

		// Only swap on frontend main queries and page queries.
		if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
			return $posts;
		}

		$draft_map = $this->get_draft_map();

		if ( empty( $draft_map ) ) {
			return $posts;
		}

		foreach ( $posts as &$post ) {
			if ( 'page' !== $post->post_type ) {
				continue;
			}

			if ( isset( $draft_map[ $post->ID ] ) ) {
				$draft = $draft_map[ $post->ID ];

				// Swap content fields while preserving the original post object.
				$post->post_content = $draft->post_content;
				$post->post_title   = $draft->post_title;
				$post->post_excerpt = $draft->post_excerpt;

				// Mark that this post is showing draft content (for the banner).
				$post->dsgo_showing_draft    = true;
				$post->dsgo_draft_id         = $draft->ID;
				$post->dsgo_draft_modified   = $draft->post_modified;
			}
		}

		return $posts;
	}

	/**
	 * Swap the featured image to use the draft's featured image.
	 *
	 * @param int $thumbnail_id The thumbnail/featured image ID.
	 * @param int $post_id      The post ID.
	 * @return int Modified thumbnail ID.
	 */
	public function swap_thumbnail( $thumbnail_id, $post_id ) {
		if ( ! $this->is_preview_active() ) {
			return $thumbnail_id;
		}

		$draft_map = $this->get_draft_map();

		if ( isset( $draft_map[ $post_id ] ) ) {
			$draft_thumbnail = get_post_thumbnail_id( $draft_map[ $post_id ]->ID );
			if ( $draft_thumbnail ) {
				return $draft_thumbnail;
			}
		}

		return $thumbnail_id;
	}

	/**
	 * Render the preview mode banner on the frontend.
	 *
	 * Shows a floating bar when preview mode is active, with:
	 * - Status indicator showing how many pages have draft changes
	 * - Toggle to switch to live view
	 * - Links to approve/discard all drafts
	 */
	public function render_preview_banner() {
		// Show banner for admins — either preview is active, or they opted out
		// but drafts still exist (so they can opt back in).
		if ( ! is_user_logged_in() || ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		if ( ! $this->draft_mode->is_enabled() ) {
			return;
		}

		$draft_map  = $this->get_draft_map();
		$draft_count = count( $draft_map );

		if ( 0 === $draft_count ) {
			return;
		}

		$is_active   = $this->is_preview_active();
		$toggle_value = $is_active ? '1' : '0';
		$toggle_url   = wp_nonce_url(
			add_query_arg( self::PARAM_LIVE_MODE, $toggle_value ),
			'dsgo_live_mode_toggle',
			'_dsgo_nonce'
		);

		// Check if the current page has a draft.
		$current_page_has_draft = false;
		$current_draft_id       = 0;
		$queried_object         = get_queried_object();
		if ( $queried_object && isset( $queried_object->ID ) && isset( $draft_map[ $queried_object->ID ] ) ) {
			$current_page_has_draft = true;
			$current_draft_id       = $draft_map[ $queried_object->ID ]->ID;
		}

		// Build draft list for the details panel.
		$draft_list_html = '';
		foreach ( $draft_map as $original_id => $draft ) {
			$original    = get_post( $original_id );
			$page_title  = $original ? esc_html( $original->post_title ) : esc_html__( 'Untitled', 'designsetgo' );
			$page_url    = get_permalink( $original_id );
			$edit_url    = get_edit_post_link( $draft->ID, 'raw' );
			$is_current  = ( $queried_object && isset( $queried_object->ID ) && $queried_object->ID === $original_id );

			$draft_list_html .= sprintf(
				'<li class="dsgo-preview-draft-item%s">
					<a href="%s" class="dsgo-preview-draft-link">%s</a>
					<a href="%s" class="dsgo-preview-draft-edit" title="%s">%s</a>
				</li>',
				$is_current ? ' dsgo-preview-draft-item--current' : '',
				esc_url( $page_url ),
				$page_title,
				esc_url( $edit_url ),
				esc_attr__( 'Edit draft', 'designsetgo' ),
				esc_html__( 'Edit', 'designsetgo' )
			);
		}

		$this->render_banner_html( $is_active, $draft_count, $toggle_url, $draft_list_html, $current_page_has_draft );
		$this->render_banner_styles();
		$this->render_banner_script();
	}

	/**
	 * Render the banner HTML.
	 *
	 * @param bool   $is_active              Whether preview mode is active.
	 * @param int    $draft_count            Number of pages with drafts.
	 * @param string $toggle_url             URL to toggle preview mode.
	 * @param string $draft_list_html        HTML for the draft list.
	 * @param bool   $current_page_has_draft Whether the current page has a draft.
	 */
	private function render_banner_html( $is_active, $draft_count, $toggle_url, $draft_list_html, $current_page_has_draft ) {
		$status_text = $is_active
			? sprintf(
				/* translators: %d is the number of pages with draft changes */
				_n(
					'Previewing draft changes (%d page)',
					'Previewing draft changes (%d pages)',
					$draft_count,
					'designsetgo'
				),
				$draft_count
			)
			: sprintf(
				/* translators: %d is the number of pages with pending draft changes */
				_n(
					'Viewing live site — %d page has draft changes',
					'Viewing live site — %d pages have draft changes',
					$draft_count,
					'designsetgo'
				),
				$draft_count
			);

		$toggle_label = $is_active
			? __( 'View Live', 'designsetgo' )
			: __( 'Preview Drafts', 'designsetgo' );

		$indicator_class = $is_active ? 'dsgo-preview-banner--active' : 'dsgo-preview-banner--live';
		?>
		<div id="dsgo-preview-banner" class="dsgo-preview-banner <?php echo esc_attr( $indicator_class ); ?>" role="status" aria-live="polite">
			<div class="dsgo-preview-banner__inner">
				<div class="dsgo-preview-banner__status">
					<span class="dsgo-preview-banner__indicator"></span>
					<span class="dsgo-preview-banner__text"><?php echo esc_html( $status_text ); ?></span>
					<?php if ( $is_active && $current_page_has_draft ) : ?>
						<span class="dsgo-preview-banner__page-badge"><?php esc_html_e( 'This page has changes', 'designsetgo' ); ?></span>
					<?php endif; ?>
				</div>

				<div class="dsgo-preview-banner__actions">
					<button type="button" class="dsgo-preview-banner__details-toggle" aria-expanded="false" aria-controls="dsgo-preview-draft-list">
						<?php esc_html_e( 'Details', 'designsetgo' ); ?>
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</button>

					<a href="<?php echo esc_url( $toggle_url ); ?>" class="dsgo-preview-banner__toggle">
						<?php echo esc_html( $toggle_label ); ?>
					</a>
				</div>
			</div>

			<div id="dsgo-preview-draft-list" class="dsgo-preview-banner__details" hidden>
				<div class="dsgo-preview-banner__details-inner">
					<h3 class="dsgo-preview-banner__details-title"><?php esc_html_e( 'Pages with draft changes:', 'designsetgo' ); ?></h3>
					<ul class="dsgo-preview-banner__draft-list">
						<?php echo $draft_list_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped during construction. ?>
					</ul>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render the banner CSS styles.
	 */
	private function render_banner_styles() {
		?>
		<style id="dsgo-preview-banner-styles">
			#dsgo-preview-banner {
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				z-index: 99999;
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
				font-size: 13px;
				line-height: 1.4;
				box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
			}

			#dsgo-preview-banner * {
				box-sizing: border-box;
			}

			.dsgo-preview-banner--active {
				background: #1e1e1e;
				color: #f0f0f0;
			}

			.dsgo-preview-banner--live {
				background: #fff;
				color: #1e1e1e;
				border-top: 2px solid #ddd;
			}

			.dsgo-preview-banner__inner {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px 20px;
				max-width: 100%;
				gap: 16px;
			}

			.dsgo-preview-banner__status {
				display: flex;
				align-items: center;
				gap: 8px;
				flex-wrap: wrap;
			}

			.dsgo-preview-banner__indicator {
				display: inline-block;
				width: 8px;
				height: 8px;
				border-radius: 50%;
				flex-shrink: 0;
			}

			.dsgo-preview-banner--active .dsgo-preview-banner__indicator {
				background: #f0c33c;
				box-shadow: 0 0 6px rgba(240, 195, 60, 0.5);
			}

			.dsgo-preview-banner--live .dsgo-preview-banner__indicator {
				background: #00a32a;
				box-shadow: 0 0 6px rgba(0, 163, 42, 0.3);
			}

			.dsgo-preview-banner__text {
				font-weight: 500;
			}

			.dsgo-preview-banner__page-badge {
				display: inline-block;
				padding: 1px 8px;
				background: rgba(240, 195, 60, 0.2);
				color: #f0c33c;
				border-radius: 3px;
				font-size: 11px;
				font-weight: 600;
				text-transform: uppercase;
				letter-spacing: 0.5px;
			}

			.dsgo-preview-banner__actions {
				display: flex;
				align-items: center;
				gap: 12px;
				flex-shrink: 0;
			}

			.dsgo-preview-banner__details-toggle {
				display: inline-flex;
				align-items: center;
				gap: 4px;
				padding: 5px 12px;
				border: 1px solid rgba(255, 255, 255, 0.2);
				border-radius: 4px;
				background: transparent;
				color: inherit;
				cursor: pointer;
				font-size: 12px;
				transition: background 0.15s;
			}

			.dsgo-preview-banner--live .dsgo-preview-banner__details-toggle {
				border-color: #ddd;
			}

			.dsgo-preview-banner__details-toggle:hover {
				background: rgba(255, 255, 255, 0.1);
			}

			.dsgo-preview-banner--live .dsgo-preview-banner__details-toggle:hover {
				background: #f0f0f0;
			}

			.dsgo-preview-banner__details-toggle[aria-expanded="true"] svg {
				transform: rotate(180deg);
			}

			.dsgo-preview-banner__toggle {
				display: inline-block;
				padding: 5px 16px;
				border-radius: 4px;
				text-decoration: none;
				font-size: 12px;
				font-weight: 600;
				transition: background 0.15s, color 0.15s;
			}

			.dsgo-preview-banner--active .dsgo-preview-banner__toggle {
				background: #f0f0f0;
				color: #1e1e1e;
			}

			.dsgo-preview-banner--active .dsgo-preview-banner__toggle:hover {
				background: #fff;
			}

			.dsgo-preview-banner--live .dsgo-preview-banner__toggle {
				background: #2271b1;
				color: #fff;
			}

			.dsgo-preview-banner--live .dsgo-preview-banner__toggle:hover {
				background: #135e96;
			}

			/* Details panel */
			.dsgo-preview-banner__details {
				border-top: 1px solid rgba(255, 255, 255, 0.1);
			}

			.dsgo-preview-banner--live .dsgo-preview-banner__details {
				border-top-color: #ddd;
			}

			.dsgo-preview-banner__details-inner {
				padding: 12px 20px 16px;
			}

			.dsgo-preview-banner__details-title {
				margin: 0 0 8px;
				font-size: 12px;
				font-weight: 600;
				text-transform: uppercase;
				letter-spacing: 0.5px;
				opacity: 0.7;
			}

			.dsgo-preview-banner__draft-list {
				margin: 0;
				padding: 0;
				list-style: none;
				display: flex;
				flex-wrap: wrap;
				gap: 6px;
			}

			.dsgo-preview-draft-item {
				display: flex;
				align-items: center;
				gap: 6px;
				padding: 4px 10px;
				border-radius: 4px;
				background: rgba(255, 255, 255, 0.08);
			}

			.dsgo-preview-banner--live .dsgo-preview-draft-item {
				background: #f0f0f0;
			}

			.dsgo-preview-draft-item--current {
				background: rgba(240, 195, 60, 0.15);
			}

			.dsgo-preview-banner--live .dsgo-preview-draft-item--current {
				background: #e8f0fe;
			}

			.dsgo-preview-draft-link {
				color: inherit;
				text-decoration: none;
				font-weight: 500;
			}

			.dsgo-preview-draft-link:hover {
				text-decoration: underline;
			}

			.dsgo-preview-draft-edit {
				font-size: 11px;
				opacity: 0.6;
				text-decoration: none;
			}

			.dsgo-preview-banner--active .dsgo-preview-draft-edit {
				color: #72aee6;
			}

			.dsgo-preview-banner--live .dsgo-preview-draft-edit {
				color: #2271b1;
			}

			.dsgo-preview-draft-edit:hover {
				opacity: 1;
				text-decoration: underline;
			}

			/* Offset page content so banner doesn't cover it */
			body.dsgo-preview-mode {
				padding-bottom: 48px;
			}

			/* Mobile adjustments */
			@media (max-width: 600px) {
				.dsgo-preview-banner__inner {
					flex-direction: column;
					align-items: flex-start;
					padding: 8px 12px;
					gap: 8px;
				}

				.dsgo-preview-banner__actions {
					width: 100%;
					justify-content: flex-end;
				}
			}
		</style>
		<?php
	}

	/**
	 * Render the banner JavaScript.
	 */
	private function render_banner_script() {
		?>
		<script id="dsgo-preview-banner-script">
			(function() {
				// Add body class for padding offset.
				document.body.classList.add('dsgo-preview-mode');

				// Toggle details panel.
				var toggleBtn = document.querySelector('.dsgo-preview-banner__details-toggle');
				var detailsPanel = document.getElementById('dsgo-preview-draft-list');

				if (toggleBtn && detailsPanel) {
					toggleBtn.addEventListener('click', function() {
						var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
						toggleBtn.setAttribute('aria-expanded', !isExpanded);
						detailsPanel.hidden = isExpanded;
					});
				}
			})();
		</script>
		<?php
	}
}
