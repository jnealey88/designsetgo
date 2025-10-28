/**
 * Tab Block - Edit Component
 *
 * Individual tab panel (child block)
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	Dashicon,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

// Common icon options for tab navigation
const ICON_OPTIONS = [
	{ label: __('None', 'designsetgo'), value: '' },
	{ label: __('★ Star', 'designsetgo'), value: 'star-filled' },
	{ label: __('❤ Heart', 'designsetgo'), value: 'heart' },
	{ label: __('⚙ Settings', 'designsetgo'), value: 'admin-settings' },
	{ label: __('👤 User', 'designsetgo'), value: 'admin-users' },
	{ label: __('📊 Chart', 'designsetgo'), value: 'chart-bar' },
	{ label: __('✓ Check', 'designsetgo'), value: 'yes-alt' },
	{ label: __('✉ Email', 'designsetgo'), value: 'email' },
	{ label: __('🏠 Home', 'designsetgo'), value: 'admin-home' },
	{ label: __('🔒 Lock', 'designsetgo'), value: 'lock' },
	{ label: __('📁 Folder', 'designsetgo'), value: 'portfolio' },
	{ label: __('📷 Camera', 'designsetgo'), value: 'camera' },
	{ label: __('🔍 Search', 'designsetgo'), value: 'search' },
	{ label: __('⚡ Lightning', 'designsetgo'), value: 'lightbulb' },
	{ label: __('🎯 Target', 'designsetgo'), value: 'location' },
];

export default function Edit({ attributes, setAttributes, clientId, context }) {
	const { uniqueId, title, icon, iconPosition } = attributes;

	// Get context from parent Tabs block
	const activeTab = context['designsetgo/tabs/activeTab'] || 0;
	const tabStyle = context['designsetgo/tabs/tabStyle'] || 'default';

	// Generate unique ID on mount
	useEffect(() => {
		if (!uniqueId) {
			setAttributes({ uniqueId: clientId.substring(0, 8) });
		}
	}, [uniqueId, clientId, setAttributes]);

	// Generate anchor from title if not set
	useEffect(() => {
		if (title && !attributes.anchor) {
			const anchor = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '');
			setAttributes({ anchor });
		}
	}, [title, attributes.anchor, setAttributes]);

	// Get this tab's index from parent
	const tabIndex = wp.data
		.select('core/block-editor')
		.getBlockOrder(
			wp.data.select('core/block-editor').getBlockRootClientId(clientId)
		)
		.indexOf(clientId);

	const isActive = tabIndex === activeTab;

	const blockProps = useBlockProps({
		className: `dsg-tab dsg-tab--${tabStyle} ${isActive ? 'is-active' : 'is-inactive'}`,
		role: 'tabpanel',
		'aria-labelledby': `tab-${uniqueId}`,
		id: `panel-${uniqueId}`,
		'data-tab-active': isActive,
		style: {
			display: isActive ? 'block' : 'none',
		},
	});

	// Use useInnerBlocksProps for proper WordPress integration
	// IMPORTANT: Always show appender when tab is active so users can add content
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dsg-tab__content',
		},
		{
			templateLock: false,
			renderAppender: isActive
				? wp.blockEditor.InnerBlocks.ButtonBlockAppender
				: false,
		}
	);

	// Don't render inactive tabs at all - improves performance
	if (!isActive) {
		return (
			<>
				<InspectorControls>
					<PanelBody
						title={__('Tab Settings', 'designsetgo')}
						initialOpen={true}
					>
						<TextControl
							label={__('Tab Title', 'designsetgo')}
							value={title}
							onChange={(value) =>
								setAttributes({ title: value })
							}
							help={__(
								'The title shown in the tab navigation',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={__('Icon', 'designsetgo')}
							value={icon}
							onChange={(value) => setAttributes({ icon: value })}
							help={__(
								'Font Awesome icon name (e.g., "star")',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>

						{icon && (
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
									{
										label: __('Top', 'designsetgo'),
										value: 'top',
									},
								]}
								onChange={(value) =>
									setAttributes({ iconPosition: value })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						)}

						<TextControl
							label={__('Anchor (URL Hash)', 'designsetgo')}
							value={attributes.anchor}
							onChange={(value) =>
								setAttributes({ anchor: value })
							}
							help={__(
								'URL-friendly identifier for deep linking',
								'designsetgo'
							)}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="dsg-tab__inactive-notice">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						<span>
							{__(
								'Click the tab above to edit its content',
								'designsetgo'
							)}
						</span>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Tab Settings', 'designsetgo')}
					initialOpen={true}
				>
					<TextControl
						label={__('Tab Title', 'designsetgo')}
						value={title}
						onChange={(value) => setAttributes({ title: value })}
						help={__(
							'The title shown in the tab navigation',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Icon', 'designsetgo')}
						value={icon}
						options={ICON_OPTIONS}
						onChange={(value) => setAttributes({ icon: value })}
						help={__(
							'Choose an icon to display with the tab',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{icon && (
						<div
							style={{
								marginBottom: '16px',
								padding: '12px',
								background: '#f0f0f0',
								borderRadius: '4px',
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
							}}
						>
							<Dashicon icon={icon} size={24} />
							<span style={{ fontSize: '14px', color: '#555' }}>
								{__('Icon preview', 'designsetgo')}
							</span>
						</div>
					)}

					{icon && (
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
								{
									label: __('Top', 'designsetgo'),
									value: 'top',
								},
							]}
							onChange={(value) =>
								setAttributes({ iconPosition: value })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					)}

					<TextControl
						label={__('Anchor (URL Hash)', 'designsetgo')}
						value={attributes.anchor}
						onChange={(value) => setAttributes({ anchor: value })}
						help={__(
							'URL-friendly identifier for deep linking',
							'designsetgo'
						)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{/* Use spread props pattern - InnerBlocks will show appender */}
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
