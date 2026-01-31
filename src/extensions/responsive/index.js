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
import { shouldExtendBlock } from '../../utils/should-extend-block';

/**
 * Add responsive visibility attributes to all blocks
 *
 * @param {Object} settings - Block settings
 * @param {string} name     - Block name
 * @return {Object} Modified block settings
 */
function addResponsiveVisibilityAttributes(settings, name) {
	// Check user exclusion list first
	if (!shouldExtendBlock(name)) {
		return settings;
	}
	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgoHideOnDesktop: {
				type: 'boolean',
				default: false,
			},
			dsgoHideOnTablet: {
				type: 'boolean',
				default: false,
			},
			dsgoHideOnMobile: {
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
			const { attributes, setAttributes, name } = props;
			const { dsgoHideOnDesktop, dsgoHideOnTablet, dsgoHideOnMobile } =
				attributes;

			// Check user exclusion list first
			if (!shouldExtendBlock(name)) {
				return <BlockEdit {...props} />;
			}

			return (
				<>
					<BlockEdit {...props} />
					<InspectorControls>
						<PanelBody
							title={__('Responsive Visibility', 'designsetgo')}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Hide on Desktop', 'designsetgo')}
								help={__(
									'Hide this block on desktop devices (≥1024px)',
									'designsetgo'
								)}
								checked={dsgoHideOnDesktop}
								onChange={(value) =>
									setAttributes({ dsgoHideOnDesktop: value })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Hide on Tablet', 'designsetgo')}
								help={__(
									'Hide this block on tablet devices (768px-1023px)',
									'designsetgo'
								)}
								checked={dsgoHideOnTablet}
								onChange={(value) =>
									setAttributes({ dsgoHideOnTablet: value })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Hide on Mobile', 'designsetgo')}
								help={__(
									'Hide this block on mobile devices (<768px)',
									'designsetgo'
								)}
								checked={dsgoHideOnMobile}
								onChange={(value) =>
									setAttributes({ dsgoHideOnMobile: value })
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
 * Shows a subtle badge indicator in the top-right corner
 */
const withResponsiveVisibilityIndicator = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const { attributes, className, wrapperProps = {}, name } = props;
			const { dsgoHideOnDesktop, dsgoHideOnTablet, dsgoHideOnMobile } =
				attributes;

			// Check user exclusion list first
			if (!shouldExtendBlock(name)) {
				return <BlockListBlock {...props} />;
			}

			// Determine which devices the block is hidden on
			const hiddenDevices = [];
			if (dsgoHideOnDesktop) {
				hiddenDevices.push('D');
			}
			if (dsgoHideOnTablet) {
				hiddenDevices.push('T');
			}
			if (dsgoHideOnMobile) {
				hiddenDevices.push('M');
			}

			// Only apply if we have hidden devices
			if (hiddenDevices.length === 0) {
				return <BlockListBlock {...props} />;
			}

			// Add indicator class
			const updatedClassName =
				`${className || ''} dsgo-has-responsive-visibility`.trim();

			// Create updated wrapper props with data attribute
			const updatedWrapperProps = {
				...wrapperProps,
				'data-hidden-devices': hiddenDevices.join(''),
			};

			return (
				<BlockListBlock
					{...props}
					className={updatedClassName}
					wrapperProps={updatedWrapperProps}
				/>
			);
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
	const { dsgoHideOnDesktop, dsgoHideOnTablet, dsgoHideOnMobile } =
		attributes;

	// Check user exclusion list first
	if (!shouldExtendBlock(blockType.name)) {
		return props;
	}

	// Build array of CSS classes to apply
	const visibilityClasses = [];
	if (dsgoHideOnDesktop) {
		visibilityClasses.push('dsgo-hide-desktop');
	}
	if (dsgoHideOnTablet) {
		visibilityClasses.push('dsgo-hide-tablet');
	}
	if (dsgoHideOnMobile) {
		visibilityClasses.push('dsgo-hide-mobile');
	}

	// Only modify if we have classes to add
	if (visibilityClasses.length === 0) {
		return props;
	}

	// Add classes to existing className
	const existingClasses = props.className || '';
	const newClassName =
		`${existingClasses} ${visibilityClasses.join(' ')}`.trim();

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
