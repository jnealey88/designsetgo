/**
 * Modal Block
 *
 * Creates accessible modal dialogs with customizable triggers and content.
 *
 * @package
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import './style.scss';
import './editor.scss';

import Edit from './edit';
import save from './save';
import metadata from './block.json';
import variations from './variations';

/**
 * Register the Modal block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save,
	variations,
});
