/**
 * Flip Card Back Block Registration
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
				<rect
					x="4"
					y="4"
					width="16"
					height="16"
					rx="2"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
					strokeDasharray="3 3"
					opacity="0.5"
				/>
				<circle cx="12" cy="12" r="3" fill="currentColor" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
