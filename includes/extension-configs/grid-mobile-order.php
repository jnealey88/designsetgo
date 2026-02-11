<?php
/**
 * Grid mobile order extension attribute schema.
 *
 * @see src/extensions/grid-mobile-order/index.js
 * @package DesignSetGo
 */

defined( 'ABSPATH' ) || exit;

return array(
	'blocks'     => 'all',
	'exclude'    => array(),
	'attributes' => array(
		'dsgoMobileOrder' => array(
			'type'    => 'number',
			'default' => 1,
		),
	),
);
