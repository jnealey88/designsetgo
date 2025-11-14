import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function AccordionSave({ attributes }) {
	const {
		allowMultipleOpen,
		iconStyle,
		iconPosition,
		borderBetween,
		borderBetweenColor,
		itemGap,
		openBackgroundColor,
		openTextColor,
		hoverBackgroundColor,
		hoverTextColor,
	} = attributes;

	// Smart default: hover mirrors open unless explicitly set
	const effectiveHoverBg = hoverBackgroundColor || openBackgroundColor;
	const effectiveHoverText = hoverTextColor || openTextColor;

	// Same classes as edit.js - MUST MATCH EXACTLY
	const accordionClasses = classnames('dsgo-accordion', {
		'dsgo-accordion--multiple': allowMultipleOpen,
		'dsgo-accordion--icon-left': iconPosition === 'left',
		'dsgo-accordion--icon-right': iconPosition === 'right',
		'dsgo-accordion--no-icon': iconStyle === 'none',
		'dsgo-accordion--border-between': borderBetween,
	});

	// Apply colors and gap as CSS custom properties that will cascade to accordion items
	const customStyles = {
		'--dsgo-accordion-open-bg': openBackgroundColor,
		'--dsgo-accordion-open-text': openTextColor,
		'--dsgo-accordion-hover-bg': effectiveHoverBg,
		'--dsgo-accordion-hover-text': effectiveHoverText,
		'--dsgo-accordion-gap': itemGap,
		...(borderBetweenColor && {
			'--dsgo-accordion-border-color': borderBetweenColor,
		}),
	};

	// Use .save() variant for save function
	const blockProps = useBlockProps.save({
		className: accordionClasses,
		style: customStyles,
		'data-allow-multiple': allowMultipleOpen,
		'data-icon-style': iconStyle,
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-accordion__items',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
