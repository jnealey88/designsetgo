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
	const itemClasses = classnames('dsgo-image-accordion-item', {
		'dsgo-image-accordion-item--has-overlay': enableOverlay,
	});

	// Apply overlay and alignment as inline styles (same as edit.js)
	// Note: Unitless values must be strings to prevent React from adding 'px'
	const overlayStyles = enableOverlay
		? {
				'--dsgo-overlay-color': overlayColor,
				'--dsgo-overlay-opacity': String(overlayOpacity / 100), // Unitless
				'--dsgo-overlay-opacity-expanded': String(
					overlayOpacityExpanded / 100
				), // Unitless
			}
		: {};

	const blockProps = useBlockProps.save({
		className: itemClasses,
		style: {
			...overlayStyles,
			'--dsgo-vertical-alignment': verticalAlignment || 'center',
			'--dsgo-horizontal-alignment': horizontalAlignment || 'center',
		},
		'data-unique-id': uniqueId,
		role: 'button',
		tabIndex: 0,
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-image-accordion-item__content',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
