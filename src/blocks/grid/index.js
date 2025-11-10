/**
 * DSG Grid Block Registration
 *
 * Responsive multi-column grid layouts.
 *
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import transforms from './transforms';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

import './editor.scss';
import './style.scss';

/**
 * Register DSG Grid Block
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
				<rect
					x="4"
					y="4"
					width="6"
					height="6"
					rx="1"
					fill="currentColor"
				/>
				<rect
					x="14"
					y="4"
					width="6"
					height="6"
					rx="1"
					fill="currentColor"
				/>
				<rect
					x="4"
					y="14"
					width="6"
					height="6"
					rx="1"
					fill="currentColor"
				/>
				<rect
					x="14"
					y="14"
					width="6"
					height="6"
					rx="1"
					fill="currentColor"
				/>
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
	transforms,
});
