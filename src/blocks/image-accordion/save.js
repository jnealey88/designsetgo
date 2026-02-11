import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';
import { convertPresetToCSSVar } from '../../utils/convert-preset-to-css-var';

export default function ImageAccordionSave({ attributes }) {
	const {
		height,
		gap,
		expandedRatio,
		transitionDuration,
		enableOverlay,
		overlayColor,
		overlayOpacity,
		overlayOpacityExpanded,
		triggerType,
		defaultExpanded,
	} = attributes;

	// Same classes as edit.js - MUST MATCH EXACTLY
	const accordionClasses = classnames('dsgo-image-accordion', {
		'dsgo-image-accordion--hover': triggerType === 'hover',
		'dsgo-image-accordion--click': triggerType === 'click',
	});

	// Apply settings as CSS custom properties - MUST MATCH edit.js
	// Note: Unitless values must be strings to prevent React from adding 'px'
	const customStyles = {
		'--dsgo-image-accordion-height': height,
		'--dsgo-image-accordion-gap': gap,
		'--dsgo-image-accordion-expanded-ratio': String(expandedRatio), // Unitless
		'--dsgo-image-accordion-transition': transitionDuration,
		'--dsgo-image-accordion-overlay-color':
			convertPresetToCSSVar(overlayColor),
		'--dsgo-image-accordion-overlay-opacity': String(overlayOpacity / 100), // Unitless
		'--dsgo-image-accordion-overlay-opacity-expanded': String(
			overlayOpacityExpanded / 100
		), // Unitless
	};

	// Use .save() variant for save function
	const blockProps = useBlockProps.save({
		className: accordionClasses,
		style: customStyles,
		'data-trigger-type': triggerType,
		'data-default-expanded': defaultExpanded,
		'data-enable-overlay': enableOverlay,
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-image-accordion__items',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
