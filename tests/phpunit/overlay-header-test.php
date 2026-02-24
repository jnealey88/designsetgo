<?php
/**
 * Tests for Overlay Header Feature
 *
 * Tests post meta registration, body class output, and auth callback.
 *
 * @package DesignSetGo
 */

namespace DesignSetGo\Tests;

use WP_UnitTestCase;
use DesignSetGo\Overlay_Header;

/**
 * Overlay Header Test Case
 */
class Test_Overlay_Header extends WP_UnitTestCase {
	/**
	 * Overlay Header instance.
	 *
	 * @var Overlay_Header
	 */
	private $overlay_header;

	/**
	 * Admin user ID.
	 *
	 * @var int
	 */
	private $admin_user;

	/**
	 * Subscriber user ID.
	 *
	 * @var int
	 */
	private $subscriber_user;

	/**
	 * Set up test environment.
	 */
	public function set_up() {
		parent::set_up();

		$this->overlay_header = new Overlay_Header();

		$this->admin_user = $this->factory->user->create(
			array(
				'role' => 'administrator',
			)
		);

		$this->subscriber_user = $this->factory->user->create(
			array(
				'role' => 'subscriber',
			)
		);
	}

	/**
	 * Test that the class exists.
	 */
	public function test_class_exists() {
		$this->assertTrue( class_exists( 'DesignSetGo\Overlay_Header' ) );
	}

	/**
	 * Test META_KEY constant value.
	 */
	public function test_meta_key_constant() {
		$this->assertSame( 'dsgo_overlay_header', Overlay_Header::META_KEY );
	}

	/**
	 * Test that the overlay header instance is wired into the plugin.
	 */
	public function test_plugin_has_overlay_header_instance() {
		$plugin = \DesignSetGo\Plugin::instance();
		$this->assertInstanceOf( Overlay_Header::class, $plugin->overlay_header );
	}

	/**
	 * Test that post meta is registered on the 'post' post type.
	 */
	public function test_post_meta_registered_for_post() {
		$this->overlay_header->register_post_meta();

		$registered = registered_meta_key_exists( 'post', Overlay_Header::META_KEY, 'post' );
		$this->assertTrue( $registered, 'dsgo_overlay_header meta should be registered for post type "post"' );
	}

	/**
	 * Test that post meta is registered on the 'page' post type.
	 */
	public function test_post_meta_registered_for_page() {
		$this->overlay_header->register_post_meta();

		$registered = registered_meta_key_exists( 'post', Overlay_Header::META_KEY, 'page' );
		$this->assertTrue( $registered, 'dsgo_overlay_header meta should be registered for post type "page"' );
	}

	/**
	 * Test that post meta is NOT registered on 'attachment' post type.
	 */
	public function test_post_meta_not_registered_for_attachment() {
		$this->overlay_header->register_post_meta();

		$registered = registered_meta_key_exists( 'post', Overlay_Header::META_KEY, 'attachment' );
		$this->assertFalse( $registered, 'dsgo_overlay_header meta should NOT be registered for attachment' );
	}

	/**
	 * Test that post meta defaults to false.
	 */
	public function test_post_meta_defaults_to_false() {
		$post_id = $this->factory->post->create();

		$value = get_post_meta( $post_id, Overlay_Header::META_KEY, true );
		$this->assertFalse( (bool) $value, 'Meta should default to false' );
	}

	/**
	 * Test that post meta can be set and retrieved.
	 */
	public function test_post_meta_can_be_set() {
		wp_set_current_user( $this->admin_user );
		$post_id = $this->factory->post->create();

		update_post_meta( $post_id, Overlay_Header::META_KEY, true );

		$value = get_post_meta( $post_id, Overlay_Header::META_KEY, true );
		$this->assertTrue( (bool) $value, 'Meta should be true after setting' );
	}

