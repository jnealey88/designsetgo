/**
 * Form Hidden Field Block - Registration
 *
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import { keyboardClose as icon } from '@wordpress/icons';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import { ICON_COLOR } from '../shared/constants';

import './style.scss';

registerBlockType(metadata.name, {
	icon: {
		src: icon,
		foreground: ICON_COLOR,
	},
	edit: Edit,
	save: Save,
});
