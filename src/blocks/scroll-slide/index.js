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
	...metadata,
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
					x="3"
					y="4"
					width="18"
					height="16"
					rx="2"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<path
					d="M7 9h10M7 13h7"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		),
		foreground: ICON_COLOR,
	},
});
