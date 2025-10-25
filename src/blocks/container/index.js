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
		foreground: '#2563eb',
	},
	edit,
	save,
	// Set default padding using WordPress spacing presets
	// Top/Bottom: lg, Left/Right: xs
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
				},
			},
		},
	},
});
