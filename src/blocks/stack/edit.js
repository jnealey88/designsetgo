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
	useSetting,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseCustomUnits as useCustomUnits,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

/**
 * Stack Container Edit Component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {JSX.Element} Edit component
 */
export default function StackEdit({ attributes, setAttributes }) {
	const { gap, textAlign, constrainWidth, contentWidth } = attributes;

	// Get spacing units and content size from theme
	const units = useCustomUnits({
		availableUnits: useSetting('spacing.units') || ['px', 'em', 'rem', 'vh', 'vw'],
	});
	const themeContentWidth = useSetting('layout.contentSize');

	// Calculate effective content width
	const effectiveContentWidth = contentWidth || themeContentWidth || '1200px';

	// Calculate inner styles declaratively
	const innerStyles = {
		display: 'flex',
		flexDirection: 'column',
		gap: gap || 'var(--wp--preset--spacing--50)',
		...(textAlign && { textAlign }),
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
					<UnitControl
						label={__('Gap', 'designsetgo')}
						value={gap}
						onChange={(value) => setAttributes({ gap: value })}
						units={units}
						isResetValueOnUnitChange
						__unstableInputWidth="80px"
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Width', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Constrain Width', 'designsetgo')}
						checked={constrainWidth}
						onChange={(value) => setAttributes({ constrainWidth: value })}
						help={
							constrainWidth
								? __('Content is constrained to max width', 'designsetgo')
								: __('Content uses full container width', 'designsetgo')
						}
						__nextHasNoMarginBottom
					/>

					{constrainWidth && (
						<UnitControl
							label={__('Content Width', 'designsetgo')}
							value={contentWidth}
							onChange={(value) => setAttributes({ contentWidth: value })}
							units={units}
							placeholder={themeContentWidth || '1200px'}
							help={__(
								`Leave empty to use theme default (${themeContentWidth || '1200px'})`,
								'designsetgo'
							)}
							isResetValueOnUnitChange
							__unstableInputWidth="80px"
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
