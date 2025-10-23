/**
 * Group Block Enhancements v2
 *
 * Works WITH WordPress's native Group block layout system
 * instead of creating duplicate controls.
 *
 * WordPress Group block already has:
 * - Layout toolbar (Flow, Flex Row, Flex Column, Grid)
 * - Layout panel in sidebar with justify/align controls
 *
 * We ADD:
 * - Grid column controls
 * - Advanced flexbox options
 * - Responsive visibility
 * - Animation settings (future)
 *
 * @package DesignSetGo
 */

import { addFilter } from '@wordpress/hooks';
import { InspectorControls, __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown, __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
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
				// Overlay color attributes
				dsgOverlayColor: {
					type: 'string',
				},
				dsgCustomOverlayColor: {
					type: 'string',
				},
				dsgOverlayOpacity: {
					type: 'number',
					default: 50,
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
		const { name, attributes, setAttributes } = props;

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
			dsgOverlayColor,
			dsgCustomOverlayColor,
			dsgOverlayOpacity,
		} = attributes;

		// Check if WordPress layout is set to grid
		const isGridLayout = layout?.type === 'grid';

		// Get color settings for the color picker
		const colorGradientSettings = useMultipleOriginColorsAndGradients();

		return (
			<>
				<BlockEdit {...props} />
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
								max={6}
								help={__('Number of columns on desktop screens', 'designsetgo')}
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
								help={__('Number of columns on tablet screens', 'designsetgo')}
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
								help={__('Number of columns on mobile screens', 'designsetgo')}
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
							help={__('Hide on screens wider than 1024px', 'designsetgo')}
						/>
						<ToggleControl
							label={__('Hide on Tablet', 'designsetgo')}
							checked={dsgHideOnTablet}
							onChange={(value) =>
								setAttributes({ dsgHideOnTablet: value })
							}
							help={__('Hide on screens 768px - 1023px', 'designsetgo')}
						/>
						<ToggleControl
							label={__('Hide on Mobile', 'designsetgo')}
							checked={dsgHideOnMobile}
							onChange={(value) =>
								setAttributes({ dsgHideOnMobile: value })
							}
							help={__('Hide on screens smaller than 768px', 'designsetgo')}
						/>
					</PanelBody>

					{/* Overlay color - always available */}
					<PanelBody
						title={__('Overlay Color', 'designsetgo')}
						initialOpen={false}
					>
						<p className="components-base-control__help">
							{__(
								'Add an overlay color on top of the background image, similar to the Cover block.',
								'designsetgo'
							)}
						</p>
						<ColorGradientSettingsDropdown
							settings={[
								{
									label: __('Overlay Color', 'designsetgo'),
									colorValue: dsgCustomOverlayColor,
									onColorChange: (value) => {
										setAttributes({
											dsgCustomOverlayColor: value,
											dsgOverlayColor: undefined,
										});
									},
								},
							]}
							panelId={props.clientId}
							{...colorGradientSettings}
						/>
						{(dsgOverlayColor || dsgCustomOverlayColor) && (
							<RangeControl
								label={__('Overlay Opacity', 'designsetgo')}
								value={dsgOverlayOpacity}
								onChange={(value) =>
									setAttributes({ dsgOverlayOpacity: value })
								}
								min={0}
								max={100}
								step={5}
								help={__('Adjust the opacity of the overlay color (0 = transparent, 100 = opaque)', 'designsetgo')}
							/>
						)}
					</PanelBody>
				</InspectorControls>
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
			dsgOverlayColor,
			dsgCustomOverlayColor,
		} = attributes;

		const hasOverlay = dsgOverlayColor || dsgCustomOverlayColor;

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
			'has-dsg-overlay': hasOverlay,
		});

		return <BlockListBlock {...props} className={classes} />;
	};
}, 'withDesignSetGoClasses');

addFilter(
	'editor.BlockListBlock',
	'designsetgo/group-classes',
	withDesignSetGoClasses
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
			dsgOverlayColor,
			dsgCustomOverlayColor,
			dsgOverlayOpacity,
		} = attributes;

		const hasOverlay = dsgOverlayColor || dsgCustomOverlayColor;

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
			'has-dsg-overlay': hasOverlay,
		});

		// Add overlay data attributes for frontend rendering
		if (hasOverlay) {
			extraProps['data-overlay-color'] = dsgCustomOverlayColor || dsgOverlayColor;
			extraProps['data-overlay-opacity'] = dsgOverlayOpacity;
		}

		return {
			...extraProps,
			className: classes,
		};
	}
);
