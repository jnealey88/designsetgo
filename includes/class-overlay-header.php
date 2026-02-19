<?php
/**
 * Overlay Header Class
 *
 * Handles per-page overlay header functionality via post meta.
 *
 * @package DesignSetGo
 * @since 2.1.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Overlay Header Class
 */
class Overlay_Header {
	/**
	 * Post meta key for overlay header toggle.
	 */
	const META_KEY = 'dsgo_overlay_header';

	/**
	 * Post meta key for overlay header text color.
	 */
	const TEXT_COLOR_META_KEY = 'dsgo_overlay_header_text_color';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_post_meta' ) );
		add_filter( 'body_class', array( $this, 'add_body_class' ) );
	}

	/**
	 * Register post meta for overlay header toggle.
	 */
	public function register_post_meta(): void {
		$post_types = get_post_types( array( 'public' => true ), 'names' );

		foreach ( $post_types as $post_type ) {
			if ( 'attachment' === $post_type ) {
				continue;
			}

			register_post_meta(
				$post_type,
				self::META_KEY,
				array(
					'type'              => 'boolean',
					'description'       => __( 'Enable overlay header on this page', 'designsetgo' ),
					'single'            => true,
					'default'           => false,
					'show_in_rest'      => true,
					'sanitize_callback' => 'rest_sanitize_boolean',
					'auth_callback'     => function ( $allowed, $meta_key, $post_id ) {
						return current_user_can( 'edit_post', (int) $post_id );
					},
				)
			);

			register_post_meta(
				$post_type,
				self::TEXT_COLOR_META_KEY,
				array(
					'type'              => 'string',
					'description'       => __( 'Overlay header text color slug', 'designsetgo' ),
					'single'            => true,
					'default'           => '',
					'show_in_rest'      => true,
					'sanitize_callback' => 'sanitize_key',
					'auth_callback'     => function ( $allowed, $meta_key, $post_id ) {
						return current_user_can( 'edit_post', (int) $post_id );
					},
				)
			);
		}
	}

	/**
	 * Add body class when overlay header is enabled for the current post.
	 *
	 * @param string[] $classes Body classes.
	 * @return string[] Modified body classes.
	 */
	public function add_body_class( $classes ) {
		if ( ! is_singular() ) {
			return $classes;
		}

		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return $classes;
		}

		if ( get_post_meta( $post_id, self::META_KEY, true ) ) {
			$classes[] = 'dsgo-page-overlay-header';
		}

		return $classes;
	}
}
