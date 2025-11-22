/**
 * Hierarchy building utilities for Table of Contents block
 */

/**
 * Build a hierarchical structure of list items from headings.
 *
 * @param {Array}       headings       - Array of heading objects
 * @param {number}      currentLevel   - Current heading level to process
 * @param {Function}    createListItem - Function to create a list item element
 * @param {HTMLElement} listElement    - The list element to determine ordered/unordered
 * @return {Array} Array of list item elements
 */
export function buildHierarchy(
	headings,
	currentLevel,
	createListItem,
	listElement
) {
	const items = [];
	let i = 0;

	while (i < headings.length) {
		const heading = headings[i];

		if (heading.level === currentLevel) {
			const li = createListItem(heading);

			// Collect children
			const children = [];
			let j = i + 1;

			while (j < headings.length && headings[j].level > currentLevel) {
				children.push(headings[j]);
				j++;
			}

			// Add nested list if there are children
			if (children.length > 0) {
				const isOrdered = listElement.tagName.toLowerCase() === 'ol';
				const subList = document.createElement(isOrdered ? 'ol' : 'ul');
				subList.className = 'dsgo-table-of-contents__sublist';

				const childItems = buildHierarchy(
					children,
					currentLevel + 1,
					createListItem,
					listElement
				);
				childItems.forEach((child) => subList.appendChild(child));

				li.appendChild(subList);
			}

			items.push(li);
			i = j;
		} else if (heading.level < currentLevel) {
			// This heading belongs to a parent level
			break;
		} else {
			// Skip headings at deeper levels (they'll be handled as children)
			i++;
		}
	}

	return items;
}
