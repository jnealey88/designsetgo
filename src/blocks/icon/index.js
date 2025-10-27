/**
 * Icon Block - Registration
 *
 * Registers the Icon block with WordPress.
 * Edit component extracted to edit.js for better maintainability.
 *
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

import './editor.scss';
import './style.scss';

/**
 * Register Icon Block
 *
 * Display icons from WordPress Dashicons library with customizable
 * size, rotation, background shape, and optional link.
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
