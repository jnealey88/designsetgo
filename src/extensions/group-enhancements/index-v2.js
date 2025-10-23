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
import { InspectorControls } from '@wordpress/block-editor';
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
		} = attributes;

		// Check if WordPress layout is set to grid
		const isGridLayout = layout?.type === 'grid';

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
		});

		return {
			...extraProps,
			className: classes,
		};
	}
);
