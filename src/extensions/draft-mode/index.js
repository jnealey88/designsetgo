/**
 * Draft Mode Extension
 *
 * Adds "draft mode" functionality to the block editor, allowing users
 * to create draft versions of published pages. Drafts are created
 * automatically when editing published pages.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

import { registerPlugin } from '@wordpress/plugins';
import DraftModePanel from './DraftModePanel';
import DraftModeHeader from './DraftModeHeader';

import './editor.scss';

// Register the draft mode panel plugin (sidebar + auto-detection).
registerPlugin('dsgo-draft-mode', {
	render: DraftModePanel,
	icon: 'edit-page',
});

// Register the draft mode header plugin (header bar when viewing drafts).
registerPlugin('dsgo-draft-mode-header', {
	render: DraftModeHeader,
});
