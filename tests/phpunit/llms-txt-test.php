<?php
/**
 * Tests for llms.txt Feature
 *
 * Tests the llms.txt generation, caching, exclusion logic,
 * REST API endpoints, and markdown conversion.
 *
 * @package DesignSetGo
 */

namespace DesignSetGo\Tests;

use WP_UnitTestCase;
use WP_REST_Request;
use DesignSetGo\LLMS_Txt;
use DesignSetGo\Markdown_Converter;

/**
 * llms.txt Feature Test Case
 */
class Test_LLMS_Txt extends WP_UnitTestCase {
	/**
	 * LLMS_Txt instance.
	 *
	 * @var LLMS_Txt
	 */
	private $llms_txt;

	/**
	 * Admin user ID.
	 *
	 * @var int
	 */
	private $admin_user;

	/**
	 * Regular user ID.
	 *
	 * @var int
	 */
	private $regular_user;

	/**
	 * Set up test environment.
	 */
	public function set_up() {
		parent::set_up();

		// Create LLMS_Txt instance.
		$this->llms_txt = new LLMS_Txt();

		// Set up admin user.
		$this->admin_user = $this->factory->user->create(
			array(
				'role' => 'administrator',
			)
		);

		// Set up regular user.
		$this->regular_user = $this->factory->user->create(
			array(
				'role' => 'subscriber',
			)
		);

		// Clear cache before each test.
		delete_transient( LLMS_Txt::CACHE_KEY );
	}

	/**
	 * Tear down test environment.
	 */
	public function tear_down() {
		// Clear cache after each test.
		delete_transient( LLMS_Txt::CACHE_KEY );

		parent::tear_down();
	}

	/**
	 * Test that the LLMS_Txt class exists.
	 */
	public function test_class_exists() {
		$this->assertTrue( class_exists( 'DesignSetGo\LLMS_Txt' ) );
	}

	/**
	 * Test that the Markdown_Converter class exists.
	 */
	public function test_markdown_converter_exists() {
		$this->assertTrue( class_exists( 'DesignSetGo\Markdown_Converter' ) );
	}

	/**
	 * Test that query var is added.
	 */
	public function test_query_var_added() {
		$vars   = array();
		$result = $this->llms_txt->add_query_var( $vars );

		$this->assertContains( 'llms_txt', $result );
	}

	/**
	 * Test cache invalidation.
	 */
	public function test_cache_invalidation() {
		// Set a cache value.
		set_transient( LLMS_Txt::CACHE_KEY, 'test content' );

		// Verify cache is set.
		$this->assertEquals( 'test content', get_transient( LLMS_Txt::CACHE_KEY ) );

		// Invalidate cache.
		$this->llms_txt->invalidate_cache();

		// Verify cache is cleared.
		$this->assertFalse( get_transient( LLMS_Txt::CACHE_KEY ) );
	}

	/**
	 * Test post markdown cache invalidation.
	 */
	public function test_markdown_cache_invalidation() {
		$post_id   = 123;
		$cache_key = 'designsetgo_llms_md_' . $post_id;

		// Set a cache value.
		set_transient( $cache_key, array( 'test' => 'data' ) );

		// Verify cache is set.
		$this->assertNotFalse( get_transient( $cache_key ) );

		// Invalidate cache with post ID.
		$this->llms_txt->invalidate_cache( $post_id );

		// Verify individual cache is cleared.
		$this->assertFalse( get_transient( $cache_key ) );
	}

	/**
	 * Test schedule_flush_rewrite_rules sets transient.
	 */
	public function test_schedule_flush_rewrite_rules() {
		// Clear any existing transient.
		delete_transient( 'designsetgo_llms_txt_flush_rules' );

		// Call the static method.
		LLMS_Txt::schedule_flush_rewrite_rules();

		// Verify transient is set.
		$this->assertTrue( (bool) get_transient( 'designsetgo_llms_txt_flush_rules' ) );

		// Clean up.
		delete_transient( 'designsetgo_llms_txt_flush_rules' );
	}

	/**
	 * Test post types endpoint requires admin permissions.
	 */
	public function test_post_types_endpoint_requires_admin() {
		// Test as regular user - should fail.
		wp_set_current_user( $this->regular_user );

		$request = new WP_REST_Request( 'GET', '/designsetgo/v1/llms-txt/post-types' );
		$request->set_header( 'X-WP-Nonce', wp_create_nonce( 'wp_rest' ) );

		$response = rest_do_request( $request );

		$this->assertEquals( 403, $response->get_status() );
	}

	/**
	 * Test post types endpoint returns data for admin.
	 */
	public function test_post_types_endpoint_returns_data() {
		wp_set_current_user( $this->admin_user );

		$response = $this->llms_txt->get_post_types_endpoint();

		$this->assertIsArray( $response->data );
		$this->assertNotEmpty( $response->data );

		// Should include 'post' and 'page'.
		$names = wp_list_pluck( $response->data, 'name' );
		$this->assertContains( 'post', $names );
		$this->assertContains( 'page', $names );

		// Should NOT include 'attachment'.
		$this->assertNotContains( 'attachment', $names );
	}

