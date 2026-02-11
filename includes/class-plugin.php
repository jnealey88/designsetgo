<?php
/**
 * Main Plugin Class
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Plugin Class
 */
class Plugin {
	/**
	 * Allowed hover animation slugs for Icon Button blocks.
	 *
	 * Single source of truth used by both the regex check and the
	 * allowlist validation in apply_default_icon_button_hover().
	 *
	 * @var string[]
	 */
	private const ALLOWED_HOVER_ANIMATIONS = array(
		'fill-diagonal',
		'zoom-in',
		'slide-left',
		'slide-right',
		'slide-down',
		'slide-up',
		'border-pulse',
		'border-glow',
		'lift',
		'shrink',
	);

	/**
	 * Instance of this class.
	 *
	 * @var Plugin|null
	 */
	private static $instance = null;

	/**
	 * Assets instance.
	 *
	 * @var Assets
	 */
	public $assets;

	/**
	 * Blocks Loader instance.
	 *
	 * @var Blocks\Loader
	 */
	public $blocks;

	/**
	 * Modal Hooks instance.
	 *
	 * @var Blocks\Modal_Hooks
	 */
	public $modal_hooks;

	/**
	 * Form Handler instance.
	 *
	 * @var Blocks\Form_Handler
	 */
	public $form_handler;

	/**
	 * Form Submissions instance.
	 *
	 * @var Blocks\Form_Submissions
	 */
	public $form_submissions;

	/**
	 * Patterns Loader instance.
	 *
	 * @var Patterns\Loader
	 */
	public $patterns;

	/**
	 * Global Styles instance.
	 *
	 * @var Admin\Global_Styles
	 */
	public $global_styles;

	/**
	 * Admin Menu instance.
	 *
	 * @var Admin\Admin_Menu
	 */
	public $admin_menu;

	/**
	 * Settings instance.
	 *
	 * @var Admin\Settings
	 */
	public $settings;

	/**
	 * Block Manager instance.
	 *
	 * @var Admin\Block_Manager
	 */
	public $block_manager;

	/**
	 * GDPR Compliance instance.
	 *
	 * @var Admin\GDPR_Compliance
	 */
	public $gdpr_compliance;

	/**
	 * Custom CSS Renderer instance.
	 *
	 * @var Custom_CSS_Renderer
	 */
	public $custom_css_renderer;

	/**
	 * Abilities Registry instance.
	 *
	 * @var Abilities\Abilities_Registry
	 */
	public $abilities_registry;

	/**
	 * Section Styles instance.
	 *
	 * @var Section_Styles
	 */
	public $section_styles;

	/**
	 * Sticky Header instance.
	 *
	 * @var Sticky_Header
	 */
	public $sticky_header;

	/**
	 * Icon Injector instance.
	 *
	 * @var Icon_Injector
	 */
	public $icon_injector;

	/**
	 * Draft Mode instance.
	 *
	 * @var Admin\Draft_Mode
	 */
	public $draft_mode;

	/**
	 * Revision Comparison instance.
	 *
	 * @var Admin\Revision_Comparison
	 */
	public $revision_comparison;

	/**
	 * LLMS TXT instance.
	 *
	 * @var LLMS_Txt\Controller
	 */
	public $llms_txt;

	/**
	 * Extension Attributes instance.
	 *
	 * @var Extension_Attributes
	 */
	public $extension_attrs;

