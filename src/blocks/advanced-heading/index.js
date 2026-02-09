/**
 * Advanced Heading Block - Registration
 *
 * A heading block that supports multiple font segments,
 * allowing different typography for each part of the heading.
 *
 * @since 1.5.0
 */

import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

import './editor.scss';
import './style.scss';

/**
 * Register Advanced Heading Block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polyline points="4 7 4 4 20 4 20 7" />
				<line x1="9" y1="20" x2="15" y2="20" />
				<line x1="12" y1="4" x2="12" y2="20" />
				<line x1="4" y1="12" x2="9" y2="12" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
