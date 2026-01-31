/**
 * Visual Revision Comparison
 *
 * Entry point for the React-based revision comparison interface.
 *
 * @package DesignSetGo
 */

import { createRoot } from '@wordpress/element';
import RevisionComparison from './components/RevisionComparison';
import './style.scss';

/**
 * Initialize the revision comparison app
 */
document.addEventListener('DOMContentLoaded', () => {
	const rootElement = document.getElementById('designsetgo-revisions-root');

	if (rootElement) {
		const { postId, revisionId } = window.designSetGoRevisions || {};

		const root = createRoot(rootElement);
		root.render(
			<RevisionComparison postId={postId} initialRevisionId={revisionId} />
		);
	}
});
