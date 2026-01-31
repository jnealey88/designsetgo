/**
 * Draft Mode Panel Component
 *
 * Displays draft info in sidebar with draft management controls.
 * Allows creating, publishing, and discarding drafts of published pages.
 *
 * @package
 * @since 1.4.0
 */

import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect, useCallback } from '@wordpress/element';
import {
	Notice,
	Spinner,
	Button,
	ExternalLink,
	Modal,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { getDraftStatus, createDraft, publishDraft, discardDraft } from './api';
import { clearDirtyState } from './utils';

/**
 * Draft Mode Panel Component
 *
 * Displays draft info in sidebar with draft management controls.
 */
export default function DraftModePanel() {
	const [status, setStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreatingDraft, setIsCreatingDraft] = useState(false);
	const [isActionLoading, setIsActionLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showPublishConfirm, setShowPublishConfirm] = useState(false);
	const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
	const [showCreateConfirm, setShowCreateConfirm] = useState(false);

	// Get current post data from the editor store.
	const {
		postId,
		postType,
		postStatus,
		hasEdits,
		currentContent,
		currentTitle,
		currentExcerpt,
	} = useSelect((select) => {
		const editor = select('core/editor');
		return {
			postId: editor.getCurrentPostId(),
			postType: editor.getCurrentPostType(),
			postStatus: editor.getEditedPostAttribute('status'),
			hasEdits: editor.isEditedPostDirty(),
			currentContent: editor.getEditedPostContent(),
			currentTitle: editor.getEditedPostAttribute('title'),
			currentExcerpt: editor.getEditedPostAttribute('excerpt'),
		};
	}, []);

	// Get editor dispatch functions.
	const { savePost } = useDispatch('core/editor');

	// Fetch draft status when post ID changes.
	const fetchStatus = useCallback(async () => {
		if (!postId) {
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const result = await getDraftStatus(postId);
			setStatus(result);
		} catch (err) {
			setError(
				err.message || __('Failed to load draft status.', 'designsetgo')
			);
		} finally {
			setIsLoading(false);
		}
	}, [postId]);

	useEffect(() => {
		fetchStatus();
	}, [fetchStatus]);

	// Handle create draft button click (shows confirmation modal).
	const handleCreateDraft = () => {
		setShowCreateConfirm(true);
	};

	// Execute draft creation after confirmation.
	const confirmCreateDraft = async () => {
		setShowCreateConfirm(false);

		if (isCreatingDraft) {
			return;
		}

		setIsCreatingDraft(true);
		setError(null);

		try {
			// Create draft with current content (captures any edits made).
			const result = await createDraft(postId, {
				content: currentContent,
				title: currentTitle,
				excerpt: currentExcerpt,
			});

			if (result.success && result.edit_url) {
				// Clear dirty state before navigating to prevent "Leave site?" warning.
				clearDirtyState();
				window.location.href = result.edit_url;
			}
		} catch (err) {
			// If draft creation failed because one already exists, redirect to it.
			if (err.data?.draft_id) {
				const draftEditUrl =
					err.data.edit_url ||
					`post.php?post=${err.data.draft_id}&action=edit`;

				// Clear dirty state before navigating.
				clearDirtyState();
				window.location.href = draftEditUrl;
				return;
			}

			setError(
				err.message || __('Failed to create draft.', 'designsetgo')
			);
			setIsCreatingDraft(false);
		}
	};

	// Handle publish draft action.
	const handlePublishDraft = () => {
		setShowPublishConfirm(true);
	};

	// Confirm and execute publish.
	const confirmPublishDraft = async () => {
		setShowPublishConfirm(false);
		setIsActionLoading(true);
		setError(null);

		try {
			// Save any pending changes first.
			if (hasEdits) {
				await savePost();
			}

			const result = await publishDraft(postId);
			if (result.success && result.edit_url) {
				// Clear dirty state before navigating to prevent "Leave site?" warning.
				clearDirtyState();
				window.location.href = result.edit_url;
			}
		} catch (err) {
			setError(
				err.message || __('Failed to publish changes.', 'designsetgo')
			);
			setIsActionLoading(false);
		}
	};

	// Handle discard draft action.
	const handleDiscardDraft = () => {
		setShowDiscardConfirm(true);
	};

	// Confirm and execute discard.
	const confirmDiscardDraft = async () => {
		setShowDiscardConfirm(false);
		setIsActionLoading(true);
		setError(null);

		try {
			const result = await discardDraft(postId);
			if (result.success && status?.original_edit_url) {
				// Clear dirty state before navigating to prevent "Leave site?" warning.
				clearDirtyState();
				window.location.href = status.original_edit_url;
			}
		} catch (err) {
			setError(
				err.message || __('Failed to discard draft.', 'designsetgo')
			);
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
					<span>{__('Creating draft…', 'designsetgo')}</span>
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
					<span>{__('Loading…', 'designsetgo')}</span>
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
				<Notice
					status="error"
					isDismissible={false}
					className="dsgo-draft-mode-panel__notice"
				>
					{error}
				</Notice>
			)}

			{/* State 1: This IS a draft of another page */}
			{status?.is_draft && (
				<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--is-draft">
					<Notice
						status="warning"
						isDismissible={false}
						className="dsgo-draft-mode-panel__notice"
					>
						{__('You are editing a draft version.', 'designsetgo')}
					</Notice>

					<p className="dsgo-draft-mode-panel__description">
						{__(
							"Changes here won't affect the live page until you publish them.",
							'designsetgo'
						)}
					</p>

					{status.original_view_url && (
						<p className="dsgo-draft-mode-panel__link">
							<ExternalLink href={status.original_view_url}>
								{__('View live page', 'designsetgo')}
							</ExternalLink>
						</p>
					)}

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
					<Notice
						status="info"
						isDismissible={false}
						className="dsgo-draft-mode-panel__notice"
					>
						{__(
							'A draft version exists for this page.',
							'designsetgo'
						)}
					</Notice>

					<p className="dsgo-draft-mode-panel__description">
						{__(
							'Edit the draft to make changes without affecting the live page.',
							'designsetgo'
						)}
					</p>

					{status.draft_created && (
						<p className="dsgo-draft-mode-panel__meta">
							{__('Created:', 'designsetgo')}{' '}
							{status.draft_created}
						</p>
					)}

					{status.draft_edit_url && (
						<div className="dsgo-draft-mode-panel__actions">
							<Button
								variant="primary"
								href={status.draft_edit_url}
							>
								{__('Edit Draft', 'designsetgo')}
							</Button>
						</div>
					)}
				</div>
			)}

			{/* State 3: Published page with no draft - show Create Draft button */}
			{!status?.is_draft &&
				!status?.has_draft &&
				postStatus === 'publish' && (
					<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--can-create">
						<p className="dsgo-draft-mode-panel__description">
							{__(
								'Create a draft to make changes without affecting the live page.',
								'designsetgo'
							)}
						</p>

						<div className="dsgo-draft-mode-panel__actions">
							<Button
								variant="primary"
								onClick={handleCreateDraft}
							>
								{__('Create Draft', 'designsetgo')}
							</Button>
						</div>
					</div>
				)}

			{/* State 4: Not a published page - feature not available */}
			{!status?.is_draft &&
				!status?.has_draft &&
				postStatus !== 'publish' && (
					<div className="dsgo-draft-mode-panel__content dsgo-draft-mode-panel__content--unavailable">
						<p className="dsgo-draft-mode-panel__description dsgo-draft-mode-panel__description--muted">
							{__(
								'Draft mode is only available for published pages.',
								'designsetgo'
							)}
						</p>
					</div>
				)}

			{/* Publish confirmation modal */}
			{showPublishConfirm && (
				<Modal
					title={__('Publish Changes?', 'designsetgo')}
					onRequestClose={() => setShowPublishConfirm(false)}
					size="small"
				>
					<Flex direction="column" gap={4}>
						<FlexItem>
							<p style={{ margin: 0 }}>
								{__(
									'This will replace the current live content with your draft changes.',
									'designsetgo'
								)}
							</p>
						</FlexItem>
						<Flex justify="flex-end" gap={3}>
							<FlexItem>
								<Button
									variant="tertiary"
									onClick={() => setShowPublishConfirm(false)}
								>
									{__('Cancel', 'designsetgo')}
								</Button>
							</FlexItem>
							<FlexItem>
								<Button
									variant="primary"
									onClick={confirmPublishDraft}
								>
									{__('Publish', 'designsetgo')}
								</Button>
							</FlexItem>
						</Flex>
					</Flex>
				</Modal>
			)}

			{/* Discard confirmation modal */}
			{showDiscardConfirm && (
				<Modal
					title={__('Discard Draft?', 'designsetgo')}
					onRequestClose={() => setShowDiscardConfirm(false)}
					size="small"
				>
					<Flex direction="column" gap={4}>
						<FlexItem>
							<p style={{ margin: 0 }}>
								{__(
									'All changes will be lost and cannot be recovered. The live page will remain unchanged.',
									'designsetgo'
								)}
							</p>
						</FlexItem>
						<Flex justify="flex-end" gap={3}>
							<FlexItem>
								<Button
									variant="tertiary"
									onClick={() => setShowDiscardConfirm(false)}
								>
									{__('Cancel', 'designsetgo')}
								</Button>
							</FlexItem>
							<FlexItem>
								<Button
									variant="primary"
									isDestructive
									onClick={confirmDiscardDraft}
								>
									{__('Discard', 'designsetgo')}
								</Button>
							</FlexItem>
						</Flex>
					</Flex>
				</Modal>
			)}

			{/* Create draft confirmation modal */}
			{showCreateConfirm && (
				<Modal
					title={__('Create Draft?', 'designsetgo')}
					onRequestClose={() => setShowCreateConfirm(false)}
					size="small"
				>
					<Flex direction="column" gap={4}>
						<FlexItem>
							<p style={{ margin: 0 }}>
								{__(
									'This will create a draft version of this page with your current edits. The live page will remain unchanged.',
									'designsetgo'
								)}
							</p>
						</FlexItem>
						<Flex justify="flex-end" gap={3}>
							<FlexItem>
								<Button
									variant="tertiary"
									onClick={() => setShowCreateConfirm(false)}
								>
									{__('Cancel', 'designsetgo')}
								</Button>
							</FlexItem>
							<FlexItem>
								<Button
									variant="primary"
									onClick={confirmCreateDraft}
								>
									{__('Create Draft', 'designsetgo')}
								</Button>
							</FlexItem>
						</Flex>
					</Flex>
				</Modal>
			)}
		</PluginDocumentSettingPanel>
	);
}
