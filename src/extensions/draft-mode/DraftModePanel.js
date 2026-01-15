/**
 * Draft Mode Panel Component
 *
 * Handles auto-detection of first edit on published pages and
 * automatic draft creation. Also displays draft info in sidebar
 * with auto-save functionality and draft management controls.
 *
 * @package DesignSetGo
 * @since 1.4.0
 */

import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect, useCallback, useRef } from '@wordpress/element';
import {
	Notice,
	Spinner,
	Button,
	ExternalLink,
	__experimentalNumberControl as NumberControl,
	ToggleControl,
} from '@wordpress/components';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { getDraftStatus, createDraft, publishDraft, discardDraft } from './api';

/**
 * Draft Mode Panel Component
 *
 * Auto-creates draft on first edit of published pages.
 */
// Default auto-save interval in seconds.
const DEFAULT_AUTO_SAVE_INTERVAL = 60;

export default function DraftModePanel() {
	const [status, setStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreatingDraft, setIsCreatingDraft] = useState(false);
	const [isActionLoading, setIsActionLoading] = useState(false);
	const [error, setError] = useState(null);
	const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
	const [autoSaveInterval, setAutoSaveInterval] = useState(DEFAULT_AUTO_SAVE_INTERVAL);
	const [lastAutoSave, setLastAutoSave] = useState(null);
	const hasTriggeredDraft = useRef(false);
	const initialContentRef = useRef(null);
	const autoSaveTimerRef = useRef(null);
	const draftCreationDebounceRef = useRef(null);

	// Get current post data from the editor store.
	const { postId, postType, postStatus, hasEdits, currentContent, currentTitle, currentExcerpt, isSavingPost, isAutosavingPost } = useSelect((select) => {
		const editor = select('core/editor');
		return {
			postId: editor.getCurrentPostId(),
			postType: editor.getCurrentPostType(),
			postStatus: editor.getEditedPostAttribute('status'),
			hasEdits: editor.hasEditsHistory?.() || editor.isEditedPostDirty(),
			currentContent: editor.getEditedPostContent(),
			currentTitle: editor.getEditedPostAttribute('title'),
			currentExcerpt: editor.getEditedPostAttribute('excerpt'),
			isSavingPost: editor.isSavingPost(),
			isAutosavingPost: editor.isAutosavingPost(),
		};
	}, []);

	// Get the savePost function from the editor dispatch.
	const { savePost } = useDispatch('core/editor');

	// Track if we've initialized settings from API.
	const settingsInitialized = useRef(false);

	// Fetch draft status when post ID changes.
	const fetchStatus = useCallback(async () => {
		if (!postId) return;

		setIsLoading(true);
		setError(null);

		try {
			const result = await getDraftStatus(postId);
			setStatus(result);

			// Initialize auto-save settings from API response (only once).
			if (!settingsInitialized.current && result.settings) {
				settingsInitialized.current = true;
				setAutoSaveEnabled(result.settings.auto_save_enabled ?? true);
				setAutoSaveInterval(result.settings.auto_save_interval ?? DEFAULT_AUTO_SAVE_INTERVAL);
			}

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
	// Debounced to prevent rapid API calls on every keystroke.
	useEffect(() => {
		// Clear any pending debounce timer.
		if (draftCreationDebounceRef.current) {
			clearTimeout(draftCreationDebounceRef.current);
			draftCreationDebounceRef.current = null;
		}

		// Skip if:
		// - Draft mode is disabled
		// - Not a page
		// - Not published
		// - Already has a draft
		// - This IS a draft
		// - Already triggered draft creation
		// - Still loading status
		if (
			!status?.settings?.enabled ||
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

		// Debounce draft creation to avoid rapid API calls while user is typing.
		// Wait 500ms after the last change before creating the draft.
		draftCreationDebounceRef.current = setTimeout(() => {
			// Double-check we haven't already triggered (could change during debounce).
			if (hasTriggeredDraft.current || isCreatingDraft) {
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
						// Use server-provided edit_url for subdirectory support.
						const draftEditUrl = err.data.edit_url || `post.php?post=${err.data.draft_id}&action=edit`;
						window.location.href = draftEditUrl;
						return;
					}

					setError(err.message || __('Failed to create draft.', 'designsetgo'));
					setIsCreatingDraft(false);
					hasTriggeredDraft.current = false;
				}
			};

			doCreateDraft();
		}, 500);

		// Cleanup: clear debounce timer on unmount or before next effect run.
		return () => {
			if (draftCreationDebounceRef.current) {
				clearTimeout(draftCreationDebounceRef.current);
				draftCreationDebounceRef.current = null;
			}
		};
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

	// Auto-save effect for drafts.
	useEffect(() => {
		// Only auto-save if:
		// - Auto-save is enabled
		// - This IS a draft
		// - There are unsaved edits
		// - Not currently saving
		if (
			!autoSaveEnabled ||
			!status?.is_draft ||
			!hasEdits ||
			isSavingPost ||
			isAutosavingPost
		) {
			// Clear timer if conditions not met.
			if (autoSaveTimerRef.current) {
				clearInterval(autoSaveTimerRef.current);
				autoSaveTimerRef.current = null;
			}
			return;
		}

		// Set up auto-save interval.
		autoSaveTimerRef.current = setInterval(() => {
			if (hasEdits && !isSavingPost && !isAutosavingPost) {
				savePost();
				setLastAutoSave(new Date().toLocaleTimeString());
			}
		}, autoSaveInterval * 1000);

		return () => {
			if (autoSaveTimerRef.current) {
				clearInterval(autoSaveTimerRef.current);
				autoSaveTimerRef.current = null;
			}
		};
	}, [autoSaveEnabled, autoSaveInterval, status?.is_draft, hasEdits, isSavingPost, isAutosavingPost, savePost]);

	// Handle publish draft action.
	const handlePublishDraft = async () => {
		if (!window.confirm(__('Publish these changes to the live page? This will replace the current live content.', 'designsetgo'))) {
			return;
		}

		setIsActionLoading(true);
		setError(null);

		try {
			const result = await publishDraft(postId);
			if (result.success && result.edit_url) {
				window.location.href = result.edit_url;
			}
		} catch (err) {
			setError(err.message || __('Failed to publish changes.', 'designsetgo'));
			setIsActionLoading(false);
		}
	};

	// Handle discard draft action.
	const handleDiscardDraft = async () => {
		if (!window.confirm(__('Discard this draft? All changes will be lost and cannot be recovered.', 'designsetgo'))) {
			return;
		}

		setIsActionLoading(true);
		setError(null);

		try {
			const result = await discardDraft(postId);
			if (result.success && status?.original_edit_url) {
				window.location.href = status.original_edit_url;
			}
		} catch (err) {
			setError(err.message || __('Failed to discard draft.', 'designsetgo'));
			setIsActionLoading(false);
		}
	};

	// Only show for pages.
	if (postType !== 'page') {
		return null;
	}

	// Don't show if draft mode is disabled (after loading).
	if (!isLoading && status?.settings?.enabled === false) {
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
						{__('Changes here won\'t affect the live page until you publish them.', 'designsetgo')}
					</p>

					{status.original_view_url && (
						<p className="dsgo-draft-mode-panel__link">
							<ExternalLink href={status.original_view_url}>
								{__('View live page', 'designsetgo')}
							</ExternalLink>
						</p>
					)}

					{/* Auto-save settings */}
					<div className="dsgo-draft-mode-panel__auto-save">
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Auto-save', 'designsetgo')}
							checked={autoSaveEnabled}
							onChange={setAutoSaveEnabled}
						/>

						{autoSaveEnabled && (
							<NumberControl
								__next40pxDefaultSize
								label={__('Save every (seconds)', 'designsetgo')}
								value={autoSaveInterval}
								onChange={(value) => setAutoSaveInterval(parseInt(value, 10) || DEFAULT_AUTO_SAVE_INTERVAL)}
								min={10}
								max={300}
								step={10}
							/>
						)}

						{lastAutoSave && (
							<p className="dsgo-draft-mode-panel__meta">
								{__('Last auto-save:', 'designsetgo')} {lastAutoSave}
							</p>
						)}
					</div>

					{/* Action buttons */}
					<div className="dsgo-draft-mode-panel__actions">
						<Button
							variant="primary"
							onClick={handlePublishDraft}
							disabled={isActionLoading}
							isBusy={isActionLoading}
						>
							{__('Publish Changes', 'designsetgo')}
						</Button>

						<Button
							variant="secondary"
							isDestructive
							onClick={handleDiscardDraft}
							disabled={isActionLoading}
						>
							{__('Discard Draft', 'designsetgo')}
						</Button>
					</div>
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
