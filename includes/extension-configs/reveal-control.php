<?php
/**
 * Reveal control extension attribute schema (child attribute for all blocks).
 *
 * @see src/extensions/reveal-control/index.js
 * @package DesignSetGo
 */

defined( 'ABSPATH' ) || exit;

return array(
	'blocks'     => 'all',
	'exclude'    => array(),
	'attributes' => array(
		'dsgoRevealOnHover' => array(
			'type'    => 'boolean',
			'default' => false,
		),
	),
);
