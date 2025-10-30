/**
 * Stack Container Block - Edit Component
 *
 * Simple vertical stacking container with consistent gaps.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
	useSetting,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import {
	alignLeft,
	alignCenter,
	alignRight,
} from '@wordpress/icons';

/**
 * Stack Container Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {JSX.Element} Edit component
 */
export default function StackEdit({ attributes, setAttributes }) {
	const { alignItems, constrainWidth, contentWidth } = attributes;

	// Get theme content size
	const themeContentWidth = useSetting('layout.contentSize');

	// Calculate effective content width
	const effectiveContentWidth = contentWidth || themeContentWidth || '1200px';

	// Calculate inner styles declaratively
	// Note: gap is handled by WordPress blockGap support via style.spacing.blockGap
	const innerStyles = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: alignItems || 'flex-start',
		...(constrainWidth && {
			maxWidth: effectiveContentWidth,
			marginLeft: 'auto',
			marginRight: 'auto',
		}),
	};

	// Block wrapper props
	const blockProps = useBlockProps({
		className: 'dsg-stack',
	});

	// Inner blocks props with declarative styles
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-stack__inner',
			style: innerStyles,
		},
		{
			orientation: 'vertical',
			templateLock: false,
		}
	);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={alignLeft}
						label={__('Align items left', 'designsetgo')}
						isPressed={alignItems === 'flex-start'}
						onClick={() => setAttributes({ alignItems: 'flex-start' })}
					/>
					<ToolbarButton
						icon={alignCenter}
						label={__('Align items center', 'designsetgo')}
						isPressed={alignItems === 'center'}
						onClick={() => setAttributes({ alignItems: 'center' })}
					/>
					<ToolbarButton
						icon={alignRight}
						label={__('Align items right', 'designsetgo')}
						isPressed={alignItems === 'flex-end'}
						onClick={() => setAttributes({ alignItems: 'flex-end' })}
					/>
				</ToolbarGroup>
			</BlockControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
