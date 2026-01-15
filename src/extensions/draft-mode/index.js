/**
 * Draft Mode Extension
 *
 * Adds "draft mode" functionality to the block editor, allowing users
 * to create draft versions of published pages. Drafts are created
 * automatically when editing published pages.
 *
 * @package
 * @since 1.4.0
 */

import { registerPlugin } from '@wordpress/plugins';
import DraftModePanel from './DraftModePanel';
import DraftModeControls from './DraftModeControls';

import './editor.scss';

// Register the draft mode panel plugin (sidebar + auto-detection + controls).
registerPlugin('dsgo-draft-mode', {
	render: DraftModePanel,
	icon: 'edit-page',
});

// Register the draft mode controls plugin (post status info area controls).
registerPlugin('dsgo-draft-mode-controls', {
	render: DraftModeControls,
});