	/**
	 * Test flush cache endpoint requires admin permissions.
	 */
	public function test_flush_cache_endpoint_requires_admin() {
		// Test as regular user - should fail.
		wp_set_current_user( $this->regular_user );

		$request = new WP_REST_Request( 'POST', '/designsetgo/v1/llms-txt/flush-cache' );
		$request->set_header( 'X-WP-Nonce', wp_create_nonce( 'wp_rest' ) );

		$response = rest_do_request( $request );

		$this->assertEquals( 403, $response->get_status() );
	}

	/**
	 * Test flush cache endpoint clears cache.
	 */
	public function test_flush_cache_endpoint_clears_cache() {
		wp_set_current_user( $this->admin_user );

		// Set a cache value.
		set_transient( LLMS_Txt::CACHE_KEY, 'test content' );

		$response = $this->llms_txt->flush_cache_endpoint();

		$this->assertTrue( $response->data['success'] );
		$this->assertFalse( get_transient( LLMS_Txt::CACHE_KEY ) );
	}

	/**
	 * Test markdown endpoint returns 404 for non-existent post.
	 */
	public function test_markdown_endpoint_returns_404_for_missing_post() {
		$request = new WP_REST_Request( 'GET', '/designsetgo/v1/llms-txt/markdown/999999' );
		$request->set_param( 'post_id', 999999 );

		$response = $this->llms_txt->get_post_markdown_endpoint( $request );

		$this->assertInstanceOf( 'WP_Error', $response );
		$this->assertEquals( 'not_found', $response->get_error_code() );
	}

	/**
	 * Test markdown endpoint returns 404 for draft post.
	 */
	public function test_markdown_endpoint_returns_404_for_draft() {
		$post_id = $this->factory->post->create(
			array(
				'post_status' => 'draft',
				'post_title'  => 'Draft Post',
			)
		);

		$request = new WP_REST_Request( 'GET', '/designsetgo/v1/llms-txt/markdown/' . $post_id );
		$request->set_param( 'post_id', $post_id );

		$response = $this->llms_txt->get_post_markdown_endpoint( $request );

		$this->assertInstanceOf( 'WP_Error', $response );
		$this->assertEquals( 'not_published', $response->get_error_code() );
	}

	/**
	 * Test markdown endpoint returns 403 for excluded post.
	 */
	public function test_markdown_endpoint_returns_403_for_excluded() {
		// Enable the feature first.
		update_option(
			'designsetgo_settings',
			array(
				'llms_txt' => array(
					'enable'     => true,
					'post_types' => array( 'post' ),
				),
			)
		);

		$post_id = $this->factory->post->create(
			array(
				'post_status' => 'publish',
				'post_title'  => 'Excluded Post',
			)
		);

		// Mark as excluded.
		update_post_meta( $post_id, LLMS_Txt::EXCLUDE_META_KEY, true );

		$request = new WP_REST_Request( 'GET', '/designsetgo/v1/llms-txt/markdown/' . $post_id );
		$request->set_param( 'post_id', $post_id );

		$response = $this->llms_txt->get_post_markdown_endpoint( $request );

		$this->assertInstanceOf( 'WP_Error', $response );
		$this->assertEquals( 'excluded', $response->get_error_code() );
	}

	/**
	 * Test markdown endpoint returns content for valid post.
	 */
	public function test_markdown_endpoint_returns_content() {
		// Enable the feature first.
		update_option(
			'designsetgo_settings',
			array(
				'llms_txt' => array(
					'enable'     => true,
					'post_types' => array( 'post' ),
				),
			)
		);

		$post_id = $this->factory->post->create(
			array(
				'post_status'  => 'publish',
				'post_title'   => 'Test Post',
				'post_content' => '<!-- wp:paragraph --><p>Test content.</p><!-- /wp:paragraph -->',
			)
		);

		$request = new WP_REST_Request( 'GET', '/designsetgo/v1/llms-txt/markdown/' . $post_id );
		$request->set_param( 'post_id', $post_id );

		$response = $this->llms_txt->get_post_markdown_endpoint( $request );

		$this->assertIsArray( $response->data );
		$this->assertEquals( $post_id, $response->data['id'] );
		$this->assertEquals( 'Test Post', $response->data['title'] );
		$this->assertArrayHasKey( 'markdown', $response->data );
		$this->assertStringContainsString( '# Test Post', $response->data['markdown'] );
	}

