/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
import { ICON_COLOR } from '../shared/constants';
import './style.scss';
import './editor.scss';

const icon = {
	src: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke={ICON_COLOR}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="2" y="4" width="20" height="14" rx="2" />
			<path d="M7 22h10" />
			<path d="M12 18v4" />
			<circle cx="8" cy="20" r="0" />
			<circle cx="12" cy="20" r="0" />
			<circle cx="16" cy="20" r="0" />
			<path d="M6 11l-2.5 0" />
			<path d="M20.5 11l-2.5 0" />
			<path d="M9 8h6" />
			<path d="M8 11h8" />
		</svg>
	),
	foreground: ICON_COLOR,
};

registerBlockType(metadata.name, {
	icon,
	edit: Edit,
	// Dynamic block — render.php handles frontend output.
	save: () => null,
});
