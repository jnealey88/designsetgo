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
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

/**
 * Stack Container Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {JSX.Element} Edit component
 */
export default function StackEdit({ attributes, setAttributes }) {
	const { gap, textAlign } = attributes;

	// Calculate inner styles declaratively
	const innerStyles = {
		display: 'flex',
		flexDirection: 'column',
		gap: gap || 'var(--wp--preset--spacing--50)',
		...(textAlign && { textAlign }),
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
				<AlignmentToolbar
					value={textAlign}
					onChange={(value) => setAttributes({ textAlign: value })}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody
					title={__('Stack Settings', 'designsetgo')}
					initialOpen={true}
				>
					<TextControl
						label={__('Gap', 'designsetgo')}
						value={gap}
						onChange={(value) => setAttributes({ gap: value })}
						placeholder="var(--wp--preset--spacing--50)"
						help={__(
							'Space between stacked items. Use CSS units (px, rem, em) or WordPress spacing tokens (var(--wp--preset--spacing--50)).',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
