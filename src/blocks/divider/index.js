/**
 * Divider Block - Registration
 *
 * Registers the Divider block with WordPress.
 * Provides multiple separator styles for visual content division.
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
 * Register Divider Block
 *
 * Visual separator with multiple style options including
 * solid, dashed, gradient, and decorative patterns.
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<line x1="3" y1="12" x2="21" y2="12" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
