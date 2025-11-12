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
				{/* Top row of images - scrolling right */}
				<rect
					x="2"
					y="3"
					width="4"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.3"
				/>
				<rect
					x="7"
					y="3"
					width="4"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.5"
				/>
				<rect
					x="12"
					y="3"
					width="4"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.7"
				/>
				<path
					d="M18 5l2 0 -1.5 -1.5M18 5l2 0 -1.5 1.5"
					stroke="currentColor"
					strokeWidth="1.2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>

				{/* Middle row of images - scrolling left */}
				<rect
					x="11"
					y="10"
					width="4"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.5"
				/>
				<rect
					x="16"
					y="10"
					width="4"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.7"
				/>
				<path
					d="M6 12l-2 0 1.5 -1.5M6 12l-2 0 1.5 1.5"
					stroke="currentColor"
					strokeWidth="1.2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>

				{/* Bottom row of images - scrolling right */}
				<rect
					x="2"
					y="17"
					width="4"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.5"
				/>
				<rect
					x="7"
					y="17"
					width="4"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.6"
				/>
				<rect
					x="12"
					y="17"
					width="4"
					height="4"
					rx="0.5"
					fill="currentColor"
					opacity="0.3"
				/>
				<path
					d="M18 19l2 0 -1.5 -1.5M18 19l2 0 -1.5 1.5"
					stroke="currentColor"
					strokeWidth="1.2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
