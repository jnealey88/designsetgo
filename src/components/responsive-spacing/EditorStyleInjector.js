/**
 * Editor Style Injector Component
 *
 * Injects responsive spacing CSS into the editor for live preview.
 * Updates CSS when attributes change and cleans up on unmount.
 *
 * @package
 * @since 1.5.0
 */

import { useEffect } from '@wordpress/element';
import { buildResponsiveSpacingCSS } from '../../utils/responsive-spacing';

/**
 * Inject responsive spacing styles into the editor.
 *
 * @param {Object}           props                   Component props
 * @param {string}           props.blockStyleId      Unique block style ID
 * @param {Object|undefined} props.desktopSpacing    Desktop spacing from style.spacing
 * @param {Object|undefined} props.responsiveSpacing Responsive overrides
 * @return {null} Renders nothing, only injects styles
 */
export default function EditorStyleInjector({
	blockStyleId,
	desktopSpacing,
	responsiveSpacing,
}) {
	useEffect(() => {
		if (!blockStyleId || !responsiveSpacing) {
			return;
		}

		const css = buildResponsiveSpacingCSS(
			blockStyleId,
			desktopSpacing,
			responsiveSpacing
		);

		if (!css) {
			return;
		}

		const styleId = `dsgo-responsive-spacing-${blockStyleId}`;

		// Try to find an existing style element
		let styleEl = document.getElementById(styleId);
		if (!styleEl) {
			styleEl = document.createElement('style');
			styleEl.id = styleId;
			document.head.appendChild(styleEl);
		}

		styleEl.textContent = css;

		// Also inject into the editor iframe if it exists
		const editorCanvas = document.querySelector(
			'iframe[name="editor-canvas"]'
		);
		if (editorCanvas?.contentDocument) {
			let iframeStyleEl =
				editorCanvas.contentDocument.getElementById(styleId);
			if (!iframeStyleEl) {
				iframeStyleEl =
					editorCanvas.contentDocument.createElement('style');
				iframeStyleEl.id = styleId;
				editorCanvas.contentDocument.head.appendChild(iframeStyleEl);
			}
			iframeStyleEl.textContent = css;
		}

		return () => {
			// Cleanup on unmount
			const el = document.getElementById(styleId);
			if (el) {
				el.remove();
			}
			const canvas = document.querySelector(
				'iframe[name="editor-canvas"]'
			);
			if (canvas?.contentDocument) {
				const iframeEl = canvas.contentDocument.getElementById(styleId);
				if (iframeEl) {
					iframeEl.remove();
				}
			}
		};
	}, [blockStyleId, desktopSpacing, responsiveSpacing]);

	return null;
}
