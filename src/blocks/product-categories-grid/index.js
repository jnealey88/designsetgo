/**
 * Product Categories Grid Block Registration
 *
 * Displays WooCommerce product categories in a visual grid.
 *
 * @since 2.1.0
 */

import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

import './editor.scss';
import './style.scss';

/**
 * Register Product Categories Grid Block
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
				{/* 2x2 grid of category cards */}
				<rect
					x="3"
					y="3"
					width="8"
					height="8"
					rx="1"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
				/>
				<rect
					x="13"
					y="3"
					width="8"
					height="8"
					rx="1"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
				/>
				<rect
					x="3"
					y="13"
					width="8"
					height="8"
					rx="1"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
				/>
				<rect
					x="13"
					y="13"
					width="8"
					height="8"
					rx="1"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
				/>
				{/* Image area indicators */}
				<rect
					x="4"
					y="4"
					width="6"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.3"
				/>
				<rect
					x="14"
					y="4"
					width="6"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.3"
				/>
				<rect
					x="4"
					y="14"
					width="6"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.3"
				/>
				<rect
					x="14"
					y="14"
					width="6"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.3"
				/>
				{/* Text line indicators */}
				<line
					x1="4.5"
					y1="9.5"
					x2="9.5"
					y2="9.5"
					stroke="currentColor"
					strokeWidth="1"
				/>
				<line
					x1="14.5"
					y1="9.5"
					x2="19.5"
					y2="9.5"
					stroke="currentColor"
					strokeWidth="1"
				/>
				<line
					x1="4.5"
					y1="19.5"
					x2="9.5"
					y2="19.5"
					stroke="currentColor"
					strokeWidth="1"
				/>
				<line
					x1="14.5"
					y1="19.5"
					x2="19.5"
					y2="19.5"
					stroke="currentColor"
					strokeWidth="1"
				/>
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
