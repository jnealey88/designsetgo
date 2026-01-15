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
	const [error, setError] = useState(null);

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

				// Set initial selection
				// If initialRevisionId is provided, use it as "to" and previous as "from"
				if (initialRevisionId) {
					const toIndex = data.revisions.findIndex(
						(r) => r.id === parseInt(initialRevisionId, 10)
					);
					if (toIndex !== -1 && toIndex < data.revisions.length - 1) {
						setToRevision(data.revisions[toIndex]);
						setFromRevision(data.revisions[toIndex + 1]);
					} else {
						// Default to comparing most recent two
						setToRevision(data.revisions[0]);
						setFromRevision(data.revisions[1]);
					}
				} else {
					// Default to comparing most recent two
					setToRevision(data.revisions[0]);
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
		setFromRevision(revision);
	};

	const handleToChange = (revision) => {
		setToRevision(revision);
	};

	// Back to editor
	const handleBackToEditor = () => {
		const { editUrl } = window.designSetGoRevisions || {};
		if (editUrl) {
			window.location.href = editUrl;
		}
	};

	// Get restore URL for a revision
	const getRestoreUrl = (revision) => {
		if (!revision || revision.is_current) {
			return null;
		}
		const { restoreBaseUrl } = window.designSetGoRevisions || {};
		if (!restoreBaseUrl) {
			return null;
		}
		return `${restoreBaseUrl}&revision=${revision.id}`;
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

	const restoreUrl = getRestoreUrl(fromRevision);

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
					{restoreUrl && (
						<Button variant="primary" href={restoreUrl}>
							{__('Restore This Revision', 'designsetgo')}
						</Button>
					)}
				</div>
			</div>

			<RevisionSlider
				revisions={revisions}
				fromRevision={fromRevision}
				toRevision={toRevision}
				onFromChange={handleFromChange}
				onToChange={handleToChange}
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
