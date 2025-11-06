/**
 * Flip Card Block - Save Component
 *
 * Saves the flip card with front and back content.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Flip Card Save Component
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function FlipCardSave({ attributes }) {
	const { flipTrigger, flipEffect, flipDirection, flipDuration } = attributes;

	// Block wrapper props
	const blockProps = useBlockProps.save({
		className: `dsg-flip-card dsg-flip-card--${flipTrigger} dsg-flip-card--effect-${flipEffect} dsg-flip-card--${flipDirection}`,
		style: {
			'--dsg-flip-duration': flipDuration,
			width: '100%',
		},
		'data-flip-trigger': flipTrigger,
		'data-flip-effect': flipEffect,
		'data-flip-direction': flipDirection,
	});

	// Inner blocks props
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'dsg-flip-card__container',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
