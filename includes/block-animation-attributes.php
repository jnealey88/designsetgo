<?php
/**
 * Block Animation Attributes Helper
 *
 * Provides utility functions to add animation data attributes
 * to dynamic blocks during server-side rendering.
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get animation data attributes from block attributes
 *
 * Extracts animation-related attributes and returns them as
 * an array of data attributes suitable for adding to HTML elements.
 *
 * @param array $attributes Block attributes array.
 * @return array Array of data attributes for animations.
 */
function dsg_get_animation_attributes( $attributes ) {
	$animation_attrs   = array();
	$animation_classes = array();

	// Check if animations are enabled.
	$animation_enabled = isset( $attributes['dsgAnimationEnabled'] ) ? $attributes['dsgAnimationEnabled'] : false;

	if ( ! $animation_enabled ) {
		return array(
			'classes' => '',
			'attrs'   => '',
		);
	}

	// Add animation classes.
	$animation_classes[] = 'has-dsg-animation';

	// Add entrance animation class.
	$entrance_animation = isset( $attributes['dsgEntranceAnimation'] ) ? $attributes['dsgEntranceAnimation'] : '';
	if ( $entrance_animation ) {
		$animation_classes[] = 'dsg-animation-' . esc_attr( $entrance_animation );
	}

	// Add exit animation class.
	$exit_animation = isset( $attributes['dsgExitAnimation'] ) ? $attributes['dsgExitAnimation'] : '';
	if ( $exit_animation ) {
		$animation_classes[] = 'dsg-animation-exit-' . esc_attr( $exit_animation );
	}

	// Add data attributes.
	$animation_attrs['data-dsg-animation-enabled'] = 'true';

	// Entrance animation.
	if ( $entrance_animation ) {
		$animation_attrs['data-dsg-entrance-animation'] = esc_attr( $entrance_animation );
	} else {
		$animation_attrs['data-dsg-entrance-animation'] = '';
	}

	// Exit animation.
	if ( $exit_animation ) {
		$animation_attrs['data-dsg-exit-animation'] = esc_attr( $exit_animation );
	} else {
		$animation_attrs['data-dsg-exit-animation'] = '';
	}

	// Animation trigger.
	$trigger                                       = isset( $attributes['dsgAnimationTrigger'] ) ? $attributes['dsgAnimationTrigger'] : 'scroll';
	$animation_attrs['data-dsg-animation-trigger'] = esc_attr( $trigger );

	// Animation duration.
	$duration                                       = isset( $attributes['dsgAnimationDuration'] ) ? $attributes['dsgAnimationDuration'] : 600;
	$animation_attrs['data-dsg-animation-duration'] = esc_attr( $duration );

	// Animation delay.
	$delay                                       = isset( $attributes['dsgAnimationDelay'] ) ? $attributes['dsgAnimationDelay'] : 0;
	$animation_attrs['data-dsg-animation-delay'] = esc_attr( $delay );

	// Animation easing.
	$easing                                       = isset( $attributes['dsgAnimationEasing'] ) ? $attributes['dsgAnimationEasing'] : 'ease-out';
	$animation_attrs['data-dsg-animation-easing'] = esc_attr( $easing );

	// Animation offset (for scroll trigger).
	$offset                                       = isset( $attributes['dsgAnimationOffset'] ) ? $attributes['dsgAnimationOffset'] : 100;
	$animation_attrs['data-dsg-animation-offset'] = esc_attr( $offset );

	// Animation once.
	$once                                       = isset( $attributes['dsgAnimationOnce'] ) ? $attributes['dsgAnimationOnce'] : true;
	$animation_attrs['data-dsg-animation-once'] = $once ? 'true' : 'false';

	// Convert classes array to string.
	$classes_string = implode( ' ', $animation_classes );

	// Convert data attributes array to string.
	$attrs_string = '';
	foreach ( $animation_attrs as $key => $value ) {
		$attrs_string .= ' ' . $key . '="' . $value . '"';
	}

	return array(
		'classes' => $classes_string,
		'attrs'   => $attrs_string,
	);
}

/**
 * Add animation attributes to wrapper attributes string
 *
 * Takes an existing wrapper attributes string (from get_block_wrapper_attributes)
 * and injects animation classes and data attributes.
 *
 * @param string $wrapper_attributes Existing wrapper attributes string.
 * @param array  $attributes         Block attributes array.
 * @return string Modified wrapper attributes string.
 */
function dsg_add_animation_to_wrapper( $wrapper_attributes, $attributes ) {
	$animation_data = dsg_get_animation_attributes( $attributes );

	// If no animation classes, return original.
	if ( empty( $animation_data['classes'] ) ) {
		return $wrapper_attributes;
	}

	// Add animation classes to existing class attribute.
	if ( strpos( $wrapper_attributes, 'class="' ) !== false ) {
		$wrapper_attributes = preg_replace(
			'/class="([^"]*)"/',
			'class="$1 ' . $animation_data['classes'] . '"',
			$wrapper_attributes
		);
	} else {
		// Add new class attribute.
		$wrapper_attributes .= ' class="' . $animation_data['classes'] . '"';
	}

	// Append data attributes.
	$wrapper_attributes .= $animation_data['attrs'];

	return $wrapper_attributes;
}
