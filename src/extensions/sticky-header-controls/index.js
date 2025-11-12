/**
 * Sticky Header Controls Extension
 *
 * Adds sticky header configuration controls to template parts in the Site Editor.
 *
 * @package
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

/**
 * Add sticky header attributes to template parts
 *
 * @param {Object} settings Block settings object
 * @param {string} name     Block name
 * @return {Object} Modified settings object
 */
function addStickyHeaderAttributes(settings, name) {
	if (name !== 'core/template-part') {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgStickyEnabled: {
				type: 'boolean',
				default: false,
			},
			dsgStickyShadow: {
				type: 'string',
				default: 'medium',
			},
			dsgStickyShrink: {
				type: 'boolean',
				default: false,
			},
			dsgStickyShrinkAmount: {
				type: 'number',
				default: 15,
			},
			dsgStickyHideOnScroll: {
				type: 'boolean',
				default: false,
			},
			dsgStickyBackground: {
				type: 'boolean',
				default: false,
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'designsetgo/sticky-header-attributes',
	addStickyHeaderAttributes
);

/**
 * Add sticky header controls to template parts
 */
const withStickyHeaderControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes } = props;

		// Only add controls to template parts
		if (name !== 'core/template-part') {
			return <BlockEdit {...props} />;
		}

		// Only show for header template parts
		const isHeader =
			attributes.area === 'header' ||
			attributes.slug?.includes('header') ||
			attributes.theme?.includes('header');

		if (!isHeader) {
			return <BlockEdit {...props} />;
		}

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__('Sticky Header', 'designsetgo')}
						initialOpen={false}
					>
						<p className="components-base-control__help">
							{__(
								'Configure sticky header behavior for this template part.',
								'designsetgo'
							)}
						</p>

						<ToggleControl
							label={__('Enable Sticky Header', 'designsetgo')}
							help={__(
								'Make this header stick to the top when scrolling.',
								'designsetgo'
							)}
							checked={attributes.dsgStickyEnabled || false}
							onChange={(value) =>
								setAttributes({ dsgStickyEnabled: value })
							}
						/>

						{attributes.dsgStickyEnabled && (
							<>
								<SelectControl
									label={__('Shadow Size', 'designsetgo')}
									value={
										attributes.dsgStickyShadow || 'medium'
									}
									options={[
										{
											label: __('None', 'designsetgo'),
											value: 'none',
										},
										{
											label: __('Small', 'designsetgo'),
											value: 'small',
										},
										{
											label: __('Medium', 'designsetgo'),
											value: 'medium',
										},
										{
											label: __('Large', 'designsetgo'),
											value: 'large',
										},
									]}
									onChange={(value) =>
										setAttributes({
											dsgStickyShadow: value,
										})
									}
									help={__(
										'Shadow depth when scrolled.',
										'designsetgo'
									)}
								/>

								<ToggleControl
									label={__(
										'Shrink on Scroll',
										'designsetgo'
									)}
									checked={
										attributes.dsgStickyShrink || false
									}
									onChange={(value) =>
										setAttributes({
											dsgStickyShrink: value,
										})
									}
								/>

								{attributes.dsgStickyShrink && (
									<RangeControl
										label={__(
											'Shrink Amount (%)',
											'designsetgo'
										)}
										value={
											attributes.dsgStickyShrinkAmount ||
											15
										}
										onChange={(value) =>
											setAttributes({
												dsgStickyShrinkAmount: value,
											})
										}
										min={5}
										max={50}
										step={5}
									/>
								)}

								<ToggleControl
									label={__(
										'Hide on Scroll Down',
										'designsetgo'
									)}
									checked={
										attributes.dsgStickyHideOnScroll ||
										false
									}
									onChange={(value) =>
										setAttributes({
											dsgStickyHideOnScroll: value,
										})
									}
									help={__(
										'Auto-hide when scrolling down, show when scrolling up.',
										'designsetgo'
									)}
								/>

								<ToggleControl
									label={__(
										'Background on Scroll',
										'designsetgo'
									)}
									checked={
										attributes.dsgStickyBackground || false
									}
									onChange={(value) =>
										setAttributes({
											dsgStickyBackground: value,
										})
									}
									help={__(
										'Use global background color setting when scrolled.',
										'designsetgo'
									)}
								/>

								<p
									className="components-base-control__help"
									style={{ marginTop: '16px' }}
								>
									{__(
										'Additional settings like z-index, transition speed, and background color can be configured in DesignSetGo Settings.',
										'designsetgo'
									)}
								</p>
							</>
						)}
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withStickyHeaderControls');

addFilter(
	'editor.BlockEdit',
	'designsetgo/sticky-header-controls',
	withStickyHeaderControls
);

/**
 * Apply sticky header classes to template parts on save
 *
 * @param {Object} extraProps Extra props object
 * @param {Object} blockType  Block type object
 * @param {Object} attributes Block attributes
 * @return {Object} Modified extra props
 */
function applyStickyHeaderClasses(extraProps, blockType, attributes) {
	if (blockType.name !== 'core/template-part') {
		return extraProps;
	}

	if (!attributes.dsgStickyEnabled) {
		return extraProps;
	}

	const classes = ['dsg-sticky-header-enabled'];

	// Add shadow class if not 'none'
	if (attributes.dsgStickyShadow && attributes.dsgStickyShadow !== 'none') {
		classes.push(`dsg-sticky-shadow-${attributes.dsgStickyShadow}`);
	}

	// Add shrink class
	if (attributes.dsgStickyShrink) {
		classes.push('dsg-sticky-shrink');
	}

	// Add hide on scroll class
	if (attributes.dsgStickyHideOnScroll) {
		classes.push('dsg-sticky-hide-on-scroll-down');
	}

	// Add background on scroll class
	if (attributes.dsgStickyBackground) {
		classes.push('dsg-sticky-bg-on-scroll');
	}

	return {
		...extraProps,
		className: `${extraProps.className || ''} ${classes.join(' ')}`.trim(),
		'data-dsg-shrink-amount': attributes.dsgStickyShrinkAmount || 15,
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/sticky-header-classes',
	applyStickyHeaderClasses
);
