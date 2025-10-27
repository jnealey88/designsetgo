/**
 * Icon List Block Registration
 *
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Register Icon List Block
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
				<line x1="8" y1="6" x2="21" y2="6" />
				<line x1="8" y1="12" x2="21" y2="12" />
				<line x1="8" y1="18" x2="21" y2="18" />
				<circle cx="3" cy="6" r="1" fill="currentColor" />
				<circle cx="3" cy="12" r="1" fill="currentColor" />
				<circle cx="3" cy="18" r="1" fill="currentColor" />
			</svg>
		),
		foreground: '#2563eb',
	},
	edit,
	save,
});
