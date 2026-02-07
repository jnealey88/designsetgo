<?php
/**
 * Security and validation tests for DesignSetGo Abilities API.
 *
 * Verifies that invalid inputs, injection attempts, unauthorized access,
 * and edge cases are properly rejected with clear error messages.
 *
 * @package DesignSetGo
 * @subpackage Tests
 */

use DesignSetGo\Abilities\Configurators\Configure_Block_Attributes;
use DesignSetGo\Abilities\Configurators\Configure_Shape_Divider;
use DesignSetGo\Abilities\Inserters\Insert_Block_Into;
use DesignSetGo\Abilities\Info\Get_Post_Blocks;
use DesignSetGo\Abilities\Info\List_Abilities;
use DesignSetGo\Abilities\Info\List_Blocks;

/**
 * Abilities Security Test class.
 */
class Abilities_Security_Test extends WP_UnitTestCase {

	/**
	 * Editor user ID.
	 *
	 * @var int
	 */
	private int $editor_id;

	/**
	 * Subscriber user ID.
	 *
	 * @var int
	 */
	private int $subscriber_id;

	/**
	 * Set up each test.
	 */
	public function set_up(): void {
		parent::set_up();
		$this->editor_id     = self::factory()->user->create( array( 'role' => 'editor' ) );
		$this->subscriber_id = self::factory()->user->create( array( 'role' => 'subscriber' ) );
		wp_set_current_user( $this->editor_id );
	}

	/**
	 * Create a post with block content.
	 *
	 * @param string $content Block content string.
	 * @return int Post ID.
	 */
	private function create_block_post( string $content ): int {
		return self::factory()->post->create(
			array(
				'post_content' => $content,
				'post_status'  => 'publish',
				'post_author'  => $this->editor_id,
			)
		);
	}

	/**
	 * Assert that a result is a WP_Error with the expected code.
	 *
	 * @param string $expected_code Expected error code.
	 * @param mixed  $result        Result to check.
	 */
	private function assert_error_code( string $expected_code, $result ): void {
		$this->assertInstanceOf( WP_Error::class, $result, 'Expected WP_Error but got: ' . wp_json_encode( $result ) );
		$this->assertSame( $expected_code, $result->get_error_code() );
	}

	// -------------------------------------------------------------------------
	// Color Injection (Shape Divider)
	// -------------------------------------------------------------------------

