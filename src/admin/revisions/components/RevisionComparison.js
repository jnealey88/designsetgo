/**
 * Revision Comparison Component
 *
 * Main container for visual revision comparison.
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { Spinner, Button } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import RevisionSlider from './RevisionSlider';
import RevisionPreview from './RevisionPreview';
import DiffSummary from './DiffSummary';

/**
 * RevisionComparison Component
 *
 * @param {Object} props               Component props.
 * @param {number} props.postId        Post ID to compare revisions for.
 * @param {number} props.initialRevisionId Initial revision ID from URL.
 */
const RevisionComparison = ({ postId, initialRevisionId }) => {
	const [revisions, setRevisions] = useState([]);
	const [fromRevision, setFromRevision] = useState(null);
	const [toRevision, setToRevision] = useState(null);
	const [diffData, setDiffData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [diffLoading, setDiffLoading] = useState(false);
	const [restoring, setRestoring] = useState(false);
	const [error, setError] = useState(null);
	const [hasUserInteracted, setHasUserInteracted] = useState(false);

	// Fetch revisions list on mount
	useEffect(() => {
		if (!postId) {
			setError(__('No post ID provided.', 'designsetgo'));
			setLoading(false);
			return;
		}

		apiFetch({ path: `/designsetgo/v1/revisions/${postId}` })
			.then((data) => {
				if (!data.revisions || data.revisions.length < 2) {
					setError(
						__(
							'This post does not have enough revisions to compare.',
							'designsetgo'
						)
					);
					setLoading(false);
					return;
				}

				setRevisions(data.revisions);

				// Set initial selection - always default to comparing the newest revision.
				// The "to" revision should always be the newest (index 0).
				// If initialRevisionId is provided, use it as the "from" revision for context.
				setToRevision(data.revisions[0]);

				if (initialRevisionId) {
					const fromIndex = data.revisions.findIndex(
						(r) => r.id === parseInt(initialRevisionId, 10)
					);
					// If the initialRevisionId is found and it's not the newest, use it as "from".
					if (fromIndex > 0) {
						setFromRevision(data.revisions[fromIndex]);
					} else {
						// Default "from" to the second newest revision.
						setFromRevision(data.revisions[1]);
					}
				} else {
					// Default to comparing the two most recent revisions.
					setFromRevision(data.revisions[1]);
				}

				setLoading(false);
			})
			.catch((err) => {
				setError(
					err.message ||
						__('Failed to load revisions.', 'designsetgo')
				);
				setLoading(false);
			});
	}, [postId, initialRevisionId]);

	// Fetch diff when selections change
	const fetchDiff = useCallback(() => {
		if (!fromRevision || !toRevision) {
			return;
		}

		setDiffLoading(true);

		apiFetch({
			path: `/designsetgo/v1/revisions/diff/${fromRevision.id}/${toRevision.id}`,
		})
			.then((data) => {
				setDiffData(data);
				setDiffLoading(false);
			})
			.catch(() => {
				setDiffData(null);
				setDiffLoading(false);
			});
	}, [fromRevision, toRevision]);

	useEffect(() => {
		fetchDiff();
	}, [fetchDiff]);

	// Handle revision selection changes
	const handleFromChange = (revision) => {
		setHasUserInteracted(true);
		setFromRevision(revision);
	};

	// Update URL and header links when revision selection changes (only after user interaction)
	useEffect(() => {
		if (!fromRevision || !postId) {
			return;
		}

		const { adminUrl } = window.designSetGoRevisions || {};
		if (!adminUrl) {
			return;
		}

		// Only update URL after user has interacted with the slider
		// This prevents overwriting the initial revision from the URL
		if (hasUserInteracted) {
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.set('revision', fromRevision.id);
			window.history.replaceState({}, '', newUrl.toString());
		}

		// Always update the "Code Changes" link in the header to preserve selected revision
		const codeChangesLink = document.querySelector(
			'.dsgo-revisions-tabs a[href*="revision.php"]'
		);
		if (codeChangesLink) {
			const codeUrl = new URL(adminUrl + 'revision.php');
			codeUrl.searchParams.set('revision', fromRevision.id);
			codeUrl.searchParams.set('view', 'standard');
			codeChangesLink.href = codeUrl.toString();
		}
	}, [fromRevision, postId, hasUserInteracted]);

	// Back to editor
	const handleBackToEditor = () => {
		const { editUrl } = window.designSetGoRevisions || {};
		if (editUrl) {
			window.location.href = editUrl;
		}
	};

	// Check if a revision can be restored
	const canRestore = (revision) => {
		return revision && !revision.is_current;
	};

	// Handle restore button click
	const handleRestore = async () => {
		if (!fromRevision || fromRevision.is_current || restoring) {
			return;
		}

		setRestoring(true);

		try {
			const response = await apiFetch({
				path: `/designsetgo/v1/revisions/restore/${fromRevision.id}`,
				method: 'POST',
			});

			if (response.success && response.edit_url) {
				// Redirect to the editor
				window.location.href = response.edit_url;
			}
		} catch (err) {
			setError(err.message || __('Failed to restore revision.', 'designsetgo'));
			setRestoring(false);
		}
	};

	// Loading state
	if (loading) {
		return (
			<div className="dsgo-revision-comparison__loading">
				<Spinner />
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="dsgo-revision-comparison__error">
				<h3>{__('Unable to Compare Revisions', 'designsetgo')}</h3>
				<p>{error}</p>
				<Button variant="secondary" onClick={handleBackToEditor}>
					{__('Back to Editor', 'designsetgo')}
				</Button>
			</div>
		);
	}

	// No revisions state
	if (revisions.length < 2) {
		return (
			<div className="dsgo-revision-comparison__no-revisions">
				<p>
					{__(
						'This post does not have any revisions to compare yet.',
						'designsetgo'
					)}
				</p>
				<Button variant="secondary" onClick={handleBackToEditor}>
					{__('Back to Editor', 'designsetgo')}
				</Button>
			</div>
		);
	}

	return (
		<div className="dsgo-revision-comparison">
			{/* Top action bar */}
			<div className="dsgo-revision-actions dsgo-revision-actions--top">
				<div className="dsgo-revision-actions__left">
					<Button
						variant="secondary"
						onClick={handleBackToEditor}
						icon="arrow-left-alt"
					>
						{__('Back to Editor', 'designsetgo')}
					</Button>
				</div>
				<div className="dsgo-revision-actions__right">
					{canRestore(fromRevision) && (
						<Button
							variant="primary"
							onClick={handleRestore}
							isBusy={restoring}
							disabled={restoring}
						>
							{restoring
								? __('Restoring…', 'designsetgo')
								: __('Restore This Revision', 'designsetgo')}
						</Button>
					)}
				</div>
			</div>

			<RevisionSlider
				revisions={revisions}
				fromRevision={fromRevision}
				toRevision={toRevision}
				onFromChange={handleFromChange}
			/>

			{diffData && !diffLoading && <DiffSummary diffData={diffData} />}

			<div className="dsgo-revision-panels">
				<RevisionPreview
					revision={fromRevision}
					label={__('Before', 'designsetgo')}
					diffData={diffData}
					diffType="from"
					postId={postId}
				/>
				<RevisionPreview
					revision={toRevision}
					label={__('After', 'designsetgo')}
					diffData={diffData}
					diffType="to"
					postId={postId}
				/>
			</div>
		</div>
	);
};

export default RevisionComparison;
