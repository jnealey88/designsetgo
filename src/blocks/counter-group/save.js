/**
 * Counter Group Block - Save Function
 *
 * WordPress Best Practice Approach:
 * - Uses useInnerBlocksProps.save() for proper inner blocks integration
 * - Declarative style application (matches edit.js exactly)
 * - CSS custom properties for responsive grid
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function CounterGroupSave({ attributes }) {
	const {
		columns,
		columnsTablet,
		columnsMobile,
		gap,
		alignContent,
		animationDuration,
		animationDelay,
		animationEasing,
		useGrouping,
		separator,
		decimal,
		hoverColor,
	} = attributes;

	// Block wrapper props with CSS custom properties
	const blockProps = useBlockProps.save({
		className: 'dsgo-counter-group',
		style: {
			// CRITICAL: Use align-self: stretch to fill parent width (must match index.js)
			alignSelf: 'stretch',
			// Cast to string to prevent React from adding "px" suffix
			'--dsgo-counter-columns-desktop': String(columns),
			'--dsgo-counter-columns-tablet': String(columnsTablet),
			'--dsgo-counter-columns-mobile': String(columnsMobile),
			'--dsgo-counter-gap': gap,
			// Apply hover color for child Counter blocks to inherit
			...(hoverColor && { '--dsgo-counter-hover-color': hoverColor }),
		},
		// Data attributes for frontend JavaScript
		'data-animation-duration': animationDuration,
		'data-animation-delay': animationDelay,
		'data-animation-easing': animationEasing,
		'data-use-grouping': useGrouping ? 'true' : 'false',
		'data-separator': separator,
		'data-decimal': decimal,
	});

	// Inner blocks props (WordPress best practice)
	const innerBlocksProps = useInnerBlocksProps.save({
		className: `dsgo-counter-group__inner dsgo-counter-group__inner--align-${alignContent}`,
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
