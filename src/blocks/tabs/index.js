/**
 * Tabs Block Registration
 */

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
	...metadata,
	icon: {
		src: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM11 19H3v-6h8v6zm10 0h-8v-6h8v6zm0-8H3V5h18v6z"/>
			</svg>
		),
	},
	edit: Edit,
	save: Save,
});