	/**
	 * Test body class is added when overlay is enabled on singular page.
	 */
	public function test_body_class_added_when_enabled() {
		$post_id = $this->factory->post->create();
		update_post_meta( $post_id, Overlay_Header::META_KEY, true );

		// Simulate singular context.
		$this->go_to( get_permalink( $post_id ) );
		$this->assertTrue( is_singular(), 'Should be a singular page' );

		$classes = $this->overlay_header->add_body_class( array() );
		$this->assertContains( 'dsgo-page-overlay-header', $classes );
	}

	/**
	 * Test body class is NOT added when overlay is disabled.
	 */
	public function test_body_class_not_added_when_disabled() {
		$post_id = $this->factory->post->create();
		// Meta defaults to false, don't set it.

		$this->go_to( get_permalink( $post_id ) );
		$this->assertTrue( is_singular() );

		$classes = $this->overlay_header->add_body_class( array() );
		$this->assertNotContains( 'dsgo-page-overlay-header', $classes );
	}

	/**
	 * Test body class is NOT added on non-singular pages (e.g., archive).
	 */
	public function test_body_class_not_added_on_archive() {
		$this->factory->post->create();
		$this->go_to( home_url() );
		$this->assertFalse( is_singular() );

		$classes = $this->overlay_header->add_body_class( array() );
		$this->assertNotContains( 'dsgo-page-overlay-header', $classes );
	}

	/**
	 * Test body class preserves existing classes.
	 */
	public function test_body_class_preserves_existing() {
		$post_id = $this->factory->post->create();
		update_post_meta( $post_id, Overlay_Header::META_KEY, true );

		$this->go_to( get_permalink( $post_id ) );

		$existing = array( 'custom-class', 'another-class' );
		$classes  = $this->overlay_header->add_body_class( $existing );

		$this->assertContains( 'custom-class', $classes );
		$this->assertContains( 'another-class', $classes );
		$this->assertContains( 'dsgo-page-overlay-header', $classes );
	}

	/**
	 * Test body class works correctly on pages (not just posts).
	 */
	public function test_body_class_on_page() {
		$page_id = $this->factory->post->create( array( 'post_type' => 'page' ) );
		update_post_meta( $page_id, Overlay_Header::META_KEY, true );

		$this->go_to( get_permalink( $page_id ) );
		$this->assertTrue( is_singular() );

		$classes = $this->overlay_header->add_body_class( array() );
		$this->assertContains( 'dsgo-page-overlay-header', $classes );
	}

	/**
	 * Test that init hook is registered.
	 */
	public function test_init_hook_registered() {
		$overlay = new Overlay_Header();
		$this->assertGreaterThan(
			0,
			has_action( 'init', array( $overlay, 'register_post_meta' ) ),
			'register_post_meta should be hooked to init'
		);
	}

	/**
	 * Test that body_class filter is registered.
	 */
	public function test_body_class_filter_registered() {
		$overlay = new Overlay_Header();
		$this->assertGreaterThan(
			0,
			has_filter( 'body_class', array( $overlay, 'add_body_class' ) ),
			'add_body_class should be hooked to body_class'
		);
	}

	/**
	 * Test auth callback allows admin to edit meta.
	 */
	public function test_auth_callback_allows_admin() {
		wp_set_current_user( $this->admin_user );
		$post_id = $this->factory->post->create();

		$this->assertTrue(
			current_user_can( 'edit_post', $post_id ),
			'Admin should be able to edit post meta'
		);
	}

	/**
	 * Test auth callback denies subscriber.
	 */
	public function test_auth_callback_denies_subscriber() {
		wp_set_current_user( $this->subscriber_user );
		$post_id = $this->factory->post->create();

		$this->assertFalse(
			current_user_can( 'edit_post', $post_id ),
			'Subscriber should NOT be able to edit post meta'
		);
	}

	/**
	 * Test meta sanitization coerces truthy string to boolean.
	 */
	public function test_meta_sanitization() {
		$post_id = $this->factory->post->create();

		// rest_sanitize_boolean should handle string "true".
		$sanitized = rest_sanitize_boolean( 'true' );
		$this->assertTrue( $sanitized );

		// And "false" / "0".
		$this->assertFalse( rest_sanitize_boolean( 'false' ) );
		$this->assertFalse( rest_sanitize_boolean( '0' ) );
		$this->assertFalse( rest_sanitize_boolean( '' ) );
	}

