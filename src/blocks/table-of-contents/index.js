import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';

// Import styles
import './editor.scss';
import './style.scss';

registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				{/* List icon with hierarchical structure */}
				<line x1="8" y1="6" x2="21" y2="6" />
				<line x1="8" y1="12" x2="21" y2="12" />
				<line x1="8" y1="18" x2="21" y2="18" />
				<circle cx="3" cy="6" r="1" fill="currentColor" />
				<circle cx="3" cy="12" r="1" fill="currentColor" />
				<circle cx="3" cy="18" r="1" fill="currentColor" />
				{/* Nested indicators */}
				<line x1="12" y1="9" x2="18" y2="9" opacity="0.5" />
				<line x1="12" y1="15" x2="18" y2="15" opacity="0.5" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit: Edit,
	save: Save,
	deprecated,
});
