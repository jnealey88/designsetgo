<?php
/**
 * Clickable group extension attribute schema.
 *
 * @see src/extensions/clickable-group/index.js
 * @package DesignSetGo
 */

defined( 'ABSPATH' ) || exit;

return array(
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
);