	/**
	 * Test TEXT_COLOR_META_KEY constant value.
	 */
	public function test_text_color_meta_key_constant() {
		$this->assertSame( 'dsgo_overlay_header_text_color', Overlay_Header::TEXT_COLOR_META_KEY );
	}

	/**
	 * Test that text color meta is registered on 'post' post type.
	 */
	public function test_text_color_meta_registered_for_post() {
		$this->overlay_header->register_post_meta();

		$registered = registered_meta_key_exists( 'post', Overlay_Header::TEXT_COLOR_META_KEY, 'post' );
		$this->assertTrue( $registered, 'dsgo_overlay_header_text_color meta should be registered for post type "post"' );
	}

	/**
	 * Test that text color meta is registered on 'page' post type.
	 */
	public function test_text_color_meta_registered_for_page() {
		$this->overlay_header->register_post_meta();

		$registered = registered_meta_key_exists( 'post', Overlay_Header::TEXT_COLOR_META_KEY, 'page' );
		$this->assertTrue( $registered, 'dsgo_overlay_header_text_color meta should be registered for post type "page"' );
	}

	/**
	 * Test that text color meta is NOT registered on 'attachment' post type.
	 */
	public function test_text_color_meta_not_registered_for_attachment() {
		$this->overlay_header->register_post_meta();

		$registered = registered_meta_key_exists( 'post', Overlay_Header::TEXT_COLOR_META_KEY, 'attachment' );
		$this->assertFalse( $registered, 'dsgo_overlay_header_text_color meta should NOT be registered for attachment' );
	}

	/**
	 * Test that text color meta defaults to empty string.
	 */
	public function test_text_color_meta_defaults_to_empty() {
		$post_id = $this->factory->post->create();

		$value = get_post_meta( $post_id, Overlay_Header::TEXT_COLOR_META_KEY, true );
		$this->assertSame( '', $value, 'Text color meta should default to empty string' );
	}

	/**
	 * Test that text color meta can be set and retrieved.
	 */
	public function test_text_color_meta_can_be_set() {
		wp_set_current_user( $this->admin_user );
		$post_id = $this->factory->post->create();

		update_post_meta( $post_id, Overlay_Header::TEXT_COLOR_META_KEY, 'base' );

		$value = get_post_meta( $post_id, Overlay_Header::TEXT_COLOR_META_KEY, true );
		$this->assertSame( 'base', $value, 'Text color meta should return the stored slug' );
	}

	/**
	 * Test that text color meta is sanitized to valid slug characters.
	 */
	public function test_text_color_meta_sanitization() {
		$this->assertSame( 'base', sanitize_key( 'base' ) );
		$this->assertSame( 'primary-dark', sanitize_key( 'primary-dark' ) );
		// sanitize_key strips &, ;, <, > and lowercases — XSS payload becomes harmless.
		$this->assertNotSame( '&lt;script&gt;alert(1)&lt;/script&gt;', sanitize_key( '&lt;script&gt;alert(1)&lt;/script&gt;' ) );
		$this->assertSame( 'base', sanitize_key( 'Base' ) );
	}

	/**
	 * Test that inline CSS is output when text color is set.
	 */
	public function test_inline_css_output_when_text_color_set() {
		$post_id = $this->factory->post->create();
		update_post_meta( $post_id, Overlay_Header::META_KEY, true );
		update_post_meta( $post_id, Overlay_Header::TEXT_COLOR_META_KEY, 'base' );

		$this->go_to( get_permalink( $post_id ) );

		$css = $this->overlay_header->get_overlay_text_color_css();
		$this->assertStringContainsString( '--dsgo-overlay-header-text-color', $css );
		$this->assertStringContainsString( 'var(--wp--preset--color--base)', $css );
	}

