/**
 * Form Textarea Field Block - Registration
 *
 * Renamed from 'designsetgo/form-textarea' to 'designsetgo/form-textarea-field'
 * for consistency with other form field blocks.
 *
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import { paragraph as icon } from '@wordpress/icons';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import deprecated from './deprecated';
import { ICON_COLOR } from '../shared/constants';

import './style.scss';
import './editor.scss';

/**
 * Register the new block name (designsetgo/form-textarea-field)
 */
registerBlockType(metadata.name, {
	icon: {
		src: icon,
		foreground: ICON_COLOR,
	},
	deprecated,
	edit: Edit,
	save: Save,
});

/**
 * Register the old block name as an alias for backward compatibility.
 * Hidden from inserter - existing blocks will still render correctly.
 */
registerBlockType('designsetgo/form-textarea', {
	...metadata,
	name: 'designsetgo/form-textarea',
	title: 'Textarea (Legacy)',
	supports: {
		...metadata.supports,
		inserter: false,
	},
	icon: {
		src: icon,
		foreground: ICON_COLOR,
	},
	edit: Edit,
	save: Save,
});
