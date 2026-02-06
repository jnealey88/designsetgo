import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function TimelineSave({ attributes }) {
	const {
		orientation,
		layout,
		lineColor,
		lineThickness,
		connectorStyle,
		markerStyle,
		markerSize,
		markerColor,
		markerBorderColor,
		itemSpacing,
		animateOnScroll,
		animationDuration,
		staggerDelay,
	} = attributes;

	// CSS custom properties - must match edit.js exactly
	const customStyles = {
		'--dsgo-timeline-line-color':
			lineColor || 'var(--wp--preset--color--contrast, #e5e7eb)',
		'--dsgo-timeline-line-thickness': `${lineThickness}px`,
		'--dsgo-timeline-connector-style': connectorStyle,
		'--dsgo-timeline-marker-size': `${markerSize}px`,
		'--dsgo-timeline-marker-color':
			markerColor || 'var(--wp--preset--color--primary, #2563eb)',
		'--dsgo-timeline-marker-border-color':
			markerBorderColor ||
			markerColor ||
			'var(--wp--preset--color--primary, #2563eb)',
		'--dsgo-timeline-item-spacing': itemSpacing,
		'--dsgo-timeline-animation-duration': `${animationDuration}ms`,
	};

	// Build class names - must match edit.js exactly
	const timelineClasses = classnames('dsgo-timeline', {
		[`dsgo-timeline--${orientation}`]: orientation,
		[`dsgo-timeline--layout-${layout}`]: layout,
		[`dsgo-timeline--marker-${markerStyle}`]: markerStyle,
		'dsgo-timeline--animate': animateOnScroll,
	});

	const blockProps = useBlockProps.save({
		className: timelineClasses,
		style: customStyles,
		'data-animate': animateOnScroll,
		'data-animation-duration': animationDuration,
		'data-stagger-delay': staggerDelay,
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsgo-timeline__items',
	});

	return (
		<div {...blockProps}>
			<div className="dsgo-timeline__line" aria-hidden="true" />
			<div {...innerBlocksProps} />
		</div>
	);
}
