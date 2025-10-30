/**
 * Stack Container Block Registration
 *
 * Simple vertical stacking container with consistent gaps.
 *
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import transforms from './transforms';
import metadata from './block.json';

import './editor.scss';
import './style.scss';

/**
 * Register Stack Container Block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect x="4" y="4" width="16" height="3" rx="1" fill="currentColor" />
				<rect x="4" y="10.5" width="16" height="3" rx="1" fill="currentColor" />
				<rect x="4" y="17" width="16" height="3" rx="1" fill="currentColor" />
			</svg>
		),
		foreground: '#2563eb',
	},
	edit,
	save,
	transforms,
});
