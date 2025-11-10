/**
 * Blobs Block
 *
 * Create random, unique, and organic-looking blob shapes with animations.
 *
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import Save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

/**
 * Custom icon for Blobs block
 */
const icon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 2C8.5 2 6 4.5 6 8C6 9.5 6.5 11 7.5 12C6.5 13 6 14.5 6 16C6 19.5 8.5 22 12 22C15.5 22 18 19.5 18 16C18 14.5 17.5 13 16.5 12C17.5 11 18 9.5 18 8C18 4.5 15.5 2 12 2Z"
			fill="currentColor"
		/>
	</svg>
);

/**
 * Register the Blobs block
 */
registerBlockType(metadata.name, {
	icon: {
		src: icon,
		foreground: ICON_COLOR,
	},
	edit: Edit,
	save: Save,
	deprecated,
});
