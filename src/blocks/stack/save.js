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
		constrainWidth,
		contentWidth,
		hoverBackgroundColor,
		hoverTextColor,
		hoverIconBackgroundColor,
		hoverButtonBackgroundColor,
	} = attributes;

	// Build className - add indicator when no width constraints
	const className = [
		'dsg-stack',
		!constrainWidth && 'dsg-no-width-constraint',
	]
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
	if (constrainWidth) {
		innerStyle.maxWidth = contentWidth || '1200px';
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
