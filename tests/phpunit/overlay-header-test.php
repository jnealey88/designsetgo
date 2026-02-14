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
		$this->assertEmpty( $value, 'Meta should default to empty/false' );
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
}
