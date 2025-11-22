/**
 * Custom hook for scanning headings in the editor
 */
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Scan the editor for headings based on the selected levels
 *
 * @param {Object} levelFlags - Object with includeH2-H6 boolean flags
 * @return {Array} Array of heading objects
 */
export function useHeadingScanner(levelFlags) {
	const [previewHeadings, setPreviewHeadings] = useState([]);

	// Subscribe to block changes in the editor
	const { blocks } = useSelect(
		(select) => ({
			blocks: select(blockEditorStore).getBlocks(),
		}),
		[]
	);

	useEffect(() => {
		const scanEditorHeadings = () => {
			try {
				const headings = [];
				const levels = [];

				// Build levels array from flags
				if (levelFlags.includeH2) {
					levels.push('h2');
				}
				if (levelFlags.includeH3) {
					levels.push('h3');
				}
				if (levelFlags.includeH4) {
					levels.push('h4');
				}
				if (levelFlags.includeH5) {
					levels.push('h5');
				}
				if (levelFlags.includeH6) {
					levels.push('h6');
				}

				if (levels.length === 0) {
					setPreviewHeadings([]);
					return;
				}

				// Search in editor content
				const editorContent = document.querySelector(
					'.editor-styles-wrapper'
				);
				if (!editorContent) {
					setPreviewHeadings([]);
					return;
				}

				// Create a single selector for all heading levels
				const selector = levels.join(', ');
				editorContent
					.querySelectorAll(selector)
					.forEach((heading, index) => {
						// Skip if this heading is inside a TOC block
						if (heading.closest('.dsgo-table-of-contents')) {
							return;
						}

						const text = heading.textContent?.trim();
						if (!text) {
							return;
						}

						// Use existing ID or generate a preview one
						let id = heading.id;
						if (!id) {
							id = `preview-${text
								.toLowerCase()
								.replace(/[^a-z0-9]+/g, '-')
								.substring(0, 30)}-${index}`;
						}

						headings.push({
							level: parseInt(heading.tagName.replace('H', '')),
							text,
							id,
						});
					});

				setPreviewHeadings(headings);
			} catch (error) {
				console.error('[DSG TOC] Error scanning headings:', error);
				setPreviewHeadings([]);
			}
		};

		scanEditorHeadings();
	}, [
		blocks,
		levelFlags.includeH2,
		levelFlags.includeH3,
		levelFlags.includeH4,
		levelFlags.includeH5,
		levelFlags.includeH6,
	]);

	return previewHeadings;
}
