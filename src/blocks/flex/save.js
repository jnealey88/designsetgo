/**
 * Flex Container Block - Save Component
 *
 * Saves the block content with declarative styles.
 *
 * @since 1.0.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Flex Container Save Component
 *
 * @param {Object} props            Component props
 * @param {Object} props.attributes Block attributes
 * @return {JSX.Element} Save component
 */
export default function FlexSave({ attributes }) {
	const {
		direction,
		wrap,
		justifyContent,
		alignItems,
		mobileStack,
		constrainWidth,
		contentWidth,
		hoverBackgroundColor,
		hoverTextColor,
	} = attributes;

	// Calculate effective content width (must match edit.js logic for frontend)
	// Note: Can't use useSetting in save, so use contentWidth or fallback
	const effectiveContentWidth = contentWidth || '1200px';

	// Calculate inner styles declaratively (must match edit.js)
	// Note: gap is handled by WordPress blockGap support via style.spacing.blockGap
	const innerStyles = {
		display: 'flex',
		flexDirection: direction || 'row',
		flexWrap: wrap ? 'wrap' : 'nowrap',
		justifyContent: justifyContent || 'flex-start',
		alignItems: alignItems || 'center',
		...(constrainWidth && {
			maxWidth: effectiveContentWidth,
			marginLeft: 'auto',
			marginRight: 'auto',
		}),
	};

	// Block wrapper props with merged inner blocks props (must match edit.js)
	// CRITICAL: Merge blockProps and innerBlocksProps into single div to fix paste behavior
	const blockProps = useBlockProps.save({
		className: `dsg-flex ${mobileStack ? 'dsg-flex--mobile-stack' : ''}`,
		style: {
			alignSelf: 'stretch',
			// Merge inner styles with block styles
			...innerStyles,
			...(hoverBackgroundColor && {
				'--dsg-hover-bg-color': hoverBackgroundColor,
			}),
			...(hoverTextColor && {
				'--dsg-hover-text-color': hoverTextColor,
			}),
			...(attributes.hoverIconBackgroundColor && {
				'--dsg-parent-hover-icon-bg':
					attributes.hoverIconBackgroundColor,
			}),
			...(attributes.hoverButtonBackgroundColor && {
				'--dsg-parent-hover-button-bg':
					attributes.hoverButtonBackgroundColor,
			}),
		},
	});

	// Merge block props with inner blocks props
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
