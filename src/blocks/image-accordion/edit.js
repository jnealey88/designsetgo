import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import classnames from 'classnames';

export default function ImageAccordionEdit({ attributes, setAttributes }) {
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

	// Declaratively calculate classes based on attributes
	const accordionClasses = classnames('dsg-image-accordion', {
		'dsg-image-accordion--hover': triggerType === 'hover',
		'dsg-image-accordion--click': triggerType === 'click',
	});

	// Apply settings as CSS custom properties for consistent styling
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

	// Block wrapper props
	const blockProps = useBlockProps({
		className: accordionClasses,
		style: customStyles,
	});

	// Inner blocks configuration - ONLY allow image-accordion-item children
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-image-accordion__items',
		},
		{
			allowedBlocks: ['designsetgo/image-accordion-item'],
			template: [
				['designsetgo/image-accordion-item', {}],
				['designsetgo/image-accordion-item', {}],
				['designsetgo/image-accordion-item', {}],
			],
			orientation: 'vertical', // Always vertical in editor for easier editing
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Layout', 'designsetgo')}
					initialOpen={true}
				>
					<UnitControl
						label={__('Height', 'designsetgo')}
						value={height}
						onChange={(value) =>
							setAttributes({ height: value || '500px' })
						}
						units={[
							{ value: 'px', label: 'px', default: 500 },
							{ value: 'vh', label: 'vh', default: 50 },
							{ value: 'rem', label: 'rem', default: 30 },
						]}
						min={200}
						max={1000}
						help={__(
							'Fixed height for the accordion',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Gap Between Items', 'designsetgo')}
						value={gap}
						onChange={(value) =>
							setAttributes({ gap: value || '4px' })
						}
						units={[
							{ value: 'px', label: 'px', default: 4 },
							{ value: 'rem', label: 'rem', default: 0.25 },
						]}
						min={0}
						max={32}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Expansion Behavior', 'designsetgo')}
					initialOpen={false}
				>
					<RangeControl
						label={__('Expanded Ratio', 'designsetgo')}
						value={expandedRatio}
						onChange={(value) =>
							setAttributes({ expandedRatio: value })
						}
						min={2}
						max={5}
						step={0.5}
						help={__(
							'How much larger the expanded item becomes (others stay normal size)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<UnitControl
						label={__('Transition Duration', 'designsetgo')}
						value={transitionDuration}
						onChange={(value) =>
							setAttributes({
								transitionDuration: value || '0.5s',
							})
						}
						units={[
							{ value: 's', label: 's', default: 0.5 },
							{ value: 'ms', label: 'ms', default: 500 },
						]}
						min={0.1}
						max={2}
						help={__(
							'Speed of expansion/collapse animation',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Interaction', 'designsetgo')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Trigger Type', 'designsetgo')}
						value={triggerType}
						options={[
							{
								label: __('Hover (Desktop)', 'designsetgo'),
								value: 'hover',
							},
							{
								label: __('Click/Tap', 'designsetgo'),
								value: 'click',
							},
						]}
						onChange={(value) =>
							setAttributes({ triggerType: value })
						}
						help={__(
							'Hover is automatically replaced with click on mobile',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<RangeControl
						label={__('Default Expanded Item', 'designsetgo')}
						value={defaultExpanded}
						onChange={(value) =>
							setAttributes({ defaultExpanded: value })
						}
						min={0}
						max={10}
						help={__(
							'Which item is expanded on page load (0 = none, 1 = first, etc.)',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelColorGradientSettings
					title={__('Overlay', 'designsetgo')}
					initialOpen={false}
					settings={[]}
					__experimentalIsRenderedInSidebar
				>
					<ToggleControl
						label={__('Enable Overlay', 'designsetgo')}
						checked={enableOverlay}
						onChange={(value) =>
							setAttributes({ enableOverlay: value })
						}
						help={
							enableOverlay
								? __(
										'Overlay applied to all items',
										'designsetgo'
									)
								: __('No overlay on items', 'designsetgo')
						}
						__nextHasNoMarginBottom
					/>

					{enableOverlay && (
						<>
							<PanelColorGradientSettings
								title={__('Overlay Color', 'designsetgo')}
								settings={[
									{
										colorValue: overlayColor,
										onColorChange: (value) =>
											setAttributes({
												overlayColor: value,
											}),
										label: __('Color', 'designsetgo'),
									},
								]}
								__experimentalIsRenderedInSidebar
							/>

							<RangeControl
								label={__(
									'Overlay Opacity (Default)',
									'designsetgo'
								)}
								value={overlayOpacity}
								onChange={(value) =>
									setAttributes({ overlayOpacity: value })
								}
								min={0}
								max={100}
								help={__(
									'Opacity when item is not expanded',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>

							<RangeControl
								label={__(
									'Overlay Opacity (Expanded)',
									'designsetgo'
								)}
								value={overlayOpacityExpanded}
								onChange={(value) =>
									setAttributes({
										overlayOpacityExpanded: value,
									})
								}
								min={0}
								max={100}
								help={__(
									'Opacity when item is expanded',
									'designsetgo'
								)}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</PanelColorGradientSettings>
			</InspectorControls>

			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
