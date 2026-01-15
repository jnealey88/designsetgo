/**
 * Draft Mode Header Component
 *
 * Displays a prominent header bar when editing a draft version,
 * with Publish Changes and Discard Draft buttons.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState, useEffect, useCallback, createPortal } from '@wordpress/element';
import { Button, Spinner } from '@wordpress/components';
import { getDraftStatus, publishDraft, discardDraft } from './api';

/**
 * Find the best container to inject our header bar into.
 *
 * @return {Element|null} The container element or null.
 */
function findHeaderContainer() {
	// Try different selectors for various WordPress editor versions.
	const selectors = [
		'.interface-interface-skeleton__header', // Modern WP 6.x
		'.edit-post-header', // Older WP
		'.editor-header', // Alternative
	];

	for (const selector of selectors) {
		const element = document.querySelector(selector);
		if (element) {
			return element;
		}
	}

	return null;
}

/**
 * Draft Mode Header Component
 *
 * Shows a header bar when viewing a draft with publish/discard controls.
 */
export default function DraftModeHeader() {
	const [status, setStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isActionLoading, setIsActionLoading] = useState(false);
	const [headerContainer, setHeaderContainer] = useState(null);

	// Get current post data from the editor store.
	const { postId, postType } = useSelect((select) => {
		const editor = select('core/editor');
		return {
			postId: editor.getCurrentPostId(),
			postType: editor.getCurrentPostType(),
		};
	}, []);

	// Find the header container on mount.
	useEffect(() => {
		// Try immediately.
		let container = findHeaderContainer();
		if (container) {
			setHeaderContainer(container);
			return;
		}

		// If not found, try again after a short delay (editor might still be loading).
		const timer = setTimeout(() => {
			container = findHeaderContainer();
			if (container) {
				setHeaderContainer(container);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	// Fetch draft status.
	const fetchStatus = useCallback(async () => {
		if (!postId) return;

		setIsLoading(true);
		try {
			const result = await getDraftStatus(postId);
			setStatus(result);
		} catch (err) {
			// Silently fail - header just won't show.
		} finally {
			setIsLoading(false);
		}
	}, [postId]);

	useEffect(() => {
		fetchStatus();
	}, [fetchStatus]);

	// Only show for pages that ARE drafts of another page.
	if (postType !== 'page' || isLoading || !status?.is_draft || !headerContainer) {
		return null;
	}

	// Handle publish draft action.
	const handlePublishDraft = async () => {
		if (!window.confirm(__('Publish these changes to the live page? This will replace the current live content.', 'designsetgo'))) {
			return;
		}

		setIsActionLoading(true);

		try {
			const result = await publishDraft(postId);
			if (result.success && result.edit_url) {
				window.location.href = result.edit_url;
			}
		} catch (err) {
			alert(err.message || __('Failed to publish changes.', 'designsetgo'));
			setIsActionLoading(false);
		}
	};

	// Handle discard draft action.
	const handleDiscardDraft = async () => {
		if (!window.confirm(__('Discard this draft? All changes will be lost and cannot be recovered.', 'designsetgo'))) {
			return;
		}

		setIsActionLoading(true);

		try {
			const result = await discardDraft(postId);
			if (result.success && status?.original_edit_url) {
				window.location.href = status.original_edit_url;
			}
		} catch (err) {
			alert(err.message || __('Failed to discard draft.', 'designsetgo'));
			setIsActionLoading(false);
		}
	};

	const headerContent = (
		<div className="dsgo-draft-mode-header">
			<div className="dsgo-draft-mode-header__content">
				<span className="dsgo-draft-mode-header__label">
					{__('Editing Draft Version', 'designsetgo')}
				</span>
				{status.original_view_url && (
					<a
						href={status.original_view_url}
						target="_blank"
						rel="noopener noreferrer"
						className="dsgo-draft-mode-header__link"
					>
						{__('View live page', 'designsetgo')}
					</a>
				)}
			</div>
			<div className="dsgo-draft-mode-header__actions">
				{isActionLoading && <Spinner />}
				<Button
					variant="secondary"
					isDestructive
					onClick={handleDiscardDraft}
					disabled={isActionLoading}
					size="compact"
				>
					{__('Discard Draft', 'designsetgo')}
				</Button>
				<Button
					variant="primary"
					onClick={handlePublishDraft}
					disabled={isActionLoading}
					isBusy={isActionLoading}
					size="compact"
				>
					{__('Publish Changes', 'designsetgo')}
				</Button>
			</div>
		</div>
	);

	// Use a portal to insert the header bar after the editor header.
	return createPortal(headerContent, headerContainer.parentElement || headerContainer);
}
