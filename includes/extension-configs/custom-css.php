<?php
/**
 * Custom CSS extension attribute schema.
 *
 * @see src/extensions/custom-css/index.js
 * @package DesignSetGo
 */

defined( 'ABSPATH' ) || exit;

return array(
	'blocks'     => 'all',
	'exclude'    => array( 'core/html', 'core/code' ),
	'attributes' => array(
		'dsgoCustomCSS' => array(
			'type'    => 'string',
			'default' => '',
		),
	),
);
