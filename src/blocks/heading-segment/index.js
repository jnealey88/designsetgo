/**
 * Heading Segment Block - Registration
 *
 * A child block of Advanced Heading that represents
 * one text segment with its own typography settings.
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
				<text
					x="4"
					y="18"
					fontSize="16"
					fontWeight="bold"
					fill="currentColor"
					stroke="none"
				>
					Aa
				</text>
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