	/**
	 * Test posts limit filter works.
	 */
	public function test_posts_limit_filter() {
		$this->assertEquals( 500, LLMS_Txt::DEFAULT_POSTS_LIMIT );

		// Test the filter.
		add_filter(
			'designsetgo_llms_txt_posts_limit',
			function ( $limit, $post_type ) {
				if ( 'post' === $post_type ) {
					return 10;
				}
				return $limit;
			},
			10,
			2
		);

		// Create more posts than the limit.
		for ( $i = 0; $i < 15; $i++ ) {
			$this->factory->post->create(
				array(
					'post_status' => 'publish',
					'post_title'  => 'Post ' . $i,
				)
			);
		}

		// Enable the feature.
		update_option(
			'designsetgo_settings',
			array(
				'llms_txt' => array(
					'enable'     => true,
					'post_types' => array( 'post' ),
				),
			)
		);

		// Use reflection to access private method.
		$reflection = new \ReflectionClass( $this->llms_txt );
		$method     = $reflection->getMethod( 'get_public_content' );
		$method->setAccessible( true );

		$posts = $method->invoke( $this->llms_txt, 'post' );

		// Should be limited to 10 posts.
		$this->assertLessThanOrEqual( 10, count( $posts ) );

		// Remove filter.
		remove_all_filters( 'designsetgo_llms_txt_posts_limit' );
	}

	/**
	 * Test exclusion meta key constant.
	 */
	public function test_exclusion_meta_key() {
		$this->assertEquals( '_designsetgo_exclude_llms', LLMS_Txt::EXCLUDE_META_KEY );
	}

	/**
	 * Test cache key constant.
	 */
	public function test_cache_key() {
		$this->assertEquals( 'designsetgo_llms_txt_cache', LLMS_Txt::CACHE_KEY );
	}
}

/**
 * Markdown Converter Test Case
 */
class Test_Markdown_Converter extends WP_UnitTestCase {
	/**
	 * Markdown_Converter instance.
	 *
	 * @var Markdown_Converter
	 */
	private $converter;

	/**
	 * Set up test environment.
	 */
	public function set_up() {
		parent::set_up();

		$this->converter = new Markdown_Converter();
	}

	/**
	 * Test converter creates title as H1.
	 */
	public function test_converts_title_to_h1() {
		$post = $this->factory->post->create_and_get(
			array(
				'post_title'   => 'Test Title',
				'post_content' => '',
				'post_status'  => 'publish',
			)
		);

		$markdown = $this->converter->convert( $post );

		$this->assertStringStartsWith( '# Test Title', $markdown );
	}

	/**
	 * Test converter handles paragraph blocks.
	 */
	public function test_converts_paragraph_block() {
		$post = $this->factory->post->create_and_get(
			array(
				'post_title'   => 'Test',
				'post_content' => '<!-- wp:paragraph --><p>Hello world.</p><!-- /wp:paragraph -->',
				'post_status'  => 'publish',
			)
		);

		$markdown = $this->converter->convert( $post );

		$this->assertStringContainsString( 'Hello world.', $markdown );
	}

	/**
	 * Test converter handles heading blocks.
	 */
	public function test_converts_heading_block() {
		$post = $this->factory->post->create_and_get(
			array(
				'post_title'   => 'Test',
				'post_content' => '<!-- wp:heading {"level":2} --><h2>Section Title</h2><!-- /wp:heading -->',
				'post_status'  => 'publish',
			)
		);

		$markdown = $this->converter->convert( $post );

		$this->assertStringContainsString( '## Section Title', $markdown );
	}

	/**
	 * Test converter handles list blocks.
	 */
	public function test_converts_list_block() {
		$post = $this->factory->post->create_and_get(
			array(
				'post_title'   => 'Test',
				'post_content' => '<!-- wp:list --><ul><li>Item 1</li><li>Item 2</li></ul><!-- /wp:list -->',
				'post_status'  => 'publish',
			)
		);

		$markdown = $this->converter->convert( $post );

		$this->assertStringContainsString( 'Item 1', $markdown );
		$this->assertStringContainsString( 'Item 2', $markdown );
	}

	/**
	 * Test custom handler registration.
	 */
	public function test_register_custom_handler() {
		$this->converter->register_handler(
			'test/custom-block',
			function ( $block, $converter ) {
				return 'Custom output';
			}
		);

		// Use reflection to verify handler is registered.
		$reflection = new \ReflectionClass( $this->converter );
		$property   = $reflection->getProperty( 'handlers' );
		$property->setAccessible( true );
		$handlers = $property->getValue( $this->converter );

		$this->assertArrayHasKey( 'test/custom-block', $handlers );
	}

	/**
	 * Test escapes markdown special characters in title.
	 */
	public function test_escapes_markdown_in_title() {
		$post = $this->factory->post->create_and_get(
			array(
				'post_title'   => 'Title with *stars* and [brackets]',
				'post_content' => '',
				'post_status'  => 'publish',
			)
		);

		$markdown = $this->converter->convert( $post );

		// Should escape special characters.
		$this->assertStringContainsString( '\\*stars\\*', $markdown );
		$this->assertStringContainsString( '\\[brackets\\]', $markdown );
	}
}
