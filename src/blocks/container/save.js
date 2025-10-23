/**
 * Container Block - Save Component
 *
 * @package DesignSetGo
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function Save({ attributes }) {
	const {
		uniqueId,
		layout,
		flexDirection,
		justifyContent,
		alignItems,
		gap,
		gridColumns,
		minHeight,
		htmlTag,
		animation,
		responsive,
	} = attributes;

	const Tag = htmlTag || 'div';

	const blockProps = useBlockProps.save({
		className: classnames('dsg-container', `dsg-container--${layout}`, {
			'dsg-hide-desktop': responsive.hideOnDesktop,
			'dsg-hide-tablet': responsive.hideOnTablet,
			'dsg-hide-mobile': responsive.hideOnMobile,
			[`dsg-block-${uniqueId}`]: uniqueId,
		}),
		style: {
			display: layout === 'flex' ? 'flex' : 'grid',
			flexDirection: layout === 'flex' ? flexDirection : undefined,
			justifyContent: layout === 'flex' ? justifyContent : undefined,
			alignItems: layout === 'flex' ? alignItems : undefined,
			gap: gap.desktop,
			gridTemplateColumns:
				layout === 'grid'
					? `repeat(${gridColumns.desktop}, 1fr)`
					: undefined,
			minHeight: minHeight.desktop,
		},
		...(animation.type !== 'none' && {
			'data-dsg-animation': animation.type,
			'data-dsg-animation-duration': animation.duration,
			'data-dsg-animation-delay': animation.delay,
			'data-dsg-animation-easing': animation.easing,
		}),
	});

	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <Tag {...innerBlocksProps} />;
}
