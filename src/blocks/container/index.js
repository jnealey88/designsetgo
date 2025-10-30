/**
 * Container Block
 *
 * Advanced layout container with video backgrounds, responsive grids, and visual effects.
 */

import { registerBlockType } from '@wordpress/blocks';
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
	// Migration: Handle old gridAlignSelf attribute
	deprecated: [
		{
			attributes: {
				...metadata.attributes,
				gridAlignSelf: {
					type: 'string',
				},
			},
			migrate(attributes) {
				// Migrate gridAlignSelf to verticalAlign
				const { gridAlignSelf, ...rest } = attributes;

				// Map old values to new values
				let verticalAlign = '';
				if (gridAlignSelf === 'start' || gridAlignSelf === 'flex-start') {
					verticalAlign = 'top';
				} else if (gridAlignSelf === 'center') {
					verticalAlign = 'center';
				} else if (gridAlignSelf === 'end' || gridAlignSelf === 'flex-end') {
					verticalAlign = 'bottom';
				}
				// 'stretch' maps to empty string (default)

				return {
					...rest,
					verticalAlign,
				};
			},
			save,
		},
	],
	// Set default styles using WordPress spacing presets
	// Padding Top/Bottom: lg, Left/Right: xs
	// Block Gap (spacing between inner blocks): md
	// Border Radius: 0 (no rounding by default)
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
				border: {
					radius: '0px',
				},
			},
		},
	},
});
