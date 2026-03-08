/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

registerBlockType(metadata.name, {
	edit: Edit,
	save: Save,
	icon: {
		src: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<rect
					x="2"
					y="3"
					width="20"
					height="18"
					rx="2"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<path d="M2 9h20" stroke="currentColor" strokeWidth="1.5" />
				<circle cx="5" cy="6" r="1" />
				<circle cx="8" cy="6" r="1" />
				<circle cx="11" cy="6" r="1" />
				<path
					d="M5 13h5M5 16h3"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					opacity="0.5"
				/>
				<rect x="13" y="11" width="7" height="7" rx="1" opacity="0.3" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
});
