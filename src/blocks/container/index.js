/**
 * Container Block
 *
 * @package DesignSetGo
 */

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import './style.scss';
import './editor.scss';

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
				strokeWidth="2"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<path d="M3 9h18M3 15h18" />
			</svg>
		),
	},
});
