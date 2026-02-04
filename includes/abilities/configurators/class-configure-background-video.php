<?php
/**
 * Configure Background Video Ability.
 *
 * Applies background video settings to container blocks
 * for immersive video backgrounds.
 *
 * @package DesignSetGo
 * @subpackage Abilities
 * @since 2.0.0
 */

namespace DesignSetGo\Abilities\Configurators;

use DesignSetGo\Abilities\Abstract_Ability;
use DesignSetGo\Abilities\Block_Configurator;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Configure Background Video ability class.
 */
class Configure_Background_Video extends Abstract_Ability {

	/**
	 * Get ability name.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'designsetgo/configure-background-video';
	}

	/**
	 * Get ability configuration.
	 *
	 * @return array<string, mixed>
	 */
	public function get_config(): array {
		return array(
			'label'               => __( 'Configure Background Video', 'designsetgo' ),
			'description'         => __( 'Applies background video settings to container blocks. Supports self-hosted videos with autoplay, loop, and overlay options.', 'designsetgo' ),
			'category'            => 'blocks',
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => Block_Configurator::get_default_output_schema(),
			'permission_callback' => array( $this, 'check_permission_callback' ),
		);
	}

	/**
	 * Get input schema.
	 *
	 * @return array<string, mixed>
	 */
	private function get_input_schema(): array {
		$common = Block_Configurator::get_common_input_schema();

		return array(
			'type'                 => 'object',
			'properties'           => array_merge(
				$common,
				array(
					'block_name' => array(
						'type'        => 'string',
						'description' => __( 'Block type to configure', 'designsetgo' ),
						'enum'        => array( 'core/group', 'core/cover', 'designsetgo/section', 'designsetgo/stack' ),
						'default'     => 'core/group',
					),
					'video'      => array(
						'type'        => 'object',
						'description' => __( 'Background video settings', 'designsetgo' ),
						'properties'  => array(
							'enabled'         => array(
								'type'        => 'boolean',
								'description' => __( 'Enable background video', 'designsetgo' ),
								'default'     => true,
							),
							'url'             => array(
								'type'        => 'string',
								'description' => __( 'Video URL (MP4 recommended)', 'designsetgo' ),
							),
							'mediaId'         => array(
								'type'        => 'number',
								'description' => __( 'Video attachment ID', 'designsetgo' ),
							),
							'posterUrl'       => array(
								'type'        => 'string',
								'description' => __( 'Poster image URL (shown before video loads)', 'designsetgo' ),
							),
							'autoplay'        => array(
								'type'        => 'boolean',
								'description' => __( 'Autoplay video (muted for browser compatibility)', 'designsetgo' ),
								'default'     => true,
							),
							'loop'            => array(
								'type'        => 'boolean',
								'description' => __( 'Loop video playback', 'designsetgo' ),
								'default'     => true,
							),
							'muted'           => array(
								'type'        => 'boolean',
								'description' => __( 'Mute video audio', 'designsetgo' ),
								'default'     => true,
							),
							'objectFit'       => array(
								'type'        => 'string',
								'description' => __( 'How video fills container', 'designsetgo' ),
								'enum'        => array( 'cover', 'contain', 'fill' ),
								'default'     => 'cover',
							),
							'objectPosition'  => array(
								'type'        => 'string',
								'description' => __( 'Video position (e.g., "center center")', 'designsetgo' ),
								'default'     => 'center center',
							),
							'overlayEnabled'  => array(
								'type'        => 'boolean',
								'description' => __( 'Enable color overlay on video', 'designsetgo' ),
								'default'     => true,
							),
							'overlayColor'    => array(
								'type'        => 'string',
								'description' => __( 'Overlay color', 'designsetgo' ),
								'default'     => '#000000',
							),
							'overlayOpacity'  => array(
								'type'        => 'number',
								'description' => __( 'Overlay opacity (0-100)', 'designsetgo' ),
								'default'     => 50,
								'minimum'     => 0,
								'maximum'     => 100,
							),
							'playbackRate'    => array(
								'type'        => 'number',
								'description' => __( 'Playback speed (0.5 = half, 1 = normal, 2 = double)', 'designsetgo' ),
								'default'     => 1,
								'minimum'     => 0.25,
								'maximum'     => 2,
							),
							'disableOnMobile' => array(
								'type'        => 'boolean',
								'description' => __( 'Disable video on mobile (show poster instead)', 'designsetgo' ),
								'default'     => true,
							),
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
	 * @return bool
	 */
	public function check_permission_callback(): bool {
		return $this->check_permission( 'edit_posts' );
	}

	/**
	 * Execute the ability.
	 *
	 * @param array<string, mixed> $input Input parameters.
	 * @return array<string, mixed>|WP_Error
	 */
	public function execute( array $input ) {
		$post_id         = (int) ( $input['post_id'] ?? 0 );
		$block_client_id = $input['block_client_id'] ?? null;
		$update_all      = (bool) ( $input['update_all'] ?? false );
		$block_name      = $input['block_name'] ?? 'core/group';
		$video           = $input['video'] ?? array();

		// Validate required parameters.
		if ( ! $post_id ) {
			return $this->error(
				'missing_post_id',
				__( 'Post ID is required.', 'designsetgo' )
			);
		}

		if ( empty( $video ) ) {
			return $this->error(
				'missing_video',
				__( 'Video settings are required.', 'designsetgo' )
			);
		}

		// Map video settings to block attributes.
		$attribute_mapping = array(
			'enabled'         => 'dsgoBackgroundVideoEnabled',
			'url'             => 'dsgoBackgroundVideoUrl',
			'mediaId'         => 'dsgoBackgroundVideoId',
			'posterUrl'       => 'dsgoBackgroundVideoPoster',
			'autoplay'        => 'dsgoBackgroundVideoAutoplay',
			'loop'            => 'dsgoBackgroundVideoLoop',
			'muted'           => 'dsgoBackgroundVideoMuted',
			'objectFit'       => 'dsgoBackgroundVideoFit',
			'objectPosition'  => 'dsgoBackgroundVideoPosition',
			'overlayEnabled'  => 'dsgoBackgroundVideoOverlay',
			'overlayColor'    => 'dsgoBackgroundVideoOverlayColor',
			'overlayOpacity'  => 'dsgoBackgroundVideoOverlayOpacity',
			'playbackRate'    => 'dsgoBackgroundVideoPlaybackRate',
			'disableOnMobile' => 'dsgoBackgroundVideoDisableMobile',
		);

		$new_attributes = array();
		foreach ( $video as $key => $value ) {
			if ( isset( $attribute_mapping[ $key ] ) ) {
				$new_attributes[ $attribute_mapping[ $key ] ] = $value;
			}
		}

		// Apply the configuration.
		return Block_Configurator::configure_block(
			$post_id,
			$block_name,
			$new_attributes,
			$block_client_id,
			$update_all
		);
	}
}
