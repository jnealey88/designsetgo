import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function ImageAccordionItemSave({ attributes, context }) {
	const { uniqueId, verticalAlignment, horizontalAlignment } = attributes;

	// Get context from parent accordion (same as edit.js)
	const enableOverlay =
		context?.['designsetgo/imageAccordion/enableOverlay'] !== undefined
			? context['designsetgo/imageAccordion/enableOverlay']
			: true;
	const overlayColor =
		context?.['designsetgo/imageAccordion/overlayColor'] || '#000000';
	const overlayOpacity =
		context?.['designsetgo/imageAccordion/overlayOpacity'] || 40;
	const overlayOpacityExpanded =
		context?.['designsetgo/imageAccordion/overlayOpacityExpanded'] || 20;

	// Same classes as edit.js - MUST MATCH
	const itemClasses = classnames('dsg-image-accordion-item', {
		'dsg-image-accordion-item--has-overlay': enableOverlay,
	});

	// Apply overlay and alignment as inline styles (same as edit.js)
	// Note: Unitless values must be strings to prevent React from adding 'px'
	const overlayStyles = enableOverlay
		? {
				'--dsg-overlay-color': overlayColor,
				'--dsg-overlay-opacity': String(overlayOpacity / 100), // Unitless
				'--dsg-overlay-opacity-expanded': String(
					overlayOpacityExpanded / 100
				), // Unitless
			}
		: {};

	const blockProps = useBlockProps.save({
		className: itemClasses,
		style: {
			...overlayStyles,
			'--dsg-vertical-alignment': verticalAlignment || 'center',
			'--dsg-horizontal-alignment': horizontalAlignment || 'center',
		},
		'data-unique-id': uniqueId,
		role: 'button',
		tabIndex: 0,
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-image-accordion-item__content',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
