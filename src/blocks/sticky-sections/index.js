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
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			>
				{/* Three stacked cards with slight offset */}
				<rect x="3" y="2" width="18" height="8" rx="1.5" />
				<rect
					x="3"
					y="8"
					width="18"
					height="8"
					rx="1.5"
					opacity="0.6"
				/>
				<rect
					x="3"
					y="14"
					width="18"
					height="8"
					rx="1.5"
					opacity="0.3"
				/>
				{/* Pin indicator */}
				<circle
					cx="19"
					cy="5"
					r="1.5"
					fill="currentColor"
					stroke="none"
				/>
			</svg>
		),
		foreground: ICON_COLOR,
	},
});
