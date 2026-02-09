/**
 * Heading Segment Block - Registration
 *
 * A child block of Advanced Heading that represents
 * one text segment with its own typography settings.
 *
 * @since 2.0.0
 */

import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

import './editor.scss';
import './style.scss';

/**
 * Register Heading Segment Block
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
				<path d="M5 4v16M5 12h6M11 4v16" />
				<path d="M15 12h6M18 8v8" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
