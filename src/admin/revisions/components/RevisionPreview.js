/**
 * Revision Preview Component
 *
 * Displays a rendered preview of a revision.
 *
 * @package DesignSetGo
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import RevisionMeta from './RevisionMeta';

/**
 * Build the iframe document HTML
 *
 * @param {string} content Rendered block content.
 * @param {Array}  styles  Array of stylesheet URLs.
 * @return {string} Complete HTML document.
 */
const buildIframeDocument = (content, styles) => {
	const styleLinks = styles
		.map((url) => `<link rel="stylesheet" href="${url}" />`)
		.join('\n');

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	${styleLinks}
	<style>
		body {
			margin: 0;
			padding: 20px;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
			background: #fff;
		}
		/* Highlight styles */
		[data-dsgo-block-index][data-dsgo-diff="added"] {
			outline: 3px solid #28a745;
			outline-offset: 2px;
			position: relative;
		}
		[data-dsgo-block-index][data-dsgo-diff="removed"] {
			outline: 3px solid #dc3545;
			outline-offset: 2px;
			position: relative;
			opacity: 0.7;
		}
		[data-dsgo-block-index][data-dsgo-diff="modified"] {
			outline: 3px solid #ffc107;
			outline-offset: 2px;
			position: relative;
		}
		[data-dsgo-block-index][data-dsgo-diff]::before {
			content: attr(data-dsgo-diff-label);
			position: absolute;
			top: -24px;
			left: 0;
			padding: 2px 8px;
			font-size: 11px;
			font-weight: 600;
			border-radius: 3px;
			text-transform: capitalize;
			z-index: 1000;
		}
		[data-dsgo-block-index][data-dsgo-diff="added"]::before {
			background: #28a745;
			color: #fff;
		}
		[data-dsgo-block-index][data-dsgo-diff="removed"]::before {
			background: #dc3545;
			color: #fff;
		}
		[data-dsgo-block-index][data-dsgo-diff="modified"]::before {
			background: #ffc107;
			color: #212529;
		}
	</style>
</head>
<body>
	${content}
</body>
</html>
	`.trim();
};

/**
 * Apply diff highlights to iframe content
 *
 * @param {Document} iframeDoc Iframe document.
 * @param {Object}   diffData  Diff data from API.
 * @param {string}   diffType  Either "from" or "to".
 */
const applyDiffHighlights = (iframeDoc, diffData, diffType) => {
	if (!diffData?.changes) {
		return;
	}

	diffData.changes.forEach((change) => {
		let index;
		let diffClass;
		let label;

		if (change.type === 'added' && diffType === 'to') {
			index = change.to_index;
			diffClass = 'added';
			label = __('Added', 'designsetgo');
		} else if (change.type === 'removed' && diffType === 'from') {
			index = change.from_index;
			diffClass = 'removed';
			label = __('Removed', 'designsetgo');
		} else if (change.type === 'modified') {
			index = diffType === 'from' ? change.from_index : change.to_index;
			diffClass = 'modified';
			label = __('Modified', 'designsetgo');
		} else {
			return;
		}

		const element = iframeDoc.querySelector(
			`[data-dsgo-block-index="${index}"]`
		);

		if (element) {
			element.setAttribute('data-dsgo-diff', diffClass);
			element.setAttribute('data-dsgo-diff-label', label);
		}
	});
};

/**
 * RevisionPreview Component
 *
 * @param {Object} props           Component props.
 * @param {Object} props.revision  Revision object.
 * @param {string} props.label     Label for this preview (Before/After).
 * @param {Object} props.diffData  Diff data from API.
 * @param {string} props.diffType  Either "from" or "to".
 * @param {number} props.postId    Post ID.
 */
const RevisionPreview = ({ revision, label, diffData, diffType, postId }) => {
	const iframeRef = useRef(null);
	const [renderedContent, setRenderedContent] = useState(null);
	const [styles, setStyles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch rendered content when revision changes
	useEffect(() => {
		if (!revision) {
			return;
		}

		setLoading(true);
		setError(null);

		apiFetch({ path: `/designsetgo/v1/revisions/render/${revision.id}` })
			.then((data) => {
				setRenderedContent(data.html);
				setStyles(data.styles || []);
				setLoading(false);
			})
			.catch((err) => {
				setError(
					err.message ||
						__('Failed to render revision.', 'designsetgo')
				);
				setLoading(false);
			});
	}, [revision]);

	// Apply diff highlights when content or diff data changes
	const applyHighlights = useCallback(() => {
		if (!iframeRef.current || !renderedContent || !diffData) {
			return;
		}

		const iframe = iframeRef.current;
		const iframeDoc =
			iframe.contentDocument || iframe.contentWindow?.document;

		if (iframeDoc) {
			applyDiffHighlights(iframeDoc, diffData, diffType);
		}
	}, [renderedContent, diffData, diffType]);

	// Handle iframe load
	const handleIframeLoad = () => {
		applyHighlights();
	};

	// Re-apply highlights when diffData changes
	useEffect(() => {
		applyHighlights();
	}, [applyHighlights]);

	const panelClass = `dsgo-revision-preview dsgo-revision-preview--${diffType}`;

	return (
		<div className={panelClass}>
			<div className="dsgo-revision-preview__header">
				<span className="dsgo-revision-preview__label">{label}</span>
				{revision && <RevisionMeta revision={revision} />}
			</div>
			<div className="dsgo-revision-preview__content">
				{loading ? (
					<div className="dsgo-revision-preview__loading">
						<Spinner />
					</div>
				) : error ? (
					<div className="dsgo-revision-preview__error">{error}</div>
				) : (
					<iframe
						ref={iframeRef}
						className="dsgo-revision-preview__iframe"
						srcDoc={buildIframeDocument(renderedContent, styles)}
						title={label}
						onLoad={handleIframeLoad}
						sandbox="allow-same-origin"
					/>
				)}
			</div>
		</div>
	);
};

export default RevisionPreview;
