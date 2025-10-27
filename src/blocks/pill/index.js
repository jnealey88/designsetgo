/**
 * Pill Block
 *
 * A block that displays text with a rounded background that wraps tightly around content.
 *
 * @since 1.0.0
 */
import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import metadata from './block.json';

import './editor.scss';
import './style.scss';

/**
 * Register Pill Block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<rect x="3" y="8" width="18" height="8" rx="4" fill="currentColor"/>
			</svg>
		),
		foreground: '#2563eb',
	},
	edit,
	save,
});
