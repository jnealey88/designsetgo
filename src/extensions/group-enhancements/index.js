/**
 * Group Block Enhancements
 *
 * Works WITH WordPress's native Group block layout system
 * instead of creating duplicate controls.
 *
 * WordPress Group block already has:
 * - Layout toolbar (Flow, Flex Row, Flex Column, Grid)
 * - Layout panel in sidebar with justify/align controls
 *
 * We ADD:
 * - Grid column controls (responsive)
 * - Responsive visibility controls
 * - Background overlay toggle
 * - Clickable group functionality
 *
 * @package DesignSetGo
 */

// Import styles for this extension
import './styles.scss';
import './editor.scss';

// Import frontend JavaScript
import './frontend.js';

import { addFilter } from '@wordpress/hooks';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	ExternalLink,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect, useRef } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';
import classnames from 'classnames';

/**
 * Add custom attributes to Group block.
 */
addFilter(
	'blocks.registerBlockType',
	'designsetgo/group-attributes',
	(settings, name) => {
		if (name !== 'core/group') {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				// Grid enhancements
				dsgGridColumns: {
					type: 'number',
					default: 3,
				},
				dsgGridColumnsTablet: {
					type: 'number',
					default: 2,
				},
				dsgGridColumnsMobile: {
					type: 'number',
					default: 1,
				},
				// Responsive visibility
				dsgHideOnDesktop: {
					type: 'boolean',
					default: false,
				},
				dsgHideOnTablet: {
					type: 'boolean',
					default: false,
				},
				dsgHideOnMobile: {
					type: 'boolean',
					default: false,
				},
				// Overlay toggle
				dsgEnableOverlay: {
					type: 'boolean',
					default: false,
				},
				// Link/URL attributes
				dsgLinkUrl: {
					type: 'string',
					default: '',
				},
				dsgLinkTarget: {
					type: 'boolean',
					default: false,
				},
				dsgLinkRel: {
					type: 'string',
					default: '',
				},
			},
		};
	}
);

/**
 * Add DesignSetGo controls to Group block.
 * Only shows relevant controls based on WordPress's native layout choice.
 */
const withDesignSetGoControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes, clientId } = props;

		if (name !== 'core/group') {
			return <BlockEdit {...props} />;
		}

		const {
			layout,
			dsgGridColumns,
			dsgGridColumnsTablet,
			dsgGridColumnsMobile,
			dsgHideOnDesktop,
			dsgHideOnTablet,
			dsgHideOnMobile,
			dsgEnableOverlay,
			dsgLinkUrl,
			dsgLinkTarget,
			dsgLinkRel,
		} = attributes;

		// Check if WordPress layout is set to grid
		const isGridLayout = layout?.type === 'grid';

		// Sync WordPress columnCount with our dsgGridColumns (desktop)
		// When WordPress column changes, update ours
		useEffect(() => {
			if (isGridLayout) {
				const wpColumnCount = layout?.columnCount;
				if (wpColumnCount && wpColumnCount !== dsgGridColumns) {
					setAttributes({ dsgGridColumns: wpColumnCount });
				}
			}
		}, [isGridLayout, layout?.columnCount]);

		// When our desktop column changes, update WordPress
		useEffect(() => {
			if (isGridLayout && dsgGridColumns) {
				const wpColumnCount = layout?.columnCount;
				if (dsgGridColumns !== wpColumnCount) {
					setAttributes({
						layout: {
							...layout,
							columnCount: dsgGridColumns,
						},
					});
				}
			}
		}, [dsgGridColumns]);

		// Ensure background image has proper defaults (50% 50% position)
		useEffect(() => {
			const bgImage = attributes.style?.background?.backgroundImage;
			const bgPosition = attributes.style?.background?.backgroundPosition;

			// If background image exists but position isn't set, default to center
			if (bgImage && !bgPosition) {
				setAttributes({
					style: {
						...attributes.style,
						background: {
							...attributes.style.background,
							backgroundPosition: '50% 50%',
						},
					},
				});
			}
		}, [
			attributes.style?.background?.backgroundImage,
			attributes.style,
			setAttributes,
		]);

		// Set colors when overlay is enabled, clear when disabled
		useEffect(() => {
			const innerBlocks = select('core/block-editor').getBlocks(clientId);

			if (dsgEnableOverlay) {
				// ENABLE: Set white text and white/black buttons
				const setColors = (blocks) => {
					blocks.forEach((block) => {
						const blockId = block.clientId;

						// Set button colors: white background, black text
						if (block.name === 'core/button') {
							dispatch('core/block-editor').updateBlockAttributes(
								blockId,
								{
									backgroundColor: 'white',
									textColor: 'black',
									style: {
										...block.attributes.style,
										color: {
											...block.attributes.style?.color,
											background: '#ffffff',
											text: '#000000',
										},
									},
								}
							);
						}

						// Set text colors: white text
						if (
							block.name === 'core/heading' ||
							block.name === 'core/paragraph' ||
							block.name === 'core/list' ||
							block.name === 'core/list-item'
						) {
							dispatch('core/block-editor').updateBlockAttributes(
								blockId,
								{
									textColor: 'white',
									style: {
										...block.attributes.style,
										color: {
											...block.attributes.style?.color,
											text: '#ffffff',
										},
									},
								}
							);
						}

						// Recurse into nested blocks
						if (block.innerBlocks && block.innerBlocks.length > 0) {
							setColors(block.innerBlocks);
						}
					});
				};

				setColors(innerBlocks);
			} else {
				// DISABLE: Clear all white text and white/black button colors
				const clearColors = (blocks) => {
					blocks.forEach((block) => {
						const blockId = block.clientId;
						const attrs = block.attributes;

						// Clear button colors if they're white background + black text
						if (block.name === 'core/button') {
							const hasWhiteButton =
								(attrs.backgroundColor === 'white' ||
									attrs.style?.color?.background ===
										'#ffffff') &&
								(attrs.textColor === 'black' ||
									attrs.style?.color?.text === '#000000');

							if (hasWhiteButton) {
								const newStyle = { ...attrs.style };
								if (newStyle.color) {
									delete newStyle.color.background;
									delete newStyle.color.text;
									if (
										Object.keys(newStyle.color).length === 0
									) {
										delete newStyle.color;
									}
								}

								dispatch(
									'core/block-editor'
								).updateBlockAttributes(blockId, {
									backgroundColor: undefined,
									textColor: undefined,
									style:
										Object.keys(newStyle).length > 0
											? newStyle
											: undefined,
								});
							}
						}

						// Clear text colors if they're white
						if (
							block.name === 'core/heading' ||
							block.name === 'core/paragraph' ||
							block.name === 'core/list' ||
							block.name === 'core/list-item'
						) {
							const hasWhiteText =
								attrs.textColor === 'white' ||
								attrs.style?.color?.text === '#ffffff';

							if (hasWhiteText) {
								const newStyle = { ...attrs.style };
								if (newStyle.color) {
									delete newStyle.color.text;
									if (
										Object.keys(newStyle.color).length === 0
									) {
										delete newStyle.color;
									}
								}

								dispatch(
									'core/block-editor'
								).updateBlockAttributes(blockId, {
									textColor: undefined,
									style:
										Object.keys(newStyle).length > 0
											? newStyle
											: undefined,
								});
							}
						}

						// Recurse into nested blocks
						if (block.innerBlocks && block.innerBlocks.length > 0) {
							clearColors(block.innerBlocks);
						}
					});
				};

				clearColors(innerBlocks);
			}
		}, [dsgEnableOverlay, clientId]);

		return (
			<>
				<BlockEdit {...props} />

				{/* Add overlay toggle to block toolbar when background image exists */}
				{attributes.style?.background?.backgroundImage && (
					<BlockControls>
						<ToolbarGroup>
							<ToolbarButton
								icon="cover-image"
								label={__('Background Overlay', 'designsetgo')}
								isActive={dsgEnableOverlay}
								onClick={() => setAttributes({ dsgEnableOverlay: !dsgEnableOverlay })}
							/>
						</ToolbarGroup>
					</BlockControls>
				)}

				<InspectorControls>
					{/* Only show grid controls if WordPress layout is grid */}
					{isGridLayout && (
						<PanelBody
							title={__('Grid Columns', 'designsetgo')}
							initialOpen={true}
						>
							<p className="components-base-control__help">
								{__(
									'Customize column count per device. WordPress grid layout must be active.',
									'designsetgo'
								)}
							</p>
							<RangeControl
								label={__('Desktop Columns', 'designsetgo')}
								value={dsgGridColumns}
								onChange={(value) =>
									setAttributes({ dsgGridColumns: value })
								}
								min={1}
								max={16}
								help={__(
									'Number of columns on desktop screens (synced with WordPress grid)',
									'designsetgo'
								)}
							/>
							<RangeControl
								label={__('Tablet Columns', 'designsetgo')}
								value={dsgGridColumnsTablet}
								onChange={(value) =>
									setAttributes({
										dsgGridColumnsTablet: value,
									})
								}
								min={1}
								max={4}
								help={__(
									'Number of columns on tablet screens',
									'designsetgo'
								)}
							/>
							<RangeControl
								label={__('Mobile Columns', 'designsetgo')}
								value={dsgGridColumnsMobile}
								onChange={(value) =>
									setAttributes({
										dsgGridColumnsMobile: value,
									})
								}
								min={1}
								max={2}
								help={__(
									'Number of columns on mobile screens',
									'designsetgo'
								)}
							/>
						</PanelBody>
					)}

					{/* Responsive visibility - always available */}
					<PanelBody
						title={__('Responsive Visibility', 'designsetgo')}
						initialOpen={false}
					>
						<p className="components-base-control__help">
							{__(
								'Hide this block on specific devices.',
								'designsetgo'
							)}
						</p>
						<ToggleControl
							label={__('Hide on Desktop', 'designsetgo')}
							checked={dsgHideOnDesktop}
							onChange={(value) =>
								setAttributes({ dsgHideOnDesktop: value })
							}
							help={__(
								'Hide on screens wider than 1024px',
								'designsetgo'
							)}
						/>
						<ToggleControl
							label={__('Hide on Tablet', 'designsetgo')}
							checked={dsgHideOnTablet}
							onChange={(value) =>
								setAttributes({ dsgHideOnTablet: value })
							}
							help={__(
								'Hide on screens 768px - 1023px',
								'designsetgo'
							)}
						/>
						<ToggleControl
							label={__('Hide on Mobile', 'designsetgo')}
							checked={dsgHideOnMobile}
							onChange={(value) =>
								setAttributes({ dsgHideOnMobile: value })
							}
							help={__(
								'Hide on screens smaller than 768px',
								'designsetgo'
							)}
						/>
					</PanelBody>

					{/* Link/URL controls - make entire group clickable */}
					<PanelBody
						title={__('Link Settings', 'designsetgo')}
						initialOpen={false}
					>
						<p className="components-base-control__help">
							{__(
								'Make the entire group block clickable. Perfect for card designs.',
								'designsetgo'
							)}
						</p>
						<TextControl
							label={__('URL', 'designsetgo')}
							value={dsgLinkUrl}
							onChange={(value) =>
								setAttributes({ dsgLinkUrl: value })
							}
							placeholder="https://example.com"
							help={__(
								'Enter the destination URL',
								'designsetgo'
							)}
						/>
						{dsgLinkUrl && (
							<>
								<ToggleControl
									label={__('Open in new tab', 'designsetgo')}
									checked={dsgLinkTarget}
									onChange={(value) =>
										setAttributes({ dsgLinkTarget: value })
									}
									help={__(
										'Open link in a new browser tab',
										'designsetgo'
									)}
								/>
								<TextControl
									label={__('Link Rel', 'designsetgo')}
									value={dsgLinkRel}
									onChange={(value) =>
										setAttributes({ dsgLinkRel: value })
									}
									placeholder="nofollow noopener"
									help={__(
										'Add rel attribute (e.g., nofollow, sponsored)',
										'designsetgo'
									)}
								/>
								<div style={{ marginTop: '16px' }}>
									<ExternalLink href={dsgLinkUrl}>
										{__('Preview link', 'designsetgo')}
									</ExternalLink>
								</div>
							</>
						)}
					</PanelBody>
				</InspectorControls>

				{/* Overlay toggle - only show if background image is set */}
				{attributes.style?.background?.backgroundImage && (
					<InspectorControls>
						<PanelBody
							title={__('Background Overlay', 'designsetgo')}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Enable Dark Overlay', 'designsetgo')}
								checked={dsgEnableOverlay}
								onChange={(value) =>
									setAttributes({ dsgEnableOverlay: value })
								}
								help={__(
									'Add a dark overlay (75% opacity) over the background image',
									'designsetgo'
								)}
							/>
						</PanelBody>
					</InspectorControls>
				)}
			</>
		);
	};
}, 'withDesignSetGoControls');