	/**
	 * Test that inline CSS is empty when text color is not set.
	 */
	public function test_inline_css_empty_when_no_text_color() {
		$post_id = $this->factory->post->create();
		update_post_meta( $post_id, Overlay_Header::META_KEY, true );

		$this->go_to( get_permalink( $post_id ) );

		$css = $this->overlay_header->get_overlay_text_color_css();
		$this->assertSame( '', $css );
	}

	/**
	 * Test that inline CSS is empty on non-singular pages.
	 */
	public function test_inline_css_empty_on_archive() {
		$this->factory->post->create();
		$this->go_to( home_url() );

		$css = $this->overlay_header->get_overlay_text_color_css();
		$this->assertSame( '', $css );
	}

	/**
	 * Test that inline CSS is empty when overlay is disabled.
	 */
	public function test_inline_css_empty_when_overlay_disabled() {
		$post_id = $this->factory->post->create();
		update_post_meta( $post_id, Overlay_Header::TEXT_COLOR_META_KEY, 'base' );

		$this->go_to( get_permalink( $post_id ) );

		$css = $this->overlay_header->get_overlay_text_color_css();
		$this->assertSame( '', $css );
	}

	/**
	 * Test wp_enqueue_scripts hook is registered.
	 */
	public function test_enqueue_scripts_hook_registered() {
		$overlay = new Overlay_Header();
		$this->assertGreaterThan(
			0,
			has_action( 'wp_enqueue_scripts', array( $overlay, 'enqueue_overlay_styles' ) ),
			'enqueue_overlay_styles should be hooked to wp_enqueue_scripts'
		);
	}

	/**
	 * Test that enqueue_overlay_styles attaches inline CSS to the sticky-header handle when it is enqueued.
	 */
	public function test_enqueue_overlay_styles_uses_sticky_header_handle_when_enqueued() {
		$post_id = $this->factory->post->create();
		update_post_meta( $post_id, Overlay_Header::META_KEY, true );
		update_post_meta( $post_id, Overlay_Header::TEXT_COLOR_META_KEY, 'base' );
		$this->go_to( get_permalink( $post_id ) );

		// Register and enqueue the sticky-header handle to simulate sticky header being active.
		wp_register_style( 'designsetgo-sticky-header', false );
		wp_enqueue_style( 'designsetgo-sticky-header' );

		$this->overlay_header->enqueue_overlay_styles();

		$inline = wp_styles()->get_data( 'designsetgo-sticky-header', 'after' );
		$this->assertNotEmpty( $inline, 'Inline CSS should be attached to designsetgo-sticky-header' );
		$this->assertStringContainsString( '--dsgo-overlay-header-text-color', implode( '', (array) $inline ) );
	}

	/**
	 * Test that enqueue_overlay_styles registers a fallback handle when sticky-header is not enqueued.
	 */
	public function test_enqueue_overlay_styles_uses_fallback_handle_when_sticky_not_enqueued() {
		$post_id = $this->factory->post->create();
		update_post_meta( $post_id, Overlay_Header::META_KEY, true );
		update_post_meta( $post_id, Overlay_Header::TEXT_COLOR_META_KEY, 'contrast' );
		$this->go_to( get_permalink( $post_id ) );

		// Ensure sticky-header handle is absent.
		wp_dequeue_style( 'designsetgo-sticky-header' );
		wp_deregister_style( 'designsetgo-sticky-header' );

		$this->overlay_header->enqueue_overlay_styles();

		$this->assertTrue(
			wp_style_is( 'designsetgo-overlay-header-color', 'enqueued' ),
			'Fallback handle designsetgo-overlay-header-color should be enqueued'
		);

		$inline = wp_styles()->get_data( 'designsetgo-overlay-header-color', 'after' );
		$this->assertNotEmpty( $inline, 'Inline CSS should be attached to fallback handle' );
		$this->assertStringContainsString( '--dsgo-overlay-header-text-color', implode( '', (array) $inline ) );
	}
}
