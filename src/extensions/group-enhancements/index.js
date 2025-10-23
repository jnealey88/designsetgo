/**
 * Group Block Enhancements
 *
 * Extends the core Group block with DesignSetGo features:
 * - Flexbox/Grid layout controls
 * - Responsive visibility
 * - Animation settings
 *
 * @package DesignSetGo
 */

import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
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
				dsgLayoutType: {
					type: 'string',
					default: 'default',
				},
				dsgFlexDirection: {
					type: 'string',
					default: 'row',
				},
				dsgJustifyContent: {
					type: 'string',
					default: 'flex-start',
				},
				dsgAlignItems: {
					type: 'string',
					default: 'stretch',
				},
				dsgGridColumns: {
					type: 'number',
					default: 3,
				},
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
 */
const withDesignSetGoControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes } = props;

		if (name !== 'core/group') {
			return <BlockEdit {...props} />;
		}

		const {
			dsgLayoutType,
			dsgFlexDirection,
			dsgJustifyContent,
			dsgAlignItems,
			dsgGridColumns,
			dsgHideOnDesktop,
			dsgHideOnTablet,
			dsgHideOnMobile,
		} = attributes;

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__('DesignSetGo Layout', 'designsetgo')}
						initialOpen={false}
					>
						<SelectControl
							label={__('Layout Type', 'designsetgo')}
							value={dsgLayoutType}
							options={[
								{
									label: __('Default', 'designsetgo'),
									value: 'default',
								},
								{
									label: __('Flexbox', 'designsetgo'),
									value: 'flex',
								},
								{
									label: __('Grid', 'designsetgo'),
									value: 'grid',
								},
								{
									label: __('Auto Grid', 'designsetgo'),
									value: 'auto-grid',
								},
							]}
							onChange={(value) =>
								setAttributes({ dsgLayoutType: value })
							}
						/>

						{dsgLayoutType === 'flex' && (
							<>
								<SelectControl
									label={__('Direction', 'designsetgo')}
									value={dsgFlexDirection}
									options={[
										{
											label: __('Row', 'designsetgo'),
											value: 'row',
										},
										{
											label: __(
												'Row Reverse',
												'designsetgo'
											),
											value: 'row-reverse',
										},
										{
											label: __('Column', 'designsetgo'),
											value: 'column',
										},
										{
											label: __(
												'Column Reverse',
												'designsetgo'
											),
											value: 'column-reverse',
										},
									]}
									onChange={(value) =>
										setAttributes({
											dsgFlexDirection: value,
										})
									}
								/>

								<SelectControl
									label={__(
										'Justify Content',
										'designsetgo'
									)}
									value={dsgJustifyContent}
									options={[
										{
											label: __('Start', 'designsetgo'),
											value: 'flex-start',
										},
										{
											label: __('Center', 'designsetgo'),
											value: 'center',
										},
										{
											label: __('End', 'designsetgo'),
											value: 'flex-end',
										},
										{
											label: __(
												'Space Between',
												'designsetgo'
											),
											value: 'space-between',
										},
										{
											label: __(
												'Space Around',
												'designsetgo'
											),
											value: 'space-around',
										},
										{
											label: __(
												'Space Evenly',
												'designsetgo'
											),
											value: 'space-evenly',
										},
									]}
									onChange={(value) =>
										setAttributes({
											dsgJustifyContent: value,
										})
									}
								/>

								<SelectControl
									label={__('Align Items', 'designsetgo')}
									value={dsgAlignItems}
									options={[
										{
											label: __('Start', 'designsetgo'),
											value: 'flex-start',
										},
										{
											label: __('Center', 'designsetgo'),
											value: 'center',
										},
										{
											label: __('End', 'designsetgo'),
											value: 'flex-end',
										},
										{
											label: __('Stretch', 'designsetgo'),
											value: 'stretch',
										},
										{
											label: __('Baseline', 'designsetgo'),
											value: 'baseline',
										},
									]}
									onChange={(value) =>
										setAttributes({ dsgAlignItems: value })
									}
								/>
							</>
						)}

						{dsgLayoutType === 'grid' && (
							<SelectControl
								label={__(
									'Columns (Desktop)',
									'designsetgo'
								)}
								value={dsgGridColumns}
								options={[
									{ label: '1', value: 1 },
									{ label: '2', value: 2 },
									{ label: '3', value: 3 },
									{ label: '4', value: 4 },
									{ label: '5', value: 5 },
									{ label: '6', value: 6 },
								]}
								onChange={(value) =>
									setAttributes({
										dsgGridColumns: parseInt(value),
									})
								}
							/>
						)}
					</PanelBody>

					<PanelBody
						title={__('DesignSetGo Responsive', 'designsetgo')}
						initialOpen={false}
					>
						<ToggleControl
							label={__('Hide on Desktop', 'designsetgo')}
							checked={dsgHideOnDesktop}
							onChange={(value) =>
								setAttributes({ dsgHideOnDesktop: value })
							}
						/>
						<ToggleControl
							label={__('Hide on Tablet', 'designsetgo')}
							checked={dsgHideOnTablet}
							onChange={(value) =>
								setAttributes({ dsgHideOnTablet: value })
							}
						/>
						<ToggleControl
							label={__('Hide on Mobile', 'designsetgo')}
							checked={dsgHideOnMobile}
							onChange={(value) =>
								setAttributes({ dsgHideOnMobile: value })
							}
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
 * Add custom classes to Group block in editor.
 */
const withDesignSetGoClasses = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { name, attributes } = props;

		if (name !== 'core/group') {
			return <BlockListBlock {...props} />;
		}

		const {
			dsgLayoutType,
			dsgHideOnDesktop,
			dsgHideOnTablet,
			dsgHideOnMobile,
		} = attributes;

		const classes = classnames({
			[`dsg-layout-${dsgLayoutType}`]: dsgLayoutType !== 'default',
			'dsg-hide-desktop': dsgHideOnDesktop,
			'dsg-hide-tablet': dsgHideOnTablet,
			'dsg-hide-mobile': dsgHideOnMobile,
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
			dsgLayoutType,
			dsgFlexDirection,
			dsgJustifyContent,
			dsgAlignItems,
			dsgGridColumns,
			dsgHideOnDesktop,
			dsgHideOnTablet,
			dsgHideOnMobile,
		} = attributes;

		// Add classes
		const classes = classnames(extraProps.className, {
			[`dsg-layout-${dsgLayoutType}`]: dsgLayoutType !== 'default',
			'dsg-hide-desktop': dsgHideOnDesktop,
			'dsg-hide-tablet': dsgHideOnTablet,
			'dsg-hide-mobile': dsgHideOnMobile,
		});

		// Add inline styles
		let style = extraProps.style || {};

		if (dsgLayoutType === 'flex') {
			style = {
				...style,
				display: 'flex',
				flexDirection: dsgFlexDirection,
				justifyContent: dsgJustifyContent,
				alignItems: dsgAlignItems,
			};
		} else if (dsgLayoutType === 'grid') {
			style = {
				...style,
				display: 'grid',
				gridTemplateColumns: `repeat(${dsgGridColumns}, 1fr)`,
			};
		} else if (dsgLayoutType === 'auto-grid') {
			style = {
				...style,
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
			};
		}

		return {
			...extraProps,
			className: classes,
			style,
		};
	}
);