addFilter(
	'editor.BlockEdit',
	'designsetgo/group-controls',
	withDesignSetGoControls
);

/**
 * Add custom classes to Group block wrapper.
 */
const withDesignSetGoClasses = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { name, attributes } = props;

		if (name !== 'core/group') {
			return <BlockListBlock {...props} />;
		}

		const {
			layout,
			dsgGridColumns,
			dsgGridColumnsTablet,
			dsgGridColumnsMobile,
			dsgHideOnDesktop,
			dsgHideOnTablet,
			dsgHideOnMobile,
			dsgEnableOverlay,
			dsgLinkUrl,
		} = attributes;

		const classes = classnames({
			// Add responsive visibility classes
			'dsg-hide-desktop': dsgHideOnDesktop,
			'dsg-hide-tablet': dsgHideOnTablet,
			'dsg-hide-mobile': dsgHideOnMobile,
			// Add grid column classes if grid layout
			'dsg-grid-enhanced': layout?.type === 'grid',
			[`dsg-grid-cols-${dsgGridColumns}`]:
				layout?.type === 'grid' && dsgGridColumns,
			[`dsg-grid-cols-tablet-${dsgGridColumnsTablet}`]:
				layout?.type === 'grid' && dsgGridColumnsTablet,
			[`dsg-grid-cols-mobile-${dsgGridColumnsMobile}`]:
				layout?.type === 'grid' && dsgGridColumnsMobile,
			// Add overlay class
			'has-dsg-overlay': dsgEnableOverlay,
			// Add clickable class
			'dsg-clickable': dsgLinkUrl,
		});

		return <BlockListBlock {...props} className={classes} />;
	};
}, 'withDesignSetGoClasses');

