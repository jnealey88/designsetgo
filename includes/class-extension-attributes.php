<?php
/**
 * Extension Attributes Registration
 *
 * Registers extension-injected block attributes on the server side via
 * the `register_block_type_args` filter, so they appear in the REST API
 * at /wp-json/wp/v2/block-types.
 *
 * JS extensions add these same attributes client-side via
 * addFilter('blocks.registerBlockType'). This file mirrors those
 * definitions for server-side awareness.
 *
 * @package DesignSetGo
 * @since   2.1.0
 */

namespace DesignSetGo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Extension Attributes Class
 *
 * Mirrors JS extension attribute definitions on the server so the
 * WordPress REST API block-types endpoint exposes complete schemas.
 */
class Extension_Attributes {

	/**
	 * Extension definitions.
	 *
	 * Each entry maps an extension name to:
	 *   - 'blocks'     string|array  'all' for all designsetgo/* blocks, or an explicit list.
	 *   - 'exclude'    array         Block names to exclude (only when blocks = 'all').
	 *   - 'attributes' array         Attribute schemas matching the JS definitions.
	 *
	 * @var array
	 */
	private static $extensions = array(

		// See src/extensions/responsive/index.js.
		'responsive'          => array(
			'blocks'     => 'all',
			'exclude'    => array(),
			'attributes' => array(
				'dsgoHideOnDesktop' => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'dsgoHideOnTablet'  => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'dsgoHideOnMobile'  => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
		),

		// See src/extensions/custom-css/index.js.
		'custom-css'          => array(
			'blocks'     => 'all',
			'exclude'    => array( 'core/html', 'core/code' ),
			'attributes' => array(
				'dsgoCustomCSS' => array(
					'type'    => 'string',
					'default' => '',
				),
			),
		),

		// See src/extensions/block-animations/attributes.js.
		'block-animations'    => array(
			'blocks'     => 'all',
			'exclude'    => array( 'core/freeform' ),
			'attributes' => array(
				'dsgoAnimationEnabled'  => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'dsgoEntranceAnimation' => array(
					'type'    => 'string',
					'default' => '',
				),
				'dsgoExitAnimation'     => array(
					'type'    => 'string',
					'default' => '',
				),
				'dsgoAnimationTrigger'  => array(
					'type'    => 'string',
					'default' => 'scroll',
				),
				'dsgoAnimationDuration' => array(
					'type'    => 'number',
					'default' => 600,
				),
				'dsgoAnimationDelay'    => array(
					'type'    => 'number',
					'default' => 0,
				),
				'dsgoAnimationEasing'   => array(
					'type'    => 'string',
					'default' => 'ease-out',
				),
				'dsgoAnimationOffset'   => array(
					'type'    => 'number',
					'default' => 100,
				),
				'dsgoAnimationOnce'     => array(
					'type'    => 'boolean',
					'default' => true,
				),
			),
		),

		// See src/extensions/grid-span/index.js.
		'grid-span'           => array(
			'blocks'     => 'all',
			'exclude'    => array(),
			'attributes' => array(
				'dsgoColumnSpan' => array(
					'type'    => 'number',
					'default' => 1,
				),
			),
		),

		// See src/extensions/grid-mobile-order/index.js.
		'grid-mobile-order'   => array(
			'blocks'     => 'all',
			'exclude'    => array(),
			'attributes' => array(
				'dsgoMobileOrder' => array(
					'type'    => 'number',
					'default' => 1,
				),
			),
		),

		// See src/extensions/max-width/index.js.
		'max-width'           => array(
			'blocks'     => 'all',
			'exclude'    => array(
				'core/spacer',
				'core/separator',
				'core/page-list',
				'core/navigation',
				'designsetgo/section',
				'designsetgo/row',
				'designsetgo/grid',
			),
			'attributes' => array(
				'dsgoMaxWidth' => array(
					'type'    => 'string',
					'default' => '',
				),
			),
		),

		// See src/extensions/reveal-control/index.js — child attribute for all blocks.
		'reveal-control'      => array(
			'blocks'     => 'all',
			'exclude'    => array(),
			'attributes' => array(
				'dsgoRevealOnHover' => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
		),

		// See src/extensions/reveal-control/index.js — container attributes.
		'reveal-container'    => array(
			'blocks'     => array(
				'designsetgo/section',
				'designsetgo/row',
				'designsetgo/grid',
				'designsetgo/reveal',
			),
			'exclude'    => array(),
			'attributes' => array(
				'enableRevealOnHover'  => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'revealAnimationType'  => array(
					'type'    => 'string',
					'default' => 'fade',
				),
			),
		),

		// See src/extensions/background-video/index.js.
		'background-video'    => array(
			'blocks'     => array(
				'designsetgo/section',
				'designsetgo/row',
				'designsetgo/grid',
				'designsetgo/reveal',
				'designsetgo/flip-card',
				'designsetgo/flip-card-front',
				'designsetgo/flip-card-back',
				'designsetgo/accordion',
				'designsetgo/accordion-item',
				'designsetgo/tabs',
				'designsetgo/tab',
				'designsetgo/scroll-accordion',
				'designsetgo/scroll-accordion-item',
				'designsetgo/scroll-marquee',
				'designsetgo/image-accordion',
				'designsetgo/image-accordion-item',
			),
			'exclude'    => array(),
			'attributes' => array(
				'dsgoVideoUrl'          => array(
					'type'    => 'string',
					'default' => '',
				),
				'dsgoVideoPoster'       => array(
					'type'    => 'string',
					'default' => '',
				),
				'dsgoVideoMuted'        => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'dsgoVideoLoop'         => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'dsgoVideoAutoplay'     => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'dsgoVideoMobileHide'   => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'dsgoVideoOverlayColor' => array(
					'type'    => 'string',
					'default' => '',
				),
			),
		),

		// See src/extensions/clickable-group/index.js.
		'clickable-group'     => array(
			'blocks'     => array(
				'core/group',
				'designsetgo/section',
				'designsetgo/row',
				'designsetgo/grid',
			),
			'exclude'    => array(),
			'attributes' => array(
				'dsgoLinkUrl'    => array(
					'type'    => 'string',
					'default' => '',
				),
				'dsgoLinkTarget' => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'dsgoLinkRel'    => array(
					'type'    => 'string',
					'default' => '',
				),
			),
		),

		// See src/extensions/vertical-scroll-parallax/attributes.js.
		'vertical-parallax'   => array(
			'blocks'     => array(
				// Core blocks.
				'core/group',
				'core/cover',
				'core/image',
				'core/media-text',
				'core/columns',
				'core/column',
				// DesignSetGo container blocks.
				'designsetgo/section',
				'designsetgo/row',
				'designsetgo/grid',
				'designsetgo/reveal',
				// DesignSetGo visual blocks.
				'designsetgo/flip-card',
				'designsetgo/flip-card-front',
				'designsetgo/flip-card-back',
				'designsetgo/icon',
				'designsetgo/icon-button',
				'designsetgo/image-accordion',
				'designsetgo/image-accordion-item',
				'designsetgo/scroll-accordion',
				'designsetgo/scroll-accordion-item',
			),
			'exclude'    => array(),
			'attributes' => array(
				'dsgoParallaxEnabled'       => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'dsgoParallaxDirection'     => array(
					'type'    => 'string',
					'default' => 'up',
				),
				'dsgoParallaxSpeed'         => array(
					'type'    => 'number',
					'default' => 5,
				),
				'dsgoParallaxViewportStart' => array(
					'type'    => 'number',
					'default' => 0,
				),
				'dsgoParallaxViewportEnd'   => array(
					'type'    => 'number',
					'default' => 100,
				),
				'dsgoParallaxRelativeTo'    => array(
					'type'    => 'string',
					'default' => 'viewport',
				),
				'dsgoParallaxDesktop'       => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'dsgoParallaxTablet'        => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'dsgoParallaxMobile'        => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
		),

		// See src/extensions/svg-patterns/attributes.js.
		'svg-patterns'        => array(
			'blocks'     => array(
				'core/group',
				'designsetgo/section',
			),
			'exclude'    => array(),
			'attributes' => array(
				'dsgoSvgPatternEnabled' => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'dsgoSvgPatternType'    => array(
					'type'    => 'string',
					'default' => '',
				),
				'dsgoSvgPatternColor'   => array(
					'type'    => 'string',
					'default' => '#9c92ac',
				),
				'dsgoSvgPatternOpacity' => array(
					'type'    => 'number',
					'default' => 0.4,
				),
				'dsgoSvgPatternScale'   => array(
					'type'    => 'number',
					'default' => 1,
				),
				'dsgoSvgPatternFixed'   => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
		),

		// See src/extensions/expanding-background/attributes.js.
		'expanding-background' => array(
			'blocks'     => array(
				'core/group',
				'designsetgo/section',
			),
			'exclude'    => array(),
			'attributes' => array(
				'dsgoExpandingBgEnabled'         => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'dsgoExpandingBgColor'           => array(
					'type'    => 'string',
					'default' => '#e8e8e8',
				),
				'dsgoExpandingBgInitialSize'     => array(
					'type'    => 'number',
					'default' => 50,
				),
				'dsgoExpandingBgBlur'            => array(
					'type'    => 'number',
					'default' => 30,
				),
				'dsgoExpandingBgSpeed'           => array(
					'type'    => 'number',
					'default' => 1,
				),
				'dsgoExpandingBgTriggerOffset'   => array(
					'type'    => 'number',
					'default' => 0,
				),
				'dsgoExpandingBgCompletionPoint' => array(
					'type'    => 'number',
					'default' => 80,
				),
			),
		),

		// See src/extensions/text-reveal/attributes.js.
		'text-reveal'         => array(
			'blocks'     => array(
				'core/paragraph',
				'core/heading',
			),
			'exclude'    => array(),
			'attributes' => array(
				'dsgoTextRevealEnabled'    => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'dsgoTextRevealColor'      => array(
					'type'    => 'string',
					'default' => '#2563eb',
				),
				'dsgoTextRevealSplitMode'  => array(
					'type'    => 'string',
					'default' => 'word',
				),
				'dsgoTextRevealTransition' => array(
					'type'    => 'number',
					'default' => 150,
				),
			),
		),
	);

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'register_block_type_args', array( $this, 'inject_extension_attributes' ), 10, 2 );
	}

	/**
	 * Inject extension attributes into registered block types.
	 *
	 * Runs during register_block_type() for each block. Checks every
	 * extension's allowlist and merges applicable attributes into the
	 * block type args so the REST API exposes them.
	 *
	 * @param array  $args       Block type registration arguments.
	 * @param string $block_type Block type name (e.g. 'designsetgo/section').
	 * @return array Modified arguments with extension attributes merged.
	 */
	public function inject_extension_attributes( $args, $block_type ) {
		if ( ! isset( $args['attributes'] ) || ! is_array( $args['attributes'] ) ) {
			$args['attributes'] = array();
		}

		foreach ( self::$extensions as $extension ) {
			if ( ! self::block_matches( $block_type, $extension ) ) {
				continue;
			}

			foreach ( $extension['attributes'] as $attr_name => $attr_schema ) {
				// Don't overwrite if block.json already defines this attribute.
				if ( ! isset( $args['attributes'][ $attr_name ] ) ) {
					$args['attributes'][ $attr_name ] = $attr_schema;
				}
			}
		}

		return $args;
	}

	/**
	 * Check if a block matches an extension's allowlist.
	 *
	 * @param string $block_type Block type name.
	 * @param array  $extension  Extension definition.
	 * @return bool Whether the extension applies to this block.
	 */
	private static function block_matches( $block_type, $extension ) {
		$blocks  = $extension['blocks'];
		$exclude = isset( $extension['exclude'] ) ? $extension['exclude'] : array();

		// Check exclusion list first.
		if ( in_array( $block_type, $exclude, true ) ) {
			return false;
		}

		// 'all' means all blocks (core and custom), matching JS shouldExtendBlock() behavior.
		if ( 'all' === $blocks ) {
			return true;
		}

		// Explicit allowlist.
		return is_array( $blocks ) && in_array( $block_type, $blocks, true );
	}
}
