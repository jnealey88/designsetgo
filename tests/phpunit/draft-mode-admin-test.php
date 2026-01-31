<?php
/**
 * Test Draft Mode Admin UI
 *
 * @package DesignSetGo
 * @subpackage Tests
 */

use DesignSetGo\Admin\Draft_Mode;
use DesignSetGo\Admin\Draft_Mode_Admin;

/**
 * Tests for Draft_Mode_Admin class.
 */
class Test_Draft_Mode_Admin extends WP_UnitTestCase {

	/**
	 * Draft Mode instance.
	 *
	 * @var Draft_Mode
	 */
	private $draft_mode;

	/**
	 * Admin UI instance.
	 *
	 * @var Draft_Mode_Admin
	 */
	private $admin;

	/**
	 * Test user ID.
	 *
	 * @var int
	 */
	private $user_id;

	/**
	 * Published page ID for testing.
	 *
	 * @var int
	 */
	private $page_id;

	/**
	 * Set up test fixtures.
	 */
	public function set_up() {
		parent::set_up();

		$this->draft_mode = new Draft_Mode();
		$this->admin = new Draft_Mode_Admin( $this->draft_mode );

		// Create a test user with page capabilities.
		$this->user_id = $this->factory->user->create( array(
			'role' => 'editor',
		) );
		wp_set_current_user( $this->user_id );

		// Create a published test page.
		$this->page_id = $this->factory->post->create( array(
			'post_type'   => 'page',
			'post_status' => 'publish',
			'post_title'  => 'Test Page',
		) );
	}

	/**
	 * Test Draft_Mode_Admin class exists.
	 */
	public function test_draft_mode_admin_class_exists() {
		$this->assertTrue( class_exists( 'DesignSetGo\Admin\Draft_Mode_Admin' ) );
	}

	/**
	 * Test add_row_actions adds actions for published pages.
	 */
	public function test_add_row_actions_published_page() {
		$actions = array();
		$post = get_post( $this->page_id );

		$result = $this->admin->add_row_actions( $actions, $post );

		// Should add "Create Draft" action for published page without draft.
		$this->assertArrayHasKey( 'dsgo_create_draft', $result );
		$this->assertStringContainsString( 'Create Draft', $result['dsgo_create_draft'] );
	}

	/**
	 * Test add_row_actions adds Edit Draft action when draft exists.
	 */
	public function test_add_row_actions_has_draft() {
		// Create a draft.
		$draft_id = $this->draft_mode->create_draft( $this->page_id );

		$actions = array();
		$post = get_post( $this->page_id );

		$result = $this->admin->add_row_actions( $actions, $post );

		// Should add "Edit Draft" action instead of "Create Draft".
		$this->assertArrayHasKey( 'dsgo_edit_draft', $result );
		$this->assertStringContainsString( 'Edit Draft', $result['dsgo_edit_draft'] );
		$this->assertArrayNotHasKey( 'dsgo_create_draft', $result );
	}

	/**
	 * Test add_row_actions adds View Live action for draft pages.
	 */
	public function test_add_row_actions_is_draft() {
		// Create a draft.
		$draft_id = $this->draft_mode->create_draft( $this->page_id );

		$actions = array();
		$draft_post = get_post( $draft_id );

		$result = $this->admin->add_row_actions( $actions, $draft_post );

		// Should add "View Live" action for draft.
		$this->assertArrayHasKey( 'dsgo_view_original', $result );
		$this->assertStringContainsString( 'View Live', $result['dsgo_view_original'] );
	}

	/**
	 * Test add_row_actions requires publish_pages capability.
	 */
	public function test_add_row_actions_permission_check() {
		// Create subscriber user (no publish_pages capability).
		$subscriber_id = $this->factory->user->create( array(
			'role' => 'subscriber',
		) );
		wp_set_current_user( $subscriber_id );

		$actions = array();
		$post = get_post( $this->page_id );

		$result = $this->admin->add_row_actions( $actions, $post );

		// Should not add any draft mode actions.
		$this->assertArrayNotHasKey( 'dsgo_create_draft', $result );
		$this->assertArrayNotHasKey( 'dsgo_edit_draft', $result );
	}

