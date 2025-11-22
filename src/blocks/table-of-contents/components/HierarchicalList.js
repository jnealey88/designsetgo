/**
 * Hierarchical List Component
 *
 * Renders a hierarchical (nested) list structure from headings.
 */

/**
 * Recursively render hierarchical structure
 *
 * @param {Array}  headings - Array of heading objects
 * @param {number} minLevel - Current minimum heading level
 * @param {string} ListTag  - The list tag to use ('ul' or 'ol')
 * @return {Array} Array of React elements
 */
export function renderHierarchical(headings, minLevel, ListTag) {
	const items = [];
	let i = 0;

	while (i < headings.length) {
		const heading = headings[i];

		if (heading.level === minLevel) {
			const children = [];
			let j = i + 1;

			// Collect children
			while (j < headings.length && headings[j].level > minLevel) {
				children.push(headings[j]);
				j++;
			}

			items.push(
				<li
					key={i}
					className={`dsgo-table-of-contents__item dsgo-table-of-contents__item--level-${heading.level}`}
				>
					<a
						href={`#${heading.id}`}
						className="dsgo-table-of-contents__link"
					>
						{heading.text}
					</a>
					{children.length > 0 && (
						<ListTag className="dsgo-table-of-contents__sublist">
							{renderHierarchical(
								children,
								minLevel + 1,
								ListTag
							)}
						</ListTag>
					)}
				</li>
			);

			i = j;
		} else {
			i++;
		}
	}

	return items;
}
