/**
 * Modal Trigger Block
 *
 * A button or link that opens a modal dialog.
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import './editor.scss';

import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';

/**
 * Register the Modal Trigger block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save,
	deprecated,
});
