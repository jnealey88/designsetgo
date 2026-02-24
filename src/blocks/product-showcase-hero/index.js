/**
 * Product Showcase Hero Block Registration
 *
 * Full-width hero section showcasing a WooCommerce product.
 *
 * @since 2.1.0
 */

import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

import './editor.scss';
import './style.scss';

/**
 * Register Product Showcase Hero Block
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
				{/* Left half: product image */}
				<rect
					x="3"
					y="4"
					width="8"
					height="16"
					rx="1"
					fill="currentColor"
				/>
				{/* Right half: product details */}
				<rect
					x="13"
					y="4"
					width="8"
					height="16"
					rx="1"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
				/>
				{/* Product title */}
				<line
					x1="15"
					y1="8"
					x2="19"
					y2="8"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				{/* Price */}
				<line
					x1="15"
					y1="11"
					x2="18"
					y2="11"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				{/* Cart button */}
				<rect
					x="15"
					y="14"
					width="4"
					height="2"
					rx="0.5"
					fill="currentColor"
				/>
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save: () => null,
});
