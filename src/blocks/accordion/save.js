import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function AccordionSave({ attributes }) {
	const {
		allowMultipleOpen,
		iconStyle,
		iconPosition,
		borderBetween,
		openBackgroundColor,
		openTextColor,
		hoverBackgroundColor,
		hoverTextColor,
	} = attributes;

	// Smart default: hover mirrors open unless explicitly set
	const effectiveHoverBg = hoverBackgroundColor || openBackgroundColor;
	const effectiveHoverText = hoverTextColor || openTextColor;

	// Same classes as edit.js - MUST MATCH EXACTLY
	const accordionClasses = classnames('dsg-accordion', {
		'dsg-accordion--multiple': allowMultipleOpen,
		'dsg-accordion--icon-left': iconPosition === 'left',
		'dsg-accordion--icon-right': iconPosition === 'right',
		'dsg-accordion--no-icon': iconStyle === 'none',
		'dsg-accordion--border-between': borderBetween,
	});

	// Apply colors as CSS custom properties that will cascade to accordion items
	const colorStyles = {
		'--dsg-accordion-open-bg': openBackgroundColor,
		'--dsg-accordion-open-text': openTextColor,
		'--dsg-accordion-hover-bg': effectiveHoverBg,
		'--dsg-accordion-hover-text': effectiveHoverText,
	};

	// Use .save() variant for save function
	const blockProps = useBlockProps.save({
		className: accordionClasses,
		style: colorStyles,
		'data-allow-multiple': allowMultipleOpen,
		'data-icon-style': iconStyle,
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-accordion__items',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