	/**
	 * Returns the instance.
	 *
	 * @return Plugin
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->load_dependencies();
		$this->init();
	}

	/**
	 * Load required files.
	 */
	private function load_dependencies() {
		require_once DESIGNSETGO_PATH . 'includes/class-assets.php';
		require_once DESIGNSETGO_PATH . 'includes/blocks/class-loader.php';
		require_once DESIGNSETGO_PATH . 'includes/blocks/class-form-security.php';
		require_once DESIGNSETGO_PATH . 'includes/blocks/class-form-handler.php';
		require_once DESIGNSETGO_PATH . 'includes/blocks/class-form-submissions.php';
		require_once DESIGNSETGO_PATH . 'includes/blocks/class-modal-hooks.php';
		require_once DESIGNSETGO_PATH . 'includes/patterns/class-loader.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-global-styles.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-settings.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-block-manager.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-gdpr-compliance.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-admin-menu.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-draft-mode-rest.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-draft-mode-admin.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-draft-mode.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-draft-mode-preview.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-block-differ.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-revision-renderer.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-revision-rest-api.php';
		require_once DESIGNSETGO_PATH . 'includes/admin/class-revision-comparison.php';
		require_once DESIGNSETGO_PATH . 'includes/class-custom-css-renderer.php';
		require_once DESIGNSETGO_PATH . 'includes/class-section-styles.php';
		require_once DESIGNSETGO_PATH . 'includes/class-sticky-header.php';
		require_once DESIGNSETGO_PATH . 'includes/class-icon-injector.php';
		require_once DESIGNSETGO_PATH . 'includes/class-extension-attributes.php';

		// LLMS TXT classes.
		require_once DESIGNSETGO_PATH . 'includes/llms-txt/class-file-manager.php';
		require_once DESIGNSETGO_PATH . 'includes/llms-txt/class-generator.php';
		require_once DESIGNSETGO_PATH . 'includes/llms-txt/class-conflict-detector.php';
		require_once DESIGNSETGO_PATH . 'includes/llms-txt/class-rest-controller.php';
		require_once DESIGNSETGO_PATH . 'includes/llms-txt/class-controller.php';

		// Markdown converter classes.
		require_once DESIGNSETGO_PATH . 'includes/markdown/class-core-handlers.php';
		require_once DESIGNSETGO_PATH . 'includes/markdown/class-dsgo-handlers.php';
		require_once DESIGNSETGO_PATH . 'includes/markdown/class-converter.php';

		require_once DESIGNSETGO_PATH . 'includes/helpers.php';

		// Load Composer autoloader if available.
		if ( file_exists( DESIGNSETGO_PATH . 'vendor/autoload.php' ) ) {
			require_once DESIGNSETGO_PATH . 'vendor/autoload.php';
		}

		// Load WordPress Abilities API polyfill for WordPress < 6.9.
		// WordPress 6.9+ includes the Abilities API natively.
		if ( ! function_exists( 'wp_register_ability' ) ) {
			if ( file_exists( DESIGNSETGO_PATH . 'vendor/wordpress/abilities-api/includes/bootstrap.php' ) ) {
				if ( ! defined( 'WP_ABILITIES_API_DIR' ) ) {
					define( 'WP_ABILITIES_API_DIR', DESIGNSETGO_PATH . 'vendor/wordpress/abilities-api/' );
				}
				require_once DESIGNSETGO_PATH . 'vendor/wordpress/abilities-api/includes/bootstrap.php';
			}
		}

		// Load Abilities Registry.
		require_once DESIGNSETGO_PATH . 'includes/abilities/class-abilities-registry.php';
	}