	/**
	 * Test that CSS variable with fallback is rejected (injection vector).
	 */
	public function test_color_injection_var_fallback_rejected(): void {
		$content = '<!-- wp:designsetgo/section -->'
			. '<div class="wp-block-designsetgo-section"></div>'
			. '<!-- /wp:designsetgo/section -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Shape_Divider();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'shape'       => 'wave',
				'color'       => 'var(--custom, <script>alert(1)</script>)',
			)
		);

		$this->assert_error_code( 'validation_failed', $result );
	}

	/**
	 * Test that script tags in color values are rejected.
	 */
	public function test_color_injection_script_tag_rejected(): void {
		$content = '<!-- wp:designsetgo/section -->'
			. '<div class="wp-block-designsetgo-section"></div>'
			. '<!-- /wp:designsetgo/section -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Shape_Divider();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'shape'       => 'wave',
				'color'       => '<script>alert(1)</script>',
			)
		);

		$this->assert_error_code( 'validation_failed', $result );
	}

	/**
	 * Test that expression() CSS function is rejected.
	 */
	public function test_color_injection_expression_rejected(): void {
		$content = '<!-- wp:designsetgo/section -->'
			. '<div class="wp-block-designsetgo-section"></div>'
			. '<!-- /wp:designsetgo/section -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Shape_Divider();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'shape'       => 'wave',
				'color'       => 'expression(alert(1))',
			)
		);

		$this->assert_error_code( 'validation_failed', $result );
	}

	/**
	 * Test that valid color formats are accepted.
	 *
	 * @dataProvider valid_color_provider
	 */
	public function test_valid_colors_accepted( string $color ): void {
		$content = '<!-- wp:designsetgo/section -->'
			. '<div class="wp-block-designsetgo-section"></div>'
			. '<!-- /wp:designsetgo/section -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Shape_Divider();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'shape'       => 'wave',
				'color'       => $color,
			)
		);

		$this->assertIsArray( $result, "Color '$color' should be accepted but was rejected." );
		$this->assertTrue( $result['success'] );
	}

	/**
	 * Data provider for valid color values.
	 *
	 * @return array<string, array{string}>
	 */
	public function valid_color_provider(): array {
		return array(
			'hex 3-digit'   => array( '#fff' ),
			'hex 6-digit'   => array( '#ff0000' ),
			'hex 8-digit'   => array( '#ff000080' ),
			'rgb'           => array( 'rgb(255, 0, 0)' ),
			'rgba'          => array( 'rgba(255, 0, 0, 0.5)' ),
			'hsl'           => array( 'hsl(120, 100%, 50%)' ),
			'css var'       => array( 'var(--wp--preset--color--primary)' ),
			'named color'   => array( 'transparent' ),
			'named white'   => array( 'white' ),
		);
	}

	// -------------------------------------------------------------------------
	// Block Name Validation (Insert Block Into)
	// -------------------------------------------------------------------------

	/**
	 * Test that block name without namespace is rejected.
	 */
	public function test_invalid_block_name_no_namespace_rejected(): void {
		$content = '<!-- wp:core/group --><div class="wp-block-group"></div><!-- /wp:core/group -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Insert_Block_Into();
		$result  = $ability->execute(
			array(
				'post_id'            => $post_id,
				'parent_block_index' => 0,
				'block_name'         => 'paragraph',
			)
		);

		$this->assert_error_code( 'invalid_input', $result );
	}

	/**
	 * Test that block name with uppercase is rejected.
	 */
	public function test_invalid_block_name_uppercase_rejected(): void {
		$content = '<!-- wp:core/group --><div class="wp-block-group"></div><!-- /wp:core/group -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Insert_Block_Into();
		$result  = $ability->execute(
			array(
				'post_id'            => $post_id,
				'parent_block_index' => 0,
				'block_name'         => 'Core/Paragraph',
			)
		);

		$this->assert_error_code( 'invalid_input', $result );
	}

	/**
	 * Test that unregistered block name is rejected.
	 */
	public function test_unregistered_block_name_rejected(): void {
		$content = '<!-- wp:core/group --><div class="wp-block-group"></div><!-- /wp:core/group -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Insert_Block_Into();
		$result  = $ability->execute(
			array(
				'post_id'            => $post_id,
				'parent_block_index' => 0,
				'block_name'         => 'fake/nonexistent-block',
			)
		);

		$this->assert_error_code( 'invalid_input', $result );
	}

	// -------------------------------------------------------------------------
	// Index and Targeting Validation
	// -------------------------------------------------------------------------

	/**
	 * Test that an out-of-bounds block_index returns an error.
	 */
	public function test_out_of_bounds_index_returns_error(): void {
		$content = '<!-- wp:core/paragraph --><p>Only block</p><!-- /wp:core/paragraph -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Block_Attributes();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 999,
				'attributes'  => array( 'className' => 'test' ),
			)
		);

		$this->assert_error_code( 'block_not_found', $result );
	}

	/**
	 * Test that a nonexistent post ID returns an error.
	 */
	public function test_nonexistent_post_returns_error(): void {
		$ability = new Configure_Block_Attributes();
		$result  = $ability->execute(
			array(
				'post_id'     => 999999,
				'block_index' => 0,
				'attributes'  => array( 'className' => 'test' ),
			)
		);

		$this->assert_error_code( 'invalid_post', $result );
	}

	/**
	 * Test that missing all targeting parameters returns an error.
	 */
	public function test_no_targeting_method_returns_error(): void {
		$content = '<!-- wp:core/paragraph --><p>Hello</p><!-- /wp:core/paragraph -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Block_Attributes();
		$result  = $ability->execute(
			array(
				'post_id'    => $post_id,
				'attributes' => array( 'className' => 'test' ),
			)
		);

		$this->assert_error_code( 'invalid_input', $result );
	}

	/**
	 * Test that empty attributes object is rejected.
	 */
	public function test_empty_attributes_rejected(): void {
		$content = '<!-- wp:core/paragraph --><p>Hello</p><!-- /wp:core/paragraph -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Block_Attributes();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'attributes'  => array(),
			)
		);

		$this->assert_error_code( 'missing_settings', $result );
	}

	/**
	 * Test that missing post_id returns an error.
	 */
	public function test_missing_post_id_returns_error(): void {
		$ability = new Configure_Block_Attributes();
		$result  = $ability->execute(
			array(
				'block_index' => 0,
				'attributes'  => array( 'className' => 'test' ),
			)
		);

		$this->assert_error_code( 'missing_post_id', $result );
	}

	/**
	 * Test block_name mismatch when block_index targets a different block type.
	 */
	public function test_block_name_mismatch_returns_error(): void {
		$content = '<!-- wp:core/paragraph --><p>Hello</p><!-- /wp:core/paragraph -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Block_Attributes();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'block_name'  => 'core/heading', // Mismatch: block at index 0 is paragraph.
				'attributes'  => array( 'className' => 'test' ),
			)
		);

		$this->assert_error_code( 'block_name_mismatch', $result );
	}

	// -------------------------------------------------------------------------
	// Shape Divider Validation
	// -------------------------------------------------------------------------

	/**
	 * Test that an invalid shape type is rejected.
	 */
	public function test_invalid_shape_rejected(): void {
		$content = '<!-- wp:designsetgo/section -->'
			. '<div class="wp-block-designsetgo-section"></div>'
			. '<!-- /wp:designsetgo/section -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Shape_Divider();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'shape'       => 'nonexistent-shape',
			)
		);

		$this->assert_error_code( 'validation_failed', $result );
	}

	/**
	 * Test that height above 300 is rejected.
	 */
	public function test_height_out_of_range_rejected(): void {
		$content = '<!-- wp:designsetgo/section -->'
			. '<div class="wp-block-designsetgo-section"></div>'
			. '<!-- /wp:designsetgo/section -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Shape_Divider();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'shape'       => 'wave',
				'height'      => 500,
			)
		);

		$this->assert_error_code( 'validation_failed', $result );
	}

	/**
	 * Test that width outside 50-200 range is rejected.
	 */
	public function test_width_out_of_range_rejected(): void {
		$content = '<!-- wp:designsetgo/section -->'
			. '<div class="wp-block-designsetgo-section"></div>'
			. '<!-- /wp:designsetgo/section -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Shape_Divider();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'shape'       => 'wave',
				'width'       => 300,
			)
		);

		$this->assert_error_code( 'validation_failed', $result );
	}

	/**
	 * Test that shape divider without targeting (no block_index or block_client_id) is rejected.
	 */
	public function test_shape_divider_no_targeting_rejected(): void {
		$content = '<!-- wp:designsetgo/section -->'
			. '<div class="wp-block-designsetgo-section"></div>'
			. '<!-- /wp:designsetgo/section -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Shape_Divider();
		$result  = $ability->execute(
			array(
				'post_id' => $post_id,
				'shape'   => 'wave',
			)
		);

		$this->assert_error_code( 'invalid_input', $result );
	}

	/**
	 * Test that missing shape type is rejected.
	 */
	public function test_shape_divider_missing_shape_rejected(): void {
		$content = '<!-- wp:designsetgo/section -->'
			. '<div class="wp-block-designsetgo-section"></div>'
			. '<!-- /wp:designsetgo/section -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Shape_Divider();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
			)
		);

		$this->assert_error_code( 'missing_settings', $result );
	}

	/**
	 * Test that negative height is rejected.
	 */
	public function test_negative_height_rejected(): void {
		$content = '<!-- wp:designsetgo/section -->'
			. '<div class="wp-block-designsetgo-section"></div>'
			. '<!-- /wp:designsetgo/section -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Shape_Divider();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'shape'       => 'wave',
				'height'      => -10,
			)
		);

		$this->assert_error_code( 'validation_failed', $result );
	}

	// -------------------------------------------------------------------------
	// Permission Tests
	// -------------------------------------------------------------------------

	/**
	 * Test that a subscriber cannot configure block attributes.
	 */
	public function test_subscriber_cannot_configure_blocks(): void {
		$content = '<!-- wp:core/paragraph --><p>Hello</p><!-- /wp:core/paragraph -->';
		$post_id = $this->create_block_post( $content );

		wp_set_current_user( $this->subscriber_id );

		$ability = new Configure_Block_Attributes();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'attributes'  => array( 'className' => 'hacked' ),
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
	}

	/**
	 * Test that a subscriber cannot use get-post-blocks on others' posts.
	 */
	public function test_subscriber_cannot_get_post_blocks(): void {
		$content = '<!-- wp:core/paragraph --><p>Hello</p><!-- /wp:core/paragraph -->';
		$post_id = $this->create_block_post( $content );

		wp_set_current_user( $this->subscriber_id );

		$ability = new Get_Post_Blocks();
		$result  = $ability->execute( array( 'post_id' => $post_id ) );

		$this->assertInstanceOf( WP_Error::class, $result );
	}

	/**
	 * Test that a subscriber CAN list abilities (requires 'read' only).
	 */
	public function test_subscriber_can_list_abilities(): void {
		wp_set_current_user( $this->subscriber_id );

		$ability = new List_Abilities();
		$result  = $ability->execute( array( 'category' => 'all' ) );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'abilities', $result );
	}

	/**
	 * Test that a subscriber CAN list blocks (requires 'read' only).
	 */
	public function test_subscriber_can_list_blocks(): void {
		wp_set_current_user( $this->subscriber_id );

		$ability = new List_Blocks();
		$result  = $ability->execute( array() );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'blocks', $result );
	}

	/**
	 * Test that a subscriber cannot insert blocks.
	 */
	public function test_subscriber_cannot_insert_blocks(): void {
		$content = '<!-- wp:core/group --><div class="wp-block-group"></div><!-- /wp:core/group -->';
		$post_id = $this->create_block_post( $content );

		wp_set_current_user( $this->subscriber_id );

		$ability = new Insert_Block_Into();
		$result  = $ability->execute(
			array(
				'post_id'            => $post_id,
				'parent_block_index' => 0,
				'block_name'         => 'core/paragraph',
			)
		);

		$this->assertInstanceOf( WP_Error::class, $result );
	}

	// -------------------------------------------------------------------------
	// Attribute Sanitization
	// -------------------------------------------------------------------------

	/**
	 * Test that HTML tags are stripped from attribute string values.
	 */
	public function test_html_stripped_from_attribute_values(): void {
		$content = '<!-- wp:core/paragraph --><p>Hello</p><!-- /wp:core/paragraph -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Block_Attributes();
		$result  = $ability->execute(
			array(
				'post_id'     => $post_id,
				'block_index' => 0,
				'attributes'  => array(
					'className' => '<script>alert(1)</script>safe-class',
				),
			)
		);

		$this->assertTrue( $result['success'] );

		// Verify the saved value has tags stripped.
		$post   = get_post( $post_id );
		$blocks = parse_blocks( $post->post_content );
		$blocks = array_values( array_filter( $blocks, fn( $b ) => ! empty( $b['blockName'] ) ) );

		$saved_class = $blocks[0]['attrs']['className'];
		$this->assertStringNotContainsString( '<script>', $saved_class );
		$this->assertStringContainsString( 'safe-class', $saved_class );
	}

	/**
	 * Test that nested attributes in inner_blocks are recursively sanitized.
	 */
	public function test_recursive_sanitization_on_inner_blocks(): void {
		$content = '<!-- wp:core/group --><div class="wp-block-group"></div><!-- /wp:core/group -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Insert_Block_Into();

		// Use reflection to test the private sanitize_inner_blocks method.
		$reflection = new ReflectionClass( $ability );
		$method     = $reflection->getMethod( 'sanitize_inner_blocks' );
		$method->setAccessible( true );

		$malicious_inner_blocks = array(
			array(
				'name'       => 'core/paragraph',
				'attributes' => array(
					'className' => '<img onerror=alert(1) src=x>malicious',
					'nested'    => array(
						'deep' => '<script>alert("xss")</script>clean',
					),
				),
				'innerBlocks' => array(
					array(
						'name'       => 'core/paragraph',
						'attributes' => array(
							'className' => '<iframe src="evil"></iframe>safe',
						),
					),
				),
			),
		);

		$sanitized = $method->invokeArgs( $ability, array( $malicious_inner_blocks ) );

		// Top-level attributes should be sanitized.
		$this->assertStringNotContainsString( '<img', $sanitized[0]['attributes']['className'] );
		$this->assertStringContainsString( 'malicious', $sanitized[0]['attributes']['className'] );

		// Nested attributes should be sanitized.
		$this->assertStringNotContainsString( '<script>', $sanitized[0]['attributes']['nested']['deep'] );
		$this->assertStringContainsString( 'clean', $sanitized[0]['attributes']['nested']['deep'] );

		// Deeply nested inner block attributes should be sanitized.
		$this->assertStringNotContainsString( '<iframe', $sanitized[0]['innerBlocks'][0]['attributes']['className'] );
		$this->assertStringContainsString( 'safe', $sanitized[0]['innerBlocks'][0]['attributes']['className'] );
	}

	/**
	 * Test that style attribute must be an object, not a string.
	 */
	public function test_style_attribute_must_be_object(): void {
		$content = '<!-- wp:core/paragraph --><p>Hello</p><!-- /wp:core/paragraph -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Configure_Block_Attributes();
		$result  = $ability->execute(
			array(
				'post_id'    => $post_id,
				'block_name' => 'core/paragraph',
				'attributes' => array(
					'style' => 'color: red; background: url(javascript:alert(1))',
				),
			)
		);

		$this->assert_error_code( 'validation_failed', $result );
	}

	// -------------------------------------------------------------------------
	// Insert Block Into - Edge Cases
	// -------------------------------------------------------------------------

	/**
	 * Test that missing parent_block_index is rejected.
	 */
	public function test_insert_missing_parent_index_rejected(): void {
		$content = '<!-- wp:core/group --><div class="wp-block-group"></div><!-- /wp:core/group -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Insert_Block_Into();
		$result  = $ability->execute(
			array(
				'post_id'    => $post_id,
				'block_name' => 'core/paragraph',
			)
		);

		$this->assert_error_code( 'invalid_input', $result );
	}

	/**
	 * Test that missing block_name is rejected.
	 */
	public function test_insert_missing_block_name_rejected(): void {
		$content = '<!-- wp:core/group --><div class="wp-block-group"></div><!-- /wp:core/group -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Insert_Block_Into();
		$result  = $ability->execute(
			array(
				'post_id'            => $post_id,
				'parent_block_index' => 0,
			)
		);

		$this->assert_error_code( 'missing_block_name', $result );
	}

	/**
	 * Test that inserting into a nonexistent parent block index returns an error.
	 */
	public function test_insert_into_nonexistent_parent_returns_error(): void {
		$content = '<!-- wp:core/paragraph --><p>Hello</p><!-- /wp:core/paragraph -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Insert_Block_Into();
		$result  = $ability->execute(
			array(
				'post_id'            => $post_id,
				'parent_block_index' => 99,
				'block_name'         => 'core/paragraph',
			)
		);

		$this->assert_error_code( 'block_not_found', $result );
	}

	// -------------------------------------------------------------------------
	// Get Post Blocks - Edge Cases
	// -------------------------------------------------------------------------

	/**
	 * Test get-post-blocks with an empty post (no blocks).
	 */
	public function test_get_post_blocks_empty_post(): void {
		$post_id = $this->create_block_post( '' );

		$ability = new Get_Post_Blocks();
		$result  = $ability->execute( array( 'post_id' => $post_id ) );

		$this->assertTrue( $result['success'] );
		$this->assertSame( 0, $result['total'] );
		$this->assertEmpty( $result['blocks'] );
	}

	/**
	 * Test that get-post-blocks skips freeform (null blockName) blocks.
	 */
	public function test_get_post_blocks_skips_freeform(): void {
		// Raw HTML without block comments creates freeform blocks.
		$content = '<p>Raw HTML, not a block</p>'
			. '<!-- wp:core/paragraph --><p>Real block</p><!-- /wp:core/paragraph -->';
		$post_id = $this->create_block_post( $content );

		$ability = new Get_Post_Blocks();
		$result  = $ability->execute( array( 'post_id' => $post_id ) );

		$this->assertTrue( $result['success'] );
		// Only the real block should appear, freeform should be filtered out.
		$this->assertSame( 1, $result['total'] );
		$this->assertSame( 'core/paragraph', $result['blocks'][0]['blockName'] );
	}
}
