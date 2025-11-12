/**
 * Responsive Visibility Extension
 *
 * Adds device-based visibility controls to all blocks (core and custom).
 * Allows users to hide blocks on desktop, tablet, and/or mobile devices.
 *
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Desktop: ≥ 1024px
 *
 * @since 1.0.0
 */

import './editor.scss';

import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Add responsive visibility attributes to all blocks
 *
 * @param {Object} settings - Block settings
 * @return {Object} Modified block settings
 */
function addResponsiveVisibilityAttributes(settings) {
	return {
		...settings,
		attributes: {
			...settings.attributes,
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

addFilter(
	'blocks.registerBlockType',
	'designsetgo/add-responsive-visibility-attributes',
	addResponsiveVisibilityAttributes
);

/**
 * Add responsive visibility controls to block inspector
 */
const withResponsiveVisibilityControl = createHigherOrderComponent(
	(BlockEdit) => {
		return (props) => {
			const { attributes, setAttributes } = props;
			const { dsgHideOnDesktop, dsgHideOnTablet, dsgHideOnMobile } =
				attributes;

			return (
				<>
					<BlockEdit {...props} />
					<InspectorControls>
						<PanelBody
							title={__(
								'Responsive Visibility',
								'designsetgo'
							)}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Hide on Desktop', 'designsetgo')}
								help={__(
									'Hide this block on desktop devices (≥1024px)',
									'designsetgo'
								)}
								checked={dsgHideOnDesktop}
								onChange={(value) =>
									setAttributes({ dsgHideOnDesktop: value })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Hide on Tablet', 'designsetgo')}
								help={__(
									'Hide this block on tablet devices (768px-1023px)',
									'designsetgo'
								)}
								checked={dsgHideOnTablet}
								onChange={(value) =>
									setAttributes({ dsgHideOnTablet: value })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Hide on Mobile', 'designsetgo')}
								help={__(
									'Hide this block on mobile devices (<768px)',
									'designsetgo'
								)}
								checked={dsgHideOnMobile}
								onChange={(value) =>
									setAttributes({ dsgHideOnMobile: value })
								}
								__nextHasNoMarginBottom
							/>
						</PanelBody>
					</InspectorControls>
				</>
			);
		};
	},
	'withResponsiveVisibilityControl'
);

addFilter(
	'editor.BlockEdit',
	'designsetgo/add-responsive-visibility-control',
	withResponsiveVisibilityControl,
	20
);

/**
 * Add visual styling in editor when block is hidden on any device
 * Shows block as dimmed with a subtle badge indicator
 */
const withResponsiveVisibilityIndicator = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const { attributes, className } = props;
			const { dsgHideOnDesktop, dsgHideOnTablet, dsgHideOnMobile } =
				attributes;

			// Determine which devices the block is hidden on
			const hiddenDevices = [];
			if (dsgHideOnDesktop) hiddenDevices.push('D');
			if (dsgHideOnTablet) hiddenDevices.push('T');
			if (dsgHideOnMobile) hiddenDevices.push('M');

			// Add indicator class if hidden on any device
			const updatedClassName = hiddenDevices.length
				? `${className || ''} dsg-has-responsive-visibility`.trim()
				: className;

			// Add data attribute with hidden devices for CSS styling
			const updatedProps = {
				...props,
				className: updatedClassName,
			};

			if (hiddenDevices.length > 0) {
				updatedProps['data-hidden-devices'] = hiddenDevices.join('');
			}

			return <BlockListBlock {...updatedProps} />;
		};
	},
	'withResponsiveVisibilityIndicator'
);

addFilter(
	'editor.BlockListBlock',
	'designsetgo/add-responsive-visibility-indicator',
	withResponsiveVisibilityIndicator,
	20
);

/**
 * Apply responsive visibility CSS classes on frontend
 *
 * @param {Object} props      - Block wrapper props
 * @param {Object} blockType  - Block type object
 * @param {Object} attributes - Block attributes
 * @return {Object} Modified props with responsive visibility classes
 */
function applyResponsiveVisibilityClasses(props, blockType, attributes) {
	const { dsgHideOnDesktop, dsgHideOnTablet, dsgHideOnMobile } = attributes;

	// Build array of CSS classes to apply
	const visibilityClasses = [];
	if (dsgHideOnDesktop) visibilityClasses.push('dsg-hide-desktop');
	if (dsgHideOnTablet) visibilityClasses.push('dsg-hide-tablet');
	if (dsgHideOnMobile) visibilityClasses.push('dsg-hide-mobile');

	// Only modify if we have classes to add
	if (visibilityClasses.length === 0) {
		return props;
	}

	// Add classes to existing className
	const existingClasses = props.className || '';
	const newClassName = `${existingClasses} ${visibilityClasses.join(' ')}`.trim();

	return {
		...props,
		className: newClassName,
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/apply-responsive-visibility-classes',
	applyResponsiveVisibilityClasses
);