	/**
	 * Initialize the plugin.
	 */
	private function init() {
		// Initialize components.
		$this->assets              = new Assets();
		$this->blocks              = new Blocks\Loader();
		$this->extension_attrs     = new Extension_Attributes();
		$this->modal_hooks         = new Blocks\Modal_Hooks();
		$this->form_handler        = new Blocks\Form_Handler();
		$this->form_submissions    = new Blocks\Form_Submissions();
		$this->patterns            = new Patterns\Loader();
		$this->global_styles       = new Admin\Global_Styles();
		$this->settings            = new Admin\Settings();
		$this->block_manager       = new Admin\Block_Manager();
		$this->gdpr_compliance     = new Admin\GDPR_Compliance();
		$this->custom_css_renderer = new Custom_CSS_Renderer();
		$this->section_styles      = new Section_Styles();
		$this->section_styles->init();
		$this->sticky_header = new Sticky_Header();
		$this->icon_injector = new Icon_Injector();
		$this->llms_txt      = new LLMS_Txt\Controller();

		// Initialize revision comparison (needs REST routes registered for all contexts).
		$this->revision_comparison = new Admin\Revision_Comparison();

		// Initialize admin-only features.
		if ( is_admin() ) {
			$this->admin_menu = new Admin\Admin_Menu();
		}

		// Initialize draft mode (works on both admin and REST API).
		$this->draft_mode = new Admin\Draft_Mode();

		// Initialize Abilities Registry (AI-native API).
		if ( class_exists( 'DesignSetGo\Abilities\Abilities_Registry' ) ) {
			$this->abilities_registry = Abilities\Abilities_Registry::get_instance();
		}

		// Hook into WordPress.
		// Note: load_plugin_textdomain() is not needed for WordPress.org plugins since WP 4.6+.
		// WordPress automatically loads translations from wordpress.org.
		add_action( 'enqueue_block_editor_assets', array( $this, 'editor_assets' ) );

		// Add block category.
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ), 10, 2 );

		// Inject API keys into Map block on render.
		add_filter( 'render_block_designsetgo/map', array( $this, 'inject_map_api_key' ), 10, 2 );

		// Inject parallax data attributes into block output (server-side fallback).
		add_filter( 'render_block', array( $this, 'inject_parallax_attributes' ), 10, 2 );

		// Apply global default hover animation to Icon Button blocks.
		add_filter( 'render_block_designsetgo/icon-button', array( $this, 'apply_default_icon_button_hover' ), 10, 2 );
	}

	/**
	 * Enqueue editor assets.
	 *
	 * Note: Block-specific assets are loaded automatically via block.json.
	 */
	public function editor_assets() {
		// Enqueue block category filter to show blocks in multiple categories.
		$asset_file = DESIGNSETGO_PATH . 'build/block-category-filter.asset.php';

		if ( file_exists( $asset_file ) ) {
			$asset = include $asset_file;

			wp_enqueue_script(
				'designsetgo-block-category-filter',
				DESIGNSETGO_URL . 'build/block-category-filter.js',
				$asset['dependencies'],
				$asset['version'],
				true
			);

			// Localize sticky header global settings for FSE controls.
			$settings        = \DesignSetGo\Admin\Settings::get_settings();
			$sticky_settings = isset( $settings['sticky_header'] ) ? $settings['sticky_header'] : array();
			$defaults        = \DesignSetGo\Admin\Settings::get_defaults();
			$sticky_settings = wp_parse_args( $sticky_settings, $defaults['sticky_header'] );

			wp_localize_script(
				'designsetgo-block-category-filter',
				'dsgoStickyHeaderGlobalSettings',
				array(
					'enabled' => (bool) $sticky_settings['enable'],
				)
			);

			// Localize integrations settings (Google Maps API key, etc.).
			$integrations_settings = isset( $settings['integrations'] ) ? $settings['integrations'] : array();
			$integrations_defaults = isset( $defaults['integrations'] ) ? $defaults['integrations'] : array();
			$integrations_settings = wp_parse_args( $integrations_settings, $integrations_defaults );

			wp_localize_script(
				'designsetgo-block-category-filter',
				'dsgoIntegrations',
				array(
					'googleMapsApiKey'    => ! empty( $integrations_settings['google_maps_api_key'] ) ? esc_js( $integrations_settings['google_maps_api_key'] ) : '',
					'turnstileSiteKey'    => ! empty( $integrations_settings['turnstile_site_key'] ) ? esc_js( $integrations_settings['turnstile_site_key'] ) : '',
					'turnstileConfigured' => ! empty( $integrations_settings['turnstile_site_key'] ) && ! empty( $integrations_settings['turnstile_secret_key'] ),
				)
			);
		}

		// Enqueue llms.txt editor panel.
		$llms_asset_file = DESIGNSETGO_PATH . 'build/llms-txt.asset.php';

		if ( file_exists( $llms_asset_file ) ) {
			$llms_asset = include $llms_asset_file;

			wp_enqueue_script(
				'dsgo-llms-txt-panel',
				DESIGNSETGO_URL . 'build/llms-txt.js',
				$llms_asset['dependencies'],
				$llms_asset['version'],
				true
			);
		}

		// Localize excluded blocks setting for extension filtering.
		// This is done outside the block-category-filter conditional because
		// the 'designsetgo-extensions' script is registered separately in the Assets class.
		if ( wp_script_is( 'designsetgo-extensions', 'registered' ) || wp_script_is( 'designsetgo-extensions', 'enqueued' ) ) {
			$settings        = $settings ?? \DesignSetGo\Admin\Settings::get_settings();
			$excluded_blocks = isset( $settings['excluded_blocks'] ) ? $settings['excluded_blocks'] : array();

			wp_localize_script(
				'designsetgo-extensions',
				'dsgoSettings',
				array(
					'excludedBlocks'         => $excluded_blocks,
					'defaultIconButtonHover' => isset( $settings['animations']['default_icon_button_hover'] )
						? sanitize_key( $settings['animations']['default_icon_button_hover'] )
						: 'fill-diagonal',
				)
			);
		}
	}

	/**
	 * Register DesignSetGo block category.
	 *
	 * @param array    $categories Block categories.
	 * @param \WP_Post $post       Current post object (unused).
	 * @return array Modified categories.
	 */
	public function register_block_category( $categories, $post = null ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		$categories[] = array(
			'slug'  => 'designsetgo',
			'title' => __( 'DesignSetGo', 'designsetgo' ),
			'icon'  => 'layout',
		);

		return $categories;
	}

	/**
	 * Inject Google Maps API key into Map block on render.
	 *
	 * Security Note: Google Maps JavaScript API keys are designed to be public
	 * (client-side). Security is enforced through:
	 * 1. HTTP referrer restrictions (configured in Google Cloud Console)
	 * 2. API quotas and billing limits
	 * 3. Rate limiting
	 *
	 * This is the standard recommended approach per Google's documentation.
	 * Users are warned to configure referrer restrictions in the settings panel.
	 *
	 * @param string $block_content Block HTML content.
	 * @param array  $block         Block data including name and attributes.
	 * @return string Modified block content.
	 */
	public function inject_map_api_key( $block_content, $block ) {
		// Get settings.
		$settings = \DesignSetGo\Admin\Settings::get_settings();

		// Get Google Maps API key from settings.
		$api_key = isset( $settings['integrations']['google_maps_api_key'] )
			? $settings['integrations']['google_maps_api_key']
			: '';

		// If no API key or not using Google Maps, return unmodified content.
		if ( empty( $api_key ) ) {
			return $block_content;
		}

		// Only inject if the block is using Google Maps provider.
		$provider = isset( $block['attrs']['dsgoProvider'] ) ? $block['attrs']['dsgoProvider'] : 'openstreetmap';
		if ( 'googlemaps' !== $provider ) {
			return $block_content;
		}

		// Inject API key as a data attribute.
		// Find the opening div tag with class dsgo-map.
		$pattern     = '/(<div[^>]*class="[^"]*dsgo-map[^"]*"[^>]*)/';
		$replacement = '$1 data-dsgo-api-key="' . esc_attr( $api_key ) . '"';

		return preg_replace( $pattern, $replacement, $block_content, 1 );
	}

	/**
	 * Inject parallax data attributes into block output.
	 *
	 * Server-side fallback that ensures parallax data attributes are present
	 * on block HTML even if the client-side blocks.getSaveContent.extraProps
	 * filter didn't persist them. Uses WP_HTML_Tag_Processor for safe HTML
	 * modification.
	 *
	 * @param string $block_content Rendered block content.
	 * @param array  $block         Block data including attrs.
	 * @return string Modified block content.
	 */
	public function inject_parallax_attributes( $block_content, $block ) {
		// Only process blocks with parallax enabled.
		if ( empty( $block['attrs']['dsgoParallaxEnabled'] ) ) {
			return $block_content;
		}

		// Skip if data attributes already exist in the HTML.
		if ( strpos( $block_content, 'data-dsgo-parallax-enabled' ) !== false ) {
			return $block_content;
		}

		// Skip empty content.
		if ( empty( $block_content ) ) {
			return $block_content;
		}

		$attrs = $block['attrs'];

		// Validate string values against whitelists.
		$allowed_directions = array( 'up', 'down', 'left', 'right' );
		$direction          = $attrs['dsgoParallaxDirection'] ?? 'up';
		$direction          = in_array( $direction, $allowed_directions, true ) ? $direction : 'up';

		$allowed_relative = array( 'viewport', 'page' );
		$relative_to      = $attrs['dsgoParallaxRelativeTo'] ?? 'viewport';
		$relative_to      = in_array( $relative_to, $allowed_relative, true ) ? $relative_to : 'viewport';

		// Clamp numeric values to valid ranges.
		$speed          = max( 0, min( 10, intval( $attrs['dsgoParallaxSpeed'] ?? 5 ) ) );
		$viewport_start = max( 0, min( 100, intval( $attrs['dsgoParallaxViewportStart'] ?? 0 ) ) );
		$viewport_end   = max( 0, min( 100, intval( $attrs['dsgoParallaxViewportEnd'] ?? 100 ) ) );

		$processor = new \WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$processor->set_attribute( 'data-dsgo-parallax-enabled', 'true' );
			$processor->set_attribute( 'data-dsgo-parallax-direction', $direction );
			$processor->set_attribute( 'data-dsgo-parallax-speed', (string) $speed );
			$processor->set_attribute( 'data-dsgo-parallax-viewport-start', (string) $viewport_start );
			$processor->set_attribute( 'data-dsgo-parallax-viewport-end', (string) $viewport_end );
			$processor->set_attribute( 'data-dsgo-parallax-relative-to', $relative_to );
			$processor->set_attribute( 'data-dsgo-parallax-desktop', ( $attrs['dsgoParallaxDesktop'] ?? true ) ? 'true' : 'false' );
			$processor->set_attribute( 'data-dsgo-parallax-tablet', ( $attrs['dsgoParallaxTablet'] ?? true ) ? 'true' : 'false' );
			$processor->set_attribute( 'data-dsgo-parallax-mobile', ( $attrs['dsgoParallaxMobile'] ?? false ) ? 'true' : 'false' );
			$processor->add_class( 'dsgo-has-parallax' );

			$block_content = $processor->get_updated_html();
		}

		return $block_content;
	}

	/**
	 * Apply global default hover animation to Icon Button blocks.
	 *
	 * When an icon button has no explicit hover animation, this injects the
	 * default animation class at render time. Resolution priority:
	 * per-block > admin settings > theme.json > none.
	 * Blocks with explicit animations or "no animation" override are unchanged.
	 *
	 * @param string $block_content Rendered block content.
	 * @param array  $block         Block data including attrs.
	 * @return string Modified block content.
	 */
	public function apply_default_icon_button_hover( $block_content, $block ) {
		if ( empty( $block_content ) ) {
			return $block_content;
		}

		// If block explicitly opted out of hover animation, leave unchanged.
		if ( strpos( $block_content, 'dsgo-icon-button--no-hover' ) !== false ) {
			return $block_content;
		}

		// If block already has an explicit animation class, leave unchanged.
		$pattern = '/dsgo-icon-button--(' . implode( '|', array_map( 'preg_quote', self::ALLOWED_HOVER_ANIMATIONS ) ) . ')/';
		if ( preg_match( $pattern, $block_content ) ) {
			return $block_content;
		}

		// No explicit animation — resolve default.
		// Priority: admin settings > theme.json > none.
		$settings      = \DesignSetGo\Admin\Settings::get_settings();
		$admin_default = isset( $settings['animations']['default_icon_button_hover'] )
			? sanitize_key( $settings['animations']['default_icon_button_hover'] )
			: 'none';

		$default = $admin_default;
		if ( 'none' === $default ) {
			// Fall back to theme.json custom setting.
			$theme_default = wp_get_global_settings( array( 'custom', 'designsetgo', 'defaultIconButtonHover' ) );
			if ( ! empty( $theme_default ) && is_string( $theme_default ) ) {
				$theme_default = sanitize_key( $theme_default );
				if ( 'none' !== $theme_default ) {
					$default = $theme_default;
				}
			}
		}

		// Validate against allowed animation names.
		if ( 'none' === $default || ! in_array( $default, self::ALLOWED_HOVER_ANIMATIONS, true ) ) {
			return $block_content;
		}

		// Use WP_HTML_Tag_Processor for safe class injection.
		$processor = new \WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$processor->add_class( 'dsgo-icon-button--' . $default );
			$block_content = $processor->get_updated_html();
		}

		return $block_content;
	}
}
