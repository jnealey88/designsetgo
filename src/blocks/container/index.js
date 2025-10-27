/**
 * Container Block
 *
 * Advanced layout container with video backgrounds, responsive grids, and visual effects.
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

// Import block styles
import './editor.scss';
import './style.scss';

// Register the block
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
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
				<line x1="9" y1="3" x2="9" y2="21" />
				<line x1="15" y1="3" x2="15" y2="21" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit,
	save,
	// Set default padding and blockGap using WordPress spacing presets
	// Padding Top/Bottom: lg, Left/Right: xs
	// Block Gap (spacing between inner blocks): md
	attributes: {
		...metadata.attributes,
		style: {
			type: 'object',
			default: {
				spacing: {
					padding: {
						top: 'var:preset|spacing|lg',
						bottom: 'var:preset|spacing|lg',
						left: 'var:preset|spacing|xs',
						right: 'var:preset|spacing|xs',
					},
					blockGap: 'var:preset|spacing|md',
				},
			},
		},
	},
});
