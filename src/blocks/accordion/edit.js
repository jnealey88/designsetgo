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
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import classnames from 'classnames';

export default function AccordionEdit({ attributes, setAttributes }) {
	const {
		allowMultipleOpen,
		initiallyOpen,
		iconStyle,
		iconPosition,
		borderBetween,
		itemGap,
		openBackgroundColor,
		openTextColor,
		hoverBackgroundColor,
		hoverTextColor,
	} = attributes;

	// Smart default: hover mirrors open unless explicitly set
	const effectiveHoverBg = hoverBackgroundColor || openBackgroundColor;
	const effectiveHoverText = hoverTextColor || openTextColor;

	// Declaratively calculate classes based on attributes
	const accordionClasses = classnames('dsg-accordion', {
		'dsg-accordion--multiple': allowMultipleOpen,
		'dsg-accordion--icon-left': iconPosition === 'left',
		'dsg-accordion--icon-right': iconPosition === 'right',
		'dsg-accordion--no-icon': iconStyle === 'none',
		'dsg-accordion--border-between': borderBetween,
	});

	// Apply colors and gap as CSS custom properties that will cascade to accordion items
	const customStyles = {
		'--dsg-accordion-open-bg': openBackgroundColor,
		'--dsg-accordion-open-text': openTextColor,
		'--dsg-accordion-hover-bg': effectiveHoverBg,
		'--dsg-accordion-hover-text': effectiveHoverText,
		'--dsg-accordion-gap': itemGap,
	};

	// Block wrapper props
	const blockProps = useBlockProps({
		className: accordionClasses,
		style: customStyles,
	});

	// Inner blocks configuration - ONLY allow accordion-item children
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-accordion__items',
		},
		{
			allowedBlocks: ['designsetgo/accordion-item'],
			template: [
				[
					'designsetgo/accordion-item',
					{
						title: __('Accordion Item 1', 'designsetgo'),
						isOpen:
							initiallyOpen === 'first' ||
							initiallyOpen === 'all',
					},
				],
				[
					'designsetgo/accordion-item',
					{
						title: __('Accordion Item 2', 'designsetgo'),
						isOpen: initiallyOpen === 'all',
					},
				],
			],
			orientation: 'vertical',
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Accordion Settings', 'designsetgo')}>
					<ToggleControl
						label={__('Allow Multiple Open', 'designsetgo')}
						help={
							allowMultipleOpen
								? __(
										'Multiple panels can be open at once',
										'designsetgo'
									)
								: __(
										'Only one panel can be open at a time',
										'designsetgo'
									)
						}
						checked={allowMultipleOpen}
						onChange={(value) =>
							setAttributes({ allowMultipleOpen: value })
						}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Initially Open', 'designsetgo')}
						value={initiallyOpen}
						options={[
							{ label: __('None', 'designsetgo'), value: 'none' },
							{
								label: __('First Item', 'designsetgo'),
								value: 'first',
							},
							{
								label: __('All Items', 'designsetgo'),
								value: 'all',
							},
						]}
						onChange={(value) =>
							setAttributes({ initiallyOpen: value })
						}
						help={__(
							'Which panels should be open when the page loads',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Icon Settings', 'designsetgo')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Icon Style', 'designsetgo')}
						value={iconStyle}
						options={[
							{
								label: __('Chevron', 'designsetgo'),
								value: 'chevron',
							},
							{
								label: __('Plus/Minus', 'designsetgo'),
								value: 'plus-minus',
							},
							{
								label: __('Caret', 'designsetgo'),
								value: 'caret',
							},
							{ label: __('None', 'designsetgo'), value: 'none' },
						]}
						onChange={(value) =>
							setAttributes({ iconStyle: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{iconStyle !== 'none' && (
						<SelectControl
							label={__('Icon Position', 'designsetgo')}
							value={iconPosition}
							options={[
								{
									label: __('Left', 'designsetgo'),
									value: 'left',
								},
								{
									label: __('Right', 'designsetgo'),
									value: 'right',
								},
							]}
							onChange={(value) =>
								setAttributes({ iconPosition: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}
				</PanelBody>

				<PanelBody
					title={__('Style Settings', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Border Between Items', 'designsetgo')}
						checked={borderBetween}
						onChange={(value) =>
							setAttributes({ borderBetween: value })
						}
						help={
							borderBetween
								? __(
										'Items have borders between them with no gap',
										'designsetgo'
									)
								: __(
										'Items are separated with spacing',
										'designsetgo'
									)
						}
						__nextHasNoMarginBottom
					/>

					{!borderBetween && (
						<UnitControl
							label={__('Gap Between Items', 'designsetgo')}
							value={itemGap}
							onChange={(value) =>
								setAttributes({ itemGap: value || '0.5rem' })
							}
							units={[
								{ value: 'px', label: 'px', default: 8 },
								{ value: 'rem', label: 'rem', default: 0.5 },
								{ value: 'em', label: 'em', default: 0.5 },
							]}
							min={0}
							max={100}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelColorGradientSettings
					title={__('Open State Colors', 'designsetgo')}
					initialOpen={false}
					settings={[
						{
							colorValue: openBackgroundColor,
							onColorChange: (value) =>
								setAttributes({ openBackgroundColor: value }),
							label: __('Background', 'designsetgo'),
						},
						{
							colorValue: openTextColor,
							onColorChange: (value) =>
								setAttributes({ openTextColor: value }),
							label: __('Text', 'designsetgo'),
						},
					]}
					__experimentalIsRenderedInSidebar
				>
					<p
						className="components-base-control__help"
						style={{ marginTop: '10px', fontSize: '12px' }}
					>
						{__(
							'Colors applied to all accordion items when open.',
							'designsetgo'
						)}
					</p>
				</PanelColorGradientSettings>

				<PanelColorGradientSettings
					title={__('Hover State Colors', 'designsetgo')}
					initialOpen={false}
					settings={[
						{
							colorValue: hoverBackgroundColor,
							onColorChange: (value) =>
								setAttributes({ hoverBackgroundColor: value }),
							label: __('Background', 'designsetgo'),
							clearable: true,
						},
						{
							colorValue: hoverTextColor,
							onColorChange: (value) =>
								setAttributes({ hoverTextColor: value }),
							label: __('Text', 'designsetgo'),
							clearable: true,
						},
					]}
					__experimentalIsRenderedInSidebar
				>
					<p
						className="components-base-control__help"
						style={{ marginTop: '10px', fontSize: '12px' }}
					>
						{!hoverBackgroundColor && !hoverTextColor
							? __(
									'⚡ Hover colors mirror open state by default. Set custom colors to override.',
									'designsetgo'
								)
							: __(
									'Custom hover colors set. Clear to use open state colors.',
									'designsetgo'
								)}
					</p>
				</PanelColorGradientSettings>
			</InspectorControls>

			{/* NO wrapper div - spread props directly per WordPress best practices */}
			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
