import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
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
				{/* Vertical timeline line */}
				<line x1="12" y1="2" x2="12" y2="22" />
				{/* Timeline markers */}
				<circle cx="12" cy="6" r="2.5" fill="currentColor" />
				<circle cx="12" cy="12" r="2.5" fill="currentColor" />
				<circle cx="12" cy="18" r="2.5" fill="currentColor" />
				{/* Content indicators */}
				<line x1="16" y1="6" x2="20" y2="6" />
				<line x1="4" y1="12" x2="8" y2="12" />
				<line x1="16" y1="18" x2="20" y2="18" />
			</svg>
		),
		foreground: ICON_COLOR,
	},
	edit: Edit,
	save: Save,
});
