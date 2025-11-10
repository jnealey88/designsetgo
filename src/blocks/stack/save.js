/**
 * DSG Section Block - Save Component
 *
 * Saves the block content with minimal custom styles.
 * WordPress's layout system handles flex layout through CSS classes.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Stack Container Save Component
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function StackSave({ attributes }) {
	const {
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
		layout,
		contentWidth, // Legacy attribute from before layout support
	} = attributes;

	// Extract contentSize with fallback priority:
	// 1. WordPress layout support (layout.contentSize) - if explicitly set
	// 2. Legacy custom attribute (contentWidth) - for backward compatibility
	// 3. Plugin default (1200px) - as last resort
	// Note: If user explicitly disabled width constraint in Layout panel, layout.contentSize will be ''
	// and we should NOT apply fallbacks (respect user's choice for full width)
	let contentSize;
	if (layout && 'contentSize' in layout) {
		// User has interacted with Layout panel - respect their choice
		contentSize = layout.contentSize; // Could be a value or '' (disabled)
	} else {
		// User hasn't set layout.contentSize - use fallbacks
		contentSize = contentWidth || '1200px';
	}

	// Build className - add indicator when no width constraints
	const className = ['dsg-stack', !contentSize && 'dsg-no-width-constraint']
		.filter(Boolean)
		.join(' ');

	// Block wrapper props - outer div stays full width
	const blockProps = useBlockProps.save({
		className,
		style: {
			...(hoverBackgroundColor && {
				'--dsg-hover-bg-color': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsg-hover-text-color': hoverTextColor,
			}),
			...(hoverIconBackgroundColor && {
				'--dsg-parent-hover-icon-bg': hoverIconBackgroundColor,
			}),
			...(hoverButtonBackgroundColor && {
				'--dsg-parent-hover-button-bg': hoverButtonBackgroundColor,
			}),
		},
	});

	// Inner container props with width constraints
	const innerStyle = {};
	if (contentSize) {
		innerStyle.maxWidth = contentSize;
		innerStyle.marginLeft = 'auto';
		innerStyle.marginRight = 'auto';
	}

	// Merge inner blocks props without the outer block props
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-stack__inner',
		style: innerStyle,
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
