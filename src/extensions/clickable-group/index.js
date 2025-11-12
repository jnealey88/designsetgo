/**
 * Clickable Group Extension
 *
 * Makes container blocks clickable with link functionality.
 * Works with core/group and custom container blocks (Section, Row, Grid).
 * Perfect for card designs where the entire container should be clickable.
 *
 * @package
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	ExternalLink,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import classnames from 'classnames';

// Import editor styles only (frontend styles imported in src/styles/style.scss)
import './editor.scss';

// Import frontend JavaScript
import './frontend';

/**
 * Blocks that support clickable functionality
 */
const SUPPORTED_BLOCKS = [
	'core/group',
	'designsetgo/section', // Section block (vertical stack)
	'designsetgo/row', // Row block (horizontal flex)
	'designsetgo/grid',
];

/**
 * Add link attributes to container blocks
 *
 * @param {Object} settings Block settings
 * @param {string} name     Block name
 * @return {Object} Modified settings
 */
function addLinkAttributes(settings, name) {
	if (!SUPPORTED_BLOCKS.includes(name)) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
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

addFilter(
	'blocks.registerBlockType',
	'designsetgo/clickable-group-attributes',
	addLinkAttributes
);

/**
 * Add link controls to container block inspector
 */
const withLinkControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name } = props;

		if (!SUPPORTED_BLOCKS.includes(name)) {
			return <BlockEdit {...props} />;
		}

		const { dsgLinkUrl, dsgLinkTarget, dsgLinkRel } = attributes;

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						title={__('Link Settings', 'designsetgo')}
						initialOpen={false}
					>
						<p className="components-base-control__help">
							{__(
								'Make the entire container clickable. Perfect for card designs.',
								'designsetgo'
							)}
						</p>
						<TextControl
							label={__('URL', 'designsetgo')}
							value={dsgLinkUrl}
							onChange={(value) =>
								setAttributes({
									dsgLinkUrl: value?.trim() || '',
								})
							}
							placeholder="https://example.com"
							help={__(
								'Enter the destination URL',
								'designsetgo'
							)}
							__nextHasNoMarginBottom
						/>
						{dsgLinkUrl && (
							<Fragment>
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
									__nextHasNoMarginBottom
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
									__nextHasNoMarginBottom
								/>
								<div style={{ marginTop: '16px' }}>
									<ExternalLink href={dsgLinkUrl}>
										{__('Preview link', 'designsetgo')}
									</ExternalLink>
								</div>
							</Fragment>
						)}
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withLinkControls');

addFilter(
	'editor.BlockEdit',
	'designsetgo/clickable-group-controls',
	withLinkControls
);

/**
 * Add clickable class to container blocks in editor
 */
const withClickableClass = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { name, attributes } = props;

		if (!SUPPORTED_BLOCKS.includes(name)) {
			return <BlockListBlock {...props} />;
		}

		const { dsgLinkUrl } = attributes;

		// Only add class if URL exists and is not empty after trimming
		const hasValidUrl = dsgLinkUrl && dsgLinkUrl.trim().length > 0;

		const classes = classnames({
			'dsg-clickable': hasValidUrl,
		});

		return <BlockListBlock {...props} className={classes} />;
	};
}, 'withClickableClass');

addFilter(
	'editor.BlockListBlock',
	'designsetgo/clickable-group-class',
	withClickableClass
);

/**
 * Add link data attributes and class to container blocks on save
 *
 * @param {Object} extraProps - The extra props to add to the block.
 * @param {Object} blockType  - The block type definition.
 * @param {Object} attributes - The block attributes.
 * @return {Object} Modified extra props.
 */
function addLinkSaveProps(extraProps, blockType, attributes) {
	if (!SUPPORTED_BLOCKS.includes(blockType.name)) {
		return extraProps;
	}

	const { dsgLinkUrl, dsgLinkTarget, dsgLinkRel } = attributes;

	// Only apply link functionality if URL exists and is not empty after trimming
	if (!dsgLinkUrl || dsgLinkUrl.trim().length === 0) {
		return extraProps;
	}

	// Add clickable class
	const classes = classnames(extraProps.className, 'dsg-clickable');

	// Add link data attributes for frontend rendering
	const linkProps = {
		'data-link-url': dsgLinkUrl,
	};

	if (dsgLinkTarget) {
		linkProps['data-link-target'] = '_blank';
	}

	if (dsgLinkRel) {
		linkProps['data-link-rel'] = dsgLinkRel;
	}

	return {
		...extraProps,
		...linkProps,
		className: classes,
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'designsetgo/clickable-group-save-props',
	addLinkSaveProps
);
