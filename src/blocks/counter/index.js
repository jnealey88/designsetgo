/**
 * Counter Block - Registration
 *
 * Registers the Counter block with WordPress.
 * Edit component extracted to edit.js for better maintainability.
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

/**
 * Register Counter Block
 *
 * Individual counter item within a Counter Group block.
 * Displays an animated counting number with optional icon and label.
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
			>
				<rect x="6" y="4" width="12" height="16" rx="1" />
				<text
					x="12"
					y="14"
					fontSize="10"
					fontWeight="bold"
					textAnchor="middle"
					stroke="none"
					fill="currentColor"
				>
					123
				</text>
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
});
