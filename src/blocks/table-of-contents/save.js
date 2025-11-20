import { useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function Save({ attributes }) {
	const {
		uniqueId,
		includeH2,
		includeH3,
		includeH4,
		includeH5,
		includeH6,
		displayMode,
		listStyle,
		showTitle,
		titleText,
		scrollSmooth,
		scrollOffset,
		linkColor,
		activeLinkColor,
	} = attributes;

	// Build heading levels string for data attribute
	const headingLevels = [];
	if (includeH2) {
		headingLevels.push('h2');
	}
	if (includeH3) {
		headingLevels.push('h3');
	}
	if (includeH4) {
		headingLevels.push('h4');
	}
	if (includeH5) {
		headingLevels.push('h5');
	}
	if (includeH6) {
		headingLevels.push('h6');
	}

	// Styles using CSS custom properties (only set if user has chosen colors)
	const customStyles = {};
	if (linkColor) {
		customStyles['--dsgo-toc-link-color'] = linkColor;
	}
	if (activeLinkColor) {
		customStyles['--dsgo-toc-active-link-color'] = activeLinkColor;
	}

	const ListTag = listStyle === 'ordered' ? 'ol' : 'ul';

	const blockProps = useBlockProps.save({
		className: classnames('dsgo-table-of-contents', {
			'dsgo-table-of-contents--hierarchical':
				displayMode === 'hierarchical',
			'dsgo-table-of-contents--flat': displayMode === 'flat',
			'dsgo-table-of-contents--ordered': listStyle === 'ordered',
			'dsgo-table-of-contents--smooth': scrollSmooth,
		}),
		style: customStyles,
		'data-unique-id': uniqueId,
		'data-heading-levels': headingLevels.join(','),
		'data-display-mode': displayMode,
		'data-scroll-smooth': scrollSmooth,
		'data-scroll-offset': scrollOffset,
	});

	return (
		<div {...blockProps}>
			<div className="dsgo-table-of-contents__content">
				{showTitle && (
					<div className="dsgo-table-of-contents__title">
						{titleText}
					</div>
				)}
				{/* Placeholder - frontend JS will populate this */}
				<ListTag className="dsgo-table-of-contents__list" />
			</div>
		</div>
	);
}
