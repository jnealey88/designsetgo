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
import { shouldExtendBlock } from '../../utils/should-extend-block';

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
	// Check user exclusion list first
	if (!shouldExtendBlock(name)) {
		return settings;
	}

	if (!SUPPORTED_BLOCKS.includes(name)) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			dsgoLinkUrl: {
				type: 'string',
				default: '',
			},
			dsgoLinkTarget: {
				type: 'boolean',
				default: false,
			},
			dsgoLinkRel: {
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

		const { dsgoLinkUrl, dsgoLinkTarget, dsgoLinkRel } = attributes;

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
							value={dsgoLinkUrl}
							onChange={(value) =>
								setAttributes({
									dsgoLinkUrl: value?.trim() || '',
								})
							}
							placeholder="https://example.com"
							help={__(
								'Enter the destination URL',
								'designsetgo'
							)}
							__nextHasNoMarginBottom
						/>
						{dsgoLinkUrl && (
							<Fragment>
								<ToggleControl
									label={__('Open in new tab', 'designsetgo')}
									checked={dsgoLinkTarget}
									onChange={(value) =>
										setAttributes({ dsgoLinkTarget: value })
									}
									help={__(
										'Open link in a new browser tab',
										'designsetgo'
									)}
									__nextHasNoMarginBottom
								/>
								<TextControl
									label={__('Link Rel', 'designsetgo')}
									value={dsgoLinkRel}
									onChange={(value) =>
										setAttributes({ dsgoLinkRel: value })
									}
									placeholder="nofollow noopener"
									help={__(
										'Add rel attribute (e.g., nofollow, sponsored)',
										'designsetgo'
									)}
									__nextHasNoMarginBottom
								/>
								<div style={{ marginTop: '16px' }}>
									<ExternalLink href={dsgoLinkUrl}>
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

		const { dsgoLinkUrl } = attributes;

		// Only add class if URL exists and is not empty after trimming
		const hasValidUrl = dsgoLinkUrl && dsgoLinkUrl.trim().length > 0;

		const classes = classnames({
			'dsgo-clickable': hasValidUrl,
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

	const { dsgoLinkUrl, dsgoLinkTarget, dsgoLinkRel } = attributes;

	// Only apply link functionality if URL exists and is not empty after trimming
	if (!dsgoLinkUrl || dsgoLinkUrl.trim().length === 0) {
		return extraProps;
	}

	// Add clickable class
	const classes = classnames(extraProps.className, 'dsgo-clickable');

	// Add link data attributes for frontend rendering
	const linkProps = {
		'data-link-url': dsgoLinkUrl,
	};

	if (dsgoLinkTarget) {
		linkProps['data-link-target'] = '_blank';
	}

	if (dsgoLinkRel) {
		linkProps['data-link-rel'] = dsgoLinkRel;
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
