/**
 * Tabs Block - Edit Component
 *
 * Parent block that manages tab navigation and panels
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
	RichText,
	store as blockEditorStore,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { getIcon } from '../icon/utils/svg-icons';

const ALLOWED_BLOCKS = ['designsetgo/tab'];

const TEMPLATE = [
	['designsetgo/tab', { title: __('Tab 1', 'designsetgo') }],
	['designsetgo/tab', { title: __('Tab 2', 'designsetgo') }],
	['designsetgo/tab', { title: __('Tab 3', 'designsetgo') }],
];

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		uniqueId,
		orientation,
		activeTab,
		alignment,
		mobileBreakpoint,
		mobileMode,
		enableDeepLinking,
		gap,
		tabStyle,
		tabColor,
		tabBackgroundColor,
		tabContentBackgroundColor,
		activeTabColor,
		activeTabBackgroundColor,
		tabBorderColor,
		tabHoverColor,
		tabHoverBackgroundColor,
		showNavBorder,
	} = attributes;

	// Get theme color palette and gradient settings
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// Generate unique ID on mount
	useEffect(() => {
		if (!uniqueId) {
			setAttributes({ uniqueId: clientId.substring(0, 8) });
		}
	}, [uniqueId, clientId, setAttributes]);

	// Get inner blocks (tabs)
	const { innerBlocks } = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			return {
				innerBlocks: getBlock(clientId)?.innerBlocks || [],
			};
		},
		[clientId]
	);

	// Get dispatch actions for selecting blocks and updating child attributes
	const { selectBlock, updateBlockAttributes } = useDispatch(blockEditorStore);

	// Handle tab click - set active tab and select the Tab block to show its settings
	const handleTabClick = (index) => {
		setAttributes({ activeTab: index });

		// Select the corresponding Tab block so its settings appear in sidebar
		if (innerBlocks[index]) {
			selectBlock(innerBlocks[index].clientId);
		}
	};

	// Handle keyboard navigation
	const handleKeyDown = (e, index) => {
		// Don't interfere with text editing in RichText
		if (e.target.isContentEditable) {
			return;
		}

		// Handle Enter/Space for tab activation (divs need explicit handling unlike buttons)
		if (e.key === 'Enter' || e.key === ' ') {
			handleTabClick(index);
			e.preventDefault();
			return;
		}

		let newIndex = index;

		if (orientation === 'horizontal') {
			if (e.key === 'ArrowLeft') {
				newIndex = index > 0 ? index - 1 : innerBlocks.length - 1;
				e.preventDefault();
			} else if (e.key === 'ArrowRight') {
				newIndex = index < innerBlocks.length - 1 ? index + 1 : 0;
				e.preventDefault();
			}
		} else if (e.key === 'ArrowUp') {
			newIndex = index > 0 ? index - 1 : innerBlocks.length - 1;
			e.preventDefault();
		} else if (e.key === 'ArrowDown') {
			newIndex = index < innerBlocks.length - 1 ? index + 1 : 0;
			e.preventDefault();
		}

		if (e.key === 'Home') {
			newIndex = 0;
			e.preventDefault();
		} else if (e.key === 'End') {
			newIndex = innerBlocks.length - 1;
			e.preventDefault();
		}

		if (newIndex !== index) {
			setAttributes({ activeTab: newIndex });

			// Select the corresponding Tab block so its settings appear in sidebar
			if (innerBlocks[newIndex]) {
				selectBlock(innerBlocks[newIndex].clientId);
			}

			// Focus the new tab
			setTimeout(() => {
				const tabButton = document.querySelector(
					`.dsgo-tabs-${uniqueId} [data-tab-index="${newIndex}"]`
				);
				if (tabButton) {
					tabButton.focus();
				}
			}, 0);
		}
	};

	const blockProps = useBlockProps({
		className: `dsgo-tabs dsgo-tabs-${uniqueId} dsgo-tabs--${orientation} dsgo-tabs--${tabStyle} dsgo-tabs--align-${alignment}${showNavBorder ? ' dsgo-tabs--show-nav-border' : ''}`,
		style: {
			'--dsgo-tabs-gap': gap,
			...(tabColor && { '--dsgo-tab-color': tabColor }),
			...(tabBackgroundColor && { '--dsgo-tab-bg': tabBackgroundColor }),
			...(tabContentBackgroundColor && {
				'--dsgo-tab-content-bg': tabContentBackgroundColor,
			}),
			...(activeTabColor && {
				'--dsgo-tab-color-active': activeTabColor,
			}),
			...(activeTabBackgroundColor && {
				'--dsgo-tab-bg-active': activeTabBackgroundColor,
			}),
			...(tabBorderColor && {
				'--dsgo-tab-border-color': tabBorderColor,
			}),
			...(tabHoverColor && {
				'--dsgo-tab-color-hover': tabHoverColor,
			}),
			...(tabHoverBackgroundColor && {
				'--dsgo-tab-bg-hover': tabHoverBackgroundColor,
			}),
		},
	});

	// Use useInnerBlocksProps for tab panels
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsgo-tabs__panels',
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			orientation: orientation === 'vertical' ? 'vertical' : 'horizontal',
		}
	);

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					panelId={clientId}
					title={__('Tab Colors', 'designsetgo')}
					settings={[
						{
							label: __('Tab Text', 'designsetgo'),
							colorValue: tabColor,
							onColorChange: (color) =>
								setAttributes({ tabColor: color || '' }),
							clearable: true,
						},
						{
							label: __('Tab Background', 'designsetgo'),
							colorValue: tabBackgroundColor,
							onColorChange: (color) =>
								setAttributes({
									tabBackgroundColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Tab Text Hover', 'designsetgo'),
							colorValue: tabHoverColor,
							onColorChange: (color) =>
								setAttributes({ tabHoverColor: color || '' }),
							clearable: true,
						},
						{
							label: __('Tab Background Hover', 'designsetgo'),
							colorValue: tabHoverBackgroundColor,
							onColorChange: (color) =>
								setAttributes({
									tabHoverBackgroundColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Active Tab Text', 'designsetgo'),
							colorValue: activeTabColor,
							onColorChange: (color) =>
								setAttributes({ activeTabColor: color || '' }),
							clearable: true,
						},
						{
							label: __('Active Tab Background', 'designsetgo'),
							colorValue: activeTabBackgroundColor,
							onColorChange: (color) =>
								setAttributes({
									activeTabBackgroundColor: color || '',
								}),
							clearable: true,
						},
						{
							label: __('Tab Border', 'designsetgo'),
							colorValue: tabBorderColor,
							onColorChange: (color) =>
								setAttributes({ tabBorderColor: color || '' }),
							clearable: true,
						},
						{
							label: __('Tab Content Background', 'designsetgo'),
							colorValue: tabContentBackgroundColor,
							onColorChange: (color) =>
								setAttributes({
									tabContentBackgroundColor: color || '',
								}),
							clearable: true,
						},
					]}
					{...colorGradientSettings}
				/>
			</InspectorControls>

			<InspectorControls>
				<PanelBody
					title={__('Tab Settings', 'designsetgo')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Orientation', 'designsetgo')}
						value={orientation}
						options={[
							{
								label: __('Horizontal', 'designsetgo'),
								value: 'horizontal',
							},
							{
								label: __('Vertical', 'designsetgo'),
								value: 'vertical',
							},
						]}
						onChange={(value) =>
							setAttributes({ orientation: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Tab Style', 'designsetgo')}
						value={tabStyle}
						options={[
							{
								label: __('Default', 'designsetgo'),
								value: 'default',
							},
							{
								label: __('Pills', 'designsetgo'),
								value: 'pills',
							},
							{
								label: __('Underline', 'designsetgo'),
								value: 'underline',
							},
							{
								label: __('Minimal', 'designsetgo'),
								value: 'minimal',
							},
						]}
						onChange={(value) => setAttributes({ tabStyle: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{orientation === 'horizontal' && (
						<SelectControl
							label={__('Alignment', 'designsetgo')}
							value={alignment}
							options={[
								{
									label: __('Left', 'designsetgo'),
									value: 'left',
								},
								{
									label: __('Center', 'designsetgo'),
									value: 'center',
								},
								{
									label: __('Right', 'designsetgo'),
									value: 'right',
								},
								{
									label: __('Justified', 'designsetgo'),
									value: 'justified',
								},
							]}
							onChange={(value) =>
								setAttributes({ alignment: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					<RangeControl
						label={__('Gap Between Tabs', 'designsetgo')}
						value={parseInt(gap)}
						onChange={(value) =>
							setAttributes({ gap: `${value}px` })
						}
						min={0}
						max={40}
						step={1}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Show Border Below Tabs', 'designsetgo')}
						checked={showNavBorder}
						onChange={(value) =>
							setAttributes({ showNavBorder: value })
						}
						help={__(
							'Add a divider line between tab navigation and content',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Mobile Settings', 'designsetgo')}
					initialOpen={false}
				>
					<RangeControl
						label={__('Mobile Breakpoint (px)', 'designsetgo')}
						value={mobileBreakpoint}
						onChange={(value) =>
							setAttributes({ mobileBreakpoint: value })
						}
						min={320}
						max={1024}
						step={1}
						help={__(
							'Screen width below which mobile mode activates',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Mobile Mode', 'designsetgo')}
						value={mobileMode}
						options={[
							{
								label: __('Accordion', 'designsetgo'),
								value: 'accordion',
							},
							{
								label: __('Dropdown', 'designsetgo'),
								value: 'dropdown',
							},
							{
								label: __('Tabs (Scrollable)', 'designsetgo'),
								value: 'tabs',
							},
						]}
						onChange={(value) =>
							setAttributes({ mobileMode: value })
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody
					title={__('Advanced', 'designsetgo')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable Deep Linking', 'designsetgo')}
						checked={enableDeepLinking}
						onChange={(value) =>
							setAttributes({ enableDeepLinking: value })
						}
						help={__(
							'Allow tabs to be accessed via URL hash (e.g., #tab-name)',
							'designsetgo'
						)}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{/* Tab Navigation */}
				<div
					className="dsgo-tabs__nav"
					role="tablist"
					aria-label={__('Tabs', 'designsetgo')}
				>
					{innerBlocks.map((block, index) => {
						const {
							title,
							icon,
							iconPosition,
							uniqueId: tabId,
						} = block.attributes;
						const isActive = index === activeTab;

						return (
							<div
								key={block.clientId}
								className={`dsgo-tabs__tab ${isActive ? 'is-active' : ''} ${
									icon ? `has-icon icon-${iconPosition}` : ''
								}`}
								id={`tab-${tabId}`}
								role="tab"
								aria-selected={isActive}
								aria-controls={`panel-${tabId}`}
								tabIndex={isActive ? 0 : -1}
								data-tab-index={index}
								onClick={() => {
									if (!isActive) {
										handleTabClick(index);
									}
								}}
								onKeyDown={(e) => handleKeyDown(e, index)}
							>
								{icon && iconPosition === 'left' && (
									<span className="dsgo-tabs__tab-icon">
										{getIcon(icon)}
									</span>
								)}

								{icon && iconPosition === 'top' && (
									<span className="dsgo-tabs__tab-icon-top">
										{getIcon(icon)}
									</span>
								)}

								{isActive ? (
									<RichText
										tagName="span"
										className="dsgo-tabs__tab-title"
										value={title}
										onChange={(value) =>
											updateBlockAttributes(
												block.clientId,
												{ title: value }
											)
										}
										placeholder={`Tab ${index + 1}`}
										allowedFormats={[]}
										withoutInteractiveFormatting
									/>
								) : (
									<span className="dsgo-tabs__tab-title">
										{title || `Tab ${index + 1}`}
									</span>
								)}

								{icon && iconPosition === 'right' && (
									<span className="dsgo-tabs__tab-icon">
										{getIcon(icon)}
									</span>
								)}
							</div>
						);
					})}
				</div>

				{/* Tab Panels - Use spread props pattern */}
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
