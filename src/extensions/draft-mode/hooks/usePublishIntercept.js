/**
 * Publish Button Intercept Hook
 *
 * Intercepts the native WordPress Publish button when editing a draft
 * to use the custom publishDraft() API instead.
 *
 * @package
 * @since 1.4.0
 */

/* global MutationObserver */

import { useEffect, useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { publishDraft } from '../api';
import { clearDirtyState } from '../utils';

/**
 * Custom hook to intercept the Publish button
 *
 * @param {number}   postId  The current post ID.
 * @param {boolean}  isDraft Whether the current post is a draft.
 * @param {Function} onError Callback when an error occurs.
 * @return {Object} State object with isPublishing flag.
 */
export function usePublishIntercept(postId, isDraft, onError) {
	const publishInterceptRef = useRef(null);
	const isPublishingRef = useRef(false);
	const handlerRef = useRef(null);

	const { hasEdits } = useSelect((select) => {
		const editor = select('core/editor');
		return {
			hasEdits: editor.isEditedPostDirty(),
		};
	}, []);

	const { savePost } = useDispatch('core/editor');

	// Handle custom publish (merge draft to original).
	const handlePublishDraft = useCallback(
		async (e) => {
			// Prevent the native WordPress publish action.
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			if (isPublishingRef.current) {
				return;
			}

			isPublishingRef.current = true;

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
				const errorMessage =
					err.message ||
					__('Failed to publish changes.', 'designsetgo');
				onError?.(errorMessage);
				isPublishingRef.current = false;
			}
		},
		[postId, hasEdits, savePost, onError]
	);

	// Update the handler ref whenever handlePublishDraft changes.
	handlerRef.current = handlePublishDraft;

	// Create a stable wrapper that calls the current handler.
	const stableHandler = useCallback((e) => {
		handlerRef.current?.(e);
	}, []);

	// Intercept the native Publish button to use our custom merge API.
	useEffect(() => {
		// Only intercept when this is a draft of another page.
		if (!isDraft) {
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

			// If we're already attached to this button, don't re-attach.
			if (publishInterceptRef.current?.button === publishButton) {
				return;
			}

			// Remove any existing listener from previous button.
			if (publishInterceptRef.current?.button) {
				publishInterceptRef.current.button.removeEventListener(
					'click',
					stableHandler,
					true
				);
			}

			// Store reference to button for cleanup.
			publishInterceptRef.current = {
				button: publishButton,
			};

			// Add our intercept listener with capture phase to run before WordPress.
			publishButton.addEventListener('click', stableHandler, true);
		};

		// Initial setup.
		interceptPublish();

		// Use MutationObserver to watch for DOM changes instead of polling.
		// WordPress may re-render the button when switching between visual/code editors,
		// when the post status changes, or during other editor state updates.
		const editorHeader =
			document.querySelector('.editor-header') || document.body;

		const observer = new MutationObserver(() => {
			interceptPublish();
		});

		observer.observe(editorHeader, {
			childList: true,
			subtree: true,
		});

		return () => {
			observer.disconnect();
			if (publishInterceptRef.current?.button) {
				publishInterceptRef.current.button.removeEventListener(
					'click',
					stableHandler,
					true
				);
				publishInterceptRef.current = null;
			}
		};
	}, [isDraft, stableHandler]);

	return {
		isPublishing: isPublishingRef.current,
	};
}
