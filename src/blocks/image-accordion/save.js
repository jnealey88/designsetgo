import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

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
	const accordionClasses = classnames('dsg-image-accordion', {
		'dsg-image-accordion--hover': triggerType === 'hover',
		'dsg-image-accordion--click': triggerType === 'click',
	});

	// Apply settings as CSS custom properties - MUST MATCH edit.js
	// Note: Unitless values must be strings to prevent React from adding 'px'
	const customStyles = {
		'--dsg-image-accordion-height': height,
		'--dsg-image-accordion-gap': gap,
		'--dsg-image-accordion-expanded-ratio': String(expandedRatio), // Unitless
		'--dsg-image-accordion-transition': transitionDuration,
		'--dsg-image-accordion-overlay-color': overlayColor,
		'--dsg-image-accordion-overlay-opacity': String(overlayOpacity / 100), // Unitless
		'--dsg-image-accordion-overlay-opacity-expanded': String(
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
		className: 'dsg-image-accordion__items',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
