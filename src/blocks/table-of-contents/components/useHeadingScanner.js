/**
 * Custom hook for scanning headings in the editor.
 *
 * Reads heading data directly from the block store rather than querying
 * the DOM, which avoids issues with the iframe-based editor in WP 6.x+.
 */
/* global DOMParser */
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Strip HTML tags from a rich-text content string using a DOM parser,
 * which safely handles malformed or nested markup (e.g. `<script<script>>`).
 *
 * @param {string} html - Raw rich-text HTML string
 * @return {string} Plain text
 */
const stripHTMLParser = new DOMParser();
function stripHTML(html) {
	if (!html) {
		return '';
	}
	return (
		stripHTMLParser.parseFromString(html, 'text/html').body.textContent ||
		''
	).trim();
}

/**
 * Recursively collect core/heading blocks from a block tree.
 *
 * @param {Array} blocks        - Top-level (or inner) blocks array
 * @param {Set}   enabledLevels - Set of enabled heading level numbers (2–6)
 * @param {Array} result        - Accumulator array
 * @return {Array} Flat list of heading objects { level, text, id }
 */
function collectHeadings(blocks, enabledLevels, result = []) {
	for (const block of blocks) {
		if (
			block.name === 'core/heading' &&
			enabledLevels.has(block.attributes?.level)
		) {
			const text = stripHTML(block.attributes?.content);
			if (text) {
				const id =
					block.attributes?.anchor ||
					`preview-${text
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, '-')
						.substring(0, 30)}-${result.length}`;
				result.push({
					level: block.attributes.level,
					text,
					id,
				});
			}
		}

		// Recurse into nested blocks (groups, columns, etc.)
		if (block.innerBlocks?.length) {
			collectHeadings(block.innerBlocks, enabledLevels, result);
		}
	}
	return result;
}

/**
 * Scan the editor for headings based on the selected levels.
 *
 * @param {Object} levelFlags - Object with includeH2-H6 boolean flags
 * @return {Array} Array of heading objects
 */
export function useHeadingScanner(levelFlags) {
	// Subscribe to block changes in the editor
	const blocks = useSelect(
		(select) => select(blockEditorStore).getBlocks(),
		[]
	);

	const headings = useMemo(() => {
		const enabledLevels = new Set();
		if (levelFlags.includeH2) {
			enabledLevels.add(2);
		}
		if (levelFlags.includeH3) {
			enabledLevels.add(3);
		}
		if (levelFlags.includeH4) {
			enabledLevels.add(4);
		}
		if (levelFlags.includeH5) {
			enabledLevels.add(5);
		}
		if (levelFlags.includeH6) {
			enabledLevels.add(6);
		}

		if (enabledLevels.size === 0) {
			return [];
		}

		return collectHeadings(blocks, enabledLevels);
	}, [
		blocks,
		levelFlags.includeH2,
		levelFlags.includeH3,
		levelFlags.includeH4,
		levelFlags.includeH5,
		levelFlags.includeH6,
	]);

	return headings;
}
