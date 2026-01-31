/**
 * Revision Preview Component
 *
 * Displays a rendered preview of a revision in a sandboxed iframe.
 *
 * ## Iframe Sandbox Restrictions
 *
 * The preview iframe uses `sandbox="allow-same-origin"` which enables:
 * - JavaScript access to the iframe's document (required for diff highlighting)
 * - CSS styling from parent stylesheets
 *
 * The sandbox explicitly DISABLES:
 * - `allow-scripts`: No JavaScript execution in preview content (security)
 * - `allow-forms`: No form submissions
 * - `allow-popups`: No popup windows
 * - `allow-top-navigation`: Cannot navigate the parent window
 *
 * This means:
 * - Interactive blocks (accordions, tabs) will NOT function in previews
 * - Form blocks will display but not submit
 * - External script dependencies will not load
 * - This is intentional for security - previews show static visual state only
 *
 * @package
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
/**
 * Escape HTML special characters for safe attribute insertion
 *
 * @param {string} str String to escape.
 * @return {string} Escaped string.
 */
const escapeAttr = (str) => {
	return str
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
};

const buildIframeDocument = (content, styles) => {
	const styleLinks = styles
		.map((url) => `<link rel="stylesheet" href="${escapeAttr(url)}" />`)
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
		/* Highlight style for changed blocks */
		[data-dsgo-block-index][data-dsgo-diff="changed"] {
			outline: 3px solid #007cba;
			outline-offset: 2px;
			position: relative;
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
		// Determine which index to use based on the panel type.
		const index = diffType === 'from' ? change.from_index : change.to_index;

		// Skip if this change doesn't apply to this panel.
		if (index === undefined) {
			return;
		}

		const element = iframeDoc.querySelector(
			`[data-dsgo-block-index="${index}"]`
		);

		if (element) {
			element.setAttribute('data-dsgo-diff', 'changed');
		}
	});
};

/**
 * RevisionPreview Component
 *
 * @param {Object} props          Component props.
 * @param {Object} props.revision Revision object.
 * @param {string} props.label    Label for this preview (Before/After).
 * @param {Object} props.diffData Diff data from API.
 * @param {string} props.diffType Either "from" or "to".
 */
const RevisionPreview = ({ revision, label, diffData, diffType }) => {
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
				{loading && (
					<div className="dsgo-revision-preview__loading">
						<Spinner />
					</div>
				)}
				{!loading && error && (
					<div className="dsgo-revision-preview__error">{error}</div>
				)}
				{!loading && !error && (
					/*
					 * Sandboxed iframe for secure revision preview.
					 * Uses allow-same-origin for diff highlighting access.
					 * Scripts disabled for security - interactive blocks won't function.
					 * See component docblock for full sandbox documentation.
					 */
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
