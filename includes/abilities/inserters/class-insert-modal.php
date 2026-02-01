<?php
/**
 * Insert Modal Ability.
 *
 * Inserts a Modal block for creating accessible modal dialogs with
 * customizable triggers, animations, and auto-open capabilities.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Inserters;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Inserter;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Insert Modal ability class.
 */
class Insert_Modal extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/insert-modal';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Insert Modal', 'designsetgo' ),
			'description'         => __( 'Inserts a Modal dialog block for creating popups, lightboxes, and overlays with advanced triggers and animations. Supports auto-triggers (page load, exit intent, scroll depth, time-based) and gallery navigation.', 'designsetgo' ),
			'thinking_message'    => __( 'Creating modal...', 'designsetgo' ),
			'success_message'     => __( 'Modal inserted successfully.', 'designsetgo' ),
			'category'            => 'blocks',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => Block_Inserter::get_default_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
		);
	}

	/**
	 * Get input schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_input_schema(): array {
		$common = Block_Inserter::get_common_input_schema();

		return array(
			'type'                 => 'object',
			'properties'           => array_merge(
				$common,
				array(
					'attributes'  => array(
						'type'        => 'object',
						'description' => __( 'Modal attributes', 'designsetgo' ),
						'properties'  => array(
							// Identity & Behavior.
							'modalId'                 => array(
								'type'        => 'string',
								'description' => __( 'Unique modal ID (auto-generated if empty)', 'designsetgo' ),
							),
							'allowHashTrigger'        => array(
								'type'        => 'boolean',
								'description' => __( 'Allow opening via URL hash (#modal-id)', 'designsetgo' ),
								'default'     => true,
							),
							'updateUrlOnOpen'         => array(
								'type'        => 'boolean',
								'description' => __( 'Update URL hash when modal opens', 'designsetgo' ),
								'default'     => false,
							),
							// Dimensions.
							'width'                   => array(
								'type'        => 'string',
								'description' => __( 'Modal width (e.g., "600px", "50vw")', 'designsetgo' ),
								'default'     => '600px',
							),
							'maxWidth'                => array(
								'type'        => 'string',
								'description' => __( 'Maximum width (e.g., "90vw", "1200px")', 'designsetgo' ),
								'default'     => '90vw',
							),
							'height'                  => array(
								'type'        => 'string',
								'description' => __( 'Modal height (e.g., "auto", "80vh")', 'designsetgo' ),
								'default'     => 'auto',
							),
							'maxHeight'               => array(
								'type'        => 'string',
								'description' => __( 'Maximum height (e.g., "90vh", "800px")', 'designsetgo' ),
								'default'     => '90vh',
							),
							// Animation.
							'animationType'           => array(
								'type'        => 'string',
								'description' => __( 'Animation type', 'designsetgo' ),
								'enum'        => array( 'fade', 'slide-up', 'slide-down', 'zoom', 'none' ),
								'default'     => 'fade',
							),
							'animationDuration'       => array(
								'type'        => 'number',
								'description' => __( 'Animation duration in milliseconds', 'designsetgo' ),
								'default'     => 300,
								'minimum'     => 0,
								'maximum'     => 2000,
							),
							// Overlay.
							'overlayOpacity'          => array(
								'type'        => 'number',
								'description' => __( 'Overlay opacity (0-100)', 'designsetgo' ),
								'default'     => 80,
								'minimum'     => 0,
								'maximum'     => 100,
							),
							'overlayColor'            => array(
								'type'        => 'string',
								'description' => __( 'Overlay color (hex, rgb, rgba)', 'designsetgo' ),
								'default'     => '#000000',
							),
							'overlayBlur'             => array(
								'type'        => 'number',
								'description' => __( 'Backdrop blur in pixels (0-20)', 'designsetgo' ),
								'default'     => 0,
								'minimum'     => 0,
								'maximum'     => 20,
							),
							// Close Behavior.
							'closeOnBackdrop'         => array(
								'type'        => 'boolean',
								'description' => __( 'Close when clicking overlay', 'designsetgo' ),
								'default'     => true,
							),
							'closeOnEsc'              => array(
								'type'        => 'boolean',
								'description' => __( 'Close when pressing Escape key', 'designsetgo' ),
								'default'     => true,
							),
							'showCloseButton'         => array(
								'type'        => 'boolean',
								'description' => __( 'Show close button', 'designsetgo' ),
								'default'     => true,
							),
							'closeButtonPosition'     => array(
								'type'        => 'string',
								'description' => __( 'Close button position', 'designsetgo' ),
								'enum'        => array( 'inside-top-right', 'inside-top-left', 'top-right', 'top-left' ),
								'default'     => 'inside-top-right',
							),
							'closeButtonSize'         => array(
								'type'        => 'number',
								'description' => __( 'Close button size in pixels', 'designsetgo' ),
								'default'     => 24,
								'minimum'     => 16,
								'maximum'     => 48,
							),
							'closeButtonIconColor'    => array(
								'type'        => 'string',
								'description' => __( 'Close button icon color', 'designsetgo' ),
							),
							'closeButtonBgColor'      => array(
								'type'        => 'string',
								'description' => __( 'Close button background color', 'designsetgo' ),
							),
							'disableBodyScroll'       => array(
								'type'        => 'boolean',
								'description' => __( 'Disable body scroll when modal is open', 'designsetgo' ),
								'default'     => true,
							),
							// Auto-Triggers.
							'autoTriggerType'         => array(
								'type'        => 'string',
								'description' => __( 'Auto-trigger type', 'designsetgo' ),
								'enum'        => array( 'none', 'pageLoad', 'exitIntent', 'scroll', 'time' ),
								'default'     => 'none',
							),
							'autoTriggerDelay'        => array(
								'type'        => 'number',
								'description' => __( 'Delay in seconds before triggering', 'designsetgo' ),
								'default'     => 0,
								'minimum'     => 0,
								'maximum'     => 300,
							),
							'autoTriggerFrequency'    => array(
								'type'        => 'string',
								'description' => __( 'How often to show modal', 'designsetgo' ),
								'enum'        => array( 'always', 'session', 'once' ),
								'default'     => 'always',
							),
							'cookieDuration'          => array(
								'type'        => 'number',
								'description' => __( 'Cookie duration in days (for "once" frequency)', 'designsetgo' ),
								'default'     => 7,
								'minimum'     => 1,
								'maximum'     => 365,
							),
							// Exit Intent Settings.
							'exitIntentSensitivity'   => array(
								'type'        => 'string',
								'description' => __( 'Exit intent sensitivity', 'designsetgo' ),
								'enum'        => array( 'low', 'medium', 'high' ),
								'default'     => 'medium',
							),
							'exitIntentMinTime'       => array(
								'type'        => 'number',
								'description' => __( 'Minimum time on page before exit intent triggers (seconds)', 'designsetgo' ),
								'default'     => 5,
								'minimum'     => 0,
								'maximum'     => 300,
							),
							'exitIntentExcludeMobile' => array(
								'type'        => 'boolean',
								'description' => __( 'Disable exit intent on mobile devices', 'designsetgo' ),
								'default'     => true,
							),
							// Scroll Trigger Settings.
							'scrollDepth'             => array(
								'type'        => 'number',
								'description' => __( 'Scroll depth percentage to trigger (0-100)', 'designsetgo' ),
								'default'     => 50,
								'minimum'     => 0,
								'maximum'     => 100,
							),
							'scrollDirection'         => array(
								'type'        => 'string',
								'description' => __( 'Scroll direction to trigger', 'designsetgo' ),
								'enum'        => array( 'down', 'both' ),
								'default'     => 'down',
							),
							// Time Trigger Settings.
							'timeOnPage'              => array(
								'type'        => 'number',
								'description' => __( 'Time on page in seconds before triggering', 'designsetgo' ),
								'default'     => 30,
								'minimum'     => 0,
								'maximum'     => 600,
							),
							// Gallery Navigation.
							'galleryGroupId'          => array(
								'type'        => 'string',
								'description' => __( 'Gallery group ID (link modals for navigation)', 'designsetgo' ),
							),
							'galleryIndex'            => array(
								'type'        => 'number',
								'description' => __( 'Position in gallery (0-50)', 'designsetgo' ),
								'default'     => 0,
								'minimum'     => 0,
								'maximum'     => 50,
							),
							'showGalleryNavigation'   => array(
								'type'        => 'boolean',
								'description' => __( 'Show prev/next navigation buttons', 'designsetgo' ),
								'default'     => true,
							),
							'navigationStyle'         => array(
								'type'        => 'string',
								'description' => __( 'Navigation button style', 'designsetgo' ),
								'enum'        => array( 'arrows', 'chevrons', 'text' ),
								'default'     => 'arrows',
							),
							'navigationPosition'      => array(
								'type'        => 'string',
								'description' => __( 'Navigation button position', 'designsetgo' ),
								'enum'        => array( 'sides', 'bottom', 'top' ),
								'default'     => 'sides',
							),
						),
					),
					'innerBlocks' => array(
						'type'        => 'array',
						'description' => __( 'Content blocks inside the modal', 'designsetgo' ),
						'items'       => array(
							'type' => 'object',
						),
					),
				)
			),
			'additionalProperties' => false,
		);
	}

	/**
	 * Permission callback.
	 *
	 * @return bool|WP_Error
	 */
	public function check_permission_callback() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to insert modals.', 'designsetgo' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	/**
	 * Execute the ability.
	 *
	 * @param array<string, mixed> $input Input parameters.
	 * @return array<string, mixed>|WP_Error
	 */
	public function execute( array $input ) {
		$post_id      = (int) ( $input['post_id'] ?? 0 );
		$position     = (int) ( $input['position'] ?? -1 );
		$attributes   = $input['attributes'] ?? array();
		$inner_blocks = $input['innerBlocks'] ?? array();

		// Validate post.
		if ( ! $post_id ) {
			return new WP_Error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' ),
				array( 'status' => 400 )
			);
		}

		// Generate modalId if not provided.
		if ( empty( $attributes['modalId'] ) ) {
			$attributes['modalId'] = 'dsgo-modal-' . wp_generate_uuid4();
		}

		// Sanitize attributes.
		$attributes = Block_Inserter::sanitize_attributes( $attributes );

		// Validate inner blocks if provided.
		if ( ! empty( $inner_blocks ) ) {
			$validation = Block_Inserter::validate_inner_blocks( $inner_blocks );
			if ( is_wp_error( $validation ) ) {
				return $validation;
			}
		}

		// Insert the block.
		return Block_Inserter::insert_block(
			$post_id,
			'designsetgo/modal',
			$attributes,
			$inner_blocks,
			$position
		);
	}
}
