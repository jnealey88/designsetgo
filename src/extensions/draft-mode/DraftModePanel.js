/**
 * Draft Mode Panel Component
 *
 * Handles auto-detection of first edit on published pages and
 * automatic draft creation. Also displays draft info in sidebar.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch, subscribe } from '@wordpress/data';
import { useState, useEffect, useCallback, useRef } from '@wordpress/element';
import {
	Notice,
	Spinner,
	ExternalLink,
} from '@wordpress/components';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { getDraftStatus, createDraft } from './api';

/**
 * Draft Mode Panel Component
 *
 * Auto-creates draft on first edit of published pages.
 */
export default function DraftModePanel() {
	const [status, setStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreatingDraft, setIsCreatingDraft] = useState(false);
	const [error, setError] = useState(null);
	const hasTriggeredDraft = useRef(false);
	const initialContentRef = useRef(null);

	// Get current post data from the editor store.
	const { postId, postType, postStatus, hasEdits, currentContent, currentTitle, currentExcerpt } = useSelect((select) => {
		const editor = select('core/editor');
		return {
			postId: editor.getCurrentPostId(),
			postType: editor.getCurrentPostType(),
			postStatus: editor.getEditedPostAttribute('status'),
			hasEdits: editor.hasEditsHistory?.() || editor.isEditedPostDirty(),
			currentContent: editor.getEditedPostContent(),
			currentTitle: editor.getEditedPostAttribute('title'),
			currentExcerpt: editor.getEditedPostAttribute('excerpt'),
		};
	}, []);

	// Fetch draft status when post ID changes.
	const fetchStatus = useCallback(async () => {
		if (!postId) return;

		setIsLoading(true);
		setError(null);

		try {
			const result = await getDraftStatus(postId);
			setStatus(result);

			// Store initial content for comparison.
			if (!initialContentRef.current) {
				initialContentRef.current = {
					content: currentContent,
					title: currentTitle,
					excerpt: currentExcerpt,
				};
			}
		} catch (err) {
			setError(err.message || __('Failed to load draft status.', 'designsetgo'));
		} finally {
			setIsLoading(false);
		}
	}, [postId, currentContent, currentTitle, currentExcerpt]);

	useEffect(() => {
		fetchStatus();
	}, [fetchStatus]);

	// Auto-create draft when user makes first edit on a published page.
	useEffect(() => {
		// Skip if:
		// - Not a page
		// - Not published
		// - Already has a draft
		// - This IS a draft
		// - Already triggered draft creation
		// - Still loading status
		// - No edits made yet
		if (
			postType !== 'page' ||
			postStatus !== 'publish' ||
			isLoading ||
			status?.is_draft ||
			status?.has_draft ||
			hasTriggeredDraft.current ||
			isCreatingDraft
		) {
			return;
		}

		// Check if content has actually changed from initial.
		if (!initialContentRef.current) {
			return;
		}

		const hasContentChanged =
			currentContent !== initialContentRef.current.content ||
			currentTitle !== initialContentRef.current.title ||
			currentExcerpt !== initialContentRef.current.excerpt;

		if (!hasContentChanged) {
			return;
		}

		// User has made changes to a published page - auto-create draft.
		hasTriggeredDraft.current = true;
		setIsCreatingDraft(true);

		const doCreateDraft = async () => {
			try {
				const result = await createDraft(postId, {
					content: currentContent,
					title: currentTitle,
					excerpt: currentExcerpt,
				});

				if (result.success && result.edit_url) {
					// Redirect to the draft editor.
					window.location.href = result.edit_url;
				}
			} catch (err) {
				// If draft creation failed because one already exists, redirect to it.
				if (err.data?.draft_id) {
					const draftEditUrl = `/wp-admin/post.php?post=${err.data.draft_id}&action=edit`;
					window.location.href = draftEditUrl;
					return;
				}

				setError(err.message || __('Failed to create draft.', 'designsetgo'));
				setIsCreatingDraft(false);
				hasTriggeredDraft.current = false;
			}
		};

		doCreateDraft();
	}, [
		postType,
		postStatus,
		isLoading,
		status,
		isCreatingDraft,
		postId,
		currentContent,
		currentTitle,
		currentExcerpt,
	]);

	// Only show for pages.
	if (postType !== 'page') {
		return null;
	}

	// Show creating draft state.
	if (isCreatingDraft) {
		return (
			<PluginDocumentSettingPanel
				name="dsgo-draft-mode"
				title={__('Draft Mode', 'designsetgo')}
				className="dsgo-draft-mode-panel"
			>
				<div className="dsgo-draft-mode-panel__loading">
					<Spinner />
					<span>{__('Creating draft...', 'designsetgo')}</span>
				</div>
			</PluginDocumentSettingPanel>
		);
	}

	// Render loading state.
	if (isLoading) {
		return (
			<PluginDocumentSettingPanel
				name="dsgo-draft-mode"
				title={__('Draft Mode', 'designsetgo')}
				className="dsgo-draft-mode-panel"
			>
				<div className="dsgo-draft-mode-panel__loading">
					<Spinner />
					<span>{__('Loading...', 'designsetgo')}</span>
				</div>
			</PluginDocumentSettingPanel>
		);
	}

	// Render panel content based on status.
	return (
		<PluginDocumentSettingPanel
			name="dsgo-draft-mode"
			title={__('Draft Mode', 'designsetgo')}
			className="dsgo-draft-mode-panel"
		>
			{error && (
				<Notice status="error" isDismissible={false} className="dsgo-draft-mode-panel__notice">
					{error}
				</Notice>
			)}

			{/* State 1: This IS a draft of another page */}
			{status?.is_draft && (
				<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--is-draft">
					<Notice status="warning" isDismissible={false} className="dsgo-draft-mode-panel__notice">
						{__('You are editing a draft version.', 'designsetgo')}
					</Notice>

					<p className="dsgo-draft-mode-panel__description">
						{__('Changes you make here will not affect the live page until you publish them. Use the header controls to publish or discard.', 'designsetgo')}
					</p>

					{status.original_view_url && (
						<p className="dsgo-draft-mode-panel__link">
							<ExternalLink href={status.original_view_url}>
								{__('View live page', 'designsetgo')}
							</ExternalLink>
						</p>
					)}
				</div>
			)}

			{/* State 2: This page HAS a pending draft */}
			{!status?.is_draft && status?.has_draft && (
				<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--has-draft">
					<Notice status="info" isDismissible={false} className="dsgo-draft-mode-panel__notice">
						{__('A draft version exists for this page.', 'designsetgo')}
					</Notice>

					<p className="dsgo-draft-mode-panel__description">
						{__('Any edits you make here will redirect you to the existing draft.', 'designsetgo')}
					</p>

					{status.draft_created && (
						<p className="dsgo-draft-mode-panel__meta">
							{__('Created:', 'designsetgo')} {status.draft_created}
						</p>
					)}

					{status.draft_edit_url && (
						<p className="dsgo-draft-mode-panel__link">
							<a href={status.draft_edit_url}>
								{__('Go to draft', 'designsetgo')} &rarr;
							</a>
						</p>
					)}
				</div>
			)}

			{/* State 3: Published page with no draft - will auto-create on edit */}
			{!status?.is_draft && !status?.has_draft && postStatus === 'publish' && (
				<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--can-create">
					<p className="dsgo-draft-mode-panel__description">
						{__('When you start editing, a draft will be created automatically. Your changes will be saved to the draft until you publish them.', 'designsetgo')}
					</p>
				</div>
			)}

			{/* State 4: Not a published page - feature not available */}
			{!status?.is_draft && !status?.has_draft && postStatus !== 'publish' && (
				<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--unavailable">
					<p className="dsgo-draft-mode-panel__description dsgo-draft-mode-panel__description--muted">
						{__('Draft mode is only available for published pages.', 'designsetgo')}
					</p>
				</div>
			)}
		</PluginDocumentSettingPanel>
	);
}
