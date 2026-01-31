/**
 * Draft Mode Controls Component
 *
 * Intercepts the native WordPress Publish button when editing a draft
 * version of a published page, redirecting it to use the custom
 * publishDraft() API that merges changes back to the original page.
 *
 * Also adds "Save Draft" link in the editor header for saving without publishing.
 *
 * @package
 * @since 1.4.0
 */

import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect, useCallback, useRef, createPortal } from '@wordpress/element';
import { Button, Modal, Flex, FlexItem } from '@wordpress/components';
import { getDraftStatus, publishDraft, createDraft } from './api';
import { clearDirtyState } from './utils';

/**
 * Find the editor header settings container.
 *
 * @return {Element|null} The container element or null.
 */
function findHeaderSettingsContainer() {
	const selectors = [
		'.editor-header__settings',
		'.edit-post-header__settings',
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
 * Draft Mode Controls Component
 *
 * Intercepts native Publish button to use custom merge API,
 * and adds Save Draft link in header.
 */
export default function DraftModeControls() {
	const [status, setStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [headerContainer, setHeaderContainer] = useState(null);
	const [isPublishing, setIsPublishing] = useState(false);
	const [isCreatingDraft, setIsCreatingDraft] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const publishInterceptRef = useRef(null);

	// Get current post data from the editor store.
	const {
		postId,
		postType,
		postStatus,
		hasEdits,
		isSavingPost,
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
			isSavingPost: editor.isSavingPost(),
			currentContent: editor.getEditedPostContent(),
			currentTitle: editor.getEditedPostAttribute('title'),
			currentExcerpt: editor.getEditedPostAttribute('excerpt'),
		};
	}, []);

	// Get editor dispatch functions.
	const { savePost } = useDispatch('core/editor');

	// Handle custom publish (merge draft to original).
	const handlePublishDraft = useCallback(
		async (e) => {
			// Prevent the native WordPress publish action.
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			if (isPublishing) {
				return;
			}

			setIsPublishing(true);

			try {
				// First save any pending changes and wait for completion.
				if (hasEdits) {
					await savePost();
				}

				// Then merge draft to original via our API.
				const result = await publishDraft(postId);

				if (result.success && result.edit_url) {
					// Clear dirty state before navigating to prevent "Leave site?" warning.
					clearDirtyState();
					window.location.href = result.edit_url;
				}
			} catch (err) {
				setErrorMessage(
					err.message || __('Failed to publish changes.', 'designsetgo')
				);
				setShowErrorModal(true);
				setIsPublishing(false);
			}
		},
		[postId, hasEdits, savePost, isPublishing]
	);

	// Find the header container on mount.
	useEffect(() => {
		let container = findHeaderSettingsContainer();
		if (container) {
			setHeaderContainer(container);
			return;
		}

		const timer = setTimeout(() => {
			container = findHeaderSettingsContainer();
			if (container) {
				setHeaderContainer(container);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	// Fetch draft status.
	const fetchStatus = useCallback(async () => {
		if (!postId) {
			return;
		}

		setIsLoading(true);
		try {
			const result = await getDraftStatus(postId);
			setStatus(result);
		} catch (err) {
			// Silently fail.
		} finally {
			setIsLoading(false);
		}
	}, [postId]);

	useEffect(() => {
		fetchStatus();
	}, [fetchStatus]);

	// Add/remove class on body to change Save button text via CSS.
	useEffect(() => {
		if (!isLoading && status?.is_draft && postType === 'page') {
			document.body.classList.add('dsgo-draft-mode-active');
		} else {
			document.body.classList.remove('dsgo-draft-mode-active');
		}

		return () => {
			document.body.classList.remove('dsgo-draft-mode-active');
		};
	}, [isLoading, status?.is_draft, postType]);

	// Intercept the native Publish button to use our custom merge API.
	useEffect(() => {
		// Only intercept when this is a draft of another page.
		if (isLoading || !status?.is_draft || postType !== 'page') {
			return;
		}

		// Find and intercept the Publish button.
		const interceptPublish = () => {
			// Selectors for the Publish button in different WordPress/Gutenberg versions.
			const selectors = [
				'.editor-post-publish-button__button',
				'.editor-post-publish-button',
				'button.editor-post-publish-button',
			];

			let publishButton = null;
			for (const selector of selectors) {
				publishButton = document.querySelector(selector);
				if (publishButton) {
					break;
				}
			}

			if (!publishButton) {
				return;
			}

			// Remove any existing listener.
			if (publishInterceptRef.current) {
				publishInterceptRef.current.button?.removeEventListener(
					'click',
					publishInterceptRef.current.handler,
					true
				);
			}

			// Store reference to button and handler for cleanup.
			publishInterceptRef.current = {
				button: publishButton,
				handler: handlePublishDraft,
			};

			// Add our intercept listener with capture phase to run before WordPress.
			publishButton.addEventListener('click', handlePublishDraft, true);
		};

		// Initial setup.
		interceptPublish();

		// Re-check periodically as WordPress may re-render the button.
		const interval = setInterval(interceptPublish, 1000);

		return () => {
			clearInterval(interval);
			if (publishInterceptRef.current) {
				publishInterceptRef.current.button?.removeEventListener(
					'click',
					publishInterceptRef.current.handler,
					true
				);
				publishInterceptRef.current = null;
			}
		};
	}, [isLoading, status?.is_draft, postType, handlePublishDraft]);

	// Handle save draft action (for when editing a draft).
	const handleSaveDraft = () => {
		savePost();
	};

	// Handle create draft action (for published pages).
	const handleCreateDraft = async () => {
		if (isCreatingDraft) {
			return;
		}

		setIsCreatingDraft(true);

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
			// If draft already exists, redirect to it.
			if (err.data?.draft_id) {
				// Prefer API-provided edit_url, fall back to constructing from current admin path.
				const draftEditUrl =
					err.data.edit_url ||
					`${window.location.origin}${
						window.location.pathname.split('/wp-admin/')[0]
					}/wp-admin/post.php?post=${err.data.draft_id}&action=edit`;

				// Clear dirty state before navigating.
				clearDirtyState();
				window.location.href = draftEditUrl;
				return;
			}

			setErrorMessage(
				err.message || __('Failed to create draft.', 'designsetgo')
			);
			setShowErrorModal(true);
			setIsCreatingDraft(false);
		}
	};

	// Don't render if not a page or still loading.
	if (postType !== 'page' || isLoading) {
		return null;
	}

	// Don't render if draft mode is disabled.
	if (status?.settings?.enabled === false) {
		return null;
	}

	// Check if we can render header controls (needs container).
	const canRenderHeaderControls = !!headerContainer;

	// Determine what to render based on page state.
	let headerControl = null;

	if (status?.is_draft) {
		// State 1: This IS a draft - show "Save Draft" link when there are edits.
		if (hasEdits) {
			headerControl = (
				<Button
					variant="tertiary"
					onClick={handleSaveDraft}
					disabled={isSavingPost}
					className="dsgo-draft-mode-save-draft"
				>
					{isSavingPost
						? __('Saving…', 'designsetgo')
						: __('Save Draft', 'designsetgo')}
				</Button>
			);
		}
	} else if (postStatus === 'publish') {
		// State 2 or 3: Published page - show "Edit Draft" or "Create Draft".
		if (status?.has_draft && status?.draft_edit_url) {
			// Has existing draft - show "Edit Draft" link.
			headerControl = (
				<Button
					variant="tertiary"
					href={status.draft_edit_url}
					className="dsgo-draft-mode-save-draft"
				>
					{__('Edit Draft', 'designsetgo')}
				</Button>
			);
		} else {
			// No draft - show "Create Draft" link.
			headerControl = (
				<Button
					variant="tertiary"
					onClick={handleCreateDraft}
					disabled={isCreatingDraft}
					isBusy={isCreatingDraft}
					className="dsgo-draft-mode-save-draft"
				>
					{isCreatingDraft
						? __('Creating…', 'designsetgo')
						: __('Create Draft', 'designsetgo')}
				</Button>
			);
		}
	}

	// Render the bottom banner for drafts.
	const bottomBanner = status?.is_draft ? (
		<div className="dsgo-draft-mode-banner">
			<span className="dsgo-draft-mode-banner__icon">&#9998;</span>
			<span className="dsgo-draft-mode-banner__text">
				{__('You are editing a draft version.', 'designsetgo')}
				{status.original_title && (
					<>
						{' '}
						<strong>{status.original_title}</strong>
					</>
				)}
			</span>
			{status.original_view_url && (
				<a
					href={status.original_view_url}
					target="_blank"
					rel="noopener noreferrer"
					className="dsgo-draft-mode-banner__link"
					aria-label={__(
						'View live page (opens in new tab)',
						'designsetgo'
					)}
				>
					{__('View live page', 'designsetgo')}
				</a>
			)}
		</div>
	) : null;

	// Don't render if there's nothing to show.
	if (!headerControl && !bottomBanner) {
		return null;
	}

	return (
		<>
			{headerControl &&
				canRenderHeaderControls &&
				createPortal(headerControl, headerContainer)}
			{bottomBanner && createPortal(bottomBanner, document.body)}

			{/* Error modal */}
			{showErrorModal && (
				<Modal
					title={__('Error', 'designsetgo')}
					onRequestClose={() => setShowErrorModal(false)}
					size="small"
				>
					<Flex direction="column" gap={4}>
						<FlexItem>
							<p style={{ margin: 0 }}>{errorMessage}</p>
						</FlexItem>
						<Flex justify="flex-end">
							<FlexItem>
								<Button
									variant="primary"
									onClick={() => setShowErrorModal(false)}
								>
									{__('OK', 'designsetgo')}
								</Button>
							</FlexItem>
						</Flex>
					</Flex>
				</Modal>
			)}
		</>
	);
}
