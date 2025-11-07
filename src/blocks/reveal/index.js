/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

/**
 * Register the Reveal block
 */
registerBlockType(metadata.name, {
	icon: {
		src: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
			>
				<rect
					x="4"
					y="8"
					width="16"
					height="8"
					rx="2"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<path
					d="M12 11v2"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