	/**
	 * Test add_row_actions only works for pages.
	 */
	public function test_add_row_actions_pages_only() {
		$post_id = $this->factory->post->create( array(
			'post_type'   => 'post',
			'post_status' => 'publish',
		) );

		$actions = array();
		$post = get_post( $post_id );

		$result = $this->admin->add_row_actions( $actions, $post );

		// Should not add draft mode actions for posts.
		$this->assertArrayNotHasKey( 'dsgo_create_draft', $result );
	}

	/**
	 * Test add_draft_status_column adds column.
	 */
	public function test_add_draft_status_column() {
		$columns = array(
			'cb'    => '<input type="checkbox" />',
			'title' => 'Title',
			'date'  => 'Date',
		);

		$result = $this->admin->add_draft_status_column( $columns );

		// Should add "Draft Status" column after title.
		$this->assertArrayHasKey( 'dsgo_draft_status', $result );
		$expected_keys = array( 'cb', 'title', 'dsgo_draft_status', 'date' );
		$this->assertEquals( $expected_keys, array_keys( $result ) );
	}

	/**
	 * Test render_draft_status_column for published page without draft.
	 */
	public function test_render_draft_status_column_no_draft() {
		ob_start();
		$this->admin->render_draft_status_column( 'dsgo_draft_status', $this->page_id );
		$output = ob_get_clean();

		// Should show "—" for no draft.
		$this->assertStringContainsString( '&mdash;', $output );
		$this->assertStringContainsString( 'dsgo-draft-badge--none', $output );
	}

	/**
	 * Test render_draft_status_column for published page with draft.
	 */
	public function test_render_draft_status_column_has_draft() {
		// Create a draft.
		$this->draft_mode->create_draft( $this->page_id );

		ob_start();
		$this->admin->render_draft_status_column( 'dsgo_draft_status', $this->page_id );
		$output = ob_get_clean();

		// Should show "Has Draft" badge.
		$this->assertStringContainsString( 'Has Draft', $output );
		$this->assertStringContainsString( 'dsgo-draft-badge--has-draft', $output );
	}

	/**
	 * Test render_draft_status_column for draft page.
	 */
	public function test_render_draft_status_column_is_draft() {
		// Create a draft.
		$draft_id = $this->draft_mode->create_draft( $this->page_id );

		ob_start();
		$this->admin->render_draft_status_column( 'dsgo_draft_status', $draft_id );
		$output = ob_get_clean();

		// Should show "Draft Version" badge.
		$this->assertStringContainsString( 'Draft Version', $output );
		$this->assertStringContainsString( 'dsgo-draft-badge--is-draft', $output );
	}

	/**
	 * Test inline styles are generated.
	 */
	public function test_inline_styles() {
		$reflection = new ReflectionClass( $this->admin );
		$method = $reflection->getMethod( 'get_inline_styles' );
		$method->setAccessible( true );

		$styles = $method->invoke( $this->admin );

		$this->assertIsString( $styles );
		$this->assertStringContainsString( '.dsgo-draft-badge', $styles );
		$this->assertStringContainsString( '.dsgo-draft-badge--is-draft', $styles );
		$this->assertStringContainsString( '.dsgo-draft-badge--has-draft', $styles );
	}

	/**
	 * Test inline script is generated.
	 */
	public function test_inline_script() {
		$reflection = new ReflectionClass( $this->admin );
		$method = $reflection->getMethod( 'get_inline_script' );
		$method->setAccessible( true );

		$script = $method->invoke( $this->admin );

		$this->assertIsString( $script );
		$this->assertStringContainsString( 'dsgo-create-draft', $script );
		$this->assertStringContainsString( 'fetch(', $script );
		$this->assertStringContainsString( '/draft-mode/create', $script );
	}

	/**
	 * Test enqueue_admin_scripts only loads on page list screen.
	 */
	public function test_enqueue_admin_scripts_page_list_only() {
		// Set up page list screen.
		set_current_screen( 'edit-page' );

		// This would normally enqueue scripts, but we can't easily test that.
		// We can at least verify the method exists and is callable.
		$this->assertTrue( is_callable( array( $this->admin, 'enqueue_admin_scripts' ) ) );
	}
}
