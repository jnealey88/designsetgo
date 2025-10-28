/**
 * Icon Button Block
 *
 * A button with optional icon at the start or end.
 * Leverages the icon library from the Icon block.
 *
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import { button as icon } from '@wordpress/icons';

import edit from './edit';
import save from './save';
import metadata from './block.json';

import './editor.scss';
import './style.scss';

/**
 * Register Icon Button Block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: icon,
		foreground: '#2563eb',
	},
	edit,
	save,
});
