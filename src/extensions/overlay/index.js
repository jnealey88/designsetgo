/**
 * Overlay Extension
 *
 * Adds overlay capability to all WordPress blocks.
 *
 * @package DesignSetGo
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls, PanelColorSettings, useSettings } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Blocks excluded from overlay extension
 */
const EXCLUDED_BLOCKS = [
	'core/freeform',
	'core/template-part',
	'core/post-content',
];

/**
 * Add overlay attributes to all blocks
 *
 * @param {Object} settings Block settings
 * @param {string} name     Block name
 * @return {Object} Modified settings
 */
function addOverlayAttributes(settings, name) {
	if (EXCLUDED_BLOCKS.includes(name)) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgEnableOverlay: {
				type: 'boolean',
				default: false,
			},
			dsgOverlayColor: {
				type: 'string',
				default: '',
			},
			dsgOverlayOpacity: {
				type: 'number',
				default: 75,
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/overlay-attributes',
	addOverlayAttributes
);

/**
 * Add overlay controls to block inspector
 */
const withOverlayControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name } = props;
		const { dsgEnableOverlay, dsgOverlayColor, dsgOverlayOpacity } = attributes;

		if (EXCLUDED_BLOCKS.includes(name)) {
			return <BlockEdit {...props} />;
		}

		// Get color settings from WordPress (6.5+)
		const [colorSettings] = useSettings('color.palette');

		// Get default overlay color (theme accent-5 or black)
		const themeColors = colorSettings?.theme || [];
		const accent5Color = themeColors.find((color) => color.slug === 'accent-5');
		const defaultOverlayColor = accent5Color?.color || '#000000';

		// Use custom color if set, otherwise use default
		const effectiveOverlayColor = dsgOverlayColor || defaultOverlayColor;

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__('Overlay', 'designsetgo')}
						initialOpen={false}
					>
						<ToggleControl
							label={__('Enable Overlay', 'designsetgo')}
							checked={dsgEnableOverlay}
							onChange={(value) => setAttributes({ dsgEnableOverlay: value })}
							help={
								dsgEnableOverlay
									? __('Overlay is enabled', 'designsetgo')
									: __('Add a color overlay to this block', 'designsetgo')
							}
							__nextHasNoMarginBottom
						/>

						{dsgEnableOverlay && (
							<Fragment>
								<PanelColorSettings
									title={__('Overlay Color', 'designsetgo')}
									colorSettings={[
										{
											value: effectiveOverlayColor,
											onChange: (value) =>
												setAttributes({ dsgOverlayColor: value || '' }),
											label: __('Color', 'designsetgo'),
											colors: colorSettings,
										},
									]}
									initialOpen={false}
								>
									<p className="components-base-control__help">
										{__(
											'Choose overlay color. Defaults to theme accent color or black.',
											'designsetgo'
										)}
									</p>
								</PanelColorSettings>

								<RangeControl
									label={__('Overlay Opacity', 'designsetgo')}
									value={dsgOverlayOpacity}
									onChange={(value) =>
										setAttributes({ dsgOverlayOpacity: value })
									}
									min={0}
									max={100}
									step={5}
									help={__('Transparency of the overlay (0 = transparent, 100 = opaque)', 'designsetgo')}
									__next40pxDefaultSize
									__nextHasNoMarginBottom
								/>
							</Fragment>
						)}
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withOverlayControls');

addFilter(
	'editor.BlockEdit',
	'designsetgo/overlay-controls',
	withOverlayControls
);

/**
 * Add overlay wrapper in editor
 */
const withOverlayEdit = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { attributes, name } = props;
		const { dsgEnableOverlay, dsgOverlayColor, dsgOverlayOpacity } = attributes;

		if (EXCLUDED_BLOCKS.includes(name) || !dsgEnableOverlay) {
			return <BlockListBlock {...props} />;
		}

		// Get default overlay color
		const defaultOverlayColor = '#000000';
		const effectiveOverlayColor = dsgOverlayColor || defaultOverlayColor;

		// Convert hex to rgba
		const hex = effectiveOverlayColor.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);
		const a = (dsgOverlayOpacity || 75) / 100;
		const overlayRgba = `rgba(${r}, ${g}, ${b}, ${a})`;

		return (
			<div className="dsg-has-overlay">
				<div
					className="dsg-overlay-editor"
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: overlayRgba,
						zIndex: 1,
						pointerEvents: 'none',
					}}
				/>
				<BlockListBlock {...props} />
			</div>
		);
	};
}, 'withOverlayEdit');

addFilter(
	'editor.BlockListBlock',
	'designsetgo/overlay-edit',
	withOverlayEdit
);

/**
 * Add overlay classes and data attributes to save
 */
function addOverlaySaveProps(props, blockType, attributes) {
	const { dsgEnableOverlay, dsgOverlayColor, dsgOverlayOpacity } = attributes;

	if (!dsgEnableOverlay) {
		return props;
	}

	return {
		...props,
		className: `${props.className || ''} dsg-has-overlay`.trim(),
		'data-overlay-color': dsgOverlayColor || '',
		'data-overlay-opacity': dsgOverlayOpacity || 75,
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/overlay-save-props',
	addOverlaySaveProps
);
