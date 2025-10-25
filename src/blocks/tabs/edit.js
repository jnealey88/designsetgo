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
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
	Button,
	ButtonGroup,
	Dashicon,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

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
	} = attributes;

	// Generate unique ID on mount
	useEffect(() => {
		if (!uniqueId) {
			setAttributes({ uniqueId: clientId.substring(0, 8) });
		}
	}, []);

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

	// Handle tab click
	const handleTabClick = (index) => {
		setAttributes({ activeTab: index });
	};

	// Handle keyboard navigation
	const handleKeyDown = (e, index) => {
		let newIndex = index;

		if (orientation === 'horizontal') {
			if (e.key === 'ArrowLeft') {
				newIndex = index > 0 ? index - 1 : innerBlocks.length - 1;
				e.preventDefault();
			} else if (e.key === 'ArrowRight') {
				newIndex = index < innerBlocks.length - 1 ? index + 1 : 0;
				e.preventDefault();
			}
		} else {
			if (e.key === 'ArrowUp') {
				newIndex = index > 0 ? index - 1 : innerBlocks.length - 1;
				e.preventDefault();
			} else if (e.key === 'ArrowDown') {
				newIndex = index < innerBlocks.length - 1 ? index + 1 : 0;
				e.preventDefault();
			}
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
			// Focus the new tab
			setTimeout(() => {
				const tabButton = document.querySelector(
					`.dsg-tabs-${uniqueId} [data-tab-index="${newIndex}"]`
				);
				if (tabButton) {
					tabButton.focus();
				}
			}, 0);
		}
	};

	const blockProps = useBlockProps({
		className: `dsg-tabs dsg-tabs-${uniqueId} dsg-tabs--${orientation} dsg-tabs--${tabStyle} dsg-tabs--align-${alignment}`,
		style: {
			'--dsg-tabs-gap': gap,
		},
	});

	// Use useInnerBlocksProps for tab panels
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-tabs__panels',
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			orientation: orientation === 'vertical' ? 'vertical' : 'horizontal',
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Tab Settings', 'designsetgo')} initialOpen={true}>
					<SelectControl
						label={__('Orientation', 'designsetgo')}
						value={orientation}
						options={[
							{ label: __('Horizontal', 'designsetgo'), value: 'horizontal' },
							{ label: __('Vertical', 'designsetgo'), value: 'vertical' },
						]}
						onChange={(value) => setAttributes({ orientation: value })}
					/>

					<SelectControl
						label={__('Tab Style', 'designsetgo')}
						value={tabStyle}
						options={[
							{ label: __('Default', 'designsetgo'), value: 'default' },
							{ label: __('Pills', 'designsetgo'), value: 'pills' },
							{ label: __('Underline', 'designsetgo'), value: 'underline' },
							{ label: __('Minimal', 'designsetgo'), value: 'minimal' },
						]}
						onChange={(value) => setAttributes({ tabStyle: value })}
					/>

					{orientation === 'horizontal' && (
						<SelectControl
							label={__('Alignment', 'designsetgo')}
							value={alignment}
							options={[
								{ label: __('Left', 'designsetgo'), value: 'left' },
								{ label: __('Center', 'designsetgo'), value: 'center' },
								{ label: __('Right', 'designsetgo'), value: 'right' },
								{ label: __('Justified', 'designsetgo'), value: 'justified' },
							]}
							onChange={(value) => setAttributes({ alignment: value })}
						/>
					)}

					<RangeControl
						label={__('Gap Between Tabs', 'designsetgo')}
						value={parseInt(gap)}
						onChange={(value) => setAttributes({ gap: `${value}px` })}
						min={0}
						max={40}
						step={1}
					/>
				</PanelBody>

				<PanelBody title={__('Mobile Settings', 'designsetgo')} initialOpen={false}>
					<RangeControl
						label={__('Mobile Breakpoint (px)', 'designsetgo')}
						value={mobileBreakpoint}
						onChange={(value) => setAttributes({ mobileBreakpoint: value })}
						min={320}
						max={1024}
						step={1}
						help={__('Screen width below which mobile mode activates', 'designsetgo')}
					/>

					<SelectControl
						label={__('Mobile Mode', 'designsetgo')}
						value={mobileMode}
						options={[
							{ label: __('Accordion', 'designsetgo'), value: 'accordion' },
							{ label: __('Dropdown', 'designsetgo'), value: 'dropdown' },
							{ label: __('Tabs (Scrollable)', 'designsetgo'), value: 'tabs' },
						]}
						onChange={(value) => setAttributes({ mobileMode: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Advanced', 'designsetgo')} initialOpen={false}>
					<ToggleControl
						label={__('Enable Deep Linking', 'designsetgo')}
						checked={enableDeepLinking}
						onChange={(value) => setAttributes({ enableDeepLinking: value })}
						help={__(
							'Allow tabs to be accessed via URL hash (e.g., #tab-name)',
							'designsetgo'
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{/* Tab Navigation */}
				<div className="dsg-tabs__nav" role="tablist" aria-label={__('Tabs', 'designsetgo')}>
					{innerBlocks.map((block, index) => {
						const { title, icon, iconPosition, uniqueId: tabId } = block.attributes;
						const isActive = index === activeTab;

						return (
							<button
								key={block.clientId}
								className={`dsg-tabs__tab ${isActive ? 'is-active' : ''} ${
									icon ? `has-icon icon-${iconPosition}` : ''
								}`}
								id={`tab-${tabId}`}
								role="tab"
								aria-selected={isActive}
								aria-controls={`panel-${tabId}`}
								tabIndex={isActive ? 0 : -1}
								data-tab-index={index}
								onClick={() => handleTabClick(index)}
								onKeyDown={(e) => handleKeyDown(e, index)}
							>
								{icon && iconPosition === 'left' && (
									<span className="dsg-tabs__tab-icon">
										<Dashicon icon={icon} size={20} />
									</span>
								)}

								{icon && iconPosition === 'top' && (
									<span className="dsg-tabs__tab-icon-top">
										<Dashicon icon={icon} size={20} />
									</span>
								)}

								<span className="dsg-tabs__tab-title">{title || `Tab ${index + 1}`}</span>

								{icon && iconPosition === 'right' && (
									<span className="dsg-tabs__tab-icon">
										<Dashicon icon={icon} size={20} />
									</span>
								)}
							</button>
						);
					})}
				</div>

				{/* Tab Panels - Use spread props pattern */}
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
