<?php
/**
 * Settings Management Class
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

namespace DesignSetGo\Admin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Settings Class - Manages plugin settings and REST API
 */
class Settings {
	/**
	 * Option name for storing settings
	 */
	const OPTION_NAME = 'designsetgo_settings';

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
	}

	/**
	 * Cached fresh-install detection result.
	 * Prevents multiple database queries per request.
	 *
	 * @var bool|null
	 */
	private static $is_fresh_install = null;

	/**
	 * Get default settings
	 *
	 * @return array Default settings.
	 */
	public static function get_defaults() {
		// Determine whether this is a fresh installation or an existing one.
		// For existing installations, avoid introducing new default exclusions
		// that could change behavior without explicit user consent.
		// Cache the result to avoid multiple database queries per request.
		if ( null === self::$is_fresh_install ) {
			self::$is_fresh_install = ( false === get_option( self::OPTION_NAME, false ) );
		}

		if ( self::$is_fresh_install ) {
			// Fresh install: apply conservative defaults with known conflict exclusions.
			$excluded_blocks_default = array(
				// Common third-party blocks known to have REST API conflicts.
				'gravityforms/*',
				'mailpoet/*',
				'woocommerce/*',
				'jetpack/*',
			);
		} else {
			// Existing install: do not add new exclusions automatically.
			$excluded_blocks_default = array();
		}

		return array(
			'enabled_blocks'     => array(), // Empty = all enabled.
			'enabled_extensions' => array(), // Empty = all enabled.
			'excluded_blocks'    => $excluded_blocks_default,
			'performance'        => array(
				'conditional_loading' => true,
				'cache_duration'      => 3600, // 1 hour.
			),
			'forms'              => array(
				'enable_honeypot'      => true,
				'enable_rate_limiting' => true,
				'enable_email_logging' => false,
				'retention_days'       => 30,
			),
			'animations'         => array(
				'enable_animations'              => true,
				'default_duration'               => 600,
				'default_easing'                 => 'ease-in-out',
				'respect_prefers_reduced_motion' => true,
			),
			'security'           => array(
				'log_ip_addresses' => true,
				'log_user_agents'  => true,
				'log_referrers'    => false,
			),
			'integrations'       => array(
				'google_maps_api_key'    => '',
				'turnstile_site_key'     => '',
				'turnstile_secret_key'   => '',
			),
			'sticky_header'      => array(
				'enable'                    => true,
				'custom_selector'           => '',
				'z_index'                   => 100,
				'shadow_on_scroll'          => true,
				'shadow_size'               => 'medium',
				'shrink_on_scroll'          => false,
				'shrink_amount'             => 20,
				'mobile_enabled'            => true,
				'mobile_breakpoint'         => 768,
				'transition_speed'          => 300,
				'scroll_threshold'          => 50,
				'hide_on_scroll_down'       => false,
				'background_on_scroll'      => false,
				'background_scroll_color'   => '',
				'background_scroll_opacity' => 100,
			),
		);
	}

	/**
	 * Get all available blocks
	 *
	 * @return array Block information organized by category.
	 */
	public static function get_available_blocks() {
		return array(
			'containers'  => array(
				'label'  => __( 'Container Blocks', 'designsetgo' ),
				'blocks' => array(
					array(
						'name'        => 'designsetgo/grid',
						'title'       => __( 'Grid Container', 'designsetgo' ),
						'description' => __( 'CSS Grid-based responsive layouts', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/row',
						'title'       => __( 'Row', 'designsetgo' ),
						'description' => __( 'Flexible horizontal or vertical layouts with wrapping', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/section',
						'title'       => __( 'Section', 'designsetgo' ),
						'description' => __( 'Vertical stacking container for sections and content areas', 'designsetgo' ),
						'performance' => 'low',
					),
				),
			),
			'ui'          => array(
				'label'  => __( 'UI Elements', 'designsetgo' ),
				'blocks' => array(
					array(
						'name'        => 'designsetgo/icon',
						'title'       => __( 'Icon', 'designsetgo' ),
						'description' => __( 'Inline SVG icons with styling', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/icon-button',
						'title'       => __( 'Icon Button', 'designsetgo' ),
						'description' => __( 'Button with icon support', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/icon-list',
						'title'       => __( 'Icon List', 'designsetgo' ),
						'description' => __( 'List with custom icons', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/icon-list-item',
						'title'       => __( 'Icon List Item', 'designsetgo' ),
						'description' => __( 'Individual list item', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/pill',
						'title'       => __( 'Pill', 'designsetgo' ),
						'description' => __( 'Badge/tag style elements', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/card',
						'title'       => __( 'Card', 'designsetgo' ),
						'description' => __( 'Display content in a card layout with image, badge, title, and CTA', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/divider',
						'title'       => __( 'Divider', 'designsetgo' ),
						'description' => __( 'Visual separator with multiple style options', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/accordion',
						'title'       => __( 'Accordion', 'designsetgo' ),
						'description' => __( 'Traditional accordion container', 'designsetgo' ),
						'performance' => 'medium',
					),
					array(
						'name'        => 'designsetgo/accordion-item',
						'title'       => __( 'Accordion Item', 'designsetgo' ),
						'description' => __( 'Individual accordion panel', 'designsetgo' ),
						'performance' => 'medium',
					),
					array(
						'name'        => 'designsetgo/tabs',
						'title'       => __( 'Tabs', 'designsetgo' ),
						'description' => __( 'Tabbed content with deep linking', 'designsetgo' ),
						'performance' => 'medium',
					),
					array(
						'name'        => 'designsetgo/tab',
						'title'       => __( 'Tab', 'designsetgo' ),
						'description' => __( 'Individual tab panel', 'designsetgo' ),
						'performance' => 'medium',
					),
					array(
						'name'        => 'designsetgo/scroll-accordion',
						'title'       => __( 'Scroll Accordion', 'designsetgo' ),
						'description' => __( 'Sticky stacking scroll effect', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/scroll-accordion-item',
						'title'       => __( 'Scroll Accordion Item', 'designsetgo' ),
						'description' => __( 'Individual scroll panel', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/scroll-marquee',
						'title'       => __( 'Scroll Marquee', 'designsetgo' ),
						'description' => __( 'Infinite scrolling content', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/reveal',
						'title'       => __( 'Reveal', 'designsetgo' ),
						'description' => __( 'Content reveal on scroll', 'designsetgo' ),
						'performance' => 'medium',
					),
					array(
						'name'        => 'designsetgo/image-accordion',
						'title'       => __( 'Image Accordion', 'designsetgo' ),
						'description' => __( 'Accordion with images', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/image-accordion-item',
						'title'       => __( 'Image Accordion Item', 'designsetgo' ),
						'description' => __( 'Individual image item', 'designsetgo' ),
						'performance' => 'high',
					),
				),
			),
			'interactive' => array(
				'label'  => __( 'Interactive Blocks', 'designsetgo' ),
				'blocks' => array(
					array(
						'name'        => 'designsetgo/flip-card',
						'title'       => __( 'Flip Card', 'designsetgo' ),
						'description' => __( '3D flip card container', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/flip-card-front',
						'title'       => __( 'Flip Card Front', 'designsetgo' ),
						'description' => __( 'Front face of flip card', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/flip-card-back',
						'title'       => __( 'Flip Card Back', 'designsetgo' ),
						'description' => __( 'Back face of flip card', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/slider',
						'title'       => __( 'Slider', 'designsetgo' ),
						'description' => __( 'Modern carousel with effects', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/slide',
						'title'       => __( 'Slide', 'designsetgo' ),
						'description' => __( 'Individual slider slide', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/blobs',
						'title'       => __( 'Blobs', 'designsetgo' ),
						'description' => __( 'Animated blob shapes', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/modal',
						'title'       => __( 'Modal', 'designsetgo' ),
						'description' => __( 'Accessible modal dialogs with customizable triggers', 'designsetgo' ),
						'performance' => 'medium',
					),
					array(
						'name'        => 'designsetgo/modal-trigger',
						'title'       => __( 'Modal Trigger', 'designsetgo' ),
						'description' => __( 'Button or link that opens a modal dialog', 'designsetgo' ),
						'performance' => 'low',
					),
				),
			),
			'widgets'     => array(
				'label'  => __( 'Dynamic Blocks', 'designsetgo' ),
				'blocks' => array(
					array(
						'name'        => 'designsetgo/counter-group',
						'title'       => __( 'Counter Group', 'designsetgo' ),
						'description' => __( 'Animated statistics container', 'designsetgo' ),
						'performance' => 'medium',
					),
					array(
						'name'        => 'designsetgo/counter',
						'title'       => __( 'Counter', 'designsetgo' ),
						'description' => __( 'Individual animated counter', 'designsetgo' ),
						'performance' => 'medium',
					),
					array(
						'name'        => 'designsetgo/progress-bar',
						'title'       => __( 'Progress Bar', 'designsetgo' ),
						'description' => __( 'Animated progress indicators', 'designsetgo' ),
						'performance' => 'medium',
					),
					array(
						'name'        => 'designsetgo/countdown-timer',
						'title'       => __( 'Countdown Timer', 'designsetgo' ),
						'description' => __( 'Display a countdown timer to a specific date and time', 'designsetgo' ),
						'performance' => 'medium',
					),
					array(
						'name'        => 'designsetgo/map',
						'title'       => __( 'Map', 'designsetgo' ),
						'description' => __( 'Interactive map using OpenStreetMap or Google Maps', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/breadcrumbs',
						'title'       => __( 'Breadcrumbs', 'designsetgo' ),
						'description' => __( 'Navigation breadcrumbs with Schema.org markup', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/table-of-contents',
						'title'       => __( 'Table of Contents', 'designsetgo' ),
						'description' => __( 'Auto-generate table of contents from page headings', 'designsetgo' ),
						'performance' => 'medium',
					),
				),
			),
			'forms'       => array(
				'label'  => __( 'Form Blocks', 'designsetgo' ),
				'blocks' => array(
					array(
						'name'        => 'designsetgo/form-builder',
						'title'       => __( 'Form Builder', 'designsetgo' ),
						'description' => __( 'Complete form with AJAX submission', 'designsetgo' ),
						'performance' => 'high',
					),
					array(
						'name'        => 'designsetgo/form-text-field',
						'title'       => __( 'Text Field', 'designsetgo' ),
						'description' => __( 'Text input field', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/form-email-field',
						'title'       => __( 'Email Field', 'designsetgo' ),
						'description' => __( 'Email input field', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/form-textarea',
						'title'       => __( 'Textarea', 'designsetgo' ),
						'description' => __( 'Multi-line text input', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/form-number-field',
						'title'       => __( 'Number Field', 'designsetgo' ),
						'description' => __( 'Number input field', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/form-phone-field',
						'title'       => __( 'Phone Field', 'designsetgo' ),
						'description' => __( 'Phone number input', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/form-url-field',
						'title'       => __( 'URL Field', 'designsetgo' ),
						'description' => __( 'URL input field', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/form-date-field',
						'title'       => __( 'Date Field', 'designsetgo' ),
						'description' => __( 'Date picker input', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/form-time-field',
						'title'       => __( 'Time Field', 'designsetgo' ),
						'description' => __( 'Time picker input', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/form-select-field',
						'title'       => __( 'Select Field', 'designsetgo' ),
						'description' => __( 'Dropdown select', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/form-checkbox-field',
						'title'       => __( 'Checkbox Field', 'designsetgo' ),
						'description' => __( 'Checkbox input', 'designsetgo' ),
						'performance' => 'low',
					),
					array(
						'name'        => 'designsetgo/form-hidden-field',
						'title'       => __( 'Hidden Field', 'designsetgo' ),
						'description' => __( 'Hidden form field', 'designsetgo' ),
						'performance' => 'low',
					),
				),
			),
		);
	}

	/**
	 * Get all available extensions
	 *
	 * @return array Extension information.
	 */
	public static function get_available_extensions() {
		return array(
			array(
				'name'        => 'animation',
				'title'       => __( 'Animation', 'designsetgo' ),
				'description' => __( 'Base animation framework', 'designsetgo' ),
			),
			array(
				'name'        => 'background-video',
				'title'       => __( 'Background Video', 'designsetgo' ),
				'description' => __( 'Video backgrounds for blocks', 'designsetgo' ),
			),
			array(
				'name'        => 'block-animations',
				'title'       => __( 'Block Animations', 'designsetgo' ),
				'description' => __( 'Entrance/exit animations for all blocks', 'designsetgo' ),
			),
			array(
				'name'        => 'clickable-group',
				'title'       => __( 'Clickable Group', 'designsetgo' ),
				'description' => __( 'Make container blocks clickable with link functionality', 'designsetgo' ),
			),
			array(
				'name'        => 'custom-css',
				'title'       => __( 'Custom CSS', 'designsetgo' ),
				'description' => __( 'Per-block custom CSS', 'designsetgo' ),
			),
			array(
				'name'        => 'grid-span',
				'title'       => __( 'Grid Span', 'designsetgo' ),
				'description' => __( 'Grid layout span controls', 'designsetgo' ),
			),
			array(
				'name'        => 'max-width',
				'title'       => __( 'Max Width', 'designsetgo' ),
				'description' => __( 'Content width constraints', 'designsetgo' ),
			),
			array(
				'name'        => 'responsive',
				'title'       => __( 'Responsive', 'designsetgo' ),
				'description' => __( 'Responsive visibility/settings', 'designsetgo' ),
			),
			array(
				'name'        => 'reveal-control',
				'title'       => __( 'Reveal Control', 'designsetgo' ),
				'description' => __( 'Controls for reveal animations', 'designsetgo' ),
			),
			array(
				'name'        => 'sticky-header-controls',
				'title'       => __( 'Sticky Header Controls', 'designsetgo' ),
				'description' => __( 'Sticky header configuration for template parts', 'designsetgo' ),
			),
			array(
				'name'        => 'text-alignment-inheritance',
				'title'       => __( 'Text Alignment Inheritance', 'designsetgo' ),
				'description' => __( 'Cascading text alignment', 'designsetgo' ),
			),
			array(
				'name'        => 'expanding-background',
				'title'       => __( 'Expanding Background', 'designsetgo' ),
				'description' => __( 'Scroll-driven expanding background effect', 'designsetgo' ),
			),
			array(
				'name'        => 'text-reveal',
				'title'       => __( 'Text Reveal', 'designsetgo' ),
				'description' => __( 'Scroll-triggered text color reveal effect', 'designsetgo' ),
			),
			array(
				'name'        => 'vertical-scroll-parallax',
				'title'       => __( 'Vertical Scroll Parallax', 'designsetgo' ),
				'description' => __( 'Parallax scrolling effects for blocks', 'designsetgo' ),
			),
		);
	}

	/**
	 * Get current settings
	 *
	 * @return array Current settings merged with defaults.
	 */
	public static function get_settings() {
		$saved_settings = get_option( self::OPTION_NAME, array() );
		$defaults       = self::get_defaults();

		return wp_parse_args( $saved_settings, $defaults );
	}

	/**
	 * Register REST API routes
	 */
	public function register_rest_routes() {
		// Get settings.
		register_rest_route(
			'designsetgo/v1',
			'/settings',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_settings_endpoint' ),
				'permission_callback' => array( $this, 'check_read_permission' ),
			)
		);

		// Update settings.
		register_rest_route(
			'designsetgo/v1',
			'/settings',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_settings_endpoint' ),
				'permission_callback' => array( $this, 'check_write_permission' ),
			)
		);

		// Get available blocks.
		register_rest_route(
			'designsetgo/v1',
			'/blocks',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_blocks_endpoint' ),
				'permission_callback' => array( $this, 'check_read_permission' ),
			)
		);

		// Get available extensions.
		register_rest_route(
			'designsetgo/v1',
			'/extensions',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_extensions_endpoint' ),
				'permission_callback' => array( $this, 'check_read_permission' ),
			)
		);

		// Get plugin stats.
		register_rest_route(
			'designsetgo/v1',
			'/stats',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_stats_endpoint' ),
				'permission_callback' => array( $this, 'check_read_permission' ),
			)
		);
	}

	/**
	 * Check read permission
	 *
	 * @param \WP_REST_Request $_request Request object (unused but required by REST API).
	 * @return bool True if user has permission.
	 */
	public function check_read_permission( $_request ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
		return current_user_can( 'manage_options' );
	}

	/**
	 * Check write permission
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool|\WP_Error True if user has permission, WP_Error otherwise.
	 */
	public function check_write_permission( $request ) {
		// Check capability first (more fundamental than nonce).
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		// Then check nonce.
		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new \WP_Error(
				'invalid_nonce',
				__( 'Invalid security token.', 'designsetgo' ),
				array( 'status' => 403 )
			);
		}

		return true;
	}

	/**
	 * Get settings endpoint
	 *
	 * @return \WP_REST_Response
	 */
	public function get_settings_endpoint() {
		return rest_ensure_response( self::get_settings() );
	}

	/**
	 * Update settings endpoint
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function update_settings_endpoint( $request ) {
		$new_settings = $request->get_json_params();

		// Sanitize settings.
		$sanitized = $this->sanitize_settings( $new_settings );

		update_option( self::OPTION_NAME, $sanitized );

		return rest_ensure_response(
			array(
				'success'  => true,
				'settings' => $sanitized,
			)
		);
	}

	/**
	 * Get blocks endpoint
	 *
	 * @return \WP_REST_Response
	 */
	public function get_blocks_endpoint() {
		return rest_ensure_response( self::get_available_blocks() );
	}

	/**
	 * Get extensions endpoint
	 *
	 * @return \WP_REST_Response
	 */
	public function get_extensions_endpoint() {
		return rest_ensure_response( self::get_available_extensions() );
	}

	/**
	 * Get stats endpoint
	 *
	 * @return \WP_REST_Response
	 */
	public function get_stats_endpoint() {
		global $wpdb;

		$settings     = self::get_settings();
		$all_blocks   = self::get_available_blocks();
		$total_blocks = 0;

		// Count total blocks.
		foreach ( $all_blocks as $category ) {
			$total_blocks += count( $category['blocks'] );
		}

		// Count enabled blocks.
		$enabled_blocks = empty( $settings['enabled_blocks'] ) ? $total_blocks : count( $settings['enabled_blocks'] );

		// Count form submissions (with caching).
		$form_submissions = get_transient( 'dsgo_form_submissions_count' );

		if ( false === $form_submissions ) {
			// Cache miss - run the database query.
			$form_submissions = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = %s",
					'dsgo_form_submission'
				)
			);

			// Cache for 5 minutes.
			set_transient( 'dsgo_form_submissions_count', $form_submissions, 5 * MINUTE_IN_SECONDS );
		}

		return rest_ensure_response(
			array(
				'total_blocks'     => $total_blocks,
				'enabled_blocks'   => $enabled_blocks,
				'form_submissions' => (int) $form_submissions,
			)
		);
	}

	/**
	 * Sanitize settings
	 *
	 * @param array $settings Settings to sanitize.
	 * @return array Sanitized settings.
	 */
	private function sanitize_settings( $settings ): array {
		$sanitized = array();

		// Sanitize enabled blocks.
		if ( isset( $settings['enabled_blocks'] ) && is_array( $settings['enabled_blocks'] ) ) {
			$sanitized['enabled_blocks'] = array_map( 'sanitize_text_field', $settings['enabled_blocks'] );
		}

		// Sanitize enabled extensions.
		if ( isset( $settings['enabled_extensions'] ) && is_array( $settings['enabled_extensions'] ) ) {
			$sanitized['enabled_extensions'] = array_map( 'sanitize_text_field', $settings['enabled_extensions'] );
		}

		// Sanitize excluded blocks.
		if ( isset( $settings['excluded_blocks'] ) && is_array( $settings['excluded_blocks'] ) ) {
			$sanitized['excluded_blocks'] = array_map( 'sanitize_text_field', $settings['excluded_blocks'] );
		}

		// Sanitize performance settings.
		if ( isset( $settings['performance'] ) && is_array( $settings['performance'] ) ) {
			$sanitized['performance'] = array(
				'conditional_loading' => isset( $settings['performance']['conditional_loading'] ) ? (bool) $settings['performance']['conditional_loading'] : true,
				'cache_duration'      => isset( $settings['performance']['cache_duration'] ) ? absint( $settings['performance']['cache_duration'] ) : 3600,
			);
		}

		// Sanitize form settings.
		if ( isset( $settings['forms'] ) && is_array( $settings['forms'] ) ) {
			$sanitized['forms'] = array(
				'enable_honeypot'      => isset( $settings['forms']['enable_honeypot'] ) ? (bool) $settings['forms']['enable_honeypot'] : true,
				'enable_rate_limiting' => isset( $settings['forms']['enable_rate_limiting'] ) ? (bool) $settings['forms']['enable_rate_limiting'] : true,
				'enable_email_logging' => isset( $settings['forms']['enable_email_logging'] ) ? (bool) $settings['forms']['enable_email_logging'] : false,
				'retention_days'       => isset( $settings['forms']['retention_days'] ) ? absint( $settings['forms']['retention_days'] ) : 30,
			);
		}

		// Sanitize animation settings.
		if ( isset( $settings['animations'] ) && is_array( $settings['animations'] ) ) {
			$sanitized['animations'] = array(
				'enable_animations'              => isset( $settings['animations']['enable_animations'] ) ? (bool) $settings['animations']['enable_animations'] : true,
				'default_duration'               => isset( $settings['animations']['default_duration'] ) ? absint( $settings['animations']['default_duration'] ) : 600,
				'default_easing'                 => isset( $settings['animations']['default_easing'] ) ? sanitize_text_field( $settings['animations']['default_easing'] ) : 'ease-in-out',
				'respect_prefers_reduced_motion' => isset( $settings['animations']['respect_prefers_reduced_motion'] ) ? (bool) $settings['animations']['respect_prefers_reduced_motion'] : true,
			);
		}

		// Sanitize security settings.
		if ( isset( $settings['security'] ) && is_array( $settings['security'] ) ) {
			$sanitized['security'] = array(
				'log_ip_addresses' => isset( $settings['security']['log_ip_addresses'] ) ? (bool) $settings['security']['log_ip_addresses'] : true,
				'log_user_agents'  => isset( $settings['security']['log_user_agents'] ) ? (bool) $settings['security']['log_user_agents'] : true,
				'log_referrers'    => isset( $settings['security']['log_referrers'] ) ? (bool) $settings['security']['log_referrers'] : false,
			);
		}

		// Sanitize integrations settings.
		if ( isset( $settings['integrations'] ) && is_array( $settings['integrations'] ) ) {
			$sanitized['integrations'] = array(
				'google_maps_api_key'  => isset( $settings['integrations']['google_maps_api_key'] ) ? sanitize_text_field( $settings['integrations']['google_maps_api_key'] ) : '',
				'turnstile_site_key'   => isset( $settings['integrations']['turnstile_site_key'] ) ? sanitize_text_field( $settings['integrations']['turnstile_site_key'] ) : '',
				'turnstile_secret_key' => isset( $settings['integrations']['turnstile_secret_key'] ) ? sanitize_text_field( $settings['integrations']['turnstile_secret_key'] ) : '',
			);
		}

		// Sanitize sticky header settings.
		if ( isset( $settings['sticky_header'] ) && is_array( $settings['sticky_header'] ) ) {
			$sanitized['sticky_header'] = array(
				'enable'                    => isset( $settings['sticky_header']['enable'] ) ? (bool) $settings['sticky_header']['enable'] : true,
				'custom_selector'           => isset( $settings['sticky_header']['custom_selector'] ) ? sanitize_text_field( $settings['sticky_header']['custom_selector'] ) : '',
				'z_index'                   => isset( $settings['sticky_header']['z_index'] ) ? absint( $settings['sticky_header']['z_index'] ) : 100,
				'shadow_on_scroll'          => isset( $settings['sticky_header']['shadow_on_scroll'] ) ? (bool) $settings['sticky_header']['shadow_on_scroll'] : true,
				'shadow_size'               => isset( $settings['sticky_header']['shadow_size'] ) ? sanitize_text_field( $settings['sticky_header']['shadow_size'] ) : 'medium',
				'shrink_on_scroll'          => isset( $settings['sticky_header']['shrink_on_scroll'] ) ? (bool) $settings['sticky_header']['shrink_on_scroll'] : false,
				'shrink_amount'             => isset( $settings['sticky_header']['shrink_amount'] ) ? absint( $settings['sticky_header']['shrink_amount'] ) : 20,
				'mobile_enabled'            => isset( $settings['sticky_header']['mobile_enabled'] ) ? (bool) $settings['sticky_header']['mobile_enabled'] : true,
				'mobile_breakpoint'         => isset( $settings['sticky_header']['mobile_breakpoint'] ) ? absint( $settings['sticky_header']['mobile_breakpoint'] ) : 768,
				'transition_speed'          => isset( $settings['sticky_header']['transition_speed'] ) ? absint( $settings['sticky_header']['transition_speed'] ) : 300,
				'scroll_threshold'          => isset( $settings['sticky_header']['scroll_threshold'] ) ? absint( $settings['sticky_header']['scroll_threshold'] ) : 50,
				'hide_on_scroll_down'       => isset( $settings['sticky_header']['hide_on_scroll_down'] ) ? (bool) $settings['sticky_header']['hide_on_scroll_down'] : false,
				'background_on_scroll'      => isset( $settings['sticky_header']['background_on_scroll'] ) ? (bool) $settings['sticky_header']['background_on_scroll'] : false,
				'background_scroll_color'   => isset( $settings['sticky_header']['background_scroll_color'] ) ? sanitize_hex_color( $settings['sticky_header']['background_scroll_color'] ) : '',
				'background_scroll_opacity' => isset( $settings['sticky_header']['background_scroll_opacity'] ) ? absint( $settings['sticky_header']['background_scroll_opacity'] ) : 100,
			);
		}

		return $sanitized;
	}
}