addFilter(
	'editor.BlockListBlock',
	'designsetgo/group-classes',
	withDesignSetGoClasses,
	20
);

/**
 * Add custom props to Group block on save.
 */
addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/group-save-props',
	(extraProps, blockType, attributes) => {
		if (blockType.name !== 'core/group') {
			return extraProps;
		}

		const {
			layout,
			dsgGridColumns,
			dsgGridColumnsTablet,
			dsgGridColumnsMobile,
			dsgHideOnDesktop,
			dsgHideOnTablet,
			dsgHideOnMobile,
			dsgEnableOverlay,
			dsgLinkUrl,
			dsgLinkTarget,
			dsgLinkRel,
		} = attributes;

		// Add classes
		const classes = classnames(extraProps.className, {
			'dsg-hide-desktop': dsgHideOnDesktop,
			'dsg-hide-tablet': dsgHideOnTablet,
			'dsg-hide-mobile': dsgHideOnMobile,
			'dsg-grid-enhanced': layout?.type === 'grid',
			[`dsg-grid-cols-${dsgGridColumns}`]:
				layout?.type === 'grid' && dsgGridColumns,
			[`dsg-grid-cols-tablet-${dsgGridColumnsTablet}`]:
				layout?.type === 'grid' && dsgGridColumnsTablet,
			[`dsg-grid-cols-mobile-${dsgGridColumnsMobile}`]:
				layout?.type === 'grid' && dsgGridColumnsMobile,
			'has-dsg-overlay': dsgEnableOverlay,
			'dsg-clickable': dsgLinkUrl,
		});

		// Add link data attributes for frontend rendering
		if (dsgLinkUrl) {
			extraProps['data-link-url'] = dsgLinkUrl;
			if (dsgLinkTarget) {
				extraProps['data-link-target'] = '_blank';
			}
			if (dsgLinkRel) {
				extraProps['data-link-rel'] = dsgLinkRel;
			}
		}

		return {
			...extraProps,
			className: classes,
		};
	}
);
